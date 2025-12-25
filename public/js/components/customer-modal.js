import { CustomerService } from '../services/customer.service.js';

export class CustomerModal extends HTMLElement {
    constructor() {
        super();
        this.mode = 'create';
        this.customerId = null;
    }

    connectedCallback() {
        this.render();
        this.addEventListeners();
        this.toggleFields();
    }

    open(customerToEdit = null) {
        const title = this.querySelector('.c-modal__title');
        const btnSubmit = this.querySelector('#btnSubmit');
        const typeSelect = this.querySelector('#type');
        const form = this.querySelector('form');

        if (customerToEdit) {
            // --- MODE ÉDITION ---
            this.mode = 'edit';
            this.customerId = customerToEdit.id;
            title.textContent = "Modifier le client";
            btnSubmit.textContent = "Enregistrer les modifications";
            
            // 1. On définit le type et on force l'affichage des bons champs
            typeSelect.value = customerToEdit.type;
            this.toggleFields();

            // 2. On remplit les champs communs
            this.querySelector('#email').value = customerToEdit.email || '';
            this.querySelector('#telephone').value = customerToEdit.telephone || '';

            // 3. On remplit les champs spécifiques
            if (customerToEdit.type === 'PRO') {
                this.querySelector('#raison_sociale').value = customerToEdit.raison_sociale || '';
                this.querySelector('#siret').value = customerToEdit.siret || '';
            } else {
                this.querySelector('#civilite').value = customerToEdit.civilite || 'M';
                this.querySelector('#nom').value = customerToEdit.nom || '';
                this.querySelector('#prenom').value = customerToEdit.prenom || '';
            }

        } else {
            // --- MODE CRÉATION ---
            this.mode = 'create';
            this.customerId = null;
            title.textContent = "Nouveau Client";
            btnSubmit.textContent = "Créer le client";
            
            form.reset();
            typeSelect.value = 'PARTICULIER';
            this.toggleFields();
        }

        this.querySelector('.c-modal-overlay').classList.add('c-modal-overlay--visible');
    }

    close() {
        this.querySelector('.c-modal-overlay').classList.remove('c-modal-overlay--visible');
        this.clearError();
    }

    clearError() {
        const errorBox = this.querySelector('#modalError');
        errorBox.style.display = 'none';
        errorBox.textContent = '';
    }

    toggleFields() {
        const type = this.querySelector('#type').value;
        const proFields = this.querySelector('#proFields');
        const partFields = this.querySelector('#partFields');

        if (type === 'PRO') {
            // On utilise la propriété style pour le display block/none (logique dynamique)
            proFields.style.display = 'grid'; 
            partFields.style.display = 'none';
            
            this.querySelectorAll('.req-pro').forEach(i => i.required = true);
            this.querySelectorAll('.req-part').forEach(i => i.required = false);
        } else {
            proFields.style.display = 'none';
            partFields.style.display = 'grid';
            
            this.querySelectorAll('.req-pro').forEach(i => i.required = false);
            this.querySelectorAll('.req-part').forEach(i => i.required = true);
        }
    }

    addEventListeners() {
        this.querySelector('#btnCancel').addEventListener('click', () => this.close());
        
        this.querySelector('.c-modal-overlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) this.close();
        });

        this.querySelector('#type').addEventListener('change', () => this.toggleFields());

        this.querySelector('form').addEventListener('submit', (e) => this.handleSubmit(e));
    }

    async handleSubmit(e) {
        e.preventDefault();
        const btnSubmit = this.querySelector('#btnSubmit');
        const errorBox = this.querySelector('#modalError');

        const formData = {
            type: this.querySelector('#type').value,
            email: this.querySelector('#email').value,
            telephone: this.querySelector('#telephone').value
        };

        if (formData.type === 'PRO') {
            formData.raison_sociale = this.querySelector('#raison_sociale').value;
            formData.siret = this.querySelector('#siret').value;
        } else {
            formData.civilite = this.querySelector('#civilite').value;
            formData.nom = this.querySelector('#nom').value;
            formData.prenom = this.querySelector('#prenom').value;
        }

        try {
            btnSubmit.textContent = 'Sauvegarde...';
            btnSubmit.disabled = true;

            if (this.mode === 'create') {
                await CustomerService.create(formData);
            } else {
                await CustomerService.update(this.customerId, formData);
            }

            this.close();
            this.dispatchEvent(new CustomEvent('customer-created', { bubbles: true }));

        } catch (error) {
            console.error(error);
            errorBox.textContent = error.message || "Erreur lors de l'opération.";
            errorBox.style.display = 'block';
            errorBox.style.color = '#dc2626';
            errorBox.style.marginBottom = '1rem';
        } finally {
            btnSubmit.textContent = this.mode === 'create' ? 'Créer le client' : 'Enregistrer';
            btnSubmit.disabled = false;
        }
    }

    render() {
        // Note: On utilise u-hidden ou style display pour la logique initiale, ici géré par JS au load
        this.innerHTML = `
            <div class="c-modal-overlay">
                <div class="c-modal">
                    <h2 class="c-modal__title">Client</h2>
                    
                    <div id="modalError" style="display:none;"></div>

                    <form>
                        <div class="c-input-group">
                            <label for="type" class="c-label">Type de client</label>
                            <select id="type" class="c-input">
                                <option value="PARTICULIER">Particulier</option>
                                <option value="PRO">Professionnel</option>
                            </select>
                        </div>

                        <div id="partFields" style="display: grid; grid-template-columns: 80px 1fr 1fr; gap: 1rem;">
                            <div class="c-input-group">
                                <label for="civilite" class="c-label">Civ.</label>
                                <select id="civilite" class="c-input req-part">
                                    <option value="M">M</option>
                                    <option value="MME">Mme</option>
                                </select>
                            </div>
                            <div class="c-input-group">
                                <label for="nom" class="c-label">Nom <span style="color:red">*</span></label>
                                <input type="text" id="nom" class="c-input req-part">
                            </div>
                            <div class="c-input-group">
                                <label for="prenom" class="c-label">Prénom <span style="color:red">*</span></label>
                                <input type="text" id="prenom" class="c-input req-part">
                            </div>
                        </div>

                        <div id="proFields" style="display: none; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <div class="c-input-group">
                                <label for="raison_sociale" class="c-label">Raison Sociale <span style="color:red">*</span></label>
                                <input type="text" id="raison_sociale" class="c-input req-pro">
                            </div>
                            <div class="c-input-group">
                                <label for="siret" class="c-label">SIRET <span style="color:red">*</span></label>
                                <input type="text" id="siret" class="c-input req-pro">
                            </div>
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <div class="c-input-group">
                                <label for="email" class="c-label">Email</label>
                                <input type="email" id="email" class="c-input">
                            </div>
                            <div class="c-input-group">
                                <label for="telephone" class="c-label">Téléphone</label>
                                <input type="tel" id="telephone" class="c-input">
                            </div>
                        </div>

                        <div class="c-modal__actions">
                            <button type="button" id="btnCancel" class="c-btn c-btn--ghost u-w-auto">
                                Annuler
                            </button>
                            <button type="submit" id="btnSubmit" class="c-btn c-btn--primary u-w-auto">
                                Créer
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }
}

customElements.define('customer-modal', CustomerModal);