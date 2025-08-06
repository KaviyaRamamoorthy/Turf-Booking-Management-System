import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import React, { useState, useEffect, useMemo } from "react";
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
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Generate dynamic time slots based on turf's open/close times
  const timeSlots = useMemo(() => {
    if (!turf?.openTime || !turf?.closeTime) {
      // Fallback to default hours if not available
      return [];
    }

    const slots = [];
    const openHour = parseInt(turf.openTime.split(':')[0]);
    const closeHour = parseInt(turf.closeTime.split(':')[0]);
    
    // Check if selected date is today
    const today = new Date();
    const isToday = selectedDate.toDateString() === today.toDateString();
    const currentHour = today.getHours();
    const currentMinute = today.getMinutes();

    for (let hour = openHour; hour < closeHour; hour++) {
      const startTime = `${hour.toString().padStart(2, '0')}:00`;
      const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
      const slotValue = `${startTime}-${endTime}`;
      
      // Check if this slot has already passed (only for today)
      let isPastSlot = false;
      if (isToday) {
        // Add a 15-minute buffer - if we're within 15 minutes of a slot, consider it unavailable
        // This gives users reasonable time to complete the booking process
        const bufferMinutes = 15;
        
        // Calculate minutes until the slot starts
        const slotStartTimeInMinutes = hour * 60; // Convert hour to minutes (e.g., 15:00 = 900 minutes)
        const currentTimeInMinutes = currentHour * 60 + currentMinute; // Current time in minutes
        const minutesUntilSlot = slotStartTimeInMinutes - currentTimeInMinutes;
        
        // If slot has passed or is within buffer time, mark as unavailable
        isPastSlot = minutesUntilSlot < bufferMinutes;
      }

      // Skip past slots for today
      if (isPastSlot) {
        continue;
      }
      
      // Format for display
      const startFormatted = formatTime(startTime + ':00');
      const endFormatted = formatTime(endTime + ':00');
      const displayTime = `${startFormatted} - ${endFormatted}`;

      slots.push({
        time: displayTime,
        value: slotValue,
        available: !bookedSlots.includes(slotValue)
      });
    }

    return slots;
  }, [turf?.openTime, turf?.closeTime, bookedSlots, selectedDate]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  // Check availability when date changes
  useEffect(() => {
    const checkAvailability = async () => {
      if (!turf?.id) return;
      
      try {
        setAvailabilityLoading(true);
        const dateStr = selectedDate.toISOString().split('T')[0];
        
        // Use the booking service to check availability
        const bookedSlots = await bookingService.checkAvailability(turf.id, dateStr);
        setBookedSlots(bookedSlots);
        
        console.log('📅 Availability checked for date:', dateStr, 'Booked slots:', bookedSlots);
      } catch (error) {
        console.error('❌ Failed to check availability:', error);
        // If API fails, assume no slots are booked to avoid blocking users
        setBookedSlots([]);
        console.log('⚠️ API failed, assuming all slots are available');
      } finally {
        setAvailabilityLoading(false);
      }
    };

    if (selectedDate && turf?.id && visible) {
      checkAvailability();
    }
  }, [selectedDate, turf?.id, visible]);

  // Clear selected time slot if it becomes invalid (for today's date)
  useEffect(() => {
    if (selectedTimeSlot) {
      const slotExists = timeSlots.some(slot => slot.value === selectedTimeSlot);
      if (!slotExists) {
        console.log('🕒 Clearing invalid time slot:', selectedTimeSlot);
        setSelectedTimeSlot("");
      }
    }
  }, [timeSlots, selectedTimeSlot]);

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
    if (!selectedTimeSlot || !turf?.id) {
      console.warn("No time slot selected or turf not available");
      return;
    }

    setIsLoading(true);

    try {
      // Parse the time slot to get start and end times
      const [startTime, endTime] = selectedTimeSlot.split("-");

      // Create booking request with proper time format (HH:MM:SS)
      const bookingRequest = {
        turfId: turf.id,
        bookingDate: selectedDate.toISOString().split("T")[0], // YYYY-MM-DD format
        startTime: startTime + ":00", // Convert HH:MM to HH:MM:SS
        endTime: endTime + ":00", // Convert HH:MM to HH:MM:SS
      };

      console.log("📤 Creating booking request:", bookingRequest);

      // Call the booking service
      const response = await bookingService.createBooking(bookingRequest);

      if (response.success) {
        console.log("🚀 Booking created successfully:", {
          turf: turf.name,
          date: selectedDate.toLocaleDateString(),
          timeSlot: selectedTimeSlot,
          responseData: response.data,
        });

        // Update booked slots to reflect the new booking
        setBookedSlots(prev => [...prev, selectedTimeSlot]);
        
        // Reset selected time slot
        setSelectedTimeSlot("");

        // Show success message
        const successMessage = `🎉 Booking Confirmed!\n\nTurf: ${turf.name}\nDate: ${selectedDate.toLocaleDateString()}\nTime: ${timeSlots.find(s => s.value === selectedTimeSlot)?.time}\n\nBooking ID: ${response.data.id}\nStatus: ${response.data.status}`;
        
        // alert(successMessage);

        // Call parent callback with booking data
        if (onConfirmBooking) {
          onConfirmBooking(turf, selectedDate, selectedTimeSlot, response.data);
          console.log("✅ Parent callback called successfully");
        } else {
          console.warn("⚠️ No onConfirmBooking callback provided");
        }
        // Don't call onHide() here - let the parent handle modal switching
      } else {
        // Handle API error
        console.error("❌ Booking failed:", response.message);
        alert(`❌ Booking Failed\n\n${response.message}\n\nPlease try again or contact support if the issue persists.`);
      }
    } catch (error: any) {
      // Handle network/system error
      console.error("💥 Booking error:", error);
      const errorMessage = error.message || "An unexpected error occurred while creating the booking";
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Early return if turf is not available
  if (!turf) return null;

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
        Total: {formatCurrency(turf.pricing?.hourlyRate || turf.pricePerHour || 0)}
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
          className="!bg-green-500 !border-green-500 hover:!bg-green-600 disabled:!bg-green-400"
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
            {availabilityLoading && (
              <i className="pi pi-spin pi-spinner text-blue-500 text-sm"></i>
            )}
          </h3>
          
          {(() => {
            const today = new Date();
            const isToday = selectedDate.toDateString() === today.toDateString();
            
            if (isToday) {
              const currentTime = today.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              });
              
              return (
                <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-700 text-sm">
                    <i className="pi pi-info-circle"></i>
                    <span>
                      Current time: <strong>{currentTime}</strong> - Slots starting within 15 minutes are not available
                    </span>
                  </div>
                </div>
              );
            }
            return null;
          })()}
          
          {availabilityLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="h-12 bg-gray-200 rounded-lg animate-pulse"
                ></div>
              ))}
            </div>
          ) : timeSlots.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              <i className="pi pi-clock text-4xl text-gray-400 mb-3"></i>
              {(() => {
                const today = new Date();
                const isToday = selectedDate.toDateString() === today.toDateString();
                
                if (isToday) {
                  return (
                    <>
                      <p className="font-medium">No more slots available today</p>
                      <p className="text-sm">All time slots for today have passed.</p>
                      <p className="text-sm text-blue-600 mt-2">
                        Try selecting tomorrow or a future date.
                      </p>
                    </>
                  );
                } else {
                  return (
                    <>
                      <p>No time slots available</p>
                      <p className="text-sm">Please check the turf operating hours</p>
                    </>
                  );
                }
              })()}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {timeSlots.map((slot) => (
                <Button
                  key={slot.value}
                  label={slot.time}
                  onClick={() => handleTimeSlotSelect(slot.value)}
                  disabled={!slot.available || availabilityLoading}
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
          )}
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
                <span>{formatCurrency(turf.pricing?.hourlyRate || turf.pricePerHour || 0)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
};

export default TurfBookingModal;
