import { useState, useCallback } from 'react';

export function useDragDrop() {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(-1);

  const handleDragStart = useCallback((index: number) => {
    setIsDragging(true);
    setDraggedIndex(index);
  }, []);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    setDraggedIndex(-1);
  }, []);

  return {
    isDragging,
    draggedIndex,
    handleDragStart,
    handleDragEnd,
  };
}
