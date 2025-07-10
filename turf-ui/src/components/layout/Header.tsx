import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import type { RootState } from '../../types';
import { logoutUser } from '../../store/slices/authSlice';
import { USER_MENU_ITEMS } from '../../constants/navigation';

const Header: React.FC = () => {
  const [userMenuVisible, setUserMenuVisible] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleUserMenuClick = (item: any) => {
    switch (item.id) {
      case 'logout':
        dispatch(logoutUser());
        break;
      case 'profile':
        // Navigate to profile page
        break;
      case 'change-password':
        // Open change password modal
        break;
      default:
        break;
    }
    setUserMenuVisible(false);
  };

  const userMenuItems = USER_MENU_ITEMS.map(item => ({
    ...item,
    command: () => handleUserMenuClick(item),
  }));

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Logo/Brand */}
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-800">
            Turf Booking System
          </h1>
        </div>

        {/* Right side - User menu */}
        <div className="flex items-center space-x-4">
          {/* User info */}
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>

          {/* User menu button */}
          <div className="relative">
            <Button
              icon="pi pi-user"
              className="p-button-rounded p-button-text"
              onClick={() => setUserMenuVisible(!userMenuVisible)}
              aria-label="User menu"
            />
            
            {userMenuVisible && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                {userMenuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleUserMenuClick(item)}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <i className={`${item.icon} mr-3`}></i>
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 