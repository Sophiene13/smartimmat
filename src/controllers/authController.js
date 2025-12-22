import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as userModel from '../models/userModel.js';

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email et mot de passe requis" });
        }

        const user = await userModel.findByEmail(email);
        if (!user) {
            return res.status(401).json({ message: "Identifiants incorrects" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Identifiants incorrects" });
        }

        const tokenPayload = {
            id: user.id,
            email: user.email,
            company_id: user.company_id, 
            role: user.role              
        };

        const token = jwt.sign(
            tokenPayload,
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: "Connexion réussie",
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                company_id: user.company_id
            }
        });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ error: "Erreur serveur lors de la connexion" });
    }
};