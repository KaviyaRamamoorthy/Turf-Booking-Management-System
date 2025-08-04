import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import turfImage from "../../assets/turf.jpg";
import type { RootState, Turf } from "../../types";
import type { AppDispatch } from "../../store";
import { fetchCategories } from "../../store/slices/categorySlice";

interface TurfCardProps {
  turf: Turf;
  onViewDetails?: (turf: Turf) => void;
  onBook?: (turf: Turf) => void;
  showBookButton?: boolean;
}

const TurfCard: React.FC<TurfCardProps> = ({
  turf,
  onViewDetails,
  onBook,
  showBookButton = true,
}) => {
  // Get categories from Redux store to map categoryId to category name
  const dispatch = useDispatch<AppDispatch>();
  const { categories, isLoading: categoriesLoading } = useSelector(
    (state: RootState) => state.category
  );

  // Ensure categories are loaded - only run once on mount
  useEffect(() => {
    if (categories.length === 0 && !categoriesLoading) {
      console.log("TurfCard: Loading categories...");
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

  const getCategoryColor = (categoryName: string | undefined) => {
    if (!categoryName) return "contrast";

    switch (categoryName.toLowerCase()) {
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
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const getCategoryDisplayName = (categoryName: string | undefined) => {
    if (!categoryName) return "Unknown";

    switch (categoryName.toLowerCase()) {
      case "football":
        return "Football";
      case "cricket":
        return "Cricket";
      case "tennis":
        return "Tennis";
      case "basketball":
        return "Basketball";
      case "volleyball":
        return "Volleyball";
      default:
        return categoryName;
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
          value={getCategoryDisplayName(categoryName)}
          severity={getCategoryColor(categoryName)}
          className="text-xs font-medium"
        />
      </div>
    </div>
  );

  const footer = (
    <div className="flex gap-2">
      <Button
        label="View Details"
        outlined
        className="flex-1 !border-blue-500 !text-blue-500 hover:!bg-blue-50"
        onClick={() => onViewDetails?.(turf)}
      />
      {showBookButton && (
        <Button
          label="Book Now"
          className="flex-1 !bg-blue-500 !border-blue-500 hover:!bg-blue-600"
          onClick={() => onBook?.(turf)}
        />
      )}
    </div>
  );

  return (
    <Card
      header={header}
      footer={footer}
      className="!border-0 !shadow-sm hover:!shadow-md transition-all duration-200 !rounded-lg !overflow-hidden"
    >
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">
          {turf.name}
        </h3>
        <div className="flex items-center text-sm text-gray-600 mb-2">
          {getLocationDisplay()}.
        </div>

        <div className="flex items-center justify-between">
          <div className="text-lg font-bold text-green-600">
            {formatCurrency(
              turf.pricing?.hourlyRate || 0,
              turf.pricing?.currency || "INR"
            )}
            <span className="text-sm font-normal text-gray-600">/hour</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TurfCard;
