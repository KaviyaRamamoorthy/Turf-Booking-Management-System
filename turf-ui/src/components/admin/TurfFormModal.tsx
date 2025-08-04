import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../store";
import {
  createTurf,
  updateTurf,
  fetchTurfs,
} from "../../store/slices/turfSlice";
import { addToast, closeModal } from "../../store/slices/uiSlice";
import type { RootState, Turf, TurfFormData } from "../../types";

interface TurfFormModalProps {
  visible: boolean;
  onHide: () => void;
  editMode?: boolean;
  turfToEdit?: Turf | null;
}

const TurfFormModal: React.FC<TurfFormModalProps> = ({
  visible,
  onHide,
  editMode = false,
  turfToEdit = null,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.turf);
  const { categories } = useSelector((state: RootState) => state.category);

  const [formData, setFormData] = useState<TurfFormData>({
    name: "",
    description: "",
    category: "", // Will be set to first category ID when categories load
    location: "", // Single address field
    pricing: {
      hourlyRate: 0,
      currency: "INR",
    },
    startTime: "06:00",
    endTime: "22:00",
    slotInterval: 60,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Only use backend categories - no fallback with fake UUIDs
  const categoryOptions =
    categories.length > 0
      ? categories.map((category) => ({
          label: category.name,
          value: category.id,
        }))
      : [
          {
            label: "No categories available - Create categories first",
            value: "",
            disabled: true,
          },
        ];

  // Slot interval options
  const slotIntervalOptions = [
    { label: "30 minutes", value: 30 },
    { label: "1 hour", value: 60 },
    { label: "1.5 hours", value: 90 },
    { label: "2 hours", value: 120 },
  ];

  // Currency options
  const currencyOptions = [
    { label: "USD", value: "USD" },
    { label: "INR", value: "INR" },
    { label: "EUR", value: "EUR" },
  ];

  useEffect(() => {
    if (editMode && turfToEdit && visible) {
      const formDataToSet = {
        name: turfToEdit.name || "",
        description: turfToEdit.description || "",
        category: turfToEdit.categoryId || "", // Use categoryId for the form
        location: turfToEdit.location || "", // Use location string directly
        pricing: {
          hourlyRate:
            turfToEdit.pricing?.hourlyRate || turfToEdit.pricePerHour || 0, // TurfService adds pricing.hourlyRate
          currency: turfToEdit.pricing?.currency || "INR",
        },
        startTime: turfToEdit.openTime
          ? turfToEdit.openTime.substring(0, 5)
          : "06:00", // Convert HH:MM:SS to HH:MM
        endTime: turfToEdit.closeTime
          ? turfToEdit.closeTime.substring(0, 5)
          : "22:00", // Convert HH:MM:SS to HH:MM
        slotInterval: 60,
      };

      setFormData(formDataToSet);
    } else if (!editMode && visible) {
      // Reset form for new turf
      setFormData({
        name: "",
        description: "",
        category: "", // Will be set by separate useEffect when categories load
        location: "", // Single address field
        pricing: {
          hourlyRate: 0,
          currency: "INR",
        },
        startTime: "06:00",
        endTime: "22:00",
        slotInterval: 60,
      });
    }
    setErrors({});
  }, [editMode, turfToEdit, visible]);

  // Set default category when categories are loaded - separate useEffect
  useEffect(() => {
    if (
      categories.length > 0 &&
      !editMode &&
      formData.category === "" &&
      visible
    ) {
      const firstCategoryId = categories[0]?.id;
      if (firstCategoryId) {
        setFormData((prev) => ({
          ...prev,
          category: firstCategoryId,
        }));
      }
    }
  }, [categories, editMode, formData.category, visible]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.category || formData.category === "") {
      newErrors.category = "Please select a sport category";
    }

    // Check if valid backend categories are available
    if (categories.length === 0) {
      newErrors.category =
        "No categories available. Please create categories first.";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Address is required";
    } else if (formData.location.trim().length < 10) {
      newErrors.location = "Please enter a complete address";
    }

    if (formData.pricing.hourlyRate <= 0) {
      newErrors.hourlyRate = "Hourly rate must be greater than 0";
    }

    if (formData.startTime >= formData.endTime) {
      newErrors.endTime = "End time must be after start time";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      // Format data for backend CreateTurfRequest
      const turfData = {
        name: formData.name,
        description: formData.description,
        categoryId: formData.category, // Backend expects categoryId
        location: formData.location.trim(), // Use location string directly
        pricePerHour: formData.pricing.hourlyRate, // Backend expects pricePerHour
        openTime: `${formData.startTime}:00`, // Convert HH:MM to HH:MM:SS for backend
        closeTime: `${formData.endTime}:00`, // Convert HH:MM to HH:MM:SS for backend
      };

      if (editMode && turfToEdit) {
        await dispatch(updateTurf({ id: turfToEdit.id, turfData })).unwrap();
        dispatch(
          addToast({
            type: "success",
            title: "Success",
            message: "Turf updated successfully",
          })
        );
        // Refresh the turfs list
        dispatch(fetchTurfs(undefined));
      } else {
        await dispatch(createTurf(turfData)).unwrap();
        dispatch(
          addToast({
            type: "success",
            title: "Success",
            message: "Turf created successfully",
          })
        );
        // Refresh the turfs list
        dispatch(fetchTurfs(undefined));
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
    }
  };

  const handleClose = () => {
    dispatch(closeModal("turfForm"));
    onHide();
  };

  const handleInputChange = (field: string, value: any) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof TurfFormData] as any),
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }

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
    <div className="field">
      <label
        htmlFor={field}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {component}
      {errors[field] && (
        <small className="p-error block mt-1">{errors[field]}</small>
      )}
    </div>
  );

  const footer = (
    <div className="flex justify-end gap-2">
      <Button
        label="Cancel"
        icon="pi pi-times"
        className="p-button-text cancel-button"
        onClick={handleClose}
        disabled={isLoading}
      />
      <Button
        label={editMode ? "Update" : "Create"}
        icon="pi pi-check"
        className="submit-button"
        onClick={handleSubmit}
        loading={isLoading}
      />
    </div>
  );

  return (
    <Dialog
      visible={visible}
      onHide={handleClose}
      header={editMode ? "Edit Turf" : "Add New Turf"}
      footer={footer}
      className="w-full max-w-2xl"
      modal
      closeOnEscape={!isLoading}
      closeIcon="pi pi-times close-button"
      closable={!isLoading}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Basic Information */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Basic Information
          </h3>
        </div>

        {renderField(
          "Turf Name",
          "name",
          <InputText
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className={`w-full ${errors.name ? "p-invalid" : ""}`}
            placeholder="Enter turf name"
          />,
          true
        )}

        {renderField(
          "Sport Category",
          "category",
          <>
            <Dropdown
              id="category"
              value={formData.category}
              options={categoryOptions}
              onChange={(e) => handleInputChange("category", e.value)}
              className="w-full"
              placeholder="Select sport category"
              disabled={categories.length === 0}
            />
            {categories.length === 0 && (
              <small className="text-red-500 mt-1 block">
                No categories available. Please create categories first through
                the admin panel.
              </small>
            )}
          </>,
          true
        )}

        {renderField(
          "Description",
          "description",
          <InputTextarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            className={`w-full ${errors.description ? "p-invalid" : ""}`}
            rows={3}
            placeholder="Enter turf description"
          />,
          true
        )}
        {renderField(
          "Address",
          "location",
          <InputTextarea
            id="location"
            value={formData.location}
            onChange={(e) => handleInputChange("location", e.target.value)}
            className={`w-full ${errors.location ? "p-invalid" : ""}`}
            rows={3}
            placeholder="Enter complete address (e.g., 123 Main Street, City, State, ZIP Code)"
          />,
          true
        )}

        {/* Pricing & Timing */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 mt-4">
            Pricing & Timing
          </h3>
        </div>

        {renderField(
          "Hourly Rate",
          "hourlyRate",
          <InputNumber
            id="hourlyRate"
            value={formData.pricing.hourlyRate}
            onValueChange={(e) =>
              handleInputChange("pricing.hourlyRate", e.value)
            }
            className={`w-full ${errors.hourlyRate ? "p-invalid" : ""}`}
            placeholder="Enter hourly rate"
            min={0}
            mode="currency"
            currency={formData.pricing.currency}
          />,
          true
        )}

        {renderField(
          "Currency",
          "currency",
          <Dropdown
            id="currency"
            value={formData.pricing.currency}
            options={currencyOptions}
            onChange={(e) => handleInputChange("pricing.currency", e.value)}
            className="w-full"
          />
        )}

        {renderField(
          "Start Time",
          "startTime",
          <InputText
            id="startTime"
            type="time"
            value={formData.startTime}
            onChange={(e) => handleInputChange("startTime", e.target.value)}
            className="w-full"
          />
        )}

        {renderField(
          "End Time",
          "endTime",
          <InputText
            id="endTime"
            type="time"
            value={formData.endTime}
            onChange={(e) => handleInputChange("endTime", e.target.value)}
            className={`w-full ${errors.endTime ? "p-invalid" : ""}`}
          />
        )}

        {renderField(
          "Slot Interval",
          "slotInterval",
          <Dropdown
            id="slotInterval"
            value={formData.slotInterval}
            options={slotIntervalOptions}
            onChange={(e) => handleInputChange("slotInterval", e.value)}
            className="w-full"
          />
        )}
      </div>
    </Dialog>
  );
};

export default TurfFormModal;
