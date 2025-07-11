import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../types';
import Header from './Header';
import Sidebar from './Sidebar';
import ToastContainer from '../common/ToastContainer';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { sidebar } = useSelector((state: RootState) => state.ui);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className={`flex flex-col flex-1 ${sidebar.isCollapsed ? 'ml-16' : 'ml-4'}`}>
        {/* Header */}
        <Header />
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
      
      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default AppLayout; 