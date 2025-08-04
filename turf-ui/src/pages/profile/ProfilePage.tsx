import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../../types";
import type { AppDispatch } from "../../store";
import {
  updateUserProfile,
  fetchUserProfile,
} from "../../store/slices/userSlice";
import CustomInput from "../../components/common/CustomInput";
import CustomEmailInput from "../../components/common/CustomEmailInput";
import Breadcrumb from "../../components/common/Breadcrumb";

const ProfilePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { profile, isLoading, error } = useSelector(
    (state: RootState) => state.user
  );
  const { user } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
  });

  const [validationErrors, setValidationErrors] = useState<{
    fullName?: string;
    phoneNumber?: string;
  }>({});

  const [isEditing, setIsEditing] = useState(false);

  // Load user profile data
  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  // Update form data when profile is loaded
  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || "",
        phoneNumber: profile.phoneNumber || "",
      });
    } else if (user) {
      // Fallback to auth user data if profile not loaded
      setFormData({
        fullName: user.fullName || user.name || "",
        phoneNumber: user.phoneNumber || user.phone || "",
      });
    }
  }, [profile, user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear validation error when user starts typing
    if (validationErrors[field as keyof typeof validationErrors]) {
      setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = () => {
    const errors: typeof validationErrors = {};

    if (!formData.fullName.trim()) {
      errors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 2) {
      errors.fullName = "Full name must be at least 2 characters";
    }

    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      errors.phoneNumber = "Phone number must be 10 digits";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await dispatch(updateUserProfile(formData)).unwrap();
      setIsEditing(false);
      setValidationErrors({});
    } catch (error) {
      console.error("Profile update failed:", error);
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    if (profile) {
      setFormData({
        fullName: profile.fullName || "",
        phoneNumber: profile.phoneNumber || "",
      });
    }
    setIsEditing(false);
    setValidationErrors({});
  };

  const breadcrumbItems = [
    { label: "Home", path: "/home", isActive: false },
    { label: "Profile", path: "/profile", isActive: true },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <Breadcrumb items={breadcrumbItems} />

      <Card className="shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
            <p className="text-gray-600 mt-1">
              Manage your personal information
            </p>
          </div>
          <div className="flex gap-2">
            {!isEditing ? (
              <Button
                label="Edit Profile"
                icon="pi pi-pencil"
                className="!bg-blue-600 !border-blue-600 !text-white hover:!bg-blue-700 hover:!border-blue-700"
                onClick={() => setIsEditing(true)}
              />
            ) : (
              <>
                <Button
                  label="Cancel"
                  icon="pi pi-times"
                  className="!bg-white !border-gray-300 !text-black hover:!bg-gray-50 hover:!border-gray-400"
                  onClick={handleCancel}
                />
                <Button
                  label="Save Changes"
                  icon="pi pi-check"
                  className="!bg-blue-600 !border-blue-600 !text-white hover:!bg-blue-700 hover:!border-blue-700"
                  onClick={handleSubmit}
                  loading={isLoading}
                />
              </>
            )}
          </div>
        </div>

        {error && (
          <Message severity="error" text={error} className="w-full mb-4" />
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <CustomInput
                label="Full Name"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                placeholder="Enter your full name"
                error={validationErrors.fullName}
                disabled={!isEditing}
                required
              />
            </div>

            {/* Phone Number */}
            <div>
              <CustomInput
                label="Phone Number"
                value={formData.phoneNumber}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
                placeholder="Enter your phone number"
                error={validationErrors.phoneNumber}
                disabled={!isEditing}
                required
              />
            </div>

            {/* Email - Read Only */}
            <div>
              <CustomEmailInput
                label="Email Address"
                value={profile?.email || user?.email || ""}
                onChange={() => {}} // Read-only
                placeholder="Email address"
                disabled={true}
                required
              />
              <small className="text-gray-500 text-xs mt-1 block">
                Email address cannot be changed. Contact support if needed.
              </small>
            </div>

            {/* User Role */}
            <div>
              <CustomInput
                label="User Role"
                value={profile?.role || user?.role || ""}
                onChange={() => {}} // Read-only
                placeholder="User role"
                disabled={true}
              />
              <small className="text-gray-500 text-xs mt-1 block">
                User role cannot be changed.
              </small>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ProfilePage;