import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { setFilters, clearFilters } from "../../store/slices/adminBookingSlice";
import { fetchTurfs } from "../../store/slices/turfSlice";
import type { RootState } from "../../types";
import type { AppDispatch } from "../../store";

interface TurfBookingsFiltersProps {
  onFilterChange: () => void;
}

const TurfBookingsFilters: React.FC<TurfBookingsFiltersProps> = ({
  onFilterChange,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { filters } = useSelector((state: RootState) => state.adminBooking);
  const { turfs } = useSelector((state: RootState) => state.turf);

  const [selectedTurf, setSelectedTurf] = useState<string | null>(
    filters.turfId || null
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    filters.bookingDate ? new Date(filters.bookingDate) : null
  );

  // Fetch turfs on component mount
  useEffect(() => {
    if (turfs.length === 0) {
      dispatch(fetchTurfs());
    }
  }, [dispatch, turfs.length]);

  // Prepare turf options for dropdown
  const turfOptions = [
    { label: "All Turfs", value: null },
    ...turfs.map((turf) => ({
      label: turf.name,
      value: turf.id,
    })),
  ];

  const handleTurfChange = (value: string | null) => {
    setSelectedTurf(value);
    dispatch(
      setFilters({
        turfId: value || undefined,
      })
    );
    onFilterChange();
  };

  const handleDateChange = (value: Date | null) => {
    setSelectedDate(value);
    dispatch(
      setFilters({
        bookingDate: value ? value.toISOString().split("T")[0] : undefined,
      })
    );
    onFilterChange();
  };

  const handleClearFilters = () => {
    setSelectedTurf(null);
    setSelectedDate(null);
    dispatch(clearFilters());
    onFilterChange();
  };

  const hasActiveFilters = selectedTurf || selectedDate;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-2">
      <div className="flex flex-col lg:flex-row gap-4 items-end">
        {/* Turf Filter */}
        <div className="flex-1 min-w-0">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Turf
          </label>
          <Dropdown
            value={selectedTurf}
            options={turfOptions}
            onChange={(e) => handleTurfChange(e.value)}
            placeholder="Select a turf"
            className="w-full"
            showClear
          />
        </div>

        {/* Date Filter */}
        <div className="flex-1 min-w-0">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Date
          </label>
          <Calendar
            value={selectedDate}
            onChange={(e) => handleDateChange(e.value as Date)}
            placeholder="Select booking date"
            className="w-full"
            dateFormat="dd/mm/yy"
            minDate={new Date()}
          />
        </div>

        {/* Clear Filters Button */}
        <div className="lg:self-end">
          <Button
            label="Clear Filters"
            icon="pi pi-times"
            className="p-button-outlined p-button-secondary"
            onClick={handleClearFilters}
            disabled={!hasActiveFilters}
          />
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600">Active filters:</span>
            {selectedTurf && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Turf: {turfs.find(t => t.id === selectedTurf)?.name || selectedTurf}
                <button
                  onClick={() => handleTurfChange(null)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  <i className="pi pi-times text-xs"></i>
                </button>
              </span>
            )}
            {selectedDate && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Date: {selectedDate.toLocaleDateString()}
                <button
                  onClick={() => handleDateChange(null)}
                  className="ml-1 text-green-600 hover:text-green-800"
                >
                  <i className="pi pi-times text-xs"></i>
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TurfBookingsFilters; 