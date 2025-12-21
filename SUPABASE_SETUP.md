# Guide de Configuration Supabase - AquaVision Pro v2.0

Ce guide vous explique comment configurer Supabase pour AquaVision Pro.

## Prérequis

- Un compte Supabase (gratuit) : https://supabase.com
- Les fichiers du projet AquaVision Pro

## Étape 1 : Créer un Projet Supabase

1. **Se connecter à Supabase**
   - Allez sur https://app.supabase.com
   - Connectez-vous ou créez un compte

2. **Créer un nouveau projet**
   - Cliquez sur "New Project"
   - Remplissez les informations :
     ```
     Name: aquavision-pro
     Database Password: [Choisir un mot de passe fort]
     Region: [Choisir la région la plus proche]
     ```
   - Cliquez sur "Create new project"
   - Attendez 2-3 minutes que le projet soit créé

## Étape 2 : Créer les Tables

1. **Ouvrir l'éditeur SQL**
   - Dans le menu de gauche, cliquez sur "SQL Editor"
   - Cliquez sur "New query"

2. **Exécuter le schéma**
   - Copiez tout le contenu du fichier `database/supabase_schema.sql`
   - Collez-le dans l'éditeur SQL
   - Cliquez sur "Run" (ou Ctrl+Enter)
   - Attendez la confirmation "Success"

3. **Vérifier les tables créées**
   - Menu gauche > "Table Editor"
   - Vous devriez voir les tables :
     - profiles
     - cages
     - daily_reports
     - alerts
     - activity_log

## Étape 3 : Configuration de l'Authentification

1. **Activer l'authentification Email/Password**
   - Menu gauche > "Authentication" > "Providers"
   - Vérifiez que "Email" est activé
   - Configurez les options :
     ```
     Enable email confirmations: Yes (recommandé)
     Enable email change confirmations: Yes
     Secure email change: Yes
     ```

2. **Configurer les URLs de redirection**
   - Allez dans "Authentication" > "URL Configuration"
   - Site URL : `https://votre-domaine.netlify.app` (ou votre URL)
   - Redirect URLs : Ajoutez vos URLs autorisées

## Étape 4 : Récupérer les Clés API

1. **Accéder aux paramètres**
   - Menu gauche > "Settings" > "API"

2. **Copier les informations**
   ```
   Project URL: https://xxxxxxxxxxxxx.supabase.co
   anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

   **IMPORTANT** : Ne JAMAIS committer la clé `service_role` dans Git !

## Étape 5 : Configurer l'Application

### Option A : Modifier directement le fichier

Éditez `public/assets/js/supabase-client.js` :

```javascript
const SUPABASE_CONFIG = {
    url: 'https://xxxxxxxxxxxxx.supabase.co', // Votre Project URL
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' // Votre anon key
};
```

### Option B : Variables d'environnement (Production)

Créez un fichier `.env.local` :

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Et utilisez-les dans votre code :

```javascript
const SUPABASE_CONFIG = {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY
};
```

## Étape 6 : Tester l'Application

1. **Ouvrir l'application**
   ```bash
   cd "C:\Users\zoumi\OneDrive\Bureau\app\Gestion cage"
   python -m http.server 8000 --directory public
   ```

2. **Accéder à http://localhost:8000**

3. **Créer un compte**
   - Cliquez sur "Inscription"
   - Remplissez le formulaire
   - Choisissez le rôle "Technicien" ou "Administrateur"
   - Cliquez sur "S'inscrire"

4. **Vérifier l'email** (si activé)
   - Allez dans votre boîte email
   - Cliquez sur le lien de confirmation
   - Retournez à l'application

5. **Se connecter**
   - Email et mot de passe créés
   - Cliquez sur "Se Connecter"

## Étape 7 : Créer le Premier Administrateur

### Méthode 1 : Via l'interface Supabase

1. Allez dans "Authentication" > "Users"
2. Trouvez votre utilisateur
3. Cliquez sur les "..." > "Edit user"
4. Dans "raw_user_meta_data", ajoutez :
   ```json
   {
     "full_name": "Votre Nom",
     "role": "admin"
   }
   ```
5. Sauvegardez

### Méthode 2 : Via SQL

```sql
-- Après inscription, exécutez dans SQL Editor :
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'votre@email.com';
```

## Étape 8 : Ajouter des Cages (Admin)

1. Connectez-vous en tant qu'admin
2. Le dashboard admin s'affichera
3. Ajoutez des cages via l'interface

Ou via SQL :

```sql
INSERT INTO public.cages (cage_number, initial_count, alive_count, location)
VALUES
    (1, 200, 200, 'Zone A'),
    (2, 250, 250, 'Zone A'),
    (3, 180, 180, 'Zone B'),
    (4, 220, 220, 'Zone B'),
    (5, 300, 300, 'Zone C');
```

## Étape 9 : Tester le Formulaire Journalier

1. Connectez-vous en tant que technicien
2. Vous verrez la liste des cages à vérifier
3. Cliquez sur "Remplir" pour une cage
4. Remplissez le formulaire :
   - Population
   - Températures
   - pH et Oxygène
   - Alimentation
   - Remarques
5. Cliquez sur "Enregistrer le Rapport"

## Sécurité et Row Level Security (RLS)

Les politiques RLS sont automatiquement créées par le schéma SQL :

### Profiles
- Les utilisateurs voient leur propre profil
- Les admins voient tous les profils

### Cages
- Tous les authentifiés peuvent voir les cages
- Seuls les admins peuvent créer/modifier/supprimer

### Daily Reports
- Tous peuvent voir les rapports
- Tous peuvent créer des rapports
- Les utilisateurs modifient leurs propres rapports
- Les admins modifient tous les rapports

### Alerts
- Tous voient les alertes
- Seuls les admins peuvent résoudre les alertes

## Fonctionnalités Temps Réel (Optionnel)

Pour activer les mises à jour en temps réel :

1. **Via Supabase Dashboard**
   - "Database" > "Replication"
   - Activez "Realtime" pour les tables :
     - cages
     - daily_reports
     - alerts

2. **Dans l'application**
   - Les subscriptions sont déjà configurées dans `supabase-client.js`

## Déploiement sur Netlify

### 1. Variables d'environnement Netlify

Dans les paramètres Netlify :

```
VITE_SUPABASE_URL = https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. Ajouter l'URL au projet Supabase

Dans "Authentication" > "URL Configuration" > "Redirect URLs" :
```
https://votre-app.netlify.app
https://votre-app.netlify.app/*
```

## Maintenance

### Backup de la Base de Données

1. **Via Supabase Dashboard**
   - "Database" > "Backups"
   - Les backups quotidiens sont automatiques (plan gratuit : 7 jours)

2. **Export manuel**
   - SQL Editor :
   ```sql
   -- Export des cages
   COPY (SELECT * FROM cages) TO STDOUT WITH CSV HEADER;

   -- Export des rapports
   COPY (SELECT * FROM daily_reports) TO STDOUT WITH CSV HEADER;
   ```

### Monitoring

1. **Logs**
   - "Logs" > "API Logs"
   - Voir toutes les requêtes API

2. **Métriques**
   - "Database" > "Database"
   - Surveiller l'utilisation

## Troubleshooting

### Erreur : "Failed to fetch"
- Vérifiez que l'URL Supabase est correcte
- Vérifiez votre connexion Internet
- Vérifiez que le projet Supabase est actif

### Erreur : "Invalid JWT"
- La clé anon est incorrecte
- Copiez-collez à nouveau depuis Supabase

### Erreur : "Row Level Security"
- Vérifiez que les politiques RLS sont créées
- Exécutez à nouveau le schéma SQL

### Les rapports ne s'affichent pas
- Vérifiez que l'utilisateur est connecté
- Vérifiez dans "Table Editor" > "daily_reports"
- Consultez la console du navigateur (F12)

### L'utilisateur ne peut pas se connecter
- Vérifiez que l'email est confirmé (si activé)
- Vérifiez dans "Authentication" > "Users"
- Réinitialisez le mot de passe si nécessaire

## Limites du Plan Gratuit

Supabase plan gratuit inclut :
- 500 MB de stockage database
- 1 GB de transfert réseau/mois
- 2 GB de stockage fichiers
- 50 000 utilisateurs actifs mensuels
- 500 MB de bandwidth
- 2 CPU hours/jour

C'est largement suffisant pour commencer !

## Support

- Documentation Supabase : https://supabase.com/docs
- Discord Supabase : https://discord.supabase.com
- GitHub Issues : https://github.com/VOTRE_USERNAME/aquavision-pro/issues

## Prochaines Étapes

Maintenant que Supabase est configuré :

1. Créez des utilisateurs admin et techniciens
2. Ajoutez des cages
3. Testez le formulaire journalier
4. Déployez sur Netlify
5. Formez vos techniciens

Félicitations ! Votre système AquaVision Pro est maintenant prêt avec Supabase ! 🎉
