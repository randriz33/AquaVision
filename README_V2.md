# AquaVision Pro v2.0 - Version Supabase

## Vue d'Ensemble

AquaVision Pro v2.0 est une application complète de gestion aquacole avec authentification, rôles utilisateurs, et stockage cloud via Supabase.

### Nouvelles Fonctionnalités v2.0

- Authentification complète (Email/Password)
- 2 Rôles : **Admin** et **Technicien**
- Base de données cloud (Supabase)
- Formulaire journalier pour techniciens
- Système de rapports journaliers
- Champ remarques pour événements spécifiques
- Suivi des incidents
- Journal d'activité
- Row Level Security (RLS)
- Temps réel (optionnel)

## Architecture

### Base de Données (Supabase)

**Tables:**
1. **profiles** - Profils utilisateurs avec rôles
2. **cages** - Cages et leur état
3. **daily_reports** - Rapports journaliers des techniciens
4. **alerts** - Alertes système
5. **activity_log** - Journal d'activité

### Rôles Utilisateurs

#### Administrateur
- Gestion complète des cages
- Vue de tous les rapports
- Gestion des utilisateurs
- Résolution des alertes
- Accès au journal d'activité
- Export des données

#### Technicien
- Remplissage des formulaires journaliers
- Vue des cages assignées
- Consultation des alertes
- Ajout de remarques

## Structure du Projet

```
Gestion cage/
├── public/
│   ├── index.html                    # Version locale (sans Supabase)
│   ├── index-supabase.html           # Version Supabase
│   └── assets/
│       ├── css/
│       │   └── style.css             # Styles complets avec auth
│       └── js/
│           ├── supabase-client.js    # Client Supabase
│           ├── auth.js               # Authentification
│           ├── technician-dashboard.js  # Dashboard technicien
│           ├── admin-dashboard.js    # Dashboard admin
│           ├── app.js                # App principale (v1)
│           ├── aquavision-api-mock.js
│           └── quick-entry.js
├── database/
│   └── supabase_schema.sql           # Schéma complet Supabase
├── docs/
├── README.md                         # Documentation v1
├── README_V2.md                      # Ce fichier
├── SUPABASE_SETUP.md                 # Guide configuration Supabase
├── GETTING_STARTED.md
├── DEPLOY.md
└── ...
```

## Installation et Configuration

### Prérequis

1. Un compte Supabase (gratuit) : https://supabase.com
2. Node.js (optionnel, pour serveur local)
3. Les fichiers du projet

### Étape 1 : Configuration Supabase

**Suivez le guide complet : `SUPABASE_SETUP.md`**

Résumé :
1. Créer un projet Supabase
2. Exécuter `database/supabase_schema.sql`
3. Récupérer les clés API
4. Configurer `public/assets/js/supabase-client.js`

```javascript
// Dans supabase-client.js
const SUPABASE_CONFIG = {
    url: 'https://xxxxx.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIs...'
};
```

### Étape 2 : Lancer l'Application

```bash
cd "C:\Users\zoumi\OneDrive\Bureau\app\Gestion cage"

# Option 1 : Python
python -m http.server 8000 --directory public

# Option 2 : PHP
php -S localhost:8000 -t public

# Option 3 : Node.js
npx http-server public -p 8000
```

Accédez à : `http://localhost:8000/index-supabase.html`

### Étape 3 : Créer des Utilisateurs

1. **Premier Admin**
   - S'inscrire via l'interface
   - Puis via SQL :
   ```sql
   UPDATE profiles SET role = 'admin' WHERE email = 'votre@email.com';
   ```

2. **Techniciens**
   - Peuvent s'inscrire directement
   - Ou créés par l'admin

## Utilisation

### Workflow Technicien

1. **Connexion**
   - Email et mot de passe
   - Rôle : Technicien

2. **Dashboard Journalier**
   - Vue de toutes les cages
   - Indicateur de progression (X/Y rapports complétés)
   - Statut : Complété ✓ ou En attente

3. **Remplir un Rapport**
   - Cliquer sur "Remplir" pour une cage
   - Formulaire en plusieurs sections :

   **Population**
   - Poissons vivants
   - Nouvelles pertes

   **Environnement**
   - Température eau (°C)
   - Température air (°C)
   - pH
   - Oxygène (mg/L)

   **Alimentation**
   - Quantité (kg)
   - Heure de nourrissage

   **Observations**
   - Conditions météo
   - Qualité de l'eau
   - Comportement des poissons

   **Incidents**
   - Cocher si incident
   - Type d'incident
   - Description détaillée

   **Remarques**
   - Champ texte libre
   - Noter événements, observations, interventions

4. **Enregistrement**
   - Un rapport par cage par jour
   - Possibilité de modifier le rapport du jour

### Workflow Admin

1. **Connexion**
   - Email et mot de passe
   - Rôle : Admin

2. **Dashboard Admin**
   - Vue d'ensemble :
     - Nombre de cages
     - Nombre de techniciens
     - Rapports du jour
     - Alertes actives

3. **Gestion des Cages**
   - Ajouter/Modifier/Supprimer des cages
   - Assigner des cages à des techniciens

4. **Consultation des Rapports**
   - Vue de tous les rapports
   - Filtrer par cage, date, technicien
   - Modifier les rapports si nécessaire

5. **Gestion des Alertes**
   - Voir les alertes actives
   - Résoudre les alertes
   - Ajouter des notes de résolution

## Formulaire Journalier - Champs Détaillés

### Données Obligatoires
- **Population actuelle** : Nombre de poissons vivants
- **Nouvelles pertes** : Poissons morts depuis le dernier rapport

### Données Environnementales (Optionnelles mais Recommandées)
- **Température de l'eau** : En °C, optimal 20-28°C
- **Température ambiante** : En °C
- **pH** : Optimal 6.5-8.5
- **Oxygène dissous** : En mg/L, optimal >5 mg/L

### Données d'Alimentation (Optionnelles)
- **Quantité distribuée** : En kg
- **Heure de distribution** : Format HH:MM

### Observations (Optionnelles)
- **Météo** : Ensoleillé, Nuageux, Pluvieux, Orageux, Venteux
- **Qualité eau** : Excellente, Bonne, Moyenne, Mauvaise
- **Comportement** : Normal, Stressé, Léthargique, Agressif

### Incidents (Si Applicable)
- **Type** : Mortalité anormale, Panne équipement, Prédation, etc.
- **Description** : Texte libre détaillant l'incident

### Remarques (Texte Libre)
Utilisez ce champ pour noter :
- Comportements inhabituels
- Interventions effectuées
- Événements particuliers
- Observations spécifiques
- Points nécessitant attention

## Exemples de Remarques

**Bon :**
```
Mortalité légère observée (3 poissons).
Augmentation de l'oxygénation mise en place.
Surveillance renforcée pour les prochains jours.
```

**Très bon :**
```
Température eau élevée (29°C) due à la canicule.
Mesures prises :
- Ajout d'eau fraîche (500L)
- Augmentation aération
- Distribution nourriture réduite de 20%
Poissons semblent moins actifs mais pas de stress visible.
```

**Incident :**
```
INCIDENT - Panne pompe oxygénation détectée à 14h30.
Mortalité de 15 poissons constatée.
Réparation effectuée à 16h00.
Oxygène remonté à 6.2 mg/L à 17h00.
Vétérinaire prévenu.
```

## Sécurité

### Row Level Security (RLS)

Toutes les tables sont protégées par RLS :
- Les utilisateurs ne voient que leurs données
- Les admins ont accès complet
- Les politiques empêchent les modifications non autorisées

### Authentification

- Mots de passe hachés par Supabase
- JWT pour les sessions
- Expiration automatique des tokens
- Email de confirmation (optionnel)

## Déploiement

### Sur Netlify

1. **Variables d'environnement**
   ```
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUz...
   ```

2. **Configuration Netlify**
   - Déjà configurée dans `netlify.toml`
   - Build command : (aucune)
   - Publish directory : `public`

3. **Autoriser l'URL dans Supabase**
   - Authentication > URL Configuration
   - Ajouter l'URL Netlify

Voir `DEPLOY.md` pour les détails.

## APIs et Intégrations

### Endpoints Disponibles

Tous gérés via `SupabaseService` :

```javascript
// Authentication
SupabaseService.signUp(email, password, fullName, role)
SupabaseService.signIn(email, password)
SupabaseService.signOut()
SupabaseService.getCurrentUser()
SupabaseService.getUserProfile()

// Cages
SupabaseService.getCages()
SupabaseService.getCage(id)
SupabaseService.createCage(data)
SupabaseService.updateCage(id, data)
SupabaseService.deleteCage(id)

// Daily Reports
SupabaseService.getDailyReports(filters)
SupabaseService.getTodayReport(cageId)
SupabaseService.createDailyReport(data)
SupabaseService.updateDailyReport(id, data)

// Alerts
SupabaseService.getActiveAlerts()
SupabaseService.createAlert(data)
SupabaseService.resolveAlert(id, notes)

// Activity Log
SupabaseService.getActivityLog(filters)
SupabaseService.logActivity(action, type, id, details)
```

### Temps Réel (Optionnel)

```javascript
// S'abonner aux changements
const channel = SupabaseService.subscribeToCages((payload) => {
    console.log('Cage modifiée:', payload);
});

// Se désabonner
SupabaseService.unsubscribe(channel);
```

## Maintenance et Monitoring

### Backups

- Backups automatiques quotidiens (Supabase)
- Conservation : 7 jours (plan gratuit)
- Export manuel possible via SQL

### Monitoring

- Logs API dans Supabase Dashboard
- Métriques d'utilisation
- Journal d'activité dans l'app

## Comparaison v1 vs v2

| Fonctionnalité | v1.0 (Local) | v2.0 (Supabase) |
|---|---|---|
| Stockage | localStorage | Cloud (Supabase) |
| Auth | Non | Oui (Email/Password) |
| Rôles | Non | Admin + Technicien |
| Multi-utilisateurs | Non | Oui |
| Formulaire journalier | Non | Oui |
| Remarques | Basique | Complet avec incidents |
| Historique | 100 mesures | Illimité |
| Temps réel | Non | Oui (optionnel) |
| Sécurité | Locale | RLS + JWT |
| Export | Manuel | API disponible |
| Mobile | Oui | Oui |

## Roadmap v2.x

### v2.1 (À venir)
- Dashboard admin complet
- Gestion des utilisateurs
- Export CSV/Excel automatique
- Graphiques d'évolution

### v2.2
- Notifications push
- Application mobile native
- Mode hors-ligne avec sync
- Capteurs IoT

### v3.0
- Machine Learning (prédictions)
- Multi-sites
- Rapports automatiques
- Intégrations tierces

## Support

- **Documentation Supabase** : https://supabase.com/docs
- **Guide Setup** : `SUPABASE_SETUP.md`
- **Issues GitHub** : https://github.com/VOTRE_USERNAME/aquavision-pro/issues

## Licences

- **AquaVision Pro** : MIT License
- **Supabase** : Apache 2.0 License
- **Lucide Icons** : ISC License

---

**AquaVision Pro v2.0** - Gestion aquacole professionnelle avec Supabase 🐟
