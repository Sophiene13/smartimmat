export class AuthService {
    static async login(email, password) {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Erreur de connexion");
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            return data.user;
        } catch (error) {
            console.error('Auth Service Error:', error);
            throw error;
        }
    }
    
    static logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.reload();
    }
}