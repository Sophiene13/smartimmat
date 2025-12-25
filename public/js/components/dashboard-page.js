import { EmployeeService } from '../services/employee.service.js';
import './employee-modal.js';

export class DashboardPage extends HTMLElement {
    constructor() {
        super();
        this.user = null;
    }

    connectedCallback() {
        this.user = JSON.parse(this.getAttribute('user-data') || '{}');
        this.render();
        this.addEventListeners();
        this.loadEmployees();
    }

    addEventListeners() {
        // Logout
        this.querySelector('#logoutBtn')?.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('logout', { bubbles: true }));
        });

        // Ouverture Modale Ajout
        this.querySelector('#btnAddEmployee')?.addEventListener('click', () => {
            this.querySelector('employee-modal').open();
        });

        // Rafraîchissement après création
        this.addEventListener('employee-created', () => this.loadEmployees());

        // --- GESTION SUPPRESSION (Délégation d'événement) ---
        // On écoute les clics sur tout le tableau, et on vérifie si c'est un bouton supprimer
        const listContainer = this.querySelector('#employeesList');
        listContainer.addEventListener('click', async (e) => {
            // SUPPRESSION
            const btnDelete = e.target.closest('.js-delete-btn');
            if (btnDelete) {
                 // ... (ton code actuel de suppression) ...
            }

            // MODIFICATION (Nouveau)
            const btnEdit = e.target.closest('.js-edit-btn');
            if (btnEdit) {
                const empData = JSON.parse(btnEdit.dataset.json);
                // On ouvre la modale en lui passant les données !
                this.querySelector('employee-modal').open(empData);
            }
        });
    }

    async handleDelete(id) {
        try {
            await EmployeeService.delete(id);
            // On recharge la liste
            this.loadEmployees();
        } catch (error) {
            alert(error.message || "Erreur lors de la suppression");
        }
    }

    /* AFFICHAGE  */

    getRoleLabel(role) {
        const roles = { 'ADMIN': 'Administrateur', 'EMPLOYEE': 'Collaborateur' };
        return roles[role] || role;
    }

    getBadgeClass(role) {
        return role === 'ADMIN' ? 'c-badge--primary' : 'c-badge--neutral';
    }

    async loadEmployees() {
        const listContainer = this.querySelector('#employeesList');
        try {
            listContainer.innerHTML = '<p>Chargement...</p>';
            const employees = await EmployeeService.getAll();
            this.renderList(employees);
        } catch (error) {
            console.error(error);
            listContainer.innerHTML = '<p class="c-alert-error">Impossible de charger la liste.</p>';
        }
    }

    renderList(employees) {
        const listContainer = this.querySelector('#employeesList');

        if (employees.length === 0) {
            listContainer.innerHTML = '<p>Aucun collaborateur enregistré.</p>';
            return;
        }

        const tableHtml = `
        <div class="c-table-wrapper">
            <table class="c-table">
                <thead>
                    <tr>
                        <th class="c-table__th">Nom</th>
                        <th class="c-table__th">Email</th>
                        <th class="c-table__th">Rôle</th>
                        <th class="c-table__th">Date d'ajout</th>
                        <th class="c-table__th" style="text-align: right;">Actions</th> </tr>
                </thead>
                <tbody>
                    ${employees.map(emp => `
                        <tr class="c-table__row">
                            <td class="c-table__td"><strong>${emp.first_name} ${emp.last_name}</strong></td>
                            <td class="c-table__td">${emp.email}</td>
                            <td class="c-table__td">
                                <span class="c-badge ${this.getBadgeClass(emp.role)}">
                                    ${this.getRoleLabel(emp.role)}
                                </span>
                            </td>
                            <td class="c-table__td">${new Date(emp.created_at).toLocaleDateString('fr-FR')}</td>
                            <td class="c-table__td" style="text-align: right;">
                                ${emp.id !== this.user.id ? `
                                    <button 
                                        class="c-btn js-edit-btn" 
                                        data-json='${JSON.stringify(emp)}'
                                        style="background: #e0f2fe; color: #0369a1; padding: 0.25rem 0.75rem; font-size: 0.8rem; width: auto; margin-right: 0.5rem;"
                                        title="Modifier">
                                        Modifier
                                    </button>
                                    <button 
                                        class="c-btn js-delete-btn" 
                                        data-id="${emp.id}" 
                                        data-name="${emp.first_name} ${emp.last_name}"
                                        style="background: #fee2e2; color: #dc2626; padding: 0.25rem 0.75rem; font-size: 0.8rem; width: auto;"
                                        title="Supprimer">
                                        Supprimer
                                    </button>
                                ` : ''}
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        `;

        listContainer.innerHTML = tableHtml;
    }

    render() {

        this.innerHTML = `
            <div class="c-dashboard">
                <header class="c-dashboard__header">
                    <div>
                        <h1 class="c-dashboard__title">Espace Garage</h1>
                        <p class="c-dashboard__subtitle">Connecté en tant que <strong>${this.user.email}</strong></p>
                    </div>
                    <button id="logoutBtn" class="c-btn c-btn--primary" style="background-color: #ef4444; width: auto;">Déconnexion</button>
                </header>

                <section class="c-dashboard__card">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                        <h2 class="c-dashboard__section-title">Mes Collaborateurs</h2>
                        <button id="btnAddEmployee" class="c-btn c-btn--primary" style="width: auto; font-size: 0.9rem;">+ Ajouter</button>
                    </div>
                    <div id="employeesList"></div>
                </section>
                <employee-modal></employee-modal>
            </div>
        `;
    }
}

customElements.define('dashboard-page', DashboardPage);