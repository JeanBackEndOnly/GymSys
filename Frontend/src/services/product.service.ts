// import api from '../lib/api';
// import { Product } from '../types/models';

// export interface Paycheck {
//   id: number;
//   product_id: number;
//   sold_by: number;
//   paid_by?: number | null;
//   paid_by_name?: string | null;
//   quantity: number;
//   unit_price: number;
//   total_price: number;
//   payment_type: 'cash' | 'gcash';
//   or_number: string;
//   transaction_id?: string | null;
//   payment_status?: string;
//   created_at: string;
//   product?: Product;
// }

// export const productService = {
//   async getAllProducts(): Promise<Product[]> {
//     const response = await api.get('/products');
//     return response.data?.data || response.data || [];
//   },

//   async createProduct(data: Partial<Product>): Promise<Product> {
//     const response = await api.post('/products', data);
//     return response.data?.data || response.data;
//   },

//   async updateProduct(id: number, data: Partial<Product>): Promise<Product> {
//     const response = await api.put(`/products/${id}`, data);
//     return response.data?.data || response.data;
//   },

//   async deleteProduct(id: number): Promise<void> {
//     await api.delete(`/products/${id}`);
//   },

//   async getPaychecks(): Promise<Paycheck[]> {
//     try {
//       const response = await api.get('/products-paycheck');
//       return response.data?.data || response.data || [];
//     } catch (error: any) {
//       // Backend ProductPaycheckController is missing the index() method, so it returns 500.
//       console.warn("Backend missing GET /products-paycheck endpoint. Returning empty sales history.");
//       return [];
//     }
//   },

//   async submitPaycheck(data: Partial<Paycheck>): Promise<Paycheck> {
//     const response = await api.post('/products-paycheck', data);
//     return response.data?.data || response.data;
//   },

//   async getPaycheckById(id: number): Promise<Paycheck> {
//     const response = await api.get(`/products-paycheck/${id}`);
//     return response.data?.data || response.data;
//   },

//   async updatePaycheck(id: number, data: Partial<Paycheck>): Promise<Paycheck> {
//     const response = await api.put(`/products-paycheck/${id}`, data);
//     return response.data?.data || response.data;
//   },

//   async deletePaycheck(id: number): Promise<void> {
//     await api.delete(`/products-paycheck/${id}`);
//   }
// };
// product.service.ts

import api from '../lib/api';
import { Product } from '@/types/models';

// Product sold item (from product_sold table)
export interface ProductSoldItem {
  id: number;
  paycheck_id: number;
  product_id: number;
  quantity: number;
  price_at_sale: number;
  product?: Product;
  created_at: string;
  updated_at: string;
}

// Paycheck/Receipt header
export interface Paycheck {
  id: number;
  sold_by: number;
  paid_by?: number | null;
  paid_by_name?: string | null;
  payment_type: 'cash' | 'gcash';
  or_number: string;
  transaction_id?: string | null;
  payment_status: 'pending' | 'paid' | 'failed';
  created_at: string;
  updated_at: string;
  items?: ProductSoldItem[];
  product?: Product;
  quantity?: number;
  unit_price?: number;
  total_price?: number;
}

// ✅ This is the correct payload for multiple products
export interface SubmitPaycheckPayload {
  sold_by: number;
  paid_by?: number | null;
  paid_by_name?: string | null;
  payment_type: 'cash' | 'gcash';
  or_number: string;
  transaction_id?: string | null;
  payment_status?: 'pending' | 'paid' | 'failed';
  products: Array<{
    product_id: number;
    quantity: number;
    price_at_sale: number;
  }>;
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
      const data = response.data?.data || response.data || [];
      return data;
    } catch (error: any) {
      console.warn("Failed to fetch sales history:", error);
      return [];
    }
  },

  // ✅ FIXED: Accepts the new payload with products array
  async submitPaycheck(payload: SubmitPaycheckPayload): Promise<Paycheck> {
    const response = await api.post('/products-paycheck', payload);
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