import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Upload, X } from 'lucide-react';

interface LogoSettingsProps {
  currentLogo: string;
  onLogoChange: (logo: string) => void;
}

export function LogoSettings({ currentLogo, onLogoChange }: LogoSettingsProps) {
  const { t } = useTranslation();
  const [previewUrl, setPreviewUrl] = useState(currentLogo);
  const [error, setError] = useState('');

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError('');

    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError(t('settings.logo.invalidType'));
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError(t('settings.logo.tooLarge'));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewUrl(result);
        onLogoChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setPreviewUrl('');
    onLogoChange('');
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        {t('settings.logo.companyLogo')}
      </label>
      
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          {previewUrl ? (
            <div className="relative">
              <img
                src={previewUrl}
                alt="Company logo"
                className="h-32 w-32 object-contain border rounded-lg"
              />
              <button
                onClick={handleRemoveLogo}
                className="absolute -top-2 -right-2 p-1 bg-red-100 rounded-full text-red-600 hover:bg-red-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="h-32 w-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              <Image className="h-8 w-8 text-gray-400" />
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex flex-col space-y-2">
            <label className="relative cursor-pointer">
              <span className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                <Upload className="h-4 w-4 mr-2" />
                {t('settings.logo.upload')}
              </span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleLogoChange}
              />
            </label>
            
            <p className="text-sm text-gray-500">
              {t('settings.logo.requirements')}
            </p>
            
            {error && (
              <p className="text-sm text-red-600">
                {error}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">
          {t('settings.logo.preview')}
        </h4>
        <div className="border rounded-lg p-4 bg-white">
          <div className="flex items-center justify-between border-b pb-4 mb-4">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Receipt header preview"
                className="h-16 object-contain"
              />
            ) : (
              <div className="h-16 w-32 bg-gray-100 rounded flex items-center justify-center">
                <Image className="h-6 w-6 text-gray-400" />
              </div>
            )}
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">RECEIPT</div>
              <div className="text-sm text-gray-500">#123456</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-100 rounded w-3/4"></div>
            <div className="h-4 bg-gray-100 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    </div>
  );
}