"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Modal,
  Alert,
  Stack,
  Text,
  Group,
  Button,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconAlertCircle, IconPlus } from "@tabler/icons-react";
import { useAuth } from "@/components/features/auth/AuthProvider";
import { PracticeForm } from "./PracticeForm";
import { Practice } from "@/types";
import { PracticeFormData, PracticeApiResponse } from "@/types/practice";
import { handleApiError } from "@/lib/api-client";

interface PracticeManagementProps {
  /** 演奏会ID - この演奏会の練習予定を管理 */
  concertId: string;
  /** 練習予定更新時のコールバック */
  onPracticeUpdate?: () => void;
  /** 編集対象の練習予定（外部から指定） */
  initialEditingPractice?: Practice | null;
}

/**
 * 練習予定管理コンポーネント
 * 管理者専用の練習予定CRUD機能
 */
export function PracticeManagement({
  concertId,
  onPracticeUpdate,
  initialEditingPractice,
}: PracticeManagementProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  // 状態管理
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPractice, setEditingPractice] = useState<Practice | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * 練習予定一覧を取得
   */
  const loadPractices = useCallback(async () => {
    try {
      setError(null);
      // 練習予定一覧は親コンポーネントで管理されるため、API呼び出しは不要
      // 親コンポーネントに更新を通知するのみ
      if (onPracticeUpdate) {
        onPracticeUpdate();
      }
    } catch (error) {
      console.error("Practice loading error:", error);
      setError(
        `練習予定一覧の読み込みに失敗しました: ${handleApiError(error)}`
      );
    }
  }, [onPracticeUpdate]);

  // 初期化時の処理は不要（親コンポーネントで管理）

  // 外部から編集対象の練習予定が指定された場合の処理
  useEffect(() => {
    if (initialEditingPractice) {
      setEditingPractice(initialEditingPractice);
      setIsFormOpen(true);
    }
  }, [initialEditingPractice]);

  /**
   * 練習予定作成API呼び出し
   */
  const createPractice = async (data: PracticeFormData): Promise<void> => {
    const practiceData = {
      ...data,
      concertId,
      startTime: new Date(data.startTime),
      endTime: data.endTime ? new Date(data.endTime) : undefined,
    };

    const response = await fetch("/api/practices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(practiceData),
    });

    const result: PracticeApiResponse = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result.error || `練習予定の作成に失敗しました: ${response.status}`
      );
    }
  };

  /**
   * 練習予定更新API呼び出し
   */
  const updatePractice = async (
    practiceId: string,
    data: PracticeFormData
  ): Promise<void> => {
    const practiceData = {
      practiceId,
      ...data,
      concertId,
      startTime: new Date(data.startTime),
      endTime: data.endTime ? new Date(data.endTime) : undefined,
    };

    const response = await fetch("/api/practices", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(practiceData),
    });

    const result: PracticeApiResponse = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result.error || `練習予定の更新に失敗しました: ${response.status}`
      );
    }
  };

  /**
   * フォーム送信処理
   */
  const handleFormSubmit = async (data: PracticeFormData) => {
    try {
      setIsLoading(true);

      if (editingPractice) {
        // 更新
        await updatePractice(editingPractice.id, data);
        notifications.show({
          title: "更新完了",
          message: "練習予定を更新しました",
          color: "green",
          icon: <IconCheck size="1rem" />,
        });
      } else {
        // 新規作成
        await createPractice(data);
        notifications.show({
          title: "作成完了",
          message: "練習予定を作成しました",
          color: "green",
          icon: <IconCheck size="1rem" />,
        });
      }

      // フォームを閉じて一覧を再読み込み
      handleCloseForm();
      await loadPractices();

      // 親コンポーネントに通知
      if (onPracticeUpdate) {
        onPracticeUpdate();
      }
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
    setEditingPractice(null);
    setIsFormOpen(true);
  };

  /**
   * フォームを閉じる
   */
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingPractice(null);
    
    // 親コンポーネントにも通知（編集状態をクリア）
    if (onPracticeUpdate) {
      onPracticeUpdate();
    }
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
            <Button onClick={loadPractices} variant="light">
              再読み込み
            </Button>
          </Group>
        </Stack>
      </Container>
    );
  }

  return (
    <>
      {/* 新規作成ボタン */}
      <Group justify="flex-end">
        <Button
          leftSection={<IconPlus size="1rem" />}
          onClick={handleCreateNew}
          disabled={isLoading}
        >
          練習予定を追加
        </Button>
      </Group>

      {/* 作成・編集フォームモーダル */}
      <Modal
        opened={isFormOpen}
        onClose={handleCloseForm}
        title={editingPractice ? "練習予定を編集" : "練習予定を作成"}
        size="md"
        centered
      >
        <PracticeForm
          initialData={editingPractice || undefined}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseForm}
          isLoading={isLoading}
          title={editingPractice ? "練習予定を編集" : "練習予定を作成"}
        />
      </Modal>
    </>
  );
}
