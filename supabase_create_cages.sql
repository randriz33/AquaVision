-- =====================================================
-- CRÉATION DES 23 CAGES AVEC DONNÉES INITIALES
-- =====================================================
--
-- Ce script insère toutes les cages avec leurs données
-- d'ensemencement et dates de récolte prévues
--
-- Instructions:
-- 1. Allez sur https://supabase.com/dashboard/project/gswozuotdrfgvutitssf
-- 2. Cliquez sur "SQL Editor" dans le menu gauche
-- 3. Copiez-collez tout ce fichier
-- 4. Cliquez sur "Run" (ou Ctrl+Enter)
-- =====================================================

-- Supprimer les cages existantes (ATTENTION: à utiliser avec précaution)
-- DÉCOMMENTEZ LA LIGNE SUIVANTE SEULEMENT SI VOUS VOULEZ RÉINITIALISER
-- DELETE FROM cages;

-- Insérer les 23 cages
INSERT INTO cages (
    cage_number,
    location,
    species,
    capacity,
    stocking_date,
    initial_count,
    alive_count,
    total_dead,
    status,
    notes,
    created_at,
    updated_at
) VALUES
-- Cages N°1 à N°3: Lot du 7 mai 2025
('N°1', 'Zone A', 'Tilapia', 1000, '2025-05-07', 2000, 2000, 0, 'active', 'Récolte prévue: 2 janvier 2026', NOW(), NOW()),
('N°2', 'Zone A', 'Tilapia', 1000, '2025-05-07', 2000, 2000, 0, 'active', 'Récolte prévue: 2 janvier 2026', NOW(), NOW()),
('N°3', 'Zone A', 'Tilapia', 1000, '2025-05-07', 2000, 2000, 0, 'active', 'Récolte prévue: 2 janvier 2026', NOW(), NOW()),

-- Cage N°4: Lot du 12 décembre 2025
('N°4', 'Zone B', 'Tilapia', 1000, '2025-12-12', 1972, 1972, 0, 'active', 'Récolte prévue: 9 août 2026', NOW(), NOW()),

-- Cage N°5: Lot du 7 mai 2025
('N°5', 'Zone A', 'Tilapia', 1000, '2025-05-07', 2000, 2000, 0, 'active', 'Récolte prévue: 2 janvier 2026', NOW(), NOW()),

-- Cage N°6: Lot du 3 décembre 2025
('N°6', 'Zone B', 'Tilapia', 1000, '2025-12-03', 1920, 1920, 0, 'active', 'Récolte prévue: 31 juillet 2026', NOW(), NOW()),

-- Cage N°7: Lot du 7 mai 2025
('N°7', 'Zone A', 'Tilapia', 1000, '2025-05-07', 2000, 2000, 0, 'active', 'Récolte prévue: 2 janvier 2026', NOW(), NOW()),

-- Cage N°8: Lot du 12 décembre 2025
('N°8', 'Zone B', 'Tilapia', 1000, '2025-12-12', 1276, 1276, 0, 'active', 'Récolte prévue: 9 août 2026', NOW(), NOW()),

-- Cages N°9 à N°13: Lot du 7 mai 2025
('N°9', 'Zone A', 'Tilapia', 1000, '2025-05-07', 2000, 2000, 0, 'active', 'Récolte prévue: 2 janvier 2026', NOW(), NOW()),
('N°10', 'Zone A', 'Tilapia', 1000, '2025-05-07', 2000, 2000, 0, 'active', 'Récolte prévue: 2 janvier 2026', NOW(), NOW()),
('N°11', 'Zone A', 'Tilapia', 1000, '2025-05-07', 2000, 2000, 0, 'active', 'Récolte prévue: 2 janvier 2026', NOW(), NOW()),
('N°12', 'Zone A', 'Tilapia', 1000, '2025-05-07', 2000, 2000, 0, 'active', 'Récolte prévue: 2 janvier 2026', NOW(), NOW()),
('N°13', 'Zone A', 'Tilapia', 1000, '2025-05-07', 2000, 2000, 0, 'active', 'Récolte prévue: 2 janvier 2026', NOW(), NOW()),

-- Cage N°14: Lot du 3 décembre 2025
('N°14', 'Zone B', 'Tilapia', 1000, '2025-12-03', 1800, 1800, 0, 'active', 'Récolte prévue: 31 juillet 2026', NOW(), NOW()),

-- Cages N°15 à N°19: Lot du 7 mai 2025
('N°15', 'Zone A', 'Tilapia', 1000, '2025-05-07', 2000, 2000, 0, 'active', 'Récolte prévue: 2 janvier 2026', NOW(), NOW()),
('N°16', 'Zone A', 'Tilapia', 1000, '2025-05-07', 2000, 2000, 0, 'active', 'Récolte prévue: 2 janvier 2026', NOW(), NOW()),
('N°17', 'Zone A', 'Tilapia', 1000, '2025-05-07', 2000, 2000, 0, 'active', 'Récolte prévue: 2 janvier 2026', NOW(), NOW()),
('N°18', 'Zone A', 'Tilapia', 1000, '2025-05-07', 2000, 2000, 0, 'active', 'Récolte prévue: 2 janvier 2026', NOW(), NOW()),
('N°19', 'Zone A', 'Tilapia', 1000, '2025-05-07', 2000, 2000, 0, 'active', 'Récolte prévue: 2 janvier 2026', NOW(), NOW()),

-- Cages N°20 à N°22: Lot du 3 décembre 2025
('N°20', 'Zone B', 'Tilapia', 1000, '2025-12-03', 1560, 1560, 0, 'active', 'Récolte prévue: 31 juillet 2026', NOW(), NOW()),
('N°21', 'Zone B', 'Tilapia', 1000, '2025-12-03', 2280, 2280, 0, 'active', 'Récolte prévue: 31 juillet 2026', NOW(), NOW()),
('N°22', 'Zone B', 'Tilapia', 1000, '2025-12-03', 2280, 2280, 0, 'active', 'Récolte prévue: 31 juillet 2026', NOW(), NOW()),

-- Cage N°23: Lot du 7 mai 2025 (valeurs par défaut)
('N°23', 'Zone A', 'Tilapia', 1000, '2025-05-07', 2000, 2000, 0, 'active', 'Récolte prévue: 2 janvier 2026', NOW(), NOW())

ON CONFLICT (cage_number) DO UPDATE SET
    stocking_date = EXCLUDED.stocking_date,
    initial_count = EXCLUDED.initial_count,
    alive_count = EXCLUDED.alive_count,
    updated_at = NOW();

-- =====================================================
-- VÉRIFICATION
-- =====================================================
-- Afficher toutes les cages créées
SELECT
    cage_number,
    initial_count as "Nd initial",
    TO_CHAR(stocking_date, 'DD-Mon-YY') as "Date ensemencement",
    TO_CHAR(stocking_date + INTERVAL '239 days', 'DD-Mon-YY') as "Date récolte prévue",
    alive_count as "Population actuelle",
    status
FROM cages
ORDER BY
    CASE
        WHEN cage_number ~ '^N°\d+$'
        THEN CAST(SUBSTRING(cage_number FROM 3) AS INTEGER)
        ELSE 999
    END;

-- =====================================================
-- STATISTIQUES
-- =====================================================
SELECT
    COUNT(*) as "Total cages",
    SUM(initial_count) as "Population totale initiale",
    SUM(alive_count) as "Population actuelle",
    ROUND(AVG(initial_count), 0) as "Moyenne par cage"
FROM cages
WHERE status = 'active';

-- =====================================================
-- PAR LOT D'ENSEMENCEMENT
-- =====================================================
SELECT
    TO_CHAR(stocking_date, 'DD Mon YYYY') as "Date d'ensemencement",
    COUNT(*) as "Nombre de cages",
    SUM(initial_count) as "Population totale",
    STRING_AGG(cage_number, ', ' ORDER BY cage_number) as "Cages"
FROM cages
WHERE status = 'active'
GROUP BY stocking_date
ORDER BY stocking_date;

-- =====================================================
-- NOTES
-- =====================================================
--
-- Dates de récolte calculées:
-- - 7 mai 2025 → 2 janvier 2026 (239 jours = ~8 mois)
-- - 3 décembre 2025 → 31 juillet 2026 (239 jours = ~8 mois)
-- - 12 décembre 2025 → 9 août 2026 (239 jours = ~8 mois)
--
-- Répartition:
-- - Zone A (7 mai): 16 cages (N°1-3, 5, 7, 9-19, 23)
-- - Zone B (3 déc): 5 cages (N°6, 14, 20-22)
-- - Zone B (12 déc): 2 cages (N°4, 8)
--
-- =====================================================
