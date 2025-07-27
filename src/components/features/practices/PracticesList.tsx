'use client';

import React, { useState } from 'react';
import { 
  Paper, 
  Title, 
  Text, 
  Button, 
  Stack,
  Group,
  Badge,
  Divider
} from '@mantine/core';
import { 
  IconCalendar, 
  IconMapPin, 
  IconChevronRight,
  IconClock
} from '@tabler/icons-react';
import { Practice } from '@/types';
import { formatDate } from '@/lib/mock-data';
import { PracticeDetail } from './PracticeDetail';

interface PracticesListProps {
  concertId: string;
  practices: Practice[];
}

/**
 * 練習予定リストコンポーネント
 * 練習の一覧表示と詳細ビューへの切り替えを管理
 */
export function PracticesList({ practices }: PracticesListProps) {
  const [selectedPractice, setSelectedPractice] = useState<Practice | null>(null);

  // 詳細表示モードの場合
  if (selectedPractice) {
    return (
      <PracticeDetail 
        practice={selectedPractice} 
        onBack={() => setSelectedPractice(null)} 
      />
    );
  }

  // 練習予定がない場合
  if (practices.length === 0) {
    return (
      <div className="text-center py-12">
        <IconCalendar size={48} className="mx-auto text-gray-400 mb-4" />
        <Text size="lg" className="text-gray-600 mb-2">
          練習予定はまだ登録されていません
        </Text>
        <Text size="sm" className="text-gray-500">
          管理者が練習予定を登録次第、こちらに表示されます
        </Text>
      </div>
    );
  }

  // 現在時刻で過去・未来の練習を分ける
  const now = new Date();
  const upcomingPractices = practices.filter(p => p.date > now);
  const pastPractices = practices.filter(p => p.date <= now);

  return (
    <Stack gap="lg">
      {/* ヘッダー情報 */}
      <div>
        <Title order={3} className="mb-2">練習予定</Title>
        <Text size="sm" className="text-gray-600">
          リハーサルスケジュールと詳細情報
        </Text>
      </div>

      {/* 今後の練習予定 */}
      {upcomingPractices.length > 0 && (
        <div>
          <Title order={4} className="mb-4 text-blue-700">
            今後の練習予定 ({upcomingPractices.length}件)
          </Title>
          <Stack gap="md">
            {upcomingPractices.map((practice) => (
              <PracticeCard 
                key={practice.id}
                practice={practice}
                onSelect={() => setSelectedPractice(practice)}
                isPast={false}
              />
            ))}
          </Stack>
        </div>
      )}

      {/* 区切り線 */}
      {upcomingPractices.length > 0 && pastPractices.length > 0 && (
        <Divider />
      )}

      {/* 過去の練習 */}
      {pastPractices.length > 0 && (
        <div>
          <Title order={4} className="mb-4 text-gray-600">
            過去の練習 ({pastPractices.length}件)
          </Title>
          <Stack gap="md">
            {pastPractices.map((practice) => (
              <PracticeCard 
                key={practice.id}
                practice={practice}
                onSelect={() => setSelectedPractice(practice)}
                isPast={true}
              />
            ))}
          </Stack>
        </div>
      )}
    </Stack>
  );
}

/**
 * 練習カードコンポーネント
 */
interface PracticeCardProps {
  practice: Practice;
  onSelect: () => void;
  isPast: boolean;
}

function PracticeCard({ practice, onSelect, isPast }: PracticeCardProps) {
  return (
    <Paper 
      shadow="sm" 
      p="md" 
      radius="md" 
      className={`border cursor-pointer hover:shadow-md transition-shadow ${
        isPast ? 'opacity-75' : ''
      }`}
      onClick={onSelect}
    >
      <Group justify="space-between" align="flex-start">
        <div className="flex-1">
          {/* タイトルと日時 */}
          <Group gap="sm" className="mb-2">
            <Title order={5} className={isPast ? 'text-gray-600' : 'text-gray-900'}>
              {practice.title}
            </Title>
            {isPast && (
              <Badge color="gray" size="sm" variant="light">
                終了
              </Badge>
            )}
          </Group>

          {/* 日時と場所の情報 */}
          <Stack gap="xs">
            <Group gap="sm">
              <IconClock size="1rem" className="text-gray-500" />
              <Text size="sm" className="text-gray-700">
                {formatDate(practice.date)}
              </Text>
            </Group>
            
            <Group gap="sm">
              <IconMapPin size="1rem" className="text-gray-500" />
              <Text size="sm" className="text-gray-700">
                {practice.venue}
              </Text>
            </Group>
          </Stack>
        </div>

        {/* 詳細表示ボタン */}
        <Button 
          variant="light" 
          size="xs"
          rightSection={<IconChevronRight size="0.8rem" />}
        >
          詳細
        </Button>
      </Group>
    </Paper>
  );
}