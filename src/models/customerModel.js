import pool from '../../config/mysql.js';

export const createCustomer = async (customerData) => {
    const { 
        company_id, type, civilite, nom, prenom, nom_usage, 
        raison_sociale, siret, email, telephone 
    } = customerData;

    const query = `
        INSERT INTO clients 
        (company_id, type, civilite, nom, prenom, nom_usage, raison_sociale, siret, email, telephone) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await pool.query(query, [
        company_id, type, civilite, nom, prenom, nom_usage, 
        raison_sociale, siret, email, telephone
    ]);
    
    return result.insertId;
};

export const findAllCustomers = async (companyId) => {
    const query = `
        SELECT * FROM clients 
        WHERE company_id = ? 
        ORDER BY created_at DESC
    `;
    const [rows] = await pool.query(query, [companyId]);
    return rows;
};

export const deleteCustomer = async (id, companyId) => {
    const query = 'DELETE FROM clients WHERE id = ? AND company_id = ?';
    const [result] = await pool.query(query, [id, companyId]);
    return result.affectedRows;
};