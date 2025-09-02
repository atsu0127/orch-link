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
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { ConcertFormData } from "@/types/concert";
import { Concert } from "@/types";

interface ConcertFormProps {
  /** 編集モード時の初期データ */
  initialData?: Concert;
  /** フォーム送信時のハンドラ */
  onSubmit: (data: ConcertFormData) => Promise<void>;
  /** フォーム送信中の状態 */
  isLoading?: boolean;
  /** フォームタイトル */
  title?: string;
  /** キャンセルボタンのハンドラ */
  onCancel?: () => void;
}

/**
 * 演奏会作成・編集フォームコンポーネント
 * 管理者専用の演奏会データ入力フォーム
 */
export function ConcertForm({
  initialData,
  onSubmit,
  isLoading = false,
  title = "演奏会を作成",
  onCancel,
}: ConcertFormProps) {
  // フォーム状態管理
  const [formData, setFormData] = useState<ConcertFormData>({
    title: initialData?.title || "",
    date: initialData?.date ? initialData.date.toISOString().split('T')[0] : "",
    venue: initialData?.venue || "",
    isActive: initialData?.isActive ?? true,
  });
  const [error, setError] = useState("");

  /**
   * フォーム送信処理
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 入力値検証
    if (!formData.title.trim()) {
      setError("演奏会タイトルを入力してください");
      return;
    }

    if (!formData.date.trim()) {
      setError("開催日を選択してください");
      return;
    }

    if (!formData.venue.trim()) {
      setError("開催場所を入力してください");
      return;
    }

    // 日付形式の検証
    const selectedDate = new Date(formData.date);
    if (isNaN(selectedDate.getTime())) {
      setError("有効な開催日を選択してください");
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Concert form submission error:", error);
      setError("送信に失敗しました。もう一度お試しください。");
    }
  };

  /**
   * 入力値変更ハンドラ
   */
  const handleInputChange = (field: keyof ConcertFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // エラーをクリア
    if (error) setError("");
  };

  return (
    <Paper shadow="sm" p="lg" radius="md" className="w-full max-w-md">
      <Title order={3} className="text-center mb-6">
        {title}
      </Title>

      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          {/* 演奏会タイトル */}
          <TextInput
            label="演奏会タイトル"
            placeholder="第○回定期演奏会"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.currentTarget.value)}
            required
            disabled={isLoading}
          />

          {/* 開催日 */}
          <TextInput
            label="開催日"
            placeholder="YYYY-MM-DD"
            type="date"
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.currentTarget.value)}
            required
            disabled={isLoading}
          />

          {/* 開催場所 */}
          <TextInput
            label="開催場所"
            placeholder="○○ホール"
            value={formData.venue}
            onChange={(e) => handleInputChange('venue', e.currentTarget.value)}
            required
            disabled={isLoading}
          />

          {/* アクティブ状態 */}
          <Switch
            label="アクティブ状態"
            description="有効にすると演奏会がアクティブな状態で表示されます"
            checked={formData.isActive}
            onChange={(event) => handleInputChange('isActive', event.currentTarget.checked)}
            disabled={isLoading}
          />

          {/* エラーメッセージ */}
          {error && (
            <Alert icon={<IconAlertCircle size="1rem" />} color="red">
              {error}
            </Alert>
          )}

          {/* 送信ボタン */}
          <Stack gap="sm" className="mt-4">
            <Button
              type="submit"
              loading={isLoading}
              size="md"
              className="w-full"
            >
              {initialData ? "更新する" : "作成する"}
            </Button>

            {/* キャンセルボタン */}
            {onCancel && (
              <Button
                variant="light"
                onClick={onCancel}
                disabled={isLoading}
                size="md"
                className="w-full"
              >
                キャンセル
              </Button>
            )}
          </Stack>
        </Stack>
      </form>
    </Paper>
  );
}