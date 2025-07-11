import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { Message } from "primereact/message";
import {
  fetchTurfs,
  setFilters,
  clearFilters,
} from "../store/slices/turfSlice";
import TurfCard from "../components/common/TurfCard";
import type { RootState } from "../types";
import type { AppDispatch } from "../store";
import type { TurfCategory } from "../types";

const HomePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { turfs, isLoading, error, filters } = useSelector(
    (state: RootState) => state.turf
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<TurfCategory | null>(
    null
  );

  // Category options for dropdown
  const categoryOptions = [
    { label: "All Categories", value: null },
    { label: "Football", value: "football" },
    { label: "Cricket", value: "cricket" },
    { label: "Tennis", value: "tennis" },
    { label: "Basketball", value: "basketball" },
    { label: "Volleyball", value: "volleyball" },
  ];

  // Load turfs on component mount
  useEffect(() => {
    dispatch(fetchTurfs());
  }, [dispatch]);

  // Filter turfs based on search query and selected category
  const filteredTurfs = useMemo(() => {
    return turfs.filter((turf) => {
      const matchesSearch =
        searchQuery === "" ||
        turf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        turf.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        turf.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        turf.location.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        turf.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === null || turf.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [turfs, searchQuery, selectedCategory]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    dispatch(clearFilters());
  };

  const handleTurfViewDetails = (turf: any) => {
    // TODO: Navigate to turf details page
    console.log("View details for turf:", turf);
  };

  const handleTurfBook = (turf: any) => {
    // TODO: Navigate to booking page
    console.log("Book turf:", turf);
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
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Discover Sports Turfs
        </h1>
        <p className="text-gray-600">
          Find and book the perfect turf for your next game
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-64">
            <span className="p-input-icon-left w-full">
              <i className="pi pi-search" />
              <InputText
                placeholder="Search by name, category, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </span>
          </div>

          <div className="min-w-48">
            <Dropdown
              value={selectedCategory}
              options={categoryOptions}
              onChange={(e) => setSelectedCategory(e.value)}
              placeholder="Select Category"
              className="w-full"
              showClear
            />
          </div>

          <Button
            label="Clear Filters"
            icon="pi pi-filter-slash"
            outlined
            onClick={handleClearFilters}
            disabled={!searchQuery && !selectedCategory}
          />
        </div>
      </div>

      {/* Results Info */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <span className="text-gray-600">
            {filteredTurfs.length}{" "}
            {filteredTurfs.length === 1 ? "turf" : "turfs"} found
          </span>
          {(searchQuery || selectedCategory) && (
            <span className="text-sm text-gray-500 ml-2">
              {searchQuery && `matching "${searchQuery}"`}
              {searchQuery && selectedCategory && " in "}
              {selectedCategory && `${selectedCategory} category`}
            </span>
          )}
        </div>
      </div>

      {/* Turfs Grid */}
      {filteredTurfs.length === 0 ? (
        <div className="text-center py-12">
          <i className="pi pi-search text-6xl text-gray-300 mb-4"></i>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No turfs found
          </h3>
          <p className="text-gray-500">
            Try adjusting your search criteria or clear the filters to see all
            available turfs.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
  );
};

export default HomePage;
