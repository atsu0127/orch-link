"use client";

import React, { useState } from "react";
import {
  Paper,
  Title,
  Text,
  Button,
  Stack,
  Group,
  Badge,
  ActionIcon,
  Alert,
  LoadingOverlay,
  Modal,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconCalendar,
  IconMapPin,
  IconEdit,
  IconTrash,
  IconAlertCircle,
  IconPlus,
} from "@tabler/icons-react";
import { Concert } from "@/types";
import { formatDateOnly } from "@/lib/seed-helpers";

interface ConcertListProps {
  concerts: Concert[];
  isLoading: boolean;
  error: string | null;
  onEdit: (concert: Concert) => void;
  onDelete: (concertId: string) => Promise<void>;
  onAdd: () => void;
}

/**
 * 演奏会一覧管理コンポーネント
 * 管理者用の演奏会一覧表示と編集・削除操作
 */
export function ConcertList({
  concerts,
  isLoading,
  error,
  onEdit,
  onDelete,
  onAdd,
}: ConcertListProps) {
  // 削除確認モーダルの状態管理
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
  const [selectedConcert, setSelectedConcert] = useState<Concert | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  /**
   * 削除確認モーダルを開く
   */
  const handleDeleteClick = (concert: Concert) => {
    setSelectedConcert(concert);
    openDeleteModal();
  };

  /**
   * 削除実行
   */
  const handleDeleteConfirm = async () => {
    if (!selectedConcert) return;

    setIsDeleting(true);
    try {
      await onDelete(selectedConcert.id);
      closeDeleteModal();
      setSelectedConcert(null);
    } catch (error) {
      console.error("削除エラー:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  /**
   * 削除キャンセル
   */
  const handleDeleteCancel = () => {
    closeDeleteModal();
    setSelectedConcert(null);
  };

  return (
    <div className="relative">
      <LoadingOverlay visible={isLoading} />
      
      <Stack gap="lg">
        {/* ヘッダー */}
        <Group justify="space-between" align="center">
          <div>
            <Title order={2} className="mb-2">演奏会管理</Title>
            <Text size="sm" className="text-gray-600">
              演奏会の作成、編集、削除を行えます
            </Text>
          </div>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={onAdd}
            disabled={isLoading}
          >
            新規作成
          </Button>
        </Group>

        {/* エラー表示 */}
        {error && (
          <Alert icon={<IconAlertCircle size="1rem" />} color="red">
            {error}
          </Alert>
        )}

        {/* 演奏会一覧 */}
        {!isLoading && concerts.length === 0 ? (
          <div className="text-center py-12">
            <IconCalendar size={48} className="mx-auto text-gray-400 mb-4" />
            <Text size="lg" className="text-gray-600 mb-2">
              演奏会はまだ登録されていません
            </Text>
            <Text size="sm" className="text-gray-500 mb-4">
              新規作成ボタンから最初の演奏会を登録してください
            </Text>
            <Button
              leftSection={<IconPlus size={16} />}
              onClick={onAdd}
              variant="light"
            >
              新規作成
            </Button>
          </div>
        ) : (
          <Stack gap="md">
            {concerts.map((concert) => (
              <Paper key={concert.id} shadow="sm" p="md" radius="md">
                <Group justify="space-between" align="flex-start">
                  <div className="flex-1">
                    {/* 演奏会タイトル */}
                    <Group mb="xs">
                      <Title order={4} className="text-gray-800">
                        {concert.title}
                      </Title>
                      <Badge
                        color={concert.isActive ? "green" : "gray"}
                        variant="light"
                        size="sm"
                      >
                        {concert.isActive ? "アクティブ" : "無効"}
                      </Badge>
                    </Group>

                    {/* 演奏会情報 */}
                    <Stack gap="xs">
                      <Group gap="sm">
                        <IconCalendar size={16} className="text-gray-500" />
                        <Text size="sm" className="text-gray-700">
                          {formatDateOnly(new Date(concert.date))}
                        </Text>
                      </Group>
                      <Group gap="sm">
                        <IconMapPin size={16} className="text-gray-500" />
                        <Text size="sm" className="text-gray-700">
                          {concert.venue}
                        </Text>
                      </Group>
                    </Stack>
                  </div>

                  {/* アクションボタン */}
                  <Group gap="xs">
                    <ActionIcon
                      variant="light"
                      color="blue"
                      size="lg"
                      onClick={() => onEdit(concert)}
                      title="編集"
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon
                      variant="light"
                      color="red"
                      size="lg"
                      onClick={() => handleDeleteClick(concert)}
                      title="削除"
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </Group>
              </Paper>
            ))}
          </Stack>
        )}
      </Stack>

      {/* 削除確認モーダル */}
      <Modal
        opened={deleteModalOpened}
        onClose={handleDeleteCancel}
        title="演奏会の削除確認"
        centered
      >
        <Stack gap="md">
          <Text>
            「{selectedConcert?.title}」を削除しますか？
          </Text>
          <Text size="sm" className="text-gray-600">
            この操作により演奏会は非アクティブ状態になり、
            一般ユーザーには表示されなくなります。
          </Text>
          <Group justify="flex-end" mt="md">
            <Button
              variant="subtle"
              onClick={handleDeleteCancel}
              disabled={isDeleting}
            >
              キャンセル
            </Button>
            <Button
              color="red"
              onClick={handleDeleteConfirm}
              loading={isDeleting}
            >
              削除
            </Button>
          </Group>
        </Stack>
      </Modal>
    </div>
  );
}