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
  Badge,
  Accordion,
  Tooltip
} from '@mantine/core';
import { 
  IconMusic, 
  IconExternalLink, 
  IconAlertTriangle,
  IconCheck,
  IconClock
} from '@tabler/icons-react';
import { Score } from '@/types';
import { formatDate } from '@/lib/mock-data';

interface ScoresTabProps {
  concertId: string;
  scores: Score[];
}

/**
 * 楽譜リンクタブコンポーネント
 * 楽譜PDFへのリンクと更新履歴を表示
 */
export function ScoresTab({ scores }: ScoresTabProps) {
  // 楽譜がない場合
  if (scores.length === 0) {
    return (
      <div className="text-center py-12">
        <IconMusic size={48} className="mx-auto text-gray-400 mb-4" />
        <Text size="lg" className="text-gray-600 mb-2">
          楽譜はまだアップロードされていません
        </Text>
        <Text size="sm" className="text-gray-500">
          管理者が楽譜を準備次第、こちらに表示されます
        </Text>
      </div>
    );
  }

  return (
    <Stack gap="lg">
      {/* ヘッダー情報 */}
      <div>
        <Title order={3} className="mb-2">楽譜リンク</Title>
        <Text size="sm" className="text-gray-600">
          演奏会で使用する楽譜をダウンロードできます
        </Text>
      </div>

      {/* 楽譜一覧 */}
      {scores.map((score) => (
        <Paper key={score.id} shadow="sm" p="lg" radius="md" className="border">
          <Stack gap="md">
            {/* 楽譜タイトルとリンク状態 */}
            <Group justify="space-between" align="flex-start">
              <div className="flex-1">
                <Group gap="sm" className="mb-2">
                  <Title order={4}>
                    {score.title}
                  </Title>
                  
                  {/* リンク有効性表示 */}
                  {score.isValid ? (
                    <Tooltip label="リンクは正常です">
                      <Badge color="green" variant="light" size="sm" leftSection={<IconCheck size="0.8rem" />}>
                        有効
                      </Badge>
                    </Tooltip>
                  ) : (
                    <Tooltip label="リンクに問題があります">
                      <Badge color="red" variant="light" size="sm" leftSection={<IconAlertTriangle size="0.8rem" />}>
                        要確認
                      </Badge>
                    </Tooltip>
                  )}
                </Group>
              </div>
            </Group>

            {/* リンク切れ警告 */}
            {!score.isValid && (
              <Alert icon={<IconAlertTriangle size="1rem" />} color="red" variant="light">
                <Text size="sm">
                  <strong>リンクエラー:</strong> 楽譜にアクセスできません。管理者に報告済みです。
                </Text>
              </Alert>
            )}

            {/* 楽譜を開くボタン */}
            <Group>
              <Button
                leftSection={<IconExternalLink size="1rem" />}
                onClick={() => window.open(score.url, '_blank')}
                disabled={!score.isValid}
                size="md"
                className="w-full sm:w-auto"
                variant={score.isValid ? "filled" : "light"}
              >
                楽譜を開く
              </Button>
            </Group>

            {/* 更新履歴 */}
            {score.comments.length > 0 && (
              <Accordion variant="separated" radius="md">
                <Accordion.Item value="history">
                  <Accordion.Control icon={<IconClock size="1rem" />}>
                    更新履歴 ({score.comments.length}件)
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Stack gap="xs">
                      {score.comments
                        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                        .map((comment) => (
                          <div key={comment.id} className="p-3 bg-gray-50 rounded-md">
                            <Text size="sm" className="mb-1">
                              {comment.content}
                            </Text>
                            <Text size="xs" className="text-gray-500">
                              {formatDate(comment.createdAt)}
                            </Text>
                          </div>
                        ))}
                    </Stack>
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
            )}

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
          <strong>楽譜について：</strong><br />
          • 楽譜はPDF形式で提供されます<br />
          • ダウンロード後はオフラインでも閲覧可能です<br />
          • 更新があった楽譜には履歴が記載されます<br />
          • リンクに問題がある場合、管理者に自動で通知されます
        </Text>
      </Alert>
    </Stack>
  );
}