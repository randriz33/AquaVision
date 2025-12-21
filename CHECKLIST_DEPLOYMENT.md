# ✅ Checklist de Déploiement - AquaVision Pro

## 🎯 Configuration Supabase

### ✅ Étape 1 : Projet Créé
- ✅ Projet Supabase : `gswozuotdrfgvutitssf`
- ✅ URL : `https://gswozuotdrfgvutitssf.supabase.co`
- ✅ Clé API configurée dans l'application

### ⚠️ Étape 2 : Schéma SQL (CRITIQUE)

**ACTION REQUISE** : Avez-vous exécuté le schéma SQL ?

1. Allez dans votre projet Supabase : https://supabase.com/dashboard/project/gswozuotdrfgvutitssf
2. Cliquez sur **SQL Editor** (icône dans le menu gauche)
3. Cliquez sur **New query**
4. Copiez **TOUT** le contenu du fichier :
   ```
   database/supabase_schema_optimized.sql
   ```
5. Collez dans l'éditeur SQL
6. Cliquez sur **Run** (ou appuyez sur F5)

### ✅ Étape 3 : Vérifier les Tables

Après avoir exécuté le SQL, allez dans **Table Editor** et vérifiez que ces 8 tables existent :

- [ ] **profiles** - Profils utilisateurs avec rôles
- [ ] **cages** - Gestion des cages
- [ ] **daily_reports** - Rapports journaliers (avec champs biométriques)
- [ ] **biometric_samples** - Échantillons biométriques détaillés
- [ ] **feed_inventory** - Inventaire des aliments
- [ ] **production_targets** - Objectifs de production
- [ ] **alerts** - Système d'alertes
- [ ] **activity_log** - Journal d'activité

Si ces tables n'existent pas, **l'application ne fonctionnera pas**.

### 📝 Note sur la Clé API

J'ai configuré la clé : `sb_publishable_lBZ4WQtTR-Cqk9JKt1V_EQ_2sBzLU0e`

**⚠️ IMPORTANT** : Si l'authentification ne fonctionne pas, vérifiez dans Supabase :
1. **Project Settings** > **API**
2. Cherchez la clé **"anon public"** (commence normalement par `eyJhbGci...`)
3. Si différente de celle configurée, remplacez dans `public/assets/js/supabase-client.js`

## 🔄 Git & GitHub

### ⏳ Étape 4 : Créer le Repository GitHub

**ACTION REQUISE** :

1. Allez sur https://github.com/randriz33
2. Cliquez sur "**New repository**"
3. Remplissez :
   - **Repository name** : `AquaVision`
   - **Description** : "AquaVision Pro - Système de monitoring aquacole"
   - **Public** ou **Private** : Votre choix
   - ⚠️ **NE PAS** cocher "Add a README file"
   - ⚠️ **NE PAS** cocher "Add .gitignore"
   - ⚠️ **NE PAS** cocher "Choose a license"
4. Cliquez sur "**Create repository**"

### Étape 5 : Pusher le Code

Une fois le repository créé, exécutez :

```bash
cd "C:\Users\zoumi\OneDrive\Bureau\app\Gestion cage"
git push -u origin main
```

## 🧪 Test Local

### Étape 6 : Tester l'Application Localement

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

### Étape 7 : Créer un Compte Admin

1. Sur la page de login, cliquez sur "**S'inscrire**"
2. Remplissez :
   - Email : votre@email.com
   - Mot de passe : (choisissez un mot de passe fort)
   - Nom complet : Votre Nom
   - Rôle : **Admin**
3. Cliquez sur "**S'inscrire**"

**Si erreur d'authentification** :
- Vérifiez que le schéma SQL a été exécuté
- Vérifiez la clé API dans `supabase-client.js`
- Regardez la console du navigateur (F12) pour les erreurs

### Étape 8 : Vérifier dans Supabase

1. Allez dans **Table Editor** > **profiles**
2. Vous devriez voir votre profil créé
3. Vérifiez que le champ `role` est bien `admin`

### Étape 9 : Tester le Formulaire Journalier

1. Créez une cage :
   - Allez dans le dashboard admin
   - Cliquez sur "Ajouter une Cage"
   - Remplissez les informations

2. Testez un rapport journalier :
   - Cliquez sur "Remplir" pour une cage
   - Remplissez quelques champs :
     - Population : nombre de poissons
     - Poids moyen : ex: 250.5
     - Longueur moyenne : ex: 22.5
   - Sauvegardez

3. Vérifiez dans Supabase :
   - **Table Editor** > **daily_reports**
   - Votre rapport devrait apparaître

## 🚀 Déploiement Netlify

### Étape 10 : Connecter Netlify

1. Allez sur https://app.netlify.com
2. Connectez-vous avec votre compte
3. Cliquez sur "**Add new site**" > "**Import an existing project**"
4. Sélectionnez "**GitHub**"
5. Autorisez Netlify à accéder à votre compte
6. Sélectionnez le repository **randriz33/AquaVision**

### Étape 11 : Configuration Netlify

Les paramètres sont déjà dans `netlify.toml` :
- **Build command** : (vide)
- **Publish directory** : `public`
- **Branch** : `main`

Cliquez sur "**Deploy site**"

### Étape 12 : Variables d'Environnement (Optionnel)

Dans **Site settings** > **Environment variables**, vous pouvez ajouter :

| Key | Value |
|-----|-------|
| `VITE_SUPABASE_URL` | `https://gswozuotdrfgvutitssf.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Votre clé API |

**Note** : Pas strictement nécessaire car les clés sont dans le code.

### Étape 13 : Autoriser Netlify dans Supabase

**IMPORTANT** : Une fois le site déployé :

1. Notez l'URL Netlify : `https://votre-site.netlify.app`
2. Allez dans Supabase :
   - **Authentication** > **URL Configuration**
3. Ajoutez dans **Site URL** :
   ```
   https://votre-site.netlify.app
   ```
4. Ajoutez dans **Redirect URLs** :
   ```
   https://votre-site.netlify.app/**
   http://localhost:8000/**
   ```
5. Sauvegardez

## ✅ Checklist Finale

Cochez chaque étape au fur et à mesure :

### Configuration Supabase
- [ ] Projet Supabase créé
- [ ] Schéma SQL `supabase_schema_optimized.sql` exécuté
- [ ] 8 tables visibles dans Table Editor
- [ ] Clés API configurées dans l'application

### Git & GitHub
- [ ] Repository GitHub `randriz33/AquaVision` créé
- [ ] Code pushé sur GitHub : `git push -u origin main`

### Tests Locaux
- [ ] Serveur local lancé (Python/PHP/Node)
- [ ] Application accessible sur http://localhost:8000/index-supabase.html
- [ ] Compte admin créé et connexion réussie
- [ ] Cage créée
- [ ] Rapport journalier créé et sauvegardé
- [ ] Données visibles dans Supabase Table Editor

### Déploiement Netlify
- [ ] Site Netlify créé et connecté à GitHub
- [ ] Premier déploiement réussi
- [ ] URL Netlify notée
- [ ] URL Netlify autorisée dans Supabase Authentication
- [ ] Test de connexion sur le site en ligne réussi

## 🎉 Félicitations !

Une fois toutes les cases cochées, votre application AquaVision Pro est :
- ✅ Configurée
- ✅ Déployée
- ✅ Prête à l'emploi

## 📚 Prochaines Étapes

1. **Créer des utilisateurs techniciens** :
   - Soit via l'interface (s'inscrire)
   - Soit via SQL dans Supabase

2. **Configurer les cages** :
   - Créer toutes vos cages
   - Définir les emplacements

3. **Former les techniciens** :
   - Montrer le formulaire journalier
   - Expliquer les champs biométriques
   - Workflow de saisie quotidienne

4. **Consulter la documentation** :
   - `ENHANCED_DASHBOARD.md` - Fonctionnalités biométriques
   - `README_V2.md` - Guide complet
   - `NOUVEAU_SETUP.md` - Guide détaillé

## 🆘 Support

En cas de problème :
1. Consultez la console du navigateur (F12)
2. Vérifiez les logs dans Supabase Dashboard
3. Relisez `NOUVEAU_SETUP.md` section "En Cas de Problème"

---

**Bonne utilisation d'AquaVision Pro !** 🐟
