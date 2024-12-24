import { useTranslation } from 'react-i18next';
import { Bell, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import type { User } from '../../types';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  user: User | null;
  logo?: string;
}

export function Navbar({ user, logo }: NavbarProps) {
  const location = useLocation();
  const { t } = useTranslation();
  const { logout } = useAuth();

  const navigation = [
    { name: t('navigation.dashboard'), href: '/' },
    { name: t('navigation.workers'), href: '/workers' },
    { name: t('navigation.visaInventory'), href: '/visa-inventory' },
    { name: t('navigation.organizations'), href: '/organizations' },
    { name: t('navigation.financial'), href: '/financial' },
    { name: t('navigation.settings'), href: '/settings' },
    { name: t('navigation.violations'), href: '/violations' }
  ];

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              {logo ? (
                <img
                  className="h-8 w-auto"
                  src={logo}
                  alt="Company Logo"
                />
              ) : (
                <img
                  className="h-8 w-auto"
                  src="/default-logo.svg"
                  alt="Default Logo"
                />
              )}
            </div>

            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    location.pathname === item.href
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            <button className="p-2 rounded-md text-gray-400 hover:text-gray-500">
              <Bell className="h-6 w-6" />
            </button>
            
            <button className="ml-3 p-2 rounded-md text-gray-400 hover:text-gray-500">
              <Settings className="h-6 w-6" />
            </button>

            <div className="ml-3 relative">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700 mr-3">
                  {user?.username}
                </span>
                <button
                  onClick={logout}
                  className="p-2 rounded-md text-gray-400 hover:text-gray-500"
                >
                  <LogOut className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 