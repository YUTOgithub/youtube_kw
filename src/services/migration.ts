import { Keyword } from '@/types/keyword';
import { getLocalData, clearLocalData } from './storage';
import * as firestoreService from './firestore';
import { MigrationResult } from '@/types/sync';

export async function migrateLocalToFirestore(
  userId: string
): Promise<MigrationResult> {
  const result: MigrationResult = {
    migratedCount: 0,
    errors: [],
    timestamp: new Date().toISOString(),
  };

  try {
    const localData = getLocalData();
    if (!localData || localData.searchWords.length === 0) {
      return result;
    }

    // Migrate each keyword
    for (const keyword of localData.searchWords) {
      try {
        // Remove id field if it exists (Firestore will generate new ones)
        const { id, ...keywordData } = keyword;
        await firestoreService.addKeyword(userId, keywordData);
        result.migratedCount++;
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        result.errors.push(`Failed to migrate keyword: ${errorMsg}`);
      }
    }

    // Save categories metadata
    if (localData.categories && localData.categories.length > 0) {
      try {
        await firestoreService.saveUserMetadata(userId, {
          categories: localData.categories,
          lastSyncedAt: new Date().toISOString(),
        });
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        result.errors.push(`Failed to migrate categories: ${errorMsg}`);
      }
    }

    // Clear local storage after successful migration
    if (result.migratedCount > 0) {
      clearLocalData();
    }

    return result;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    result.errors.push(`Migration failed: ${errorMsg}`);
    return result;
  }
}

// Ensure all keywords have required fields
export function normalizeKeywords(keywords: any[]): Keyword[] {
  return keywords.map((kw) => ({
    id: kw.id || '',
    keyword: kw.keyword || '',
    category: kw.category || '未分類',
    memo: kw.memo || '',
    tags: Array.isArray(kw.tags) ? kw.tags : [],
    favorited: kw.favorited === true,
    createdAt: kw.createdAt || new Date().toISOString(),
    updatedAt: kw.updatedAt || new Date().toISOString(),
  }));
}
