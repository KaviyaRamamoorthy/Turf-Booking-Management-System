import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Toast } from "primereact/toast";
import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../store";
import { 
  fetchBookingDetails, 
  setSelectedBooking, 
  confirmBooking, 
  rejectBooking,
  fetchStatusCounts
} from "../../store/slices/adminBookingSlice";
import { openModal } from "../../store/slices/uiSlice";
import type { RootState } from "../../types";

const TurfBookingsList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { bookings, isLoading, total, error } = useSelector(
    (state: RootState) => state.adminBooking
  );

  const [actionLoading, setActionLoading] = useState<{ [key: string]: string }>(
    {}
  );
  const toast = useRef<Toast>(null);

  const handleRowClick = async (booking: any) => {
    try {
      await dispatch(fetchBookingDetails(booking.id)).unwrap();
      dispatch(setSelectedBooking(booking));
      dispatch(openModal("bookingDetails"));
    } catch (error) {
      console.error("Failed to fetch booking details:", error);
    }
  };

  const handleConfirmBooking = async (
    bookingId: string,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    setActionLoading((prev) => ({ ...prev, [bookingId]: "confirming" }));

    try {
      await dispatch(confirmBooking(bookingId)).unwrap();
      // dispatch(fetchStatusCounts()); // Refresh status counts after confirming
      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Booking confirmed successfully",
        life: 3000,
      });
      console.log("✅ Booking confirmed successfully");
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to confirm booking",
        life: 3000,
      });
      console.error("❌ Failed to confirm booking:", error);
    } finally {
      setActionLoading((prev) => {
        const newState = { ...prev };
        delete newState[bookingId];
        return newState;
      });
    }
  };

  const handleDeclineBooking = async (
    bookingId: string,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    setActionLoading((prev) => ({ ...prev, [bookingId]: "declining" }));

    try {
      await dispatch(
        rejectBooking({ bookingId, reason: "Declined by admin" })
      ).unwrap();
      // dispatch(fetchStatusCounts()); // Refresh status counts after declining
      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Booking declined successfully",
        life: 3000,
      });
      console.log("✅ Booking declined successfully");
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to decline booking",
        life: 3000,
      });
      console.error("❌ Failed to decline booking:", error);
    } finally {
      setActionLoading((prev) => {
        const newState = { ...prev };
        delete newState[bookingId];
        return newState;
      });
    }
  };

  const getStatusSeverity = (status: string) => {
    switch (status?.toLowerCase()) {
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
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDateTime = (dateString: string, timeString: string) => {
    const date = new Date(dateString);
    const time = new Date(`2000-01-01T${timeString}`);

    return `${date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    })} at ${time.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })}`;
  };

  const statusBodyTemplate = (rowData: any) => {
    return (
      <Badge
        value={rowData.status}
        severity={getStatusSeverity(rowData.status)}
        className="capitalize"
      />
    );
  };

  const slotTimeBodyTemplate = (rowData: any) => {
    return (
      <div className="text-sm">
        <div className="font-medium">{formatDate(rowData.bookingDate)}</div>
        <div className="text-gray-600">
          {formatTime(rowData.startTime)} - {formatTime(rowData.endTime)}
        </div>
      </div>
    );
  };

  const turfBodyTemplate = (rowData: any) => {
    return (
      <div className="text-sm">
        <div className="font-medium">{rowData.turf.name}</div>
        <div className="text-gray-600 capitalize">
          {rowData.turf.category}
        </div>
      </div>
    );
  };

  const customerBodyTemplate = (rowData: any) => {
    return (
      <div className="text-sm">
        <div className="font-medium">
          {rowData.customer.firstName} {rowData.customer.lastName}
        </div>
        <div className="text-gray-600">{rowData.customer.email}</div>
        <div className="text-gray-500 text-xs">{rowData.customer.phone}</div>
      </div>
    );
  };

  const amountBodyTemplate = (rowData: any) => {
    return (
      <div className="font-semibold text-green-600">
        {formatCurrency(rowData.totalAmount)}
      </div>
    );
  };

  const actionsBodyTemplate = (rowData: any) => {
    const isPending = rowData.status?.toLowerCase() === "pending";
    const isLoading = actionLoading[rowData.id];

    if (isPending) {
      return (
        <div className="flex gap-1">
            <Button
            icon="pi pi-check"
            size="small"
            className="!bg-green-500 !border-green-500 hover:!bg-green-600 disabled:!bg-green-400"
            onClick={(e) => handleConfirmBooking(rowData.id, e)}
            tooltip="Confirm"
            loading={isLoading === "confirming"}
            disabled={!!isLoading}
          />
          <Button
            icon="pi pi-times"
            size="small"
            className="!bg-red-500 !border-red-500 hover:!bg-red-600 disabled:!bg-red-400"
            onClick={(e) => handleDeclineBooking(rowData.id, e)}
            tooltip="Decline"
            loading={isLoading === "declining"}
            disabled={!!isLoading}
          />
        </div>
      );
    }

    return (
      <Button
        icon="pi pi-eye"
        size="small"
        outlined
        onClick={(e) => {
          e.stopPropagation();
          handleRowClick(rowData);
        }}
        tooltip="View Details"
      />
    );
  };

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-red-200 p-12 text-center">
        <div className="text-red-400 mb-4">
          <i className="pi pi-times-circle text-6xl"></i>
        </div>
        <h3 className="text-xl font-semibold text-red-800 mb-2">
          Failed to Fetch Bookings
        </h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (bookings.length === 0 && !isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <div className="text-gray-400 mb-4">
          <i className="pi pi-calendar text-6xl"></i>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          No Bookings Found
        </h3>
        <p className="text-gray-600">
          There are no bookings matching your current filters.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <Toast ref={toast} />
      <DataTable
        value={bookings}
        loading={isLoading}
        paginator
        rows={10}
        rowsPerPageOptions={[10, 20, 50]}
        totalRecords={total}
        className="p-datatable-sm"
        rowHover
        onRowClick={(e) => handleRowClick(e.data)}
        emptyMessage="No bookings found"
        showGridlines
      >
        <Column
          field="bookingReference"
          header="Booking ID"
          sortable
          style={{ width: "120px" }}
          body={(rowData) => (
            <div className="text-sm font-mono text-gray-600">
              #{rowData.bookingReference}
            </div>
          )}
        />
        <Column
          field="bookingDate"
          header="Slot Time"
          sortable
          style={{ width: "150px" }}
          body={slotTimeBodyTemplate}
        />
        <Column
          field="turf.name"
          header="Turf"
          sortable
          style={{ width: "200px" }}
          body={turfBodyTemplate}
        />
        <Column
          field="totalAmount"
          header="Amount"
          sortable
          style={{ width: "120px" }}
          body={amountBodyTemplate}
        />
        <Column
          field="status"
          header="Status"
          sortable
          style={{ width: "120px" }}
          body={statusBodyTemplate}
        />
        <Column
          header="Actions"
          style={{ width: "120px" }}
          body={actionsBodyTemplate}
        />
      </DataTable>
    </div>
  );
};

export default TurfBookingsList; 