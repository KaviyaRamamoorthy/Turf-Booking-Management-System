import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import React from "react";
import turfImage from "../../assets/turf.jpg";
import type { Turf } from "../../types";

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
  const getCategoryColor = (category: string) => {
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
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const getCategoryDisplayName = (category: string) => {
    switch (category.toLowerCase()) {
      case "football":
        return "Football";
      case "cricket":
        return "Cricket";
      case "tennis":
        return "Tennis";
      case "basketball":
        return "Basketball";
      case "volleyball":
        return "Multi-Sport";
      default:
        return category;
    }
  };

  const header = (
    <div className="relative">
      <img
        src={turfImage}
        alt={turf.name}
        className="w-full h-48 object-cover rounded-t-lg"
      />
      <div className="absolute top-3 left-3">
        <Badge
          value={getCategoryDisplayName(turf.category)}
          severity={getCategoryColor(turf.category)}
          className="text-xs font-medium"
        />
      </div>
      <div className="absolute top-3 right-3 bg-white rounded-full px-2 py-1 flex items-center gap-1">
        <i className="pi pi-star-fill text-yellow-500 text-sm"></i>
        <span className="text-sm font-medium">{turf.rating}</span>
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
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            {turf.name}
          </h3>
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <i className="pi pi-map-marker mr-1 text-gray-400"></i>
            <span>
              {turf.location.address}.
            </span>
          </div>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2">{turf.description}</p>

        <div className="flex items-center justify-between">
          <div className="text-lg font-bold text-green-600">
            {formatCurrency(turf.pricing.hourlyRate, turf.pricing.currency)}
            <span className="text-sm font-normal text-gray-600">/hour</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TurfCard;
