import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Badge } from "primereact/badge";
import { Rating } from "primereact/rating";
import { Divider } from "primereact/divider";
import { Chip } from "primereact/chip";
import { Tag } from "primereact/tag";
import type { Turf } from "../../types";
import turfImage from "../../assets/turf.jpg";

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
  if (!turf) return null;

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
          value={turf.category.toUpperCase()}
          severity={getCategoryColor(turf.category)}
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
        {formatCurrency(turf.pricing.hourlyRate)}
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
          <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 flex items-center gap-2 shadow-lg">
            <i className="pi pi-star-fill text-yellow-500"></i>
            <span className="font-semibold">{turf.rating}</span>
            <span className="text-sm text-gray-600">
              ({turf.reviewCount} reviews)
            </span>
          </div>
        </div>

        {/* Location & Description */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <i className="pi pi-map-marker text-blue-500"></i>
              Location
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-medium text-gray-800">
                {turf.location.address}
              </p>
              <p className="text-gray-600">
                {turf.location.city}, {turf.location.state} -{" "}
                {turf.location.zipCode}
              </p>
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

        {/* Amenities */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <i className="pi pi-cog text-blue-500"></i>
            Amenities
          </h3>
          <div className="flex flex-wrap gap-2">
            {turf.amenities.map((amenity) => (
              <Chip
                key={amenity.id}
                label={amenity.name}
                icon={amenity.icon}
                className="!bg-blue-100 !text-blue-800"
              />
            ))}
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
                      10:00 AM - 10:00 PM
                    </span>
                    <span className="text-green-600 font-semibold text-sm">
                      {formatCurrency(turf.pricing.hourlyRate)}/hr
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
