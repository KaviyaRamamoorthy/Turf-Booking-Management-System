import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import React, { useState } from "react";
import { bookingService } from "../../services/bookingService";
import type { Turf } from "../../types";
import "./TurfBookingModal.css";

interface TurfBookingModalProps {
  turf: Turf | null;
  visible: boolean;
  onHide: () => void;
  onConfirmBooking?: (
    turf: Turf,
    date: Date,
    timeSlot: string,
    bookingData?: any
  ) => void;
}

const TurfBookingModal: React.FC<TurfBookingModalProps> = ({
  turf,
  visible,
  onHide,
  onConfirmBooking,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  if (!turf) return null;

  // Generate available time slots (10 AM to 10 PM) with 1-hour gaps
  const timeSlots = [
    { time: "10:00 AM - 11:00 AM", value: "10:00-11:00", available: true },
    { time: "11:00 AM - 12:00 PM", value: "11:00-12:00", available: true },
    { time: "12:00 PM - 1:00 PM", value: "12:00-13:00", available: false },
    { time: "1:00 PM - 2:00 PM", value: "13:00-14:00", available: true },
    { time: "2:00 PM - 3:00 PM", value: "14:00-15:00", available: true },
    { time: "3:00 PM - 4:00 PM", value: "15:00-16:00", available: true },
    { time: "4:00 PM - 5:00 PM", value: "16:00-17:00", available: false },
    { time: "5:00 PM - 6:00 PM", value: "17:00-18:00", available: true },
    { time: "6:00 PM - 7:00 PM", value: "18:00-19:00", available: true },
    { time: "7:00 PM - 8:00 PM", value: "19:00-20:00", available: true },
    { time: "8:00 PM - 9:00 PM", value: "20:00-21:00", available: true },
    { time: "9:00 PM - 10:00 PM", value: "21:00-22:00", available: true },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const getMinDate = () => {
    return new Date(); // Today
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 2); // 2 days from today
    return maxDate;
  };

  const handleTimeSlotSelect = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot);
  };

  const handleConfirmBooking = async () => {
    if (!selectedTimeSlot) return;

    setIsLoading(true);

    try {
      // Parse the time slot to get start and end times
      const [startTime, endTime] = selectedTimeSlot.split("-");

      // Create booking request
      const bookingRequest = {
        turfId: turf.id,
        bookingDate: selectedDate.toISOString().split("T")[0], // YYYY-MM-DD format
        startTime: startTime,
        endTime: endTime,
      };

      // Call the booking service
      const response = await bookingService.createBooking(bookingRequest);

      if (response.success) {
        console.log("🚀 Booking API successful, calling parent callback", {
          turf: turf.name,
          date: selectedDate,
          timeSlot: selectedTimeSlot,
          responseData: response.data,
        });

        // Call parent callback with booking data
        if (onConfirmBooking) {
          onConfirmBooking(turf, selectedDate, selectedTimeSlot, response.data);
          console.log("✅ Parent callback called successfully");
        } else {
          console.warn("⚠️ No onConfirmBooking callback provided");
        }
        // Don't call onHide() here - let the parent handle modal switching
      } else {
        // Handle error - you can add error state here if needed
        console.error("Booking failed:", response.message);
      }
    } catch (error) {
      // Handle error
      console.error("Booking error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const modalHeader = (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-xl font-bold text-gray-800 m-0">
          Book {turf.name}
        </h2>
        <p className="text-gray-600 text-sm mt-1">Select date and time slot</p>
      </div>
      <Button
        icon="pi pi-times"
        onClick={onHide}
        className="p-button-rounded p-button-text !w-8 !h-8"
      />
    </div>
  );

  const modalFooter = (
    <div className="flex justify-between items-center py-2">
      <div className="text-lg font-bold text-green-600">
        Total: {formatCurrency(turf.pricing.hourlyRate)}
        <span className="text-sm font-normal text-gray-600 ml-1">
          for 1 hour
        </span>
      </div>
      <div className="flex gap-3">
        <Button
          label="Cancel"
          icon="pi pi-times"
          outlined
          onClick={onHide}
          className="!border-gray-300 !text-gray-700 hover:!bg-gray-50"
        />
        <Button
          label={isLoading ? "Processing..." : "Confirm Booking"}
          icon={isLoading ? "pi pi-spin pi-spinner" : "pi pi-check"}
          onClick={handleConfirmBooking}
          disabled={!selectedTimeSlot || isLoading}
          className="!bg-green-500 !border-green-500 hover:!bg-green-600 disabled:!bg-gray-300"
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
      style={{ width: "90vw", maxWidth: "700px" }}
      modal
      className="p-fluid"
      draggable={false}
      resizable={false}
      closeOnEscape={true}
      dismissableMask={true}
      closable={false}
    >
      <div className="space-y-6">
        {/* Date Selection */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <i className="pi pi-calendar text-blue-500"></i>
            Select Date
          </h3>
          <div className="calendar-small">
            <Calendar
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.value as Date)}
              minDate={getMinDate()}
              maxDate={getMaxDate()}
              inline
              className="w-full"
            />
          </div>
        </div>

        <Divider />

        {/* Time Slots */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <i className="pi pi-clock text-blue-500"></i>
            Available Time Slots
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {timeSlots.map((slot) => (
              <Button
                key={slot.value}
                label={slot.time}
                onClick={() => handleTimeSlotSelect(slot.value)}
                disabled={!slot.available}
                className={`!p-4 !text-sm !font-medium !rounded-lg !transition-all !text-center !min-h-12 ${
                  selectedTimeSlot === slot.value
                    ? "!bg-blue-500 !border-blue-500 !text-white"
                    : slot.available
                    ? "!bg-white !border-gray-300 !text-gray-700 hover:!bg-blue-50 hover:!border-blue-300"
                    : "!bg-gray-100 !border-gray-200 !text-gray-400 !cursor-not-allowed"
                }`}
              />
            ))}
          </div>
          <div className="mt-4 flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-gray-600">Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-white border-2 border-gray-300 rounded"></div>
              <span className="text-gray-600">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-100 border-2 border-gray-200 rounded"></div>
              <span className="text-gray-600">Booked</span>
            </div>
          </div>
        </div>

        {/* Booking Summary */}
        {selectedTimeSlot && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">
              Booking Summary
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-700">Turf:</span>
                <span className="font-medium text-gray-800">{turf.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Date:</span>
                <span className="font-medium text-gray-800">
                  {selectedDate.toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Time:</span>
                <span className="font-medium text-gray-800">
                  {timeSlots.find((s) => s.value === selectedTimeSlot)?.time}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Duration:</span>
                <span className="font-medium text-gray-800">1 hour</span>
              </div>
              <div className="flex justify-between font-semibold text-green-600">
                <span>Total:</span>
                <span>{formatCurrency(turf.pricing.hourlyRate)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
};

export default TurfBookingModal;
