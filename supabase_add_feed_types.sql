-- =====================================================
-- AJOUT DES COLONNES POUR LES TYPES D'ALIMENTATION
-- =====================================================
--
-- Ajoute les colonnes ti2, ti3, ti4 (types d'aliments)
-- dans la table daily_reports
--
-- Instructions:
-- 1. Allez sur https://supabase.com/dashboard/project/gswozuotdrfgvutitssf
-- 2. Cliquez sur "SQL Editor" dans le menu gauche
-- 3. Copiez-collez tout ce fichier
-- 4. Cliquez sur "Run" (ou Ctrl+Enter)
-- =====================================================

-- Ajouter les colonnes pour les types d'alimentation
ALTER TABLE daily_reports
ADD COLUMN IF NOT EXISTS ti2_consumed_kg DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS ti3_consumed_kg DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS ti4_consumed_kg DECIMAL(10,2) DEFAULT 0;

-- Ajouter des commentaires pour documentation
COMMENT ON COLUMN daily_reports.ti2_consumed_kg IS 'Quantité d''aliment Type 2 consommée en kg';
COMMENT ON COLUMN daily_reports.ti3_consumed_kg IS 'Quantité d''aliment Type 3 consommée en kg';
COMMENT ON COLUMN daily_reports.ti4_consumed_kg IS 'Quantité d''aliment Type 4 consommée en kg';

-- Vérification: afficher les colonnes de la table daily_reports
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'daily_reports'
  AND column_name IN ('ti2_consumed_kg', 'ti3_consumed_kg', 'ti4_consumed_kg')
ORDER BY column_name;

-- =====================================================
-- RÉSULTAT ATTENDU
-- =====================================================
-- Vous devriez voir 3 lignes:
-- ti2_consumed_kg | numeric | 0
-- ti3_consumed_kg | numeric | 0
-- ti4_consumed_kg | numeric | 0
-- =====================================================
