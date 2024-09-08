// src/Layout/DashboardLayout.tsx

import React from 'react';
import Sidebar from '../components/Dashboard Page Components/Sidebar/Sidebar.components';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
