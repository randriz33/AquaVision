-- ==========================================
-- AquaVision Pro - Schéma Optimisé avec Métriques de Croissance
-- Version 2.1
-- ==========================================

-- Table des rapports journaliers AMÉLIORÉE avec nouvelles métriques
DROP TABLE IF EXISTS public.daily_reports CASCADE;

CREATE TABLE public.daily_reports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    cage_id UUID REFERENCES public.cages(id) ON DELETE CASCADE NOT NULL,
    report_date DATE NOT NULL,

    -- ============================================
    -- DONNÉES DE POPULATION
    -- ============================================
    alive_count INTEGER NOT NULL,
    new_dead INTEGER DEFAULT 0,
    dead_reason TEXT, -- Cause de mortalité (maladie, prédation, stress, etc.)

    -- ============================================
    -- DONNÉES BIOMÉTRIQUES (Nouveaux champs)
    -- ============================================
    -- Échantillonnage (mesures sur un échantillon représentatif)
    sample_size INTEGER, -- Nombre de poissons échantillonnés

    -- Poids
    average_weight_g DECIMAL(8,2), -- Poids moyen en grammes
    min_weight_g DECIMAL(8,2), -- Poids minimum observé
    max_weight_g DECIMAL(8,2), -- Poids maximum observé
    total_biomass_kg DECIMAL(10,2), -- Biomasse totale estimée

    -- Taille
    average_length_cm DECIMAL(6,2), -- Longueur moyenne en cm
    min_length_cm DECIMAL(6,2), -- Longueur minimum
    max_length_cm DECIMAL(6,2), -- Longueur maximum

    -- État de santé
    health_score INTEGER CHECK (health_score BETWEEN 1 AND 5), -- 1=Mauvais, 5=Excellent
    disease_signs TEXT, -- Signes de maladie observés
    parasites_detected BOOLEAN DEFAULT FALSE,

    -- ============================================
    -- DONNÉES ENVIRONNEMENTALES
    -- ============================================
    water_temp DECIMAL(4,1),
    ambient_temp DECIMAL(4,1),
    ph DECIMAL(3,1),
    oxygen DECIMAL(4,1), -- mg/L
    salinity DECIMAL(4,1), -- PSU (pour eau salée/saumâtre)
    turbidity TEXT CHECK (turbidity IN ('claire', 'légère', 'trouble', 'très trouble')),
    water_color TEXT,
    ammonia DECIMAL(5,2), -- mg/L (toxique pour les poissons)
    nitrite DECIMAL(5,2), -- mg/L (toxique)
    nitrate DECIMAL(5,2), -- mg/L

    -- ============================================
    -- DONNÉES D'ALIMENTATION
    -- ============================================
    feeding_kg DECIMAL(6,2), -- Quantité distribuée
    feeding_time TIME,
    feeding_times_per_day INTEGER, -- Nombre de distributions
    feed_type TEXT, -- Type d'aliment utilisé
    feed_acceptance TEXT CHECK (feed_acceptance IN ('excellent', 'bon', 'moyen', 'faible', 'refus')),
    leftover_feed TEXT CHECK (leftover_feed IN ('aucun', 'peu', 'moyen', 'beaucoup')),

    -- Calculs automatiques
    fcr DECIMAL(5,2), -- Food Conversion Ratio (calculé)
    daily_growth_rate DECIMAL(5,2), -- Taux de croissance quotidien (%)

    -- ============================================
    -- OBSERVATIONS ENVIRONNEMENT
    -- ============================================
    weather_conditions TEXT,
    water_quality TEXT CHECK (water_quality IN ('excellent', 'good', 'fair', 'poor')),
    fish_behavior TEXT CHECK (fish_behavior IN ('normal', 'stressed', 'lethargic', 'aggressive', 'hyperactive')),
    swimming_pattern TEXT, -- Pattern de nage observé
    feeding_behavior TEXT, -- Comportement pendant l'alimentation

    -- ============================================
    -- MAINTENANCE ET INTERVENTIONS
    -- ============================================
    maintenance_done BOOLEAN DEFAULT FALSE,
    maintenance_type TEXT, -- Type de maintenance effectuée
    treatments_applied TEXT, -- Traitements appliqués (médicaments, etc.)
    net_cleaning BOOLEAN DEFAULT FALSE,
    equipment_check BOOLEAN DEFAULT FALSE,

    -- ============================================
    -- INCIDENTS
    -- ============================================
    has_incident BOOLEAN DEFAULT FALSE,
    incident_type TEXT,
    incident_description TEXT,
    incident_severity TEXT CHECK (incident_severity IN ('low', 'medium', 'high', 'critical')),

    -- ============================================
    -- REMARQUES ET NOTES
    -- ============================================
    remarks TEXT,
    technician_notes TEXT, -- Notes techniques détaillées
    action_required TEXT, -- Actions à prévoir

    -- ============================================
    -- PHOTOS ET DOCUMENTATION
    -- ============================================
    photos_urls TEXT[], -- URLs des photos prises

    -- ============================================
    -- MÉTADONNÉES
    -- ============================================
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES public.profiles(id) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID REFERENCES public.profiles(id),

    -- Durée de saisie (pour analytics)
    entry_duration_seconds INTEGER,

    -- Un rapport par cage par jour
    UNIQUE(cage_id, report_date)
);

-- ==========================================
-- Table des Échantillonnages Biométriques
-- ==========================================
CREATE TABLE public.biometric_samples (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    report_id UUID REFERENCES public.daily_reports(id) ON DELETE CASCADE,
    cage_id UUID REFERENCES public.cages(id) ON DELETE CASCADE,
    sample_date DATE NOT NULL,

    -- Données individuelles de poissons échantillonnés
    fish_number INTEGER, -- Numéro du poisson dans l'échantillon
    weight_g DECIMAL(8,2),
    length_cm DECIMAL(6,2),
    girth_cm DECIMAL(6,2), -- Tour de taille
    condition_factor DECIMAL(4,2), -- Facteur de condition (K)
    health_notes TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES public.profiles(id)
);

-- ==========================================
-- Table des Stocks d'Aliments
-- ==========================================
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

-- ==========================================
-- Table des Objectifs de Production
-- ==========================================
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
-- Indexes pour Performance
-- ==========================================
CREATE INDEX idx_daily_reports_cage_date ON public.daily_reports(cage_id, report_date DESC);
CREATE INDEX idx_daily_reports_date ON public.daily_reports(report_date DESC);
CREATE INDEX idx_daily_reports_created_by ON public.daily_reports(created_by);
CREATE INDEX idx_biometric_samples_report ON public.biometric_samples(report_id);
CREATE INDEX idx_biometric_samples_cage_date ON public.biometric_samples(cage_id, sample_date DESC);

-- ==========================================
-- Vues pour Analytics
-- ==========================================

-- Vue: Résumé de croissance par cage
CREATE OR REPLACE VIEW growth_summary AS
SELECT
    dr.cage_id,
    c.cage_number,
    MIN(dr.report_date) as first_measurement,
    MAX(dr.report_date) as last_measurement,

    -- Poids
    (SELECT average_weight_g FROM daily_reports WHERE cage_id = dr.cage_id ORDER BY report_date LIMIT 1) as initial_weight,
    (SELECT average_weight_g FROM daily_reports WHERE cage_id = dr.cage_id ORDER BY report_date DESC LIMIT 1) as current_weight,

    -- Calculs de croissance
    CASE
        WHEN (SELECT average_weight_g FROM daily_reports WHERE cage_id = dr.cage_id ORDER BY report_date LIMIT 1) > 0
        THEN ((SELECT average_weight_g FROM daily_reports WHERE cage_id = dr.cage_id ORDER BY report_date DESC LIMIT 1) -
              (SELECT average_weight_g FROM daily_reports WHERE cage_id = dr.cage_id ORDER BY report_date LIMIT 1)) /
             (SELECT average_weight_g FROM daily_reports WHERE cage_id = dr.cage_id ORDER BY report_date LIMIT 1) * 100
        ELSE 0
    END as growth_percentage,

    -- FCR moyen
    AVG(dr.fcr) as average_fcr,

    -- Mortalité
    SUM(dr.new_dead) as total_mortality,

    -- Biomasse
    (SELECT total_biomass_kg FROM daily_reports WHERE cage_id = dr.cage_id ORDER BY report_date DESC LIMIT 1) as current_biomass

FROM public.daily_reports dr
JOIN public.cages c ON c.id = dr.cage_id
GROUP BY dr.cage_id, c.cage_number;

-- Vue: Performance par technicien
CREATE OR REPLACE VIEW technician_performance AS
SELECT
    p.id,
    p.full_name,
    COUNT(DISTINCT dr.id) as total_reports,
    AVG(dr.entry_duration_seconds) as avg_entry_time,
    COUNT(CASE WHEN dr.has_incident THEN 1 END) as incidents_reported,
    MAX(dr.created_at) as last_report_date
FROM public.profiles p
LEFT JOIN public.daily_reports dr ON dr.created_by = p.id
WHERE p.role = 'technicien'
GROUP BY p.id, p.full_name;

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
-- Fonctions Utilitaires
-- ==========================================

-- Fonction: Calculer le facteur de condition (K)
CREATE OR REPLACE FUNCTION calculate_condition_factor(
    weight_g DECIMAL,
    length_cm DECIMAL
)
RETURNS DECIMAL AS $$
BEGIN
    -- K = (Poids en g / (Longueur en cm)³) × 100
    IF length_cm > 0 THEN
        RETURN (weight_g / POWER(length_cm, 3)) * 100;
    ELSE
        RETURN NULL;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Fonction: Calculer le taux de croissance quotidien
CREATE OR REPLACE FUNCTION calculate_daily_growth_rate(
    cage_id_param UUID,
    current_date DATE
)
RETURNS DECIMAL AS $$
DECLARE
    current_weight DECIMAL;
    previous_weight DECIMAL;
    days_diff INTEGER;
BEGIN
    -- Poids actuel
    SELECT average_weight_g INTO current_weight
    FROM daily_reports
    WHERE cage_id = cage_id_param AND report_date = current_date;

    -- Poids précédent
    SELECT average_weight_g INTO previous_weight
    FROM daily_reports
    WHERE cage_id = cage_id_param AND report_date < current_date
    ORDER BY report_date DESC
    LIMIT 1;

    IF previous_weight > 0 AND current_weight IS NOT NULL THEN
        RETURN ((current_weight - previous_weight) / previous_weight) * 100;
    ELSE
        RETURN NULL;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Fonction: Calculer FCR (Food Conversion Ratio)
-- FCR = Nourriture donnée (kg) / Gain de poids (kg)
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
    -- Total aliment distribué
    SELECT SUM(feeding_kg) INTO total_feed
    FROM daily_reports
    WHERE cage_id = cage_id_param
      AND report_date BETWEEN start_date AND end_date;

    -- Biomasse initiale
    SELECT total_biomass_kg INTO initial_biomass
    FROM daily_reports
    WHERE cage_id = cage_id_param AND report_date = start_date;

    -- Biomasse finale
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
-- Triggers
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
-- Row Level Security
-- ==========================================

ALTER TABLE public.daily_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biometric_samples ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feed_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_targets ENABLE ROW LEVEL SECURITY;

-- Politiques identiques aux tables existantes
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

-- ==========================================
-- Données d'Exemple (Optionnel)
-- ==========================================
/*
INSERT INTO public.feed_inventory (feed_type, feed_brand, protein_percentage, fat_percentage, quantity_kg, cost_per_kg)
VALUES
    ('Granulés 3mm', 'AquaFeed Pro', 45.0, 12.0, 500.0, 2.50),
    ('Granulés 5mm', 'AquaFeed Pro', 42.0, 10.0, 300.0, 2.30);
*/

-- ==========================================
-- Commentaires
-- ==========================================
COMMENT ON TABLE public.daily_reports IS 'Rapports journaliers optimisés avec métriques biométriques et de croissance';
COMMENT ON COLUMN public.daily_reports.average_weight_g IS 'Poids moyen des poissons en grammes (échantillon)';
COMMENT ON COLUMN public.daily_reports.average_length_cm IS 'Longueur moyenne des poissons en cm';
COMMENT ON COLUMN public.daily_reports.fcr IS 'Food Conversion Ratio - Indicateur d\'efficacité alimentaire';
COMMENT ON COLUMN public.daily_reports.daily_growth_rate IS 'Taux de croissance quotidien en pourcentage';
COMMENT ON TABLE public.biometric_samples IS 'Données biométriques détaillées par poisson échantillonné';
