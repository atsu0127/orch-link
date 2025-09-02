"use client";

import React from "react";
import {
  Paper,
  Title,
  Text,
  Button,
  Stack,
  Alert,
  Group,
  Badge,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import {
  IconMusic,
  IconEdit,
  IconTrash,
  IconPlus,
  IconCalendar,
  IconMapPin,
} from "@tabler/icons-react";
import { formatDateOnly } from "@/lib/utils";
import { Concert } from "@/types";
import { useAuth } from "@/components/features/auth/AuthProvider";

interface ConcertListProps {
  /** 演奏会リスト */
  concerts: Concert[];
  /** 新規作成ボタンのハンドラ */
  onCreateNew?: () => void;
  /** 編集ボタンのハンドラ */
  onEdit?: (concert: Concert) => void;
  /** 削除ボタンのハンドラ */
  onDelete?: (concert: Concert) => void;
  /** ローディング状態 */
  isLoading?: boolean;
}

/**
 * 演奏会一覧表示コンポーネント
 * 管理者向けの演奏会リストと操作ボタンを提供
 */
export function ConcertList({
  concerts,
  onCreateNew,
  onEdit,
  onDelete,
  isLoading = false,
}: ConcertListProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  // 演奏会がない場合
  if (concerts.length === 0) {
    return (
      <div className="text-center py-12">
        <IconMusic size={48} className="mx-auto text-gray-400 mb-4" />
        <Text size="lg" className="text-gray-600 mb-2">
          演奏会がまだ登録されていません
        </Text>
        <Text size="sm" className="text-gray-500 mb-6">
          {isAdmin ? "新しい演奏会を作成してください" : "管理者が演奏会を準備次第、こちらに表示されます"}
        </Text>
        {isAdmin && onCreateNew && (
          <Button
            leftSection={<IconPlus size="1rem" />}
            onClick={onCreateNew}
            loading={isLoading}
          >
            演奏会を作成
          </Button>
        )}
      </div>
    );
  }

  return (
    <Stack gap="lg">
      {/* ヘッダー情報 */}
      <Group justify="space-between" align="center">
        <div>
          <Title order={3} className="mb-2">
            演奏会管理
          </Title>
          <Text size="sm" className="text-gray-600">
            演奏会の作成・編集・削除ができます
          </Text>
        </div>
        
        {/* 新規作成ボタン */}
        {isAdmin && onCreateNew && (
          <Button
            leftSection={<IconPlus size="1rem" />}
            onClick={onCreateNew}
            loading={isLoading}
          >
            演奏会を作成
          </Button>
        )}
      </Group>

      {/* 演奏会一覧 */}
      {concerts.map((concert) => (
        <Paper key={concert.id} shadow="sm" p="lg" radius="md" className="border">
          <Stack gap="md">
            {/* 演奏会タイトルとステータス */}
            <Group justify="space-between" align="flex-start">
              <div className="flex-1">
                <Group gap="sm" className="mb-2">
                  <Title order={4}>{concert.title}</Title>
                  
                  {/* アクティブ状態表示 */}
                  <Badge
                    color={concert.isActive ? "green" : "gray"}
                    variant="light"
                    size="sm"
                  >
                    {concert.isActive ? "アクティブ" : "非アクティブ"}
                  </Badge>
                </Group>
              </div>

              {/* 管理者操作ボタン */}
              {isAdmin && (
                <Group gap="xs">
                  {onEdit && (
                    <Tooltip label="編集">
                      <ActionIcon
                        variant="light"
                        color="blue"
                        onClick={() => onEdit(concert)}
                        disabled={isLoading}
                      >
                        <IconEdit size="1rem" />
                      </ActionIcon>
                    </Tooltip>
                  )}
                  
                  {onDelete && (
                    <Tooltip label="削除">
                      <ActionIcon
                        variant="light"
                        color="red"
                        onClick={() => onDelete(concert)}
                        disabled={isLoading}
                      >
                        <IconTrash size="1rem" />
                      </ActionIcon>
                    </Tooltip>
                  )}
                </Group>
              )}
            </Group>

            {/* 演奏会詳細情報 */}
            <Stack gap="sm">
              {/* 開催日 */}
              <Group gap="sm">
                <IconCalendar size="1rem" className="text-gray-500" />
                <Text size="sm" className="font-medium">
                  開催日: {formatDateOnly(concert.date)}
                </Text>
              </Group>

              {/* 開催場所 */}
              <Group gap="sm">
                <IconMapPin size="1rem" className="text-gray-500" />
                <Text size="sm">
                  開催場所: {concert.venue}
                </Text>
              </Group>
            </Stack>

            {/* 最終更新日時 */}
            <Text size="xs" className="text-gray-500 text-right">
              最終更新: {formatDateOnly(concert.updatedAt)}
            </Text>
          </Stack>
        </Paper>
      ))}

      {/* 管理者向け補足情報 */}
      {isAdmin && (
        <Alert color="blue" variant="light" className="mt-4">
          <Text size="sm">
            <strong>演奏会管理について：</strong>
            <br />
            • アクティブな演奏会のみユーザーに表示されます
            <br />
            • 演奏会を削除すると、関連する出欠調整・楽譜・練習予定も削除されます
            <br />
            • 編集は即座に反映されます
          </Text>
        </Alert>
      )}
    </Stack>
  );
}