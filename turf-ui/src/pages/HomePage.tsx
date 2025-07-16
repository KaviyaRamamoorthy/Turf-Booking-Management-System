import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { ProgressSpinner } from "primereact/progressspinner";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BookingSuccessModal from "../components/common/BookingSuccessModal";
import TurfBookingModal from "../components/common/TurfBookingModal";
import TurfCard from "../components/common/TurfCard";
import TurfDetailsModal from "../components/common/TurfDetailsModal";
import type { AppDispatch } from "../store";
import {
  clearFilters,
  fetchTurfs
} from "../store/slices/turfSlice";
import type { RootState, Turf } from "../types";

const HomePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { turfs, isLoading, error, filters } = useSelector(
    (state: RootState) => state.turf
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [selectedTurf, setSelectedTurf] = useState<Turf | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTurfForBooking, setSelectedTurfForBooking] =
    useState<Turf | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<{
    date: Date;
    timeSlot: string;
    bookingId?: string;
    totalAmount?: number;
  } | null>(null);

  // Category options for dropdown
  const categoryOptions = [
    { label: "All Categories", value: null },
    { label: "Football", value: "football" },
    { label: "Cricket", value: "cricket" },
    { label: "Tennis", value: "tennis" },
    { label: "Basketball", value: "basketball" },
    { label: "Volleyball", value: "volleyball" },
  ];

  // Sort options
  const sortOptions = [
    { label: "Featured", value: "featured" },
    { label: "Price: Low to High", value: "price-low" },
    { label: "Price: High to Low", value: "price-high" },
    { label: "Rating", value: "rating" },
    { label: "Newest", value: "newest" },
  ];

  // Load turfs on component mount
  useEffect(() => {
    dispatch(fetchTurfs({}));
  }, [dispatch]);

  // Filter and sort turfs
  const filteredTurfs = useMemo(() => {
    let result = turfs.filter((turf) => {
      if (!searchQuery) return true;

      const query = searchQuery.toLowerCase();
      return (
        turf.name.toLowerCase().includes(query) ||
        turf.description.toLowerCase().includes(query) ||
        turf.category.toLowerCase().includes(query) ||
        turf.location.city.toLowerCase().includes(query) ||
        turf.location.state.toLowerCase().includes(query) ||
        turf.location.address.toLowerCase().includes(query)
      );
    });

    // Sort results
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.pricing.hourlyRate - b.pricing.hourlyRate);
        break;
      case "price-high":
        result.sort((a, b) => b.pricing.hourlyRate - a.pricing.hourlyRate);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      default:
        // Featured - keep original order
        break;
    }

    return result;
  }, [turfs, searchQuery, sortBy]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSortBy("featured");
    dispatch(clearFilters());
  };

  const handleTurfViewDetails = (turf: Turf) => {
    setSelectedTurf(turf);
    setShowDetailsModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setSelectedTurf(null);
  };

  const handleTurfBook = (turf: Turf) => {
    setSelectedTurfForBooking(turf);
    setShowBookingModal(true);
  };

  const handleBookingConfirm = (
    turf: Turf,
    date: Date,
    timeSlot: string,
    bookingData?: any
  ) => {
    console.log("🎯 Booking confirmed - switching modals", {
      turf: turf.name,
      bookingData,
      currentStates: {
        showBookingModal,
        showSuccessModal,
        selectedTurfForBooking: selectedTurfForBooking?.name,
      },
    });

    // Store booking details for success modal
    const details = {
      date,
      timeSlot,
      bookingId: bookingData?.id,
      totalAmount: bookingData?.totalAmount,
    };

    console.log("📋 Setting booking details:", details);
    setBookingDetails(details);

    // Switch from booking modal to success modal
    console.log("🔄 Switching modals: booking -> success");
    setShowBookingModal(false);
    setShowSuccessModal(true);
    // Keep selectedTurfForBooking for the success modal

    console.log("✅ Modal switch complete");
  };

  const handleBookingCancel = () => {
    setShowBookingModal(false);
    setSelectedTurfForBooking(null);
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    setSelectedTurfForBooking(null);
    setBookingDetails(null);
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
    <div className="min-h-screen bg-gray-50">
      {/* Search Form */}
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col space-y-3">
          <span className="p-input-icon-left block">
            <i className="pi pi-search text-gray-400 !left-4" />
            <InputText
              placeholder="Search by name, category, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 !pl-12 !text-lg"
            />
          </span>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Available Turfs ({filteredTurfs.length})
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                Sort by:
              </label>
              <Dropdown
                value={sortBy}
                options={sortOptions}
                onChange={(e) => setSortBy(e.value)}
                className="w-48"
              />
            </div>
          </div>
        </div>

        {/* Turfs Grid */}
        {filteredTurfs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="max-w-md mx-auto">
              <i className="pi pi-search text-7xl text-gray-300 mb-6"></i>
              <h3 className="text-2xl font-bold text-gray-700 mb-3">
                {searchQuery ? "No turfs found" : "Start your search"}
              </h3>
              <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                {searchQuery
                  ? "Try adjusting your search terms or clear the search to see all available turfs."
                  : "Use the search box above to find turfs by name, category, or location."}
              </p>
              {searchQuery && (
                <Button
                  label="Clear Search"
                  icon="pi pi-refresh"
                  onClick={handleClearFilters}
                  className="!bg-gradient-to-r !from-green-500 !to-green-600 !border-transparent hover:!from-green-600 hover:!to-green-700 !px-8 !py-3 !text-base !font-semibold"
                />
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTurfs.map((turf) => (
              <TurfCard
                key={turf.id}
                turf={turf}
                onViewDetails={handleTurfViewDetails}
                onBook={handleTurfBook}
              />
            ))}
          </div>
        )}
      </div>

      {/* Turf Details Modal */}
      <TurfDetailsModal
        turf={selectedTurf}
        visible={showDetailsModal}
        onHide={handleCloseModal}
        onBook={handleTurfBook}
      />

      {/* Turf Booking Modal */}
      <TurfBookingModal
        turf={selectedTurfForBooking}
        visible={showBookingModal}
        onHide={handleBookingCancel}
        onConfirmBooking={handleBookingConfirm}
      />

      {/* Booking Success Modal */}
      <BookingSuccessModal
        visible={showSuccessModal}
        onHide={handleSuccessModalClose}
        turf={selectedTurfForBooking}
        bookingDetails={bookingDetails}
      />
    </div>
  );
};

export default HomePage;
