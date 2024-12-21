import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../navigation/Navbar';
import { Sidebar } from '../navigation/Sidebar';
import { useAuth } from '../../contexts/AuthContext';

export function DashboardLayout() {
  const { user } = useAuth();
  const [logo, setLogo] = useState<string>('');

  useEffect(() => {
    // Load logo from localStorage
    const savedLogo = localStorage.getItem('companyLogo');
    if (savedLogo) {
      setLogo(savedLogo);
    }

    // Listen for logo changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'companyLogo') {
        setLogo(e.newValue || '');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar user={user} logo={logo} />
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar logo={logo} />
        <main className="flex-1 overflow-auto p-6">
          <div className="container mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
} 