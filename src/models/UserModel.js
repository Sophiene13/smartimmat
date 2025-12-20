import pool  from '../../config/mysql.js';

const UserModel = {
    findByEmail: async (email) => {
        // On sélectionne l'utilisateur par email
        const query = 'SELECT * FROM users WHERE email = ?';
        const [rows] = await pool.query(query, [email]);
        console.log(rows);
        return rows[0]; // Retourne l'objet user ou undefined
    },

};

export default UserModel;