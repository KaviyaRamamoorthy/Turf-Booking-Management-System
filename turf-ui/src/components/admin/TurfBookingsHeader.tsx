import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../types";

const TurfBookingsHeader: React.FC = () => {
  const { bookings, total, isLoading } = useSelector((state: RootState) => state.adminBooking);

  const getStatusCounts = () => {
    const counts = {
      confirmed: 0,
      pending: 0,
      cancelled: 0,
      completed: 0,
    };

    bookings.forEach((booking) => {
      if (counts.hasOwnProperty(booking.status)) {
        counts[booking.status as keyof typeof counts]++;
      }
    });

    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-2">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Turf Bookings</h1>
          <p className="text-gray-600 mt-1">
            Manage and view all turf slot bookings made by customers
          </p>
        </div>

        {/* Summary Cards */}
        <div className="mt-4 lg:mt-0">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {isLoading ? "..." : total}
              </div>
              <div className="text-xs text-blue-600 font-medium">Total Bookings</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-green-600">
                {isLoading ? "..." : statusCounts.confirmed}
              </div>
              <div className="text-xs text-green-600 font-medium">Confirmed</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {isLoading ? "..." : statusCounts.pending}
              </div>
              <div className="text-xs text-yellow-600 font-medium">Pending</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {isLoading ? "..." : statusCounts.completed}
              </div>
              <div className="text-xs text-purple-600 font-medium">Completed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      {/* <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center text-gray-600">
            <i className="pi pi-calendar mr-2"></i>
            <span>Click on any booking row to view detailed information</span>
          </div>
          <div className="flex items-center text-gray-600">
            <i className="pi pi-filter mr-2"></i>
            <span>Use filters above to narrow down results</span>
          </div>
          {statusCounts.cancelled > 0 && (
            <div className="flex items-center text-red-600">
              <i className="pi pi-times-circle mr-2"></i>
              <span>{statusCounts.cancelled} cancelled bookings</span>
            </div>
          )}
        </div>
      </div> */}
    </div>
  );
};

export default TurfBookingsHeader; 