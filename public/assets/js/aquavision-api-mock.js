/**
 * AquaVision Pro - API Mock
 * Simulates REST API endpoints for development
 * @version 1.0.0
 */

class AquaVisionAPI {
    /**
     * Simulates network delay
     * @param {number} ms - Delay in milliseconds
     */
    static async _delay(ms = 300) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Simulates success/failure with configurable rate
     * @param {number} successRate - Success rate (0-1)
     */
    static _shouldSucceed(successRate = 0.95) {
        return Math.random() < successRate;
    }

    /**
     * GET /api/cages
     * Retrieves all cages with their statistics
     * @returns {Promise<Object>}
     */
    static async getCages() {
        await this._delay();

        if (!this._shouldSucceed()) {
            return {
                success: false,
                error: 'Failed to fetch cages',
                message: 'Network error occurred'
            };
        }

        // Try to load from localStorage first
        const stored = localStorage.getItem('aquavision_cages');
        const cages = stored ? JSON.parse(stored) : [];

        return {
            success: true,
            cages: cages,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * POST /api/cages
     * Creates a new cage
     * @param {Object} cageData - Cage data
     * @returns {Promise<Object>}
     */
    static async createCage(cageData) {
        await this._delay();

        // Validation
        if (!cageData.cage_number || !cageData.initial_count) {
            return {
                success: false,
                error: 'Validation failed',
                message: 'cage_number and initial_count are required'
            };
        }

        if (!this._shouldSucceed()) {
            return {
                success: false,
                error: 'Failed to create cage',
                message: 'Server error occurred'
            };
        }

        // Create cage with generated ID
        const newCage = {
            id: Date.now(),
            cage_number: parseInt(cageData.cage_number),
            initial_count: parseInt(cageData.initial_count),
            alive_count: parseInt(cageData.initial_count),
            total_dead: 0,
            created_at: new Date().toISOString()
        };

        // Save to localStorage
        const stored = localStorage.getItem('aquavision_cages');
        const cages = stored ? JSON.parse(stored) : [];
        cages.push(newCage);
        localStorage.setItem('aquavision_cages', JSON.stringify(cages));

        return {
            success: true,
            cage: newCage,
            message: 'Cage created successfully'
        };
    }

    /**
     * PUT /api/cages/:id
     * Updates an existing cage
     * @param {number} id - Cage ID
     * @param {Object} updateData - Update data
     * @returns {Promise<Object>}
     */
    static async updateCage(id, updateData) {
        await this._delay();

        const stored = localStorage.getItem('aquavision_cages');
        const cages = stored ? JSON.parse(stored) : [];

        const cageIndex = cages.findIndex(c => c.id === id);

        if (cageIndex === -1) {
            return {
                success: false,
                error: 'Cage not found',
                message: `Cage with ID ${id} does not exist`
            };
        }

        if (!this._shouldSucceed()) {
            return {
                success: false,
                error: 'Failed to update cage',
                message: 'Server error occurred'
            };
        }

        // Update cage
        cages[cageIndex] = {
            ...cages[cageIndex],
            ...updateData,
            updated_at: new Date().toISOString()
        };

        localStorage.setItem('aquavision_cages', JSON.stringify(cages));

        return {
            success: true,
            cage: cages[cageIndex],
            message: 'Cage updated successfully'
        };
    }

    /**
     * DELETE /api/cages/:id
     * Deletes a cage
     * @param {number} id - Cage ID
     * @returns {Promise<Object>}
     */
    static async deleteCage(id) {
        await this._delay();

        const stored = localStorage.getItem('aquavision_cages');
        const cages = stored ? JSON.parse(stored) : [];

        const cageIndex = cages.findIndex(c => c.id === id);

        if (cageIndex === -1) {
            return {
                success: false,
                error: 'Cage not found',
                message: `Cage with ID ${id} does not exist`
            };
        }

        if (!this._shouldSucceed()) {
            return {
                success: false,
                error: 'Failed to delete cage',
                message: 'Server error occurred'
            };
        }

        // Delete cage
        cages.splice(cageIndex, 1);
        localStorage.setItem('aquavision_cages', JSON.stringify(cages));

        return {
            success: true,
            message: 'Cage deleted successfully',
            deleted_id: id
        };
    }

    /**
     * GET /api/statistics
     * Retrieves global statistics
     * @returns {Promise<Object>}
     */
    static async getStatistics() {
        await this._delay();

        const stored = localStorage.getItem('aquavision_cages');
        const cages = stored ? JSON.parse(stored) : [];

        const totalCages = cages.length;
        const totalAlive = cages.reduce((sum, cage) => sum + (cage.alive_count || 0), 0);
        const totalDead = cages.reduce((sum, cage) => sum + (cage.total_dead || 0), 0);
        const totalInitial = cages.reduce((sum, cage) => sum + (cage.initial_count || 0), 0);
        const survivalRate = totalInitial > 0
            ? ((totalAlive / totalInitial) * 100).toFixed(2)
            : 0;

        const averageDensity = totalCages > 0
            ? (totalAlive / totalCages).toFixed(0)
            : 0;

        return {
            success: true,
            statistics: {
                total_cages: totalCages,
                total_alive: totalAlive,
                total_dead: totalDead,
                total_initial: totalInitial,
                survival_rate: parseFloat(survivalRate),
                average_density: parseInt(averageDensity)
            },
            timestamp: new Date().toISOString()
        };
    }

    /**
     * GET /api/alerts
     * Retrieves active alerts
     * @returns {Promise<Object>}
     */
    static async getAlerts() {
        await this._delay();

        const stored = localStorage.getItem('aquavision_cages');
        const cages = stored ? JSON.parse(stored) : [];

        const alerts = [];
        const HIGH_MORTALITY_THRESHOLD = 10;
        const LOW_POPULATION_THRESHOLD = 100;

        cages.forEach(cage => {
            const mortalityRate = cage.initial_count > 0
                ? ((cage.total_dead / cage.initial_count) * 100)
                : 0;

            // High mortality alert
            if (mortalityRate > HIGH_MORTALITY_THRESHOLD) {
                alerts.push({
                    id: `alert_${cage.id}_mortality`,
                    cage_id: cage.id,
                    cage_number: cage.cage_number,
                    type: 'danger',
                    category: 'mortality',
                    title: `Cage ${cage.cage_number} - Mortalité Élevée`,
                    message: `Taux de mortalité: ${mortalityRate.toFixed(2)}%`,
                    threshold: HIGH_MORTALITY_THRESHOLD,
                    current_value: mortalityRate.toFixed(2),
                    created_at: new Date().toISOString()
                });
            }

            // Low population alert
            if (cage.alive_count < LOW_POPULATION_THRESHOLD) {
                alerts.push({
                    id: `alert_${cage.id}_population`,
                    cage_id: cage.id,
                    cage_number: cage.cage_number,
                    type: 'warning',
                    category: 'population',
                    title: `Cage ${cage.cage_number} - Population Faible`,
                    message: `Population: ${cage.alive_count} poissons`,
                    threshold: LOW_POPULATION_THRESHOLD,
                    current_value: cage.alive_count,
                    created_at: new Date().toISOString()
                });
            }

            // Data inconsistency alert
            if (cage.alive_count + cage.total_dead !== cage.initial_count) {
                alerts.push({
                    id: `alert_${cage.id}_inconsistency`,
                    cage_id: cage.id,
                    cage_number: cage.cage_number,
                    type: 'danger',
                    category: 'data',
                    title: `Cage ${cage.cage_number} - Données Incohérentes`,
                    message: 'Les comptes ne correspondent pas',
                    created_at: new Date().toISOString()
                });
            }
        });

        return {
            success: true,
            alerts: alerts,
            count: alerts.length,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * POST /api/batch-update
     * Updates multiple cages at once
     * @param {Array} updates - Array of cage updates
     * @returns {Promise<Object>}
     */
    static async batchUpdate(updates) {
        await this._delay(500);

        const stored = localStorage.getItem('aquavision_cages');
        const cages = stored ? JSON.parse(stored) : [];

        const results = {
            success: [],
            failed: []
        };

        updates.forEach(update => {
            const cageIndex = cages.findIndex(c => c.id === update.id);
            if (cageIndex !== -1) {
                cages[cageIndex] = {
                    ...cages[cageIndex],
                    ...update,
                    updated_at: new Date().toISOString()
                };
                results.success.push(update.id);
            } else {
                results.failed.push({
                    id: update.id,
                    reason: 'Cage not found'
                });
            }
        });

        localStorage.setItem('aquavision_cages', JSON.stringify(cages));

        return {
            success: results.failed.length === 0,
            results: results,
            message: `Updated ${results.success.length} cages, ${results.failed.length} failed`
        };
    }

    /**
     * POST /api/export
     * Exports cage data in various formats
     * @param {string} format - Export format (json, csv)
     * @returns {Promise<Object>}
     */
    static async exportData(format = 'json') {
        await this._delay();

        const stored = localStorage.getItem('aquavision_cages');
        const cages = stored ? JSON.parse(stored) : [];

        if (format === 'csv') {
            const headers = 'Cage,Initial,Vivants,Morts,Mortalité(%)';
            const rows = cages.map(cage => {
                const mortality = cage.initial_count > 0
                    ? ((cage.total_dead / cage.initial_count) * 100).toFixed(2)
                    : 0;
                return `${cage.cage_number},${cage.initial_count},${cage.alive_count},${cage.total_dead},${mortality}`;
            });

            return {
                success: true,
                format: 'csv',
                data: [headers, ...rows].join('\n'),
                filename: `aquavision_export_${Date.now()}.csv`
            };
        }

        return {
            success: true,
            format: 'json',
            data: JSON.stringify(cages, null, 2),
            filename: `aquavision_export_${Date.now()}.json`
        };
    }
}

// Make API available globally
window.AquaVisionAPI = AquaVisionAPI;

// Log API initialization in development
console.log('✓ AquaVision API Mock initialized');
console.log('Available endpoints:');
console.log('  - AquaVisionAPI.getCages()');
console.log('  - AquaVisionAPI.createCage(data)');
console.log('  - AquaVisionAPI.updateCage(id, data)');
console.log('  - AquaVisionAPI.deleteCage(id)');
console.log('  - AquaVisionAPI.getStatistics()');
console.log('  - AquaVisionAPI.getAlerts()');
console.log('  - AquaVisionAPI.batchUpdate(updates)');
console.log('  - AquaVisionAPI.exportData(format)');
