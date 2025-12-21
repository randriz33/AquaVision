# AquaVision Pro

<div align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue.svg" alt="Version">
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License">
  <img src="https://img.shields.io/badge/status-active-success.svg" alt="Status">
  <img src="https://img.shields.io/badge/PHP-7.4+-purple.svg" alt="PHP">
  <img src="https://img.shields.io/badge/JavaScript-ES6+-yellow.svg" alt="JavaScript">
</div>

<div align="center">
  <h3>Système de Monitoring Intelligent pour l'Aquaculture</h3>
  <p>Une application web moderne pour gérer et surveiller vos cages à poissons en temps réel</p>
</div>

---

## Aperçu

AquaVision Pro est une solution complète de gestion aquacole qui permet aux pisciculteurs de :
- Surveiller en temps réel l'état de leurs cages
- Recevoir des alertes automatiques
- Analyser les statistiques de mortalité
- Gérer l'historique des populations
- Accéder depuis n'importe quel appareil

## Fonctionnalités

### Fonctionnalités Principales

**Gestion des Cages**
- Ajout dynamique de nouvelles cages
- Modification en temps réel des populations
- Suivi du nombre initial de poissons
- Enregistrement de la mortalité

**Système d'Alertes Intelligent**
- Alertes de mortalité élevée (>10%)
- Notifications de population faible (<100 poissons)
- Validation des données incohérentes

**Analytics & Statistiques**
- Tableau de bord en temps réel
- Taux de survie global
- Score de performance
- Densité moyenne par cage

**Interface Utilisateur**
- Design futuriste avec animations océaniques
- Interface responsive (mobile/desktop)
- Mode sombre par défaut
- Animations fluides et immersives

### Fonctionnalités Techniques

- Mise à jour automatique de l'affichage
- Persistance des données (localStorage/API)
- API REST pour intégration
- Mode développement avec API Mock
- Architecture MVC évolutive

## Technologies Utilisées

### Frontend
- **HTML5** - Structure sémantique
- **CSS3** - Animations et design moderne
- **JavaScript ES6+** - Logique et interactivité
- **Web Animations API** - Effets visuels

### Backend (En développement)
- **PHP 7.4+** - Logique serveur
- **MySQL/MariaDB** - Base de données
- **Architecture MVC** - Organisation du code
- **API REST** - Communication client-serveur

## Installation

### Prérequis
- Navigateur web moderne (Chrome, Firefox, Safari, Edge)
- Serveur web (Apache, Nginx) - *optionnel pour la v1.0*
- PHP 7.4+ - *pour la version avec backend*
- Git

### Installation Rapide

1. **Cloner le repository**
```bash
git clone https://github.com/Randria33/aquavision-pro.git
cd aquavision-pro
```

2. **Lancer l'application**

Option A : Ouverture directe
```bash
# Ouvrir le fichier dans votre navigateur
open public/index.html  # macOS
xdg-open public/index.html  # Linux
start public/index.html  # Windows
```

Option B : Avec un serveur local
```bash
# Python 3
python -m http.server 8000

# PHP
php -S localhost:8000 -t public

# Node.js (avec http-server installé)
npx http-server public -p 8000
```

3. **Accéder à l'application**
```
http://localhost:8000
```

## Utilisation

### Guide de Démarrage

1. **Vue d'ensemble**
   - L'application affiche une grille de 8 cages par défaut
   - Chaque cage montre : numéro, poissons vivants/morts, statut

2. **Modifier une cage**
   - Cliquez sur une cage pour l'éditer
   - Entrez le nombre de poissons vivants
   - Ajoutez les nouvelles pertes
   - Le système calcule automatiquement

3. **Ajouter une cage**
   - Cliquez sur "Ajouter une Cage"
   - Entrez le numéro et la population initiale
   - La cage apparaît dans la grille

4. **Consulter les alertes**
   - Le panneau de contrôle affiche les alertes actives
   - Les cages problématiques sont mises en évidence

### Mode Développement

```javascript
// Ouvrir la console du navigateur (F12)

// Réinitialiser les données
aquavisionDev.reset()

// Simuler des changements aléatoires
aquavisionDev.simulate()

// Exporter les données
const backup = aquavisionDev.export()

// Voir toutes les cages
console.table(aquavisionDev.getCages())
```

## Structure du Projet

```
aquavision-pro/
├── public/                  # Fichiers publics accessibles
│   ├── index.html          # Page principale de l'application
│   └── assets/
│       ├── css/            # Styles et animations
│       ├── js/             # Scripts JavaScript
│       │   ├── app.js         # Script principal
│       │   ├── aquavision-update-manager.js  # Gestionnaire de MAJ
│       │   └── aquavision-api-mock.js        # API simulée
│       └── images/         # Images et icônes
├── app/                    # Code MVC (backend PHP)
│   ├── Controllers/        # Contrôleurs
│   ├── Models/            # Modèles de données
│   ├── Views/             # Vues PHP
│   └── Core/              # Classes principales
├── database/              # Base de données
│   ├── migrations/        # Scripts de migration
│   └── seeds/             # Données de test
├── docs/                  # Documentation
├── README.md              # Ce fichier
├── composer.json          # Dépendances PHP
├── package.json           # Dépendances JavaScript
└── .gitignore            # Fichiers ignorés par Git
```

## Configuration

### Variables d'Environnement (.env)
```env
APP_NAME=AquaVision Pro
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=aquavision
DB_USERNAME=root
DB_PASSWORD=

API_UPDATE_INTERVAL=30000  # Intervalle de mise à jour (ms)
```

## API Documentation

### Endpoints Disponibles

#### GET `/api/cages`
Récupère toutes les cages avec leurs statistiques
```json
{
  "success": true,
  "cages": [
    {
      "id": 1,
      "cage_number": 1,
      "initial_count": 200,
      "alive_count": 185,
      "total_dead": 15
    }
  ]
}
```

#### POST `/api/cages`
Crée une nouvelle cage
```json
// Request
{
  "cage_number": 9,
  "initial_count": 250
}
```

#### PUT `/api/cages/{id}`
Met à jour une cage existante
```json
// Request
{
  "alive_count": 180,
  "new_dead_count": 5
}
```

#### DELETE `/api/cages/{id}`
Supprime une cage

```json
// Response
{
  "success": true,
  "message": "Cage supprimée avec succès"
}
```

## Améliorations Recommandées

### Priorité Haute
- [ ] Export des données en CSV/Excel
- [ ] Graphiques d'évolution historique
- [ ] Notifications push (service worker)
- [ ] Mode hors-ligne avec synchronisation
- [ ] Utiliser des icônes SVG professionnelles (Lucide, Heroicons)

### Priorité Moyenne
- [ ] Filtres et recherche avancée
- [ ] Comparaison entre périodes
- [ ] Mode clair/sombre toggle
- [ ] Amélioration accessibilité (ARIA, contraste)
- [ ] Système de logs et debugging

### Priorité Basse
- [ ] WebSockets pour temps réel
- [ ] Pagination pour grandes listes
- [ ] Lazy loading des images
- [ ] Optimisation animations CSS
- [ ] Bundling avec Vite/Webpack

### Sécurité
- [ ] CSRF tokens
- [ ] Validation et sanitisation des entrées
- [ ] Rate limiting sur l'API
- [ ] Authentification JWT avec refresh tokens
- [ ] Chiffrement des données sensibles

## Roadmap

### Version 1.0 (Actuelle)
- [x] Interface utilisateur complète
- [x] Gestion des cages (CRUD)
- [x] Système d'alertes
- [x] Statistiques en temps réel
- [x] Mode développement avec API Mock

### Version 2.0 (Q1 2025)
- [ ] Backend PHP complet
- [ ] Base de données MySQL
- [ ] Authentification utilisateur
- [ ] Export CSV/PDF
- [ ] Historique des modifications

### Version 3.0 (Q2 2025)
- [ ] Application mobile
- [ ] Intégration IoT (capteurs)
- [ ] Machine Learning (prédictions)
- [ ] Multi-sites
- [ ] API publique

## Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créez votre branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

### Guidelines
- Respecter la structure MVC
- Commenter le code complexe
- Ajouter des tests si possible
- Suivre les conventions de nommage
- Éviter l'utilisation excessive d'emojis dans le code

## Signaler un Bug

Pour signaler un bug, ouvrez une [issue](https://github.com/Randria33/aquavision-pro/issues) avec :
- Description du problème
- Étapes pour reproduire
- Comportement attendu
- Screenshots si applicable

## Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## Auteur

**Randria33**
- GitHub: [@Randria33](https://github.com/Randria33)

## Remerciements

- Icônes SVG par Lucide Icons
- Inspiration design : interfaces futuristes sous-marines
- Communauté open source

## Support

Pour obtenir de l'aide :
- Email : contact@aquavision-pro.com
- Issues : [GitHub Issues](https://github.com/Randria33/aquavision-pro/issues)
- Wiki : [Documentation complète](https://github.com/Randria33/aquavision-pro/wiki)

---

<div align="center">
  <p>Fait avec passion pour révolutionner l'aquaculture</p>
  <p>AquaVision Pro - Gestion intelligente de cages à poissons</p>
</div>
