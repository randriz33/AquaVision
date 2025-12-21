/**
 * AquaVision Pro - Admin Dashboard
 * @version 2.0.0
 */

class AdminDashboard {
    static async init() {
        await this.render();
    }

    static async render() {
        const content = document.getElementById('mainContent');
        if (!content) return;

        content.innerHTML = `
            <div class="container">
                <section class="dashboard">
                    <h1 class="dashboard-title">Dashboard Administrateur</h1>

                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-icon primary">
                                <i data-lucide="layers"></i>
                            </div>
                            <div class="stat-info">
                                <p class="stat-label">Cages Actives</p>
                                <p class="stat-value" id="admin_totalCages">0</p>
                            </div>
                        </div>

                        <div class="stat-card">
                            <div class="stat-icon success">
                                <i data-lucide="users"></i>
                            </div>
                            <div class="stat-info">
                                <p class="stat-label">Techniciens</p>
                                <p class="stat-value" id="admin_totalUsers">0</p>
                            </div>
                        </div>

                        <div class="stat-card">
                            <div class="stat-icon warning">
                                <i data-lucide="file-text"></i>
                            </div>
                            <div class="stat-info">
                                <p class="stat-label">Rapports Aujourd'hui</p>
                                <p class="stat-value" id="admin_todayReports">0</p>
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
                        <button class="btn btn-primary" onclick="AdminDashboard.addCage()">
                            <i data-lucide="plus"></i>
                            Ajouter une Cage
                        </button>
                        <button class="btn btn-secondary" onclick="AdminDashboard.viewReports()">
                            <i data-lucide="file-text"></i>
                            Voir les Rapports
                        </button>
                        <button class="btn btn-secondary" onclick="AdminDashboard.viewActivity()">
                            <i data-lucide="activity"></i>
                            Journal d'Activité
                        </button>
                        <button class="btn btn-secondary" onclick="AdminDashboard.exportData()">
                            <i data-lucide="download"></i>
                            Exporter les Données
                        </button>
                    </div>
                </section>

                <!-- Recent Reports -->
                <section class="recent-reports-section">
                    <div class="section-header">
                        <h2 class="section-title">
                            <i data-lucide="clock"></i>
                            Rapports Récents
                        </h2>
                    </div>
                    <div id="recentReports">Chargement...</div>
                </section>
            </div>
        `;

        lucide.createIcons();
        await this.loadStats();
        await this.loadRecentReports();
    }

    static async loadStats() {
        // Load cages
        const cagesResult = await SupabaseService.getCages();
        if (cagesResult.success) {
            document.getElementById('admin_totalCages').textContent = cagesResult.cages.length;
        }

        // Load today's reports
        const today = new Date().toISOString().split('T')[0];
        const reportsResult = await SupabaseService.getDailyReports({
            startDate: today,
            endDate: today
        });
        if (reportsResult.success) {
            document.getElementById('admin_todayReports').textContent = reportsResult.reports.length;
        }

        // Load alerts
        const alertsResult = await SupabaseService.getActiveAlerts();
        if (alertsResult.success) {
            document.getElementById('admin_totalAlerts').textContent = alertsResult.alerts.length;
        }
    }

    static async loadRecentReports() {
        const result = await SupabaseService.getDailyReports({ limit: 10 });
        const container = document.getElementById('recentReports');

        if (!result.success || result.reports.length === 0) {
            container.innerHTML = '<p style="color: var(--color-text-secondary); text-align: center; padding: 2rem;">Aucun rapport disponible</p>';
            return;
        }

        container.innerHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Cage</th>
                        <th>Technicien</th>
                        <th>Population</th>
                        <th>Temp. Eau</th>
                        <th>pH</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${result.reports.map(report => `
                        <tr>
                            <td>${new Date(report.report_date).toLocaleDateString('fr-FR')}</td>
                            <td>Cage ${report.cage?.cage_number || '-'}</td>
                            <td>${report.creator?.full_name || '-'}</td>
                            <td>${report.alive_count}</td>
                            <td>${report.water_temp ? report.water_temp + '°C' : '-'}</td>
                            <td>${report.ph || '-'}</td>
                            <td>
                                <button class="btn btn-sm btn-secondary" onclick="AdminDashboard.viewReport('${report.id}')">
                                    <i data-lucide="eye"></i>
                                    Voir
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        lucide.createIcons();
    }

    static addCage() {
        alert('Fonctionnalité en développement - Ajout de cage');
    }

    static viewReports() {
        alert('Fonctionnalité en développement - Vue des rapports');
    }

    static viewActivity() {
        alert('Fonctionnalité en développement - Journal d\'activité');
    }

    static exportData() {
        alert('Fonctionnalité en développement - Export des données');
    }

    static viewReport(reportId) {
        alert('Voir le rapport: ' + reportId);
    }
}

// Styles for data table
const style = document.createElement('style');
style.textContent = `
    .quick-actions-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: var(--spacing-md);
        margin-bottom: var(--spacing-2xl);
    }

    .data-table {
        width: 100%;
        border-collapse: collapse;
        background: var(--color-bg-card);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
        overflow: hidden;
    }

    .data-table thead {
        background: var(--color-bg-tertiary);
    }

    .data-table th,
    .data-table td {
        padding: var(--spacing-md);
        text-align: left;
        border-bottom: 1px solid var(--color-border);
    }

    .data-table th {
        font-weight: 600;
        color: var(--color-text-primary);
        font-size: 0.875rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .data-table td {
        color: var(--color-text-secondary);
    }

    .data-table tbody tr:hover {
        background: var(--color-bg-tertiary);
    }

    .data-table tbody tr:last-child td {
        border-bottom: none;
    }

    .quick-actions-section,
    .recent-reports-section {
        margin-bottom: var(--spacing-2xl);
    }
`;
document.head.appendChild(style);

// Make available globally
window.AdminDashboard = AdminDashboard;
