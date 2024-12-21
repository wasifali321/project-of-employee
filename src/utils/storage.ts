import { ipcRenderer } from 'electron';

export async function getData<T>(key: string): Promise<T | null> {
  try {
    return await ipcRenderer.invoke('getData', key);
  } catch (error) {
    console.error('Error getting data:', error);
    return null;
  }
}

export async function setData(key: string, value: any): Promise<void> {
  try {
    await ipcRenderer.invoke('setData', key, value);
  } catch (error) {
    console.error('Error setting data:', error);
  }
}