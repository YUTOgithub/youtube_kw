'use client';

import React, { useState } from 'react';
import { useKeywords } from '@/hooks/useKeywords';
import { Button } from '@/components/ui/Button';

export function KeywordForm() {
  const [keyword, setKeyword] = useState('');
  const { addKeyword, isLoading } = useKeywords();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) {
      alert('検索ワードを入力してください');
      return;
    }
    try {
      await addKeyword({ keyword: keyword.trim() });
      setKeyword('');
    } catch (error) {
      console.error('Failed to add keyword:', error);
      alert('追加に失敗しました');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 bg-gray-50">
      <div className="flex gap-3">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="検索ワードを入力（例：料理レシピ）"
          className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          disabled={isLoading}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
        />
        <Button
          type="submit"
          className="whitespace-nowrap"
          disabled={isLoading}
        >
          追加
        </Button>
      </div>
    </form>
  );
}
