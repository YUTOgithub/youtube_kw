'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Container } from '@/components/layout/Container';
import { Header } from '@/components/header/Header';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <Container>
        <Header />
        <div className="p-8 text-center text-gray-500">読み込み中...</div>
      </Container>
    );
  }

  return (
    <Container>
      <Header />
    </Container>
  );
}
