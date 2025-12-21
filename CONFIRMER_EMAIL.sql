-- ==========================================
-- Confirmer l'Email du Compte tech1@aquavision.com
-- ==========================================

-- Exécutez cette requête dans Supabase SQL Editor
-- pour confirmer l'email et pouvoir se connecter

UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email = 'tech1@aquavision.com';

-- ==========================================
-- Instructions :
-- ==========================================
-- 1. Allez sur Supabase : https://supabase.com/dashboard/project/gswozuotdrfgvutitssf
-- 2. Cliquez sur "SQL Editor" dans le menu de gauche
-- 3. Cliquez sur "New query"
-- 4. Copiez la ligne 9 ci-dessus (UPDATE auth.users...)
-- 5. Collez dans l'éditeur SQL
-- 6. Cliquez "Run" (ou F5)
-- 7. Retournez sur l'application et connectez-vous avec :
--    Email: tech1@aquavision.com
--    Password: Test1234!
