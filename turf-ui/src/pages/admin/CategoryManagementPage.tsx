import { Message } from "primereact/message";
import { ProgressSpinner } from "primereact/progressspinner";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CategoryManagementHeader from "../../components/admin/CategoryManagementHeader";
import CategoryManagementList from "../../components/admin/CategoryManagementList";
import type { AppDispatch } from "../../store";
import { fetchCategories } from "../../store/slices/categorySlice";
import type { RootState, Category } from "../../types";

interface CategoryManagementPageProps {
  onEditCategory?: (category: Category) => void;
  onAddCategory?: () => void;
  onDeleteCategory?: (category: Category) => void;
}

const CategoryManagementPage: React.FC<CategoryManagementPageProps> = ({
  onEditCategory,
  onAddCategory,
  onDeleteCategory,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, isLoading, error } = useSelector(
    (state: RootState) => state.category
  );

  // Load categories on component mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <ProgressSpinner />
      </div>
    );
  }

  if (error) {
    return (
     <div className="flex flex-col items-center justify-center min-h-96 bg-gray-50 text-center p-4">
         <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Categories found
            </h3>  
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CategoryManagementHeader onAddCategory={onAddCategory} />
      <CategoryManagementList
        categories={categories}
        onEditCategory={onEditCategory}
        onDeleteCategory={onDeleteCategory}
      />
    </div>
  );
};

export default CategoryManagementPage;
