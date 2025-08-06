import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TurfBookingsPage from "../../pages/admin/TurfBookingsPage";
import type { AppDispatch } from "../../store";
import { fetchAllBookings, fetchStatusCounts } from "../../store/slices/adminBookingSlice";
import type { RootState } from "../../types";
import BookingDetailsModal from "./BookingDetailsModal";
import TurfBookingsFilters from "./TurfBookingsFilters";
import TurfBookingsList from "./TurfBookingsList";

const TurfBookingsContainer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { modals } = useSelector((state: RootState) => state.ui);
  const { filters } = useSelector((state: RootState) => state.adminBooking);

  const [isInitialized, setIsInitialized] = useState(false);

  const isModalVisible = modals["bookingDetails"] || false;

  // Initialize data on component mount
  useEffect(() => {
    if (!isInitialized) {
      dispatch(fetchAllBookings(filters));
      // dispatch(fetchStatusCounts());
      setIsInitialized(true);
    }
  }, [dispatch, isInitialized]);

  // Fetch bookings when filters change
  useEffect(() => {
    if (isInitialized) {
      dispatch(fetchAllBookings(filters));
      // dispatch(fetchStatusCounts());
    }
  }, [dispatch, filters, isInitialized]);

  const handleFilterChange = () => {
    // Filters are automatically applied via useEffect above
  };

  const handleCloseModal = () => {
    // Modal close is handled by the modal component itself
  };

  return (
    <>
              <TurfBookingsPage>
          <div className="space-y-6">
            <TurfBookingsFilters onFilterChange={handleFilterChange} />
            <TurfBookingsList />
          </div>
        </TurfBookingsPage>

      <BookingDetailsModal
        visible={isModalVisible}
        onHide={handleCloseModal}
      />
    </>
  );
};

export default TurfBookingsContainer; 