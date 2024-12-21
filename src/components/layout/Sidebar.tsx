import React from 'react';
import { 
  Home, 
  Users, 
  Building2, 
  Briefcase, 
  Settings, 
  User,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  FileText
} from 'lucide-react';

interface SidebarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

const menuItems = [
  { icon: Home, label: 'Dashboard', path: 'home' },
  { icon: Building2, label: 'Organizations', path: 'organizations' },
  { icon: Users, label: 'Workers', path: 'workers' },
  { icon: Briefcase, label: 'Services', path: 'services' },
  { icon: DollarSign, label: 'Financial', path: 'financial' },
  { icon: FileText, label: 'Inventory', path: 'inventory' },
  { icon: User, label: 'Users', path: 'users' },
  { icon: Settings, label: 'Settings', path: 'settings' },
];

export function Sidebar({ onNavigate, currentPage, isExpanded, onToggleExpand }: SidebarProps) {
  return (
    <aside 
      className={`fixed left-0 top-0 h-screen bg-gray-900 text-white transition-all duration-300 ease-in-out z-10 ${
        isExpanded ? 'w-64' : 'w-16'
      }`}
    >
      <div className={`flex items-center gap-2 mb-8 p-4 ${isExpanded ? 'justify-start' : 'justify-center'}`}>
        <Building2 className="h-8 w-8 flex-shrink-0" />
        {isExpanded && <h1 className="text-xl font-bold transition-opacity duration-200">Worker Manager</h1>}
      </div>

      <nav className="px-2">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => onNavigate(item.path)}
            className={`w-full flex items-center gap-2 px-2 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-200
              ${currentPage === item.path ? 'bg-gray-800' : ''} ${isExpanded ? 'justify-start' : 'justify-center'}`}
            title={!isExpanded ? item.label : undefined}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {isExpanded && <span className="transition-opacity duration-200">{item.label}</span>}
          </button>
        ))}
      </nav>

      <button
        onClick={onToggleExpand}
        className="absolute bottom-4 right-0 transform translate-x-1/2 bg-gray-900 text-white p-2 rounded-full shadow-lg hover:bg-gray-800 transition-colors duration-200 z-20"
      >
        {isExpanded ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </button>
    </aside>
  );
}