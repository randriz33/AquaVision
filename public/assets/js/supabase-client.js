/**
 * AquaVision Pro - Supabase Client
 * @version 2.0.0
 */

// ==========================================
// Supabase Configuration
// ==========================================

const SUPABASE_CONFIG = {
    url: 'https://gswozuotdrfgvutitssf.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdzd296dW90ZHJmZ3Z1dGl0c3NmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzNDA5NzMsImV4cCI6MjA4MTkxNjk3M30.9fivWqGwgVjs6lvKHg-ybWtq1D5EaZ3ZM7Gcz_JZxh0'
};

// Vérifier que la configuration est définie
if (!SUPABASE_CONFIG.url || !SUPABASE_CONFIG.anonKey) {
    console.warn('⚠️ Configuration Supabase manquante. Utilisez le mode local.');
}

// ==========================================
// Initialize Supabase Client
// ==========================================
let supabaseClient = null;

function initializeSupabase() {
    if (typeof window.supabase !== 'undefined' && SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey) {
        try {
            supabaseClient = window.supabase.createClient(
                SUPABASE_CONFIG.url,
                SUPABASE_CONFIG.anonKey
            );
            console.log('✓ Supabase initialisé');
            return true;
        } catch (error) {
            console.error('Erreur initialisation Supabase:', error);
            return false;
        }
    }
    return false;
}

// ==========================================
// Supabase Service
// ==========================================
class SupabaseService {
    static isConfigured() {
        return supabaseClient !== null;
    }

    // ==========================================
    // Authentication
    // ==========================================

    static async signUp(email, password, fullName, role = 'technicien') {
        try {
            const { data, error } = await supabaseClient.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        role: role
                    }
                }
            });

            if (error) throw error;

            await this.logActivity('user_signup', 'user', data.user?.id);
            return { success: true, user: data.user };
        } catch (error) {
            console.error('Signup error:', error);
            return { success: false, error: error.message };
        }
    }

    static async signIn(email, password) {
        try {
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            await this.logActivity('user_signin', 'user', data.user.id);
            return { success: true, user: data.user, session: data.session };
        } catch (error) {
            console.error('Signin error:', error);
            return { success: false, error: error.message };
        }
    }

    static async signOut() {
        try {
            const { error } = await supabaseClient.auth.signOut();
            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('Signout error:', error);
            return { success: false, error: error.message };
        }
    }

    static async getCurrentUser() {
        try {
            const { data: { user }, error } = await supabaseClient.auth.getUser();
            if (error) throw error;
            return user;
        } catch (error) {
            console.error('Get user error:', error);
            return null;
        }
    }

    static async getUserProfile(userId = null) {
        try {
            const uid = userId || (await this.getCurrentUser())?.id;
            if (!uid) return null;

            const { data, error } = await supabaseClient
                .from('profiles')
                .select('*')
                .eq('id', uid)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Get profile error:', error);
            return null;
        }
    }

    static async isAdmin() {
        const profile = await this.getUserProfile();
        return profile?.role === 'admin';
    }

    static onAuthStateChange(callback) {
        return supabaseClient.auth.onAuthStateChange(callback);
    }

    // ==========================================
    // Cages Management
    // ==========================================

    static async getCages() {
        try {
            const { data, error } = await supabaseClient
                .from('cages')
                .select('*')
                .eq('status', 'active')
                .order('cage_number');

            if (error) throw error;
            return { success: true, cages: data };
        } catch (error) {
            console.error('Get cages error:', error);
            return { success: false, error: error.message, cages: [] };
        }
    }

    static async getCage(cageId) {
        try {
            const { data, error } = await supabaseClient
                .from('cages')
                .select('*')
                .eq('id', cageId)
                .single();

            if (error) throw error;
            return { success: true, cage: data };
        } catch (error) {
            console.error('Get cage error:', error);
            return { success: false, error: error.message };
        }
    }

    static async createCage(cageData) {
        try {
            const user = await this.getCurrentUser();
            const { data, error } = await supabaseClient
                .from('cages')
                .insert({
                    ...cageData,
                    created_by: user.id
                })
                .select()
                .single();

            if (error) throw error;

            await this.logActivity('cage_created', 'cage', data.id, { cage_number: cageData.cage_number });
            return { success: true, cage: data };
        } catch (error) {
            console.error('Create cage error:', error);
            return { success: false, error: error.message };
        }
    }

    static async updateCage(cageId, updates) {
        try {
            const { data, error } = await supabaseClient
                .from('cages')
                .update(updates)
                .eq('id', cageId)
                .select()
                .single();

            if (error) throw error;

            await this.logActivity('cage_updated', 'cage', cageId, updates);
            return { success: true, cage: data };
        } catch (error) {
            console.error('Update cage error:', error);
            return { success: false, error: error.message };
        }
    }

    static async deleteCage(cageId) {
        try {
            const { error } = await supabaseClient
                .from('cages')
                .delete()
                .eq('id', cageId);

            if (error) throw error;

            await this.logActivity('cage_deleted', 'cage', cageId);
            return { success: true };
        } catch (error) {
            console.error('Delete cage error:', error);
            return { success: false, error: error.message };
        }
    }

    // ==========================================
    // Daily Reports Management
    // ==========================================

    static async getDailyReports(filters = {}) {
        try {
            let query = supabase
                .from('daily_reports')
                .select(`
                    *,
                    cage:cages(cage_number, location),
                    creator:profiles!created_by(full_name, role)
                `)
                .order('report_date', { ascending: false });

            if (filters.cageId) {
                query = query.eq('cage_id', filters.cageId);
            }

            if (filters.startDate) {
                query = query.gte('report_date', filters.startDate);
            }

            if (filters.endDate) {
                query = query.lte('report_date', filters.endDate);
            }

            const { data, error } = await query;

            if (error) throw error;
            return { success: true, reports: data };
        } catch (error) {
            console.error('Get reports error:', error);
            return { success: false, error: error.message, reports: [] };
        }
    }

    static async getTodayReport(cageId) {
        try {
            const today = new Date().toISOString().split('T')[0];

            const { data, error } = await supabaseClient
                .from('daily_reports')
                .select('*')
                .eq('cage_id', cageId)
                .eq('report_date', today)
                .single();

            if (error && error.code !== 'PGRST116') throw error; // Ignore "no rows" error

            return { success: true, report: data };
        } catch (error) {
            console.error('Get today report error:', error);
            return { success: false, error: error.message };
        }
    }

    static async createDailyReport(reportData) {
        try {
            const user = await this.getCurrentUser();
            const { data, error } = await supabaseClient
                .from('daily_reports')
                .insert({
                    ...reportData,
                    created_by: user.id,
                    updated_by: user.id
                })
                .select()
                .single();

            if (error) throw error;

            // Update cage counts
            await this.updateCage(reportData.cage_id, {
                alive_count: reportData.alive_count,
                total_dead: reportData.total_dead
            });

            await this.logActivity('report_created', 'daily_report', data.id, {
                cage_id: reportData.cage_id,
                report_date: reportData.report_date
            });

            return { success: true, report: data };
        } catch (error) {
            console.error('Create report error:', error);
            return { success: false, error: error.message };
        }
    }

    static async updateDailyReport(reportId, updates) {
        try {
            const user = await this.getCurrentUser();
            const { data, error } = await supabaseClient
                .from('daily_reports')
                .update({
                    ...updates,
                    updated_by: user.id
                })
                .eq('id', reportId)
                .select()
                .single();

            if (error) throw error;

            await this.logActivity('report_updated', 'daily_report', reportId, updates);
            return { success: true, report: data };
        } catch (error) {
            console.error('Update report error:', error);
            return { success: false, error: error.message };
        }
    }

    // ==========================================
    // Alerts Management
    // ==========================================

    static async getActiveAlerts() {
        try {
            const { data, error } = await supabaseClient
                .from('alerts')
                .select(`
                    *,
                    cage:cages(cage_number, location)
                `)
                .eq('is_active', true)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return { success: true, alerts: data };
        } catch (error) {
            console.error('Get alerts error:', error);
            return { success: false, error: error.message, alerts: [] };
        }
    }

    static async createAlert(alertData) {
        try {
            const { data, error } = await supabaseClient
                .from('alerts')
                .insert(alertData)
                .select()
                .single();

            if (error) throw error;
            return { success: true, alert: data };
        } catch (error) {
            console.error('Create alert error:', error);
            return { success: false, error: error.message };
        }
    }

    static async resolveAlert(alertId, resolutionNotes) {
        try {
            const user = await this.getCurrentUser();
            const { data, error } = await supabaseClient
                .from('alerts')
                .update({
                    is_active: false,
                    resolved_at: new Date().toISOString(),
                    resolved_by: user.id,
                    resolution_notes: resolutionNotes
                })
                .eq('id', alertId)
                .select()
                .single();

            if (error) throw error;

            await this.logActivity('alert_resolved', 'alert', alertId);
            return { success: true, alert: data };
        } catch (error) {
            console.error('Resolve alert error:', error);
            return { success: false, error: error.message };
        }
    }

    // ==========================================
    // Activity Log
    // ==========================================

    static async logActivity(action, entityType, entityId = null, details = null) {
        try {
            const user = await this.getCurrentUser();
            if (!user) return;

            await supabaseClient
                .from('activity_log')
                .insert({
                    user_id: user.id,
                    action,
                    entity_type: entityType,
                    entity_id: entityId,
                    details
                });
        } catch (error) {
            console.error('Log activity error:', error);
        }
    }

    static async getActivityLog(filters = {}) {
        try {
            let query = supabase
                .from('activity_log')
                .select(`
                    *,
                    user:profiles!user_id(full_name, role, email)
                `)
                .order('created_at', { ascending: false })
                .limit(filters.limit || 100);

            if (filters.userId) {
                query = query.eq('user_id', filters.userId);
            }

            const { data, error } = await query;

            if (error) throw error;
            return { success: true, logs: data };
        } catch (error) {
            console.error('Get activity log error:', error);
            return { success: false, error: error.message, logs: [] };
        }
    }

    // ==========================================
    // Real-time Subscriptions
    // ==========================================

    static subscribeToCages(callback) {
        return supabase
            .channel('cages_changes')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'cages'
            }, callback)
            .subscribe();
    }

    static subscribeToDailyReports(callback) {
        return supabase
            .channel('reports_changes')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'daily_reports'
            }, callback)
            .subscribe();
    }

    static subscribeToAlerts(callback) {
        return supabase
            .channel('alerts_changes')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'alerts'
            }, callback)
            .subscribe();
    }

    static unsubscribe(channel) {
        if (channel) {
            supabaseClient.removeChannel(channel);
        }
    }
}

// Make service available globally
window.SupabaseService = SupabaseService;

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSupabase);
} else {
    initializeSupabase();
}
