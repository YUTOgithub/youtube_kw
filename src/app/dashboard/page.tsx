'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Container } from '@/components/layout/Container';
import { Header } from '@/components/header/Header';
import { KeywordForm } from '@/components/keyword/KeywordForm';
import { KeywordList } from '@/components/keyword/KeywordList';
import { BulkActionsBar } from '@/components/bulk/BulkActionsBar';

export default function Dashboard() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
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

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Container className="mb-20">
        <Header />
        <KeywordForm />
        <KeywordList />
      </Container>
      <BulkActionsBar />
    </>
  );
}
