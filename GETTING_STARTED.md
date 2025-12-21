# Guide de Démarrage Rapide - AquaVision Pro

## Démarrage Immédiat (3 méthodes)

### Méthode 1 : Ouverture Directe (Le plus simple)
Double-cliquez sur le fichier `public/index.html`

### Méthode 2 : Avec Python
```bash
python -m http.server 8000 --directory public
```
Puis ouvrez http://localhost:8000

### Méthode 3 : Avec PHP
```bash
php -S localhost:8000 -t public
```
Puis ouvrez http://localhost:8000

### Méthode 4 : Avec Node.js
```bash
npm install
npm run dev
```

## Première Utilisation

### 1. Ajouter des données d'exemple
Ouvrez la console du navigateur (F12) et tapez :
```javascript
aquavisionDev.addSampleData()
```

### 2. Explorer l'interface
- Tableau de bord avec statistiques en temps réel
- Grille de cages interactive
- Système d'alertes automatique
- Mode clair/sombre

### 3. Gérer les cages
- Cliquez sur "Ajouter une Cage" pour créer une nouvelle cage
- Cliquez sur une cage existante pour la modifier
- Les alertes s'affichent automatiquement si nécessaire

## Fonctionnalités Clés

### Gestion des Cages
- Ajout/modification de cages
- Suivi en temps réel des populations
- Calcul automatique de la mortalité
- Alertes intelligentes

### Tableau de Bord
- Nombre total de cages actives
- Population de poissons vivants
- Taux de survie global
- Nombre d'alertes actives

### Système d'Alertes
- Mortalité élevée (>10%)
- Population faible (<100 poissons)
- Données incohérentes

### Thème
- Mode sombre par défaut (élégant)
- Mode clair disponible
- Changement via le bouton en haut à droite

## Outils de Développement

Console du navigateur (F12) :

```javascript
// Ajouter des données d'exemple
aquavisionDev.addSampleData()

// Voir toutes les cages dans un tableau
aquavisionDev.getCages()

// Simuler des changements aléatoires
aquavisionDev.simulate()

// Exporter les données JSON
aquavisionDev.export()

// Réinitialiser toutes les données
aquavisionDev.reset()
```

## Structure du Projet

```
Gestion cage/
├── public/                     # Frontend
│   ├── index.html             # Page principale
│   └── assets/
│       ├── css/
│       │   └── style.css      # Styles complets
│       └── js/
│           ├── app.js         # Logique principale
│           └── aquavision-api-mock.js  # API simulée
├── app/                       # Backend (à implémenter)
├── database/                  # Base de données
├── docs/                      # Documentation
├── package.json               # Config Node.js
├── composer.json              # Config PHP
├── .env                       # Variables d'environnement
└── .gitignore                # Fichiers ignorés par Git
```

## Améliorations Disponibles

### Ce qui est implémenté
- Interface complète et responsive
- Gestion CRUD des cages
- Système d'alertes intelligent
- Statistiques en temps réel
- Persistance localStorage
- API Mock complète
- Mode clair/sombre
- Icônes SVG professionnelles (Lucide)

### À implémenter ensuite (Voir README.md)
- Backend PHP avec API REST
- Base de données MySQL
- Export CSV/Excel
- Graphiques historiques
- Notifications push
- Mode hors-ligne

## Configuration

### Seuils d'alerte (.env)
```env
HIGH_MORTALITY_THRESHOLD=10       # Seuil de mortalité élevée (%)
LOW_POPULATION_THRESHOLD=100      # Seuil de population faible
```

### Personnalisation CSS
Toutes les couleurs et espacements sont définis avec des variables CSS dans `style.css` :
```css
:root {
    --color-primary: #0ea5e9;
    --color-success: #10b981;
    --color-warning: #f59e0b;
    --color-danger: #ef4444;
}
```

## Support

- Issues : https://github.com/Randria33/aquavision-pro/issues
- Documentation complète : Voir README.md

## Prochaines Étapes

1. Tester l'application
2. Ajouter vos propres données
3. Explorer les fonctionnalités
4. Consulter le README.md pour les améliorations futures
5. Commencer le développement du backend (voir roadmap)

Bon développement avec AquaVision Pro !
