/**
 * AquaVision Pro - Quick Entry System
 * Système de saisie rapide pour faciliter l'entrée des données
 */

class QuickEntry {
    static init() {
        this.createQuickEntryButton();
        this.setupKeyboardShortcuts();
    }

    static createQuickEntryButton() {
        const btn = document.createElement('button');
        btn.id = 'quickEntryBtn';
        btn.className = 'btn btn-primary';
        btn.style.marginLeft = 'var(--spacing-sm)';
        btn.innerHTML = `
            <i data-lucide="zap"></i>
            Saisie Rapide
        `;
        btn.onclick = () => this.openQuickEntry();

        const addCageBtn = document.getElementById('addCageBtn');
        if (addCageBtn && addCageBtn.parentElement) {
            addCageBtn.parentElement.insertBefore(btn, addCageBtn.nextSibling);
            lucide.createIcons();
        }
    }

    static setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+Q pour saisie rapide
            if (e.ctrlKey && e.key === 'q') {
                e.preventDefault();
                this.openQuickEntry();
            }
        });
    }

    static openQuickEntry() {
        const cages = AppState.cages;
        if (cages.length === 0) {
            alert('Aucune cage disponible. Ajoutez d\'abord des cages.');
            return;
        }

        this.showQuickEntryModal(cages);
    }

    static showQuickEntryModal(cages) {
        const modal = document.getElementById('cageModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = modal.querySelector('.modal-body');

        modalTitle.textContent = 'Saisie Rapide - Mise à Jour Multiple';

        // Create quick entry form
        modalBody.innerHTML = `
            <div class="quick-entry-container">
                <p style="color: var(--color-text-secondary); margin-bottom: var(--spacing-lg);">
                    Mettez à jour les données environnementales pour toutes les cages rapidement
                </p>

                <div class="form-section-title">
                    <i data-lucide="thermometer"></i>
                    Températures
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">
                            <i data-lucide="thermometer"></i>
                            Temp. Eau (°C)
                        </label>
                        <input type="number" id="qe_waterTemp" class="form-input" step="0.1" placeholder="Même pour toutes">
                    </div>
                    <div class="form-group">
                        <label class="form-label">
                            <i data-lucide="sun"></i>
                            Temp. Air (°C)
                        </label>
                        <input type="number" id="qe_ambientTemp" class="form-input" step="0.1" placeholder="Même pour toutes">
                    </div>
                </div>

                <div class="form-section-title">
                    <i data-lucide="droplet"></i>
                    Qualité de l'Eau
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">
                            <i data-lucide="beaker"></i>
                            pH
                        </label>
                        <input type="number" id="qe_ph" class="form-input" step="0.1" placeholder="Même pour toutes">
                    </div>
                    <div class="form-group">
                        <label class="form-label">
                            <i data-lucide="wind"></i>
                            O₂ (mg/L)
                        </label>
                        <input type="number" id="qe_oxygen" class="form-input" step="0.1" placeholder="Même pour toutes">
                    </div>
                </div>

                <div class="form-section-title">
                    <i data-lucide="package"></i>
                    Alimentation
                </div>

                <div class="form-group">
                    <label class="form-label">
                        <i data-lucide="package"></i>
                        Alimentation (kg/jour)
                    </label>
                    <input type="number" id="qe_feedingKg" class="form-input" step="0.1" placeholder="Même pour toutes">
                </div>

                <div class="form-group">
                    <label class="form-label">
                        <i data-lucide="file-text"></i>
                        Notes Générales
                    </label>
                    <textarea id="qe_notes" class="form-input" rows="3" placeholder="Notes appliquées à toutes les cages"></textarea>
                </div>

                <div class="form-group">
                    <label class="form-checkbox">
                        <input type="checkbox" id="qe_individual" onchange="QuickEntry.toggleIndividualInputs(this.checked)">
                        <span>Saisie individuelle par cage</span>
                    </label>
                </div>

                <div id="qe_individualSection" style="display: none;">
                    ${cages.map(cage => `
                        <div class="cage-quick-entry">
                            <h4>Cage ${cage.cage_number}</h4>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Temp. Eau</label>
                                    <input type="number" class="form-input qe-individual" data-cage="${cage.id}" data-field="water_temp" step="0.1" placeholder="${cage.water_temp || '-'}">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">pH</label>
                                    <input type="number" class="form-input qe-individual" data-cage="${cage.id}" data-field="ph" step="0.1" placeholder="${cage.ph || '-'}">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">O₂</label>
                                    <input type="number" class="form-input qe-individual" data-cage="${cage.id}" data-field="oxygen" step="0.1" placeholder="${cage.oxygen || '-'}">
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="QuickEntry.closeQuickEntry()">
                        Annuler
                    </button>
                    <button type="button" class="btn btn-primary" onclick="QuickEntry.submitQuickEntry()">
                        <i data-lucide="save"></i>
                        Enregistrer Tout
                    </button>
                </div>
            </div>
        `;

        modal.classList.add('active');
        lucide.createIcons();
    }

    static toggleIndividualInputs(show) {
        const section = document.getElementById('qe_individualSection');
        if (section) {
            section.style.display = show ? 'block' : 'none';
        }
    }

    static closeQuickEntry() {
        const modal = document.getElementById('cageModal');
        modal.classList.remove('active');

        // Restore original modal content
        setTimeout(() => {
            location.reload(); // Simple solution, or restore manually
        }, 300);
    }

    static async submitQuickEntry() {
        const isIndividual = document.getElementById('qe_individual')?.checked;

        if (isIndividual) {
            // Individual entry
            const inputs = document.querySelectorAll('.qe-individual');
            inputs.forEach(input => {
                if (input.value) {
                    const cageId = parseInt(input.dataset.cage);
                    const field = input.dataset.field;
                    const value = parseFloat(input.value);

                    const cage = AppState.cages.find(c => c.id === cageId);
                    if (cage) {
                        cage.updateEnvironmental({ [field]: value });
                    }
                }
            });
        } else {
            // Bulk entry
            const data = {
                water_temp: document.getElementById('qe_waterTemp')?.value,
                ambient_temp: document.getElementById('qe_ambientTemp')?.value,
                ph: document.getElementById('qe_ph')?.value,
                oxygen: document.getElementById('qe_oxygen')?.value,
                feeding_kg: document.getElementById('qe_feedingKg')?.value,
                notes: document.getElementById('qe_notes')?.value
            };

            // Apply to all cages
            AppState.cages.forEach(cage => {
                cage.updateEnvironmental(data);
            });
        }

        // Save and refresh
        App.saveCages();
        App.render();

        // Show success message
        this.showSuccessMessage();

        // Close modal
        this.closeQuickEntry();
    }

    static showSuccessMessage() {
        const msg = document.createElement('div');
        msg.className = 'success-toast';
        msg.innerHTML = `
            <i data-lucide="check-circle"></i>
            <span>Données mises à jour avec succès!</span>
        `;
        msg.style.cssText = `
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

        document.body.appendChild(msg);
        lucide.createIcons();

        setTimeout(() => {
            msg.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => msg.remove(), 300);
        }, 3000);
    }
}

// Style for checkbox
const style = document.createElement('style');
style.textContent = `
    .form-checkbox {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        cursor: pointer;
        user-select: none;
    }

    .form-checkbox input[type="checkbox"] {
        width: 18px;
        height: 18px;
        cursor: pointer;
    }

    .cage-quick-entry {
        background: var(--color-bg-tertiary);
        padding: var(--spacing-md);
        border-radius: var(--radius-md);
        margin-bottom: var(--spacing-md);
        border: 1px solid var(--color-border);
    }

    .cage-quick-entry h4 {
        margin-bottom: var(--spacing-sm);
        color: var(--color-primary);
    }

    @keyframes slideOut {
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(style);

// Initialize on DOM load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => QuickEntry.init());
} else {
    QuickEntry.init();
}
