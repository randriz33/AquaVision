# 🚀 GUIDE RAPIDE - AquaVision Pro

## 📍 Accès Rapide

**Application locale:** http://localhost:8000/index-supabase.html

**Base de données:** https://gswozuotdrfgvutitssf.supabase.co

---

## 👤 Comptes de Test

### Admin
```
Email: admin@aquavision.com
Mot de passe: [votre mot de passe admin]
```

### Technicien
```
Email: tech@aquavision.com
Mot de passe: [votre mot de passe technicien]
```

---

## 🎯 Fonctionnalités Principales

### 👨‍💼 DASHBOARD ADMIN

#### 1️⃣ Vue d'ensemble
- **Statistiques en temps réel**: Cages, techniciens, rapports, alertes
- **Actions rapides**: Accès direct aux sections principales
- **Rapports récents**: 10 derniers rapports avec détails

#### 2️⃣ Gestion des Cages
- ➕ **Créer une cage**: Bouton "Nouvelle Cage"
  - Champs: Numéro, emplacement, espèce, capacité, population initiale, statut
- ✏️ **Modifier une cage**: Icône crayon sur chaque ligne
- 🗑️ **Supprimer une cage**: Icône corbeille (avec confirmation)
- 📊 **Statuts**: Active (vert) | Inactive (gris) | Maintenance (orange)

#### 3️⃣ Rapports
- 📋 **Liste complète**: Tous les rapports avec filtrage
- 👁️ **Détails complets**: Modal avec toutes les données
  - Informations générales
  - Données biométriques
  - Paramètres environnementaux
  - Alimentation et comportement
  - Observations et incidents
- 💾 **Export CSV**: Téléchargement instantané

#### 4️⃣ Journal d'Activité
- 📝 Toutes les actions utilisateurs
- 🎨 Codes couleurs:
  - 🟢 Vert = Création
  - 🟠 Orange = Modification
  - 🔴 Rouge = Suppression
  - 🔵 Bleu = Connexion

---

### 👨‍🔧 DASHBOARD TECHNICIEN

#### 1️⃣ Sélection de Cage
- Liste déroulante avec toutes les cages actives
- Affichage immédiat des informations de la cage
- Statistiques: population, morts, biomasse estimée

#### 2️⃣ Données Biométriques
- ➕ Ajouter plusieurs échantillons
- Champs: Numéro poisson, Poids (g), Longueur (cm)
- Calcul automatique des moyennes
- Liste des échantillons avec suppression

#### 3️⃣ Rapport Quotidien
**Sections du formulaire:**
- 📊 **Population**: Vivants, morts, raison
- 🏥 **Santé**: Score, signes de maladie, parasites
- 🌡️ **Environnement**: Températures, pH, oxygène, salinité, etc.
- 🍽️ **Alimentation**: Quantité, type, FCR, acceptation
- 🔧 **Maintenance**: Nettoyage, équipement
- 📝 **Observations**: Comportement, incidents, remarques

**Actions:**
- 💾 **Créer**: Bouton "Enregistrer le Rapport"
- ✏️ **Modifier**: Le rapport du jour peut être modifié

---

## 🔍 Vérifications Importantes

### ✅ À vérifier avant test
1. Serveur local actif sur port 8000
2. Connexion Supabase configurée
3. Au moins 1 cage créée dans la base
4. Comptes admin et technicien créés

### ❌ Erreurs communes
- **"updated_by not found"** → ✅ CORRIGÉ (cages n'a pas cette colonne)
- **"total_dead not found"** → ✅ CORRIGÉ (calcul déplacé vers updateCage)
- **Modal ne s'ouvre pas** → Vérifier Lucide icons chargés
- **Données ne s'affichent pas** → Vérifier console DevTools

---

## 🧪 Tests Essentiels (5 minutes)

### Test 1: Admin - Créer une cage
1. Se connecter comme admin
2. Aller dans "Gestion des Cages"
3. Cliquer "Nouvelle Cage"
4. Remplir: C-TEST-01, Bassin A, Tilapia, 1000kg, 500 poissons
5. Enregistrer → ✅ Doit apparaître dans le tableau

### Test 2: Technicien - Rapport quotidien
1. Se connecter comme technicien
2. Sélectionner la cage C-TEST-01
3. Ajouter 3 échantillons biométriques
4. Remplir le formulaire complet
5. Enregistrer → ✅ Message de succès

### Test 3: Admin - Voir détails
1. Retour au dashboard admin
2. Aller dans "Rapports"
3. Cliquer "Voir détails" sur le rapport créé
4. Vérifier toutes les sections → ✅ Toutes les données présentes

### Test 4: Admin - Export CSV
1. Rester dans "Rapports"
2. Cliquer "Exporter CSV"
3. Ouvrir le fichier téléchargé → ✅ Données correctes

### Test 5: Admin - Journal
1. Aller dans "Journal d'Activité"
2. Vérifier les 4 dernières actions
3. Doit contenir: création cage, rapport, visualisation → ✅

---

## 📦 Déploiement

Une fois tous les tests passés:

```bash
# 1. Vérifier que tout est commité
git status

# 2. Commit final si nécessaire
git add .
git commit -m "test: All features verified and working"
git push origin main

# 3. Déployer sur Netlify
# Voir DEPLOIEMENT_NETLIFY.txt
```

---

## 📚 Documentation

- **Setup Supabase**: `SUPABASE_SETUP.md`
- **Tests complets**: `TEST_CHECKLIST.md`
- **Plan Admin**: `ADMIN_DASHBOARD_PLAN.md`
- **Schema BDD**: `VERIFICATION_SCHEMA.md`
- **Déploiement**: `DEPLOIEMENT_NETLIFY.txt`

---

## 🆘 Support

**Problème technique?**
1. Vérifier console DevTools (F12)
2. Vérifier Network tab (requêtes Supabase)
3. Consulter `VERIFICATION_SCHEMA.md` pour colonnes BDD
4. Relire les erreurs corrigées dans commit history

**Logs Supabase:**
- Dashboard Supabase → Logs → Database
- Vérifier les requêtes SQL exécutées

---

## ✨ Prochaines Étapes (Post-déploiement)

### Phase 2 - Important
- 👥 Gestion des utilisateurs (créer, modifier techniciens)
- 🔍 Filtres avancés (date, cage, technicien)
- 📧 Notifications par email

### Phase 3 - Nice to have
- 📊 Graphiques et analytics (tendances, courbes)
- 📦 Inventaire aliments (stock, alertes)
- 🎯 Objectifs de production (suivi vs réel)

---

**Version:** 2.1.0 - Complete
**Dernière mise à jour:** 22 décembre 2024
