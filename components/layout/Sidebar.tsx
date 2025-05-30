import React, { JSX } from 'react';
import { AppView } from '../../types';

// SVG Icons
const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const PacientesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 016-6h6a6 6 0 016 6v1h-3" /></svg>;
const AgendaIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const FinanceiroIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>;


interface NavItemProps {
  view: AppView;
  label: string;
  currentView: AppView;
  navigateTo: (view: AppView) => void;
  icon?: JSX.Element;
}

const NavItem: React.FC<NavItemProps> = ({ view, label, currentView, navigateTo, icon }) => {
  const isActive = currentView === view;
  return (
    <li>
      <button
        onClick={() => navigateTo(view)}
        className={`w-full flex items-center py-3 px-4 rounded-lg text-sm font-medium transition-colors duration-150 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300
                    ${isActive 
                      ? 'bg-sky-600 text-white shadow-inner' 
                      : 'text-sky-100 hover:bg-sky-600 hover:text-white'
                    }`}
        aria-current={isActive ? 'page' : undefined}
      >
        {icon && <span className="mr-3">{icon}</span>}
        {label}
      </button>
    </li>
  );
};

interface SidebarProps {
  currentView: AppView;
  navigateTo: (view: AppView) => void;
  isOpenMobile: boolean;
  onCloseMobileSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, navigateTo, isOpenMobile, onCloseMobileSidebar }) => {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={onCloseMobileSidebar}
          aria-hidden="true"
        ></div>
      )}

      <aside 
        className={`fixed md:static top-0 left-0 h-full w-64 bg-sky-700 text-white p-4 space-y-4 overflow-y-auto 
                    transform ${isOpenMobile ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 
                    transition-transform duration-300 ease-in-out shadow-lg md:shadow-none z-40`}
        aria-label="Menu principal"
      >
        <div className="flex justify-between items-center md:hidden mb-4">
          <span className="text-lg font-semibold text-white">Menu</span>
          <button onClick={onCloseMobileSidebar} className="p-1 text-sky-200 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav>
          <ul className="space-y-2">
            <NavItem view={AppView.DASHBOARD} label="Dashboard" currentView={currentView} navigateTo={navigateTo} icon={<DashboardIcon />} />
            <NavItem view={AppView.PACIENTES} label="Pacientes" currentView={currentView} navigateTo={navigateTo} icon={<PacientesIcon />} />
            <NavItem view={AppView.AGENDA} label="Agenda" currentView={currentView} navigateTo={navigateTo} icon={<AgendaIcon />} />
            <NavItem view={AppView.FINANCEIRO} label="Financeiro" currentView={currentView} navigateTo={navigateTo} icon={<FinanceiroIcon />} />
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
