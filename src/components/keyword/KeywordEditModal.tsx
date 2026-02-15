'use client';

import React, { useState, useEffect } from 'react';
import { Keyword } from '@/types/keyword';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useKeywords } from '@/hooks/useKeywords';

interface KeywordEditModalProps {
  isOpen: boolean;
  keyword: Keyword | null;
  categories: string[];
  onClose: () => void;
  onAddCategory: (categoryName: string) => void;
}

export function KeywordEditModal({
  isOpen,
  keyword,
  categories,
  onClose,
  onAddCategory,
}: KeywordEditModalProps) {
  const [formData, setFormData] = useState({
    keyword: '',
    category: '未分類',
    memo: '',
    tags: '',
    favorited: false,
  });
  const { updateKeyword } = useKeywords();

  useEffect(() => {
    if (keyword) {
      setFormData({
        keyword: keyword.keyword,
        category: keyword.category,
        memo: keyword.memo || '',
        tags: keyword.tags?.join(', ') || '',
        favorited: keyword.favorited,
      });
    }
  }, [keyword]);

  const handleAddCategory = () => {
    const newCategory = prompt('新しいカテゴリ名を入力してください');
    if (newCategory && newCategory.trim()) {
      onAddCategory(newCategory.trim());
      setFormData({ ...formData, category: newCategory.trim() });
    }
  };

  const handleSave = async () => {
    if (!keyword || !formData.keyword.trim()) {
      alert('検索ワードを入力してください');
      return;
    }

    try {
      const tags = formData.tags
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t);

      await updateKeyword(keyword.id, {
        keyword: formData.keyword.trim(),
        category: formData.category,
        memo: formData.memo.trim(),
        tags,
        favorited: formData.favorited,
      });
      onClose();
    } catch (error) {
      console.error('Failed to update:', error);
      alert('更新に失敗しました');
    }
  };

  if (!isOpen || !keyword) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="検索ワードを編集">
      <div className="space-y-4">
        <div>
          <label className="block font-bold text-gray-700 mb-2">検索ワード</label>
          <input
            type="text"
            value={formData.keyword}
            onChange={(e) => setFormData({ ...formData, keyword: e.target.value })}
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block font-bold text-gray-700 mb-2">カテゴリ</label>
          <div className="flex gap-2">
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <Button variant="secondary" size="sm" onClick={handleAddCategory}>
              +
            </Button>
          </div>
        </div>

        <div>
          <label className="block font-bold text-gray-700 mb-2">メモ（任意）</label>
          <textarea
            value={formData.memo}
            onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
            placeholder="この検索ワードについてのメモを追加できます"
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 resize-vertical min-h-20"
          />
        </div>

        <div>
          <label className="block font-bold text-gray-700 mb-2">タグ（カンマ区切り、任意）</label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="例：料理, 簡単, 時短"
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.favorited}
            onChange={(e) => setFormData({ ...formData, favorited: e.target.checked })}
            className="w-5 h-5 cursor-pointer"
          />
          <label className="font-bold text-gray-700 cursor-pointer">お気に入りに登録する</label>
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t">
          <Button variant="secondary" onClick={onClose}>
            キャンセル
          </Button>
          <Button onClick={handleSave}>保存</Button>
        </div>
      </div>
    </Modal>
  );
}
