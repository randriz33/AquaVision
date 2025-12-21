/**
 * AquaVision Pro - Admin Dashboard
 * @version 2.1.0 - Complete
 */

class AdminDashboard {
    static cages = [];
    static reports = [];
    static currentView = 'overview';

    static async init() {
        await this.loadData();
        await this.render();
    }

    static async loadData() {
        // Load cages
        const cagesResult = await SupabaseService.getCages();
        if (cagesResult.success) {
            this.cages = cagesResult.cages;
        }

        // Load recent reports
        const reportsResult = await SupabaseService.getDailyReports({ limit: 50 });
        if (reportsResult.success) {
            this.reports = reportsResult.reports;
        }
    }

    static async render() {
        const content = document.getElementById('mainContent');
        if (!content) return;

        content.innerHTML = `
            <div class="container">
                <!-- Header with Navigation -->
                <section class="admin-header">
                    <h1 class="dashboard-title">
                        <i data-lucide="shield"></i>
                        Dashboard Administrateur
                    </h1>
                    <div class="admin-nav">
                        <button class="btn ${this.currentView === 'overview' ? 'btn-primary' : 'btn-secondary'}"
                                onclick="AdminDashboard.switchView('overview')">
                            <i data-lucide="home"></i>
                            Vue d'ensemble
                        </button>
                        <button class="btn ${this.currentView === 'cages' ? 'btn-primary' : 'btn-secondary'}"
                                onclick="AdminDashboard.switchView('cages')">
                            <i data-lucide="layers"></i>
                            Gestion Cages
                        </button>
                        <button class="btn ${this.currentView === 'reports' ? 'btn-primary' : 'btn-secondary'}"
                                onclick="AdminDashboard.switchView('reports')">
                            <i data-lucide="file-text"></i>
                            Rapports
                        </button>
                        <button class="btn ${this.currentView === 'activity' ? 'btn-primary' : 'btn-secondary'}"
                                onclick="AdminDashboard.switchView('activity')">
                            <i data-lucide="activity"></i>
                            Journal
                        </button>
                    </div>
                </section>

                <!-- Content Area -->
                <div id="adminViewContent"></div>
            </div>

            <!-- Modals -->
            ${this.renderModals()}
        `;

        lucide.createIcons();
        await this.renderView();
    }

    static switchView(view) {
        this.currentView = view;
        this.render();
    }

    static async renderView() {
        const container = document.getElementById('adminViewContent');
        if (!container) return;

        switch (this.currentView) {
            case 'overview':
                container.innerHTML = this.renderOverview();
                lucide.createIcons();
                await this.loadStats();
                break;
            case 'cages':
                container.innerHTML = this.renderCagesView();
                lucide.createIcons();
                break;
            case 'reports':
                container.innerHTML = this.renderReportsView();
                lucide.createIcons();
                break;
            case 'activity':
                container.innerHTML = this.renderActivityView();
                lucide.createIcons();
                await this.loadActivityLog();
                break;
        }
    }

    static renderOverview() {
        const today = new Date().toISOString().split('T')[0];
        const todayReports = this.reports.filter(r => r.report_date === today);

        return `
            <!-- Stats Grid -->
            <section class="dashboard">
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon primary">
                            <i data-lucide="layers"></i>
                        </div>
                        <div class="stat-info">
                            <p class="stat-label">Cages Actives</p>
                            <p class="stat-value" id="admin_totalCages">${this.cages.length}</p>
                        </div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-icon success">
                            <i data-lucide="fish"></i>
                        </div>
                        <div class="stat-info">
                            <p class="stat-label">Population Totale</p>
                            <p class="stat-value" id="admin_totalPopulation">0</p>
                        </div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-icon warning">
                            <i data-lucide="file-text"></i>
                        </div>
                        <div class="stat-info">
                            <p class="stat-label">Rapports Aujourd'hui</p>
                            <p class="stat-value">${todayReports.length}</p>
                        </div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-icon danger">
                            <i data-lucide="alert-triangle"></i>
                        </div>
                        <div class="stat-info">
                            <p class="stat-label">Alertes Actives</p>
                            <p class="stat-value" id="admin_totalAlerts">0</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Quick Actions -->
            <section class="quick-actions-section">
                <h2 class="section-title">
                    <i data-lucide="zap"></i>
                    Actions Rapides
                </h2>
                <div class="quick-actions-grid">
                    <button class="btn btn-primary" onclick="AdminDashboard.openAddCageModal()">
                        <i data-lucide="plus"></i>
                        Ajouter une Cage
                    </button>
                    <button class="btn btn-secondary" onclick="AdminDashboard.switchView('reports')">
                        <i data-lucide="file-text"></i>
                        Voir les Rapports
                    </button>
                    <button class="btn btn-secondary" onclick="AdminDashboard.switchView('activity')">
                        <i data-lucide="activity"></i>
                        Journal d'Activité
                    </button>
                    <button class="btn btn-secondary" onclick="AdminDashboard.exportReportsCSV()">
                        <i data-lucide="download"></i>
                        Exporter CSV
                    </button>
                </div>
            </section>

            <!-- Recent Reports -->
            <section class="recent-reports-section">
                <div class="section-header">
                    <h2 class="section-title">
                        <i data-lucide="clock"></i>
                        Rapports Récents (${this.reports.slice(0, 10).length})
                    </h2>
                </div>
                ${this.renderReportsTable(this.reports.slice(0, 10))}
            </section>
        `;
    }

    static renderCagesView() {
        return `
            <section class="cages-management">
                <div class="section-header">
                    <h2 class="section-title">
                        <i data-lucide="layers"></i>
                        Gestion des Cages (${this.cages.length})
                    </h2>
                    <button class="btn btn-primary" onclick="AdminDashboard.openAddCageModal()">
                        <i data-lucide="plus"></i>
                        Ajouter une Cage
                    </button>
                </div>

                <div class="cages-table">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Numéro</th>
                                <th>Emplacement</th>
                                <th>Espèce</th>
                                <th>Population</th>
                                <th>Capacité</th>
                                <th>Mortalité</th>
                                <th>Statut</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.cages.map(cage => `
                                <tr>
                                    <td><strong>${cage.cage_number}</strong></td>
                                    <td>${cage.location || '-'}</td>
                                    <td>${cage.species || '-'}</td>
                                    <td>${cage.alive_count || 0}</td>
                                    <td>${cage.capacity || '-'}</td>
                                    <td>${cage.total_dead || 0}</td>
                                    <td>
                                        <span class="badge badge-${cage.status === 'active' ? 'success' : 'warning'}">
                                            ${cage.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button class="btn btn-sm btn-secondary" onclick='AdminDashboard.openEditCageModal(${JSON.stringify(cage).replace(/'/g, "&apos;")})'>
                                            <i data-lucide="edit-2"></i>
                                        </button>
                                        <button class="btn btn-sm btn-danger" onclick="AdminDashboard.deleteCage('${cage.id}', '${cage.cage_number}')">
                                            <i data-lucide="trash-2"></i>
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </section>
        `;
    }

    static renderReportsView() {
        return `
            <section class="reports-management">
                <div class="section-header">
                    <h2 class="section-title">
                        <i data-lucide="file-text"></i>
                        Tous les Rapports (${this.reports.length})
                    </h2>
                    <button class="btn btn-primary" onclick="AdminDashboard.exportReportsCSV()">
                        <i data-lucide="download"></i>
                        Exporter CSV
                    </button>
                </div>
                ${this.renderReportsTable(this.reports)}
            </section>
        `;
    }

    static renderReportsTable(reports) {
        if (reports.length === 0) {
            return '<p style="text-align: center; padding: 2rem; color: #666;">Aucun rapport disponible</p>';
        }

        return `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Cage</th>
                        <th>Technicien</th>
                        <th>Population</th>
                        <th>Mortalité</th>
                        <th>Temp.</th>
                        <th>pH</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${reports.map(report => `
                        <tr>
                            <td>${new Date(report.report_date).toLocaleDateString('fr-FR')}</td>
                            <td>Cage ${report.cage?.cage_number || '-'}</td>
                            <td>${report.creator?.full_name || '-'}</td>
                            <td>${report.alive_count || 0}</td>
                            <td>${report.new_dead || 0}</td>
                            <td>${report.water_temp ? report.water_temp + '°C' : '-'}</td>
                            <td>${report.ph || '-'}</td>
                            <td>
                                <button class="btn btn-sm btn-secondary" onclick="AdminDashboard.viewReportDetails('${report.id}')">
                                    <i data-lucide="eye"></i>
                                    Voir
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    static renderActivityView() {
        return `
            <section class="activity-log">
                <div class="section-header">
                    <h2 class="section-title">
                        <i data-lucide="activity"></i>
                        Journal d'Activité
                    </h2>
                </div>
                <div id="activityLogContent">
                    <p style="text-align: center; padding: 2rem;">
                        <i data-lucide="loader" class="spinner"></i>
                        Chargement...
                    </p>
                </div>
            </section>
        `;
    }

    static renderModals() {
        return `
            <!-- Add/Edit Cage Modal -->
            <div class="modal" id="cageModal">
                <div class="modal-overlay" onclick="AdminDashboard.closeCageModal()"></div>
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title" id="cageModalTitle">Ajouter une Cage</h3>
                        <button class="modal-close" onclick="AdminDashboard.closeCageModal()">
                            <i data-lucide="x"></i>
                        </button>
                    </div>
                    <form class="modal-body" id="cageForm" onsubmit="AdminDashboard.saveCage(event)">
                        <input type="hidden" id="cageId">

                        <div class="form-group">
                            <label class="form-label">Numéro de Cage *</label>
                            <input type="text" id="cageNumber" class="form-input" required>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Emplacement</label>
                            <input type="text" id="cageLocation" class="form-input">
                        </div>

                        <div class="form-group">
                            <label class="form-label">Espèce *</label>
                            <input type="text" id="cageSpecies" class="form-input" required>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Capacité</label>
                                <input type="number" id="cageCapacity" class="form-input" min="0">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Population Initiale *</label>
                                <input type="number" id="cageInitialCount" class="form-input" required min="0">
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Statut</label>
                            <select id="cageStatus" class="form-input">
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="maintenance">Maintenance</option>
                            </select>
                        </div>

                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" onclick="AdminDashboard.closeCageModal()">
                                Annuler
                            </button>
                            <button type="submit" class="btn btn-primary">
                                <i data-lucide="save"></i>
                                Enregistrer
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- View Report Modal -->
            <div class="modal" id="reportModal">
                <div class="modal-overlay" onclick="AdminDashboard.closeReportModal()"></div>
                <div class="modal-content modal-large">
                    <div class="modal-header">
                        <h3 class="modal-title">Détails du Rapport</h3>
                        <button class="modal-close" onclick="AdminDashboard.closeReportModal()">
                            <i data-lucide="x"></i>
                        </button>
                    </div>
                    <div class="modal-body" id="reportDetailsContent">
                        Chargement...
                    </div>
                </div>
            </div>
        `;
    }

    // Cage Management Methods
    static openAddCageModal() {
        document.getElementById('cageModalTitle').textContent = 'Ajouter une Cage';
        document.getElementById('cageForm').reset();
        document.getElementById('cageId').value = '';
        document.getElementById('cageModal').classList.add('active');
        lucide.createIcons();
    }

    static openEditCageModal(cage) {
        document.getElementById('cageModalTitle').textContent = 'Modifier la Cage';
        document.getElementById('cageId').value = cage.id;
        document.getElementById('cageNumber').value = cage.cage_number;
        document.getElementById('cageLocation').value = cage.location || '';
        document.getElementById('cageSpecies').value = cage.species || '';
        document.getElementById('cageCapacity').value = cage.capacity || '';
        document.getElementById('cageInitialCount').value = cage.initial_count || 0;
        document.getElementById('cageStatus').value = cage.status || 'active';
        document.getElementById('cageModal').classList.add('active');
        lucide.createIcons();
    }

    static closeCageModal() {
        document.getElementById('cageModal').classList.remove('active');
    }

    static async saveCage(event) {
        event.preventDefault();

        const cageId = document.getElementById('cageId').value;
        const cageData = {
            cage_number: document.getElementById('cageNumber').value.trim(),
            location: document.getElementById('cageLocation').value.trim() || null,
            species: document.getElementById('cageSpecies').value.trim(),
            capacity: parseInt(document.getElementById('cageCapacity').value) || null,
            initial_count: parseInt(document.getElementById('cageInitialCount').value) || 0,
            status: document.getElementById('cageStatus').value
        };

        let result;
        if (cageId) {
            // Update existing cage
            result = await SupabaseService.updateCage(cageId, cageData);
        } else {
            // Create new cage
            cageData.alive_count = cageData.initial_count;
            cageData.total_dead = 0;
            result = await SupabaseService.createCage(cageData);
        }

        if (result.success) {
            alert(`✓ Cage ${cageId ? 'modifiée' : 'créée'} avec succès!`);
            this.closeCageModal();
            await this.loadData();
            this.render();
        } else {
            alert('Erreur: ' + result.error);
        }
    }

    static async deleteCage(cageId, cageNumber) {
        if (!confirm(`Êtes-vous sûr de vouloir supprimer la cage ${cageNumber}?\n\nCette action est irréversible!`)) {
            return;
        }

        const result = await SupabaseService.deleteCage(cageId);
        if (result.success) {
            alert('✓ Cage supprimée avec succès!');
            await this.loadData();
            this.render();
        } else {
            alert('Erreur: ' + result.error);
        }
    }

    // Report Methods
    static async viewReportDetails(reportId) {
        const report = this.reports.find(r => r.id === reportId);
        if (!report) return;

        const content = `
            <div class="report-details">
                <div class="report-section">
                    <h4><i data-lucide="info"></i> Informations Générales</h4>
                    <div class="detail-grid">
                        <div><strong>Date:</strong> ${new Date(report.report_date).toLocaleDateString('fr-FR')}</div>
                        <div><strong>Cage:</strong> ${report.cage?.cage_number || '-'}</div>
                        <div><strong>Technicien:</strong> ${report.creator?.full_name || '-'}</div>
                        <div><strong>Population:</strong> ${report.alive_count || 0} poissons</div>
                        <div><strong>Nouvelles mortalités:</strong> ${report.new_dead || 0}</div>
                        <div><strong>Raison mortalité:</strong> ${report.dead_reason || '-'}</div>
                    </div>
                </div>

                ${report.average_weight_g ? `
                <div class="report-section">
                    <h4><i data-lucide="activity"></i> Données Biométriques</h4>
                    <div class="detail-grid">
                        <div><strong>Poids moyen:</strong> ${report.average_weight_g}g</div>
                        <div><strong>Longueur moyenne:</strong> ${report.average_length_cm || '-'}cm</div>
                        <div><strong>Biomasse:</strong> ${report.total_biomass_kg || '-'}kg</div>
                        <div><strong>Taille échantillon:</strong> ${report.sample_size || '-'}</div>
                    </div>
                </div>
                ` : ''}

                ${report.water_temp || report.ph || report.oxygen ? `
                <div class="report-section">
                    <h4><i data-lucide="droplet"></i> Paramètres Environnementaux</h4>
                    <div class="detail-grid">
                        <div><strong>Température eau:</strong> ${report.water_temp || '-'}°C</div>
                        <div><strong>pH:</strong> ${report.ph || '-'}</div>
                        <div><strong>Oxygène:</strong> ${report.oxygen || '-'} mg/L</div>
                        <div><strong>Salinité:</strong> ${report.salinity || '-'}</div>
                        <div><strong>Turbidité:</strong> ${report.turbidity || '-'}</div>
                    </div>
                </div>
                ` : ''}

                ${report.feeding_kg ? `
                <div class="report-section">
                    <h4><i data-lucide="package"></i> Alimentation</h4>
                    <div class="detail-grid">
                        <div><strong>Quantité:</strong> ${report.feeding_kg}kg</div>
                        <div><strong>Type:</strong> ${report.feed_type || '-'}</div>
                        <div><strong>Acceptance:</strong> ${report.feed_acceptance || '-'}</div>
                        <div><strong>FCR:</strong> ${report.fcr || '-'}</div>
                    </div>
                </div>
                ` : ''}

                ${report.remarks ? `
                <div class="report-section">
                    <h4><i data-lucide="message-square"></i> Remarques</h4>
                    <p>${report.remarks}</p>
                </div>
                ` : ''}
            </div>
        `;

        document.getElementById('reportDetailsContent').innerHTML = content;
        document.getElementById('reportModal').classList.add('active');
        lucide.createIcons();
    }

    static closeReportModal() {
        document.getElementById('reportModal').classList.remove('active');
    }

    // Export Methods
    static exportReportsCSV() {
        if (this.reports.length === 0) {
            alert('Aucun rapport à exporter');
            return;
        }

        // CSV Headers
        const headers = [
            'Date', 'Cage', 'Technicien', 'Population', 'Nouvelles_Morts',
            'Poids_Moyen_g', 'Biomasse_kg', 'Temp_Eau', 'pH', 'Oxygene', 'FCR'
        ];

        // CSV Rows
        const rows = this.reports.map(r => [
            r.report_date,
            r.cage?.cage_number || '',
            r.creator?.full_name || '',
            r.alive_count || 0,
            r.new_dead || 0,
            r.average_weight_g || '',
            r.total_biomass_kg || '',
            r.water_temp || '',
            r.ph || '',
            r.oxygen || '',
            r.fcr || ''
        ]);

        // Create CSV content
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        // Download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `rapports_aquavision_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();

        alert('✓ Export CSV terminé!');
    }

    // Activity Log
    static async loadActivityLog() {
        const result = await SupabaseService.getActivityLog({ limit: 100 });
        const container = document.getElementById('activityLogContent');

        if (!result.success || result.logs.length === 0) {
            container.innerHTML = '<p style="text-align: center; padding: 2rem; color: #666;">Aucune activité enregistrée</p>';
            return;
        }

        container.innerHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Date/Heure</th>
                        <th>Utilisateur</th>
                        <th>Action</th>
                        <th>Type</th>
                        <th>Détails</th>
                    </tr>
                </thead>
                <tbody>
                    ${result.logs.map(log => `
                        <tr>
                            <td>${new Date(log.created_at).toLocaleString('fr-FR')}</td>
                            <td>${log.user?.full_name || '-'}</td>
                            <td>
                                <span class="badge badge-${this.getActionColor(log.action)}">
                                    ${this.getActionLabel(log.action)}
                                </span>
                            </td>
                            <td>${log.entity_type || '-'}</td>
                            <td>${log.details ? JSON.stringify(log.details).substring(0, 50) + '...' : '-'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        lucide.createIcons();
    }

    static getActionColor(action) {
        if (action.includes('create')) return 'success';
        if (action.includes('delete')) return 'danger';
        if (action.includes('update')) return 'warning';
        return 'info';
    }

    static getActionLabel(action) {
        const labels = {
            'cage_created': 'Cage créée',
            'cage_updated': 'Cage modifiée',
            'cage_deleted': 'Cage supprimée',
            'report_created': 'Rapport créé',
            'report_updated': 'Rapport modifié',
            'user_signin': 'Connexion',
            'user_signup': 'Inscription'
        };
        return labels[action] || action;
    }

    // Stats Loading
    static async loadStats() {
        const totalPopulation = this.cages.reduce((sum, cage) => sum + (cage.alive_count || 0), 0);
        document.getElementById('admin_totalPopulation').textContent = totalPopulation.toLocaleString();

        const alertsResult = await SupabaseService.getActiveAlerts();
        if (alertsResult.success) {
            document.getElementById('admin_totalAlerts').textContent = alertsResult.alerts.length;
        }
    }
}

// Styles
const adminStyles = document.createElement('style');
adminStyles.textContent = `
    .admin-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        flex-wrap: wrap;
        gap: 1rem;
    }

    .admin-nav {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
    }

    .quick-actions-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-bottom: 2rem;
    }

    .data-table {
        width: 100%;
        border-collapse: collapse;
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        overflow: hidden;
    }

    .data-table th,
    .data-table td {
        padding: 0.75rem;
        text-align: left;
        border-bottom: 1px solid #e2e8f0;
    }

    .data-table th {
        background: #f8fafc;
        font-weight: 600;
        font-size: 0.875rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .data-table tbody tr:hover {
        background: #f8fafc;
    }

    .badge {
        padding: 0.25rem 0.75rem;
        border-radius: 9999px;
        font-size: 0.75rem;
        font-weight: 600;
    }

    .badge-success { background: #dcfce7; color: #166534; }
    .badge-warning { background: #fef3c7; color: #92400e; }
    .badge-danger { background: #fee2e2; color: #991b1b; }
    .badge-info { background: #dbeafe; color: #1e40af; }

    .btn-sm {
        padding: 0.375rem 0.75rem;
        font-size: 0.875rem;
    }

    .btn-danger {
        background: #ef4444;
        color: white;
    }

    .btn-danger:hover {
        background: #dc2626;
    }

    .report-details {
        max-height: 70vh;
        overflow-y: auto;
    }

    .report-section {
        margin-bottom: 1.5rem;
        padding: 1rem;
        background: #f8fafc;
        border-radius: 8px;
    }

    .report-section h4 {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 1rem;
        color: #1e293b;
    }

    .detail-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 0.75rem;
    }

    .detail-grid > div {
        font-size: 0.875rem;
    }

    .spinner {
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }

    .quick-actions-section,
    .recent-reports-section,
    .cages-management,
    .reports-management,
    .activity-log {
        margin-bottom: 2rem;
    }

    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }

    .modal-large {
        max-width: 800px;
    }
`;
document.head.appendChild(adminStyles);

// Make available globally
window.AdminDashboard = AdminDashboard;
