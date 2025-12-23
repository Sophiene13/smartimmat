export class DashboardPage extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const user = JSON.parse(this.getAttribute('user-data') || '{}');
        this.render(user);
        
        this.querySelector('#logoutBtn').addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('logout', {
                bubbles: true
            }));
        });
    }

    render(user) {
        this.innerHTML = `
            <div style="max-width: 800px; margin: 4rem auto; text-align: center;">
                <h1 style="font-size: 2.5rem; color: #1e3a8a; margin-bottom: 1rem;">
                    Bienvenue, <span style="color: #3b82f6;">${user.email}</span>
                </h1>
                
                <div style="background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
                    <p style="color: #64748b; margin-bottom: 2rem; font-size: 1.1rem;">
                        Vous êtes connecté à l'espace <strong>Smart Immat</strong>.
                        <br>Votre ID entreprise est : <code>${user.company_id}</code>
                    </p>

                    <button id="logoutBtn" class="c-btn c-btn--primary" style="max-width: 200px;">
                        Se déconnecter
                    </button>
                </div>
            </div>
        `;
    }
}

customElements.define('dashboard-page', DashboardPage);