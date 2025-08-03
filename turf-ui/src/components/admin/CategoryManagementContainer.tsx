import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CategoryManagementPage from "../../pages/admin/CategoryManagementPage";
import type { AppDispatch } from "../../store";
import { deleteCategory } from "../../store/slices/categorySlice";
import { addToast, closeModal, openModal } from "../../store/slices/uiSlice";
import type { RootState, Category } from "../../types";
import CategoryFormModal from "./CategoryFormModal";

const CategoryManagementContainer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { modals } = useSelector((state: RootState) => state.ui);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [editMode, setEditMode] = useState(false);

  const isCategoryModalVisible = modals["categoryForm"] || false;

  const handleCloseCategoryModal = () => {
    dispatch(closeModal("categoryForm"));
    setSelectedCategory(null);
    setEditMode(false);
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setEditMode(true);
    dispatch(closeModal("categoryForm")); // Close any existing modal
    setTimeout(() => {
      dispatch(openModal("categoryForm")); // Open with edit mode
    }, 100);
  };

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setEditMode(false);
    dispatch(closeModal("categoryForm")); // Close any existing modal
    setTimeout(() => {
      dispatch(openModal("categoryForm")); // Open with add mode
    }, 100);
  };

  const handleDeleteCategory = (category: Category) => {
    confirmDialog({
      message: `Are you sure you want to delete "${category.name}"?`,
      header: "Delete Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger submit-button",
      rejectClassName: "p-button-success cancel-button",
      accept: () => {
        dispatch(deleteCategory(category.id))
          .unwrap()
          .then(() => {
            dispatch(
              addToast({
                type: "success",
                title: "Success",
                message: "Category deleted successfully",
              })
            );
          })
          .catch((error) => {
            dispatch(
              addToast({
                type: "error",
                title: "Error",
                message: error || "Failed to delete category",
              })
            );
          });
      },
    });
  };

  return (
    <>
      <CategoryManagementPage
        onEditCategory={handleEditCategory}
        onAddCategory={handleAddCategory}
        onDeleteCategory={handleDeleteCategory}
      />
      <CategoryFormModal
        visible={isCategoryModalVisible}
        onHide={handleCloseCategoryModal}
        editMode={editMode}
        categoryToEdit={selectedCategory}
      />
      <ConfirmDialog />
    </>
  );
};

export default CategoryManagementContainer;
