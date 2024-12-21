import React, { useRef } from 'react';
import { Upload } from 'lucide-react';

interface LogoUploadProps {
  currentLogo: string;
  onLogoChange: (logo: string) => void;
}

export function LogoUpload({ currentLogo, onLogoChange }: LogoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onLogoChange(base64String);
        localStorage.setItem('companyLogo', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">Company Logo</label>
      
      <div className="flex items-center space-x-6">
        {currentLogo ? (
          <div className="w-24 h-24 border rounded-lg overflow-hidden">
            <img 
              src={currentLogo} 
              alt="Company Logo" 
              className="w-full h-full object-contain"
            />
          </div>
        ) : (
          <div className="w-24 h-24 border-2 border-dashed rounded-lg flex items-center justify-center bg-gray-50">
            <Upload className="h-8 w-8 text-gray-400" />
          </div>
        )}
        
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Change Logo
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
} 