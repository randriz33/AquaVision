# 📝 FORMULAIRE SIMPLIFIÉ - GUIDE COMPLET

**Date:** 9 janvier 2026
**Version:** 3.0.0

---

## 🎯 OBJECTIF

Simplifier la saisie des données quotidiennes pour les techniciens avec un formulaire rapide et intuitif, tout en ajoutant les colonnes Ti2, Ti3, Ti4 pour suivre les types d'aliments consommés.

---

## ✨ NOUVEAUTÉS

### 1. Nouveau Formulaire Simplifié

**Fichier:** `public/simple-entry.html`

**Caractéristiques:**
- ✅ Design épuré et moderne
- ✅ Seulement les champs essentiels
- ✅ Sections organisées (Population, Alimentation, Eau, Santé, Remarques)
- ✅ Pré-remplissage automatique des dernières valeurs
- ✅ Affichage des infos de la cage sélectionnée
- ✅ Messages de succès/erreur clairs
- ✅ Enregistrement rapide en un clic

**Accès:**
- Depuis le dashboard: Bouton "👨‍🔧 Technicien"
- URL directe: `http://localhost:8000/simple-entry.html`
- Depuis le modal des cages: Bouton "✏️ Saisir les données"

### 2. Nouvelles Colonnes dans Supabase

**Colonnes ajoutées à `daily_reports`:**
- `ti2_consumed_kg` (DECIMAL) - Type d'aliment 2 consommé en kg
- `ti3_consumed_kg` (DECIMAL) - Type d'aliment 3 consommé en kg
- `ti4_consumed_kg` (DECIMAL) - Type d'aliment 4 consommé en kg

**Usage:**
Ti2, Ti3, Ti4 = Types/tailles d'aliments différents (ex: Ti2 = 2mm, Ti3 = 3mm, Ti4 = 4mm)

### 3. Affichage sur le Dashboard

**Cartes des Cages:**
- Remplacement de "Aliments consommés" par 3 lignes:
  - Ti2 consommés: XX.X kg
  - Ti3 consommés: XX.X kg
  - Ti4 consommés: XX.X kg

**Modal Détails:**
- Section Alimentation mise à jour avec les 3 types

---

## 🚀 ÉTAPES D'INSTALLATION

### Étape 1: Exécuter le Script SQL

1. Allez sur: https://supabase.com/dashboard/project/gswozuotdrfgvutitssf
2. Cliquez sur **"SQL Editor"** dans le menu gauche
3. Ouvrez le fichier: `supabase_add_feed_types.sql`
4. Copiez tout le contenu
5. Collez dans l'éditeur SQL de Supabase
6. Cliquez sur **"Run"** (ou Ctrl+Enter)

**Résultat attendu:**
```
ti2_consumed_kg | numeric | 0
ti3_consumed_kg | numeric | 0
ti4_consumed_kg | numeric | 0
```

### Étape 2: Commiter les Changements

```bash
git add .
git commit -m "feat: Add simplified entry form and Ti2/Ti3/Ti4 feed types"
git push origin main
```

### Étape 3: Tester Localement

```bash
# Démarrer le serveur local
python -m http.server 8000

# Ouvrir dans le navigateur:
# http://localhost:8000/index.html
```

---

## 📋 CHAMPS DU FORMULAIRE SIMPLIFIÉ

### 🐟 Sélection de la Cage
- **Cage** (requis) - Liste déroulante de toutes les cages actives
- **Infos automatiques:** Espèce, Population actuelle, Total décès, Dernier rapport

### 📊 Population
- **Nouvelles Pertes** - Nombre de poissons morts aujourd'hui
- **Raison des Pertes** - Ex: Prédation, Maladie, etc.

### 🍽️ Alimentation
- **Ti2 Consommés (kg)** - Aliment type 2
- **Ti3 Consommés (kg)** - Aliment type 3
- **Ti4 Consommés (kg)** - Aliment type 4
- **Type d'Aliment** - Description (ex: Granulés 2mm)
- **Acceptation Alimentaire** - Excellente / Bonne / Moyenne / Faible

### 💧 Paramètres de l'Eau
- **Température Eau (°C)**
- **pH**
- **Oxygène (mg/L)**

### 🏥 Santé et Comportement
- **Score de Santé (1-10)**
- **Comportement** - Normal / Très actif / Peu actif / Léthargique
- **Signes de Maladie** - Description ou "Aucun"

### 📝 Remarques
- **Observations Générales** - Zone de texte libre

---

## 🔄 FONCTIONNEMENT

### Saisie d'un Rapport

1. **Sélectionner une cage** dans la liste déroulante
2. Les **informations de la cage s'affichent** automatiquement
3. Les **dernières valeurs** (type d'aliment, acceptation) sont **pré-remplies**
4. Remplir uniquement les **champs modifiés**
5. Cliquer sur **"💾 Enregistrer le Rapport"**
6. **Message de succès** affiché
7. Formulaire **réinitialisé** après 2 secondes

### Calculs Automatiques

- **Population actuelle** = Population initiale - Nouvelles pertes
- **Total décès cumulé** = Ancien total + Nouvelles pertes
- **Mise à jour de la cage** en temps réel

---

## 📊 AFFICHAGE DES DONNÉES

### Dashboard Principal (index.html)

**Chaque carte de cage affiche maintenant:**
1. Population initiale
2. Population actuelle
3. Date ensemencement
4. Date récolte prévue
5. Nb décès cumulé
6. **Ti2 consommés** ✨ NOUVEAU
7. **Ti3 consommés** ✨ NOUVEAU
8. **Ti4 consommés** ✨ NOUVEAU
9. Biomasse estimée
10. Nb décès récents
11. Taux de survie

**Modal Détails > Section Alimentation:**
- Ti2 consommés (période) - Somme des 5 derniers rapports
- Ti3 consommés (période) - Somme des 5 derniers rapports
- Ti4 consommés (période) - Somme des 5 derniers rapports
- Type d'aliment
- Heure alimentation
- Repas par jour
- Acceptation
- Restes
- FCR
- Taux de croissance

---

## 🎨 DESIGN DU FORMULAIRE

### Caractéristiques Visuelles

- **Header bleu foncé** avec titre et bouton retour
- **Cartes blanches** avec ombres légères
- **Titres de section** avec émojis et ligne bleue
- **Champs large** (100% de largeur)
- **Grille responsive** pour les groupes de champs
- **Messages colorés** (vert = succès, rouge = erreur)
- **Boutons contrastés** (vert = enregistrer, gris = réinitialiser)

### Responsive Design

- ✅ Adapté mobile (cartes empilées)
- ✅ Adapté tablette (grille 2 colonnes)
- ✅ Adapté desktop (grille 3 colonnes)

---

## 🔐 SÉCURITÉ

### Validation des Données

- **Côté client:** Champs requis, types numériques, min/max
- **Côté serveur:** Supabase RLS (Row Level Security)
- **Transactions:** Insertion rapport + Mise à jour cage atomique

### Gestion des Erreurs

- Affichage des erreurs Supabase en console
- Message utilisateur convivial
- Pas de perte de données en cas d'erreur

---

## 📝 EXEMPLE DE WORKFLOW

### Scénario: Saisie Matinale

1. **Technicien arrive sur site**
2. Ouvre `http://localhost:8000/simple-entry.html`
3. Sélectionne **Cage N°1**
4. Voit: "2,000 poissons, 50 décès, Dernier rapport: 08/01/2026"
5. Entre:
   - Nouvelles pertes: 5
   - Ti2 consommés: 12.5 kg
   - Ti3 consommés: 8.0 kg
   - Ti4 consommés: 0 kg
   - Température eau: 24.5°C
   - pH: 7.2
   - Oxygène: 6.8 mg/L
   - Score santé: 8
   - Comportement: Normal
   - Remarques: "RAS - Poissons actifs"
6. Clique **"Enregistrer"**
7. Message: "✅ Rapport enregistré avec succès !"
8. Formulaire se réinitialise
9. Passe à la **Cage N°2**

**Temps estimé:** 2-3 minutes par cage

---

## 🐛 DÉPANNAGE

### Problème: Formulaire ne charge pas

**Solution:**
1. Vérifier console DevTools (F12)
2. Vérifier que Supabase est accessible
3. Vérifier URL: `http://localhost:8000/simple-entry.html`

### Problème: Colonnes ti2/ti3/ti4 non trouvées

**Solution:**
1. Aller sur Supabase Dashboard
2. SQL Editor
3. Exécuter: `SELECT * FROM daily_reports LIMIT 1;`
4. Vérifier que les colonnes existent
5. Si non, ré-exécuter `supabase_add_feed_types.sql`

### Problème: Données ne s'enregistrent pas

**Solution:**
1. Ouvrir DevTools > Console
2. Chercher erreurs rouges
3. Vérifier que `cage_id` est sélectionné
4. Vérifier RLS policies Supabase

### Problème: Dashboard ne montre pas ti2/ti3/ti4

**Solution:**
1. Vérifier que `supabase_add_feed_types.sql` a été exécuté
2. Rafraîchir le dashboard (Ctrl+F5)
3. Vérifier console pour erreurs JavaScript

---

## 📊 COMPARAISON: AVANT vs APRÈS

### AVANT

**Formulaire Technicien:**
- ❌ Très long (50+ champs)
- ❌ Sections trop détaillées
- ❌ Difficile à naviguer
- ❌ Temps de saisie: 10-15 minutes

**Dashboard:**
- ❌ "Aliments consommés" (total général)
- ❌ Pas de détail par type d'aliment

### APRÈS

**Formulaire Simplifié:**
- ✅ Court (15 champs essentiels)
- ✅ Sections claires et concises
- ✅ Navigation fluide
- ✅ Temps de saisie: 2-3 minutes

**Dashboard:**
- ✅ Ti2, Ti3, Ti4 séparés
- ✅ Suivi précis des types d'aliments
- ✅ Analyse détaillée possible

---

## 🎯 PROCHAINES ÉTAPES

### Phase 2 - Améliorations Futures

1. **Validation des données biométriques** (poids/longueur)
2. **Historique des saisies** (voir/modifier anciennes saisies)
3. **Photos** (upload depuis mobile)
4. **Mode hors-ligne** (sync quand connexion revient)
5. **Notifications** (rappel saisie quotidienne)
6. **Statistiques** (temps de saisie moyen, complétion)

### Phase 3 - Optimisations

1. **Auto-complétion intelligente** (basée sur historique)
2. **Alertes prédictives** (détecter anomalies avant)
3. **Rapports vocaux** (saisie par voix)
4. **Dashboard technicien** (vue personnalisée)

---

## 📞 SUPPORT

### En cas de problème:

1. Vérifier console DevTools (F12)
2. Vérifier fichier `VERIFICATION_SCHEMA.md`
3. Consulter logs Supabase
4. Chercher dans commit history

---

## ✅ CHECKLIST FINALE

Avant de déployer:

- [ ] SQL exécuté sur Supabase (ti2/ti3/ti4 ajoutés)
- [ ] Formulaire simplifié testé localement
- [ ] Dashboard affiche ti2/ti3/ti4 correctement
- [ ] Enregistrement de rapport fonctionne
- [ ] Mise à jour de cage fonctionne
- [ ] Modal affiche les nouvelles données
- [ ] Pas d'erreur en console DevTools
- [ ] Tout commité et pushé sur GitHub

---

**Version:** 3.0.0
**Dernière mise à jour:** 9 janvier 2026, 18:45

**Prêt pour production!** 🚀
