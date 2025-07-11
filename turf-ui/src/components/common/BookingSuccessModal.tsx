import React from "react";
import { useNavigate } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import type { Turf } from "../../types";

interface BookingSuccessModalProps {
  visible: boolean;
  onHide: () => void;
  turf: Turf | null;
  bookingDetails: {
    date: Date;
    timeSlot: string;
    bookingId?: string;
    totalAmount?: number;
  } | null;
}

const BookingSuccessModal: React.FC<BookingSuccessModalProps> = ({
  visible,
  onHide,
  turf,
  bookingDetails,
}) => {
  const navigate = useNavigate();

  if (!turf || !bookingDetails) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const getTimeSlotDisplay = (timeSlot: string) => {
    const timeSlots = [
      { time: "10:00 AM - 11:00 AM", value: "10:00-11:00" },
      { time: "11:00 AM - 12:00 PM", value: "11:00-12:00" },
      { time: "12:00 PM - 1:00 PM", value: "12:00-13:00" },
      { time: "1:00 PM - 2:00 PM", value: "13:00-14:00" },
      { time: "2:00 PM - 3:00 PM", value: "14:00-15:00" },
      { time: "3:00 PM - 4:00 PM", value: "15:00-16:00" },
      { time: "4:00 PM - 5:00 PM", value: "16:00-17:00" },
      { time: "5:00 PM - 6:00 PM", value: "17:00-18:00" },
      { time: "6:00 PM - 7:00 PM", value: "18:00-19:00" },
      { time: "7:00 PM - 8:00 PM", value: "19:00-20:00" },
      { time: "8:00 PM - 9:00 PM", value: "20:00-21:00" },
      { time: "9:00 PM - 10:00 PM", value: "21:00-22:00" },
    ];
    return timeSlots.find((slot) => slot.value === timeSlot)?.time || timeSlot;
  };

  const modalHeader = (
    <div className="relative">
      <div className="text-center">
        <div className="mb-3">
          <i className="pi pi-check-circle text-6xl text-green-500"></i>
        </div>
        <h2 className="text-2xl font-bold text-green-600 m-0">
          Booking Confirmed!
        </h2>
        <p className="text-gray-600 text-sm mt-2">
          Your turf booking has been successfully confirmed
        </p>
      </div>
      <Button
        icon="pi pi-times"
        onClick={onHide}
        className="p-button-rounded p-button-text !w-8 !h-8 !absolute !top-0 !right-0 !text-gray-500 hover:!text-gray-700 hover:!bg-gray-100"
        tooltip="Close"
        tooltipOptions={{ position: "left" }}
      />
    </div>
  );

  const modalFooter = (
    <div className="flex justify-center mt-5">
      <Button
        label="View My Bookings"
        icon="pi pi-calendar"
        onClick={() => {
          navigate("/bookings");
          onHide();
        }}
        className="!bg-blue-500 !border-blue-500 hover:!bg-blue-600"
      />
    </div>
  );

  return (
    <Dialog
      header={modalHeader}
      footer={modalFooter}
      visible={visible}
      onHide={onHide}
      style={{ width: "90vw", maxWidth: "500px" }}
      modal
      className="p-fluid"
      draggable={false}
      resizable={false}
      closeOnEscape={true}
      dismissableMask={true}
      closable={false}
    >
      <div className="space-y-6">
        {/* Booking Details Card */}
        <Card className="!shadow-sm !border !border-green-200 !bg-green-50">
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                Booking Details
              </h3>
              {bookingDetails.bookingId && (
                <div className="text-sm text-green-600 mb-3">
                  Booking ID:{" "}
                  <span className="font-mono font-semibold">
                    {bookingDetails.bookingId}
                  </span>
                </div>
              )}
            </div>

            <div className="grid gap-3">
              <div className="flex justify-between items-center py-2 border-b border-green-200 last:border-b-0">
                <span className="text-green-700 font-medium">Turf:</span>
                <span className="text-green-800 font-semibold">
                  {turf.name}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-green-200 last:border-b-0">
                <span className="text-green-700 font-medium">Location:</span>
                <span className="text-green-800">
                  {turf.location.city}, {turf.location.state}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-green-200 last:border-b-0">
                <span className="text-green-700 font-medium">Date:</span>
                <span className="text-green-800 font-semibold">
                  {bookingDetails.date.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-green-200 last:border-b-0">
                <span className="text-green-700 font-medium">Time:</span>
                <span className="text-green-800 font-semibold">
                  {getTimeSlotDisplay(bookingDetails.timeSlot)}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-green-200 last:border-b-0">
                <span className="text-green-700 font-medium">Duration:</span>
                <span className="text-green-800">1 hour</span>
              </div>

              <div className="flex justify-between items-center py-2 bg-green-100 px-3 rounded-lg">
                <span className="text-green-700 font-semibold">
                  Total Amount:
                </span>
                <span className="text-green-800 font-bold text-lg">
                  {formatCurrency(
                    bookingDetails.totalAmount || turf.pricing.hourlyRate
                  )}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Dialog>
  );
};

export default BookingSuccessModal;
