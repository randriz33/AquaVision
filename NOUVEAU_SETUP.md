# Configuration Nouveau Compte - AquaVision Pro

## 📋 Checklist Complète

### ✅ Étape 1 : GitHub (randriz33)

#### 1.1 Créer le Repository
1. Allez sur https://github.com/randriz33
2. Cliquez sur "New repository"
3. **Nom du repository** : `AquaVision`
4. **Description** : "AquaVision Pro - Système de monitoring intelligent pour l'aquaculture"
5. **Visibilité** : Public ou Private (votre choix)
6. ⚠️ **NE PAS** cocher "Initialize this repository with a README"
7. Cliquez sur "Create repository"

#### 1.2 Push le Code
Le remote git a déjà été configuré vers : `https://github.com/randriz33/AquaVision.git`

Une fois le repository créé sur GitHub, exécutez :
```bash
cd "C:\Users\zoumi\OneDrive\Bureau\app\Gestion cage"
git push -u origin main
```

### ✅ Étape 2 : Supabase (Nouveau Compte)

#### 2.1 Créer le Projet Supabase
1. Allez sur https://supabase.com
2. Connectez-vous avec votre nouveau compte
3. Cliquez sur "New project"
4. Remplissez :
   - **Name** : `aquavision-pro` ou `AquaVision`
   - **Database Password** : Choisissez un mot de passe fort (notez-le !)
   - **Region** : Choisissez la plus proche (ex: `eu-central-1` pour Europe)
   - **Pricing Plan** : Free (gratuit)
5. Cliquez sur "Create new project"
6. Attendez 2-3 minutes que le projet soit créé

#### 2.2 Exécuter le Schéma de Base de Données

1. Dans le projet Supabase, allez dans **SQL Editor** (icône dans le menu gauche)
2. Cliquez sur "New query"
3. **Étape 2a** : Copiez et exécutez TOUT le contenu de :
   ```
   database/supabase_schema_optimized.sql
   ```
   Cliquez sur "Run" (ou F5)

4. **Vérification** : Allez dans **Table Editor**
   Vous devriez voir ces tables :
   - ✅ profiles
   - ✅ cages
   - ✅ daily_reports (avec tous les nouveaux champs biométriques)
   - ✅ biometric_samples
   - ✅ feed_inventory
   - ✅ production_targets
   - ✅ alerts
   - ✅ activity_log

#### 2.3 Récupérer les Clés API

1. Allez dans **Project Settings** (icône engrenage en bas à gauche)
2. Cliquez sur **API** dans le menu latéral
3. Notez ces deux valeurs :

**Project URL** :
```
https://xxxxxxxxxxxxx.supabase.co
```

**anon public (API Key)** :
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey...
```

#### 2.4 Configurer l'Application

Éditez le fichier `public/assets/js/supabase-client.js` :

```javascript
// CONFIGURATION SUPABASE
const SUPABASE_CONFIG = {
    url: 'https://VOTRE_PROJECT_ID.supabase.co',  // ← Remplacer ici
    anonKey: 'eyJhbGciOiJIUzI1NiIs...'            // ← Remplacer ici
};
```

#### 2.5 Créer le Premier Utilisateur Admin

1. **Option A : Via l'interface web**
   - Lancez l'application : `python -m http.server 8000 --directory public`
   - Allez sur : http://localhost:8000/index-supabase.html
   - Créez un compte avec votre email
   - Confirmez l'email si demandé

2. **Option B : Via SQL (si pas de confirmation email)**
   ```sql
   -- Dans Supabase SQL Editor
   INSERT INTO auth.users (
       email,
       encrypted_password,
       email_confirmed_at,
       created_at,
       updated_at
   ) VALUES (
       'votre@email.com',
       crypt('votre_mot_de_passe', gen_salt('bf')),
       NOW(),
       NOW(),
       NOW()
   );
   ```

3. **Donner les droits admin** :
   - Allez dans **Table Editor** > **profiles**
   - Trouvez votre profil
   - Modifiez `role` : changez `technicien` → `admin`

   OU via SQL :
   ```sql
   UPDATE profiles
   SET role = 'admin'
   WHERE email = 'votre@email.com';
   ```

### ✅ Étape 3 : Netlify (Nouveau Compte)

#### 3.1 Créer le Site Netlify

1. Allez sur https://app.netlify.com
2. Connectez-vous avec votre nouveau compte
3. Cliquez sur "Add new site" > "Import an existing project"
4. Sélectionnez "GitHub"
5. Autorisez Netlify à accéder à votre compte GitHub
6. Sélectionnez le repository `randriz33/AquaVision`

#### 3.2 Configuration du Build

Dans la configuration Netlify :

**Build settings** :
- **Branch to deploy** : `main`
- **Build command** : (laissez vide)
- **Publish directory** : `public`

Ces paramètres sont déjà dans `netlify.toml` donc Netlify les détectera automatiquement.

#### 3.3 Variables d'Environnement

Dans **Site settings** > **Environment variables**, ajoutez :

| Key | Value |
|-----|-------|
| `VITE_SUPABASE_URL` | `https://xxxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUz...` |

⚠️ **Note** : Ces variables ne sont pas strictement nécessaires car les clés sont dans `supabase-client.js`, mais c'est une bonne pratique pour la sécurité.

#### 3.4 Déployer

1. Cliquez sur "Deploy site"
2. Attendez 1-2 minutes
3. Votre site sera disponible sur : `https://random-name-12345.netlify.app`

#### 3.5 Configurer le Domaine (Optionnel)

Si vous voulez un nom personnalisé :
1. **Site settings** > **Domain management**
2. Cliquez sur "Change site name"
3. Entrez : `aquavision-pro` (ou autre nom disponible)
4. Votre site sera : `https://aquavision-pro.netlify.app`

#### 3.6 Autoriser l'URL dans Supabase

IMPORTANT : Retournez dans Supabase :
1. **Project Settings** > **Authentication** > **URL Configuration**
2. Dans **Site URL**, ajoutez : `https://votre-site.netlify.app`
3. Dans **Redirect URLs**, ajoutez :
   ```
   https://votre-site.netlify.app/**
   http://localhost:8000/**
   ```
4. Sauvegardez

## 🧪 Tests

### Test Local

```bash
cd "C:\Users\zoumi\OneDrive\Bureau\app\Gestion cage"

# Option 1 : Python
python -m http.server 8000 --directory public

# Option 2 : PHP
php -S localhost:8000 -t public

# Option 3 : Node.js
npx http-server public -p 8000
```

Ouvrez : http://localhost:8000/index-supabase.html

### Test en Production

1. Allez sur votre site Netlify
2. Créez un compte technicien
3. Testez la création d'un rapport journalier
4. Vérifiez que les données apparaissent dans Supabase

## 📊 Résumé des URLs

Une fois tout configuré, notez vos URLs :

| Service | URL |
|---------|-----|
| **GitHub** | https://github.com/randriz33/AquaVision |
| **Supabase Dashboard** | https://supabase.com/dashboard/project/VOTRE_ID |
| **Netlify Dashboard** | https://app.netlify.com/sites/VOTRE_SITE |
| **Application Live** | https://VOTRE_SITE.netlify.app |

## 🔒 Sécurité

### Variables à NE JAMAIS Commiter

Si vous utilisez des variables d'environnement, créez `.env` :
```bash
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUz...
```

Et vérifiez que `.gitignore` contient :
```
.env
.env.local
.env.production
```

### Sauvegarder les Credentials

Créez un fichier local (NE PAS COMMITER) avec :
```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUz...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUz... (clé admin)
SUPABASE_DB_PASSWORD=votre_mot_de_passe
```

## ✅ Checklist Finale

Avant de lancer en production :

- [ ] Repository GitHub créé et code pushé
- [ ] Projet Supabase créé
- [ ] Schéma SQL exécuté (8 tables créées)
- [ ] Clés API Supabase récupérées
- [ ] `supabase-client.js` configuré avec les bonnes clés
- [ ] Premier admin créé et testé
- [ ] Site Netlify déployé
- [ ] Variables d'environnement Netlify configurées
- [ ] URL Netlify autorisée dans Supabase
- [ ] Test de connexion réussi
- [ ] Test de création de rapport réussi
- [ ] Données visibles dans Supabase

## 🆘 En Cas de Problème

### Erreur "Supabase not configured"
→ Vérifiez que `supabase-client.js` contient les bonnes clés

### Erreur "Invalid API key"
→ Vérifiez que vous avez copié la clé complète (très longue)

### Erreur "Authentication required"
→ Vérifiez les politiques RLS dans Supabase

### Erreur "CORS" sur Netlify
→ Ajoutez l'URL Netlify dans Supabase Authentication > URL Configuration

## 📞 Support

- **Documentation Supabase** : https://supabase.com/docs
- **Documentation Netlify** : https://docs.netlify.com
- **Guide Détaillé** : Consultez `SUPABASE_SETUP.md` et `README_V2.md`

---

**Bon déploiement !** 🚀
