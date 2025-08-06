import { Button } from "primereact/button";
import { Card } from "primereact/card";
import React from "react";
import type { Category } from "../../types";

interface CategoryManagementCardProps {
  category: Category;
  onEditCategory?: (category: Category) => void;
  onDeleteCategory?: (category: Category) => void;
}

const CategoryManagementCard: React.FC<CategoryManagementCardProps> = ({
  category,
  onEditCategory,
  onDeleteCategory,
}) => {
  const handleEdit = () => {
    if (onEditCategory) {
      onEditCategory(category);
    }
  };

  const handleDelete = () => {
    if (onDeleteCategory) {
      onDeleteCategory(category);
    }
  };

  const footer = (
    <div className="flex gap-2">
      <Button
        icon="pi pi-pencil"
        size="small"
        outlined
        onClick={handleEdit}
        tooltip="Edit Turf"
      />
      <Button
        icon="pi pi-trash"
        size="small"
        outlined
        severity="danger"
        onClick={handleDelete}
        tooltip="Delete Turf"
      />
    </div>
  );

  return (
    <div className="flex justify-between shadow-md bg-white rounded-lg p-3 hover:shadow-lg h-full">
      <h3 className="text-lg text-center font-semibold text-gray-800 pt-2">
        {category.name}
      </h3>
      <div className="flex gap-2">
        <Button
          icon="pi pi-pencil"
          size="small"
          outlined
          onClick={handleEdit}
        />
        <Button
          icon="pi pi-trash"
          size="small"
          outlined
          severity="danger"
          onClick={handleDelete}
        />
      </div>
    </div>
  );
};

export default CategoryManagementCard;
