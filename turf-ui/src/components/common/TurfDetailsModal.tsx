import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import { Chip } from "primereact/chip";
import { Dialog } from "primereact/dialog";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import turfImage from "../../assets/turf.jpg";
import type { RootState, Turf } from "../../types";
import type { AppDispatch } from "../../store";
import { fetchCategories } from "../../store/slices/categorySlice";

interface TurfDetailsModalProps {
  turf: Turf | null;
  visible: boolean;
  onHide: () => void;
  onBook?: (turf: Turf) => void;
}

const TurfDetailsModal: React.FC<TurfDetailsModalProps> = ({
  turf,
  visible,
  onHide,
  onBook,
}) => {
  // Get categories from Redux store to map categoryId to category name
  const dispatch = useDispatch<AppDispatch>();
  const { categories, isLoading: categoriesLoading } = useSelector(
    (state: RootState) => state.category
  );

  // Ensure categories are loaded - only run once on mount
  useEffect(() => {
    if (categories.length === 0 && !categoriesLoading) {
      console.log("TurfDetailsModal: Loading categories...");
      dispatch(fetchCategories());
    }
  }, [dispatch]); // Only depend on dispatch to prevent infinite loops

  if (!turf) return null;

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

  // Helper function to safely render location
  const getLocationDisplay = () => {
    // First check if locationData exists (parsed location object)
    if (turf.locationData) {
      return turf.locationData;
    }

    // Fall back to location string - try to parse or use as is
    if (typeof turf.location === "string") {
      // If it's a string, return a default structure
      return {
        address: turf.location,
        city: "",
        state: "",
        zipCode: "",
      };
    }

    // Handle case where location is incorrectly an object (from turfSlice bug)
    if (turf.location && typeof turf.location === "object") {
      return turf.location as any;
    }

    // Default fallback
    return {
      address: "Location not specified",
      city: "",
      state: "",
      zipCode: "",
    };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const getDayName = (dayOfWeek: number) => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[dayOfWeek];
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const handleBookNow = () => {
    if (onBook) {
      onBook(turf);
    }
    onHide();
  };

  const modalHeader = (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
         <Badge
          value={getCategoryDisplayName(categoryName)}
          severity={getCategoryColor(categoryName)}
          className="text-xs font-medium"
        />
        <h2 className="text-xl font-bold text-gray-800 m-0">{turf.name}</h2>
      </div>
      <Button
        icon="pi pi-times"
        onClick={onHide}
        className=" !text-gray-700 hover:!bg-gray-50"
      />
    </div>
  );

  const modalFooter = (
    <div className="flex justify-between items-center py-2">
      <div className="text-2xl font-bold text-green-600">
        {formatCurrency(turf.pricing?.hourlyRate || turf.pricePerHour || 0)}
        <span className="text-sm font-normal text-gray-600 ml-1">/hour</span>
      </div>
      <div className="flex gap-3">
        <Button
          label="Close"
          icon="pi pi-times"
          outlined
          onClick={onHide}
          className="!border-gray-300 !text-gray-700 hover:!bg-gray-50"
        />
        <Button
          label="Book Now"
          icon="pi pi-calendar"
          onClick={handleBookNow}
          className="!bg-blue-500 !border-blue-500 hover:!bg-blue-600"
        />
      </div>
    </div>
  );

  return (
    <Dialog
      header={modalHeader}
      footer={modalFooter}
      visible={visible}
      onHide={onHide}
      style={{ width: "90vw", maxWidth: "900px", maxHeight: "90vh" }}
      modal
      className="p-fluid"
      draggable={false}
      resizable={false}
      closeOnEscape={true}
      dismissableMask={true}
      closable={false}
    >
      <div className="space-y-6">
        {/* Images Section */}
        <div className="relative">
          <img
            src={turfImage}
            alt={turf.name}
            className="w-full h-64 object-cover rounded-lg"
          />
        </div>

        {/* Location & Description */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <i className="pi pi-map-marker text-blue-500"></i>
              Location
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              {(() => {
                const locationData = getLocationDisplay();
                return (
                  <>
                    <p className="font-medium text-gray-800">
                      {locationData.address}
                    </p>
                    {(locationData.city || locationData.state || locationData.zipCode) && (
                      <p className="text-gray-600">
                        {[locationData.city, locationData.state, locationData.zipCode]
                          .filter(part => part && part.trim() !== "")
                          .join(", ")}
                      </p>
                    )}
                  </>
                );
              })()}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <i className="pi pi-info-circle text-blue-500"></i>
              Description
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 leading-relaxed">
                {turf.description}
              </p>
            </div>
          </div>
        </div>

        {/* Availability */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <i className="pi pi-clock text-blue-500"></i>
            Availability
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="space-y-2">
              {[
                { day: "Monday", dayNum: 1 },
                { day: "Tuesday", dayNum: 2 },
                { day: "Wednesday", dayNum: 3 },
                { day: "Thursday", dayNum: 4 },
                { day: "Friday", dayNum: 5 },
                { day: "Saturday", dayNum: 6 },
                { day: "Sunday", dayNum: 0 },
              ].map(({ day, dayNum }) => (
                <div
                  key={day}
                  className="flex justify-between items-center py-2 px-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-800 w-20">
                      {day}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-600 text-sm">
                      {turf.openTime && turf.closeTime
                        ? `${formatTime(turf.openTime)} - ${formatTime(turf.closeTime)}`
                        : "Hours not specified"}
                    </span>
                    <span className="text-green-600 font-semibold text-sm">
                      {formatCurrency(turf.pricing?.hourlyRate || turf.pricePerHour || 0)}/hr
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default TurfDetailsModal;
