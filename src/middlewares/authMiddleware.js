import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // On enlève "Bearer " pour garder juste le token
            token = req.headers.authorization.split(' ')[1];

            // vérification que le token est valide
            const decoded = jwt.verify(token, process.env.JWT_SECRET)// retourne le payload;

            req.user = decoded; 

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Non autorisé, token invalide' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Non autorisé, aucun token' });
    }
};
// verification que l'utilisateur est admin
export const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'ADMIN') {
        next();
    } else {
        res.status(403).json({ message: 'Accès réservé aux administrateurs' });
    }
};