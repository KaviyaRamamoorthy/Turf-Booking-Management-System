import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Rating } from "primereact/rating";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../store";
import { deleteTurf } from "../../store/slices/turfSlice";
import { fetchCategories } from "../../store/slices/categorySlice";
import { addToast, openModal } from "../../store/slices/uiSlice";
import type { Turf, RootState } from "../../types";
import turfImage from "../../assets/turf.jpg";

interface TurfManagementCardProps {
  turf: Turf;
  onEditTurf?: (turf: Turf) => void;
  onDeleteTurf?: (turf: Turf) => void;
}

const TurfManagementCard: React.FC<TurfManagementCardProps> = ({
  turf,
  onEditTurf,
  onDeleteTurf,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  // Get categories from Redux store to map categoryId to category name
  const { categories, isLoading: categoriesLoading } = useSelector(
    (state: RootState) => state.category
  );

  // Ensure categories are loaded - only run once on mount
  useEffect(() => {
    if (categories.length === 0 && !categoriesLoading) {
      dispatch(fetchCategories());
    }
  }, [dispatch]); // Only depend on dispatch to prevent infinite loops

  // Find the category name from categoryId
  const getCategoryName = () => {
    if (turf.category?.name) {
      // If category object is already populated, use it
      return turf.category.name;
    }

    // If categories are still loading, show loading state
    if (categoriesLoading) {
      return "Loading...";
    }

    // Otherwise, find the category by categoryId from Redux store
    const category = categories.find((cat) => cat.id === turf.categoryId);

    return category?.name || "Unknown";
  };

  const categoryName = getCategoryName();

  // Helper function to safely render location
  const getLocationDisplay = () => {
    // First check if locationData exists (parsed location object)
    if (turf.locationData) {
      const { address, city, state, zipCode } = turf.locationData;
      const parts = [address, city, state, zipCode].filter(
        (part) => part && part.trim() !== ""
      );
      return parts.join(", ") || "Location not specified";
    }

    // Fall back to location string
    if (typeof turf.location === "string") {
      return turf.location;
    }

    // Handle case where location is incorrectly an object (from turfSlice bug)
    if (turf.location && typeof turf.location === "object") {
      const locationObj = turf.location as any;
      const parts = [
        locationObj.address,
        locationObj.city,
        locationObj.state,
        locationObj.zipCode,
      ].filter(
        (part) => part && typeof part === "string" && part.trim() !== ""
      );
      return parts.join(", ") || "Location not specified";
    }

    return "Location not specified";
  };

  console.log(turf);
  const getCategoryColor = (category: string | undefined) => {
    if (!category) return "contrast";

    switch (category.toLowerCase()) {
      case "football":
        return "success";
      case "cricket":
        return "info";
      case "tennis":
        return "warning";
      case "basketball":
        return "danger";
      case "volleyball":
        return "secondary";
      default:
        return "contrast";
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const handleEdit = () => {
    if (onEditTurf) {
      onEditTurf(turf);
    } else {
      dispatch(openModal("turfForm"));
    }
  };

  const handleDelete = () => {
    if (onDeleteTurf) {
      onDeleteTurf(turf);
    } else {
      // Fallback to direct deletion without confirmation
      dispatch(deleteTurf(turf.id))
        .unwrap()
        .then(() => {
          dispatch(
            addToast({
              type: "success",
              title: "Success",
              message: "Turf deleted successfully",
            })
          );
        })
        .catch((error) => {
          dispatch(
            addToast({
              type: "error",
              title: "Error",
              message: error || "Failed to delete turf",
            })
          );
        });
    }
  };

  const header = (
    <div className="relative">
      <img
        src={turfImage}
        alt={turf.name}
        className="w-full h-48 object-cover rounded-t-lg"
      />
      <div className="absolute top-2 right-2">
        <Badge
          value={categoryName}
          severity={getCategoryColor(categoryName)}
          className="capitalize"
        />
      </div>
    </div>
  );

  const footer = (
    <div className="flex justify-between items-center">
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
    </div>
  );

  return (
    <Card
      header={header}
      footer={footer}
      className="shadow-md hover:shadow-lg transition-shadow duration-200 h-full"
    >
      <div className="">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">
          {turf.name}
        </h3>
        <div className="flex items-center text-sm text-gray-600 mb-2">
          {getLocationDisplay()}.
        </div>

        <div className="flex justify-between items-center">
          <div className="text-lg font-bold text-green-600">
            {formatCurrency(turf.pricing.hourlyRate, turf.pricing.currency)}
            <span className="text-sm font-normal text-gray-600">/hour</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TurfManagementCard;
