import pool  from '../../config/mysql.js';

//Authentification
export const findByEmail = async (email) => {
        const query = 'SELECT * FROM users WHERE email = ?';
        const [rows] = await pool.query(query, [email]);
        console.log(rows);
        return rows[0]; 
    }
//Creer un utilisateur
export const createUser = async (userData) => {
    const { company_id, first_name, last_name, email, password, role } = userData;
    
    const query = `
        INSERT INTO users (company_id, first_name, last_name, email, password, role) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await pool.query(query, [company_id, first_name, last_name, email, password, role]);
    return result.insertId;
};
//Supprimer un utilisateur
export const deleteUser = async (id, companyId) => {
    const [result] = await pool.query(
        'DELETE FROM users WHERE id = ? AND company_id = ?', 
        [id, companyId]
    );
    return result;
}
//Mettre à jour un utilisateur
export const updateUser = async (id, companyId, data) => {
    const { first_name, last_name, email, role } = data;
    
    const [result] = await pool.query(
        'UPDATE users SET first_name = ?, last_name = ?, email = ?, role = ? WHERE id = ? AND company_id = ?',
        [first_name, last_name, email, role, id, companyId]
    );
    
    return result;
}
//Recuperer les employes
export const findAllEmployees = async (companyId) => {
    const query = `
        SELECT id, first_name, last_name, email, role, created_at 
        FROM users 
        WHERE company_id = ? 
        ORDER BY created_at DESC
    `;
    
    const [rows] = await pool.query(query, [companyId]);
    return rows;
};