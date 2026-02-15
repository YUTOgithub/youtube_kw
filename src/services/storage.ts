import { Keyword } from '@/types/keyword';

const STORAGE_KEY = 'youtubeSearchWords';

export interface StorageData {
  searchWords: Keyword[];
  categories: string[];
}

export function getLocalData(): StorageData | null {
  try {
    if (typeof window === 'undefined') return null;
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Error reading local storage:', error);
    return null;
  }
}

export function saveLocalData(data: StorageData): void {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to local storage:', error);
  }
}

export function clearLocalData(): void {
  try {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing local storage:', error);
  }
}

export function hasLocalData(): boolean {
  try {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error checking local storage:', error);
    return false;
  }
}
