# Guide de Déploiement - AquaVision Pro

Ce guide vous explique comment mettre votre projet sur GitHub et le déployer sur Netlify.

## Étape 1 : Créer le dépôt sur GitHub

### Option A : Via l'interface GitHub (Recommandé)

1. **Aller sur GitHub**
   - Ouvrez https://github.com
   - Connectez-vous à votre compte

2. **Créer un nouveau dépôt**
   - Cliquez sur le bouton "+" en haut à droite
   - Sélectionnez "New repository"

3. **Configurer le dépôt**
   ```
   Repository name: aquavision-pro
   Description: Système de monitoring intelligent pour l'aquaculture
   Visibility: Public (ou Private selon votre choix)

   NE COCHEZ PAS :
   ❌ Add a README file
   ❌ Add .gitignore
   ❌ Choose a license
   ```

4. **Créer le dépôt**
   - Cliquez sur "Create repository"
   - GitHub vous affichera les commandes à exécuter

### Option B : Via GitHub CLI (gh)

```bash
# Si vous avez GitHub CLI installé
cd "C:\Users\zoumi\OneDrive\Bureau\app\Gestion cage"
gh repo create aquavision-pro --public --source=. --remote=origin
```

## Étape 2 : Lier votre dépôt local à GitHub

```bash
cd "C:\Users\zoumi\OneDrive\Bureau\app\Gestion cage"

# Ajouter le remote origin (remplacez USERNAME par votre nom d'utilisateur GitHub)
git remote add origin https://github.com/USERNAME/aquavision-pro.git

# Vérifier le remote
git remote -v

# Renommer la branche principale en main (si nécessaire)
git branch -M main

# Pousser le code
git push -u origin main
```

**Commandes complètes (copier-coller) :**
```bash
cd "C:\Users\zoumi\OneDrive\Bureau\app\Gestion cage"
git remote add origin https://github.com/VOTRE_USERNAME/aquavision-pro.git
git branch -M main
git push -u origin main
```

### En cas d'erreur

Si vous obtenez une erreur d'authentification :

**Solution 1 : Token Personnel (Recommandé)**
1. Allez sur https://github.com/settings/tokens
2. Cliquez sur "Generate new token" (classic)
3. Sélectionnez les scopes : `repo`, `workflow`
4. Générez le token et copiez-le
5. Utilisez-le comme mot de passe lors du push

**Solution 2 : GitHub CLI**
```bash
gh auth login
# Suivez les instructions
```

## Étape 3 : Déployer sur Netlify

### Méthode A : Via l'interface Netlify (La plus simple)

1. **Aller sur Netlify**
   - Ouvrez https://app.netlify.com
   - Connectez-vous (ou créez un compte gratuit)

2. **Importer depuis GitHub**
   - Cliquez sur "Add new site"
   - Sélectionnez "Import an existing project"
   - Choisissez "GitHub"

3. **Autoriser Netlify**
   - Autorisez Netlify à accéder à vos dépôts GitHub
   - Sélectionnez le dépôt `aquavision-pro`

4. **Configurer le build**
   ```
   Branch to deploy: main
   Build command: (laisser vide)
   Publish directory: public
   ```

5. **Déployer**
   - Cliquez sur "Deploy site"
   - Netlify va construire et déployer votre site
   - Vous obtiendrez une URL comme : https://random-name-123.netlify.app

6. **Personnaliser le nom de domaine**
   - Allez dans "Site settings" > "Domain management"
   - Cliquez sur "Options" > "Edit site name"
   - Changez en : `aquavision-pro` ou autre nom disponible
   - URL finale : https://aquavision-pro.netlify.app

### Méthode B : Via Netlify CLI

```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Se connecter
netlify login

# Initialiser et déployer
cd "C:\Users\zoumi\OneDrive\Bureau\app\Gestion cage"
netlify init

# Suivre les instructions :
# - Create & configure a new site
# - Choisir votre team
# - Site name: aquavision-pro
# - Build command: (laisser vide)
# - Publish directory: public

# Déployer
netlify deploy --prod
```

### Méthode C : Déploiement manuel (Drag & Drop)

1. Allez sur https://app.netlify.com
2. Faites glisser le dossier `public` dans la zone "Drag and drop"
3. Netlify déploiera instantanément votre site

## Étape 4 : Configuration Post-Déploiement

### Variables d'environnement (si nécessaire)

1. Dans Netlify, allez dans "Site settings" > "Environment variables"
2. Ajoutez vos variables si besoin :
   ```
   APP_NAME=AquaVision Pro
   APP_ENV=production
   ```

### Domaine personnalisé (optionnel)

Si vous avez un domaine personnalisé :
1. Allez dans "Domain management"
2. Cliquez sur "Add custom domain"
3. Entrez votre domaine
4. Suivez les instructions pour configurer les DNS

### HTTPS

- HTTPS est activé automatiquement par Netlify
- Certificat SSL gratuit via Let's Encrypt

## Étape 5 : Déploiements Automatiques

Une fois configuré, chaque push sur GitHub déclenchera automatiquement un déploiement sur Netlify !

```bash
# Faire des modifications
git add .
git commit -m "Update: nouvelles fonctionnalités"
git push

# Netlify détecte le push et déploie automatiquement
```

## Commandes Git Utiles

```bash
# Voir le statut
git status

# Ajouter tous les fichiers modifiés
git add .

# Créer un commit
git commit -m "Description des changements"

# Pousser sur GitHub
git push

# Voir l'historique
git log --oneline

# Créer une nouvelle branche
git checkout -b nom-de-branche

# Revenir à la branche main
git checkout main
```

## URLs Importantes

Après déploiement, notez ces URLs :

- **GitHub Repository**: https://github.com/VOTRE_USERNAME/aquavision-pro
- **Netlify Site**: https://aquavision-pro.netlify.app
- **Netlify Admin**: https://app.netlify.com/sites/aquavision-pro

## Vérification du Déploiement

1. Ouvrez l'URL Netlify dans votre navigateur
2. Vérifiez que l'application se charge correctement
3. Testez les fonctionnalités :
   - Ajout de cage
   - Saisie rapide (bouton + Ctrl+Q)
   - Données environnementales
   - Mode clair/sombre
   - Alertes

## Badge de Statut (Optionnel)

Ajoutez un badge Netlify dans votre README :

```markdown
[![Netlify Status](https://api.netlify.com/api/v1/badges/SITE_ID/deploy-status)](https://app.netlify.com/sites/aquavision-pro/deploys)
```

Trouvez votre SITE_ID dans : Site settings > General > Site details

## Troubleshooting

### Le site ne se charge pas
- Vérifiez que le dossier "Publish directory" est bien `public`
- Regardez les logs de build dans Netlify

### Erreur 404
- Vérifiez le fichier `netlify.toml` à la racine
- Le redirect vers index.html doit être configuré

### Les icônes ne s'affichent pas
- Vérifiez que Lucide Icons est bien chargé depuis le CDN
- Regardez la console du navigateur (F12)

### Git push échoue
- Vérifiez votre authentification GitHub
- Utilisez un Personal Access Token si nécessaire

## Support

- **GitHub Issues**: https://github.com/VOTRE_USERNAME/aquavision-pro/issues
- **Netlify Docs**: https://docs.netlify.com
- **Git Docs**: https://git-scm.com/doc

## Prochaines Étapes

Maintenant que votre site est déployé :

1. Partagez l'URL avec votre équipe
2. Ajoutez des données de test
3. Collectez des retours
4. Planifiez les prochaines fonctionnalités :
   - Export CSV/Excel
   - Graphiques historiques
   - Backend PHP
   - Application mobile

Félicitations ! Votre application AquaVision Pro est en ligne ! 🎉
