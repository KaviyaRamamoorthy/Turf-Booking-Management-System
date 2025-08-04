import { apiGet, apiPost, apiPut, apiDelete } from "../utils/apiInterceptor";
import type { ApiResponse, Category } from "../types";

// Backend request interfaces based on CategoryDto
export interface CreateCategoryRequest {
  name: string;
  description?: string;
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {
  // All fields optional for updates
}

export const categoryService = {
  // Get all categories - matches backend /api/categories
  async getCategories(): Promise<Category[]> {
    try {
      console.log("Fetching categories from API");

      const response = await apiGet<ApiResponse<Category[]>>("/categories");

      console.log("Get categories response:", response);

      if (!response.success) {
        throw new Error(response.message || "Failed to fetch categories");
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Failed to fetch categories");
    }
  },

  // Get category by ID - matches backend /api/categories/{id}
  async getCategoryById(id: string): Promise<Category> {
    try {
      console.log("Fetching category by ID:", id);

      const response = await apiGet<ApiResponse<Category>>(`/categories/${id}`);

      console.log("Get category by ID response:", response);

      if (!response.success || !response.data) {
        throw new Error(response.message || "Category not found");
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching category by ID:", error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Failed to fetch category details");
    }
  },

  // Create category - matches backend /api/categories (POST) - Admin only
  async createCategory(categoryData: CreateCategoryRequest): Promise<Category> {
    try {
      console.log("Creating category with data:", categoryData);

      const response = await apiPost<ApiResponse<Category>>(
        "/categories",
        categoryData
      );

      console.log("Create category response:", response);

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to create category");
      }

      return response.data;
    } catch (error) {
      console.error("Error creating category:", error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Failed to create category");
    }
  },

  // Update category - matches backend /api/categories/{id} (PUT) - Admin only
  async updateCategory(
    id: string,
    categoryData: UpdateCategoryRequest
  ): Promise<Category> {
    try {
      console.log("Updating category:", id, "with data:", categoryData);

      const response = await apiPut<ApiResponse<Category>>(
        `/categories/${id}`,
        categoryData
      );

      console.log("Update category response:", response);

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to update category");
      }

      return response.data;
    } catch (error) {
      console.error("Error updating category:", error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Failed to update category");
    }
  },

  // Delete category - matches backend /api/categories/{id} (DELETE) - Admin only
  async deleteCategory(id: string): Promise<void> {
    try {
      console.log("Deleting category:", id);

      const response = await apiDelete<ApiResponse<string>>(
        `/categories/${id}`
      );

      console.log("Delete category response:", response);

      if (!response.success) {
        throw new Error(response.message || "Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Failed to delete category");
    }
  },
};
