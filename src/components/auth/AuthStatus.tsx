'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useKeywords } from '@/hooks/useKeywords';
import { LoginButton } from './LoginButton';
import { LogoutButton } from './LogoutButton';

export function AuthStatus() {
  const { user, isAuthenticated } = useAuth();
  const { isSynced } = useKeywords();

  if (!isAuthenticated || !user) {
    return <LoginButton />;
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3 bg-white bg-opacity-20 rounded-xl px-4 py-3">
        {user.photoURL && (
          <img
            src={user.photoURL}
            alt="avatar"
            className="w-8 h-8 rounded-full border-2 border-white"
          />
        )}
        <span className="font-bold text-white">{user.displayName || user.email}</span>
        <LogoutButton />
      </div>
      <div className="text-sm text-white opacity-90">
        {isSynced ? '✓ 同期完了' : '同期中...'}
      </div>
    </div>
  );
}
