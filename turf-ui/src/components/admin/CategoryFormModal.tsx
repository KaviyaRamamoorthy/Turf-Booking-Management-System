import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../store";
import { addToast, closeModal } from "../../store/slices/uiSlice";
import {
  createCategory,
  updateCategory,
} from "../../store/slices/categorySlice";
import type { RootState, Category } from "../../types";

interface CategoryFormModalProps {
  visible: boolean;
  onHide: () => void;
  editMode?: boolean;
  categoryToEdit?: Category | null;
}

interface CategoryFormData {
  name: string;
}

const CategoryFormModal: React.FC<CategoryFormModalProps> = ({
  visible,
  onHide,
  editMode = false,
  categoryToEdit = null,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.category);

  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editMode && categoryToEdit && visible) {
      setFormData({
        name: categoryToEdit.name,
      });
    } else if (!editMode && visible) {
      // Reset form for new category
      setFormData({
        name: "",
      });
    }
    setErrors({});
  }, [editMode, categoryToEdit, visible]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Category name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Category name must be at least 2 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const categoryData = {
        name: formData.name.trim(),
        description: "", // Always send empty string for description
      };

      if (editMode && categoryToEdit) {
        await dispatch(
          updateCategory({ id: categoryToEdit.id, categoryData })
        ).unwrap();
        dispatch(
          addToast({
            type: "success",
            title: "Success",
            message: "Category updated successfully",
          })
        );
      } else {
        await dispatch(createCategory(categoryData)).unwrap();
        dispatch(
          addToast({
            type: "success",
            title: "Success",
            message: "Category created successfully",
          })
        );
      }

      handleClose();
    } catch (error) {
      dispatch(
        addToast({
          type: "error",
          title: "Error",
          message: error instanceof Error ? error.message : "Operation failed",
        })
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    dispatch(closeModal("categoryForm"));
    onHide();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const renderField = (
    label: string,
    field: string,
    component: React.ReactNode,
    required = false
  ) => (
    <div className="space-y-2">
      <label
        htmlFor={field}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {component}
      {errors[field] && <small className="text-red-500">{errors[field]}</small>}
    </div>
  );

  const footer = (
    <div className="flex justify-end gap-2">
      <Button
        label="Cancel"
        icon="pi pi-times"
        className="p-button-text cancel-button"
        onClick={handleClose}
        disabled={isSubmitting}
      />
      <Button
        label={editMode ? "Update" : "Create"}
        icon="pi pi-check"
        className="submit-button"
        onClick={handleSubmit}
        loading={isSubmitting}
      />
    </div>
  );

  return (
    <Dialog
      visible={visible}
      onHide={handleClose}
      header={editMode ? "Edit Category" : "Add New Category"}
      footer={footer}
      className="w-full max-w-md"
      modal
      closeOnEscape={!isSubmitting}
      closeIcon="pi pi-times close-button"
      closable={!isSubmitting}
    >
      <div className="space-y-4">
        {renderField(
          "Category Name",
          "name",
          <InputText
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className={`w-full ${errors.name ? "p-invalid" : ""}`}
            placeholder="Enter category name (e.g., Football, Cricket)"
            maxLength={50}
          />,
          true
        )}
      </div>
    </Dialog>
  );
};

export default CategoryFormModal;
