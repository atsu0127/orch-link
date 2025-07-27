'use client';

import React, { useEffect } from 'react';
import { AuthProvider, useAuth } from '@/components/features/auth/AuthProvider';
import { LoginForm } from '@/components/features/auth/LoginForm';

/**
 * ログインページコンポーネント（内部）
 * 認証状態をチェックしてリダイレクトまたはログインフォームを表示
 */
function LoginPageContent() {
  const { user, isLoading } = useAuth();

  // 認証済みユーザーをメインページにリダイレクト
  useEffect(() => {
    if (user && !isLoading) {
      window.location.href = '/';
    }
  }, [user, isLoading]);

  // ローディング中は何も表示しない
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  // 認証済みの場合は空の画面（リダイレクト待ち）
  if (user) {
    return null;
  }

  // 未認証の場合はログインフォームを表示
  return <LoginForm />;
}

/**
 * ログインページコンポーネント（エクスポート用）
 * AuthProviderでラップして認証機能を提供
 */
export default function LoginPage() {
  return (
    <AuthProvider>
      <LoginPageContent />
    </AuthProvider>
  );
}