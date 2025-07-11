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
import { updateUser } from "../../store/slices/authSlice";
import CustomInput from "../../components/common/CustomInput";
import CustomEmailInput from "../../components/common/CustomEmailInput";
import CustomDropdown from "../../components/common/CustomDropdown";
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
    pincode: "",
    state: "",
    city: "",
    email: "",
    phoneNumber: "",
  });

  const [validationErrors, setValidationErrors] = useState<{
    fullName?: string;
    pincode?: string;
    state?: string;
    city?: string;
    email?: string;
    phoneNumber?: string;
  }>({});

  const [isEditing, setIsEditing] = useState(false);

  // Indian states for dropdown
  const states = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ];

  // Load user profile data
  useEffect(() => {
    if (user) {
      // If we have user data from auth, use it to populate the form
      setFormData({
        fullName: user.name || "",
        pincode: user.address?.pincode || "",
        state: user.address?.state || "",
        city: user.address?.city || "",
        email: user.email || "",
        phoneNumber: user.phone || "",
      });
    }
    dispatch(fetchUserProfile());
  }, [dispatch, user]);

  // Update form data when profile is loaded
  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.name || "",
        pincode: profile.address?.pincode || "",
        state: profile.address?.state || "",
        city: profile.address?.city || "",
        email: profile.email || "",
        phoneNumber: profile.phone || "",
      });
    }
  }, [profile]);

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
    }

    if (!formData.pincode.trim()) {
      errors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      errors.pincode = "Pincode must be 6 digits";
    }

    if (!formData.state) {
      errors.state = "State is required";
    }

    if (!formData.city.trim()) {
      errors.city = "City is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      errors.phoneNumber = "Phone number must be 10 digits";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const profileData = {
        name: formData.fullName,
        phone: formData.phoneNumber,
        address: {
          pincode: formData.pincode,
          state: formData.state,
          city: formData.city,
        },
        preferences: {
          theme: "light" as const,
          language: "en" as const,
          notifications: true,
        },
      };

      const updatedUser = await dispatch(
        updateUserProfile(profileData)
      ).unwrap();
      // Also update the auth state
      dispatch(updateUser(updatedUser));
      setIsEditing(false);
    } catch (error) {
      console.error("Profile update failed:", error);
    }
  };

  const handleCancel = () => {
    // Reset form to original values
    if (user) {
      setFormData({
        fullName: user.name || "",
        pincode: user.address?.pincode || "",
        state: user.address?.state || "",
        city: user.address?.city || "",
        email: user.email || "",
        phoneNumber: user.phone || "",
      });
    }
    setIsEditing(false);
    setValidationErrors({});
  };

  const breadcrumbItems = [
    { label: "Home", path: "/dashboard/admin", isActive: false },
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
            <div className="md:col-span-2">
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

            {/* Email */}
            <div className="md:col-span-2">
              <CustomEmailInput
                label="Email Address"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter your email address"
                error={validationErrors.email}
                disabled={true}
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

            {/* Pincode */}
            <div>
              <CustomInput
                label="Pincode"
                value={formData.pincode}
                onChange={(e) => handleInputChange("pincode", e.target.value)}
                placeholder="Enter your pincode"
                error={validationErrors.pincode}
                disabled={!isEditing}
                required
              />
            </div>

            {/* State */}
            <div>
              <CustomDropdown
                label="State"
                value={formData.state}
                options={states}
                onChange={(e) => handleInputChange("state", e.value)}
                placeholder="Select your state"
                error={validationErrors.state}
                disabled={!isEditing}
                required
              />
            </div>

            {/* City */}
            <div>
              <CustomInput
                label="City"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                placeholder="Enter your city"
                error={validationErrors.city}
                disabled={!isEditing}
                required
              />
            </div>
          </div>

          {/* User Role Display */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Account Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User Role
                </label>
                <p className="text-sm text-gray-600 capitalize bg-white px-3 py-2 rounded border">
                  {user?.role || "Not specified"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Member Since
                </label>
                <p className="text-sm text-gray-600 bg-white px-3 py-2 rounded border">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "Not specified"}
                </p>
              </div>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ProfilePage;
