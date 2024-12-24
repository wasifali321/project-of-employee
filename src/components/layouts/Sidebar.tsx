import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Users, FileText } from 'lucide-react';

export function Sidebar() {
  const location = useLocation();
  const { t } = useTranslation();

  const handleNavClick = (path: string) => {
    console.log('Navigation clicked:', path); // Debug log
  };

  const navigation = [
    { name: t('navigation.dashboard'), href: '/', icon: Home },
    { name: t('navigation.workers'), href: '/workers', icon: Users },
    { name: t('navigation.visaInventory'), href: '/visa-inventory', icon: FileText },
    // ... other navigation items
  ];

  return (
    // ... rest of your sidebar code
    {navigation.map((item) => (
      <Link
        key={item.name}
        to={item.href}
        onClick={() => handleNavClick(item.href)}
        className={`
          group flex items-center px-2 py-2 text-sm font-medium rounded-md
          ${location.pathname === item.href
            ? 'bg-gray-100 text-gray-900'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
        `}
      >
        // ... rest of your link code
      </Link>
    ))}
    // ... rest of your component
  );
} 