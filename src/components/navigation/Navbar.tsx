import { useTranslation } from 'react-i18next';
import { Bell, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import type { User } from '../../types';

interface NavbarProps {
  user: User | null;
  logo?: string;
}

export function Navbar({ user, logo }: NavbarProps) {
  const { t } = useTranslation();
  const { logout } = useAuth();

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