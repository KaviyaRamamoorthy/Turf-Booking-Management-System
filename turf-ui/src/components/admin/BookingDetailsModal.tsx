import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Dialog } from "primereact/dialog";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../store";
import { confirmBooking, rejectBooking, setSelectedBooking } from "../../store/slices/adminBookingSlice";
import { addToast, closeModal } from "../../store/slices/uiSlice";
import type { RootState } from "../../types";
import RejectionReasonModal from "./RejectionReasonModal";

interface BookingDetailsModalProps {
  visible: boolean;
  onHide: () => void;
}

const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({
  visible,
  onHide,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedBooking, isLoading } = useSelector((state: RootState) => state.adminBooking);
  const [showRejectionModal, setShowRejectionModal] = useState(false);

  const handleClose = () => {
    dispatch(closeModal("bookingDetails"));
    dispatch(setSelectedBooking(null));
    onHide();
  };

  const handleConfirmBooking = async () => {
    if (!selectedBooking) return;

    confirmDialog({
      message: `Are you sure you want to confirm this booking for ${selectedBooking.customer.firstName} ${selectedBooking.customer.lastName}?`,
      header: "Confirm Booking",
      icon: "pi pi-check-circle",
      acceptClassName: "p-button-success submit-button",
      rejectClassName: "p-button-danger cancel-button",
      accept: async () => {
        try {
          await dispatch(confirmBooking(selectedBooking.id)).unwrap();
          dispatch(
            addToast({
              type: "success",
              title: "Success",
              message: "Booking confirmed successfully",
            })
          );
        } catch (error) {
          dispatch(
            addToast({
              type: "error",
              title: "Error",
              message: error instanceof Error ? error.message : "Failed to confirm booking",
            })
          );
        }
      },
    });
  };

  const handleRejectBooking = () => {
    setShowRejectionModal(true);
  };

  const handleRejectionConfirm = async (reason: string) => {
    if (!selectedBooking) return;

    try {
      await dispatch(rejectBooking({ bookingId: selectedBooking.id, reason })).unwrap();
      setShowRejectionModal(false);
      dispatch(
        addToast({
          type: "success",
          title: "Success",
          message: "Booking rejected successfully",
        })
      );
    } catch (error) {
      dispatch(
        addToast({
          type: "error",
          title: "Error",
          message: error instanceof Error ? error.message : "Failed to reject booking",
        })
      );
    }
  };

  const getStatusSeverity = (status: string) => {
    switch (status) {
      case "confirmed":
        return "success";
      case "pending":
        return "warning";
      case "cancelled":
        return "danger";
      case "completed":
        return "info";
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (!selectedBooking) {
    return null;
  }

  const renderFooter = () => {
    const isPending = selectedBooking?.status === "pending";
    
    return (
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {isPending && (
            <span className="flex items-center">
              <i className="pi pi-clock mr-1"></i>
              Awaiting admin approval
            </span>
          )}
        </div>
        <div className="flex gap-2">
          {isPending && (
            <>
              <Button
                label="Reject"
                icon="pi pi-times"
                className="p-button-danger cancel-button"
                onClick={handleRejectBooking}
                disabled={isLoading}
              />
              <Button
                label="Confirm"
                icon="pi pi-check"
                className="p-button-success submit-button"
                onClick={handleConfirmBooking}
                disabled={isLoading}
              />
            </>
          )}
          <Button
            label="Close"
            icon="pi pi-times"
            className="p-button-text"
            onClick={handleClose}
            disabled={isLoading}
          />
        </div>
      </div>
    );
  };

  return (
    <Dialog
      visible={visible}
      onHide={handleClose}
      header="Booking Details"
      footer={renderFooter()}
      className="w-full max-w-2xl"
      modal
      closeOnEscape
      closeIcon="pi pi-times"
      closable
    >
      <div className="space-y-6">
        {/* Booking Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Booking #{selectedBooking.bookingReference}
            </h3>
            <p className="text-sm text-gray-600">
              Created on {formatDate(selectedBooking.createdAt)}
            </p>
          </div>
          <Badge
            value={selectedBooking.status}
            severity={getStatusSeverity(selectedBooking.status)}
            className="capitalize"
          />
        </div>

        {/* Booking Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Slot Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
              <i className="pi pi-calendar mr-2"></i>
              Slot Information
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">
                  {formatDate(selectedBooking.bookingDate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium">
                  {formatTime(selectedBooking.startTime)} - {formatTime(selectedBooking.endTime)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">
                  {Math.round(
                    (new Date(`2000-01-01T${selectedBooking.endTime}`).getTime() -
                      new Date(`2000-01-01T${selectedBooking.startTime}`).getTime()) /
                      (1000 * 60 * 60)
                  )} hour(s)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-bold text-green-600">
                  {formatCurrency(selectedBooking.totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Turf Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
              <i className="pi pi-map-marker mr-2"></i>
              Turf Information
            </h4>
            <div className="space-y-2">
              <div>
                <span className="text-gray-600">Name:</span>
                <p className="font-medium">{selectedBooking.turf.name}</p>
              </div>
              <div>
                <span className="text-gray-600">Category:</span>
                <p className="font-medium capitalize">{typeof selectedBooking.turf.category === 'string' ? selectedBooking.turf.category : selectedBooking.turf.category?.name}</p>
              </div>
              <div>
                <span className="text-gray-600">Location:</span>
                <p className="font-medium">
                  {selectedBooking.turf.location.address}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedBooking.turf.location.city}, {selectedBooking.turf.location.state} - {selectedBooking.turf.location.zipCode}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
            <i className="pi pi-user mr-2"></i>
            Customer Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-gray-600">Name:</span>
              <p className="font-medium">
                {selectedBooking.customer.firstName} {selectedBooking.customer.lastName}
              </p>
            </div>
            <div>
              <span className="text-gray-600">Email:</span>
              <p className="font-medium">{selectedBooking.customer.email}</p>
            </div>
            <div>
              <span className="text-gray-600">Phone:</span>
              <p className="font-medium">{selectedBooking.customer.phone}</p>
            </div>
            <div>
              <span className="text-gray-600">Customer ID:</span>
              <p className="font-medium text-sm">{selectedBooking.customer.id}</p>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
            <i className="pi pi-info-circle mr-2"></i>
            Additional Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-gray-600">Booking ID:</span>
              <p className="font-medium text-sm">{selectedBooking.id}</p>
            </div>
            <div>
              <span className="text-gray-600">Last Updated:</span>
              <p className="font-medium text-sm">
                {formatDate(selectedBooking.updatedAt)}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Rejection Reason Modal */}
      <RejectionReasonModal
        visible={showRejectionModal}
        onHide={() => setShowRejectionModal(false)}
        onConfirm={handleRejectionConfirm}
        isLoading={isLoading}
      />
      
      {/* Confirm Dialog */}
      <ConfirmDialog />
    </Dialog>
  );
};

export default BookingDetailsModal; 