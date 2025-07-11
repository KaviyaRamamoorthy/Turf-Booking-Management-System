import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { closeModal } from "../../store/slices/uiSlice";
import { createTurf, updateTurf } from "../../store/slices/turfSlice";
import { addToast } from "../../store/slices/uiSlice";
import type { Turf, TurfCategory, TurfFormData } from "../../types";
import type { RootState } from "../../types";
import type { AppDispatch } from "../../store";

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

  const [formData, setFormData] = useState<TurfFormData>({
    name: "",
    description: "",
    category: "football",
    location: {
      address: "",
      city: "",
      state: "",
      country: "India",
      zipCode: "",
    },
    pricing: {
      hourlyRate: 0,
      currency: "USD",
    },
    startTime: "06:00",
    endTime: "22:00",
    slotInterval: 60,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Category options
  const categoryOptions = [
    { label: "Football", value: "football" },
    { label: "Cricket", value: "cricket" },
    { label: "Tennis", value: "tennis" },
    { label: "Basketball", value: "basketball" },
    { label: "Volleyball", value: "volleyball" },
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
      setFormData({
        name: turfToEdit.name,
        description: turfToEdit.description,
        category: turfToEdit.category,
        location: {
          address: turfToEdit.location.address,
          city: turfToEdit.location.city,
          state: turfToEdit.location.state,
          country: turfToEdit.location.zipCode ? "India" : "India",
          zipCode: turfToEdit.location.zipCode || "",
        },
        pricing: {
          hourlyRate: turfToEdit.pricing.hourlyRate,
          currency: turfToEdit.pricing.currency,
        },
        startTime: "06:00", // Default values since these aren't in the Turf type
        endTime: "22:00",
        slotInterval: 60,
      });
    } else if (!editMode && visible) {
      // Reset form for new turf
      setFormData({
        name: "",
        description: "",
        category: "football",
        location: {
          address: "",
          city: "",
          state: "",
          country: "India",
          zipCode: "",
        },
        pricing: {
          hourlyRate: 0,
          currency: "USD",
        },
        startTime: "06:00",
        endTime: "22:00",
        slotInterval: 60,
      });
    }
    setErrors({});
  }, [editMode, turfToEdit, visible]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.location.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.location.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.location.state.trim()) {
      newErrors.state = "State is required";
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
      const turfData = {
        name: formData.name,
        description: formData.description,
        sportType: formData.category,
        addressLine1: formData.location.address,
        city: formData.location.city,
        state: formData.location.state,
        country: formData.location.country,
        postalCode: formData.location.zipCode,
        startTime: formData.startTime,
        endTime: formData.endTime,
        slotInterval: formData.slotInterval,
        pricePerSlot: formData.pricing.hourlyRate,
      };

      if (editMode && turfToEdit) {
        await dispatch(
          updateTurf({ id: turfToEdit.id, turfData })
        ).unwrap();
        dispatch(
          addToast({
            type: "success",
            title: "Success",
            message: "Turf updated successfully",
          })
        );
      } else {
        await dispatch(createTurf(turfData)).unwrap();
        dispatch(
          addToast({
            type: "success",
            title: "Success",
            message: "Turf created successfully",
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
      <label htmlFor={field} className="block text-sm font-medium text-gray-700 mb-1">
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
          <Dropdown
            id="category"
            value={formData.category}
            options={categoryOptions}
            onChange={(e) => handleInputChange("category", e.value)}
            className="w-full"
            placeholder="Select sport category"
          />,
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

        {/* Location Information */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 mt-4">
            Location Information
          </h3>
        </div>

        {renderField(
          "Address",
          "address",
          <InputText
            id="address"
            value={formData.location.address}
            onChange={(e) => handleInputChange("location.address", e.target.value)}
            className={`w-full ${errors.address ? "p-invalid" : ""}`}
            placeholder="Enter address"
          />,
          true
        )}

        {renderField(
          "City",
          "city",
          <InputText
            id="city"
            value={formData.location.city}
            onChange={(e) => handleInputChange("location.city", e.target.value)}
            className={`w-full ${errors.city ? "p-invalid" : ""}`}
            placeholder="Enter city"
          />,
          true
        )}

        {renderField(
          "State",
          "state",
          <InputText
            id="state"
            value={formData.location.state}
            onChange={(e) => handleInputChange("location.state", e.target.value)}
            className={`w-full ${errors.state ? "p-invalid" : ""}`}
            placeholder="Enter state"
          />,
          true
        )}

        {renderField(
          "Postal Code",
          "zipCode",
          <InputText
            id="zipCode"
            value={formData.location.zipCode}
            onChange={(e) => handleInputChange("location.zipCode", e.target.value)}
            className="w-full"
            placeholder="Enter postal code"
          />
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
            onValueChange={(e) => handleInputChange("pricing.hourlyRate", e.value)}
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