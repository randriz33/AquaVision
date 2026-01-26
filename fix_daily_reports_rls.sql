-- =====================================================
-- CORRECTION RLS POLICY POUR daily_reports
-- =====================================================
--
-- Ce script corrige la politique d'insertion pour la table daily_reports
-- en s'assurant que created_by correspond à l'utilisateur authentifié
--
-- Instructions:
-- 1. Allez sur https://supabase.com/dashboard
-- 2. Cliquez sur "SQL Editor" dans le menu gauche
-- 3. Copiez-collez tout ce fichier
-- 4. Cliquez sur "Run" (ou Ctrl+Enter)
-- =====================================================

-- Supprimer l'ancienne policy d'insertion
DROP POLICY IF EXISTS "Everyone can create reports" ON public.daily_reports;

-- Créer la nouvelle policy d'insertion corrigée
-- Cette policy vérifie que l'utilisateur est authentifié ET que created_by = auth.uid()
CREATE POLICY "Everyone can create reports"
ON public.daily_reports
FOR INSERT
WITH CHECK (
    auth.uid() IS NOT NULL
    AND created_by = auth.uid()
);

-- =====================================================
-- VÉRIFICATION
-- =====================================================
-- Vérifier que la policy est bien créée:
SELECT
    schemaname,
    tablename,
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'daily_reports'
  AND policyname = 'Everyone can create reports';

-- =====================================================
-- EXPLICATION
-- =====================================================
--
-- AVANT: WITH CHECK (auth.uid() IS NOT NULL)
-- Cette policy vérifiait seulement que l'utilisateur était authentifié,
-- mais ne vérifiait pas que le created_by correspond à l'utilisateur.
--
-- APRÈS: WITH CHECK (auth.uid() IS NOT NULL AND created_by = auth.uid())
-- Maintenant la policy vérifie également que le created_by correspond
-- à l'ID de l'utilisateur authentifié, empêchant un utilisateur de créer
-- des rapports au nom d'autres utilisateurs.
--
-- =====================================================
