-- =====================================================
-- SUPABASE RLS POLICIES POUR LANDING PAGE PUBLIQUE
-- =====================================================
--
-- Ce fichier contient les policies nécessaires pour permettre
-- l'accès public (lecture seule) aux tables suivantes:
-- - cages
-- - daily_reports
-- - biometric_samples
--
-- Instructions:
-- 1. Allez sur https://supabase.com/dashboard/project/gswozuotdrfgvutitssf
-- 2. Cliquez sur "SQL Editor" dans le menu gauche
-- 3. Copiez-collez tout ce fichier
-- 4. Cliquez sur "Run" (ou Ctrl+Enter)
-- =====================================================

-- Supprimer les anciennes policies si elles existent
DROP POLICY IF EXISTS "Allow public read on cages" ON cages;
DROP POLICY IF EXISTS "Allow public read on daily_reports" ON daily_reports;
DROP POLICY IF EXISTS "Allow public read on biometric_samples" ON biometric_samples;

-- Créer les nouvelles policies

-- Autoriser lecture publique sur la table cages
CREATE POLICY "Allow public read on cages"
ON cages FOR SELECT
TO anon
USING (true);

-- Autoriser lecture publique sur la table daily_reports
CREATE POLICY "Allow public read on daily_reports"
ON daily_reports FOR SELECT
TO anon
USING (true);

-- Autoriser lecture publique sur la table biometric_samples
CREATE POLICY "Allow public read on biometric_samples"
ON biometric_samples FOR SELECT
TO anon
USING (true);

-- =====================================================
-- VÉRIFICATION DES POLICIES
-- =====================================================
-- Après avoir exécuté ce script, vous pouvez vérifier
-- que les policies sont bien créées avec cette requête:

-- SELECT schemaname, tablename, policyname
-- FROM pg_policies
-- WHERE tablename IN ('cages', 'daily_reports', 'biometric_samples');

-- =====================================================
-- NOTES IMPORTANTES
-- =====================================================
--
-- Ces policies permettent UNIQUEMENT la LECTURE (SELECT).
-- Les utilisateurs anonymes ne peuvent pas:
-- - Créer de nouvelles données (INSERT)
-- - Modifier des données existantes (UPDATE)
-- - Supprimer des données (DELETE)
--
-- Pour ces opérations, les utilisateurs doivent être
-- authentifiés (admin ou technicien).
-- =====================================================
