# 🐟 DONNÉES DES CAGES - RÉCAPITULATIF

**Date de création:** 9 janvier 2026
**Total des cages:** 23

---

## 📊 STATISTIQUES GLOBALES

| Métrique | Valeur |
|----------|--------|
| **Total cages** | 23 |
| **Population totale initiale** | 44,088 unités |
| **Population actuelle** | 44,088 unités |
| **Moyenne par cage** | 1,917 unités |

---

## 📅 RÉPARTITION PAR LOT D'ENSEMENCEMENT

### Lot 1: 7 mai 2025 → Récolte: 2 janvier 2026
**16 cages** | **32,000 unités**

| Cages |
|-------|
| N°1, N°2, N°3, N°5, N°7, N°9, N°10, N°11, N°12, N°13, N°15, N°16, N°17, N°18, N°19, N°23 |

**Caractéristiques:**
- 🗓️ Date d'ensemencement: 7 mai 2025
- 📆 Date de récolte prévue: 2 janvier 2026
- ⏱️ Durée d'élevage: 239 jours (~8 mois)
- 🐠 Population par cage: 2,000 unités
- 📍 Emplacement: Zone A

---

### Lot 2: 3 décembre 2025 → Récolte: 31 juillet 2026
**5 cages** | **9,840 unités**

| Cage | Population |
|------|------------|
| N°6 | 1,920 |
| N°14 | 1,800 |
| N°20 | 1,560 |
| N°21 | 2,280 |
| N°22 | 2,280 |

**Caractéristiques:**
- 🗓️ Date d'ensemencement: 3 décembre 2025
- 📆 Date de récolte prévue: 31 juillet 2026
- ⏱️ Durée d'élevage: 239 jours (~8 mois)
- 🐠 Population: variable (1,560 à 2,280)
- 📍 Emplacement: Zone B

---

### Lot 3: 12 décembre 2025 → Récolte: 9 août 2026
**2 cages** | **3,248 unités**

| Cage | Population |
|------|------------|
| N°4 | 1,972 |
| N°8 | 1,276 |

**Caractéristiques:**
- 🗓️ Date d'ensemencement: 12 décembre 2025
- 📆 Date de récolte prévue: 9 août 2026
- ⏱️ Durée d'élevage: 239 jours (~8 mois)
- 🐠 Population: variable (1,276 à 1,972)
- 📍 Emplacement: Zone B

---

## 📋 TABLEAU COMPLET DES CAGES

| Cage | Nd initial | Date ensemencement | Date récolte prévue | Zone | Statut |
|------|------------|-------------------|---------------------|------|--------|
| N°1 | 2,000 | 07-Mai-25 | 02-Jan-26 | Zone A | ✅ Active |
| N°2 | 2,000 | 07-Mai-25 | 02-Jan-26 | Zone A | ✅ Active |
| N°3 | 2,000 | 07-Mai-25 | 02-Jan-26 | Zone A | ✅ Active |
| N°4 | 1,972 | 12-Déc-25 | 09-Aoû-26 | Zone B | ✅ Active |
| N°5 | 2,000 | 07-Mai-25 | 02-Jan-26 | Zone A | ✅ Active |
| N°6 | 1,920 | 03-Déc-25 | 31-Jul-26 | Zone B | ✅ Active |
| N°7 | 2,000 | 07-Mai-25 | 02-Jan-26 | Zone A | ✅ Active |
| N°8 | 1,276 | 12-Déc-25 | 09-Aoû-26 | Zone B | ✅ Active |
| N°9 | 2,000 | 07-Mai-25 | 02-Jan-26 | Zone A | ✅ Active |
| N°10 | 2,000 | 07-Mai-25 | 02-Jan-26 | Zone A | ✅ Active |
| N°11 | 2,000 | 07-Mai-25 | 02-Jan-26 | Zone A | ✅ Active |
| N°12 | 2,000 | 07-Mai-25 | 02-Jan-26 | Zone A | ✅ Active |
| N°13 | 2,000 | 07-Mai-25 | 02-Jan-26 | Zone A | ✅ Active |
| N°14 | 1,800 | 03-Déc-25 | 31-Jul-26 | Zone B | ✅ Active |
| N°15 | 2,000 | 07-Mai-25 | 02-Jan-26 | Zone A | ✅ Active |
| N°16 | 2,000 | 07-Mai-25 | 02-Jan-26 | Zone A | ✅ Active |
| N°17 | 2,000 | 07-Mai-25 | 02-Jan-26 | Zone A | ✅ Active |
| N°18 | 2,000 | 07-Mai-25 | 02-Jan-26 | Zone A | ✅ Active |
| N°19 | 2,000 | 07-Mai-25 | 02-Jan-26 | Zone A | ✅ Active |
| N°20 | 1,560 | 03-Déc-25 | 31-Jul-26 | Zone B | ✅ Active |
| N°21 | 2,280 | 03-Déc-25 | 31-Jul-26 | Zone B | ✅ Active |
| N°22 | 2,280 | 03-Déc-25 | 31-Jul-26 | Zone B | ✅ Active |
| N°23 | 2,000 | 07-Mai-25 | 02-Jan-26 | Zone A | ✅ Active |

---

## 🚀 INSTALLATION DES DONNÉES

### Étape 1: Exécuter le script SQL

1. **Accédez à Supabase Dashboard:**
   - URL: https://supabase.com/dashboard/project/gswozuotdrfgvutitssf

2. **Ouvrez SQL Editor:**
   - Menu latéral → **SQL Editor**

3. **Copiez le script:**
   - Fichier: `supabase_create_cages.sql`
   - Copiez tout le contenu

4. **Collez et exécutez:**
   - Collez dans l'éditeur SQL
   - Cliquez **"Run"** (Ctrl+Enter)

5. **Vérifiez les résultats:**
   - Vous devriez voir 3 tableaux:
     1. Liste de toutes les cages
     2. Statistiques globales
     3. Répartition par lot

### Étape 2: Vérifier dans l'application

1. **Démarrez le serveur local:**
   ```bash
   python -m http.server 8000
   ```

2. **Ouvrez le dashboard:**
   - URL: http://localhost:8000/index.html

3. **Vérifiez:**
   - ✅ 23 cartes de cages affichées
   - ✅ Populations correctes
   - ✅ Dates correctes

### Étape 3: Test de saisie

1. **Ouvrez le formulaire simplifié:**
   - Cliquez sur "👨‍🔧 Technicien"
   - OU: http://localhost:8000/simple-entry.html

2. **Testez une cage:**
   - Sélectionnez "Cage N°1"
   - Entrez des données de test
   - Enregistrez

3. **Vérifiez:**
   - Retour au dashboard
   - Cage N°1 doit afficher les nouvelles données

---

## 📝 NOTES IMPORTANTES

### ⚠️ Gestion des Conflits

Le script utilise `ON CONFLICT` pour:
- **Si la cage existe déjà:** Met à jour les dates et populations
- **Si la cage n'existe pas:** Crée une nouvelle cage

### 🔄 Réinitialisation

**Pour supprimer toutes les cages et recommencer:**
1. Décommentez la ligne dans le script SQL:
   ```sql
   -- DELETE FROM cages;
   ```
2. Ré-exécutez le script complet

**⚠️ ATTENTION:** Cela supprimera toutes les données des rapports associés!

### 📊 Capacité par Défaut

Toutes les cages ont une capacité de **1,000 kg** par défaut.
Pour modifier:
```sql
UPDATE cages SET capacity = 1500 WHERE cage_number LIKE 'N°%';
```

### 🏷️ Espèce par Défaut

Toutes les cages sont configurées pour **"Tilapia"**.
Pour changer:
```sql
UPDATE cages SET species = 'Bar' WHERE cage_number IN ('N°1', 'N°2');
```

---

## 📈 CALENDRIER DE RÉCOLTE

### Janvier 2026
- **2 janvier:** 16 cages (Lot 1)
- **Population:** 32,000 unités

### Juillet 2026
- **31 juillet:** 5 cages (Lot 2)
- **Population:** 9,840 unités

### Août 2026
- **9 août:** 2 cages (Lot 3)
- **Population:** 3,248 unités

---

## 🎯 PROCHAINES ÉTAPES

1. ✅ **Exécuter** `supabase_create_cages.sql`
2. ✅ **Vérifier** les 23 cages sur le dashboard
3. ✅ **Tester** la saisie avec le formulaire simplifié
4. 📊 **Planifier** les saisies quotidiennes
5. 📈 **Suivre** l'évolution des populations

---

## 🔍 REQUÊTES UTILES

### Voir toutes les cages par zone
```sql
SELECT location, COUNT(*), SUM(alive_count)
FROM cages
GROUP BY location
ORDER BY location;
```

### Cages proches de la récolte (< 30 jours)
```sql
SELECT cage_number, stocking_date,
       stocking_date + INTERVAL '239 days' as harvest_date,
       (stocking_date + INTERVAL '239 days') - CURRENT_DATE as days_remaining
FROM cages
WHERE (stocking_date + INTERVAL '239 days') - CURRENT_DATE < 30
ORDER BY days_remaining;
```

### Population par mois d'ensemencement
```sql
SELECT
    TO_CHAR(stocking_date, 'Mon YYYY') as mois,
    COUNT(*) as nb_cages,
    SUM(initial_count) as population
FROM cages
GROUP BY TO_CHAR(stocking_date, 'Mon YYYY')
ORDER BY MIN(stocking_date);
```

---

**Dernière mise à jour:** 9 janvier 2026, 19:15
**Status:** ✅ Prêt pour insertion
