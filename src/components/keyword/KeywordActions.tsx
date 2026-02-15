'use client';

import React from 'react';
import { Keyword } from '@/types/keyword';
import { useKeywords } from '@/hooks/useKeywords';
import { Button } from '@/components/ui/Button';

interface KeywordActionsProps {
  keyword: Keyword;
  isEditMode?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function KeywordActions({
  keyword,
  isEditMode = false,
  onEdit,
  onDelete,
}: KeywordActionsProps) {
  const { updateKeyword } = useKeywords();

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await updateKeyword(keyword.id, { favorited: !keyword.favorited });
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <button
        onClick={handleToggleFavorite}
        className="text-2xl cursor-pointer hover:scale-125 transition-transform"
        title="お気に入り"
      >
        {keyword.favorited ? '★' : '☆'}
      </button>
      {isEditMode && (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.();
            }}
            className="bg-yellow-400 text-black hover:bg-yellow-500"
          >
            編集
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
          >
            削除
          </Button>
        </>
      )}
    </div>
  );
}
