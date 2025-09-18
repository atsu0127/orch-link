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
  Badge,
  Modal,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import {
  IconExternalLink,
  IconMusic,
  IconPlus,
  IconEdit,
  IconTrash,
  IconCheck,
  IconAlertCircle,
  IconAlertTriangle,
} from "@tabler/icons-react";
import { formatDate } from "@/lib/utils";
import { ScoreFormData, Score } from "@/types";
import { ScoreForm } from "./ScoreForm";
import { UpdateHistoryManager } from "./UpdateHistoryManager";
import { useAuth } from "@/components/features/auth/AuthProvider";
import { fetchScores, handleApiError } from "@/lib/api-client";

interface ScoreManagementProps {
  concertId: string;
  scores: Score[];
}

/**
 * 楽譜管理APIレスポンス型
 */
interface ScoreApiResponse {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * 楽譜管理コンポーネント
 * 管理者用の楽譜CRUD機能を提供
 */
export function ScoreManagement({
  concertId,
  scores,
}: ScoreManagementProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  // 状態管理
  const [localScores, setLocalScores] = useState<Score[]>(scores);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingScore, setEditingScore] = useState<Score | null>(null);
  const [error, setError] = useState<string | null>(null);

  // プロパティ変更時にローカル状態を同期（安全パターン：concertIdベース）
  useEffect(() => {
    setLocalScores(scores);
  }, [concertId]);

  /**
   * フォームを閉じる
   */
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingScore(null);
  };

  /**
   * 新規作成モーダルを開く
   */
  const handleCreateNew = () => {
    setEditingScore(null);
    setIsFormOpen(true);
  };

  /**
   * 編集モーダルを開く
   */
  const handleEdit = (score: Score) => {
    setEditingScore(score);
    setIsFormOpen(true);
  };

  /**
   * 楽譜一覧を再読み込み
   */
  const loadScores = async () => {
    try {
      setError(null);
      const updatedScores = await fetchScores(concertId);
      setLocalScores(updatedScores);
    } catch (error) {
      console.error("Scores loading error:", error);
      setError(
        `楽譜一覧の読み込みに失敗しました: ${handleApiError(error)}`
      );
    }
  };

  /**
   * 楽譜作成API呼び出し
   */
  const createScore = async (
    data: ScoreFormData
  ): Promise<void> => {
    const response = await fetch("/api/scores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ concertId, ...data }),
    });

    const result: ScoreApiResponse = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result.error || `楽譜の作成に失敗しました: ${response.status}`
      );
    }
  };

  /**
   * 楽譜更新API呼び出し
   */
  const updateScore = async (
    scoreId: string,
    data: ScoreFormData
  ): Promise<void> => {
    const response = await fetch("/api/scores", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ scoreId, ...data }),
    });

    const result: ScoreApiResponse = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result.error || `楽譜の更新に失敗しました: ${response.status}`
      );
    }
  };

  /**
   * 楽譜削除API呼び出し
   */
  const deleteScore = async (scoreId: string): Promise<void> => {
    const response = await fetch(`/api/scores?id=${scoreId}`, {
      method: "DELETE",
      credentials: "include",
    });

    const result: ScoreApiResponse = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result.error || `楽譜の削除に失敗しました: ${response.status}`
      );
    }
  };

  /**
   * 削除実行処理
   */
  const performDelete = async (scoreId: string) => {
    try {
      setIsLoading(true);
      await deleteScore(scoreId);

      notifications.show({
        title: "削除完了",
        message: "楽譜を削除しました",
        color: "green",
        icon: <IconCheck size="1rem" />,
      });

      // 一覧を再読み込み
      await loadScores();
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
  const handleDelete = (score: Score) => {
    modals.openConfirmModal({
      title: "楽譜削除の確認",
      children: (
        <Stack gap="sm">
          <Text size="sm">「{score.title}」を削除してもよろしいですか？</Text>
          <Alert color="yellow" variant="light">
            <Text size="sm">
              <strong>注意:</strong> この操作は取り消すことができません。
              更新履歴もすべて削除されます。
            </Text>
          </Alert>
        </Stack>
      ),
      labels: { confirm: "削除する", cancel: "キャンセル" },
      confirmProps: { color: "red" },
      onConfirm: () => performDelete(score.id),
    });
  };

  /**
   * フォーム送信処理
   */
  const handleFormSubmit = async (data: ScoreFormData) => {
    try {
      setIsLoading(true);

      if (editingScore) {
        // 更新
        await updateScore(editingScore.id, data);
        notifications.show({
          title: "更新完了",
          message: "楽譜を更新しました",
          color: "green",
          icon: <IconCheck size="1rem" />,
        });
      } else {
        // 新規作成
        await createScore(data);
        notifications.show({
          title: "作成完了",
          message: "楽譜を追加しました",
          color: "green",
          icon: <IconCheck size="1rem" />,
        });
      }

      // フォームを閉じて一覧を再読み込み
      handleCloseForm();
      await loadScores();
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

  // 楽譜がない場合の表示
  if (localScores.length === 0) {
    return (
      <div className="text-center py-12">
        <IconMusic size={48} className="mx-auto text-gray-400 mb-4" />
        <Text size="lg" className="text-gray-600 mb-2">
          楽譜はまだ追加されていません
        </Text>
        <Text size="sm" className="text-gray-500">
          {isAdmin
            ? "新規追加ボタンから楽譜を追加してください"
            : "管理者が楽譜を準備次第、こちらに表示されます"}
        </Text>
        {isAdmin && (
          <Button
            leftSection={<IconPlus size="1rem" />}
            onClick={handleCreateNew}
            className="mt-4"
            disabled={isLoading}
          >
            楽譜を追加
          </Button>
        )}

        {/* 作成・編集モーダル */}
        <Modal
          opened={isFormOpen}
          onClose={handleCloseForm}
          title={editingScore ? "楽譜を編集" : "楽譜を追加"}
          centered
          size="md"
        >
          <ScoreForm
            initialData={editingScore || undefined}
            onSubmit={handleFormSubmit}
            isLoading={isLoading}
            title={editingScore ? "楽譜を編集" : "楽譜を追加"}
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
              楽譜リンク
            </Title>
            <Text size="sm" className="text-gray-600">
              {isAdmin
                ? "楽譜の管理"
                : "演奏会で使用する楽譜をダウンロードできます"}
            </Text>
          </div>
          {isAdmin && localScores.length > 0 && (
            <Button
              leftSection={<IconPlus size="1rem" />}
              onClick={handleCreateNew}
              disabled={isLoading}
              size="sm"
            >
              楽譜を追加
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

      {/* 楽譜一覧 */}
      {localScores.map((score) => (
        <Paper key={score.id} shadow="sm" p="lg" radius="md" className="border">
          <Stack gap="md">
            {/* 楽譜タイトルとリンク状態 */}
            <Group justify="space-between" align="flex-start">
              <div className="flex-1">
                <Group gap="sm" className="mb-2">
                  <Title order={4}>{score.title}</Title>

                  {/* リンク有効性表示 */}
                  {score.isValid ? (
                    <Tooltip label="リンクは正常です">
                      <Badge
                        color="green"
                        variant="light"
                        size="sm"
                        leftSection={<IconCheck size="0.8rem" />}
                      >
                        有効
                      </Badge>
                    </Tooltip>
                  ) : (
                    <Tooltip label="リンクに問題があります">
                      <Badge
                        color="red"
                        variant="light"
                        size="sm"
                        leftSection={<IconAlertTriangle size="0.8rem" />}
                      >
                        要確認
                      </Badge>
                    </Tooltip>
                  )}
                </Group>
              </div>
              {isAdmin && (
                <Group gap="xs">
                  <ActionIcon
                    variant="light"
                    color="blue"
                    onClick={() => handleEdit(score)}
                    disabled={isLoading}
                    size="sm"
                  >
                    <IconEdit size="0.9rem" />
                  </ActionIcon>
                  <ActionIcon
                    variant="light"
                    color="red"
                    onClick={() => handleDelete(score)}
                    disabled={isLoading}
                    size="sm"
                  >
                    <IconTrash size="0.9rem" />
                  </ActionIcon>
                </Group>
              )}
            </Group>

            {/* リンク切れ警告 */}
            {!score.isValid && (
              <Alert
                icon={<IconAlertTriangle size="1rem" />}
                color="red"
                variant="light"
              >
                <Text size="sm">
                  <strong>リンクエラー:</strong>{" "}
                  楽譜にアクセスできません。管理者に報告済みです。
                </Text>
              </Alert>
            )}

            {/* 楽譜を開くボタン */}
            <Group>
              <Button
                leftSection={<IconExternalLink size="1rem" />}
                onClick={() => window.open(score.url, "_blank")}
                disabled={!score.isValid}
                size="md"
                className="w-full sm:w-auto"
                variant={score.isValid ? "filled" : "light"}
              >
                楽譜を開く
              </Button>
            </Group>

            {/* 更新履歴 */}
            <UpdateHistoryManager
              comments={score.comments}
              isAdmin={isAdmin}
              onCommentUpdate={loadScores}
            />

            {/* 最終更新日時 */}
            <Text size="xs" className="text-gray-500 text-right">
              最終更新: {formatDate(score.updatedAt)}
            </Text>
          </Stack>
        </Paper>
      ))}

      {/* 補足情報 */}
      <Alert color="blue" variant="light" className="mt-4">
        <Text size="sm">
          <strong>楽譜について：</strong>
          <br />
          • 楽譜はPDF形式で提供されます
          <br />
          • ダウンロード後はオフラインでも閲覧可能です
          <br />
          • 更新があった楽譜には履歴が記載されます
          <br />• リンクに問題がある場合、管理者に自動で通知されます
        </Text>
      </Alert>

      {/* 作成・編集モーダル */}
      <Modal
        opened={isFormOpen}
        onClose={handleCloseForm}
        title={editingScore ? "楽譜を編集" : "楽譜を追加"}
        centered
        size="md"
      >
        <ScoreForm
          initialData={editingScore || undefined}
          onSubmit={handleFormSubmit}
          isLoading={isLoading}
          title={editingScore ? "楽譜を編集" : "楽譜を追加"}
          onCancel={handleCloseForm}
        />
      </Modal>
    </Stack>
  );
}