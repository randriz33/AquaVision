# AquaVision Pro

<div align="center">
  <img src="https://img.shields.io/badge/version-2.1.0-blue.svg" alt="Version">
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License">
  <img src="https://img.shields.io/badge/status-active-success.svg" alt="Status">
  <img src="https://img.shields.io/badge/Supabase-PostgreSQL-green.svg" alt="Supabase">
  <img src="https://img.shields.io/badge/JavaScript-ES6+-yellow.svg" alt="JavaScript">
</div>

<div align="center">
  <h3>Système de Monitoring Intelligent pour l'Aquaculture</h3>
  <p>Application web moderne avec suivi biométrique complet et base de données cloud</p>
</div>

---

## Aperçu

AquaVision Pro est une solution complète de gestion aquacole professionnelle qui permet aux techniciens et administrateurs de :
- Suivre en temps réel l'état de toutes les cages
- Enregistrer des données biométriques détaillées (poids, longueur, échantillonnage)
- Calculer automatiquement les indicateurs de performance (FCR, croissance, biomasse)
- Analyser la condition des poissons (coefficient K, CV)
- Gérer l'alimentation et les paramètres environnementaux
- Accéder depuis n'importe où avec authentification sécurisée

## Fonctionnalités Principales

### Gestion des Cages
- Suivi détaillé de chaque cage (population, biomasse, statut)
- Historique complet des rapports journaliers
- Progression en temps réel (cages complétées/en attente)
- Vue d'ensemble avec statistiques instantanées

### Données Biométriques Complètes
- **Échantillonnage multi-poissons** : Poids et longueur individuels
- **Calculs automatiques** :
  - Poids moyen et longueur moyenne
  - Coefficient de condition (K)
  - Coefficient de variation (CV)
  - Biomasse totale
  - Taux de croissance quotidien
  - FCR (Food Conversion Ratio)

### Paramètres Environnementaux
- Température de l'eau
- pH
- Oxygène dissous (mg/L)
- Suivi de l'alimentation (quantité, type)

### Système d'Authentification
- Connexion sécurisée avec Supabase Auth
- Rôles utilisateurs (Admin/Technicien)
- Permissions basées sur les rôles (RLS)
- Logs d'activité complets

### Dashboard Technicien
- Interface intuitive et responsive
- Formulaires optimisés pour saisie rapide
- Validation en temps réel
- Progression visuelle des tâches quotidiennes

## Technologies Utilisées

### Frontend
- **HTML5** - Structure sémantique moderne
- **CSS3** - Design responsive avec animations
- **JavaScript ES6+** - Logique métier et interactivité
- **Supabase JS Client** - Communication avec la base de données

### Backend
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Base de données relationnelle
- **Row Level Security (RLS)** - Sécurité au niveau des lignes
- **Edge Functions** - Fonctions serveur (optionnel)

### Infrastructure
- **Netlify** - Hébergement et déploiement continu
- **Git** - Contrôle de version
- **GitHub** - Repository et collaboration

## Installation

### Prérequis
- Git installé
- Navigateur web moderne
- Compte Supabase (gratuit)
- Compte GitHub (optionnel pour déploiement)
- Compte Netlify (optionnel pour déploiement)

### Installation Locale

1. **Cloner le repository**
```bash
git clone https://github.com/randriz33/AquaVision.git
cd AquaVision
```

2. **Lancer le serveur local**
```bash
# Avec Python 3
python -m http.server 8000 --directory public

# OU avec PHP
php -S localhost:8000 -t public

# OU avec Node.js
npx http-server public -p 8000
```

3. **Accéder à l'application**
```
http://localhost:8000/index-supabase.html
```

4. **Se connecter**
```
Email: tech1@aquavision.com
Password: Test1234!
```

### Configuration Supabase

1. **Créer un projet Supabase**
   - Allez sur https://supabase.com
   - Créez un nouveau projet
   - Notez l'URL et l'anon key

2. **Exécuter le schéma SQL**
   - Ouvrez SQL Editor dans Supabase
   - Exécutez le fichier `database/supabase_schema_complete.sql`
   - Vérifiez que les 8 tables sont créées

3. **Configurer l'application**
   - Modifiez `public/assets/js/supabase-client.js`
   - Remplacez `url` et `anonKey` par vos valeurs

4. **Créer un utilisateur test**
   - Utilisez Supabase Auth pour créer un compte
   - Confirmez l'email avec SQL:
```sql
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email = 'votre@email.com';
```

## Déploiement

### Déploiement sur Netlify

1. **Push vers GitHub**
```bash
git add .
git commit -m "Initial commit"
git push -u origin main
```

2. **Connecter Netlify**
   - Allez sur https://app.netlify.com
   - "Add new site" > "Import from Git"
   - Sélectionnez votre repository
   - Configuration automatique via `netlify.toml`
   - Déployez

3. **Configurer Supabase**
   - Allez dans Supabase > Authentication > URL Configuration
   - Ajoutez l'URL Netlify dans "Site URL"
   - Ajoutez l'URL dans "Redirect URLs"

## Structure du Projet

```
AquaVision/
├── public/                          # Application frontend
│   ├── index-supabase.html         # Page principale avec Supabase
│   └── assets/
│       ├── css/
│       │   └── style.css           # Styles complets
│       └── js/
│           ├── supabase-client.js   # Client Supabase et API
│           ├── auth.js              # Gestion authentification
│           ├── technician-dashboard.js  # Dashboard technicien
│           └── admin-dashboard.js   # Dashboard admin (WIP)
├── database/
│   ├── supabase_schema_complete.sql # Schéma SQL complet (8 tables)
│   └── migrations/                  # Migrations futures
├── docs/                            # Documentation
│   ├── INSTRUCTIONS_COMPLETES.txt   # Guide complet
│   ├── ENHANCED_DASHBOARD.md        # Doc fonctionnalités
│   ├── SUPABASE_SETUP.md           # Configuration Supabase
│   └── README_V2.md                # Guide détaillé
├── netlify.toml                     # Configuration Netlify
├── README.md                        # Ce fichier
└── .gitignore                       # Fichiers ignorés
```

## Base de Données

### Tables Principales

1. **profiles** - Profils utilisateurs (admin/technicien)
2. **cages** - Informations des cages avec données biométriques
3. **daily_reports** - Rapports journaliers optimisés
4. **biometric_samples** - Échantillons biométriques détaillés
5. **feed_inventory** - Inventaire des aliments
6. **production_targets** - Objectifs de production
7. **alerts** - Système d'alertes
8. **activity_log** - Journal d'activité

### Fonctions SQL Automatisées

- `calculate_biomass()` - Calcul automatique de la biomasse
- `calculate_daily_growth_rate()` - Taux de croissance quotidien
- `calculate_fcr()` - Food Conversion Ratio
- Triggers automatiques sur insert/update

## Utilisation

### Dashboard Technicien

1. **Vue d'ensemble**
   - Voir toutes les cages avec leur statut
   - Progression du jour (X/Y complétées)
   - Informations rapides (population, biomasse)

2. **Remplir un rapport journalier**
   - Cliquer sur une cage "En attente"
   - Renseigner population et mortalité
   - Ajouter des échantillons biométriques
   - Entrer les paramètres environnementaux
   - Enregistrer - Calculs automatiques

3. **Consulter l'historique**
   - Voir les rapports précédents
   - Analyser les tendances
   - Exporter les données (à venir)

### Rôles et Permissions

**Technicien:**
- Créer des rapports journaliers
- Voir ses propres rapports
- Modifier ses rapports du jour
- Consulter les cages assignées

**Admin:**
- Toutes les permissions technicien
- Créer/modifier/supprimer des cages
- Gérer les utilisateurs
- Accéder à tous les rapports
- Voir les logs d'activité

## API Documentation

Toutes les opérations passent par `SupabaseService` dans `supabase-client.js`:

### Authentification
```javascript
await SupabaseService.signIn(email, password)
await SupabaseService.signOut()
await SupabaseService.getCurrentUser()
```

### Cages
```javascript
await SupabaseService.getCages()
await SupabaseService.getCage(cageId)
await SupabaseService.createCage(cageData)
await SupabaseService.updateCage(cageId, updates)
```

### Rapports
```javascript
await SupabaseService.getDailyReports(filters)
await SupabaseService.getTodayReport(cageId)
await SupabaseService.createDailyReport(reportData)
```

## Sécurité

- Authentification JWT via Supabase
- Row Level Security (RLS) sur toutes les tables
- Validation côté client et serveur
- Pas de clés sensibles dans le code (anon key uniquement)
- HTTPS obligatoire en production
- CORS configuré correctement

## Améliorations Futures

### Priorité Haute
- [ ] Graphiques de croissance (Chart.js)
- [ ] Export CSV/Excel des rapports
- [ ] Dashboard admin complet
- [ ] Notifications push
- [ ] Application mobile (React Native)

### Priorité Moyenne
- [ ] Filtres et recherche avancée
- [ ] Comparaison entre cages
- [ ] Prédictions ML (croissance)
- [ ] Intégration capteurs IoT
- [ ] Mode hors-ligne

### Priorité Basse
- [ ] WebSockets temps réel
- [ ] Multi-sites
- [ ] API publique
- [ ] Système de backup automatique

## Dépannage

### Application bloquée sur "Chargement..."
- Vérifier F12 > Console pour les erreurs
- Vérifier que Supabase URL et key sont corrects
- Vérifier la connexion internet

### "Email not confirmed"
```sql
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email = 'votre@email.com';
```

### Dashboard vide
- C'est normal si aucune cage n'existe
- Créer des cages dans Supabase Table Editor
- Ou utiliser les seeds (à venir)

### Erreurs CORS
- Ajouter l'URL de votre site dans Supabase
- Authentication > URL Configuration

## Contribution

Les contributions sont bienvenues !

1. Fork le projet
2. Créez votre branche (`git checkout -b feature/MaSuperFonctionnalite`)
3. Committez (`git commit -m 'feat: Ajout super fonctionnalite'`)
4. Push (`git push origin feature/MaSuperFonctionnalite`)
5. Ouvrez une Pull Request

## Licence

MIT License - Voir [LICENSE](LICENSE) pour plus de détails.

## Auteur

**randriz33**
- GitHub: [@randriz33](https://github.com/randriz33)
- Repository: [AquaVision](https://github.com/randriz33/AquaVision)

## Support

- Issues: [GitHub Issues](https://github.com/randriz33/AquaVision/issues)
- Documentation: Voir dossier `docs/`
- Guide complet: `INSTRUCTIONS_COMPLETES.txt`

---

<div align="center">
  <p>Version 2.1 - Dashboard Technicien avec Suivi Biométrique Complet</p>
  <p>AquaVision Pro - Gestion Professionnelle d'Aquaculture</p>
</div>
