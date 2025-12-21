/**
 * AquaVision Pro - Main Application
 * @version 1.0.0
 */

// ==========================================
// Application State
// ==========================================
const AppState = {
    cages: [],
    currentCage: null,
    isEditMode: false
};

// ==========================================
// Configuration
// ==========================================
const CONFIG = {
    STORAGE_KEY: 'aquavision_cages',
    HIGH_MORTALITY_THRESHOLD: 10, // %
    LOW_POPULATION_THRESHOLD: 100,
    AUTO_SAVE: true
};

// ==========================================
// DOM Elements
// ==========================================
const DOM = {
    // Dashboard
    totalCages: document.getElementById('totalCages'),
    totalAlive: document.getElementById('totalAlive'),
    survivalRate: document.getElementById('survivalRate'),
    totalAlerts: document.getElementById('totalAlerts'),

    // Sections
    alertsSection: document.getElementById('alertsSection'),
    alertsContainer: document.getElementById('alertsContainer'),
    cagesGrid: document.getElementById('cagesGrid'),

    // Modal
    modal: document.getElementById('cageModal'),
    modalOverlay: document.getElementById('modalOverlay'),
    modalTitle: document.getElementById('modalTitle'),
    modalClose: document.getElementById('modalClose'),
    cageForm: document.getElementById('cageForm'),

    // Form Fields
    cageNumber: document.getElementById('cageNumber'),
    initialCount: document.getElementById('initialCount'),
    aliveCount: document.getElementById('aliveCount'),
    newDead: document.getElementById('newDead'),
    aliveCountGroup: document.getElementById('aliveCountGroup'),
    newDeadGroup: document.getElementById('newDeadGroup'),

    // Environmental Fields
    environmentalSection: document.getElementById('environmentalSection'),
    waterTemp: document.getElementById('waterTemp'),
    ambientTemp: document.getElementById('ambientTemp'),
    ph: document.getElementById('ph'),
    oxygen: document.getElementById('oxygen'),
    feedingKg: document.getElementById('feedingKg'),
    notes: document.getElementById('notes'),

    // Buttons
    addCageBtn: document.getElementById('addCageBtn'),
    cancelBtn: document.getElementById('cancelBtn'),
    submitBtn: document.getElementById('submitBtn'),
    themeToggle: document.getElementById('themeToggle'),
    refreshBtn: document.getElementById('refreshBtn')
};

// ==========================================
// Data Management
// ==========================================
class DataManager {
    static loadFromStorage() {
        try {
            const data = localStorage.getItem(CONFIG.STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error loading data:', error);
            return [];
        }
    }

    static saveToStorage(cages) {
        try {
            localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(cages));
            return true;
        } catch (error) {
            console.error('Error saving data:', error);
            return false;
        }
    }

    static async fetchFromAPI() {
        if (typeof AquaVisionAPI !== 'undefined') {
            try {
                const response = await AquaVisionAPI.getCages();
                if (response.success) {
                    return response.cages;
                }
            } catch (error) {
                console.error('API Error:', error);
            }
        }
        return this.loadFromStorage();
    }

    static async saveToAPI(cage, method = 'POST') {
        if (typeof AquaVisionAPI !== 'undefined') {
            try {
                let response;
                if (method === 'POST') {
                    response = await AquaVisionAPI.createCage(cage);
                } else if (method === 'PUT') {
                    response = await AquaVisionAPI.updateCage(cage.id, cage);
                }
                return response?.success || false;
            } catch (error) {
                console.error('API Error:', error);
            }
        }
        return false;
    }
}

// ==========================================
// Cage Class
// ==========================================
class Cage {
    constructor(data) {
        this.id = data.id || Date.now();
        this.cage_number = data.cage_number;
        this.initial_count = data.initial_count;
        this.alive_count = data.alive_count !== undefined ? data.alive_count : data.initial_count;
        this.total_dead = data.total_dead || 0;

        // Environmental data
        this.water_temp = data.water_temp || null;
        this.ambient_temp = data.ambient_temp || null;
        this.ph = data.ph || null;
        this.oxygen = data.oxygen || null;
        this.feeding_kg = data.feeding_kg || null;
        this.notes = data.notes || '';
        this.last_measurement = data.last_measurement || new Date().toISOString();

        // History
        this.measurements = data.measurements || [];
    }

    get mortalityRate() {
        return this.initial_count > 0
            ? ((this.total_dead / this.initial_count) * 100).toFixed(2)
            : 0;
    }

    get status() {
        const mortality = parseFloat(this.mortalityRate);
        const hasEnvironmentalIssues = this.checkEnvironmentalIssues();

        if (mortality > CONFIG.HIGH_MORTALITY_THRESHOLD ||
            this.alive_count < CONFIG.LOW_POPULATION_THRESHOLD ||
            hasEnvironmentalIssues.critical) {
            return 'critical';
        } else if (mortality > CONFIG.HIGH_MORTALITY_THRESHOLD / 2 ||
                   hasEnvironmentalIssues.warning) {
            return 'warning';
        }
        return 'good';
    }

    get statusLabel() {
        const labels = {
            critical: 'Critique',
            warning: 'Attention',
            good: 'Bon'
        };
        return labels[this.status];
    }

    checkEnvironmentalIssues() {
        const issues = { critical: false, warning: false, messages: [] };

        // Water temperature check (optimal: 20-28°C for most fish)
        if (this.water_temp !== null) {
            if (this.water_temp < 15 || this.water_temp > 32) {
                issues.critical = true;
                issues.messages.push('Température eau critique');
            } else if (this.water_temp < 18 || this.water_temp > 30) {
                issues.warning = true;
                issues.messages.push('Température eau sous-optimale');
            }
        }

        // pH check (optimal: 6.5-8.5)
        if (this.ph !== null) {
            if (this.ph < 6.0 || this.ph > 9.0) {
                issues.critical = true;
                issues.messages.push('pH critique');
            } else if (this.ph < 6.5 || this.ph > 8.5) {
                issues.warning = true;
                issues.messages.push('pH sous-optimal');
            }
        }

        // Oxygen check (optimal: >5 mg/L)
        if (this.oxygen !== null) {
            if (this.oxygen < 3) {
                issues.critical = true;
                issues.messages.push('Oxygène critique');
            } else if (this.oxygen < 5) {
                issues.warning = true;
                issues.messages.push('Oxygène faible');
            }
        }

        return issues;
    }

    updateCounts(aliveCount, newDeadCount = 0) {
        this.alive_count = parseInt(aliveCount);
        this.total_dead += parseInt(newDeadCount);
    }

    updateEnvironmental(data) {
        // Save current measurement to history
        if (this.water_temp || this.ambient_temp || this.ph || this.oxygen) {
            this.measurements.push({
                timestamp: this.last_measurement,
                water_temp: this.water_temp,
                ambient_temp: this.ambient_temp,
                ph: this.ph,
                oxygen: this.oxygen,
                feeding_kg: this.feeding_kg,
                alive_count: this.alive_count
            });

            // Keep only last 100 measurements
            if (this.measurements.length > 100) {
                this.measurements = this.measurements.slice(-100);
            }
        }

        // Update with new data
        this.water_temp = data.water_temp !== undefined ? parseFloat(data.water_temp) : this.water_temp;
        this.ambient_temp = data.ambient_temp !== undefined ? parseFloat(data.ambient_temp) : this.ambient_temp;
        this.ph = data.ph !== undefined ? parseFloat(data.ph) : this.ph;
        this.oxygen = data.oxygen !== undefined ? parseFloat(data.oxygen) : this.oxygen;
        this.feeding_kg = data.feeding_kg !== undefined ? parseFloat(data.feeding_kg) : this.feeding_kg;
        this.notes = data.notes !== undefined ? data.notes : this.notes;
        this.last_measurement = new Date().toISOString();
    }
}

// ==========================================
// Alert System
// ==========================================
class AlertSystem {
    static generateAlerts(cages) {
        const alerts = [];

        cages.forEach(cage => {
            const mortality = parseFloat(cage.mortalityRate);

            // High mortality alert
            if (mortality > CONFIG.HIGH_MORTALITY_THRESHOLD) {
                alerts.push({
                    type: 'danger',
                    title: `Cage ${cage.cage_number} - Mortalité Élevée`,
                    message: `Taux de mortalité: ${mortality}% (>${CONFIG.HIGH_MORTALITY_THRESHOLD}%)`
                });
            }

            // Low population alert
            if (cage.alive_count < CONFIG.LOW_POPULATION_THRESHOLD) {
                alerts.push({
                    type: 'warning',
                    title: `Cage ${cage.cage_number} - Population Faible`,
                    message: `Population: ${cage.alive_count} poissons (<${CONFIG.LOW_POPULATION_THRESHOLD})`
                });
            }

            // Data inconsistency alert
            if (cage.alive_count + cage.total_dead !== cage.initial_count) {
                alerts.push({
                    type: 'danger',
                    title: `Cage ${cage.cage_number} - Données Incohérentes`,
                    message: 'Les comptes ne correspondent pas à la population initiale'
                });
            }

            // Environmental alerts
            const envIssues = cage.checkEnvironmentalIssues();
            envIssues.messages.forEach(message => {
                alerts.push({
                    type: envIssues.critical ? 'danger' : 'warning',
                    title: `Cage ${cage.cage_number} - Environnement`,
                    message: message
                });
            });
        });

        return alerts;
    }

    static render(alerts) {
        if (alerts.length === 0) {
            DOM.alertsSection.style.display = 'none';
            return;
        }

        DOM.alertsSection.style.display = 'block';
        DOM.alertsContainer.innerHTML = alerts.map(alert => `
            <div class="alert alert-${alert.type}">
                <div class="alert-icon">
                    <i data-lucide="${alert.type === 'danger' ? 'alert-triangle' : 'alert-circle'}"></i>
                </div>
                <div class="alert-content">
                    <div class="alert-title">${alert.title}</div>
                    <div class="alert-message">${alert.message}</div>
                </div>
            </div>
        `).join('');

        // Reinitialize Lucide icons
        lucide.createIcons();
    }
}

// ==========================================
// Statistics Calculator
// ==========================================
class Statistics {
    static calculate(cages) {
        const totalCages = cages.length;
        const totalAlive = cages.reduce((sum, cage) => sum + cage.alive_count, 0);
        const totalInitial = cages.reduce((sum, cage) => sum + cage.initial_count, 0);
        const survivalRate = totalInitial > 0
            ? ((totalAlive / totalInitial) * 100).toFixed(1)
            : 0;

        const alerts = AlertSystem.generateAlerts(cages);

        return {
            totalCages,
            totalAlive,
            survivalRate,
            totalAlerts: alerts.length,
            alerts
        };
    }

    static render(stats) {
        DOM.totalCages.textContent = stats.totalCages;
        DOM.totalAlive.textContent = stats.totalAlive.toLocaleString();
        DOM.survivalRate.textContent = `${stats.survivalRate}%`;
        DOM.totalAlerts.textContent = stats.totalAlerts;

        AlertSystem.render(stats.alerts);
    }
}

// ==========================================
// UI Renderer
// ==========================================
class UIRenderer {
    static renderCages(cages) {
        if (cages.length === 0) {
            DOM.cagesGrid.innerHTML = `
                <div class="text-center" style="grid-column: 1/-1; padding: 3rem;">
                    <p style="color: var(--color-text-secondary); font-size: 1.125rem;">
                        Aucune cage n'est configurée. Cliquez sur "Ajouter une Cage" pour commencer.
                    </p>
                </div>
            `;
            return;
        }

        DOM.cagesGrid.innerHTML = cages.map(cage => `
            <div class="cage-card status-${cage.status}" data-cage-id="${cage.id}">
                <div class="cage-header">
                    <div class="cage-number">Cage ${cage.cage_number}</div>
                    <div class="cage-status status-${cage.status}">${cage.statusLabel}</div>
                </div>
                <div class="cage-stats">
                    <div class="cage-stat">
                        <span class="cage-stat-label">
                            <i data-lucide="layers"></i>
                            Initial
                        </span>
                        <span class="cage-stat-value">${cage.initial_count}</span>
                    </div>
                    <div class="cage-stat">
                        <span class="cage-stat-label">
                            <i data-lucide="heart"></i>
                            Vivants
                        </span>
                        <span class="cage-stat-value">${cage.alive_count}</span>
                    </div>
                    <div class="cage-stat">
                        <span class="cage-stat-label">
                            <i data-lucide="x-circle"></i>
                            Morts
                        </span>
                        <span class="cage-stat-value">${cage.total_dead}</span>
                    </div>
                </div>
                <div class="cage-mortality">
                    <div class="mortality-label">Taux de Mortalité</div>
                    <div class="mortality-bar">
                        <div class="mortality-fill ${this.getMortalityClass(cage.mortalityRate)}"
                             style="width: ${Math.min(cage.mortalityRate, 100)}%">
                        </div>
                    </div>
                    <div class="mortality-value">${cage.mortalityRate}%</div>
                </div>
            </div>
        `).join('');

        // Reinitialize Lucide icons
        lucide.createIcons();

        // Add click handlers
        document.querySelectorAll('.cage-card').forEach(card => {
            card.addEventListener('click', () => {
                const cageId = parseInt(card.dataset.cageId);
                App.editCage(cageId);
            });
        });
    }

    static getMortalityClass(rate) {
        const mortality = parseFloat(rate);
        if (mortality > CONFIG.HIGH_MORTALITY_THRESHOLD) return 'high';
        if (mortality > CONFIG.HIGH_MORTALITY_THRESHOLD / 2) return 'medium';
        return 'low';
    }
}

// ==========================================
// Modal Manager
// ==========================================
class ModalManager {
    static open(editMode = false, cage = null) {
        AppState.isEditMode = editMode;
        AppState.currentCage = cage;

        // Update modal title
        DOM.modalTitle.textContent = editMode ? `Modifier Cage ${cage.cage_number}` : 'Ajouter une Cage';

        // Reset form
        DOM.cageForm.reset();

        if (editMode && cage) {
            DOM.cageNumber.value = cage.cage_number;
            DOM.cageNumber.disabled = true;
            DOM.initialCount.value = cage.initial_count;
            DOM.initialCount.disabled = true;
            DOM.aliveCount.value = cage.alive_count;
            DOM.newDead.value = 0;

            DOM.aliveCountGroup.style.display = 'block';
            DOM.newDeadGroup.style.display = 'block';
        } else {
            DOM.cageNumber.disabled = false;
            DOM.initialCount.disabled = false;
            DOM.aliveCountGroup.style.display = 'none';
            DOM.newDeadGroup.style.display = 'none';
        }

        DOM.modal.classList.add('active');
        DOM.cageNumber.focus();

        // Reinitialize icons
        lucide.createIcons();
    }

    static close() {
        DOM.modal.classList.remove('active');
        AppState.currentCage = null;
        AppState.isEditMode = false;
    }
}

// ==========================================
// Application Controller
// ==========================================
class App {
    static async init() {
        console.log('🌊 AquaVision Pro - Initializing...');

        // Load data
        await this.loadCages();

        // Setup event listeners
        this.setupEventListeners();

        // Setup theme
        this.setupTheme();

        // Render initial view
        this.render();

        console.log('✓ AquaVision Pro - Ready');
    }

    static async loadCages() {
        AppState.cages = await DataManager.fetchFromAPI();
        AppState.cages = AppState.cages.map(data => new Cage(data));
    }

    static setupEventListeners() {
        // Add cage button
        DOM.addCageBtn.addEventListener('click', () => {
            ModalManager.open(false);
        });

        // Modal close buttons
        DOM.modalClose.addEventListener('click', () => ModalManager.close());
        DOM.cancelBtn.addEventListener('click', () => ModalManager.close());
        DOM.modalOverlay.addEventListener('click', () => ModalManager.close());

        // Form submit
        DOM.cageForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        // Theme toggle
        DOM.themeToggle.addEventListener('click', () => this.toggleTheme());

        // Refresh button
        DOM.refreshBtn.addEventListener('click', () => this.refresh());

        // ESC key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && DOM.modal.classList.contains('active')) {
                ModalManager.close();
            }
        });
    }

    static setupTheme() {
        const savedTheme = localStorage.getItem('aquavision_theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
            this.updateThemeIcon(true);
        }
    }

    static toggleTheme() {
        const isLight = document.body.classList.toggle('light-theme');
        localStorage.setItem('aquavision_theme', isLight ? 'light' : 'dark');
        this.updateThemeIcon(isLight);
    }

    static updateThemeIcon(isLight) {
        const icon = DOM.themeToggle.querySelector('i');
        icon.setAttribute('data-lucide', isLight ? 'sun' : 'moon');
        lucide.createIcons();
    }

    static handleFormSubmit() {
        if (AppState.isEditMode) {
            this.updateCage();
        } else {
            this.addCage();
        }
    }

    static addCage() {
        const cageNumber = parseInt(DOM.cageNumber.value);
        const initialCount = parseInt(DOM.initialCount.value);

        // Validation
        if (AppState.cages.some(c => c.cage_number === cageNumber)) {
            alert('Une cage avec ce numéro existe déjà !');
            return;
        }

        const newCage = new Cage({
            cage_number: cageNumber,
            initial_count: initialCount
        });

        AppState.cages.push(newCage);
        this.saveCages();
        ModalManager.close();
        this.render();
    }

    static updateCage() {
        const aliveCount = parseInt(DOM.aliveCount.value);
        const newDead = parseInt(DOM.newDead.value) || 0;

        const cage = AppState.currentCage;

        // Validation
        if (aliveCount + cage.total_dead + newDead > cage.initial_count) {
            alert('Le total des poissons dépasse la population initiale !');
            return;
        }

        cage.updateCounts(aliveCount, newDead);
        this.saveCages();
        ModalManager.close();
        this.render();
    }

    static editCage(cageId) {
        const cage = AppState.cages.find(c => c.id === cageId);
        if (cage) {
            ModalManager.open(true, cage);
        }
    }

    static saveCages() {
        DataManager.saveToStorage(AppState.cages);
    }

    static render() {
        const stats = Statistics.calculate(AppState.cages);
        Statistics.render(stats);
        UIRenderer.renderCages(AppState.cages);
    }

    static async refresh() {
        DOM.refreshBtn.classList.add('loading');
        await this.loadCages();
        this.render();
        setTimeout(() => {
            DOM.refreshBtn.classList.remove('loading');
        }, 300);
    }
}

// ==========================================
// Development Tools
// ==========================================
window.aquavisionDev = {
    reset() {
        if (confirm('Voulez-vous vraiment réinitialiser toutes les données ?')) {
            localStorage.removeItem(CONFIG.STORAGE_KEY);
            AppState.cages = [];
            App.render();
            console.log('✓ Données réinitialisées');
        }
    },

    simulate() {
        AppState.cages.forEach(cage => {
            const randomDead = Math.floor(Math.random() * 10);
            cage.updateCounts(cage.alive_count - randomDead, randomDead);
        });
        App.saveCages();
        App.render();
        console.log('✓ Simulation appliquée');
    },

    export() {
        return JSON.stringify(AppState.cages, null, 2);
    },

    getCages() {
        console.table(AppState.cages.map(c => ({
            'Cage': c.cage_number,
            'Initial': c.initial_count,
            'Vivants': c.alive_count,
            'Morts': c.total_dead,
            'Mortalité': c.mortalityRate + '%',
            'Statut': c.statusLabel
        })));
    },

    addSampleData() {
        const samples = [
            { cage_number: 1, initial_count: 200, alive_count: 185, total_dead: 15 },
            { cage_number: 2, initial_count: 250, alive_count: 245, total_dead: 5 },
            { cage_number: 3, initial_count: 180, alive_count: 150, total_dead: 30 },
            { cage_number: 4, initial_count: 220, alive_count: 210, total_dead: 10 },
            { cage_number: 5, initial_count: 300, alive_count: 280, total_dead: 20 },
            { cage_number: 6, initial_count: 150, alive_count: 90, total_dead: 60 },
            { cage_number: 7, initial_count: 200, alive_count: 195, total_dead: 5 },
            { cage_number: 8, initial_count: 175, alive_count: 160, total_dead: 15 }
        ];

        AppState.cages = samples.map(data => new Cage(data));
        App.saveCages();
        App.render();
        console.log('✓ Données d\'exemple ajoutées');
    }
};

// ==========================================
// Initialize Application
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
