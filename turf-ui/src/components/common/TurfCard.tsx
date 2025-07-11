import React from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Badge } from "primereact/badge";
import { Rating } from "primereact/rating";
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
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const header = (
    <div className="relative">
      <img
        src={
          turf.images[0] ||
          "https://via.placeholder.com/400x250/4CAF50/FFFFFF?text=Turf+Image"
        }
        alt={turf.name}
        className="w-full h-48 object-cover"
      />
      <div className="absolute top-2 right-2">
        <Badge
          value={turf.category}
          severity={getCategoryColor(turf.category)}
          className="capitalize"
        />
      </div>
    </div>
  );

  const footer = (
    <div className="flex justify-between items-center pt-2">
      <div className="flex items-center gap-2">
        <Rating
          value={turf.rating}
          readOnly
          cancel={false}
          className="text-sm"
        />
        <span className="text-sm text-gray-600">({turf.reviewCount})</span>
      </div>
      <div className="flex gap-2">
        <Button
          label="View Details"
          size="small"
          outlined
          onClick={() => onViewDetails?.(turf)}
        />
        {showBookButton && (
          <Button
            label="Book Now"
            size="small"
            onClick={() => onBook?.(turf)}
          />
        )}
      </div>
    </div>
  );

  return (
    <Card
      header={header}
      footer={footer}
      className="shadow-md hover:shadow-lg transition-shadow duration-200 h-full"
    >
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">
          {turf.name}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2">{turf.description}</p>

        <div className="flex items-center text-sm text-gray-600">
          <i className="pi pi-map-marker mr-1"></i>
          <span>
            {turf.location.city}, {turf.location.state}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-lg font-bold text-green-600">
            {formatCurrency(turf.pricing.hourlyRate, turf.pricing.currency)}
            <span className="text-sm font-normal text-gray-600">/hour</span>
          </div>

          {turf.amenities.length > 0 && (
            <div className="flex items-center text-sm text-gray-600">
              <i className="pi pi-check-circle mr-1"></i>
              <span>{turf.amenities.length} amenities</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default TurfCard;
