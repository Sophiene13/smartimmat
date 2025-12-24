import { EmployeeService } from '../services/employee.service.js';

export class EmployeeModal extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
        this.addEventListeners();
    }

    
    open() {
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
        // Bouton Annuler
        this.querySelector('#btnCancel').addEventListener('click', () => this.close());

        // Clic sur l'overlay pour fermer
        this.querySelector('.c-modal-overlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) this.close();
        });

        // Soumission du formulaire
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
            password: this.querySelector('#passwordNew').value,
            role: 'EMPLOYEE'
        };

        try {
            btnSubmit.textContent = 'Création...';
            btnSubmit.disabled = true;

            await EmployeeService.create(formData);

            // Fermeture de la modale
            this.close();
            this.dispatchEvent(new CustomEvent('employee-created', { bubbles: true }));

        } catch (error) {
            console.error(error);
            errorBox.textContent = error.message || "Erreur lors de la création.";
            errorBox.style.display = 'block';
            errorBox.style.color = '#dc2626';
            errorBox.style.marginBottom = '1rem';
        } finally {
            btnSubmit.textContent = 'Créer le collaborateur';
            btnSubmit.disabled = false;
        }
    }

    render() {
        this.innerHTML = `
            <div class="c-modal-overlay">
                <div class="c-modal">
                    <h2 class="c-modal__title">Ajouter un collaborateur</h2>
                    
                    <div id="modalError" style="display:none;"></div>

                    <form>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <div class="c-input-group">
                                <label for="firstName" class="c-label">Prénom <span style="color:red">*</span></label>
                                <input type="text" id="firstName" class="c-input" required placeholder="Jean">
                            </div>
                            <div class="c-input-group">
                                <label for="lastName" class="c-label">Nom <span style="color:red">*</span></label>
                                <input type="text" id="lastName" class="c-input" required placeholder="Dupont">
                            </div>
                        </div>

                        <div class="c-input-group">
                            <label for="emailProd" class="c-label">Email Professionnel <span style="color:red">*</span></label>
                            <input type="email" id="emailProd" class="c-input" required placeholder="jean.dupont@garage.fr">
                        </div>

                        <div class="c-input-group">
                            <label for="passwordNew" class="c-label">Mot de passe provisoire <span style="color:red">*</span></label>
                            <input type="password" id="passwordNew" class="c-input" required placeholder="••••••••">
                        </div>

                        <div class="c-modal__actions">
                            <button type="button" id="btnCancel" class="c-btn" style="background: white; border: 1px solid #cbd5e1; color: #475569; width: auto;">
                                Annuler
                            </button>
                            <button type="submit" id="btnSubmit" class="c-btn c-btn--primary" style="width: auto;">
                                Créer le collaborateur
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }
}

customElements.define('employee-modal', EmployeeModal);