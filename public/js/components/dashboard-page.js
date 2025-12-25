import { EmployeeService } from '../services/employee.service.js';
import { CustomerService } from '../services/customer.service.js';
import './customer-modal.js';
import './employee-modal.js';

export class DashboardPage extends HTMLElement {
    constructor() {
        super();
        this.user = null;
        this.currentView = 'employees'; 
    }

    connectedCallback() {
        this.user = JSON.parse(this.getAttribute('user-data') || '{}');
        
        // Si l'utilisateur n'est pas ADMIN, sa vue par défaut est customers
        if (this.user.role !== 'ADMIN') {
            this.currentView = 'customers';
        }

        this.renderLayout();
        this.addEventListeners();
        
        // Chargement initial de la vue
        this.switchView(this.currentView);
    }

    renderLayout() {
        this.innerHTML = /*html*/`
            <div class="l-app">
                <aside class="l-sidebar">
                    <div class="c-brand">
                        <span>SmartImmat</span>
                    </div>

                    <nav class="c-nav">
                        ${this.user.role === 'ADMIN' ? `
                            <a class="c-nav__item ${this.currentView === 'employees' ? 'c-nav__item--active' : ''}" data-view="employees">
                                Collaborateurs
                            </a>
                        ` : ''}

                        <a class="c-nav__item ${this.currentView === 'customers' ? 'c-nav__item--active' : ''}" data-view="customers">
                            Clients
                        </a>
                        
                        <a class="c-nav__item" style="opacity: 0.5; cursor: not-allowed;">
                            Mes Dossiers
                        </a>
                    </nav>

                    <div class="c-sidebar-footer">
                        <div class="u-text-sm u-text-muted u-mb-sm">
                            ${this.user.email} <br>
                            <span class="c-badge ${this.getBadgeClass(this.user.role)}">
                                ${this.getRoleLabel(this.user.role)}
                            </span>
                        </div>
                        <button id="logoutBtn" class="c-btn c-btn--ghost c-btn--sm">
                            Déconnexion
                        </button>
                    </div>
                </aside>

                <main class="l-main" id="mainContent">
                    </main>

                <employee-modal></employee-modal>
                <customer-modal></customer-modal>
            </div>
        `;
    }

    addEventListeners() {
        // Logout
        this.querySelector('#logoutBtn')?.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('logout', { bubbles: true }));
        });

        // Navigation
        const navItems = this.querySelectorAll('.c-nav__item[data-view]');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const view = e.target.closest('.c-nav__item').dataset.view;
                this.switchView(view);
                navItems.forEach(nav => nav.classList.remove('c-nav__item--active'));
                item.classList.add('c-nav__item--active');
            });
        });

        this.addEventListener('employee-created', () => {
            if (this.currentView === 'employees') this.loadEmployees();
        });
    }
// --- UTILITAIRES D'AFFICHAGE ---
    getRoleLabel(role) {
        const roles = {
            'ADMIN': 'Administrateur',
            'EMPLOYEE': 'Collaborateur'
        };
        return roles[role] || role;
    }

    getBadgeClass(role) {
        return role === 'ADMIN' ? 'c-badge--primary' : 'c-badge--neutral';
    }
    // LOGIQUE DE NAVIGATION
    switchView(viewName) {
        this.currentView = viewName;
        const main = this.querySelector('#mainContent');
        main.innerHTML = '<p>Chargement...</p>';

        if (viewName === 'employees') {
            this.loadEmployees();
        } else if (viewName === 'customers') {
            this.loadCustomers();
        }
    }

    // VUE COLLABORATEURS
    async loadEmployees() {
        const main = this.querySelector('#mainContent');
        
        // Header + Conteneur Liste
        main.innerHTML = /*html*/`
            <div class="c-section-header">
                <h2 class="c-section-title">Gestion des Collaborateurs</h2>
                <button id="btnAddEmployee" class="c-btn c-btn--primary u-w-auto">+ Nouveau</button>
            </div>
            <div id="listContainer"></div>
        `;

        main.querySelector('#btnAddEmployee').addEventListener('click', () => {
            this.querySelector('employee-modal').open();
        });

        const listContainer = main.querySelector('#listContainer');

        try {
            const employees = await EmployeeService.getAll();
            
            listContainer.innerHTML = /*html*/`
                <div class="c-table-wrapper">
                    <table class="c-table">
                        <thead>
                            <tr>
                                <th>Nom</th>
                                <th>Email</th>
                                <th>Rôle</th>
                                <th class="u-text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${employees.map(emp => /*html*/`
                                <tr>
                                    <td><strong>${emp.first_name} ${emp.last_name}</strong></td>
                                    <td>${emp.email}</td>
                                    <td>
                                        <span class="c-badge ${this.getBadgeClass(emp.role)}">
                                            ${this.getRoleLabel(emp.role)}
                                        </span>
                                    </td>
                                    <td class="u-text-right">
                                        ${emp.id !== this.user.id ? `
                                            <button class="c-btn c-btn--ghost c-btn--sm js-edit-emp" data-json='${JSON.stringify(emp)}'>Modifier</button>
                                            <button class="c-btn c-btn--danger-light c-btn--sm js-delete-emp" data-id="${emp.id}">Suppr.</button>
                                        ` : ''}
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
            
            listContainer.addEventListener('click', async (e) => {
                if(e.target.classList.contains('js-delete-emp')) {
                    if(confirm('Supprimer cet employé ?')) {
                        await EmployeeService.delete(e.target.dataset.id);
                        this.loadEmployees();
                    }
                }
                if(e.target.classList.contains('js-edit-emp')) {
                    const data = JSON.parse(e.target.dataset.json);
                    this.querySelector('employee-modal').open(data);
                }
            });

        } catch (error) {
            listContainer.innerHTML = '<p style="color:var(--color-danger)">Erreur chargement collaborateurs.</p>';
        }
    }

    // VUE CLIENTS
    async loadCustomers() {
        const main = this.querySelector('#mainContent');
        
        main.innerHTML = `
            <div class="c-section-header">
                <h2 class="c-section-title">Mes Clients</h2>
                <button id="btnAddCustomer" class="c-btn c-btn--primary u-w-auto">+ Nouveau Client</button>
            </div>
            <div id="listContainer">Chargement...</div>
        `;

        // Bouton Ajouter
        main.querySelector('#btnAddCustomer').addEventListener('click', () => {
            this.querySelector('customer-modal').open();
        });

        const listContainer = main.querySelector('#listContainer');

        try {
            const customers = await CustomerService.getAll();

            if (customers.length === 0) {
                listContainer.innerHTML = '<p class="u-text-muted">Aucun client trouvé.</p>';
                return;
            }

            listContainer.innerHTML = `
                <div class="c-table-wrapper">
                    <table class="c-table">
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Identité / Raison Sociale</th>
                                <th>Contact</th>
                                <th>Date ajout</th>
                                <th class="u-text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${customers.map(c => `
                                <tr>
                                    <td>
                                        <span class="c-badge ${c.type === 'PRO' ? 'c-badge--primary' : 'c-badge--neutral'}">
                                            ${c.type}
                                        </span>
                                    </td>
                                    <td>
                                        <strong>${c.type === 'PRO' ? c.raison_sociale : (c.nom + ' ' + c.prenom)}</strong>
                                        ${c.type === 'PRO' ? `<br><small class="u-text-muted">SIRET: ${c.siret}</small>` : ''}
                                    </td>
                                    <td>
                                        ${c.email || '-'}<br>
                                        <small class="u-text-muted">${c.telephone || '-'}</small>
                                    </td>
                                    <td>${new Date(c.created_at).toLocaleDateString()}</td>
                                    <td class="u-text-right">
                                        <button class="c-btn c-btn--ghost c-btn--sm js-edit-cust" data-json='${JSON.stringify(c)}'>Modifier</button>
                                        <button class="c-btn c-btn--danger-light c-btn--sm js-delete-cust" data-id="${c.id}">Suppr.</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;

             // Délégation d'événements (Supprimer ET Modifier)
             listContainer.addEventListener('click', async (e) => {
                // Suppression
                if(e.target.classList.contains('js-delete-cust')) {
                    if(confirm('Supprimer ce client ?')) {
                        await CustomerService.delete(e.target.dataset.id);
                        this.loadCustomers();
                    }
                }
                // Modification (Nouveau !)
                if(e.target.classList.contains('js-edit-cust')) {
                    const customerData = JSON.parse(e.target.dataset.json);
                    this.querySelector('customer-modal').open(customerData);
                }
            });

        } catch (error) {
            console.error(error);
            listContainer.innerHTML = '<p style="color:var(--color-danger)">Erreur chargement clients.</p>';
        }
    }
}

customElements.define('dashboard-page', DashboardPage);