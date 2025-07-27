"use client";

import React, { useState } from "react";
import {
  Group,
  Title,
  Select,
  Button,
  Menu,
  Text,
  Container,
} from "@mantine/core";
import { IconChevronDown, IconLogout, IconUser } from "@tabler/icons-react";
import { useAuth } from "@/components/features/auth/AuthProvider";
import { getActiveConcerts } from "@/lib/mock-data";
import { Concert } from "@/types";

interface HeaderProps {
  selectedConcertId: string | null;
  onConcertChange: (concertId: string) => void;
}

/**
 * ヘッダーコンポーネント
 * 演奏会選択ドロップダウンとユーザー情報表示を含む
 */
export function Header({ selectedConcertId, onConcertChange }: HeaderProps) {
  const { user, logout } = useAuth();
  const [concerts] = useState<Concert[]>(getActiveConcerts());

  // 演奏会選択肢データの準備
  const concertOptions = concerts.map((concert) => ({
    value: concert.id,
    label: `${concert.title} (${new Intl.DateTimeFormat("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(concert.date)})`,
  }));

  // 演奏会選択肢データの準備で使用済み

  return (
    <header className="h-[70px] border-b bg-white">
      <Container size="xl" className="h-full">
        <Group justify="space-between" className="h-full">
          {/* タイトルと演奏会選択 */}
          <Group>
            <Title order={3} className="text-blue-700">
              Orch Link
            </Title>

            {/* 演奏会選択ドロップダウン */}
            {concerts.length > 0 && (
              <Select
                placeholder="演奏会を選択"
                value={selectedConcertId}
                onChange={(value) => value && onConcertChange(value)}
                data={concertOptions}
                style={{ minWidth: 300 }}
                className="hidden sm:block" // モバイルでは非表示
              />
            )}
          </Group>

          {/* ユーザー情報とメニュー */}
          {user && (
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <Button
                  variant="subtle"
                  rightSection={<IconChevronDown size="1rem" />}
                  leftSection={<IconUser size="1rem" />}
                >
                  <Group gap="xs">
                    <Text size="sm">
                      {user.role === "admin" ? "管理者" : "エキストラ"}
                    </Text>
                  </Group>
                </Button>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Label>アカウント情報</Menu.Label>

                <Menu.Item disabled>
                  <Text size="xs" className="text-gray-600">
                    ロール: {user.role === "admin" ? "管理者" : "エキストラ"}
                  </Text>
                </Menu.Item>

                {user.email && (
                  <Menu.Item disabled>
                    <Text size="xs" className="text-gray-600">
                      {user.email}
                    </Text>
                  </Menu.Item>
                )}

                <Menu.Divider />

                <Menu.Item
                  leftSection={<IconLogout size="1rem" />}
                  onClick={logout}
                  color="red"
                >
                  ログアウト
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
        </Group>
      </Container>

      {/* モバイル用演奏会選択（ヘッダー下） */}
      {concerts.length > 0 && (
        <div className="sm:hidden border-t bg-gray-50 p-3">
          <Select
            placeholder="演奏会を選択"
            value={selectedConcertId}
            onChange={(value) => value && onConcertChange(value)}
            data={concertOptions}
            className="w-full"
            size="sm"
          />
        </div>
      )}
    </header>
  );
}
