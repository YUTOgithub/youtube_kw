'use client';

import React from 'react';
import { Keyword } from '@/types/keyword';
import { KeywordItem } from '@/components/keyword/KeywordItem';
import { Button } from '@/components/ui/Button';

interface CategorySectionProps {
  categoryName: string;
  keywords: Keyword[];
  isEditMode?: boolean;
  selectedIndices?: Set<string>;
  onSelect?: (id: string) => void;
  onEdit?: (id: string) => void;
  onToggleEditMode?: () => void;
  onAddCategory?: () => void;
  onDragStart?: (e: React.DragEvent, index: number) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent, index: number) => void;
  onDragEnd?: (e: React.DragEvent) => void;
}

export function CategorySection({
  categoryName,
  keywords,
  isEditMode = false,
  selectedIndices = new Set(),
  onSelect,
  onEdit,
  onToggleEditMode,
  onAddCategory,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: CategorySectionProps) {
  if (keywords.length === 0) return null;

  return (
    <div className="px-8 py-6 border-b border-gray-200">
      <div className="flex justify-between items-center mb-4 pb-3 border-b-2 border-gray-200">
        <h3 className="text-lg font-bold text-gray-700">{categoryName}</h3>
        <div className="flex gap-2">
          {isEditMode && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onAddCategory}
              className="bg-gray-600 text-white hover:bg-gray-700"
            >
              カテゴリ追加
            </Button>
          )}
          <Button
            variant={isEditMode ? 'secondary' : 'ghost'}
            size="sm"
            onClick={onToggleEditMode}
            className={isEditMode ? 'bg-yellow-400 text-black' : ''}
          >
            {isEditMode ? '編集終了' : '編集モード'}
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {keywords.map((keyword, index) => (
          <KeywordItem
            key={keyword.id}
            keyword={keyword}
            isEditMode={isEditMode}
            isSelected={selectedIndices.has(keyword.id)}
            onSelect={onSelect}
            onEdit={onEdit}
            index={index}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onDragEnd={onDragEnd}
          />
        ))}
      </div>
    </div>
  );
}
