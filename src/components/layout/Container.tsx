import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function Container({ children, className = '' }: ContainerProps) {
  return (
    <div className={`max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden ${className}`}>
      {children}
    </div>
  );
}
