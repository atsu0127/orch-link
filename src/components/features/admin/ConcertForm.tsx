"use client";

import React, { useState } from "react";
import {
  Paper,
  Title,
  TextInput,
  Button,
  Stack,
  Alert,
  Switch,
  Group,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconAlertCircle } from "@tabler/icons-react";
import { Concert } from "@/types";
import { ConcertFormData } from "@/types/concert";

interface ConcertFormProps {
  concert?: Concert;
  onSuccess: () => void;
  onCancel: () => void;
}

/**
 * 演奏会作成・編集フォームコンポーネント
 * 新規作成と編集の両方に対応した共通フォーム
 */
export function ConcertForm({ concert, onSuccess, onCancel }: ConcertFormProps) {
  // 状態管理
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // 編集モードの判定
  const isEditMode = !!concert;

  // フォーム初期化
  const form = useForm<ConcertFormData>({
    initialValues: {
      title: concert?.title || "",
      date: concert?.date ? formatDateForInput(concert.date) : "",
      venue: concert?.venue || "",
      isActive: concert?.isActive ?? true,
    },
    validate: {
      title: (value) => value.trim().length < 1 ? "タイトルを入力してください" : null,
      date: (value) => !value ? "開催日を入力してください" : null,
      venue: (value) => value.trim().length < 1 ? "開催場所を入力してください" : null,
    },
  });

  /**
   * 日付をフォーム入力用の形式に変換
   * Date型からdatetime-local input用の文字列に変換
   */
  function formatDateForInput(date: Date): string {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  }

  /**
   * フォーム送信処理
   */
  const handleSubmit = async (values: ConcertFormData) => {
    setError("");
    setIsLoading(true);

    try {
      const method = isEditMode ? 'PUT' : 'POST';
      const body = isEditMode 
        ? { ...values, concertId: concert.id }
        : values;

      const response = await fetch('/api/concerts', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // 成功時はコールバックを実行
        onSuccess();
      } else {
        // エラー時はメッセージを表示
        setError(result.error || `演奏会の${isEditMode ? '更新' : '作成'}に失敗しました`);
      }
    } catch (error) {
      console.error(`Concert ${isEditMode ? 'update' : 'creation'} error:`, error);
      setError("サーバーエラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper shadow="md" p="xl" radius="md" className="w-full max-w-md">
      <Title order={3} className="text-center mb-6">
        {isEditMode ? "演奏会編集" : "新規演奏会作成"}
      </Title>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          {/* タイトル入力 */}
          <TextInput
            label="演奏会タイトル"
            placeholder="演奏会名を入力してください"
            required
            disabled={isLoading}
            {...form.getInputProps('title')}
          />

          {/* 開催日入力 */}
          <TextInput
            type="datetime-local"
            label="開催日時"
            required
            disabled={isLoading}
            {...form.getInputProps('date')}
          />

          {/* 開催場所入力 */}
          <TextInput
            label="開催場所"
            placeholder="会場名を入力してください"
            required
            disabled={isLoading}
            {...form.getInputProps('venue')}
          />

          {/* アクティブ状態切り替え */}
          <Switch
            label="この演奏会をアクティブにする"
            description="無効にすると演奏会一覧に表示されません"
            disabled={isLoading}
            {...form.getInputProps('isActive', { type: 'checkbox' })}
          />

          {/* エラーメッセージ */}
          {error && (
            <Alert icon={<IconAlertCircle size="1rem" />} color="red">
              {error}
            </Alert>
          )}

          {/* ボタン群 */}
          <Group justify="flex-end" mt="md">
            <Button
              variant="subtle"
              onClick={onCancel}
              disabled={isLoading}
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              loading={isLoading}
              color="blue"
            >
              {isEditMode ? "更新" : "作成"}
            </Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
}