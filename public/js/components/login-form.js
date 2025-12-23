export class LoginForm extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
        this.addEventListeners();
    }

    addEventListeners() {
        const form = this.querySelector('form');
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = this.querySelector('#email').value;
            const password = this.querySelector('#password').value;
            const loginEvent = new CustomEvent('try-login', {
                detail: { email, password },
                bubbles: true 
            });

            this.dispatchEvent(loginEvent);
        });
    }

    setLoading(isLoading) {
        const btn = this.querySelector('button[type="submit"]');
        if (isLoading) {
            btn.textContent = 'Connexion en cours...';
            btn.disabled = true;
            btn.style.opacity = '0.7';
            btn.style.cursor = 'wait';
        } else {
            btn.textContent = 'Se connecter';
            btn.disabled = false;
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
        }
    }

    showError(message) {
        let errorDiv = this.querySelector('.c-alert-error');
        
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'c-alert-error';
            errorDiv.style.color = '#dc2626';
            errorDiv.style.marginTop = '1rem';
            errorDiv.style.fontSize = '0.9rem';
            errorDiv.style.textAlign = 'center';
            errorDiv.style.padding = '0.5rem';
            errorDiv.style.backgroundColor = '#fee2e2';
            errorDiv.style.borderRadius = '4px';
            
            const btn = this.querySelector('button[type="submit"]');
            btn.parentNode.insertBefore(errorDiv, btn);
        }

        errorDiv.textContent = message;
    }

    render() {
        this.innerHTML = `
            <div class="c-login-card">
                <header class="c-login-header">
                    <h1 class="c-brand-title">Smart<span class="text-primary">Immat</span></h1>
                    <p class="c-login-subtitle">Connexion Espace Pro</p>
                </header>
                
                <form class="c-login-form">
                    <div class="c-input-group">
                        <label for="email" class="c-label">Adresse email</label>
                        <input type="email" id="email" class="c-input" placeholder="votre.email@exemple.fr" required>
                    </div>

                    <div class="c-input-group">
                        <label for="password" class="c-label">Mot de passe</label>
                        <input type="password" id="password" class="c-input" placeholder="••••••••" required>
                    </div>

                    <button type="submit" class="c-btn c-btn--primary">
                        Se connecter
                    </button>
                </form>
            </div>
        `;
    }
}

customElements.define('login-form', LoginForm);