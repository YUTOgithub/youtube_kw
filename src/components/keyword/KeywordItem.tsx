'use client';

import React from 'react';
import { Keyword } from '@/types/keyword';
import { useKeywords } from '@/hooks/useKeywords';
import { KeywordActions } from './KeywordActions';

interface KeywordItemProps {
  keyword: Keyword;
  isEditMode?: boolean;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDragStart?: (e: React.DragEvent, index: number) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent, index: number) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  index?: number;
}

export function KeywordItem({
  keyword,
  isEditMode = false,
  isSelected = false,
  onSelect,
  onEdit,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  index = 0,
}: KeywordItemProps) {
  const { deleteKeyword } = useKeywords();

  const handleDelete = async () => {
    if (confirm('この検索ワードを削除してもよろしいですか？')) {
      try {
        await deleteKeyword(keyword.id);
      } catch (error) {
        console.error('Failed to delete:', error);
      }
    }
  };

  const handleClick = () => {
    if (!isEditMode) {
      window.open(
        `https://www.youtube.com/results?search_query=${encodeURIComponent(keyword.keyword)}`,
        '_blank'
      );
    }
  };

  return (
    <div
      draggable={isEditMode}
      onDragStart={(e) => onDragStart?.(e, index)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop?.(e, index)}
      onDragEnd={onDragEnd}
      onClick={handleClick}
      className={`p-4 border-2 border-gray-200 rounded-xl flex items-center gap-3 transition-all cursor-pointer
        ${isEditMode ? 'cursor-default' : 'hover:border-indigo-500 hover:shadow-lg hover:-translate-y-0.5'}
        ${isSelected ? 'bg-indigo-50 border-indigo-300' : 'bg-white hover:bg-gray-50'}
      `}
    >
      {isEditMode && (
        <>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect?.(keyword.id)}
            className="w-5 h-5 cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="text-xl text-gray-400">⋮⋮</div>
        </>
      )}

      <div className="flex-1">
        <div className="font-bold text-gray-800">{keyword.keyword}</div>
        {keyword.memo && <div className="text-sm text-gray-600 mt-1">{keyword.memo}</div>}
        {keyword.tags && keyword.tags.length > 0 && (
          <div className="flex gap-2 mt-2 flex-wrap">
            {keyword.tags.map((tag) => (
              <span key={tag} className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <KeywordActions
        keyword={keyword}
        isEditMode={isEditMode}
        onEdit={() => onEdit?.(keyword.id)}
        onDelete={handleDelete}
      />
    </div>
  );
}
