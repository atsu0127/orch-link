"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Modal,
  Alert,
  Stack,
  Text,
  Group,
  Button,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconAlertCircle, IconCheck } from "@tabler/icons-react";
import { ConcertForm } from "./ConcertForm";
import { ConcertList } from "./ConcertList";
import { useAuth } from "@/components/features/auth/AuthProvider";
import { fetchConcerts, handleApiError } from "@/lib/api-client";
import { Concert } from "@/types";
import { ConcertFormData } from "@/types/concert";

/**
 * Concert管理APIレスポンス型
 */
interface ConcertApiResponse {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * 演奏会管理メインコンポーネント
 * 管理者専用の演奏会CRUD操作を提供
 */
export function ConcertManagement() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  // 状態管理
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingConcert, setEditingConcert] = useState<Concert | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 初期化時にコンサート一覧を取得
  useEffect(() => {
    if (isAdmin) {
      loadConcerts();
    }
  }, [isAdmin]);

  /**
   * 演奏会一覧を取得
   */
  const loadConcerts = async () => {
    try {
      setError(null);
      // 管理者は全ての演奏会（アクティブ・非アクティブ含む）を取得
      const concertList = await fetchConcerts(false);
      setConcerts(concertList);
    } catch (error) {
      console.error("Concert loading error:", error);
      setError(`演奏会一覧の読み込みに失敗しました: ${handleApiError(error)}`);
    }
  };

  /**
   * 演奏会作成API呼び出し
   */
  const createConcert = async (data: ConcertFormData): Promise<void> => {
    const response = await fetch("/api/concerts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });

    const result: ConcertApiResponse = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || `演奏会の作成に失敗しました: ${response.status}`);
    }
  };

  /**
   * 演奏会更新API呼び出し
   */
  const updateConcert = async (concertId: string, data: ConcertFormData): Promise<void> => {
    const response = await fetch("/api/concerts", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ concertId, ...data }),
    });

    const result: ConcertApiResponse = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || `演奏会の更新に失敗しました: ${response.status}`);
    }
  };

  /**
   * 演奏会削除API呼び出し
   */
  const deleteConcert = async (concertId: string): Promise<void> => {
    const response = await fetch(`/api/concerts?id=${concertId}`, {
      method: "DELETE",
      credentials: "include",
    });

    const result: ConcertApiResponse = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || `演奏会の削除に失敗しました: ${response.status}`);
    }
  };

  /**
   * フォーム送信処理
   */
  const handleFormSubmit = async (data: ConcertFormData) => {
    try {
      setIsLoading(true);

      if (editingConcert) {
        // 更新
        await updateConcert(editingConcert.id, data);
        notifications.show({
          title: "更新完了",
          message: "演奏会を更新しました",
          color: "green",
          icon: <IconCheck size="1rem" />,
        });
      } else {
        // 新規作成
        await createConcert(data);
        notifications.show({
          title: "作成完了",
          message: "演奏会を作成しました",
          color: "green",
          icon: <IconCheck size="1rem" />,
        });
      }

      // フォームを閉じて一覧を再読み込み
      handleCloseForm();
      await loadConcerts();

    } catch (error) {
      console.error("Form submission error:", error);
      notifications.show({
        title: "エラー",
        message: handleApiError(error),
        color: "red",
        icon: <IconAlertCircle size="1rem" />,
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 新規作成モーダルを開く
   */
  const handleCreateNew = () => {
    setEditingConcert(null);
    setIsFormOpen(true);
  };

  /**
   * 編集モーダルを開く
   */
  const handleEdit = (concert: Concert) => {
    setEditingConcert(concert);
    setIsFormOpen(true);
  };

  /**
   * 削除確認ダイアログ
   */
  const handleDelete = (concert: Concert) => {
    modals.openConfirmModal({
      title: "演奏会を削除",
      children: (
        <Stack gap="sm">
          <Text size="sm">
            「{concert.title}」を削除してもよろしいですか？
          </Text>
          <Alert color="yellow" variant="light">
            <Text size="sm">
              <strong>注意:</strong> この操作により関連する出欠調整・楽譜・練習予定も全て削除されます。
            </Text>
          </Alert>
        </Stack>
      ),
      labels: { confirm: "削除する", cancel: "キャンセル" },
      confirmProps: { color: "red" },
      onConfirm: () => performDelete(concert.id),
    });
  };

  /**
   * 削除実行
   */
  const performDelete = async (concertId: string) => {
    try {
      setIsLoading(true);
      await deleteConcert(concertId);
      
      notifications.show({
        title: "削除完了",
        message: "演奏会を削除しました",
        color: "green",
        icon: <IconCheck size="1rem" />,
      });

      await loadConcerts();

    } catch (error) {
      console.error("Delete error:", error);
      notifications.show({
        title: "削除エラー",
        message: handleApiError(error),
        color: "red",
        icon: <IconAlertCircle size="1rem" />,
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * フォームを閉じる
   */
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingConcert(null);
  };

  // 管理者でない場合はアクセス拒否
  if (!isAdmin) {
    return (
      <Container size="md" className="py-8">
        <Alert color="red" variant="light">
          <Text>管理者権限が必要です。</Text>
        </Alert>
      </Container>
    );
  }

  // エラー表示
  if (error) {
    return (
      <Container size="md" className="py-8">
        <Stack gap="md">
          <Alert
            icon={<IconAlertCircle size="1rem" />}
            color="red"
            variant="light"
          >
            {error}
          </Alert>
          <Group>
            <Button onClick={loadConcerts} variant="light">
              再読み込み
            </Button>
          </Group>
        </Stack>
      </Container>
    );
  }

  return (
    <Container size="lg" className="py-8">
      <Stack gap="lg">
        {/* 演奏会一覧 */}
        <ConcertList
          concerts={concerts}
          onCreateNew={handleCreateNew}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={isLoading}
        />

        {/* 作成・編集フォームモーダル */}
        <Modal
          opened={isFormOpen}
          onClose={handleCloseForm}
          title={editingConcert ? "演奏会を編集" : "演奏会を作成"}
          size="md"
          centered
        >
          <ConcertForm
            initialData={editingConcert || undefined}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseForm}
            isLoading={isLoading}
            title={editingConcert ? "演奏会を編集" : "演奏会を作成"}
          />
        </Modal>
      </Stack>
    </Container>
  );
}