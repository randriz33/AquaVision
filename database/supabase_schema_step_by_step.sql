-- ==========================================
-- AquaVision Pro - Schéma Optimisé (Étape par Étape)
-- Version 2.1 - Exécution pas à pas
-- ==========================================

-- ==========================================
-- ÉTAPE 1 : Supprimer les anciennes tables si elles existent
-- ==========================================

DROP TABLE IF EXISTS public.biometric_samples CASCADE;
DROP TABLE IF EXISTS public.daily_reports CASCADE;
DROP TABLE IF EXISTS public.production_targets CASCADE;
DROP TABLE IF EXISTS public.feed_inventory CASCADE;

-- ==========================================
-- ÉTAPE 2 : Créer la table daily_reports avec TOUS les nouveaux champs
-- ==========================================

CREATE TABLE public.daily_reports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    cage_id UUID REFERENCES public.cages(id) ON DELETE CASCADE NOT NULL,
    report_date DATE NOT NULL,

    -- Données de population
    alive_count INTEGER NOT NULL,
    new_dead INTEGER DEFAULT 0,
    dead_reason TEXT,

    -- Données biométriques
    sample_size INTEGER,
    average_weight_g DECIMAL(8,2),
    min_weight_g DECIMAL(8,2),
    max_weight_g DECIMAL(8,2),
    total_biomass_kg DECIMAL(10,2),
    average_length_cm DECIMAL(6,2),
    min_length_cm DECIMAL(6,2),
    max_length_cm DECIMAL(6,2),
    health_score INTEGER CHECK (health_score BETWEEN 1 AND 5),
    disease_signs TEXT,
    parasites_detected BOOLEAN DEFAULT FALSE,

    -- Données environnementales
    water_temp DECIMAL(4,1),
    ambient_temp DECIMAL(4,1),
    ph DECIMAL(3,1),
    oxygen DECIMAL(4,1),
    salinity DECIMAL(4,1),
    turbidity TEXT CHECK (turbidity IN ('claire', 'légère', 'trouble', 'très trouble')),
    water_color TEXT,
    ammonia DECIMAL(5,2),
    nitrite DECIMAL(5,2),
    nitrate DECIMAL(5,2),

    -- Données d'alimentation
    feeding_kg DECIMAL(6,2),
    feeding_time TIME,
    feeding_times_per_day INTEGER,
    feed_type TEXT,
    feed_acceptance TEXT CHECK (feed_acceptance IN ('excellent', 'bon', 'moyen', 'faible', 'refus')),
    leftover_feed TEXT CHECK (leftover_feed IN ('aucun', 'peu', 'moyen', 'beaucoup')),
    fcr DECIMAL(5,2),
    daily_growth_rate DECIMAL(5,2),

    -- Observations
    weather_conditions TEXT,
    water_quality TEXT CHECK (water_quality IN ('excellent', 'good', 'fair', 'poor')),
    fish_behavior TEXT CHECK (fish_behavior IN ('normal', 'stressed', 'lethargic', 'aggressive', 'hyperactive')),
    swimming_pattern TEXT,
    feeding_behavior TEXT,

    -- Maintenance
    maintenance_done BOOLEAN DEFAULT FALSE,
    maintenance_type TEXT,
    treatments_applied TEXT,
    net_cleaning BOOLEAN DEFAULT FALSE,
    equipment_check BOOLEAN DEFAULT FALSE,

    -- Incidents
    has_incident BOOLEAN DEFAULT FALSE,
    incident_type TEXT,
    incident_description TEXT,
    incident_severity TEXT CHECK (incident_severity IN ('low', 'medium', 'high', 'critical')),

    -- Remarques
    remarks TEXT,
    technician_notes TEXT,
    action_required TEXT,
    photos_urls TEXT[],

    -- Métadonnées
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES public.profiles(id) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID REFERENCES public.profiles(id),
    entry_duration_seconds INTEGER,

    -- Contrainte : un rapport par cage par jour
    UNIQUE(cage_id, report_date)
);

-- ==========================================
-- ÉTAPE 3 : Créer les autres tables
-- ==========================================

CREATE TABLE public.biometric_samples (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    report_id UUID REFERENCES public.daily_reports(id) ON DELETE CASCADE,
    cage_id UUID REFERENCES public.cages(id) ON DELETE CASCADE,
    sample_date DATE NOT NULL,
    fish_number INTEGER,
    weight_g DECIMAL(8,2),
    length_cm DECIMAL(6,2),
    girth_cm DECIMAL(6,2),
    condition_factor DECIMAL(4,2),
    health_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES public.profiles(id)
);

CREATE TABLE public.feed_inventory (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    feed_type TEXT NOT NULL,
    feed_brand TEXT,
    protein_percentage DECIMAL(4,1),
    fat_percentage DECIMAL(4,1),
    purchase_date DATE,
    expiry_date DATE,
    quantity_kg DECIMAL(10,2),
    cost_per_kg DECIMAL(10,2),
    supplier TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.production_targets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    cage_id UUID REFERENCES public.cages(id) ON DELETE CASCADE,
    target_date DATE,
    target_weight_g DECIMAL(8,2),
    target_survival_rate DECIMAL(5,2),
    target_fcr DECIMAL(4,2),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES public.profiles(id)
);

-- ==========================================
-- ÉTAPE 4 : Créer les index
-- ==========================================

CREATE INDEX idx_daily_reports_cage_date ON public.daily_reports(cage_id, report_date DESC);
CREATE INDEX idx_daily_reports_date ON public.daily_reports(report_date DESC);
CREATE INDEX idx_daily_reports_created_by ON public.daily_reports(created_by);
CREATE INDEX idx_biometric_samples_report ON public.biometric_samples(report_id);
CREATE INDEX idx_biometric_samples_cage_date ON public.biometric_samples(cage_id, sample_date DESC);

-- ==========================================
-- ÉTAPE 5 : Créer les fonctions (SANS ERREUR DE MOT-CLÉ)
-- ==========================================

-- Fonction: Calculer le facteur de condition (K)
CREATE OR REPLACE FUNCTION calculate_condition_factor(
    weight_g DECIMAL,
    length_cm DECIMAL
)
RETURNS DECIMAL AS $$
BEGIN
    IF length_cm > 0 THEN
        RETURN (weight_g / POWER(length_cm, 3)) * 100;
    ELSE
        RETURN NULL;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Fonction: Calculer le taux de croissance quotidien (PARAMÈTRE CORRIGÉ)
CREATE OR REPLACE FUNCTION calculate_daily_growth_rate(
    cage_id_param UUID,
    report_date_param DATE  -- CORRIGÉ : n'utilise plus 'current_date'
)
RETURNS DECIMAL AS $$
DECLARE
    current_weight DECIMAL;
    previous_weight DECIMAL;
BEGIN
    SELECT average_weight_g INTO current_weight
    FROM daily_reports
    WHERE cage_id = cage_id_param AND report_date = report_date_param;

    SELECT average_weight_g INTO previous_weight
    FROM daily_reports
    WHERE cage_id = cage_id_param AND report_date < report_date_param
    ORDER BY report_date DESC
    LIMIT 1;

    IF previous_weight > 0 AND current_weight IS NOT NULL THEN
        RETURN ((current_weight - previous_weight) / previous_weight) * 100;
    ELSE
        RETURN NULL;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Fonction: Calculer FCR
CREATE OR REPLACE FUNCTION calculate_fcr(
    cage_id_param UUID,
    start_date DATE,
    end_date DATE
)
RETURNS DECIMAL AS $$
DECLARE
    total_feed DECIMAL;
    weight_gain DECIMAL;
    initial_biomass DECIMAL;
    final_biomass DECIMAL;
BEGIN
    SELECT SUM(feeding_kg) INTO total_feed
    FROM daily_reports
    WHERE cage_id = cage_id_param
      AND report_date BETWEEN start_date AND end_date;

    SELECT total_biomass_kg INTO initial_biomass
    FROM daily_reports
    WHERE cage_id = cage_id_param AND report_date = start_date;

    SELECT total_biomass_kg INTO final_biomass
    FROM daily_reports
    WHERE cage_id = cage_id_param AND report_date = end_date;

    weight_gain := final_biomass - initial_biomass;

    IF weight_gain > 0 THEN
        RETURN total_feed / weight_gain;
    ELSE
        RETURN NULL;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- ÉTAPE 6 : Créer les triggers
-- ==========================================

-- Trigger: Calculer automatiquement la biomasse totale
CREATE OR REPLACE FUNCTION calculate_total_biomass()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.average_weight_g IS NOT NULL AND NEW.alive_count IS NOT NULL THEN
        NEW.total_biomass_kg := (NEW.average_weight_g * NEW.alive_count) / 1000;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_biomass
    BEFORE INSERT OR UPDATE ON public.daily_reports
    FOR EACH ROW
    EXECUTE FUNCTION calculate_total_biomass();

-- Trigger: Calculer le taux de croissance quotidien
CREATE OR REPLACE FUNCTION auto_calculate_growth_rate()
RETURNS TRIGGER AS $$
BEGIN
    NEW.daily_growth_rate := calculate_daily_growth_rate(NEW.cage_id, NEW.report_date);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_growth
    BEFORE INSERT OR UPDATE ON public.daily_reports
    FOR EACH ROW
    EXECUTE FUNCTION auto_calculate_growth_rate();

-- ==========================================
-- ÉTAPE 7 : Activer Row Level Security
-- ==========================================

ALTER TABLE public.daily_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biometric_samples ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feed_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_targets ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- ÉTAPE 8 : Créer les politiques RLS
-- ==========================================

-- Politiques pour daily_reports
CREATE POLICY "Tous peuvent voir les rapports"
    ON public.daily_reports FOR SELECT
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "Techniciens et admins peuvent créer"
    ON public.daily_reports FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users modifient leurs rapports"
    ON public.daily_reports FOR UPDATE
    USING (created_by = auth.uid());

CREATE POLICY "Admins modifient tous"
    ON public.daily_reports FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Politiques similaires pour les autres tables
CREATE POLICY "Tous peuvent voir biometric_samples"
    ON public.biometric_samples FOR SELECT
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "Tous peuvent créer biometric_samples"
    ON public.biometric_samples FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Tous peuvent voir feed_inventory"
    ON public.feed_inventory FOR SELECT
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins gèrent feed_inventory"
    ON public.feed_inventory FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Tous peuvent voir production_targets"
    ON public.production_targets FOR SELECT
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins gèrent production_targets"
    ON public.production_targets FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ==========================================
-- ÉTAPE 9 : Créer les vues analytics
-- ==========================================

-- Vue: Résumé de croissance par cage
CREATE OR REPLACE VIEW growth_summary AS
SELECT
    dr.cage_id,
    c.cage_number,
    MIN(dr.report_date) as first_measurement,
    MAX(dr.report_date) as last_measurement,
    (SELECT average_weight_g FROM daily_reports WHERE cage_id = dr.cage_id ORDER BY report_date LIMIT 1) as initial_weight,
    (SELECT average_weight_g FROM daily_reports WHERE cage_id = dr.cage_id ORDER BY report_date DESC LIMIT 1) as current_weight,
    AVG(dr.fcr) as average_fcr,
    SUM(dr.new_dead) as total_mortality,
    (SELECT total_biomass_kg FROM daily_reports WHERE cage_id = dr.cage_id ORDER BY report_date DESC LIMIT 1) as current_biomass
FROM public.daily_reports dr
JOIN public.cages c ON c.id = dr.cage_id
GROUP BY dr.cage_id, c.cage_number;

-- Vue: Alertes de santé
CREATE OR REPLACE VIEW health_alerts AS
SELECT
    dr.cage_id,
    c.cage_number,
    dr.report_date,
    CASE
        WHEN dr.oxygen < 3 THEN 'Oxygène Critique'
        WHEN dr.oxygen < 5 THEN 'Oxygène Faible'
        WHEN dr.ph < 6.0 OR dr.ph > 9.0 THEN 'pH Critique'
        WHEN dr.ammonia > 0.5 THEN 'Ammoniaque Élevé'
        WHEN dr.health_score <= 2 THEN 'Santé Mauvaise'
        WHEN dr.parasites_detected THEN 'Parasites Détectés'
        WHEN dr.daily_growth_rate < 0 THEN 'Croissance Négative'
        ELSE 'OK'
    END as alert_type,
    dr.remarks
FROM public.daily_reports dr
JOIN public.cages c ON c.id = dr.cage_id
WHERE dr.oxygen < 5
   OR dr.ph < 6.0
   OR dr.ph > 9.0
   OR dr.ammonia > 0.5
   OR dr.health_score <= 2
   OR dr.parasites_detected
   OR dr.daily_growth_rate < 0
ORDER BY dr.report_date DESC;

-- ==========================================
-- ETAPE 10 : Commentaires (Optionnel)
-- ==========================================

COMMENT ON TABLE public.daily_reports IS 'Rapports journaliers optimises avec metriques biometriques et de croissance';
COMMENT ON COLUMN public.daily_reports.average_weight_g IS 'Poids moyen des poissons en grammes (echantillon)';
COMMENT ON COLUMN public.daily_reports.average_length_cm IS 'Longueur moyenne des poissons en cm';
COMMENT ON COLUMN public.daily_reports.fcr IS 'Food Conversion Ratio - Indicateur efficacite alimentaire';
COMMENT ON COLUMN public.daily_reports.daily_growth_rate IS 'Taux de croissance quotidien en pourcentage';
COMMENT ON TABLE public.biometric_samples IS 'Donnees biometriques detaillees par poisson echantillonne';

-- ==========================================
-- TERMINE !
-- ==========================================

-- Verification: Afficher toutes les tables creees
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;
