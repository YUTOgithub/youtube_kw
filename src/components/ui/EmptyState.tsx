import React from 'react';

interface EmptyStateProps {
  icon: string;
  title: string;
  description?: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="text-center py-16 text-gray-500">
      <div className="text-6xl mb-4">{icon}</div>
      <p className="text-xl font-semibold mb-2">{title}</p>
      {description && <p className="text-sm">{description}</p>}
    </div>
  );
}
