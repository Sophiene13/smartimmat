import './components/login-form.js';
import './components/dashboard-page.js';
import { AuthService } from './services/auth.service.js';

document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');

    const renderLogin = () => {
        app.innerHTML = '<login-form></login-form>';
    };

    const renderDashboard = (user) => {
        const dashboard = document.createElement('dashboard-page');
        dashboard.setAttribute('user-data', JSON.stringify(user));
        
        app.innerHTML = '';
        app.appendChild(dashboard);
    };

    const init = () => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            renderDashboard(JSON.parse(savedUser));
        } else {
            renderLogin();
        }
    };

    app.addEventListener('try-login', async (event) => {
        const { email, password } = event.detail;
        const loginForm = event.target;

        loginForm.setLoading(true);

        try {
            const user = await AuthService.login(email, password);
            renderDashboard(user);
        } catch (error) {
            loginForm.setLoading(false);
            loginForm.showError(error.message);
        }
    });

    app.addEventListener('logout', () => {
        AuthService.logout();
    });

    init();
});