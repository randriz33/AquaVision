# 📁 STRUCTURE DU PROJET - AquaVision Pro

**Version:** 4.0.0
**Date:** 10 janvier 2026

---

## 🌳 ARBORESCENCE

```
Gestion cage/
│
├── 📂 public/                          # Application web
│   ├── index.html                      # Dashboard principal (v4.0)
│   ├── index-supabase.html             # Dashboard admin/tech
│   ├── simple-entry.html               # Formulaire simplifié
│   └── 📂 assets/
│       ├── 📂 css/
│       │   └── style.css
│       └── 📂 js/
│           ├── admin-dashboard.js
│           ├── auth.js
│           ├── supabase-client.js
│           ├── technician-dashboard.js
│           ├── app.js
│           ├── aquavision-api-mock.js
│           └── quick-entry.js
│
├── 📄 readme.md                        # README principal
├── 📄 LICENSE                          # Licence MIT
│
├── 📂 Documentation/
│   ├── GUIDE_RAPIDE.md                 # Guide utilisateur
│   ├── CAGES_DATA.md                   # Données des 23 cages
│   ├── FORMULAIRE_SIMPLIFIE.md         # Guide formulaire v3.0
│   ├── NOUVELLES_FONCTIONNALITES.md    # Guide v4.0
│   └── VERIFICATION_SCHEMA.md          # Schéma base de données
│
├── 📂 SQL/
│   ├── supabase_add_feed_types.sql     # Migration Ti2/Ti3/Ti4
│   ├── supabase_create_cages.sql       # Création 23 cages
│   └── supabase_public_policies.sql    # Policies RLS
│
├── 📂 Configuration/
│   ├── .env                            # Variables d'environnement
│   ├── .gitignore                      # Fichiers ignorés
│   ├── netlify.toml                    # Config déploiement
│   ├── package.json                    # Dépendances Node
│   └── composer.json                   # Dépendances PHP (legacy)
│
├── 📂 .git/                            # Historique Git
├── 📂 .claude/                         # Config Claude Code
│
└── 📂 _ARCHIVES/                       # Fichiers obsolètes
    ├── README.md
    ├── 📂 old_docs/                    # 19 fichiers .md obsolètes
    └── 📂 old_folders/                 # app/, database/, docs/
```

---

## 📋 FICHIERS ESSENTIELS

### 🌐 Application Web

#### 1. index.html (50KB)
**Rôle:** Dashboard principal
**Fonctionnalités:**
- Affichage des 23 cages (grille optimisée)
- Bouton "Ajouter Cage" (modal)
- Bouton "Export Excel" (toutes les cages)
- Clic sur cage → Modal détails
- Modal → Historique complet
- Modal → Export Excel cage spécifique

**Technologies:**
- Supabase JS v2
- SheetJS (xlsx 0.20.1)
- Vanilla JavaScript
- CSS Grid responsive

**Taille optimisée:** Cartes 220px, 6 lignes/carte

#### 2. simple-entry.html (20KB)
**Rôle:** Formulaire de saisie rapide
**Fonctionnalités:**
- Sélection cage (dropdown)
- 15 champs essentiels (vs 50+ avant)
- Ti2/Ti3/Ti4 séparés
- Auto-remplissage dernières valeurs
- Enregistrement 2-3 min/cage

**Sections:**
- Population (2 champs)
- Alimentation (5 champs)
- Eau (3 champs)
- Santé (3 champs)
- Remarques (1 champ)

#### 3. index-supabase.html (4KB)
**Rôle:** Point d'entrée admin/tech
**Redirection vers:**
- Admin dashboard (si role=admin)
- Technicien dashboard (si role=tech)

#### 4. assets/js/
**7 fichiers JavaScript:**
- `admin-dashboard.js` (31KB) - Vue admin complète
- `technician-dashboard.js` (45KB) - Formulaire tech complet
- `supabase-client.js` (16KB) - API wrapper
- `auth.js` (16KB) - Authentification
- `app.js` (24KB) - Logique principale
- `aquavision-api-mock.js` (13KB) - Mock API (dev)
- `quick-entry.js` (12KB) - Saisie rapide

#### 5. assets/css/
- `style.css` (23KB) - Styles globaux

---

## 📚 DOCUMENTATION

### 1. readme.md (11KB)
**Contenu:**
- Vue d'ensemble du projet
- Technologies utilisées
- Installation locale
- Déploiement Netlify
- Liens utiles

### 2. GUIDE_RAPIDE.md (6KB)
**Contenu:**
- Accès rapide
- Comptes de test
- Fonctionnalités principales
- Workflow technicien
- Tests essentiels (5 min)

### 3. CAGES_DATA.md (7KB)
**Contenu:**
- Statistiques 23 cages
- Répartition par lot (3 lots)
- Tableau complet
- Instructions installation SQL
- Calendrier de récolte

### 4. FORMULAIRE_SIMPLIFIE.md (9KB)
**Contenu:**
- Guide formulaire v3.0
- 15 champs détaillés
- Workflow saisie
- Comparaison avant/après

### 5. NOUVELLES_FONCTIONNALITES.md (6KB)
**Contenu:**
- 3 fonctionnalités v4.0:
  1. Ajouter cage
  2. Voir historique
  3. Export Excel
- Guide complet
- Dépannage

### 6. VERIFICATION_SCHEMA.md (4KB)
**Contenu:**
- Schéma base de données
- 8 tables Supabase
- Colonnes de chaque table
- Colonnes Ti2/Ti3/Ti4 (nouveaux)

---

## 🗄️ SCRIPTS SQL

### 1. supabase_create_cages.sql (6.5KB)
**Rôle:** Créer les 23 cages
**Contenu:**
- INSERT 23 cages
- ON CONFLICT (sécurisé)
- Requêtes vérification
- Statistiques

**Exécution:**
```sql
-- Supabase Dashboard → SQL Editor → Run
```

### 2. supabase_add_feed_types.sql (1.8KB)
**Rôle:** Ajouter colonnes Ti2/Ti3/Ti4
**Contenu:**
```sql
ALTER TABLE daily_reports
ADD COLUMN ti2_consumed_kg DECIMAL(10,2) DEFAULT 0,
ADD COLUMN ti3_consumed_kg DECIMAL(10,2) DEFAULT 0,
ADD COLUMN ti4_consumed_kg DECIMAL(10,2) DEFAULT 0;
```

### 3. supabase_public_policies.sql (2.3KB)
**Rôle:** Policies RLS pour accès public
**Contenu:**
```sql
CREATE POLICY "Allow public read on cages"
ON cages FOR SELECT TO anon USING (true);
-- + daily_reports, biometric_samples
```

---

## ⚙️ CONFIGURATION

### 1. .env
```
SUPABASE_URL=https://gswozuotdrfgvutitssf.supabase.co
SUPABASE_ANON_KEY=eyJ...
```

### 2. .gitignore
```
.env
node_modules/
_ARCHIVES/
.DS_Store
```

### 3. netlify.toml
```toml
[build]
  publish = "public"
  command = "echo 'No build needed'"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 4. package.json
```json
{
  "name": "aquavision-pro",
  "version": "4.0.0",
  "description": "Gestion de cages aquaculture"
}
```

---

## 🔧 MAINTENANCE

### Ajouter un Fichier
```bash
# Créer le fichier
touch nouveau_fichier.md

# Ajouter à Git
git add nouveau_fichier.md
git commit -m "docs: Add nouveau fichier"
git push
```

### Archiver un Fichier
```bash
# Déplacer vers archives
mv fichier_obsolete.md _ARCHIVES/old_docs/

# Commit
git add -A
git commit -m "chore: Archive obsolete file"
git push
```

### Restaurer un Fichier
```bash
# Depuis archives
mv _ARCHIVES/old_docs/fichier.md ./

# Commit
git add -A
git commit -m "chore: Restore file"
git push
```

---

## 📊 STATISTIQUES

**Total fichiers actifs:** ~40 fichiers
**Taille totale:** ~500 KB
**Fichiers archivés:** 22 (19 docs + 3 folders)
**Lignes de code:** ~15,000 lignes

**Répartition:**
- HTML/JS: 60%
- Documentation: 30%
- SQL/Config: 10%

---

## 🚀 WORKFLOW DÉVELOPPEMENT

### 1. Modification Code
```bash
# Modifier fichier
code public/index.html

# Tester local
python -m http.server 8000

# Commit
git add public/index.html
git commit -m "feat: Update dashboard"
git push
```

### 2. Ajout Fonctionnalité
```bash
# Créer branche
git checkout -b feature/nouvelle-fonction

# Développer
# ...

# Merger
git checkout main
git merge feature/nouvelle-fonction
git push
```

### 3. Documentation
```bash
# Créer doc
touch NOUVELLE_FEATURE.md

# Écrire
code NOUVELLE_FEATURE.md

# Commit
git add NOUVELLE_FEATURE.md
git commit -m "docs: Add feature documentation"
git push
```

---

## 📖 LIENS UTILES

**Repository:** https://github.com/randriz33/AquaVision
**Supabase:** https://supabase.com/dashboard/project/gswozuotdrfgvutitssf
**Netlify:** https://app.netlify.com

---

**Dernière mise à jour:** 10 janvier 2026
**Maintenu par:** AquaVision Team
