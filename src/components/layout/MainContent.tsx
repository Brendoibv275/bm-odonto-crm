import React from 'react';
import { Outlet } from 'react-router-dom';

const MainContent: React.FC = () => {
  return (
    <main className="flex-1 p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <Outlet />
      </div>
    </main>
  );
};

export default MainContent; 