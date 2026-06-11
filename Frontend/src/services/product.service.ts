import api from '../lib/api';
import { Product } from '../types/models';

export interface Paycheck {
  id: number;
  product_id: number;
  sold_by: number;
  paid_by?: number | null;
  paid_by_name?: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  payment_type: 'cash' | 'gcash';
  or_number: string;
  transaction_id?: string | null;
  payment_status?: string;
  created_at: string;
  product?: Product;
}

export const productService = {
  async getAllProducts(): Promise<Product[]> {
    const response = await api.get('/products');
    return response.data?.data || response.data || [];
  },

  async createProduct(data: Partial<Product>): Promise<Product> {
    const response = await api.post('/products', data);
    return response.data?.data || response.data;
  },

  async updateProduct(id: number, data: Partial<Product>): Promise<Product> {
    const response = await api.put(`/products/${id}`, data);
    return response.data?.data || response.data;
  },

  async deleteProduct(id: number): Promise<void> {
    await api.delete(`/products/${id}`);
  },

  async getPaychecks(): Promise<Paycheck[]> {
    try {
      const response = await api.get('/products-paycheck');
      return response.data?.data || response.data || [];
    } catch (error: any) {
      // Backend ProductPaycheckController is missing the index() method, so it returns 500.
      console.warn("Backend missing GET /products-paycheck endpoint. Returning empty sales history.");
      return [];
    }
  },

  async submitPaycheck(data: Partial<Paycheck>): Promise<Paycheck> {
    const response = await api.post('/products-paycheck', data);
    return response.data?.data || response.data;
  },

  async getPaycheckById(id: number): Promise<Paycheck> {
    const response = await api.get(`/products-paycheck/${id}`);
    return response.data?.data || response.data;
  },

  async updatePaycheck(id: number, data: Partial<Paycheck>): Promise<Paycheck> {
    const response = await api.put(`/products-paycheck/${id}`, data);
    return response.data?.data || response.data;
  },

  async deletePaycheck(id: number): Promise<void> {
    await api.delete(`/products-paycheck/${id}`);
  }
};
