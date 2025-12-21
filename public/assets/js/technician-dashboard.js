/**
 * AquaVision Pro - Technician Dashboard
 * Formulaire journalier pour techniciens
 * @version 2.0.0
 */

class TechnicianDashboard {
    static cages = [];
    static selectedCage = null;
    static todayReports = new Map();

    static async init() {
        await this.loadCages();
        this.render();
    }

    static async loadCages() {
        const result = await SupabaseService.getCages();
        if (result.success) {
            this.cages = result.cages;
        }
    }

    static render() {
        const content = document.getElementById('mainContent');
        if (!content) return;

        const today = new Date().toISOString().split('T')[0];
        const formattedDate = new Date().toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        content.innerHTML = `
            <div class="container">
                <!-- Daily Report Header -->
                <section class="daily-report-header">
                    <div class="report-date-section">
                        <i data-lucide="calendar"></i>
                        <div>
                            <h1>Rapport Journalier</h1>
                            <p class="report-date">${formattedDate}</p>
                        </div>
                    </div>
                    <div class="report-stats">
                        <div class="stat-box">
                            <span class="stat-number" id="reportProgress">0/${this.cages.length}</span>
                            <span class="stat-label">Rapports complétés</span>
                        </div>
                    </div>
                </section>

                <!-- Cages List -->
                <section class="cages-report-section">
                    <div class="section-header">
                        <h2 class="section-title">
                            <i data-lucide="list-checks"></i>
                            Cages à Vérifier
                        </h2>
                    </div>

                    <div class="cages-report-grid" id="cagesReportGrid">
                        ${this.cages.map(cage => this.renderCageCard(cage)).join('')}
                    </div>
                </section>
            </div>

            <!-- Report Modal -->
            <div class="modal" id="reportModal">
                <div class="modal-overlay" id="reportModalOverlay"></div>
                <div class="modal-content modal-large">
                    <div class="modal-header">
                        <h3 class="modal-title" id="reportModalTitle">Rapport Journalier</h3>
                        <button class="modal-close" id="reportModalClose">
                            <i data-lucide="x"></i>
                        </button>
                    </div>
                    <form class="modal-body" id="dailyReportForm">
                        <div id="reportFormContent"></div>
                    </form>
                </div>
            </div>
        `;

        lucide.createIcons();
        this.setupListeners();
        this.loadTodayReports();
    }

    static renderCageCard(cage) {
        const hasReport = this.todayReports.has(cage.id);
        const statusClass = hasReport ? 'completed' : 'pending';
        const statusIcon = hasReport ? 'check-circle' : 'circle';

        return `
            <div class="cage-report-card ${statusClass}" data-cage-id="${cage.id}">
                <div class="cage-report-status">
                    <i data-lucide="${statusIcon}"></i>
                </div>
                <div class="cage-report-info">
                    <h3>Cage ${cage.cage_number}</h3>
                    <p>${cage.location || 'Emplacement non défini'}</p>
                    <div class="cage-report-meta">
                        <span><i data-lucide="fish"></i> ${cage.alive_count} poissons</span>
                    </div>
                </div>
                <button class="btn btn-sm ${hasReport ? 'btn-secondary' : 'btn-primary'}"
                        onclick="TechnicianDashboard.openReportForm('${cage.id}')">
                    <i data-lucide="${hasReport ? 'edit' : 'plus'}"></i>
                    ${hasReport ? 'Modifier' : 'Remplir'}
                </button>
            </div>
        `;
    }

    static async loadTodayReports() {
        for (const cage of this.cages) {
            const result = await SupabaseService.getTodayReport(cage.id);
            if (result.success && result.report) {
                this.todayReports.set(cage.id, result.report);
            }
        }

        // Update progress
        const progress = document.getElementById('reportProgress');
        if (progress) {
            progress.textContent = `${this.todayReports.size}/${this.cages.length}`;
        }

        // Re-render cards
        const grid = document.getElementById('cagesReportGrid');
        if (grid) {
            grid.innerHTML = this.cages.map(cage => this.renderCageCard(cage)).join('');
            lucide.createIcons();
        }
    }

    static openReportForm(cageId) {
        this.selectedCage = this.cages.find(c => c.id === cageId);
        if (!this.selectedCage) return;

        const existingReport = this.todayReports.get(cageId);
        const modal = document.getElementById('reportModal');
        const modalTitle = document.getElementById('reportModalTitle');
        const formContent = document.getElementById('reportFormContent');

        modalTitle.textContent = `Rapport Journalier - Cage ${this.selectedCage.cage_number}`;

        const today = new Date().toISOString().split('T')[0];

        formContent.innerHTML = `
            <input type="hidden" id="report_cage_id" value="${cageId}">
            <input type="hidden" id="report_date" value="${today}">
            ${existingReport ? `<input type="hidden" id="report_id" value="${existingReport.id}">` : ''}

            <!-- Population Section -->
            <div class="form-section-title">
                <i data-lucide="fish"></i>
                Données de Population
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">
                        <i data-lucide="heart"></i>
                        Poissons Vivants
                    </label>
                    <input
                        type="number"
                        id="report_alive_count"
                        class="form-input"
                        value="${existingReport?.alive_count || this.selectedCage.alive_count}"
                        required
                        min="0"
                    >
                </div>

                <div class="form-group">
                    <label class="form-label">
                        <i data-lucide="x-circle"></i>
                        Nouvelles Pertes
                    </label>
                    <input
                        type="number"
                        id="report_new_dead"
                        class="form-input"
                        value="${existingReport?.new_dead || 0}"
                        min="0"
                    >
                </div>
            </div>

            <!-- Biometric Data Section (NEW) -->
            <div class="form-section-title">
                <i data-lucide="ruler"></i>
                Données Biométriques
            </div>

            <div class="form-group">
                <label class="form-label">
                    <i data-lucide="hash"></i>
                    Taille de l'Échantillon
                </label>
                <input
                    type="number"
                    id="report_sample_size"
                    class="form-input"
                    value="${existingReport?.sample_size || ''}"
                    placeholder="Nombre de poissons mesurés"
                    min="0"
                >
                <small class="form-hint">Nombre de poissons mesurés pour les données suivantes</small>
            </div>

            <div class="form-section-subtitle">
                <i data-lucide="weight"></i>
                Poids des Poissons
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">
                        <i data-lucide="minus-circle"></i>
                        Poids Minimum (g)
                    </label>
                    <input
                        type="number"
                        id="report_min_weight"
                        class="form-input"
                        step="0.01"
                        value="${existingReport?.min_weight_g || ''}"
                        placeholder="Ex: 150.5"
                        min="0"
                    >
                </div>

                <div class="form-group">
                    <label class="form-label">
                        <i data-lucide="target"></i>
                        Poids Moyen (g)
                    </label>
                    <input
                        type="number"
                        id="report_avg_weight"
                        class="form-input"
                        step="0.01"
                        value="${existingReport?.average_weight_g || ''}"
                        placeholder="Ex: 250.75"
                        min="0"
                    >
                </div>

                <div class="form-group">
                    <label class="form-label">
                        <i data-lucide="plus-circle"></i>
                        Poids Maximum (g)
                    </label>
                    <input
                        type="number"
                        id="report_max_weight"
                        class="form-input"
                        step="0.01"
                        value="${existingReport?.max_weight_g || ''}"
                        placeholder="Ex: 350.25"
                        min="0"
                    >
                </div>
            </div>

            <div class="form-section-subtitle">
                <i data-lucide="move-vertical"></i>
                Taille des Poissons
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">
                        <i data-lucide="minus-circle"></i>
                        Longueur Minimum (cm)
                    </label>
                    <input
                        type="number"
                        id="report_min_length"
                        class="form-input"
                        step="0.01"
                        value="${existingReport?.min_length_cm || ''}"
                        placeholder="Ex: 15.5"
                        min="0"
                    >
                </div>

                <div class="form-group">
                    <label class="form-label">
                        <i data-lucide="target"></i>
                        Longueur Moyenne (cm)
                    </label>
                    <input
                        type="number"
                        id="report_avg_length"
                        class="form-input"
                        step="0.01"
                        value="${existingReport?.average_length_cm || ''}"
                        placeholder="Ex: 22.5"
                        min="0"
                    >
                </div>

                <div class="form-group">
                    <label class="form-label">
                        <i data-lucide="plus-circle"></i>
                        Longueur Maximum (cm)
                    </label>
                    <input
                        type="number"
                        id="report_max_length"
                        class="form-input"
                        step="0.01"
                        value="${existingReport?.max_length_cm || ''}"
                        placeholder="Ex: 28.0"
                        min="0"
                    >
                </div>
            </div>

            <div class="form-section-subtitle">
                <i data-lucide="heart-pulse"></i>
                État de Santé
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">
                        <i data-lucide="star"></i>
                        Score de Santé
                    </label>
                    <select id="report_health_score" class="form-input">
                        <option value="">Non évalué</option>
                        <option value="1" ${existingReport?.health_score === 1 ? 'selected' : ''}>1 - Très Mauvais</option>
                        <option value="2" ${existingReport?.health_score === 2 ? 'selected' : ''}>2 - Mauvais</option>
                        <option value="3" ${existingReport?.health_score === 3 ? 'selected' : ''}>3 - Moyen</option>
                        <option value="4" ${existingReport?.health_score === 4 ? 'selected' : ''}>4 - Bon</option>
                        <option value="5" ${existingReport?.health_score === 5 ? 'selected' : ''}>5 - Excellent</option>
                    </select>
                    <small class="form-hint">Évaluation générale de la santé des poissons</small>
                </div>

                <div class="form-group">
                    <label class="form-checkbox">
                        <input type="checkbox" id="report_parasites" ${existingReport?.parasites_detected ? 'checked' : ''}>
                        <span>Parasites Détectés</span>
                    </label>
                </div>
            </div>

            <div class="form-group">
                <label class="form-label">
                    <i data-lucide="alert-circle"></i>
                    Signes de Maladie Observés
                </label>
                <textarea
                    id="report_disease_signs"
                    class="form-input"
                    rows="2"
                    placeholder="Décrire tout signe de maladie observé..."
                >${existingReport?.disease_signs || ''}</textarea>
            </div>

            <!-- Environmental Section -->
            <div class="form-section-title">
                <i data-lucide="droplet"></i>
                Données Environnementales
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">
                        <i data-lucide="thermometer"></i>
                        Température Eau (°C)
                    </label>
                    <input
                        type="number"
                        id="report_water_temp"
                        class="form-input"
                        step="0.1"
                        value="${existingReport?.water_temp || ''}"
                        placeholder="Ex: 24.5"
                    >
                    <small class="form-hint">Optimal: 20-28°C</small>
                </div>

                <div class="form-group">
                    <label class="form-label">
                        <i data-lucide="sun"></i>
                        Température Air (°C)
                    </label>
                    <input
                        type="number"
                        id="report_ambient_temp"
                        class="form-input"
                        step="0.1"
                        value="${existingReport?.ambient_temp || ''}"
                        placeholder="Ex: 22.0"
                    >
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">
                        <i data-lucide="beaker"></i>
                        pH
                    </label>
                    <input
                        type="number"
                        id="report_ph"
                        class="form-input"
                        step="0.1"
                        value="${existingReport?.ph || ''}"
                        placeholder="Ex: 7.2"
                        min="0"
                        max="14"
                    >
                    <small class="form-hint">Optimal: 6.5-8.5</small>
                </div>

                <div class="form-group">
                    <label class="form-label">
                        <i data-lucide="wind"></i>
                        Oxygène (mg/L)
                    </label>
                    <input
                        type="number"
                        id="report_oxygen"
                        class="form-input"
                        step="0.1"
                        value="${existingReport?.oxygen || ''}"
                        placeholder="Ex: 6.5"
                        min="0"
                    >
                    <small class="form-hint">Optimal: >5 mg/L</small>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">
                        <i data-lucide="droplet"></i>
                        Salinité (PSU)
                    </label>
                    <input
                        type="number"
                        id="report_salinity"
                        class="form-input"
                        step="0.1"
                        value="${existingReport?.salinity || ''}"
                        placeholder="Ex: 0.5"
                        min="0"
                    >
                    <small class="form-hint">Pour eau salée/saumâtre</small>
                </div>

                <div class="form-group">
                    <label class="form-label">
                        <i data-lucide="eye"></i>
                        Turbidité
                    </label>
                    <select id="report_turbidity" class="form-input">
                        <option value="">Non évalué</option>
                        <option value="claire" ${existingReport?.turbidity === 'claire' ? 'selected' : ''}>Claire</option>
                        <option value="légère" ${existingReport?.turbidity === 'légère' ? 'selected' : ''}>Légère</option>
                        <option value="trouble" ${existingReport?.turbidity === 'trouble' ? 'selected' : ''}>Trouble</option>
                        <option value="très trouble" ${existingReport?.turbidity === 'très trouble' ? 'selected' : ''}>Très Trouble</option>
                    </select>
                </div>
            </div>

            <div class="form-section-subtitle">
                <i data-lucide="flask-conical"></i>
                Qualité Chimique de l'Eau
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">
                        <i data-lucide="alert-triangle"></i>
                        Ammoniaque (mg/L)
                    </label>
                    <input
                        type="number"
                        id="report_ammonia"
                        class="form-input"
                        step="0.01"
                        value="${existingReport?.ammonia || ''}"
                        placeholder="Ex: 0.25"
                        min="0"
                    >
                    <small class="form-hint">Toxique si >0.5 mg/L</small>
                </div>

                <div class="form-group">
                    <label class="form-label">
                        <i data-lucide="alert-triangle"></i>
                        Nitrite (mg/L)
                    </label>
                    <input
                        type="number"
                        id="report_nitrite"
                        class="form-input"
                        step="0.01"
                        value="${existingReport?.nitrite || ''}"
                        placeholder="Ex: 0.15"
                        min="0"
                    >
                    <small class="form-hint">Toxique si élevé</small>
                </div>

                <div class="form-group">
                    <label class="form-label">
                        <i data-lucide="droplet"></i>
                        Nitrate (mg/L)
                    </label>
                    <input
                        type="number"
                        id="report_nitrate"
                        class="form-input"
                        step="0.01"
                        value="${existingReport?.nitrate || ''}"
                        placeholder="Ex: 10.5"
                        min="0"
                    >
                </div>
            </div>

            <!-- Feeding Section -->
            <div class="form-section-title">
                <i data-lucide="package"></i>
                Alimentation
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">
                        <i data-lucide="package"></i>
                        Quantité (kg)
                    </label>
                    <input
                        type="number"
                        id="report_feeding_kg"
                        class="form-input"
                        step="0.1"
                        value="${existingReport?.feeding_kg || ''}"
                        placeholder="Ex: 15.5"
                        min="0"
                    >
                </div>

                <div class="form-group">
                    <label class="form-label">
                        <i data-lucide="clock"></i>
                        Heure de Nourrissage
                    </label>
                    <input
                        type="time"
                        id="report_feeding_time"
                        class="form-input"
                        value="${existingReport?.feeding_time || ''}"
                    >
                </div>

                <div class="form-group">
                    <label class="form-label">
                        <i data-lucide="hash"></i>
                        Distributions/Jour
                    </label>
                    <input
                        type="number"
                        id="report_feeding_times"
                        class="form-input"
                        value="${existingReport?.feeding_times_per_day || ''}"
                        placeholder="Ex: 3"
                        min="1"
                    >
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">
                        <i data-lucide="box"></i>
                        Type d'Aliment
                    </label>
                    <input
                        type="text"
                        id="report_feed_type"
                        class="form-input"
                        value="${existingReport?.feed_type || ''}"
                        placeholder="Ex: Granulés 3mm"
                    >
                </div>

                <div class="form-group">
                    <label class="form-label">
                        <i data-lucide="thumbs-up"></i>
                        Acceptation
                    </label>
                    <select id="report_feed_acceptance" class="form-input">
                        <option value="">Non évalué</option>
                        <option value="excellent" ${existingReport?.feed_acceptance === 'excellent' ? 'selected' : ''}>Excellent</option>
                        <option value="bon" ${existingReport?.feed_acceptance === 'bon' ? 'selected' : ''}>Bon</option>
                        <option value="moyen" ${existingReport?.feed_acceptance === 'moyen' ? 'selected' : ''}>Moyen</option>
                        <option value="faible" ${existingReport?.feed_acceptance === 'faible' ? 'selected' : ''}>Faible</option>
                        <option value="refus" ${existingReport?.feed_acceptance === 'refus' ? 'selected' : ''}>Refus</option>
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label">
                        <i data-lucide="trash-2"></i>
                        Restes
                    </label>
                    <select id="report_leftover_feed" class="form-input">
                        <option value="">Non évalué</option>
                        <option value="aucun" ${existingReport?.leftover_feed === 'aucun' ? 'selected' : ''}>Aucun</option>
                        <option value="peu" ${existingReport?.leftover_feed === 'peu' ? 'selected' : ''}>Peu</option>
                        <option value="moyen" ${existingReport?.leftover_feed === 'moyen' ? 'selected' : ''}>Moyen</option>
                        <option value="beaucoup" ${existingReport?.leftover_feed === 'beaucoup' ? 'selected' : ''}>Beaucoup</option>
                    </select>
                </div>
            </div>

            <!-- Observations Section -->
            <div class="form-section-title">
                <i data-lucide="eye"></i>
                Observations
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">
                        <i data-lucide="cloud"></i>
                        Conditions Météo
                    </label>
                    <select id="report_weather" class="form-input">
                        <option value="">Sélectionner...</option>
                        <option value="Ensoleillé" ${existingReport?.weather_conditions === 'Ensoleillé' ? 'selected' : ''}>Ensoleillé</option>
                        <option value="Nuageux" ${existingReport?.weather_conditions === 'Nuageux' ? 'selected' : ''}>Nuageux</option>
                        <option value="Pluvieux" ${existingReport?.weather_conditions === 'Pluvieux' ? 'selected' : ''}>Pluvieux</option>
                        <option value="Orageux" ${existingReport?.weather_conditions === 'Orageux' ? 'selected' : ''}>Orageux</option>
                        <option value="Venteux" ${existingReport?.weather_conditions === 'Venteux' ? 'selected' : ''}>Venteux</option>
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label">
                        <i data-lucide="droplets"></i>
                        Qualité de l'Eau
                    </label>
                    <select id="report_water_quality" class="form-input">
                        <option value="">Sélectionner...</option>
                        <option value="excellent" ${existingReport?.water_quality === 'excellent' ? 'selected' : ''}>Excellente</option>
                        <option value="good" ${existingReport?.water_quality === 'good' ? 'selected' : ''}>Bonne</option>
                        <option value="fair" ${existingReport?.water_quality === 'fair' ? 'selected' : ''}>Moyenne</option>
                        <option value="poor" ${existingReport?.water_quality === 'poor' ? 'selected' : ''}>Mauvaise</option>
                    </select>
                </div>
            </div>

            <div class="form-group">
                <label class="form-label">
                    <i data-lucide="activity"></i>
                    Comportement des Poissons
                </label>
                <select id="report_fish_behavior" class="form-input">
                    <option value="">Sélectionner...</option>
                    <option value="normal" ${existingReport?.fish_behavior === 'normal' ? 'selected' : ''}>Normal</option>
                    <option value="stressed" ${existingReport?.fish_behavior === 'stressed' ? 'selected' : ''}>Stressé</option>
                    <option value="lethargic" ${existingReport?.fish_behavior === 'lethargic' ? 'selected' : ''}>Léthargique</option>
                    <option value="aggressive" ${existingReport?.fish_behavior === 'aggressive' ? 'selected' : ''}>Agressif</option>
                </select>
            </div>

            <!-- Incidents Section -->
            <div class="form-section-title">
                <i data-lucide="alert-triangle"></i>
                Incidents
            </div>

            <div class="form-group">
                <label class="form-checkbox">
                    <input type="checkbox" id="report_has_incident" ${existingReport?.has_incident ? 'checked' : ''}>
                    <span>Un incident s'est produit</span>
                </label>
            </div>

            <div id="incidentFields" style="display: ${existingReport?.has_incident ? 'block' : 'none'};">
                <div class="form-group">
                    <label class="form-label">
                        <i data-lucide="tag"></i>
                        Type d'Incident
                    </label>
                    <input
                        type="text"
                        id="report_incident_type"
                        class="form-input"
                        value="${existingReport?.incident_type || ''}"
                        placeholder="Ex: Mortalité anormale, Panne équipement..."
                    >
                </div>

                <div class="form-group">
                    <label class="form-label">
                        <i data-lucide="file-text"></i>
                        Description de l'Incident
                    </label>
                    <textarea
                        id="report_incident_description"
                        class="form-input"
                        rows="3"
                        placeholder="Décrire l'incident en détail..."
                    >${existingReport?.incident_description || ''}</textarea>
                </div>
            </div>

            <!-- Remarks Section -->
            <div class="form-section-title">
                <i data-lucide="message-square"></i>
                Remarques et Observations
            </div>

            <div class="form-group">
                <label class="form-label">
                    <i data-lucide="file-text"></i>
                    Remarques
                </label>
                <textarea
                    id="report_remarks"
                    class="form-input"
                    rows="4"
                    placeholder="Toute remarque ou observation spécifique concernant cette cage aujourd'hui..."
                >${existingReport?.remarks || ''}</textarea>
                <small class="form-hint">
                    Notez ici tout événement particulier, comportement inhabituel, intervention effectuée, etc.
                </small>
            </div>

            <!-- Form Actions -->
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" onclick="TechnicianDashboard.closeReportForm()">
                    Annuler
                </button>
                <button type="submit" class="btn btn-primary" id="saveReportBtn">
                    <i data-lucide="save"></i>
                    ${existingReport ? 'Mettre à Jour' : 'Enregistrer'} le Rapport
                </button>
            </div>
        `;

        // Show/hide incident fields
        const hasIncidentCheckbox = document.getElementById('report_has_incident');
        const incidentFields = document.getElementById('incidentFields');

        hasIncidentCheckbox?.addEventListener('change', (e) => {
            incidentFields.style.display = e.target.checked ? 'block' : 'none';
        });

        // Form submit
        const form = document.getElementById('dailyReportForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitReport();
        });

        modal.classList.add('active');
        lucide.createIcons();
    }

    static async submitReport() {
        const reportId = document.getElementById('report_id')?.value;
        const isUpdate = !!reportId;

        const reportData = {
            cage_id: document.getElementById('report_cage_id').value,
            report_date: document.getElementById('report_date').value,

            // Population data
            alive_count: parseInt(document.getElementById('report_alive_count').value),
            new_dead: parseInt(document.getElementById('report_new_dead').value) || 0,

            // Biometric data
            sample_size: parseInt(document.getElementById('report_sample_size').value) || null,
            average_weight_g: parseFloat(document.getElementById('report_avg_weight').value) || null,
            min_weight_g: parseFloat(document.getElementById('report_min_weight').value) || null,
            max_weight_g: parseFloat(document.getElementById('report_max_weight').value) || null,
            average_length_cm: parseFloat(document.getElementById('report_avg_length').value) || null,
            min_length_cm: parseFloat(document.getElementById('report_min_length').value) || null,
            max_length_cm: parseFloat(document.getElementById('report_max_length').value) || null,
            health_score: parseInt(document.getElementById('report_health_score').value) || null,
            disease_signs: document.getElementById('report_disease_signs').value || null,
            parasites_detected: document.getElementById('report_parasites').checked,

            // Environmental data
            water_temp: parseFloat(document.getElementById('report_water_temp').value) || null,
            ambient_temp: parseFloat(document.getElementById('report_ambient_temp').value) || null,
            ph: parseFloat(document.getElementById('report_ph').value) || null,
            oxygen: parseFloat(document.getElementById('report_oxygen').value) || null,
            salinity: parseFloat(document.getElementById('report_salinity').value) || null,
            turbidity: document.getElementById('report_turbidity').value || null,
            ammonia: parseFloat(document.getElementById('report_ammonia').value) || null,
            nitrite: parseFloat(document.getElementById('report_nitrite').value) || null,
            nitrate: parseFloat(document.getElementById('report_nitrate').value) || null,

            // Feeding data
            feeding_kg: parseFloat(document.getElementById('report_feeding_kg').value) || null,
            feeding_time: document.getElementById('report_feeding_time').value || null,
            feeding_times_per_day: parseInt(document.getElementById('report_feeding_times').value) || null,
            feed_type: document.getElementById('report_feed_type').value || null,
            feed_acceptance: document.getElementById('report_feed_acceptance').value || null,
            leftover_feed: document.getElementById('report_leftover_feed').value || null,

            // Observations
            weather_conditions: document.getElementById('report_weather').value || null,
            water_quality: document.getElementById('report_water_quality').value || null,
            fish_behavior: document.getElementById('report_fish_behavior').value || null,

            // Incidents
            has_incident: document.getElementById('report_has_incident').checked,
            incident_type: document.getElementById('report_incident_type')?.value || null,
            incident_description: document.getElementById('report_incident_description')?.value || null,

            // Remarks
            remarks: document.getElementById('report_remarks').value || null
        };

        // Calculate total_dead
        const cage = this.selectedCage;
        reportData.total_dead = cage.total_dead + reportData.new_dead;

        const saveBtn = document.getElementById('saveReportBtn');
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<i data-lucide="loader"></i> Enregistrement...';
        lucide.createIcons();

        let result;
        if (isUpdate) {
            result = await SupabaseService.updateDailyReport(reportId, reportData);
        } else {
            result = await SupabaseService.createDailyReport(reportData);
        }

        if (result.success) {
            this.closeReportForm();
            await this.loadCages();
            await this.loadTodayReports();
            this.showSuccessMessage(isUpdate ? 'Rapport mis à jour' : 'Rapport enregistré');
        } else {
            alert('Erreur: ' + result.error);
            saveBtn.disabled = false;
            saveBtn.innerHTML = '<i data-lucide="save"></i> Enregistrer le Rapport';
            lucide.createIcons();
        }
    }

    static closeReportForm() {
        const modal = document.getElementById('reportModal');
        modal.classList.remove('active');
    }

    static showSuccessMessage(message) {
        const toast = document.createElement('div');
        toast.className = 'success-toast';
        toast.innerHTML = `
            <i data-lucide="check-circle"></i>
            <span>${message}</span>
        `;
        toast.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: var(--color-success);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--radius-md);
            display: flex;
            align-items: center;
            gap: 0.5rem;
            box-shadow: var(--shadow-lg);
            z-index: 9999;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(toast);
        lucide.createIcons();

        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    static setupListeners() {
        const modalClose = document.getElementById('reportModalClose');
        const modalOverlay = document.getElementById('reportModalOverlay');

        modalClose?.addEventListener('click', () => this.closeReportForm());
        modalOverlay?.addEventListener('click', () => this.closeReportForm());

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeReportForm();
            }
        });
    }
}

// Make available globally
window.TechnicianDashboard = TechnicianDashboard;
