import pool  from '../../config/mysql.js';


    export const findByEmail = async (email) => {
        // On sélectionne l'utilisateur par email
        const query = 'SELECT * FROM users WHERE email = ?';
        const [rows] = await pool.query(query, [email]);
        console.log(rows);
        return rows[0]; // Retourne l'objet user ou undefined
    }

export const createUser = async (userData) => {
    const { company_id, email, password, role } = userData;
    
    const query = `
        INSERT INTO users (company_id, email, password, role) 
        VALUES (?, ?, ?, ?)
    `;
    
    const [result] = await pool.query(query, [company_id, email, password, role]);
    return result.insertId;
};
