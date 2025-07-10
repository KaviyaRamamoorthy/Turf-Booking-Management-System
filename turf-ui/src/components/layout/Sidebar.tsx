import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'primereact/button';
import { useLocation, useNavigate } from 'react-router-dom';
import type { RootState } from '../../types';
import { toggleSidebar } from '../../store/slices/uiSlice';
import { getMenuItemsForRole } from '../../constants/navigation';

const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { sidebar } = useSelector((state: RootState) => state.ui);
  const { user } = useSelector((state: RootState) => state.auth);

  const menuItems = user ? getMenuItemsForRole(user.role) : [];

  const handleMenuClick = (path: string) => {
    navigate(path);
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  return (
    <aside className={`bg-white shadow-lg transition-all duration-300 ${
      sidebar.isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!sidebar.isCollapsed && (
            <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
          )}
          <Button
            icon={sidebar.isCollapsed ? 'pi pi-angle-right' : 'pi pi-angle-left'}
            className="p-button-text p-button-sm"
            onClick={() => dispatch(toggleSidebar())}
            aria-label="Toggle sidebar"
          />
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleMenuClick(item.path)}
                  className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                    isActiveRoute(item.path)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <i className={`${item.icon} ${sidebar.isCollapsed ? 'text-lg' : 'mr-3'}`}></i>
                  {!sidebar.isCollapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        {!sidebar.isCollapsed && (
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              <p>Turf Booking System</p>
              <p>v1.0.0</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar; 