import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";

interface RejectionReasonModalProps {
  visible: boolean;
  onHide: () => void;
  onConfirm: (reason: string) => void;
  isLoading?: boolean;
}

const RejectionReasonModal: React.FC<RejectionReasonModalProps> = ({
  visible,
  onHide,
  onConfirm,
  isLoading = false,
}) => {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    if (reason.trim()) {
      onConfirm(reason.trim());
      setReason("");
    }
  };

  const handleClose = () => {
    setReason("");
    onHide();
  };

  const footer = (
    <div className="flex justify-end gap-2">
      <Button
        label="Cancel"
        icon="pi pi-times"
        className="p-button-text"
        onClick={handleClose}
        disabled={isLoading}
      />
      <Button
        label="Reject Booking"
        icon="pi pi-times"
        className="p-button-danger"
        onClick={handleConfirm}
        loading={isLoading}
        disabled={!reason.trim()}
      />
    </div>
  );

  return (
    <Dialog
      visible={visible}
      onHide={handleClose}
      header="Reject Booking"
      footer={footer}
      className="w-full max-w-md"
      modal
      closeOnEscape={!isLoading}
      closeIcon="pi pi-times"
      closable={!isLoading}
    >
      <div className="space-y-4">
        <p className="text-gray-700">
          Please provide a reason for rejecting this booking. This will help the customer understand why their booking was not approved.
        </p>
        
        <div className="field">
          <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
            Rejection Reason <span className="text-red-500">*</span>
          </label>
          <InputTextarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter the reason for rejection..."
            rows={4}
            className="w-full"
            autoFocus
          />
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="flex items-start">
            <i className="pi pi-exclamation-triangle text-yellow-600 mt-0.5 mr-2"></i>
            <div className="text-sm text-yellow-800">
              <p className="font-medium">Important:</p>
              <p>Rejecting a booking will notify the customer and may affect their future bookings.</p>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default RejectionReasonModal; 