'use client';

import React from 'react';
import { Tabs, Container } from '@mantine/core';
import { 
  IconClipboardList, 
  IconMusic, 
  IconCalendar, 
  IconMail 
} from '@tabler/icons-react';
import { TabType } from '@/types';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  children: React.ReactNode;
}

/**
 * タブナビゲーションコンポーネント
 * 4つのメイン機能（出欠・楽譜・練習予定・連絡）のタブ切り替えを提供
 */
export function Navigation({ activeTab, onTabChange, children }: NavigationProps) {
  return (
    <div className="flex-1 bg-gray-50">
      <Container size="xl" className="py-4">
        <Tabs 
          value={activeTab} 
          onChange={(value) => value && onTabChange(value as TabType)}
          className="bg-white rounded-lg shadow-sm"
        >
          <Tabs.List className="border-b">
            {/* 出欠調整タブ */}
            <Tabs.Tab
              value="attendance"
              leftSection={<IconClipboardList size="1rem" />}
              className="flex-1 sm:flex-none"
            >
              <span className="hidden sm:inline">出欠調整</span>
              <span className="sm:hidden">出欠</span>
            </Tabs.Tab>

            {/* 楽譜リンクタブ */}
            <Tabs.Tab
              value="scores"
              leftSection={<IconMusic size="1rem" />}
              className="flex-1 sm:flex-none"
            >
              <span className="hidden sm:inline">楽譜リンク</span>
              <span className="sm:hidden">楽譜</span>
            </Tabs.Tab>

            {/* 練習予定タブ */}
            <Tabs.Tab
              value="practices"
              leftSection={<IconCalendar size="1rem" />}
              className="flex-1 sm:flex-none"
            >
              <span className="hidden sm:inline">練習予定</span>
              <span className="sm:hidden">練習</span>
            </Tabs.Tab>

            {/* 連絡タブ */}
            <Tabs.Tab
              value="contact"
              leftSection={<IconMail size="1rem" />}
              className="flex-1 sm:flex-none"
            >
              連絡
            </Tabs.Tab>
          </Tabs.List>

          {/* タブコンテンツエリア */}
          <div className="p-4 min-h-[400px]">
            {children}
          </div>
        </Tabs>
      </Container>
    </div>
  );
}