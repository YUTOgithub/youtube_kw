'use client';

import React, { createContext, useContext, useCallback, useEffect, useState } from 'react';
import { Keyword, CreateKeywordInput, UpdateKeywordInput } from '@/types/keyword';
import { useAuthContext } from './AuthContext';
import * as firestoreService from '@/services/firestore';
import * as migrationService from '@/services/migration';
import { getLocalData } from '@/services/storage';

interface KeywordContextType {
  keywords: Keyword[];
  categories: string[];
  isEditMode: boolean;
  selectedIndices: Set<string>;
  isLoading: boolean;
  isSynced: boolean;

  // CRUD operations
  addKeyword: (input: CreateKeywordInput) => Promise<void>;
  updateKeyword: (id: string, updates: UpdateKeywordInput) => Promise<void>;
  deleteKeyword: (id: string) => Promise<void>;

  // Category operations
  addCategory: (categoryName: string) => void;
  updateCategories: (categories: string[]) => void;

  // Edit mode
  toggleEditMode: () => void;
  toggleSelection: (id: string) => void;
  clearSelection: () => void;

  // Bulk operations
  bulkUpdateCategory: (ids: string[], category: string) => Promise<void>;
  bulkDelete: (ids: string[]) => Promise<void>;
  reorderKeywords: (sourceIndex: number, targetIndex: number) => void;
}

const KeywordContext = createContext<KeywordContextType | undefined>(undefined);

export function KeywordProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuthContext();
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [categories, setCategories] = useState<string[]>(['未分類']);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedIndices, setSelectedIndices] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isSynced, setIsSynced] = useState(false);
  const [unsubscribe, setUnsubscribe] = useState<(() => void) | null>(null);

  // Initialize data on user change
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setKeywords([]);
      setCategories(['未分類']);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setIsSynced(false);

    (async () => {
      try {
        // Check for local data to migrate
        const localData = getLocalData();
        if (localData && localData.searchWords.length > 0) {
          // Migrate local data to Firestore
          await migrationService.migrateLocalToFirestore(user.uid);
        }

        // Set up real-time listener
        const unsub = firestoreService.watchKeywords(user.uid, (fetchedKeywords) => {
          const normalized = migrationService.normalizeKeywords(fetchedKeywords);
          setKeywords(normalized);

          // Extract categories
          const uniqueCategories = new Set<string>();
          normalized.forEach((kw) => {
            if (kw.category) uniqueCategories.add(kw.category);
          });
          const categoriesArray = Array.from(uniqueCategories).sort();
          setCategories(categoriesArray.length > 0 ? categoriesArray : ['未分類']);
          setIsSynced(true);
          setIsLoading(false);
        });

        setUnsubscribe(() => unsub);
      } catch (error) {
        console.error('Error initializing keywords:', error);
        setIsLoading(false);
      }
    })();

    return () => {
      unsubscribe?.();
    };
  }, [isAuthenticated, user]);

  const addKeyword = useCallback(
    async (input: CreateKeywordInput) => {
      if (!user) return;
      try {
        await firestoreService.addKeyword(user.uid, input);
      } catch (error) {
        console.error('Error adding keyword:', error);
        throw error;
      }
    },
    [user]
  );

  const updateKeyword = useCallback(
    async (id: string, updates: UpdateKeywordInput) => {
      if (!user) return;
      try {
        await firestoreService.updateKeyword(user.uid, id, updates);
      } catch (error) {
        console.error('Error updating keyword:', error);
        throw error;
      }
    },
    [user]
  );

  const deleteKeyword = useCallback(
    async (id: string) => {
      if (!user) return;
      try {
        await firestoreService.deleteKeyword(user.uid, id);
      } catch (error) {
        console.error('Error deleting keyword:', error);
        throw error;
      }
    },
    [user]
  );

  const addCategory = useCallback((categoryName: string) => {
    if (categoryName && !categories.includes(categoryName)) {
      setCategories([...categories, categoryName].sort());
    }
  }, [categories]);

  const updateCategories = useCallback((newCategories: string[]) => {
    setCategories(newCategories);
  }, []);

  const toggleEditMode = useCallback(() => {
    setIsEditMode(!isEditMode);
    setSelectedIndices(new Set());
  }, [isEditMode]);

  const toggleSelection = useCallback((id: string) => {
    setSelectedIndices((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIndices(new Set());
  }, []);

  const bulkUpdateCategory = useCallback(
    async (ids: string[], category: string) => {
      if (!user) return;
      try {
        await firestoreService.bulkUpdateKeywords(user.uid, ids, { category });
      } catch (error) {
        console.error('Error updating categories:', error);
        throw error;
      }
    },
    [user]
  );

  const bulkDelete = useCallback(
    async (ids: string[]) => {
      if (!user) return;
      try {
        await firestoreService.bulkDeleteKeywords(user.uid, ids);
      } catch (error) {
        console.error('Error deleting keywords:', error);
        throw error;
      }
    },
    [user]
  );

  const reorderKeywords = useCallback((sourceIndex: number, targetIndex: number) => {
    const newKeywords = [...keywords];
    const [draggedKeyword] = newKeywords.splice(sourceIndex, 1);
    newKeywords.splice(targetIndex, 0, draggedKeyword);
    setKeywords(newKeywords);
  }, [keywords]);

  const value: KeywordContextType = {
    keywords,
    categories,
    isEditMode,
    selectedIndices,
    isLoading,
    isSynced,
    addKeyword,
    updateKeyword,
    deleteKeyword,
    addCategory,
    updateCategories,
    toggleEditMode,
    toggleSelection,
    clearSelection,
    bulkUpdateCategory,
    bulkDelete,
    reorderKeywords,
  };

  return (
    <KeywordContext.Provider value={value}>
      {children}
    </KeywordContext.Provider>
  );
}

export function useKeywordContext() {
  const context = useContext(KeywordContext);
  if (context === undefined) {
    throw new Error('useKeywordContext must be used within a KeywordProvider');
  }
  return context;
}
