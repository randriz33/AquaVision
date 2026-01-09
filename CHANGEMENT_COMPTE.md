# 🔄 Guide de Changement de Compte

## ✅ Status Actuel

### Git Repository
- ✅ **Ancien** : `https://github.com/Randria33/aquavision-pro.git`
- ✅ **Nouveau** : `https://github.com/randriz33/AquaVision.git`
- ✅ Remote git changé avec succès

### Prochaines Étapes

## 📋 Actions à Effectuer

### 1️⃣ Créer le Repository GitHub

**⚠️ ACTION REQUISE :**
1. Allez sur https://github.com/randriz33
2. Cliquez sur "New repository"
3. Nom : `AquaVision`
4. **NE PAS** cocher "Initialize with README"
5. Cliquez "Create repository"

Ensuite, executez :
```bash
cd "C:\Users\zoumi\OneDrive\Bureau\app\Gestion cage"
git push -u origin main
```

### 2️⃣ Créer le Projet Supabase

1. **Compte** : Connectez-vous avec votre nouveau compte
2. **Créer projet** : https://supabase.com/dashboard
3. **Nom** : `AquaVision` ou `aquavision-pro`
4. **Password** : Choisissez un mot de passe fort
5. **Region** : Europe (eu-central-1) ou selon votre localisation

### 3️⃣ Configurer la Base de Données

1. Allez dans **SQL Editor**
2. Exécutez le schéma complet :
   ```sql
   -- Copiez TOUT le contenu de :
   database/supabase_schema_optimized.sql
   ```
3. Vérifiez que 8 tables sont créées :
   - profiles
   - cages
   - daily_reports
   - biometric_samples
   - feed_inventory
   - production_targets
   - alerts
   - activity_log

### 4️⃣ Récupérer les Clés Supabase

1. **Project Settings** > **API**
2. Copiez :
   - **Project URL** : `https://xxxxx.supabase.co`
   - **anon public** : `eyJhbGciOiJIUz...` (très longue)

### 5️⃣ Mettre à Jour l'Application

Éditez `public/assets/js/supabase-client.js` :

```javascript
const SUPABASE_CONFIG = {
    url: 'COLLEZ_ICI_VOTRE_URL',
    anonKey: 'COLLEZ_ICI_VOTRE_CLÉ'
};
```

### 6️⃣ Créer un Admin

**Option A : Via l'interface**
```bash
python -m http.server 8000 --directory public
```
Allez sur http://localhost:8000/index-supabase.html et créez un compte.

**Option B : Via SQL**
```sql
-- Dans Supabase SQL Editor
UPDATE profiles
SET role = 'admin'
WHERE email = 'votre@email.com';
```

### 7️⃣ Déployer sur Netlify

1. **Nouveau compte** : https://app.netlify.com
2. **Import** : Connectez GitHub
3. **Repository** : Sélectionnez `randriz33/AquaVision`
4. **Settings** :
   - Branch : `main`
   - Publish directory : `public`
5. **Variables** (optionnel) :
   - `VITE_SUPABASE_URL` : Votre URL
   - `VITE_SUPABASE_ANON_KEY` : Votre clé

### 8️⃣ Autoriser Netlify dans Supabase

Dans Supabase :
1. **Authentication** > **URL Configuration**
2. Ajoutez votre URL Netlify :
   ```
   https://votre-site.netlify.app
   ```

## 🎯 Commandes Git Récapitulatives

```bash
# Remote déjà configuré ✅
git remote -v
# Devrait afficher : https://github.com/randriz33/AquaVision.git

# Une fois le repo GitHub créé, poussez :
git push -u origin main

# Pour les prochaines fois :
git add .
git commit -m "votre message"
git push
```

## 📊 Fichiers à Configurer

| Fichier | Action |
|---------|--------|
| ✅ `.git/config` | Remote changé |
| ⏳ `public/assets/js/supabase-client.js` | À configurer avec nouvelles clés |
| ✅ `netlify.toml` | Déjà configuré |
| ✅ `.gitignore` | Déjà configuré |

## 🔐 Sécurité

**NE JAMAIS commiter :**
- Mots de passe Supabase
- Clés service_role (uniquement anon key dans le code)
- Fichiers `.env` locaux

**Fichiers sûrs à commiter :**
- `supabase-config.example.js` (valeurs d'exemple)
- Code avec SUPABASE_CONFIG vide
- Documentation

## ✅ Checklist Finale

Avant de considérer la migration terminée :

- [ ] Repository GitHub `randriz33/AquaVision` créé
- [ ] Code pushé sur GitHub
- [ ] Projet Supabase créé
- [ ] Schéma SQL exécuté (8 tables)
- [ ] Clés API récupérées
- [ ] `supabase-client.js` configuré
- [ ] Compte admin créé et testé
- [ ] Site Netlify déployé
- [ ] URL Netlify autorisée dans Supabase
- [ ] Test de connexion réussi
- [ ] Test de rapport journalier réussi

## 📚 Documentation Complète

Pour plus de détails, consultez :
- `NOUVEAU_SETUP.md` - Guide complet étape par étape
- `README_V2.md` - Documentation générale v2.0
- `ENHANCED_DASHBOARD.md` - Nouvelles fonctionnalités biométriques
- `SUPABASE_SETUP.md` - Configuration détaillée Supabase

## 🆘 Support

En cas de problème :
1. Vérifiez `NOUVEAU_SETUP.md` section "En Cas de Problème"
2. Consultez la documentation Supabase : https://supabase.com/docs
3. Vérifiez que les clés API sont complètes (très longues)

---

**Bonne migration !** 🚀
