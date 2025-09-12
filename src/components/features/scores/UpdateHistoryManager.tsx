"use client";

import React, { useState } from "react";
import {
  Accordion,
  Text,
  Group,
  ActionIcon,
  Stack,
  Button,
  Textarea,
  Alert,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import {
  IconClock,
  IconEdit,
  IconTrash,
  IconCheck,
  IconX,
  IconAlertCircle,
} from "@tabler/icons-react";
import { formatDate } from "@/lib/utils";
import { ScoreComment } from "@/types";
import { handleApiError } from "@/lib/api-client";

interface UpdateHistoryManagerProps {
  /** 楽譜のコメント一覧 */
  comments: ScoreComment[];
  /** 管理者権限チェック */
  isAdmin: boolean;
  /** コメント更新後のコールバック */
  onCommentUpdate: () => void;
}

/**
 * 楽譜更新履歴管理コンポーネント
 * コメントの表示、編集、削除機能を提供
 */
export function UpdateHistoryManager({
  comments,
  isAdmin,
  onCommentUpdate,
}: UpdateHistoryManagerProps) {
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  /**
   * コメント編集開始
   */
  const startEditing = (comment: ScoreComment) => {
    setEditingCommentId(comment.id);
    setEditingContent(comment.content);
  };

  /**
   * 編集キャンセル
   */
  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditingContent("");
  };

  /**
   * コメント更新処理
   */
  const updateComment = async (commentId: string) => {
    if (!editingContent.trim()) {
      notifications.show({
        message: "コメント内容を入力してください",
        color: "red",
        icon: <IconAlertCircle size="1rem" />,
      });
      return;
    }

    try {
      setIsLoading(true);
      
      const response = await fetch("/api/score-comments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ 
          commentId, 
          content: editingContent.trim() 
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || `コメントの更新に失敗しました: ${response.status}`
        );
      }

      notifications.show({
        title: "更新完了",
        message: "コメントを更新しました",
        color: "green",
        icon: <IconCheck size="1rem" />,
      });

      cancelEditing();
      onCommentUpdate();
    } catch (error) {
      console.error("Comment update error:", error);
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
   * コメント削除処理
   */
  const deleteComment = async (commentId: string) => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`/api/score-comments?id=${commentId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || `コメントの削除に失敗しました: ${response.status}`
        );
      }

      notifications.show({
        title: "削除完了",
        message: "コメントを削除しました",
        color: "green",
        icon: <IconCheck size="1rem" />,
      });

      onCommentUpdate();
    } catch (error) {
      console.error("Comment delete error:", error);
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
  const handleDelete = (comment: ScoreComment) => {
    modals.openConfirmModal({
      title: "コメント削除の確認",
      children: (
        <Stack gap="sm">
          <Text size="sm">このコメントを削除してもよろしいですか？</Text>
          <Alert color="yellow" variant="light">
            <Text size="sm">
              <strong>注意:</strong> この操作は取り消すことができません。
            </Text>
          </Alert>
        </Stack>
      ),
      labels: { confirm: "削除する", cancel: "キャンセル" },
      confirmProps: { color: "red" },
      onConfirm: () => deleteComment(comment.id),
    });
  };

  // コメントが無い場合は表示しない
  if (comments.length === 0) {
    return null;
  }

  // 時系列順にソート（新しいものが上）
  const sortedComments = [...comments].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );

  return (
    <Accordion variant="separated" radius="md">
      <Accordion.Item value="history">
        <Accordion.Control icon={<IconClock size="1rem" />}>
          更新履歴 ({comments.length}件)
        </Accordion.Control>
        <Accordion.Panel>
          <Stack gap="xs">
            {sortedComments.map((comment) => (
              <div
                key={comment.id}
                className="p-3 bg-gray-50 rounded-md"
              >
                {editingCommentId === comment.id ? (
                  // 編集モード
                  <Stack gap="sm">
                    <Textarea
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.currentTarget.value)}
                      minRows={2}
                      disabled={isLoading}
                      placeholder="コメント内容を入力してください"
                    />
                    <Group gap="sm">
                      <Button
                        size="xs"
                        onClick={() => updateComment(comment.id)}
                        loading={isLoading}
                        leftSection={<IconCheck size="0.8rem" />}
                      >
                        保存
                      </Button>
                      <Button
                        size="xs"
                        variant="light"
                        onClick={cancelEditing}
                        disabled={isLoading}
                        leftSection={<IconX size="0.8rem" />}
                      >
                        キャンセル
                      </Button>
                    </Group>
                  </Stack>
                ) : (
                  // 表示モード
                  <>
                    <Group justify="space-between" align="flex-start" className="mb-2">
                      <Text size="sm" className="flex-1">
                        {comment.content}
                      </Text>
                      {isAdmin && (
                        <Group gap="xs">
                          <ActionIcon
                            size="sm"
                            variant="light"
                            color="blue"
                            onClick={() => startEditing(comment)}
                            disabled={isLoading || editingCommentId !== null}
                          >
                            <IconEdit size="0.7rem" />
                          </ActionIcon>
                          <ActionIcon
                            size="sm"
                            variant="light"
                            color="red"
                            onClick={() => handleDelete(comment)}
                            disabled={isLoading || editingCommentId !== null}
                          >
                            <IconTrash size="0.7rem" />
                          </ActionIcon>
                        </Group>
                      )}
                    </Group>
                    <Text size="xs" className="text-gray-500">
                      {formatDate(comment.createdAt)}
                    </Text>
                  </>
                )}
              </div>
            ))}
          </Stack>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}