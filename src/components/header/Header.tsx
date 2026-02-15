'use client';

import React from 'react';
import { AuthStatus } from '@/components/auth/AuthStatus';

export function Header() {
  return (
    <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-8 text-center">
      <h1 className="text-4xl font-bold mb-2">📺 検索ワードをお気に入り登録</h1>
      <p className="text-base opacity-90 mb-6">
        チャンネルごとではなく、【検索ワード】ごとに管理できるサイトです
      </p>
      <AuthStatus />
    </div>
  );
}
