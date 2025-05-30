import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HomeIcon, 
  UserGroupIcon, 
  CalendarIcon, 
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';

const menuItems = [
  { name: 'Dashboard', icon: HomeIcon, path: '/' },
  { name: 'Pacientes', icon: UserGroupIcon, path: '/pacientes' },
  { name: 'Agenda', icon: CalendarIcon, path: '/agenda' },
  { name: 'WhatsApp', icon: ChatBubbleLeftRightIcon, path: '/whatsapp' },
  { name: 'Configurações', icon: Cog6ToothIcon, path: '/configuracoes' },
];

const Sidebar: React.FC = () => {
  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-primary-600">BM Odonto CRM</h1>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-3" />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 