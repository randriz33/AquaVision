-- =====================================================
-- CORRECTION SIMPLE - RLS POLICY daily_reports
-- =====================================================
-- Ce script corrige UNIQUEMENT la politique RLS problématique
-- Sans toucher aux autres éléments de la base de données
-- =====================================================

-- Supprimer et recréer la policy d'insertion
DROP POLICY IF EXISTS "Everyone can create reports" ON public.daily_reports;

CREATE POLICY "Everyone can create reports"
ON public.daily_reports
FOR INSERT
WITH CHECK (
    auth.uid() IS NOT NULL
    AND created_by = auth.uid()
);

-- Vérification
SELECT 'Policy corrigée avec succès!' as status;
