'use client';

import React from 'react';
import { Keyword } from '@/types/keyword';
import { KeywordItem } from '@/components/keyword/KeywordItem';
import { Button } from '@/components/ui/Button';

interface FavoritesSectionProps {
  keywords: Keyword[];
  isEditMode?: boolean;
  selectedIndices?: Set<string>;
  onSelect?: (id: string) => void;
  onEdit?: (id: string) => void;
  onToggleEditMode?: () => void;
  onDragStart?: (e: React.DragEvent, index: number) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent, index: number) => void;
  onDragEnd?: (e: React.DragEvent) => void;
}

export function FavoritesSection({
  keywords,
  isEditMode = false,
  selectedIndices = new Set(),
  onSelect,
  onEdit,
  onToggleEditMode,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: FavoritesSectionProps) {
  if (keywords.length === 0) return null;

  return (
    <>
      <div className="px-8 py-6">
        <div className="flex justify-between items-center mb-4 pb-3 border-b-4 border-yellow-400">
          <h3 className="text-lg font-bold text-yellow-500">⭐ お気に入り</h3>
          <Button
            variant={isEditMode ? 'secondary' : 'ghost'}
            size="sm"
            onClick={onToggleEditMode}
            className={isEditMode ? 'bg-yellow-400 text-black' : ''}
          >
            {isEditMode ? '編集終了' : '編集モード'}
          </Button>
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
      <hr className="border-t-4 border-yellow-400 mx-8" />
    </>
  );
}
