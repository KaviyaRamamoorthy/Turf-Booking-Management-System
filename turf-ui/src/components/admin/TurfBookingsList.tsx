import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import { openModal } from "../../store/slices/uiSlice";
import { setSelectedBooking, fetchBookingDetails } from "../../store/slices/adminBookingSlice";
import type { RootState } from "../../types";
import type { AppDispatch } from "../../store";

const TurfBookingsList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { bookings, isLoading, total } = useSelector((state: RootState) => state.adminBooking);

  const handleRowClick = async (booking: any) => {
    try {
      await dispatch(fetchBookingDetails(booking.id)).unwrap();
      dispatch(setSelectedBooking(booking));
      dispatch(openModal("bookingDetails"));
    } catch (error) {
      console.error("Failed to fetch booking details:", error);
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
        <div className="text-gray-600 capitalize">{rowData.turf.category}</div>
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
          field="customer.firstName"
          header="Customer"
          sortable
          style={{ width: "200px" }}
          body={customerBodyTemplate}
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
          style={{ width: "80px" }}
          body={actionsBodyTemplate}
        />
      </DataTable>
    </div>
  );
};

export default TurfBookingsList; 