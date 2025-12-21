-- ==========================================
-- MISE A JOUR DES PERMISSIONS
-- Les techniciens peuvent entrer toutes les donnees
-- ==========================================

-- Supprimer les anciennes politiques pour les cages
DROP POLICY IF EXISTS "Everyone can view cages" ON public.cages;
DROP POLICY IF EXISTS "Admins can manage cages" ON public.cages;

-- Nouvelles politiques pour les cages
-- Les techniciens peuvent creer et modifier les cages
CREATE POLICY "Everyone can view cages" ON public.cages
    FOR SELECT
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "Technicians can create cages" ON public.cages
    FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Technicians can update cages" ON public.cages
    FOR UPDATE
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can delete cages" ON public.cages
    FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    ));

-- ==========================================
-- RESUME DES PERMISSIONS
-- ==========================================

-- TECHNICIENS:
-- ✓ Voir toutes les cages
-- ✓ Creer des cages
-- ✓ Modifier les cages
-- ✓ Creer des rapports journaliers
-- ✓ Modifier leurs propres rapports
-- ✓ Ajouter des echantillons biometriques
-- ✓ Creer des alertes
-- ✗ Supprimer des cages (reserve aux admins)

-- ADMINS:
-- ✓ Toutes les permissions techniciens
-- ✓ Supprimer des cages
-- ✓ Modifier tous les rapports
-- ✓ Gerer l'inventaire
-- ✓ Gerer les objectifs de production
-- ✓ Voir tous les logs d'activite

-- ==========================================
-- VERIFICATION
-- ==========================================

-- Pour verifier les politiques actives:
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
-- FROM pg_policies
-- WHERE tablename IN ('cages', 'daily_reports', 'biometric_samples')
-- ORDER BY tablename, policyname;
