import { apiGet } from '../utils/apiInterceptor';
import type { Category } from '../types';

// Interface for the backend response
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export const categoryService = {
  // Get all categories
  async getCategories(): Promise<Category[]> {
    try {
      console.log('Fetching categories from API');
      
      const response = await apiGet<ApiResponse<Category[]>>('/categories');
      
      console.log('Get categories response:', response);
      
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new Error('Failed to fetch categories');
    }
  },

  // Get category by ID
  async getCategoryById(id: string): Promise<Category> {
    try {
      console.log('Fetching category by ID:', id);
      
      const response = await apiGet<ApiResponse<Category>>(`/categories/${id}`);
      
      console.log('Get category by ID response:', response);
      
      return response.data;
    } catch (error) {
      console.error('Error fetching category by ID:', error);
      throw new Error('Failed to fetch category details');
    }
  },
};

export default categoryService; 