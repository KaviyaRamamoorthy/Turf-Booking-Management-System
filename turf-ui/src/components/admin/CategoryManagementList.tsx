import React from "react";
import type { Category } from "../../types";
import CategoryManagementCard from "./CategoryManagementCard";

interface CategoryManagementListProps {
  categories: Category[];
  onEditCategory?: (category: Category) => void;
  onDeleteCategory?: (category: Category) => void;
}

const CategoryManagementList: React.FC<CategoryManagementListProps> = ({ 
  categories, 
  onEditCategory, 
  onDeleteCategory 
}) => {
  if (categories.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <div className="text-gray-400 mb-4">
          <i className="pi pi-tags text-6xl"></i>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          No Categories Found
        </h3>
        <p className="text-gray-600">
          Get started by adding your first category to organize your turfs.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <CategoryManagementCard 
            key={category.id} 
            category={category} 
            onEditCategory={onEditCategory} 
            onDeleteCategory={onDeleteCategory} 
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryManagementList; 