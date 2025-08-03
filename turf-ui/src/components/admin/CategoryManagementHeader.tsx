import { Button } from "primereact/button";
import React from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store";
import { openModal } from "../../store/slices/uiSlice";

interface CategoryManagementHeaderProps {
  onAddCategory?: () => void;
}

const CategoryManagementHeader: React.FC<CategoryManagementHeaderProps> = ({
  onAddCategory,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleAddCategory = () => {
    if (onAddCategory) {
      onAddCategory();
    } else {
      dispatch(openModal("categoryForm"));
    }
  };

  return (
    <div className="flex items-center justify-end">
      <Button
        label="Add Category"
        icon="pi pi-plus"
        className="!bg-green-600 !hover:bg-green-700 !border-green-600 !hover:border-green-700 !text-white"
        onClick={handleAddCategory}
      />
    </div>
  );
};

export default CategoryManagementHeader;
