'use client';

import React from 'react';
import { 
  Paper, 
  Title, 
  Text, 
  Button, 
  Stack,
  Group,
  Badge,
  Alert,
  Divider
} from '@mantine/core';
import { 
  IconArrowLeft, 
  IconClock, 
  IconMapPin, 
  IconBackpack,
  IconInfoCircle,
  IconNote,
  IconMusic,
  IconVideo
} from '@tabler/icons-react';
import { Practice } from '@/types';
import { formatDate, formatTimeRange } from '@/lib/mock-data';

interface PracticeDetailProps {
  practice: Practice;
  onBack: () => void;
}

/**
 * 練習詳細コンポーネント
 * 個別の練習予定の詳細情報を表示
 */
export function PracticeDetail({ practice, onBack }: PracticeDetailProps) {
  const isPast = practice.startTime <= new Date();

  return (
    <Stack gap="lg">
      {/* 戻るボタン */}
      <Group>
        <Button 
          variant="subtle" 
          leftSection={<IconArrowLeft size="1rem" />}
          onClick={onBack}
        >
          練習一覧に戻る
        </Button>
      </Group>

      {/* メイン情報 */}
      <Paper shadow="sm" p="xl" radius="md" className="border">
        <Stack gap="lg">
          {/* タイトルとステータス */}
          <Group justify="space-between" align="flex-start">
            <div>
              <Title order={3} className="mb-2">
                {practice.title}
              </Title>
              {isPast && (
                <Badge color="gray" size="lg" variant="light">
                  終了済み
                </Badge>
              )}
            </div>
          </Group>

          <Divider />

          {/* 基本情報 */}
          <Stack gap="md">
            {/* 日時 */}
            <Group gap="sm">
              <IconClock size="1.2rem" className="text-blue-600" />
              <div>
                <Text size="sm" className="text-gray-600 mb-1">日時</Text>
                <Text size="lg" className="font-semibold">
                  {practice.endTime 
                    ? `${formatDate(practice.startTime).split(' ')[0]} ${formatTimeRange(practice.startTime, practice.endTime)}`
                    : formatDate(practice.startTime)
                  }
                </Text>
              </div>
            </Group>

            {/* 場所 */}
            <Group gap="sm" align="flex-start">
              <IconMapPin size="1.2rem" className="text-red-600 mt-1" />
              <div>
                <Text size="sm" className="text-gray-600 mb-1">練習場所</Text>
                <Text size="lg" className="font-semibold">
                  {practice.venue}
                </Text>
                {practice.address && (
                  <Text size="sm" className="text-gray-600 mt-1">
                    {practice.address}
                  </Text>
                )}
              </div>
            </Group>
          </Stack>

          <Divider />

          {/* 詳細情報 */}
          <Stack gap="lg">
            {/* 持ち物 */}
            {practice.items && (
              <div>
                <Group gap="sm" className="mb-3">
                  <IconBackpack size="1.2rem" className="text-green-600" />
                  <Title order={5}>持ち物</Title>
                </Group>
                <Alert color="green" variant="light">
                  <Text size="sm">{practice.items}</Text>
                </Alert>
              </div>
            )}

            {/* 注意事項 */}
            {practice.notes && (
              <div>
                <Group gap="sm" className="mb-3">
                  <IconInfoCircle size="1.2rem" className="text-orange-600" />
                  <Title order={5}>注意事項</Title>
                </Group>
                <Alert color="orange" variant="light">
                  <Text size="sm">{practice.notes}</Text>
                </Alert>
              </div>
            )}

            {/* メモ */}
            {practice.memo && (
              <div>
                <Group gap="sm" className="mb-3">
                  <IconNote size="1.2rem" className="text-blue-600" />
                  <Title order={5}>メモ</Title>
                </Group>
                <Paper p="md" className="bg-blue-50 border border-blue-200">
                  <Text size="sm">{practice.memo}</Text>
                </Paper>
              </div>
            )}

            {/* 関連録音 */}
            {practice.audioUrl && (
              <div>
                <Group gap="sm" className="mb-3">
                  <IconMusic size="1.2rem" className="text-purple-600" />
                  <Title order={5}>関連録音</Title>
                </Group>
                <audio controls className="w-full">
                  <source src={practice.audioUrl} type="audio/mpeg" />
                  お使いのブラウザは音声再生に対応していません。
                </audio>
              </div>
            )}

            {/* 関連録画 */}
            {practice.videoUrl && (
              <div>
                <Group gap="sm" className="mb-3">
                  <IconVideo size="1.2rem" className="text-indigo-600" />
                  <Title order={5}>関連録画</Title>
                </Group>
                <video controls className="w-full">
                  <source src={practice.videoUrl} type="video/mp4" />
                  お使いのブラウザは動画再生に対応していません。
                </video>
              </div>
            )}
          </Stack>

          <Divider />

          {/* 最終更新情報 */}
          <Text size="xs" className="text-gray-500 text-right">
            最終更新: {formatDate(practice.updatedAt)}
          </Text>
        </Stack>
      </Paper>

      {/* 補足情報 */}
      <Alert color="blue" variant="light">
        <Text size="sm">
          <strong>練習について：</strong><br />
          • 練習開始15分前には会場にお越しください<br />
          • 遅刻・欠席の場合は事前にご連絡ください<br />
          • 録音がある場合は個人練習の参考にご活用ください
        </Text>
      </Alert>
    </Stack>
  );
}