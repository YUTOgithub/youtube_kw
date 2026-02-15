import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  doc,
  onSnapshot,
  query,
  orderBy,
  setDoc,
  writeBatch,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { Keyword, CreateKeywordInput, UpdateKeywordInput } from '@/types/keyword';

// ============================================================
// Keyword CRUD Operations
// ============================================================

export async function addKeyword(
  userId: string,
  input: CreateKeywordInput
): Promise<Keyword> {
  const now = new Date().toISOString();
  const keywordData = {
    keyword: input.keyword,
    category: input.category || '未分類',
    memo: input.memo || '',
    tags: input.tags || [],
    favorited: input.favorited || false,
    createdAt: now,
    updatedAt: now,
  };

  const docRef = await addDoc(
    collection(db, 'users', userId, 'keywords'),
    keywordData
  );

  return {
    id: docRef.id,
    ...keywordData,
  };
}

export async function updateKeyword(
  userId: string,
  docId: string,
  updates: UpdateKeywordInput
): Promise<void> {
  const updateData = {
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  await updateDoc(doc(db, 'users', userId, 'keywords', docId), updateData);
}

export async function deleteKeyword(userId: string, docId: string): Promise<void> {
  await deleteDoc(doc(db, 'users', userId, 'keywords', docId));
}

export async function getKeywords(userId: string): Promise<Keyword[]> {
  try {
    const q = query(
      collection(db, 'users', userId, 'keywords'),
      orderBy('createdAt', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Keyword[];
  } catch (error) {
    console.error('Error fetching keywords:', error);
    return [];
  }
}

// ============================================================
// Real-time Listener
// ============================================================

export function watchKeywords(
  userId: string,
  callback: (keywords: Keyword[]) => void
): () => void {
  const q = query(
    collection(db, 'users', userId, 'keywords'),
    orderBy('createdAt', 'asc')
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const keywords = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Keyword[];
    callback(keywords);
  });

  return unsubscribe;
}

// ============================================================
// Category Operations
// ============================================================

export async function getCategories(userId: string): Promise<string[]> {
  try {
    const doc = await getDocs(
      collection(db, 'users', userId, 'keywords')
    );
    const categories = new Set<string>();
    doc.forEach((d) => {
      const category = d.data().category;
      if (category) categories.add(category);
    });
    return Array.from(categories).sort();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return ['未分類'];
  }
}

export async function addCategory(
  userId: string,
  categoryName: string
): Promise<void> {
  // Categories are managed implicitly through keywords
  // This function is mainly for validation/UI purposes
  if (!categoryName || !categoryName.trim()) {
    throw new Error('Category name cannot be empty');
  }
}

// ============================================================
// Bulk Operations
// ============================================================

export async function bulkUpdateKeywords(
  userId: string,
  docIds: string[],
  updates: UpdateKeywordInput
): Promise<void> {
  const batch = writeBatch(db);
  const updateData = {
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  docIds.forEach((docId) => {
    const docRef = doc(db, 'users', userId, 'keywords', docId);
    batch.update(docRef, updateData);
  });

  await batch.commit();
}

export async function bulkDeleteKeywords(
  userId: string,
  docIds: string[]
): Promise<void> {
  const batch = writeBatch(db);

  docIds.forEach((docId) => {
    const docRef = doc(db, 'users', userId, 'keywords', docId);
    batch.delete(docRef);
  });

  await batch.commit();
}

// ============================================================
// User Metadata Operations
// ============================================================

export async function saveUserMetadata(
  userId: string,
  metadata: {
    categories: string[];
    lastSyncedAt: string;
  }
): Promise<void> {
  await setDoc(doc(db, 'users', userId, 'metadata'), metadata, {
    merge: true,
  });
}

export async function getUserMetadata(
  userId: string
): Promise<{ categories: string[]; lastSyncedAt: string } | null> {
  try {
    const docSnapshot = await getDocs(
      collection(db, 'users', userId)
    );
    const metadata = docSnapshot.docs
      .find((d) => d.id === 'metadata')
      ?.data();
    return (metadata as { categories: string[]; lastSyncedAt: string } | undefined) || null;
  } catch (error) {
    console.error('Error fetching user metadata:', error);
    return null;
  }
}
