import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Badge } from "primereact/badge";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { ProgressSpinner } from "primereact/progressspinner";
import { Message } from "primereact/message";
import { Tag } from "primereact/tag";
import { Divider } from "primereact/divider";
import type { RootState } from "../types";
import type { AppDispatch } from "../store";
import {
  fetchBookings,
  setFilters,
  clearFilters,
  cancelBooking,
} from "../store/slices/bookingSlice";

const MyBookingsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { bookings, isLoading, error, filters } = useSelector(
    (state: RootState) => state.booking
  );
  const { user } = useSelector((state: RootState) => state.auth);

  // Local state for filtering and details modal
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<Date | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Status options for filter dropdown (matching backend values)
  const statusOptions = [
    { label: "All Bookings", value: "" },
    { label: "Pending", value: "PENDING" },
    { label: "Confirmed", value: "CONFIRMED" },
    { label: "Cancelled", value: "CANCELLED" },
    { label: "Completed", value: "COMPLETED" },
  ];

  useEffect(() => {
    // Fetch bookings when component mounts
    loadBookings();
  }, [dispatch]);

  useEffect(() => {
    // Reload bookings when filters change
    loadBookings();
  }, [statusFilter, dateFilter]);

  const loadBookings = async () => {
    try {
      console.log("🔄 Loading user bookings...");
      
      // Build filters for API call
      const apiFilters: any = {};
      if (statusFilter) apiFilters.status = statusFilter;
      if (dateFilter) {
        const dateStr = dateFilter.toISOString().split('T')[0];
        apiFilters.startDate = dateStr;
        apiFilters.endDate = dateStr;
      }
      
      dispatch(fetchBookings(apiFilters));
    } catch (error) {
      console.error("Error loading bookings:", error);
    }
  };

  // Filter bookings based on current filters
  const filteredBookings = bookings.filter((booking) => {
    if (statusFilter && booking.status !== statusFilter) {
      return false;
    }
    if (dateFilter) {
      const bookingDate = new Date(booking.bookingDate);
      const filterDate = new Date(dateFilter);
      if (bookingDate.toDateString() !== filterDate.toDateString()) {
        return false;
      }
    }
    return true;
  });

  // Group bookings by upcoming and past
  const now = new Date();
  const upcomingBookings = filteredBookings.filter(
    (booking) => new Date(booking.bookingDate) >= now
  );
  const pastBookings = filteredBookings.filter(
    (booking) => new Date(booking.bookingDate) < now
  );

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
        return "secondary";
    }
  };

  const statusBodyTemplate = (rowData: any) => {
    return (
      <Tag
        value={rowData.status.toUpperCase()}
        severity={getStatusSeverity(rowData.status)}
      />
    );
  };

  const dateBodyTemplate = (rowData: any) => {
    const date = new Date(rowData.bookingDate);
    return (
      <div>
        <div className="font-medium">
          {date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}
        </div>
        <div className="text-sm text-gray-600">{date.getFullYear()}</div>
      </div>
    );
  };

  const timeBodyTemplate = (rowData: any) => {
    // Handle time format from backend (HH:MM:SS) and show as HH:MM
    const startTime = rowData.startTime?.substring(0, 5) || "N/A";
    const endTime = rowData.endTime?.substring(0, 5) || "N/A";
    return (
      <div className="font-medium">{`${startTime} - ${endTime}`}</div>
    );
  };

  const turfBodyTemplate = (rowData: any) => {
    return (
      <div>
        <div className="font-medium">{rowData.turfName || "Unknown Turf"}</div>
        {rowData.turfLocation && (
          <div className="text-sm text-gray-600">{rowData.turfLocation}</div>
        )}
        {rowData.categoryName && (
          <div className="text-xs text-blue-600">{rowData.categoryName}</div>
        )}
      </div>
    );
  };

  const amountBodyTemplate = (rowData: any) => {
    return (
      <div className="font-medium text-green-600">
        ₹{rowData.totalAmount?.toLocaleString() || 0}
      </div>
    );
  };

  const actionBodyTemplate = (rowData: any) => {
    const canCancel = rowData.status === "PENDING" || rowData.status === "CONFIRMED";
    const isPast = new Date(rowData.bookingDate) < new Date();
    
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-eye"
          className="p-button-rounded p-button-text p-button-sm"
          onClick={() => handleViewDetails(rowData)}
          tooltip="View Details"
          tooltipOptions={{ position: "top" }}
        />
        {canCancel && !isPast && (
          <Button
            icon="pi pi-times"
            className="p-button-rounded p-button-text p-button-sm p-button-danger"
            onClick={() => handleCancelBooking(rowData)}
            tooltip="Cancel Booking"
            tooltipOptions={{ position: "top" }}
            loading={actionLoading === rowData.id}
            disabled={actionLoading !== null}
          />
        )}
      </div>
    );
  };

  const handleViewDetails = (booking: any) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  const handleCancelBooking = async (booking: any) => {
    setActionLoading(booking.id);
    try {
      await dispatch(cancelBooking(booking.id));
    } catch (error) {
      console.error("Error cancelling booking:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleClearFilters = () => {
    setStatusFilter("");
    setDateFilter(null);
    dispatch(clearFilters());
  };

  const handleBookNewTurf = () => {
    navigate("/turfs");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <ProgressSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Message severity="error" text={error} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header with Filters */}
      <Card>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="status-filter" className="text-sm font-medium text-gray-600">
              Status:
            </label>
            <Dropdown
              id="status-filter"
              value={statusFilter}
              options={statusOptions}
              onChange={(e) => setStatusFilter(e.value)}
              placeholder="All Status"
              className="w-40"
            />
          </div>
          
          {(statusFilter || dateFilter) && (
            <Button
              label="Clear Filters"
              icon="pi pi-times"
              onClick={handleClearFilters}
              className="!bg-green-500 !border-green-500 hover:!bg-green-600 disabled:!bg-green-400"
              />
          )}
          
          
          <div className="text-sm text-gray-600">
            Showing {filteredBookings.length} of {bookings.length} bookings
          </div>
        </div>
      </Card>

      {/* Upcoming Bookings */}
      {upcomingBookings.length > 0 && (
        <Card title="Upcoming Bookings">
          <DataTable
            value={upcomingBookings}
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            className="p-datatable-sm"
            emptyMessage="No upcoming bookings found"
          >
            <Column field="id" header="Booking ID" style={{ width: "12%" }} />
            <Column 
              field="turfName" 
              header="Turf" 
              body={turfBodyTemplate}
              style={{ width: "20%" }} 
            />
            <Column
              field="bookingDate"
              header="Date"
              body={dateBodyTemplate}
              style={{ width: "15%" }}
            />
            <Column
              field="startTime"
              header="Time"
              body={timeBodyTemplate}
              style={{ width: "13%" }}
            />
            <Column
              field="status"
              header="Status"
              body={statusBodyTemplate}
              style={{ width: "12%" }}
            />
            <Column
              field="totalAmount"
              header="Amount"
              body={amountBodyTemplate}
              style={{ width: "13%" }}
            />
            <Column
              header="Actions"
              body={actionBodyTemplate}
              style={{ width: "15%" }}
            />
          </DataTable>
        </Card>
      )}

      {/* Past Bookings */}
      {pastBookings.length > 0 && (
        <Card>
          <DataTable
            value={pastBookings}
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            className="p-datatable-sm"
            emptyMessage="No past bookings found"
          >
            <Column field="id" header="Booking ID" style={{ width: "12%" }} />
            <Column 
              field="turfName" 
              header="Turf" 
              body={turfBodyTemplate}
              style={{ width: "20%" }} 
            />
            <Column
              field="bookingDate"
              header="Date"
              body={dateBodyTemplate}
              style={{ width: "15%" }}
            />
            <Column
              field="startTime"
              header="Time"
              body={timeBodyTemplate}
              style={{ width: "13%" }}
            />
            <Column
              field="status"
              header="Status"
              body={statusBodyTemplate}
              style={{ width: "12%" }}
            />
            <Column
              field="totalAmount"
              header="Amount"
              body={amountBodyTemplate}
              style={{ width: "13%" }}
            />
            <Column
              header="Actions"
              body={actionBodyTemplate}
              style={{ width: "15%" }}
            />
          </DataTable>
        </Card>
      )}

      {/* Empty State */}
      {filteredBookings.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <i className="pi pi-calendar text-6xl text-gray-400 mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No bookings found
            </h3>
            <p className="text-gray-600 mb-6">
              {statusFilter || dateFilter
                ? "No bookings match your current filters"
                : "You haven't made any bookings yet"}
            </p>
            <Button
              label="Book Your First Turf"
              icon="pi pi-plus"
              onClick={handleBookNewTurf}
              className="p-button-primary"
            />
          </div>
        </Card>
      )}

      {/* Booking Details Modal */}
      <Dialog
        header="Booking Details"
        visible={showDetailsModal}
        style={{ width: "50vw", maxWidth: "600px" }}
        onHide={() => setShowDetailsModal(false)}
        modal
        closeIcon="pi pi-times close-button"
      >
        {selectedBooking && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">
                  Booking Info
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booking ID:</span>
                    <span className="font-medium">{selectedBooking.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <Tag
                      value={selectedBooking.status.toUpperCase()}
                      severity={getStatusSeverity(selectedBooking.status)}
                    />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">
                      {new Date(selectedBooking.bookingDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium">
                      {selectedBooking.startTime?.substring(0, 5)} -{" "}
                      {selectedBooking.endTime?.substring(0, 5)}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">
                  Payment Info
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-medium text-green-600">
                      ₹{selectedBooking.totalAmount?.toLocaleString() || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Status:</span>
                    <span className="font-medium">
                      {selectedBooking.payment?.status || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium">
                      {selectedBooking.payment?.method || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <Divider />
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Turf Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Turf Name:</span>
                  <span className="font-medium">{selectedBooking.turfName || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">{selectedBooking.turfLocation || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium">{selectedBooking.categoryName || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Customer:</span>
                  <span className="font-medium">{selectedBooking.customerName || "N/A"}</span>
                </div>
                {selectedBooking.customerEmail && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{selectedBooking.customerEmail}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default MyBookingsPage;
