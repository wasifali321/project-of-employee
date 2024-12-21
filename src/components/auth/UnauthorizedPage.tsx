import { useTranslation } from 'react-i18next';
import { AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function UnauthorizedPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500" />
        <h2 className="mt-6 text-3xl font-bold text-gray-900">
          {t('auth.unauthorized')}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {t('auth.noPermission')}
        </p>
        <div className="mt-6">
          <Link
            to="/dashboard"
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            {t('common.backToDashboard')} &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
} 