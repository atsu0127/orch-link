"use client";

import React, { useState } from "react";
import {
  Paper,
  Title,
  PasswordInput,
  Button,
  Stack,
  Radio,
  Group,
  Alert,
  Container,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { useAuth } from "./AuthProvider";

/**
 * ログインフォームコンポーネント
 * 管理者・閲覧者両方に対応した共通ログインフォーム
 */
export function LoginForm() {
  // 認証コンテキストを使用
  const { login, isLoading } = useAuth();

  // フォーム状態管理
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "viewer">("viewer");
  const [error, setError] = useState("");

  /**
   * フォーム送信処理
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 入力値検証
    if (!password.trim()) {
      setError("パスワードを入力してください");
      return;
    }

    // ログイン実行
    const success = await login(password, role);

    if (success) {
      // ログイン成功時はメインページにリダイレクト
      window.location.href = "/";
    } else {
      setError("パスワードが正しくありません");
    }
  };

  return (
    <Container
      size="xs"
      className="min-h-screen flex items-center justify-center p-4"
    >
      <Paper shadow="md" p="xl" radius="md" className="w-full">
        <Title order={2} className="text-center mb-6">
          Orch Link
        </Title>

        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            {/* ロール選択 */}
            <div>
              <label className="block text-sm font-medium mb-2">
                ログイン種別
              </label>
              <Radio.Group
                value={role}
                onChange={(value) => setRole(value as "admin" | "viewer")}
              >
                <Group mt="xs">
                  <Radio
                    value="viewer"
                    label="エキストラ（閲覧者）"
                    description="演奏会情報の閲覧・出欠入力"
                  />
                  <Radio
                    value="admin"
                    label="管理者"
                    description="全ての情報の編集・管理"
                  />
                </Group>
              </Radio.Group>
            </div>

            {/* パスワード入力 */}
            <PasswordInput
              label="パスワード"
              placeholder="パスワードを入力してください"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              required
              disabled={isLoading}
            />

            {/* エラーメッセージ */}
            {error && (
              <Alert icon={<IconAlertCircle size="1rem" />} color="red">
                {error}
              </Alert>
            )}

            {/* ログインボタン */}
            <Button
              type="submit"
              loading={isLoading}
              size="md"
              className="mt-4"
            >
              ログイン
            </Button>

            {/* ヘルプテキスト */}
            <div className="text-sm text-gray-600 text-center mt-4">
              <p className="mb-2">
                <strong>エキストラの方：</strong>{" "}
                配布されたパスワードをご入力ください
              </p>
              <p>
                <strong>管理者の方：</strong> 管理者パスワードをご入力ください
              </p>
            </div>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
