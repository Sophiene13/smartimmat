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
    // Mettre à jour un client
    async update(id, customerData) {
        return await ApiService.put(`/customers/${id}`, customerData);
    },

    // Supprimer un client
    async delete(id) {
        return await ApiService.delete(`/customers/${id}`);
    }
};