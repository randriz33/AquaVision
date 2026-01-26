-- =====================================================
-- CORRECTION COMPLÈTE - RLS POLICIES daily_reports
-- =====================================================
-- Ce script supprime TOUTES les policies existantes
-- et les recrée correctement
-- =====================================================

-- ÉTAPE 1: Supprimer TOUTES les policies existantes sur daily_reports
DROP POLICY IF EXISTS "Everyone can view reports" ON public.daily_reports;
DROP POLICY IF EXISTS "Everyone can create reports" ON public.daily_reports;
DROP POLICY IF EXISTS "Users can update own reports" ON public.daily_reports;
DROP POLICY IF EXISTS "Admins can update all reports" ON public.daily_reports;
DROP POLICY IF EXISTS "Admins can delete reports" ON public.daily_reports;

-- ÉTAPE 2: Recréer les policies correctement

-- Policy pour SELECT (lecture)
CREATE POLICY "Everyone can view reports"
ON public.daily_reports
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Policy pour INSERT (création) - CORRIGÉE
CREATE POLICY "Everyone can create reports"
ON public.daily_reports
FOR INSERT
WITH CHECK (
    auth.uid() IS NOT NULL
    AND created_by = auth.uid()
);

-- Policy pour UPDATE (modification par le créateur)
CREATE POLICY "Users can update own reports"
ON public.daily_reports
FOR UPDATE
USING (created_by = auth.uid())
WITH CHECK (created_by = auth.uid());

-- Policy pour UPDATE (modification par admin)
CREATE POLICY "Admins can update all reports"
ON public.daily_reports
FOR UPDATE
USING (
    EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE id = auth.uid()
        AND role = 'admin'
    )
);

-- Policy pour DELETE (suppression par admin uniquement)
CREATE POLICY "Admins can delete reports"
ON public.daily_reports
FOR DELETE
USING (
    EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE id = auth.uid()
        AND role = 'admin'
    )
);

-- ÉTAPE 3: Vérification
SELECT
    'Policies recréées avec succès!' as status,
    COUNT(*) as nombre_policies
FROM pg_policies
WHERE tablename = 'daily_reports';

-- Afficher toutes les policies
SELECT
    policyname,
    cmd as operation,
    CASE
        WHEN qual IS NOT NULL THEN 'USING: ' || qual
        ELSE ''
    END as using_clause,
    CASE
        WHEN with_check IS NOT NULL THEN 'WITH CHECK: ' || with_check
        ELSE ''
    END as with_check_clause
FROM pg_policies
WHERE tablename = 'daily_reports'
ORDER BY cmd, policyname;
