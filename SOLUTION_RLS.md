# 🔧 SOLUTION : Erreur RLS sur daily_reports

## ❌ Problème
```
Erreur lors de l'enregistrement: new row violates row-level security policy for table "daily_reports"
```

## ✅ Solution en 3 étapes

### ÉTAPE 1 : Diagnostic (OPTIONNEL)

Ouvrez le fichier `test_debug.html` dans votre navigateur :
1. Double-cliquez sur `test_debug.html`
2. Connectez-vous d'abord à l'application (si pas déjà fait)
3. Cliquez sur "Vérifier utilisateur actuel"
4. Cliquez sur "Créer rapport de test"

Cela vous montrera exactement où est le problème.

---

### ÉTAPE 2 : Appliquer la correction dans Supabase

**C'EST L'ÉTAPE CRITIQUE !** Vous DEVEZ exécuter ce script dans Supabase.

1. **Allez sur votre dashboard Supabase :**
   ```
   https://supabase.com/dashboard/project/gswozuotdrfgvutitssf
   ```

2. **Cliquez sur "SQL Editor"** dans le menu de gauche

3. **Cliquez sur "+ New query"**

4. **Copiez TOUT le contenu du fichier `fix_rls_complet.sql`**

5. **Collez-le dans l'éditeur SQL**

6. **Cliquez sur "Run"** (ou appuyez sur `Ctrl+Enter`)

7. **Vérifiez le résultat :**
   - Vous devriez voir : "Policies recréées avec succès!"
   - Une liste de 5 policies

---

### ÉTAPE 3 : Vérifier que ça fonctionne

1. Retournez sur votre application AquaVision
2. Essayez de créer un nouveau rapport quotidien
3. ✅ Ça devrait fonctionner maintenant !

---

## 🔍 Contenu du fichier `fix_rls_complet.sql`

```sql
-- Supprimer TOUTES les policies existantes
DROP POLICY IF EXISTS "Everyone can view reports" ON public.daily_reports;
DROP POLICY IF EXISTS "Everyone can create reports" ON public.daily_reports;
DROP POLICY IF EXISTS "Users can update own reports" ON public.daily_reports;
DROP POLICY IF EXISTS "Admins can update all reports" ON public.daily_reports;
DROP POLICY IF EXISTS "Admins can delete reports" ON public.daily_reports;

-- Recréer les policies correctement

CREATE POLICY "Everyone can view reports"
ON public.daily_reports FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Everyone can create reports"
ON public.daily_reports FOR INSERT
WITH CHECK (
    auth.uid() IS NOT NULL
    AND created_by = auth.uid()
);

CREATE POLICY "Users can update own reports"
ON public.daily_reports FOR UPDATE
USING (created_by = auth.uid())
WITH CHECK (created_by = auth.uid());

CREATE POLICY "Admins can update all reports"
ON public.daily_reports FOR UPDATE
USING (
    EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE id = auth.uid()
        AND role = 'admin'
    )
);

CREATE POLICY "Admins can delete reports"
ON public.daily_reports FOR DELETE
USING (
    EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE id = auth.uid()
        AND role = 'admin'
    )
);
```

---

## ⚠️ Important

- Vous DEVEZ être connecté à l'application pour créer des rapports
- Le champ `created_by` doit correspondre à votre ID utilisateur
- Les policies RLS protègent votre base de données contre les insertions non autorisées

---

## 🆘 Si ça ne fonctionne toujours pas

1. Vérifiez que vous êtes bien connecté (ouvrez la console : F12, onglet Console)
2. Ouvrez `test_debug.html` et faites les tests
3. Envoyez-moi les messages d'erreur exacts que vous voyez
4. Vérifiez dans Supabase Dashboard → Authentication que votre utilisateur existe

---

## 📝 Explication technique

**Avant :** La policy vérifiait seulement `auth.uid() IS NOT NULL`

**Après :** La policy vérifie aussi `created_by = auth.uid()`

Cela garantit que :
- Seuls les utilisateurs authentifiés peuvent créer des rapports
- Un utilisateur ne peut créer un rapport qu'avec son propre ID
- Impossible de créer un rapport au nom d'un autre utilisateur
