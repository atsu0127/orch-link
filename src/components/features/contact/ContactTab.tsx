'use client';

import React from 'react';
import { 
  Paper, 
  Title, 
  Text, 
  Button, 
  Stack,
  Alert,
  Group
} from '@mantine/core';
import { IconMail, IconInfoCircle } from '@tabler/icons-react';
import { formatDate, mockContactInfo } from '@/lib/mock-data';

interface ContactTabProps {
  concertId: string;
}

/**
 * 連絡タブコンポーネント
 * 管理者への連絡手段（メール）を提供
 */
export function ContactTab({}: ContactTabProps) {
  // モックデータから連絡先情報を取得
  const contactInfo = mockContactInfo[0];

  if (!contactInfo) {
    return (
      <div className="text-center py-12">
        <IconMail size={48} className="mx-auto text-gray-400 mb-4" />
        <Text size="lg" className="text-gray-600 mb-2">
          連絡先情報が設定されていません
        </Text>
        <Text size="sm" className="text-gray-500">
          管理者が連絡先を設定次第、こちらに表示されます
        </Text>
      </div>
    );
  }

  /**
   * メール送信処理
   * mailtoリンクでメーラーを起動
   */
  const handleSendEmail = () => {
    const subject = encodeURIComponent('Orch Link エキストラからのお問い合わせ');
    const body = encodeURIComponent(`
演奏会についてお問い合わせがあります。

【お問い合わせ内容】
（こちらに内容をご記入ください）

【連絡先】
お名前: 
メールアドレス: 
電話番号（任意）: 

よろしくお願いいたします。
    `);
    
    const mailtoUrl = `mailto:${contactInfo.email}?subject=${subject}&body=${body}`;
    window.location.href = mailtoUrl;
  };

  return (
    <Stack gap="lg">
      {/* ヘッダー情報 */}
      <div>
        <Title order={3} className="mb-2">管理者への連絡</Title>
        <Text size="sm" className="text-gray-600">
          演奏会に関するお問い合わせやご質問はこちら
        </Text>
      </div>

      {/* メイン連絡先カード */}
      <Paper shadow="sm" p="xl" radius="md" className="border">
        <Stack gap="lg">
          {/* 説明文 */}
          <div>
            <Title order={4} className="mb-3">お問い合わせについて</Title>
            <Text size="sm" className="leading-relaxed">
              {contactInfo.description}
            </Text>
          </div>

          {/* 連絡先情報 */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <Group gap="sm" className="mb-2">
              <IconMail size="1.2rem" className="text-blue-600" />
              <Title order={5}>メールアドレス</Title>
            </Group>
            <Text size="lg" className="font-mono font-semibold text-blue-800">
              {contactInfo.email}
            </Text>
          </div>

          {/* メール送信ボタン */}
          <Group>
            <Button
              leftSection={<IconMail size="1rem" />}
              onClick={handleSendEmail}
              size="md"
              className="w-full sm:w-auto"
            >
              メールで連絡する
            </Button>
          </Group>

          {/* 最終更新日時 */}
          <Text size="xs" className="text-gray-500 text-right">
            最終更新: {formatDate(contactInfo.updatedAt)}
          </Text>
        </Stack>
      </Paper>

      {/* お問い合わせガイド */}
      <Alert icon={<IconInfoCircle size="1rem" />} color="blue" variant="light">
        <Title order={6} className="mb-2">お問い合わせの際のお願い</Title>
        <Text size="sm">
          <strong>以下の情報をお知らせいただけると、より迅速に対応できます：</strong><br />
          • お名前（匿名でも結構です）<br />
          • 参加予定の演奏会名<br />
          • お問い合わせの種類（楽譜、スケジュール、その他）<br />
          • 具体的なご質問内容<br />
          • 返信をご希望の場合は連絡先
        </Text>
      </Alert>

      {/* よくある質問 */}
      <Paper p="lg" className="border border-gray-200">
        <Title order={5} className="mb-3">よくあるお問い合わせ</Title>
        <Stack gap="sm">
          <div>
            <Text size="sm" className="font-semibold mb-1">Q. 楽譜のリンクが開けません</Text>
            <Text size="sm" className="text-gray-600 ml-4">
              A. リンク切れは自動で管理者に通知されます。しばらくお待ちいただくか、直接ご連絡ください。
            </Text>
          </div>
          
          <div>
            <Text size="sm" className="font-semibold mb-1">Q. 練習の参加可否を変更したい</Text>
            <Text size="sm" className="text-gray-600 ml-4">
              A. 出欠フォームから再度送信するか、メールで直接ご連絡ください。
            </Text>
          </div>
          
          <div>
            <Text size="sm" className="font-semibold mb-1">Q. 演奏会の詳細情報を知りたい</Text>
            <Text size="sm" className="text-gray-600 ml-4">
              A. 具体的な質問内容をメールでお知らせください。詳細をご案内いたします。
            </Text>
          </div>
        </Stack>
      </Paper>
    </Stack>
  );
}