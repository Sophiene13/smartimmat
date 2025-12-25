import { ApiService } from './api.service.js';

export const CustomerService = {
    // Récupérer tous les clients
    async getAll() {
        return await ApiService.get('/customers');
    },

    // Créer un client
    async create(customerData) {
        return await ApiService.post('/customers', customerData);
    },

    // Supprimer un client
    async delete(id) {
        return await ApiService.delete(`/customers/${id}`);
    }
};