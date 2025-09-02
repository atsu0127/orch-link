"use client";

import React, { useState } from "react";
import {
  Paper,
  Title,
  Text,
  Button,
  Stack,
  Alert,
  Group,
  Badge,
  Modal,
  ActionIcon,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import {
  IconExternalLink,
  IconInfoCircle,
  IconClipboardList,
  IconPlus,
  IconEdit,
  IconTrash,
  IconCheck,
  IconAlertCircle,
} from "@tabler/icons-react";
import { formatDate } from "@/lib/utils";
import { AttendanceForm, AttendanceFormData } from "@/types";
import { AttendanceForm as AttendanceFormComponent } from "./AttendanceForm";
import { useAuth } from "@/components/features/auth/AuthProvider";
import { fetchAttendanceForms, handleApiError } from "@/lib/api-client";

interface AttendanceTabProps {
  concertId: string;
  attendanceForms: AttendanceForm[];
}

/**
 * 出欠調整管理APIレスポンス型
 */
interface AttendanceApiResponse {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * 出欠調整タブコンポーネント
 * 外部フォーム（Google Forms等）へのリンクを表示
 */
export function AttendanceTab({
  concertId,
  attendanceForms,
}: AttendanceTabProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  // 状態管理
  const [localForms, setLocalForms] =
    useState<AttendanceForm[]>(attendanceForms);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingForm, setEditingForm] = useState<AttendanceForm | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * フォームを閉じる
   */
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingForm(null);
  };

  /**
   * 新規作成モーダルを開く
   */
  const handleCreateNew = () => {
    setEditingForm(null);
    setIsFormOpen(true);
  };

  /**
   * 編集モーダルを開く
   */
  const handleEdit = (form: AttendanceForm) => {
    setEditingForm(form);
    setIsFormOpen(true);
  };

  /**
   * 出欠調整一覧を再読み込み
   */
  const loadAttendanceForms = async () => {
    try {
      setError(null);
      const forms = await fetchAttendanceForms(concertId);
      setLocalForms(forms);
    } catch (error) {
      console.error("Attendance forms loading error:", error);
      setError(
        `出欠調整一覧の読み込みに失敗しました: ${handleApiError(error)}`
      );
    }
  };

  /**
   * 出欠調整作成API呼び出し
   */
  const createAttendanceForm = async (
    data: AttendanceFormData
  ): Promise<void> => {
    const response = await fetch("/api/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ concertId, ...data }),
    });

    const result: AttendanceApiResponse = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result.error || `出欠調整の作成に失敗しました: ${response.status}`
      );
    }
  };

  /**
   * 出欠調整更新API呼び出し
   */
  const updateAttendanceForm = async (
    formId: string,
    data: AttendanceFormData
  ): Promise<void> => {
    const response = await fetch("/api/attendance", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ attendanceFormId: formId, ...data }),
    });

    const result: AttendanceApiResponse = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result.error || `出欠調整の更新に失敗しました: ${response.status}`
      );
    }
  };

  /**
   * 出欠調整削除API呼び出し
   */
  const deleteAttendanceForm = async (formId: string): Promise<void> => {
    const response = await fetch(`/api/attendance?id=${formId}`, {
      method: "DELETE",
      credentials: "include",
    });

    const result: AttendanceApiResponse = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result.error || `出欠調整の削除に失敗しました: ${response.status}`
      );
    }
  };

  /**
   * 削除実行処理
   */
  const performDelete = async (formId: string) => {
    try {
      setIsLoading(true);
      await deleteAttendanceForm(formId);

      notifications.show({
        title: "削除完了",
        message: "出欠調整を削除しました",
        color: "green",
        icon: <IconCheck size="1rem" />,
      });

      // 一覧を再読み込み
      await loadAttendanceForms();
    } catch (error) {
      console.error("Delete error:", error);
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
   * 削除確認ダイアログ
   */
  const handleDelete = (form: AttendanceForm) => {
    modals.openConfirmModal({
      title: "出欠調整を削除",
      children: (
        <Stack gap="sm">
          <Text size="sm">「{form.title}」を削除してもよろしいですか？</Text>
          <Alert color="yellow" variant="light">
            <Text size="sm">
              <strong>注意:</strong> この操作は取り消すことができません。
            </Text>
          </Alert>
        </Stack>
      ),
      labels: { confirm: "削除する", cancel: "キャンセル" },
      confirmProps: { color: "red" },
      onConfirm: () => performDelete(form.id),
    });
  };

  /**
   * フォーム送信処理
   */
  const handleFormSubmit = async (data: AttendanceFormData) => {
    try {
      setIsLoading(true);

      if (editingForm) {
        // 更新
        await updateAttendanceForm(editingForm.id, data);
        notifications.show({
          title: "更新完了",
          message: "出欠調整を更新しました",
          color: "green",
          icon: <IconCheck size="1rem" />,
        });
      } else {
        // 新規作成
        await createAttendanceForm(data);
        notifications.show({
          title: "作成完了",
          message: "出欠調整を作成しました",
          color: "green",
          icon: <IconCheck size="1rem" />,
        });
      }

      // フォームを閉じて一覧を再読み込み
      handleCloseForm();
      await loadAttendanceForms();
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

  // 演奏会に紐づく出欠調整がない場合
  // 演奏会に紐づく出欠調整がない場合
  if (localForms.length === 0) {
    return (
      <div className="text-center py-12">
        <IconClipboardList size={48} className="mx-auto text-gray-400 mb-4" />
        <Text size="lg" className="text-gray-600 mb-2">
          出欠調整はまだ準備されていません
        </Text>
        <Text size="sm" className="text-gray-500">
          {isAdmin
            ? "新規作成ボタンから出欠調整を作成してください"
            : "管理者がフォームを準備次第、こちらに表示されます"}
        </Text>
        {isAdmin && (
          <Button
            leftSection={<IconPlus size="1rem" />}
            onClick={handleCreateNew}
            className="mt-4"
            disabled={isLoading}
          >
            新規出欠調整を作成
          </Button>
        )}

        {/* 作成・編集モーダル */}
        <Modal
          opened={isFormOpen}
          onClose={handleCloseForm}
          title={editingForm ? "出欠調整を編集" : "出欠調整を作成"}
          centered
          size="md"
        >
          <AttendanceFormComponent
            initialData={editingForm || undefined}
            onSubmit={handleFormSubmit}
            isLoading={isLoading}
            title={editingForm ? "出欠調整を編集" : "出欠調整を作成"}
            onCancel={handleCloseForm}
          />
        </Modal>
      </div>
    );
  }

  return (
    <Stack gap="lg">
      {/* ヘッダー情報 */}
      <div>
        <Group justify="space-between" align="flex-start">
          <div>
            <Title order={3} className="mb-2">
              出欠調整
            </Title>
            <Text size="sm" className="text-gray-600">
              {isAdmin
                ? "出欠調整の管理"
                : "演奏会への参加可否をお知らせください"}
            </Text>
          </div>
          {isAdmin && localForms.length > 0 && (
            <Button
              leftSection={<IconPlus size="1rem" />}
              onClick={handleCreateNew}
              disabled={isLoading}
              size="sm"
            >
              新規作成
            </Button>
          )}
        </Group>
      </div>

      {/* エラー表示 */}
      {error && (
        <Alert icon={<IconAlertCircle size="1rem" />} color="red">
          {error}
        </Alert>
      )}

      {/* 出欠調整一覧 */}
      {localForms.map((form) => (
        <Paper key={form.id} shadow="sm" p="lg" radius="md" className="border">
          <Stack gap="md">
            {/* フォームタイトルとバッジ */}
            <Group justify="space-between" align="flex-start">
              <div className="flex-1">
                <Title order={4} className="mb-2">
                  {form.title}
                </Title>
                <Badge color="blue" variant="light" size="sm">
                  外部フォーム
                </Badge>
              </div>
              {isAdmin && (
                <Group gap="xs">
                  <ActionIcon
                    variant="light"
                    color="blue"
                    onClick={() => handleEdit(form)}
                    disabled={isLoading}
                    size="sm"
                  >
                    <IconEdit size="0.9rem" />
                  </ActionIcon>
                  <ActionIcon
                    variant="light"
                    color="red"
                    onClick={() => handleDelete(form)}
                    disabled={isLoading}
                    size="sm"
                  >
                    <IconTrash size="0.9rem" />
                  </ActionIcon>
                </Group>
              )}
            </Group>

            {/* 説明文 */}
            {form.description && (
              <Alert
                icon={<IconInfoCircle size="1rem" />}
                color="blue"
                variant="light"
              >
                {form.description}
              </Alert>
            )}

            {/* フォームへのリンクボタン */}
            <Group>
              <Button
                leftSection={<IconExternalLink size="1rem" />}
                onClick={() => window.open(form.url, "_blank")}
                size="md"
                className="w-full sm:w-auto"
              >
                出欠調整を開く
              </Button>
            </Group>

            {/* 最終更新日時 */}
            <Text size="xs" className="text-gray-500 text-right">
              最終更新: {formatDate(form.updatedAt)}
            </Text>
          </Stack>
        </Paper>
      ))}

      {/* 補足情報 */}
      <Alert color="gray" variant="light" className="mt-4">
        <Text size="sm">
          <strong>注意事項：</strong>
          <br />
          • 出欠調整は外部サービスで管理されています
          <br />
          •
          フォーム送信後、確認メールが届かない場合は管理者にお問い合わせください
          <br />• 参加予定の変更がある場合は、お早めにご連絡ください
        </Text>
      </Alert>

      {/* 作成・編集モーダル */}
      <Modal
        opened={isFormOpen}
        onClose={handleCloseForm}
        title={editingForm ? "出欠調整を編集" : "出欠調整を作成"}
        centered
        size="md"
      >
        <AttendanceFormComponent
          initialData={editingForm || undefined}
          onSubmit={handleFormSubmit}
          isLoading={isLoading}
          title={editingForm ? "出欠調整を編集" : "出欠調整を作成"}
          onCancel={handleCloseForm}
        />
      </Modal>
    </Stack>
  );
}
