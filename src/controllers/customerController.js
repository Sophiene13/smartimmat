import * as customerModel from '../models/customerModel.js';

export const createCustomer = async (req, res) => {
    try {
        const companyId = req.user.company_id;
        const { 
            type, civilite, nom, prenom, nom_usage, 
            raison_sociale, siret, email, telephone 
        } = req.body;

        //Validation du Type
        if (!['PARTICULIER', 'PRO'].includes(type)) {
            return res.status(400).json({ message: "Le type de client est invalide (PARTICULIER ou PRO)." });
        }

        //Validation Conditionnelle (Logique Métier)
        if (type === 'PRO') {
            if (!raison_sociale || !siret) {
                return res.status(400).json({ message: "Raison sociale et SIRET sont obligatoires pour un professionnel." });
            }
        } else {
            // PARTICULIER
            if (!civilite || !nom || !prenom) {
                return res.status(400).json({ message: "Civilité, Nom et Prénom sont obligatoires pour un particulier." });
            }
        }

        //Appel au Modèle
        const newCustomerId = await customerModel.createCustomer({
            company_id: companyId,
            type, civilite, nom, prenom, nom_usage, 
            raison_sociale, siret, email, telephone
        });

        res.status(201).json({ 
            message: "Client créé avec succès", 
            customerId: newCustomerId 
        });

    } catch (error) {
        console.error("Erreur createCustomer:", error);
        res.status(500).json({ message: "Erreur serveur lors de la création du client." });
    }
};

export const getCustomers = async (req, res) => {
    try {
        const companyId = req.user.company_id;
        const customers = await customerModel.findAllCustomers(companyId);
        res.status(200).json(customers);
    } catch (error) {
        console.error("Erreur getCustomers:", error);
        res.status(500).json({ message: "Erreur lors de la récupération des clients." });
    }
};

export const deleteCustomer = async (req, res) => {
    try {
        const customerId = req.params.id;
        const companyId = req.user.company_id;

        const affectedRows = await customerModel.deleteCustomer(customerId, companyId);

        if (affectedRows === 0) {
            return res.status(404).json({ message: "Client introuvable." });
        }

        res.status(200).json({ message: "Client supprimé avec succès." });

    } catch (error) {
        console.error("Erreur deleteCustomer:", error);
        res.status(500).json({ message: "Erreur lors de la suppression." });
    }
};