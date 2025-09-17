"use client";

import React, { useState, useEffect } from "react";
import {
  Paper,
  Title,
  Text,
  Button,
  Stack,
  Alert,
  Group,
  LoadingOverlay,
  Modal,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconMail, IconInfoCircle, IconCopy, IconCheck, IconEdit, IconX } from "@tabler/icons-react";
import { formatDate } from "@/lib/utils";
import { fetchContactInfo, handleApiError } from "@/lib/api-client";
import { ContactInfo } from "@/types";
import { useAuth } from "@/components/features/auth/AuthProvider";

interface ContactTabProps {
  concertId: string;
}

/**
 * 連絡タブコンポーネント
 * 管理者への連絡手段（メール）を提供
 */
export function ContactTab({}: ContactTabProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 管理者編集モーダル用状態管理
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", description: "" });

  // useClipboardフックでコピー機能を追加
  const clipboard = useClipboard({ timeout: 1000 });

  // コンポーネントマウント時に連絡先情報を取得
  useEffect(() => {
    const loadContactInfo = async () => {
      try {
        setIsLoading(true);
        const data = await fetchContactInfo();
        setContactInfo(data);
        setError(null);
      } catch (err) {
        console.error("連絡先情報取得エラー:", err);
        setError(handleApiError(err));
      } finally {
        setIsLoading(false);
      }
    };

    loadContactInfo();
  }, []);

  // ローディング中
  if (isLoading) {
    return (
      <div className="relative min-h-[400px]">
        <LoadingOverlay visible />
      </div>
    );
  }

  // エラー時
  if (error) {
    return (
      <div className="text-center py-12">
        <Alert color="red" className="max-w-md mx-auto">
          <Text size="sm">連絡先情報の取得に失敗しました: {error}</Text>
        </Alert>
      </div>
    );
  }

  // 連絡先情報が存在しない場合
  if (!contactInfo) {
    return (
      <div className="text-center py-12">
        <IconMail size={48} className="mx-auto text-gray-400 mb-4" />
        <Text size="lg" className="text-gray-600 mb-2">
          連絡先情報が設定されていません
        </Text>
        <Text size="sm" className="text-gray-500">
          管理者が連絡先を設定次第、こちらに表示されます
        </Text>
      </div>
    );
  }

  // 管理者編集モーダルを開く処理
  const handleEditModalOpen = () => {
    if (contactInfo) {
      setFormData({
        email: contactInfo.email,
        description: contactInfo.description,
      });
      setIsEditModalOpen(true);
    }
  };

  // 管理者編集モーダルを閉じる処理
  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setFormData({ email: "", description: "" });
  };

  // フォーム送信処理
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // バリデーション
    if (!formData.email || !formData.description) {
      notifications.show({
        title: "エラー",
        message: "メールアドレスと説明文は必須です",
        color: "red",
        icon: <IconX size="1rem" />,
      });
      return;
    }

    // メールアドレス形式の検証（APIと同じregex）
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      notifications.show({
        title: "エラー",
        message: "有効なメールアドレスを入力してください",
        color: "red",
        icon: <IconX size="1rem" />,
      });
      return;
    }

    try {
      setIsFormLoading(true);

      const response = await fetch("/api/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // JWT認証用クッキー
        body: JSON.stringify({
          email: formData.email,
          description: formData.description,
        }),
      });

      if (!response.ok) {
        throw new Error("更新に失敗しました");
      }

      notifications.show({
        title: "更新完了",
        message: "連絡先情報を更新しました",
        color: "green",
        icon: <IconCheck size="1rem" />,
      });

      // 連絡先情報を再取得
      const loadContactInfo = async () => {
        try {
          const data = await fetchContactInfo();
          setContactInfo(data);
        } catch (err) {
          console.error("連絡先情報再取得エラー:", err);
        }
      };
      await loadContactInfo();

      handleEditModalClose();
    } catch (error) {
      console.error("Contact update error:", error);
      notifications.show({
        title: "エラー",
        message: handleApiError(error),
        color: "red",
        icon: <IconX size="1rem" />,
      });
    } finally {
      setIsFormLoading(false);
    }
  };

  return (
    <Stack gap="lg">
      {/* ヘッダー情報 */}
      <div>
        <Group justify="space-between" align="flex-start">
          <div>
            <Title order={3} className="mb-2">
              管理者への連絡
            </Title>
            <Text size="sm" className="text-gray-600">
              演奏会に関するお問い合わせやご質問はこちら
            </Text>
          </div>
          {isAdmin && contactInfo && (
            <Button
              variant="light"
              size="sm"
              leftSection={<IconEdit size="0.9rem" />}
              onClick={handleEditModalOpen}
              disabled={isFormLoading}
            >
              編集
            </Button>
          )}
        </Group>
      </div>

      {/* メイン連絡先カード */}
      <Paper shadow="sm" p="xl" radius="md" className="border">
        <Stack gap="lg">
          {/* 説明文 */}
          <div>
            <Title order={4} className="mb-3">
              お問い合わせについて
            </Title>
            <Text size="sm" className="leading-relaxed">
              {contactInfo.description}
            </Text>
          </div>

          {/* 連絡先情報 - クリックでコピー */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <Group gap="sm" className="mb-2">
              <IconMail size="1.2rem" className="text-blue-600" />
              <Title order={5}>メールアドレス</Title>
            </Group>
            <Group gap="sm" align="center">
              <Text
                size="lg"
                className="font-mono font-semibold text-blue-800 cursor-pointer hover:text-blue-900 transition-colors"
                onClick={() => clipboard.copy(contactInfo.email)}
                title="クリックでコピー"
              >
                {contactInfo.email}
              </Text>
              <Button
                variant="subtle"
                size="xs"
                color={clipboard.copied ? "green" : "blue"}
                leftSection={
                  clipboard.copied ? <IconCheck size="0.8rem" /> : <IconCopy size="0.8rem" />
                }
                onClick={() => clipboard.copy(contactInfo.email)}
              >
                {clipboard.copied ? "コピー済み" : "コピー"}
              </Button>
            </Group>
          </div>


          {/* 最終更新日時 */}
          <Text size="xs" className="text-gray-500 text-right">
            最終更新: {formatDate(contactInfo.updatedAt)}
          </Text>
        </Stack>
      </Paper>

      {/* お問い合わせガイド */}
      <Alert icon={<IconInfoCircle size="1rem" />} color="blue" variant="light">
        <Title order={6} className="mb-2">
          お問い合わせの際のお願い
        </Title>
        <Text size="sm">
          <strong>
            以下の情報をお知らせいただけると、より迅速に対応できます：
          </strong>
          <br />
          • お名前（匿名でも結構です）
          <br />
          • 参加予定の演奏会名
          <br />
          • お問い合わせの種類（楽譜、スケジュール、その他）
          <br />
          • 具体的なご質問内容
          <br />• 返信をご希望の場合は連絡先
        </Text>
      </Alert>

      {/* よくある質問 */}
      <Paper p="lg" className="border border-gray-200">
        <Title order={5} className="mb-3">
          よくあるお問い合わせ
        </Title>
        <Stack gap="sm">
          <div>
            <Text size="sm" className="font-semibold mb-1">
              Q. 楽譜のリンクが開けません
            </Text>
            <Text size="sm" className="text-gray-600 ml-4">
              A.
              リンク切れは自動で管理者に通知されます。しばらくお待ちいただくか、直接ご連絡ください。
            </Text>
          </div>

          <div>
            <Text size="sm" className="font-semibold mb-1">
              Q. 練習の参加可否を変更したい
            </Text>
            <Text size="sm" className="text-gray-600 ml-4">
              A. 出欠調整から再度送信するか、メールで直接ご連絡ください。
            </Text>
          </div>

          <div>
            <Text size="sm" className="font-semibold mb-1">
              Q. 演奏会の詳細情報を知りたい
            </Text>
            <Text size="sm" className="text-gray-600 ml-4">
              A.
              具体的な質問内容をメールでお知らせください。詳細をご案内いたします。
            </Text>
          </div>
        </Stack>
      </Paper>

      {/* 管理者編集モーダル */}
      <Modal
        opened={isEditModalOpen}
        onClose={handleEditModalClose}
        title="連絡先情報を編集"
        centered
        size="md"
      >
        <form onSubmit={handleFormSubmit}>
          <Stack gap="md">
            <TextInput
              label="メールアドレス"
              placeholder="admin@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              disabled={isFormLoading}
              data-autofocus
            />

            <Textarea
              label="説明文"
              placeholder="お問い合わせについての説明文を入力してください"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              disabled={isFormLoading}
              autosize
              minRows={3}
              maxRows={8}
            />

            <Group justify="flex-end" gap="sm">
              <Button
                variant="subtle"
                onClick={handleEditModalClose}
                disabled={isFormLoading}
              >
                キャンセル
              </Button>
              <Button
                type="submit"
                loading={isFormLoading}
                leftSection={<IconCheck size="1rem" />}
              >
                更新する
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Stack>
  );
}
