import { EmployeeService } from '../services/employee.service.js';

export class EmployeeModal extends HTMLElement {
    constructor() {
        super();
        this.mode = 'create';
        this.employeeId = null;
    }

    connectedCallback() {
        this.render();
        this.addEventListeners();
    }

    open(employeeToEdit = null) {
        const title = this.querySelector('.c-modal__title');
        const btnSubmit = this.querySelector('#btnSubmit');
        const passwordField = this.querySelector('#passwordGroup');
        const passwordInput = this.querySelector('#passwordNew');

        if (employeeToEdit) {
            // MODE ÉDITION
            this.mode = 'edit';
            this.employeeId = employeeToEdit.id;
            title.textContent = "Modifier un collaborateur";
            btnSubmit.textContent = "Enregistrer les modifications";
            
            // Pré-remplissage
            this.querySelector('#firstName').value = employeeToEdit.first_name || '';
            this.querySelector('#lastName').value = employeeToEdit.last_name || '';
            this.querySelector('#emailProd').value = employeeToEdit.email || '';

            passwordInput.required = false;
            passwordInput.placeholder = "Laisser vide pour ne pas changer";

        } else {
            // MODE CRÉATION
            this.mode = 'create';
            this.employeeId = null;
            title.textContent = "Ajouter un collaborateur";
            btnSubmit.textContent = "Créer le collaborateur";
            this.querySelector('form').reset();
            
            passwordInput.required = true;
            passwordInput.placeholder = "••••••••";
        }

        this.querySelector('.c-modal-overlay').classList.add('c-modal-overlay--visible');
    }

    close() {
        this.querySelector('.c-modal-overlay').classList.remove('c-modal-overlay--visible');
        this.querySelector('form').reset();
        this.clearError();
    }

    clearError() {
        const errorBox = this.querySelector('#modalError');
        errorBox.style.display = 'none';
        errorBox.textContent = '';
    }

    addEventListeners() {
        this.querySelector('#btnCancel').addEventListener('click', () => this.close());
        
        this.querySelector('.c-modal-overlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) this.close();
        });

        this.querySelector('form').addEventListener('submit', (e) => this.handleSubmit(e));
    }

    async handleSubmit(e) {
        e.preventDefault();
        const btnSubmit = this.querySelector('#btnSubmit');
        const errorBox = this.querySelector('#modalError');

        // Récupération des données
        const formData = {
            first_name: this.querySelector('#firstName').value,
            last_name: this.querySelector('#lastName').value,
            email: this.querySelector('#emailProd').value,
            role: 'EMPLOYEE'
        };

        // Gestion du mot de passe
        const password = this.querySelector('#passwordNew').value;
        if (password) {
            formData.password = password;
        }

        try {
            btnSubmit.textContent = 'Sauvegarde...';
            btnSubmit.disabled = true;

            if (this.mode === 'create') {
                await EmployeeService.create(formData);
            } else {
                await EmployeeService.update(this.employeeId, formData);
            }

            // Succès
            this.close();
            this.dispatchEvent(new CustomEvent('employee-created', { bubbles: true }));

        } catch (error) {
            console.error(error);
            errorBox.textContent = error.message || "Une erreur est survenue.";
            errorBox.style.display = 'block';
            errorBox.style.color = '#dc2626';
            errorBox.style.marginBottom = '1rem';
        } finally {
            btnSubmit.textContent = this.mode === 'create' ? 'Créer le collaborateur' : 'Enregistrer';
            btnSubmit.disabled = false;
        }
    }

    render() {
        this.innerHTML =/*html*/ `
            <div class="c-modal-overlay">
                <div class="c-modal">
                    <h2 class="c-modal__title">Ajouter un collaborateur</h2>
                    
                    <div id="modalError" style="display:none;"></div>

                    <form>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <div class="c-input-group">
                                <label for="firstName" class="c-label">Prénom</label>
                                <input type="text" id="firstName" class="c-input" required>
                            </div>
                            <div class="c-input-group">
                                <label for="lastName" class="c-label">Nom</label>
                                <input type="text" id="lastName" class="c-input" required>
                            </div>
                        </div>

                        <div class="c-input-group">
                            <label for="emailProd" class="c-label">Email Professionnel</label>
                            <input type="email" id="emailProd" class="c-input" required>
                        </div>

                        <div class="c-input-group" id="passwordGroup">
                            <label for="passwordNew" class="c-label">Mot de passe</label>
                            <input type="password" id="passwordNew" class="c-input">
                        </div>

                        <div class="c-modal__actions">
                            <button type="button" id="btnCancel" class="c-btn" style="background: white; border: 1px solid #cbd5e1; color: #475569; width: auto;">
                                Annuler
                            </button>
                            <button type="submit" id="btnSubmit" class="c-btn c-btn--primary" style="width: auto;">
                                Créer
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }
}

customElements.define('employee-modal', EmployeeModal);