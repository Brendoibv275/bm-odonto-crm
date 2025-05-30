
import React from 'react';

interface HeaderProps {
  appName: string;
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ appName, onToggleSidebar }) => {
  return (
    <header className="bg-sky-700 text-white p-3 shadow-md flex justify-between items-center sticky top-0 z-30 h-16">
      <div className="flex items-center">
        <button 
          onClick={onToggleSidebar} 
          className="md:hidden p-2 mr-2 rounded-md text-sky-200 hover:text-white hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          aria-label="Abrir menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-xl sm:text-2xl font-bold">{appName}</h1>
      </div>
      {/* User info placeholder */}
      <div className="text-sm">
        {/* User Name / Logout */}
      </div>
    </header>
  );
};

export default Header;
