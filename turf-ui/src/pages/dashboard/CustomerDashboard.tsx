import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import type { RootState } from "../../types";
import { fetchBookings } from "../../store/slices/bookingSlice";

const CustomerDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { bookings, isLoading } = useSelector(
    (state: RootState) => state.booking
  );
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  const upcomingBookings = bookings.filter(
    (booking) =>
      new Date(booking.date) > new Date() && booking.status === "confirmed"
  );

  const pastBookings = bookings.filter(
    (booking) => new Date(booking.date) < new Date()
  );

  const statusBodyTemplate = (rowData: any) => {
    const statusClass =
      {
        confirmed: "bg-green-100 text-green-800",
        pending: "bg-yellow-100 text-yellow-800",
        cancelled: "bg-red-100 text-red-800",
        completed: "bg-blue-100 text-blue-800",
      }[rowData.status] || "bg-gray-100 text-gray-800";

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}
      >
        {rowData.status}
      </span>
    );
  };

  const actionBodyTemplate = (rowData: any) => (
    <div className="flex gap-2">
      <Button
        icon="pi pi-eye"
        className="p-button-sm p-button-text"
        onClick={() => {
          /* View booking details */
        }}
      />
      {rowData.status === "pending" && (
        <Button
          icon="pi pi-times"
          className="p-button-sm p-button-danger p-button-text"
          onClick={() => {
            /* Cancel booking */
          }}
        />
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-lg">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-green-100">
          Ready to book your next game? Check out available turfs and manage
          your bookings.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {upcomingBookings.length}
          </div>
          <div className="text-gray-600">Upcoming Bookings</div>
        </Card>

        <Card className="text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {pastBookings.length}
          </div>
          <div className="text-gray-600">Past Bookings</div>
        </Card>

        <Card className="text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {bookings.filter((b) => b.status === "confirmed").length}
          </div>
          <div className="text-gray-600">Total Confirmed</div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card title="Quick Actions" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            label="Browse Turfs"
            icon="pi pi-map-marker"
            className="p-button-primary"
            onClick={() => navigate("/turfs")}
          />
          <Button
            label="My Bookings"
            icon="pi pi-calendar"
            className="p-button-outlined"
            onClick={() => navigate("/bookings")}
          />
          <Button
            label="Update Profile"
            icon="pi pi-user-edit"
            className="p-button-outlined"
            onClick={() => navigate("/profile")}
          />
        </div>
      </Card>

      {/* Upcoming Bookings */}
      <Card title="Upcoming Bookings" className="mb-6">
        {upcomingBookings.length > 0 ? (
          <DataTable
            value={upcomingBookings}
            paginator
            rows={5}
            rowsPerPageOptions={[5, 10, 25]}
            className="p-datatable-sm"
            loading={isLoading}
          >
            <Column field="id" header="ID" style={{ width: "10%" }} />
            <Column field="turfId" header="Turf" style={{ width: "30%" }} />
            <Column field="date" header="Date" style={{ width: "20%" }} />
            <Column
              field="timeSlot.startTime"
              header="Time"
              style={{ width: "15%" }}
            />
            <Column
              field="status"
              header="Status"
              body={statusBodyTemplate}
              style={{ width: "15%" }}
            />
            <Column
              header="Actions"
              body={actionBodyTemplate}
              style={{ width: "10%" }}
            />
          </DataTable>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <i className="pi pi-calendar text-4xl mb-4"></i>
            <p>No upcoming bookings</p>
            <Button
              label="Book a Turf"
              icon="pi pi-plus"
              className="p-button-outlined mt-4"
              onClick={() => navigate("/turfs")}
            />
          </div>
        )}
      </Card>

      {/* Recent Activity */}
      <Card title="Recent Activity" className="mb-6">
        <div className="space-y-4">
          {bookings.slice(0, 5).map((booking) => (
            <div
              key={booking.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <i className="pi pi-calendar text-blue-600"></i>
                </div>
                <div>
                  <p className="font-medium">Booking #{booking.id}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(booking.date).toLocaleDateString()} at{" "}
                    {booking.timeSlot.startTime}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {statusBodyTemplate(booking)}
                <Button
                  icon="pi pi-eye"
                  className="p-button-sm p-button-text"
                  onClick={() => {
                    /* View details */
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recommendations */}
      <Card title="Recommended for You" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: "Premium Football Ground", rating: 4.5, price: "$50/hour" },
            { name: "Cricket Stadium", rating: 4.8, price: "$75/hour" },
            { name: "Tennis Court", rating: 4.3, price: "$40/hour" },
          ].map((turf) => (
            <Card
              key={turf.name}
              className="cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <i className="pi pi-map-marker text-green-600 text-xl"></i>
                </div>
                <h3 className="font-semibold mb-2">{turf.name}</h3>
                <div className="flex items-center justify-center mb-2">
                  <i className="pi pi-star-fill text-yellow-500 mr-1"></i>
                  <span className="text-sm">{turf.rating}</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{turf.price}</p>
                <Button
                  label="Book Now"
                  className="p-button-sm p-button-outlined"
                  onClick={() => navigate("/turfs")}
                />
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default CustomerDashboard;
