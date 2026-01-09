# CHECKLIST DE TEST - AquaVision Pro

**Date:** 22 décembre 2024
**Version:** 2.1.0
**Serveur local:** http://localhost:8000/index-supabase.html

---

## 🔐 1. AUTHENTIFICATION

### Connexion Admin
- [ ] Ouvrir http://localhost:8000/index-supabase.html
- [ ] Se connecter avec compte admin
- [ ] Vérifier redirection vers dashboard admin
- [ ] Vérifier que le menu "Dashboard Administrateur" s'affiche

### Connexion Technicien
- [ ] Se déconnecter
- [ ] Se connecter avec compte technicien
- [ ] Vérifier redirection vers dashboard technicien
- [ ] Vérifier que le formulaire de rapport s'affiche

---

## 👨‍💼 2. DASHBOARD ADMIN - Vue d'ensemble

### Statistiques
- [ ] Vérifier affichage du nombre total de cages
- [ ] Vérifier affichage du nombre de techniciens
- [ ] Vérifier affichage du nombre de rapports
- [ ] Vérifier affichage du nombre d'alertes actives

### Actions Rapides
- [ ] Bouton "Gérer les Cages" fonctionne
- [ ] Bouton "Voir les Rapports" fonctionne
- [ ] Bouton "Voir l'Activité" fonctionne

### Rapports Récents
- [ ] Tableau affiche les 10 derniers rapports
- [ ] Colonnes: Date, Cage, Technicien, Population, Nouvelles morts, Actions
- [ ] Bouton "Voir détails" présent sur chaque ligne

---

## 🏗️ 3. DASHBOARD ADMIN - Gestion des Cages

### Créer une Cage
- [ ] Cliquer sur "Nouvelle Cage"
- [ ] Modal s'ouvre avec titre "Créer une Cage"
- [ ] Remplir tous les champs:
  - Numéro de cage (obligatoire)
  - Emplacement
  - Espèce (obligatoire)
  - Capacité (kg)
  - Population initiale
  - Statut (active par défaut)
- [ ] Cliquer sur "Enregistrer"
- [ ] Vérifier message de succès
- [ ] Vérifier que la cage apparaît dans le tableau

### Modifier une Cage
- [ ] Cliquer sur "Modifier" (icône crayon) sur une cage existante
- [ ] Modal s'ouvre avec titre "Modifier la Cage"
- [ ] Vérifier que les champs sont pré-remplis
- [ ] Modifier un ou plusieurs champs
- [ ] Cliquer sur "Enregistrer"
- [ ] Vérifier message de succès
- [ ] Vérifier que les modifications sont visibles dans le tableau

### Supprimer une Cage
- [ ] Cliquer sur "Supprimer" (icône corbeille) sur une cage
- [ ] Confirmer la suppression dans la boîte de dialogue
- [ ] Vérifier message de succès
- [ ] Vérifier que la cage a disparu du tableau

### Tableau des Cages
- [ ] Vérifier colonnes: Cage, Emplacement, Espèce, Statut, Population, Total morts, Actions
- [ ] Vérifier badges de statut (active=vert, inactive=gris, maintenance=orange)
- [ ] Vérifier que toutes les données s'affichent correctement

---

## 📊 4. DASHBOARD ADMIN - Rapports

### Liste des Rapports
- [ ] Afficher la vue "Rapports"
- [ ] Vérifier que tous les rapports s'affichent
- [ ] Colonnes: Date, Cage, Technicien, Population, Nouvelles morts, Poids moyen, Biomasse, Temp eau, pH, Actions

### Voir Détails d'un Rapport
- [ ] Cliquer sur "Voir détails" sur un rapport
- [ ] Modal s'ouvre avec toutes les sections:
  - ✓ Informations Générales (date, cage, technicien, population, morts)
  - ✓ Données Biométriques (échantillon, poids, longueur, biomasse)
  - ✓ Paramètres Environnementaux (température, pH, oxygène, salinité, etc.)
  - ✓ Alimentation (quantité, type, FCR, acceptation)
  - ✓ Observations (remarques, incidents)
- [ ] Vérifier que toutes les données s'affichent correctement
- [ ] Fermer le modal

### Export CSV
- [ ] Cliquer sur "Exporter CSV"
- [ ] Vérifier que le fichier se télécharge
- [ ] Nom du fichier: `rapports_aquavision_YYYY-MM-DD.csv`
- [ ] Ouvrir le fichier CSV
- [ ] Vérifier les colonnes:
  - Date, Cage, Technicien, Population, Nouvelles_Morts
  - Poids_Moyen_g, Biomasse_kg, Temp_Eau, pH, Oxygene, FCR
- [ ] Vérifier que les données correspondent aux rapports affichés

---

## 📝 5. DASHBOARD ADMIN - Journal d'Activité

### Affichage du Journal
- [ ] Afficher la vue "Journal d'Activité"
- [ ] Vérifier que les activités s'affichent
- [ ] Colonnes: Date/Heure, Utilisateur, Action, Détails

### Types d'Actions
- [ ] Vérifier présence des actions de type "création" (badge vert)
- [ ] Vérifier présence des actions de type "modification" (badge orange)
- [ ] Vérifier présence des actions de type "suppression" (badge rouge)
- [ ] Vérifier présence des connexions (badge bleu)

### Traduction des Actions
- [ ] "cage_created" → "Cage créée"
- [ ] "cage_updated" → "Cage modifiée"
- [ ] "cage_deleted" → "Cage supprimée"
- [ ] "report_created" → "Rapport créé"
- [ ] "user_signin" → "Connexion"

---

## 👨‍🔧 6. DASHBOARD TECHNICIEN

### Sélection de Cage
- [ ] Se connecter avec compte technicien
- [ ] Vérifier que la liste des cages s'affiche
- [ ] Sélectionner une cage
- [ ] Vérifier affichage des informations de la cage
- [ ] Vérifier affichage des statistiques (population, morts, biomasse estimée)

### Données Biométriques
- [ ] Section "Données Biométriques" visible
- [ ] Ajouter 3 échantillons:
  - Poisson 1: 250g, 18cm
  - Poisson 2: 270g, 19cm
  - Poisson 3: 260g, 18.5cm
- [ ] Vérifier que les échantillons s'affichent dans la liste
- [ ] Vérifier le calcul automatique du poids moyen (≈260g)
- [ ] Vérifier le calcul automatique de la longueur moyenne (≈18.5cm)

### Créer un Rapport Quotidien
- [ ] Remplir tous les champs obligatoires:
  - Population vivante
  - Nouvelles morts
  - Raison des morts
  - Score de santé (0-10)
  - Température eau
  - pH
  - Oxygène
  - Quantité d'aliment (kg)
  - Nombre de repas/jour
  - Type d'aliment
  - Acceptation aliment
- [ ] Cliquer sur "Enregistrer le Rapport"
- [ ] Vérifier message de succès
- [ ] Vérifier que le rapport apparaît dans le dashboard admin

### Modification après Création
- [ ] Vérifier que le formulaire devient "Modification du Rapport"
- [ ] Modifier quelques champs
- [ ] Ajouter un nouvel échantillon biométrique
- [ ] Cliquer sur "Mettre à jour le Rapport"
- [ ] Vérifier message de succès
- [ ] Vérifier dans dashboard admin que les modifications sont prises en compte

---

## 🔧 7. VÉRIFICATIONS TECHNIQUES

### Erreurs Console
- [ ] Ouvrir les DevTools (F12)
- [ ] Onglet Console
- [ ] Vérifier qu'il n'y a pas d'erreurs rouges
- [ ] Vérifier logs de succès (✓ Supabase initialisé, etc.)

### Erreurs Réseau
- [ ] Onglet Network des DevTools
- [ ] Effectuer quelques opérations (création, modification)
- [ ] Vérifier que toutes les requêtes Supabase retournent 200 ou 201
- [ ] Vérifier qu'il n'y a pas de 400, 404, 500

### Synchronisation Base de Données
- [ ] Ouvrir Supabase Dashboard (https://gswozuotdrfgvutitssf.supabase.co)
- [ ] Table Editor → cages
- [ ] Créer une cage dans l'application
- [ ] Vérifier que la cage apparaît immédiatement dans Supabase
- [ ] Modifier la cage dans l'application
- [ ] Vérifier que les modifications sont dans Supabase

### Colonnes de la Base
- [ ] Vérifier qu'aucune erreur "column not found" n'apparaît
- [ ] Spécifiquement vérifier:
  - ✗ Pas d'erreur "updated_by" pour cages
  - ✗ Pas d'erreur "total_dead" pour daily_reports
  - ✓ "updated_by" fonctionne pour daily_reports

---

## 🎨 8. INTERFACE UTILISATEUR

### Responsive Design
- [ ] Tester sur écran large (desktop)
- [ ] Tester sur écran moyen (tablette)
- [ ] Réduire la fenêtre progressivement
- [ ] Vérifier que les éléments s'adaptent correctement

### Navigation
- [ ] Tous les boutons sont cliquables
- [ ] Les icônes Lucide s'affichent correctement
- [ ] Les modals s'ouvrent et se ferment correctement
- [ ] Les transitions sont fluides

### Styles
- [ ] Les couleurs sont cohérentes
- [ ] Les badges ont les bonnes couleurs (statut, actions)
- [ ] Les tableaux sont lisibles
- [ ] Les formulaires sont bien alignés

---

## ✅ RÉSULTAT FINAL

### Fonctionnalités Admin Complètes
- [ ] ✅ Gestion cages (CRUD complet)
- [ ] ✅ Vue détaillée des rapports
- [ ] ✅ Export CSV
- [ ] ✅ Journal d'activité

### Fonctionnalités Technicien
- [ ] ✅ Sélection de cage
- [ ] ✅ Données biométriques multiples
- [ ] ✅ Création de rapport
- [ ] ✅ Modification de rapport

### Tests Réussis
- [ ] Aucune erreur console
- [ ] Toutes les opérations CRUD fonctionnent
- [ ] Synchronisation avec Supabase OK
- [ ] Export CSV fonctionne
- [ ] Interface responsive

---

## 📦 PRÊT POUR DÉPLOIEMENT

Si tous les tests ci-dessus sont ✅, l'application est prête pour être déployée sur Netlify.

Voir: `DEPLOIEMENT_NETLIFY.txt` pour les instructions de déploiement.

---

**Notes:**
- Tester avec compte admin ET compte technicien
- Vérifier la console pour les erreurs
- Tester sur plusieurs navigateurs si possible (Chrome, Firefox, Edge)
- S'assurer que toutes les données sont bien enregistrées dans Supabase
