'use client';

import React, { useState } from 'react';
import { useKeywords } from '@/hooks/useKeywords';
import { FavoritesSection } from '@/components/category/FavoritesSection';
import { CategorySection } from '@/components/category/CategorySection';
import { KeywordEditModal } from './KeywordEditModal';
import { EmptyState } from '@/components/ui/EmptyState';

export function KeywordList() {
  const {
    keywords,
    categories,
    isEditMode,
    selectedIndices,
    isLoading,
    toggleEditMode,
    toggleSelection,
    addCategory,
    reorderKeywords,
  } = useKeywords();

  const [editingKeywordId, setEditingKeywordId] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState(-1);

  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-500">
        読み込み中...
      </div>
    );
  }

  if (keywords.length === 0) {
    return (
      <EmptyState
        icon="🔍"
        title="まだ検索ワードが登録されていません"
        description="上のフォームから追加してみましょう！"
      />
    );
  }

  const favoriteKeywords = keywords.filter((k) => k.favorited);
  const categorizedKeywords: { [key: string]: typeof keywords } = {};
  keywords
    .filter((k) => !k.favorited)
    .forEach((k) => {
      if (!categorizedKeywords[k.category]) {
        categorizedKeywords[k.category] = [];
      }
      categorizedKeywords[k.category].push(k);
    });

  const handleAddCategory = () => {
    const newCategory = prompt('新しいカテゴリ名を入力してください');
    if (newCategory && newCategory.trim()) {
      addCategory(newCategory.trim());
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== dropIndex && draggedIndex !== -1) {
      reorderKeywords(draggedIndex, dropIndex);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(-1);
  };

  return (
    <>
      {favoriteKeywords.length > 0 && (
        <FavoritesSection
          keywords={favoriteKeywords}
          isEditMode={isEditMode}
          selectedIndices={selectedIndices}
          onSelect={toggleSelection}
          onEdit={(id) => setEditingKeywordId(id)}
          onToggleEditMode={toggleEditMode}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragEnd={handleDragEnd}
        />
      )}

      {Object.entries(categorizedKeywords).map(([category, keywordsInCategory]) => (
        <CategorySection
          key={category}
          categoryName={category}
          keywords={keywordsInCategory}
          isEditMode={isEditMode}
          selectedIndices={selectedIndices}
          onSelect={toggleSelection}
          onEdit={(id) => setEditingKeywordId(id)}
          onToggleEditMode={toggleEditMode}
          onAddCategory={handleAddCategory}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragEnd={handleDragEnd}
        />
      ))}

      {editingKeywordId && (
        <KeywordEditModal
          isOpen={!!editingKeywordId}
          keyword={keywords.find((k) => k.id === editingKeywordId) || null}
          categories={categories}
          onClose={() => setEditingKeywordId(null)}
          onAddCategory={addCategory}
        />
      )}
    </>
  );
}
