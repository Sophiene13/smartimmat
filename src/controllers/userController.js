import bcrypt from 'bcrypt';
import * as userModel from '../models/userModel.js';

export const createEmployee = async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;

        const companyId = req.user.company_id; 

        if (!first_name || !last_name || !email || !password || !role) {
        return res.status(400).json({ message: "Tous les champs sont requis." });
    }

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
            first_name: first_name,
            last_name: last_name,
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
export const deleteEmployee = async (req, res) => {
    // Récupération de l'ID à supprimer via l'url
    const userIdToDelete = req.params.id;
    
    // Récupération de l'ID de l'entreprise via le Token de l'admin connecté
    const adminCompanyId = req.user.company_id; 

    try {
        const result = await userModel.deleteUser(userIdToDelete, adminCompanyId); 

        // Vérification du résultat
        if (result.affectedRows === 0) {
            // Si aucune ligne n'a été touchée, c'est que l'user n'existe pas
            return res.status(404).json({ message: "Utilisateur introuvable ou droits insuffisants." });
        }

        res.status(200).json({ message: "Utilisateur supprimé avec succès." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la suppression de l'utilisateur." });
    }
};

export const updateEmployee = async (req, res) => { 
    const userId = req.params.id;
    const adminCompanyId = req.user.company_id;
    const {first_name, last_name, email, role } = req.body;

    try {
        if (!first_name || !last_name || !email || !role) {
            return res.status(400).json({ message: "Email et rôle sont requis pour la mise à jour." });
        }

        const result = await userModel.updateUser(userId, adminCompanyId, { first_name, last_name, email, role });

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Utilisateur introuvable ou droits insuffisants." });
        }

        res.status(200).json({ message: "Utilisateur mis à jour avec succès." });

    } catch (error) {
        console.error(error);
        //si l'email est deja utilisé par un autre utilisateur
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: "Cet email est déjà utilisé." });
        }
        res.status(500).json({ message: "Erreur lors de la mise à jour." });
    }
};
//Recuperer les employes
export const getEmployees = async (req, res) => {
    const adminCompanyId = req.user.company_id;

    try {
        const employees = await userModel.findAllEmployees(adminCompanyId);
        
        res.status(200).json(employees);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur lors de la récupération des employés." });
    }
};