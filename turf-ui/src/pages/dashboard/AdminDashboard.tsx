import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import type { RootState } from "../../types";
import type { AppDispatch } from "../../store";
import { fetchAdminStats } from "../../store/slices/adminSlice";

const AdminDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { stats, isLoading } = useSelector((state: RootState) => state.admin);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchAdminStats());
  }, [dispatch]);

  const recentBookings = [
    {
      id: "1",
      customer: "John Doe",
      turf: "Premium Football Ground",
      date: "2024-01-15",
      status: "Confirmed",
    },
    {
      id: "2",
      customer: "Jane Smith",
      turf: "Cricket Stadium",
      date: "2024-01-16",
      status: "Pending",
    },
    {
      id: "3",
      customer: "Mike Johnson",
      turf: "Tennis Court",
      date: "2024-01-17",
      status: "Completed",
    },
  ];

  const statusBodyTemplate = (rowData: any) => {
    const statusClass =
      {
        Confirmed: "bg-green-100 text-green-800",
        Pending: "bg-yellow-100 text-yellow-800",
        Completed: "bg-blue-100 text-blue-800",
      }[rowData.status] || "bg-gray-100 text-gray-800";

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}
      >
        {rowData.status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* <RoleSwitcher /> */}
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-blue-100">
          Here's what's happening with your turf booking system today.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {stats?.totalUsers || 0}
          </div>
          <div className="text-gray-600">Total Users</div>
          <div className="text-sm text-green-600 mt-2">
            <i className="pi pi-arrow-up mr-1"></i>
            +12% from last month
          </div>
        </Card>

        <Card className="text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {stats?.totalTurfs || 0}
          </div>
          <div className="text-gray-600">Active Turfs</div>
          <div className="text-sm text-green-600 mt-2">
            <i className="pi pi-arrow-up mr-1"></i>
            +5% from last month
          </div>
        </Card>

        <Card className="text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {stats?.totalBookings || 0}
          </div>
          <div className="text-gray-600">Total Bookings</div>
          <div className="text-sm text-green-600 mt-2"><i className="pi pi-arrow-up mr-1"></i>
            +8% from last month
          </div>
        </Card>

        <Card className="text-center">
          <div className="text-3xl font-bold text-orange-600 mb-2">
            ${stats?.totalRevenue?.toLocaleString() || 0}
          </div>
          <div className="text-gray-600">Total Revenue</div>
          <div className="text-sm text-green-600 mt-2">
            <i className="pi pi-arrow-up mr-1"></i>
            +15% from last month
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card title="Quick Actions" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            label="Manage Turfs"
            icon="pi pi-map-marker"
            className="p-button-outlined"
            onClick={() => {
              /* Navigate to turf management */
            }}
          />
          <Button
            label="View Users"
            icon="pi pi-users"
            className="p-button-outlined"
            onClick={() => {
              /* Navigate to user management */
            }}
          />
          <Button
            label="Generate Reports"
            icon="pi pi-chart-bar"
            className="p-button-outlined"
            onClick={() => {
              /* Navigate to reports */
            }}
          />
        </div>
      </Card>

      {/* Recent Bookings */}
      <Card title="Recent Bookings" className="mb-6">
        <DataTable
          value={recentBookings}
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 25]}
          className="p-datatable-sm"
          loading={isLoading}
        >
          <Column field="id" header="ID" style={{ width: "10%" }} />
          <Column field="customer" header="Customer" style={{ width: "25%" }} />
          <Column field="turf" header="Turf" style={{ width: "30%" }} />
          <Column field="date" header="Date" style={{ width: "15%" }} />
          <Column
            field="status"
            header="Status"
            body={statusBodyTemplate}
            style={{ width: "20%" }}
          />
        </DataTable>
      </Card>

      {/* Monthly Revenue Chart */}
      <Card title="Monthly Revenue Trend" className="mb-6">
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
          <div className="text-center text-gray-500">
            <i className="pi pi-chart-line text-4xl mb-4"></i>
            <p>Revenue chart will be displayed here</p>
            <p className="text-sm">
              Chart component integration coming soon...
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
