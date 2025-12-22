import bcrypt from 'bcrypt';
import * as userModel from '../models/userModel.js';

export const createEmployee = async (req, res) => {
    try {
        const { email, password } = req.body;

        const companyId = req.user.company_id; 

        // Vérif doublon
        const existingUser = await userModel.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: "Cet email est déjà utilisé" });
        }

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Création d'un employé
        const newUserId = await userModel.createUser({
            company_id: companyId,
            email: email,
            password: hashedPassword,
            role: 'EMPLOYEE'
        });

        res.status(201).json({ 
            message: "Employé créé avec succès", 
            userId: newUserId 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur" });
    }
};