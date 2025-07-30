"use client";

import React from "react";
import {
  LoadingOverlay,
  Alert,
  Container,
  Paper,
  Title,
  Text,
  Group,
  Button,
} from "@mantine/core";
import { IconAlertCircle, IconArrowLeft } from "@tabler/icons-react";
import { AuthProvider, useAuth } from "@/components/features/auth/AuthProvider";
import Link from "next/link";

interface AdminLayoutProps {
  children: React.ReactNode;
}

/**
 * 管理者権限チェックコンポーネント
 * AuthProvider内でuseAuthを使用するための内部コンポーネント
 */
function AdminContent({ children }: AdminLayoutProps) {
  const { user, isLoading } = useAuth();

  // ローディング中
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LoadingOverlay visible />
      </div>
    );
  }

  // 未認証の場合はログインページにリダイレクト
  if (!user) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return null;
  }

  // 管理者権限がない場合はアクセス拒否
  if (user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Container size="sm">
          <Paper shadow="md" p="xl" radius="md" className="text-center">
            <Alert
              icon={<IconAlertCircle size="1rem" />}
              color="red"
              className="mb-6"
            >
              管理者権限が必要です
            </Alert>
            <Title order={3} className="mb-4">
              アクセス権限がありません
            </Title>
            <Text className="text-gray-600 mb-6">
              この機能は管理者のみ利用できます。
              <br />
              管理者権限でログインし直してください。
            </Text>
            <Group justify="center">
              <Button
                component={Link}
                href="/"
                leftSection={<IconArrowLeft size={16} />}
                variant="light"
              >
                ホームに戻る
              </Button>
              <Button component={Link} href="/login">
                ログイン画面へ
              </Button>
            </Group>
          </Paper>
        </Container>
      </div>
    );
  }

  // 管理者用レイアウト
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white shadow-sm border-b">
        <Container size="xl" p="md">
          <Group justify="space-between" align="center">
            <div>
              <Title order={2} className="text-blue-700">
                Orch Link 管理画面
              </Title>
              <Text size="sm" className="text-gray-600">
                演奏会情報の管理
              </Text>
            </div>
            <Group gap="md">
              <Text size="sm" className="text-gray-600">
                ログイン中: 管理者
              </Text>
              <Button
                component={Link}
                href="/"
                variant="light"
                leftSection={<IconArrowLeft size={16} />}
              >
                ユーザー画面へ
              </Button>
            </Group>
          </Group>
        </Container>
      </div>

      {/* メインコンテンツ */}
      <Container size="xl" p="md">
        <div className="py-6">{children}</div>
      </Container>
    </div>
  );
}

/**
 * 管理者専用レイアウトコンポーネント
 * AuthProviderでラップして認証機能を提供
 */
export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AuthProvider>
      <AdminContent>{children}</AdminContent>
    </AuthProvider>
  );
}
