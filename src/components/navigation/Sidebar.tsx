import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  FileText, 
  DollarSign,
  Settings,
  Upload,
  AlertTriangle,
  Briefcase
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function Sidebar({ logo }: { logo: string }) {
  const { t } = useTranslation();
  const location = useLocation();

  const navigation = [
    {
      name: t('navigation.dashboard'),
      href: '/dashboard',
      icon: LayoutDashboard
    },
    {
      name: t('navigation.visaInventory'),
      href: '/visas',
      icon: Briefcase
    },
    {
      name: t('navigation.workers'),
      href: '/workers',
      icon: Users,
      subItems: [
        {
          name: t('workers.bulkUpload'),
          href: '/workers/bulk',
          icon: Upload
        }
      ]
    },
    {
      name: t('navigation.organizations'),
      href: '/organizations',
      icon: Building2
    },
    {
      name: t('navigation.financial'),
      href: '/financial',
      icon: DollarSign
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-56 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Logo Section */}
      <div className="p-4 border-b border-gray-200">
        {logo ? (
          <img src={logo} alt="Logo" className="h-8 w-auto mx-auto" />
        ) : (
          <div className="h-8 flex items-center justify-center text-lg font-semibold text-gray-800">
            {t('company.name')}
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2 px-2">
        <div className="space-y-1">
          {navigation.map((item) => (
            <div key={item.name}>
              <Link
                to={item.href}
                className={`
                  group flex items-center px-3 py-2 text-sm font-medium rounded-md
                  transition-colors duration-150 ease-in-out
                  ${isActive(item.href)
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                `}
              >
                <item.icon
                  className={`mr-3 h-4 w-4 flex-shrink-0 transition-colors duration-150
                    ${isActive(item.href) ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'}
                  `}
                />
                <span className="truncate">{item.name}</span>
              </Link>

              {/* Sub Items */}
              {item.subItems && (
                <div className="ml-8 mt-1 space-y-1">
                  {item.subItems.map((subItem) => (
                    <Link
                      key={subItem.name}
                      to={subItem.href}
                      className={`
                        group flex items-center px-3 py-1.5 text-sm font-medium rounded-md
                        transition-colors duration-150 ease-in-out
                        ${isActive(subItem.href)
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
                      `}
                    >
                      <subItem.icon
                        className={`mr-3 h-3 w-3 flex-shrink-0 transition-colors duration-150
                          ${isActive(subItem.href) ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'}
                        `}
                      />
                      <span className="truncate">{subItem.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* Settings Link */}
      <div className="p-2 border-t border-gray-200">
        <Link
          to="/settings"
          className={`
            flex items-center px-3 py-2 text-sm font-medium rounded-md
            transition-colors duration-150 ease-in-out
            ${isActive('/settings')
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
          `}
        >
          <Settings
            className={`mr-3 h-4 w-4 flex-shrink-0 transition-colors duration-150
              ${isActive('/settings') ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'}
            `}
          />
          {t('navigation.settings')}
        </Link>
      </div>
    </div>
  );
} 