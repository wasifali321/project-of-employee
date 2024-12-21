import { useState, useEffect } from 'react';

declare global {
  interface Window {
    electronAPI?: {
      getData: (key: string) => Promise<any>;
      setData: (key: string, value: any) => Promise<void>;
    };
  }
}

export function useElectronStore<T>(key: string, initialValue: T) {
  const [data, setData] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (window.electronAPI) {
          const storedData = await window.electronAPI.getData(key);
          if (storedData !== undefined) {
            setData(storedData);
          }
        } else {
          // Fallback to localStorage for web version
          const storedData = localStorage.getItem(key);
          if (storedData) {
            setData(JSON.parse(storedData));
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [key]);

  const saveData = async (newData: T) => {
    try {
      if (window.electronAPI) {
        await window.electronAPI.setData(key, newData);
      } else {
        // Fallback to localStorage for web version
        localStorage.setItem(key, JSON.stringify(newData));
      }
      setData(newData);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  return { data, setData: saveData, loading };
}