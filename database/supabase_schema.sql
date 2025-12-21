-- ==========================================
-- AquaVision Pro - Supabase Database Schema
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- Users Profiles Table (extends auth.users)
-- ==========================================
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'technicien')),
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
    ON public.profiles FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ==========================================
-- Cages Table
-- ==========================================
CREATE TABLE public.cages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    cage_number INTEGER UNIQUE NOT NULL,
    initial_count INTEGER NOT NULL,
    alive_count INTEGER NOT NULL,
    total_dead INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
    location TEXT,
    installation_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES public.profiles(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID REFERENCES public.profiles(id)
);

-- Enable RLS
ALTER TABLE public.cages ENABLE ROW LEVEL SECURITY;

-- Policies for cages
CREATE POLICY "Everyone can view active cages"
    ON public.cages FOR SELECT
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can insert cages"
    ON public.cages FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can update cages"
    ON public.cages FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can delete cages"
    ON public.cages FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ==========================================
-- Daily Reports Table (Rapports Journaliers)
-- ==========================================
CREATE TABLE public.daily_reports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    cage_id UUID REFERENCES public.cages(id) ON DELETE CASCADE NOT NULL,
    report_date DATE NOT NULL,

    -- Population data
    alive_count INTEGER NOT NULL,
    new_dead INTEGER DEFAULT 0,

    -- Environmental data
    water_temp DECIMAL(4,1),
    ambient_temp DECIMAL(4,1),
    ph DECIMAL(3,1),
    oxygen DECIMAL(4,1),

    -- Feeding data
    feeding_kg DECIMAL(6,2),
    feeding_time TIME,

    -- Observations
    weather_conditions TEXT,
    water_quality TEXT CHECK (water_quality IN ('excellent', 'good', 'fair', 'poor')),
    fish_behavior TEXT CHECK (fish_behavior IN ('normal', 'stressed', 'lethargic', 'aggressive')),
    remarks TEXT,

    -- Incidents
    has_incident BOOLEAN DEFAULT FALSE,
    incident_type TEXT,
    incident_description TEXT,

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES public.profiles(id) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID REFERENCES public.profiles(id),

    -- Ensure one report per cage per day
    UNIQUE(cage_id, report_date)
);

-- Enable RLS
ALTER TABLE public.daily_reports ENABLE ROW LEVEL SECURITY;

-- Policies for daily_reports
CREATE POLICY "Everyone can view reports"
    ON public.daily_reports FOR SELECT
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "Techniciens and admins can insert reports"
    ON public.daily_reports FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own reports"
    ON public.daily_reports FOR UPDATE
    USING (created_by = auth.uid());

CREATE POLICY "Admins can update all reports"
    ON public.daily_reports FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can delete reports"
    ON public.daily_reports FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ==========================================
-- Alerts Table
-- ==========================================
CREATE TABLE public.alerts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    cage_id UUID REFERENCES public.cages(id) ON DELETE CASCADE NOT NULL,
    alert_type TEXT NOT NULL CHECK (alert_type IN (
        'high_mortality', 'low_population', 'temperature_critical',
        'ph_critical', 'oxygen_critical', 'data_inconsistency'
    )),
    severity TEXT NOT NULL CHECK (severity IN ('critical', 'warning', 'info')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by UUID REFERENCES public.profiles(id),
    resolution_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

-- Policies for alerts
CREATE POLICY "Everyone can view alerts"
    ON public.alerts FOR SELECT
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "System can create alerts"
    ON public.alerts FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can resolve alerts"
    ON public.alerts FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ==========================================
-- Activity Log Table
-- ==========================================
CREATE TABLE public.activity_log (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) NOT NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- Policies for activity_log
CREATE POLICY "Admins can view all activity"
    ON public.activity_log FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Users can view their own activity"
    ON public.activity_log FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "System can insert activity"
    ON public.activity_log FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

-- ==========================================
-- Indexes for Performance
-- ==========================================
CREATE INDEX idx_cages_cage_number ON public.cages(cage_number);
CREATE INDEX idx_cages_status ON public.cages(status);
CREATE INDEX idx_daily_reports_cage_date ON public.daily_reports(cage_id, report_date DESC);
CREATE INDEX idx_daily_reports_date ON public.daily_reports(report_date DESC);
CREATE INDEX idx_alerts_cage_active ON public.alerts(cage_id, is_active);
CREATE INDEX idx_alerts_created ON public.alerts(created_at DESC);
CREATE INDEX idx_activity_log_user ON public.activity_log(user_id, created_at DESC);

-- ==========================================
-- Functions and Triggers
-- ==========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cages_updated_at
    BEFORE UPDATE ON public.cages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_reports_updated_at
    BEFORE UPDATE ON public.daily_reports
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to create user profile after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'role', 'technicien')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Function to log activity
CREATE OR REPLACE FUNCTION log_activity(
    p_action TEXT,
    p_entity_type TEXT,
    p_entity_id UUID DEFAULT NULL,
    p_details JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_log_id UUID;
BEGIN
    INSERT INTO public.activity_log (user_id, action, entity_type, entity_id, details)
    VALUES (auth.uid(), p_action, p_entity_type, p_entity_id, p_details)
    RETURNING id INTO v_log_id;

    RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user role
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS TEXT AS $$
DECLARE
    user_role TEXT;
BEGIN
    SELECT role INTO user_role
    FROM public.profiles
    WHERE id = user_id;

    RETURN user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- Views for Analytics
-- ==========================================

-- View: Daily Report Summary
CREATE OR REPLACE VIEW daily_report_summary AS
SELECT
    dr.report_date,
    COUNT(DISTINCT dr.cage_id) as total_cages_reported,
    SUM(dr.alive_count) as total_alive,
    SUM(dr.new_dead) as total_new_dead,
    AVG(dr.water_temp) as avg_water_temp,
    AVG(dr.ph) as avg_ph,
    AVG(dr.oxygen) as avg_oxygen,
    SUM(dr.feeding_kg) as total_feeding_kg
FROM public.daily_reports dr
GROUP BY dr.report_date
ORDER BY dr.report_date DESC;

-- View: Cage Current Status
CREATE OR REPLACE VIEW cage_current_status AS
SELECT
    c.id,
    c.cage_number,
    c.initial_count,
    c.alive_count,
    c.total_dead,
    c.status,
    ROUND((c.total_dead::DECIMAL / NULLIF(c.initial_count, 0)) * 100, 2) as mortality_rate,
    dr.report_date as last_report_date,
    dr.water_temp as last_water_temp,
    dr.ph as last_ph,
    dr.oxygen as last_oxygen,
    dr.remarks as last_remarks
FROM public.cages c
LEFT JOIN LATERAL (
    SELECT * FROM public.daily_reports
    WHERE cage_id = c.id
    ORDER BY report_date DESC
    LIMIT 1
) dr ON TRUE
WHERE c.status = 'active'
ORDER BY c.cage_number;

-- ==========================================
-- Initial Data (Optional)
-- ==========================================

-- Insert sample admin user (after manual signup via Supabase Auth)
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'admin@aquavision.com';

-- Sample cages (optional)
/*
INSERT INTO public.cages (cage_number, initial_count, alive_count, location)
VALUES
    (1, 200, 200, 'Zone A'),
    (2, 250, 250, 'Zone A'),
    (3, 180, 180, 'Zone B'),
    (4, 220, 220, 'Zone B'),
    (5, 300, 300, 'Zone C'),
    (6, 150, 150, 'Zone C'),
    (7, 200, 200, 'Zone D'),
    (8, 175, 175, 'Zone D');
*/

-- ==========================================
-- Grants (if needed)
-- ==========================================
-- Grant execute on functions to authenticated users
GRANT EXECUTE ON FUNCTION log_activity TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_role TO authenticated;

-- ==========================================
-- Comments for Documentation
-- ==========================================
COMMENT ON TABLE public.profiles IS 'User profiles with roles (admin/technicien)';
COMMENT ON TABLE public.cages IS 'Fish cages in the aquaculture facility';
COMMENT ON TABLE public.daily_reports IS 'Daily reports filled by technicians for each cage';
COMMENT ON TABLE public.alerts IS 'System alerts for critical conditions';
COMMENT ON TABLE public.activity_log IS 'Audit log of all user activities';

COMMENT ON COLUMN public.daily_reports.remarks IS 'Technician remarks and observations';
COMMENT ON COLUMN public.daily_reports.has_incident IS 'Flag indicating if there was an incident';
COMMENT ON COLUMN public.profiles.role IS 'User role: admin or technicien';
