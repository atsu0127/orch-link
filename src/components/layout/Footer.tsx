'use client';

import React from 'react';
import { Container, Text, Group, Divider } from '@mantine/core';

/**
 * フッターコンポーネント
 * 著作権情報とアプリケーション情報を表示
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-6 mt-auto">
      <Container size="xl">
        <div className="text-center space-y-4">
          {/* メイン情報 */}
          <div>
            <Text size="lg" className="font-semibold mb-2">
              オーケストラ・エキストラ連絡ポータル
            </Text>
            <Text size="sm" className="text-gray-300">
              演奏会情報の効率的な共有と管理をサポート
            </Text>
          </div>

          <Divider color="gray.6" />

          {/* フッター情報 */}
          <Group justify="center" gap="xl" className="text-sm text-gray-400">
            <Text>
              © {currentYear} Orchestra Extra Portal
            </Text>
            <Text>
              Version 1.0.0
            </Text>
            <Text>
              Phase 1 Development
            </Text>
          </Group>

          {/* 技術情報 */}
          <Text size="xs" className="text-gray-500">
            Built with Next.js 15 • Powered by GCP
          </Text>
        </div>
      </Container>
    </footer>
  );
}