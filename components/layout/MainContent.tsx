
import React from 'react';

interface MainContentProps {
  children: React.ReactNode;
  isSidebarOpenMobile: boolean; // Not directly used to change style here, but could be for overlay effects
}

const MainContent: React.FC<MainContentProps> = ({ children }) => {
  // The actual margin adjustment for desktop sidebar is handled by the fixed width of the sidebar
  // and flex layout in App.tsx. For mobile, the sidebar is an overlay.
  return (
    <main className="flex-1 p-4 sm:p-6 bg-slate-100 overflow-y-auto h-full">
      {/* Content wrapper for potential future use or consistent padding */}
      <div className="max-w-full mx-auto"> 
        {children}
      </div>
    </main>
  );
};

export default MainContent;
