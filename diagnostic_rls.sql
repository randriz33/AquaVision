-- =====================================================
-- DIAGNOSTIC DES POLICIES RLS SUR daily_reports
-- =====================================================
-- Exécutez ce script pour voir l'état actuel des policies
-- =====================================================

-- 1. Voir toutes les policies sur daily_reports
SELECT
    schemaname,
    tablename,
    policyname,
    cmd as operation,
    qual as using_expression,
    with_check as with_check_expression
FROM pg_policies
WHERE tablename = 'daily_reports'
ORDER BY policyname, cmd;

-- 2. Vérifier si RLS est activé
SELECT
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename = 'daily_reports';

-- 3. Vérifier l'utilisateur actuel
SELECT
    current_user,
    session_user,
    auth.uid() as authenticated_user_id;
