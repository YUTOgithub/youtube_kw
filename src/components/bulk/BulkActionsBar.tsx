'use client';

import React, { useState } from 'react';
import { useKeywords } from '@/hooks/useKeywords';
import { Button } from '@/components/ui/Button';

export function BulkActionsBar() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const { selectedIndices, categories, isEditMode, bulkUpdateCategory, bulkDelete } =
    useKeywords();

  if (selectedIndices.size === 0) return null;

  const handleChangeCategory = async () => {
    if (!selectedCategory) {
      alert('カテゴリを選択してください');
      return;
    }
    const ids = Array.from(selectedIndices);
    try {
      await bulkUpdateCategory(ids, selectedCategory);
      setSelectedCategory('');
    } catch (error) {
      console.error('Failed to change category:', error);
      alert('更新に失敗しました');
    }
  };

  const handleDelete = async () => {
    if (!confirm(`${selectedIndices.size}個の検索ワードを削除してもよろしいですか？`)) {
      return;
    }
    const ids = Array.from(selectedIndices);
    try {
      await bulkDelete(ids);
    } catch (error) {
      console.error('Failed to delete:', error);
      alert('削除に失敗しました');
    }
  };

  const handleOpenYouTube = () => {
    const keywords = Array.from(selectedIndices).map((id) => id);
    const searchQuery = keywords.join(' ');
    window.open(
      `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`,
      '_blank'
    );
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-indigo-500 shadow-2xl p-5">
      <div className="max-w-4xl mx-auto flex justify-between items-center gap-4 flex-wrap">
        <div className="font-bold text-indigo-600 text-lg">{selectedIndices.size}個選択中</div>

        <div className="flex gap-2 flex-wrap">
          {isEditMode ? (
            <>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border-2 border-gray-300 rounded-lg"
              >
                <option value="">カテゴリを選択</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <Button variant="primary" size="sm" onClick={handleChangeCategory}>
                カテゴリ変更
              </Button>
              <Button variant="danger" size="sm" onClick={handleDelete}>
                削除
              </Button>
            </>
          ) : (
            <Button variant="primary" size="sm" onClick={handleOpenYouTube}>
              YouTubeで検索
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
