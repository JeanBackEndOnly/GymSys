import api from '../lib/api';
import { Contract } from '../types/models';

export const contractService = {
  async getAllContracts(params?: Record<string, any>): Promise<Contract[]> {
    const response = await api.get('/contracts', { params });
    // Laravel paginates the response or wraps it in data
    return response.data?.data?.data || response.data?.data || response.data || [];
  },

  async getContractById(id: number): Promise<Contract> {
    const response = await api.get(`/contracts/${id}`);
    return response.data?.data || response.data;
  },

  async createContract(data: Partial<Contract>): Promise<Contract> {
    const response = await api.post('/contracts', data);
    return response.data?.data || response.data;
  },

  async updateContract(id: number, data: Partial<Contract>): Promise<Contract> {
    const response = await api.put(`/contracts/${id}`, data);
    return response.data?.data || response.data;
  },

  async deleteContract(id: number): Promise<void> {
    await api.delete(`/contracts/${id}`);
  },
};
