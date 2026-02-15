'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';

export function LogoutButton() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    if (confirm('ログアウトしますか？')) {
      try {
        await logout();
      } catch (error) {
        console.error('Logout failed:', error);
      }
    }
  };

  return (
    <Button variant="secondary" size="sm" onClick={handleLogout}>
      ログアウト
    </Button>
  );
}
