'use client';

import React from 'react';
import { 
  Paper, 
  Title, 
  Text, 
  Button, 
  Stack,
  Alert,
  Group,
  Badge
} from '@mantine/core';
import { IconExternalLink, IconInfoCircle, IconClipboardList } from '@tabler/icons-react';
import { AttendanceForm } from '@/types';
import { formatDate } from '@/lib/mock-data';

interface AttendanceTabProps {
  concertId: string;
  attendanceForms: AttendanceForm[];
}

/**
 * 出欠調整タブコンポーネント
 * 外部フォーム（Google Forms等）へのリンクを表示
 */
export function AttendanceTab({ attendanceForms }: AttendanceTabProps) {
  // 演奏会に紐づく出欠調整がない場合
  if (attendanceForms.length === 0) {
    return (
      <div className="text-center py-12">
        <IconClipboardList size={48} className="mx-auto text-gray-400 mb-4" />
        <Text size="lg" className="text-gray-600 mb-2">
          出欠調整はまだ準備されていません
        </Text>
        <Text size="sm" className="text-gray-500">
          管理者がフォームを準備次第、こちらに表示されます
        </Text>
      </div>
    );
  }

  return (
    <Stack gap="lg">
      {/* ヘッダー情報 */}
      <div>
        <Title order={3} className="mb-2">出欠調整</Title>
        <Text size="sm" className="text-gray-600">
          演奏会への参加可否をお知らせください
        </Text>
      </div>

      {/* 出欠調整一覧 */}
      {attendanceForms.map((form) => (
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
            </Group>

            {/* 説明文 */}
            {form.description && (
              <Alert icon={<IconInfoCircle size="1rem" />} color="blue" variant="light">
                {form.description}
              </Alert>
            )}

            {/* フォームへのリンクボタン */}
            <Group>
              <Button
                leftSection={<IconExternalLink size="1rem" />}
                onClick={() => window.open(form.url, '_blank')}
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
          <strong>注意事項：</strong><br />
          • 出欠調整は外部サービスで管理されています<br />
          • フォーム送信後、確認メールが届かない場合は管理者にお問い合わせください<br />
          • 参加予定の変更がある場合は、お早めにご連絡ください
        </Text>
      </Alert>
    </Stack>
  );
}