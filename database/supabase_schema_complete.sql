-- ==========================================
-- AquaVision Pro - Schéma SQL COMPLET
-- Version 2.1 - Toutes les tables incluses
-- ==========================================

-- ==========================================
-- NETTOYAGE : Supprimer toutes les tables existantes
-- ==========================================

DROP TABLE IF EXISTS public.biometric_samples CASCADE;
DROP TABLE IF EXISTS public.daily_reports CASCADE;
DROP TABLE IF EXISTS public.production_targets CASCADE;
DROP TABLE IF EXISTS public.feed_inventory CASCADE;
DROP TABLE IF EXISTS public.activity_log CASCADE;
DROP TABLE IF EXISTS public.alerts CASCADE;
DROP TABLE IF EXISTS public.cages CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- ==========================================
-- TABLE 1 : Profils Utilisateurs
-- ==========================================

CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'technicien')) DEFAULT 'technicien',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- TABLE 2 : Cages
-- ==========================================

CREATE TABLE public.cages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    cage_number TEXT UNIQUE NOT NULL,
    location TEXT,
    capacity INTEGER,
    species TEXT,
    stocking_date DATE,
    initial_count INTEGER NOT NULL DEFAULT 0,
    alive_count INTEGER NOT NULL DEFAULT 0,
    total_dead INTEGER DEFAULT 0,
    status TEXT CHECK (status IN ('active', 'inactive', 'maintenance')) DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES public.profiles(id)
);

-- ==========================================
-- TABLE 3 : Rapports Journaliers (OPTIMISÉ)
-- ==========================================

CREATE TABLE public.daily_reports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    cage_id UUID REFERENCES public.cages(id) ON DELETE CASCADE NOT NULL,
    report_date DATE NOT NULL,

    -- Donnees de population
    alive_count INTEGER NOT NULL,
    new_dead INTEGER DEFAULT 0,
    dead_reason TEXT,

    -- Donnees biometriques
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

    -- Donnees environnementales
    water_temp DECIMAL(4,1),
    ambient_temp DECIMAL(4,1),
    ph DECIMAL(3,1),
    oxygen DECIMAL(4,1),
    salinity DECIMAL(4,1),
    turbidity TEXT CHECK (turbidity IN ('claire', 'legere', 'trouble', 'tres trouble')),
    water_color TEXT,
    ammonia DECIMAL(5,2),
    nitrite DECIMAL(5,2),
    nitrate DECIMAL(5,2),

    -- Donnees alimentation
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

    -- Metadonnees
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES public.profiles(id) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID REFERENCES public.profiles(id),
    entry_duration_seconds INTEGER,

    -- Contrainte unique
    UNIQUE(cage_id, report_date)
);

-- ==========================================
-- TABLE 4 : Echantillons Biometriques
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

-- ==========================================
-- TABLE 5 : Inventaire Aliments
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
-- TABLE 6 : Objectifs de Production
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
-- TABLE 7 : Alertes
-- ==========================================

CREATE TABLE public.alerts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    cage_id UUID REFERENCES public.cages(id) ON DELETE CASCADE,
    alert_type TEXT NOT NULL,
    severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
    message TEXT NOT NULL,
    is_resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by UUID REFERENCES public.profiles(id),
    resolution_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- TABLE 8 : Journal Activite
-- ==========================================

CREATE TABLE public.activity_log (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id UUID,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- INDEX pour Performance
-- ==========================================

CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_cages_status ON public.cages(status);
CREATE INDEX idx_daily_reports_cage_date ON public.daily_reports(cage_id, report_date DESC);
CREATE INDEX idx_daily_reports_date ON public.daily_reports(report_date DESC);
CREATE INDEX idx_daily_reports_created_by ON public.daily_reports(created_by);
CREATE INDEX idx_biometric_samples_report ON public.biometric_samples(report_id);
CREATE INDEX idx_biometric_samples_cage_date ON public.biometric_samples(cage_id, sample_date DESC);
CREATE INDEX idx_alerts_cage ON public.alerts(cage_id);
CREATE INDEX idx_alerts_resolved ON public.alerts(is_resolved);
CREATE INDEX idx_activity_log_user ON public.activity_log(user_id);
CREATE INDEX idx_activity_log_date ON public.activity_log(created_at DESC);

-- ==========================================
-- FONCTIONS
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

-- Fonction: Calculer le taux de croissance quotidien
CREATE OR REPLACE FUNCTION calculate_daily_growth_rate(
    cage_id_param UUID,
    report_date_param DATE
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
-- TRIGGERS
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

-- Trigger: Mettre a jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cages_updated_at BEFORE UPDATE ON public.cages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_daily_reports_updated_at BEFORE UPDATE ON public.daily_reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_feed_inventory_updated_at BEFORE UPDATE ON public.feed_inventory FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- ROW LEVEL SECURITY
-- ==========================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biometric_samples ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feed_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- Politiques pour profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Politiques pour cages
CREATE POLICY "Everyone can view cages" ON public.cages FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can manage cages" ON public.cages FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Politiques pour daily_reports
CREATE POLICY "Everyone can view reports" ON public.daily_reports FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Everyone can create reports" ON public.daily_reports FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND created_by = auth.uid());
CREATE POLICY "Users can update own reports" ON public.daily_reports FOR UPDATE USING (created_by = auth.uid());
CREATE POLICY "Admins can update all reports" ON public.daily_reports FOR UPDATE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Politiques pour biometric_samples
CREATE POLICY "Everyone can view samples" ON public.biometric_samples FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Everyone can create samples" ON public.biometric_samples FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Politiques pour feed_inventory
CREATE POLICY "Everyone can view inventory" ON public.feed_inventory FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins manage inventory" ON public.feed_inventory FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Politiques pour production_targets
CREATE POLICY "Everyone can view targets" ON public.production_targets FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins manage targets" ON public.production_targets FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Politiques pour alerts
CREATE POLICY "Everyone can view alerts" ON public.alerts FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Everyone can create alerts" ON public.alerts FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can manage alerts" ON public.alerts FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Politiques pour activity_log
CREATE POLICY "Users can view own activity" ON public.activity_log FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admins can view all activity" ON public.activity_log FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Everyone can create activity" ON public.activity_log FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- ==========================================
-- VUES ANALYTICS
-- ==========================================

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

CREATE OR REPLACE VIEW health_alerts AS
SELECT
    dr.cage_id,
    c.cage_number,
    dr.report_date,
    CASE
        WHEN dr.oxygen < 3 THEN 'Oxygene Critique'
        WHEN dr.oxygen < 5 THEN 'Oxygene Faible'
        WHEN dr.ph < 6.0 OR dr.ph > 9.0 THEN 'pH Critique'
        WHEN dr.ammonia > 0.5 THEN 'Ammoniaque Eleve'
        WHEN dr.health_score <= 2 THEN 'Sante Mauvaise'
        WHEN dr.parasites_detected THEN 'Parasites Detectes'
        WHEN dr.daily_growth_rate < 0 THEN 'Croissance Negative'
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
-- FONCTION TRIGGER POUR CREER PROFILE AUTOMATIQUEMENT
-- ==========================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        COALESCE(NEW.raw_user_meta_data->>'role', 'technicien')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- TERMINE !
-- ==========================================

-- Verification finale
SELECT
    'Tables creees:' as status,
    COUNT(*) as count
FROM information_schema.tables
WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
