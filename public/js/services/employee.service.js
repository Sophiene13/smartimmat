import { ApiService } from './api.service.js';

export const EmployeeService = {
    // Récupérer la liste
    async getAll() {
        return await ApiService.get('/users/employees');
    },

    // Créer un collaborateur
    async create(employeeData) {
        return await ApiService.post('/users/employees', employeeData);
    },
    async delete(id) {
        return await ApiService.delete(`/users/employees/${id}`);
    }
};