/**
 * AquaVision Pro - Authentication System
 * @version 2.0.0
 */

class AuthManager {
    static currentUser = null;
    static currentProfile = null;

    // ==========================================
    // Initialize
    // ==========================================
    static async init() {
        // Check if user is already logged in
        const user = await SupabaseService.getCurrentUser();

        if (user) {
            await this.handleUserLoggedIn(user);
        } else {
            this.showAuthScreen();
        }

        // Listen for auth state changes
        SupabaseService.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN') {
                await this.handleUserLoggedIn(session.user);
            } else if (event === 'SIGNED_OUT') {
                this.handleUserLoggedOut();
            }
        });
    }

    // ==========================================
    // Auth UI
    // ==========================================
    static showAuthScreen() {
        const app = document.getElementById('app');
        if (!app) return;

        app.innerHTML = `
            <div class="auth-container">
                <div class="auth-card">
                    <div class="auth-header">
                        <div class="auth-logo">
                            <i data-lucide="waves"></i>
                            <h1>AquaVision Pro</h1>
                        </div>
                        <p class="auth-subtitle">Système de gestion aquacole</p>
                    </div>

                    <div class="auth-tabs">
                        <button class="auth-tab active" data-tab="signin">
                            Connexion
                        </button>
                        <button class="auth-tab" data-tab="signup">
                            Inscription
                        </button>
                    </div>

                    <!-- Sign In Form -->
                    <form id="signinForm" class="auth-form active">
                        <div class="form-group">
                            <label class="form-label">
                                <i data-lucide="mail"></i>
                                Email
                            </label>
                            <input
                                type="email"
                                id="signin_email"
                                class="form-input"
                                placeholder="votre@email.com"
                                required
                            >
                        </div>

                        <div class="form-group">
                            <label class="form-label">
                                <i data-lucide="lock"></i>
                                Mot de passe
                            </label>
                            <input
                                type="password"
                                id="signin_password"
                                class="form-input"
                                placeholder="••••••••"
                                required
                            >
                        </div>

                        <button type="submit" class="btn btn-primary btn-block">
                            <i data-lucide="log-in"></i>
                            Se Connecter
                        </button>

                        <div id="signin_error" class="auth-error" style="display: none;"></div>
                    </form>

                    <!-- Sign Up Form -->
                    <form id="signupForm" class="auth-form">
                        <div class="form-group">
                            <label class="form-label">
                                <i data-lucide="user"></i>
                                Nom Complet
                            </label>
                            <input
                                type="text"
                                id="signup_fullname"
                                class="form-input"
                                placeholder="Jean Dupont"
                                required
                            >
                        </div>

                        <div class="form-group">
                            <label class="form-label">
                                <i data-lucide="mail"></i>
                                Email
                            </label>
                            <input
                                type="email"
                                id="signup_email"
                                class="form-input"
                                placeholder="votre@email.com"
                                required
                            >
                        </div>

                        <div class="form-group">
                            <label class="form-label">
                                <i data-lucide="lock"></i>
                                Mot de passe
                            </label>
                            <input
                                type="password"
                                id="signup_password"
                                class="form-input"
                                placeholder="••••••••"
                                required
                                minlength="6"
                            >
                            <small class="form-hint">Minimum 6 caractères</small>
                        </div>

                        <div class="form-group">
                            <label class="form-label">
                                <i data-lucide="shield"></i>
                                Rôle
                            </label>
                            <select id="signup_role" class="form-input" required>
                                <option value="technicien">Technicien</option>
                                <option value="admin">Administrateur</option>
                            </select>
                            <small class="form-hint">Le rôle Admin nécessite une validation</small>
                        </div>

                        <button type="submit" class="btn btn-primary btn-block">
                            <i data-lucide="user-plus"></i>
                            S'Inscrire
                        </button>

                        <div id="signup_error" class="auth-error" style="display: none;"></div>
                        <div id="signup_success" class="auth-success" style="display: none;"></div>
                    </form>
                </div>

                <div class="auth-footer">
                    <p>AquaVision Pro v2.0 - Système sécurisé par Supabase</p>
                </div>
            </div>
        `;

        lucide.createIcons();
        this.setupAuthListeners();
    }

    static setupAuthListeners() {
        // Tab switching
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;
                this.switchTab(tabName);
            });
        });

        // Sign In Form
        const signinForm = document.getElementById('signinForm');
        if (signinForm) {
            signinForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSignIn();
            });
        }

        // Sign Up Form
        const signupForm = document.getElementById('signupForm');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSignUp();
            });
        }
    }

    static switchTab(tabName) {
        // Update tabs
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });

        // Update forms
        document.querySelectorAll('.auth-form').forEach(form => {
            form.classList.toggle('active', form.id === `${tabName}Form`);
        });

        // Clear errors
        document.querySelectorAll('.auth-error, .auth-success').forEach(el => {
            el.style.display = 'none';
        });
    }

    static async handleSignIn() {
        const email = document.getElementById('signin_email').value;
        const password = document.getElementById('signin_password').value;
        const errorDiv = document.getElementById('signin_error');
        const submitBtn = document.querySelector('#signinForm button[type="submit"]');

        // Show loading
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i data-lucide="loader"></i> Connexion...';
        lucide.createIcons();

        const result = await SupabaseService.signIn(email, password);

        if (result.success) {
            // Success will be handled by onAuthStateChange
        } else {
            errorDiv.textContent = result.error || 'Erreur de connexion';
            errorDiv.style.display = 'block';
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i data-lucide="log-in"></i> Se Connecter';
            lucide.createIcons();
        }
    }

    static async handleSignUp() {
        const fullName = document.getElementById('signup_fullname').value;
        const email = document.getElementById('signup_email').value;
        const password = document.getElementById('signup_password').value;
        const role = document.getElementById('signup_role').value;
        const errorDiv = document.getElementById('signup_error');
        const successDiv = document.getElementById('signup_success');
        const submitBtn = document.querySelector('#signupForm button[type="submit"]');

        // Show loading
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i data-lucide="loader"></i> Inscription...';
        lucide.createIcons();

        const result = await SupabaseService.signUp(email, password, fullName, role);

        if (result.success) {
            successDiv.textContent = 'Inscription réussie ! Vérifiez votre email pour confirmer votre compte.';
            successDiv.style.display = 'block';
            errorDiv.style.display = 'none';
            document.getElementById('signupForm').reset();

            // Switch to signin tab after 2 seconds
            setTimeout(() => {
                this.switchTab('signin');
            }, 2000);
        } else {
            errorDiv.textContent = result.error || 'Erreur d\'inscription';
            errorDiv.style.display = 'block';
            successDiv.style.display = 'none';
        }

        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i data-lucide="user-plus"></i> S\'Inscrire';
        lucide.createIcons();
    }

    static async handleUserLoggedIn(user) {
        this.currentUser = user;
        this.currentProfile = await SupabaseService.getUserProfile();

        if (!this.currentProfile) {
            console.error('Profil utilisateur introuvable');
            await SupabaseService.signOut();
            return;
        }

        console.log('✓ Utilisateur connecté:', this.currentProfile);

        // Hide auth screen, show app
        this.showApp();
    }

    static handleUserLoggedOut() {
        this.currentUser = null;
        this.currentProfile = null;
        this.showAuthScreen();
    }

    static showApp() {
        const app = document.getElementById('app');
        if (!app) return;

        // Load main app content
        app.innerHTML = `
            <div id="mainApp">
                <!-- Header -->
                <header class="header">
                    <div class="container">
                        <div class="header-content">
                            <div class="logo">
                                <i data-lucide="waves"></i>
                                <span>AquaVision Pro</span>
                            </div>
                            <nav class="nav">
                                <div class="user-info">
                                    <i data-lucide="user"></i>
                                    <span>${this.currentProfile.full_name}</span>
                                    <span class="user-role">${this.currentProfile.role}</span>
                                </div>
                                <button class="btn btn-icon" id="themeToggle" title="Changer de thème">
                                    <i data-lucide="moon"></i>
                                </button>
                                <button class="btn btn-icon" id="logoutBtn" title="Déconnexion">
                                    <i data-lucide="log-out"></i>
                                </button>
                            </nav>
                        </div>
                    </div>
                </header>

                <!-- Main Content -->
                <main class="main" id="mainContent">
                    <!-- Content will be loaded here -->
                </main>

                <!-- Footer -->
                <footer class="footer">
                    <div class="container">
                        <p>AquaVision Pro v2.0 - Gestion intelligente de cages à poissons</p>
                    </div>
                </footer>
            </div>
        `;

        lucide.createIcons();

        // Setup logout
        document.getElementById('logoutBtn')?.addEventListener('click', async () => {
            await SupabaseService.signOut();
        });

        // Load appropriate content based on role
        if (this.currentProfile.role === 'admin') {
            this.loadAdminDashboard();
        } else {
            this.loadTechnicianDashboard();
        }

        // Setup theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                document.body.classList.toggle('light-theme');
                const isLight = document.body.classList.contains('light-theme');
                localStorage.setItem('aquavision_theme', isLight ? 'light' : 'dark');
                themeToggle.querySelector('i').setAttribute('data-lucide', isLight ? 'sun' : 'moon');
                lucide.createIcons();
            });
        }

        // Apply saved theme
        const savedTheme = localStorage.getItem('aquavision_theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
            themeToggle?.querySelector('i')?.setAttribute('data-lucide', 'sun');
            lucide.createIcons();
        }
    }

    static loadAdminDashboard() {
        // Will be implemented in admin-dashboard.js
        if (typeof AdminDashboard !== 'undefined') {
            AdminDashboard.init();
        }
    }

    static loadTechnicianDashboard() {
        // Will be implemented in technician-dashboard.js
        if (typeof TechnicianDashboard !== 'undefined') {
            TechnicianDashboard.init();
        }
    }

    static isAdmin() {
        return this.currentProfile?.role === 'admin';
    }

    static isTechnician() {
        return this.currentProfile?.role === 'technicien';
    }
}

// Initialize auth when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (SupabaseService.isConfigured()) {
            AuthManager.init();
        } else {
            console.warn('Supabase non configuré - Mode démo');
        }
    });
} else {
    if (SupabaseService.isConfigured()) {
        AuthManager.init();
    }
}

// Make available globally
window.AuthManager = AuthManager;
