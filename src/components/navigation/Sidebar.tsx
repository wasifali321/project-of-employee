import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  FileText, 
  DollarSign,
  Stamp,
  Settings,
  Upload,
  AlertTriangle
} from 'lucide-react';

export function Sidebar() {
  const location = useLocation();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard
    },
    {
      type: 'section',
      name: 'Workers Management',
      items: [
        {
          name: 'Workers List',
          href: '/workers',
          icon: Users
        },
        {
          name: 'Bulk Entry',
          href: '/workers/bulk',
          icon: Upload
        }
      ]
    },
    {
      type: 'section',
      name: 'Organizations',
      items: [
        {
          name: 'Organizations',
          href: '/organizations',
          icon: Building2
        }
      ]
    },
    {
      type: 'section',
      name: 'Monitoring',
      items: [
        {
          name: 'Violations',
          href: '/violations',
          icon: AlertTriangle
        }
      ]
    },
    {
      name: 'Financial',
      href: '/financial',
      icon: DollarSign
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings
    }
  ];

  const renderNavItem = (item: any) => {
    const isActive = location.pathname === item.href;
    const Icon = item.icon;

    return (
      <Link
        key={item.href}
        to={item.href}
        className={`
          group flex items-center px-4 py-3 text-sm font-medium rounded-lg
          transition-all duration-200 ease-in-out
          ${isActive
            ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-sm'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
        `}
      >
        <Icon
          className={`
            mr-3 h-5 w-5 transition-colors duration-200
            ${isActive
              ? 'text-blue-600'
              : 'text-gray-400 group-hover:text-gray-600'}
          `}
        />
        {item.name}
      </Link>
    );
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            Worker Management
          </h2>
        </div>
        <div className="flex-1 py-6 px-3 overflow-y-auto">
          <nav className="space-y-8">
            {navigation.map((item, index) => {
              if (item.type === 'section') {
                return (
                  <div key={index} className="space-y-2">
                    <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      {item.name}
                    </p>
                    <div className="space-y-1">
                      {item.items.map(subItem => renderNavItem(subItem))}
                    </div>
                  </div>
                );
              }
              return renderNavItem(item);
            })}
          </nav>
        </div>
        <div className="p-4 border-t border-gray-200">
          <Link
            to="/settings"
            className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900"
          >
            <Settings className="h-5 w-5 mr-3 text-gray-400" />
            Settings
          </Link>
        </div>
      </div>
    </div>
  );
} 