"use client";

import React, { useState } from "react";
import {
  Paper,
  Title,
  TextInput,
  Button,
  Stack,
  Alert,
  Textarea,
  Group,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { PracticeFormData } from "@/types/practice";
import { Practice } from "@/types";

interface PracticeFormProps {
  /** 編集モード時の初期データ */
  initialData?: Practice;
  /** フォーム送信時のハンドラ */
  onSubmit: (data: PracticeFormData) => Promise<void>;
  /** フォーム送信中の状態 */
  isLoading?: boolean;
  /** フォームタイトル */
  title?: string;
  /** キャンセルボタンのハンドラ */
  onCancel?: () => void;
}

/**
 * 練習予定作成・編集フォームコンポーネント
 * 管理者専用の練習予定データ入力フォーム
 */
export function PracticeForm({
  initialData,
  onSubmit,
  isLoading = false,
  title = "練習予定を作成",
  onCancel,
}: PracticeFormProps) {
  // フォーム状態管理
  const [formData, setFormData] = useState<PracticeFormData>({
    concertId: initialData?.concertId || "",
    title: initialData?.title || "",
    startTime: initialData?.startTime ? initialData.startTime.toISOString().slice(0, 16) : "",
    endTime: initialData?.endTime ? initialData.endTime.toISOString().slice(0, 16) : "",
    venue: initialData?.venue || "",
    address: initialData?.address || "",
    items: initialData?.items || "",
    notes: initialData?.notes || "",
    memo: initialData?.memo || "",
    audioUrl: initialData?.audioUrl || "",
    videoUrl: initialData?.videoUrl || "",
  });
  const [error, setError] = useState("");

  /**
   * フォーム送信処理
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 必須フィールドの検証
    if (!formData.title.trim()) {
      setError("練習タイトルを入力してください");
      return;
    }

    if (!formData.startTime.trim()) {
      setError("開始日時を入力してください");
      return;
    }

    if (!formData.venue.trim()) {
      setError("練習場所を入力してください");
      return;
    }

    // 日時の検証
    const startDate = new Date(formData.startTime);
    if (isNaN(startDate.getTime())) {
      setError("有効な開始日時を入力してください");
      return;
    }

    if (formData.endTime) {
      const endDate = new Date(formData.endTime);
      if (isNaN(endDate.getTime())) {
        setError("有効な終了日時を入力してください");
        return;
      }
      if (endDate <= startDate) {
        setError("終了日時は開始日時より後に設定してください");
        return;
      }
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Practice form submission error:", error);
      setError("送信に失敗しました。もう一度お試しください。");
    }
  };

  /**
   * 入力値変更ハンドラ
   */
  const handleInputChange = (field: keyof PracticeFormData, value: string) => {
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
          {/* 練習タイトル */}
          <TextInput
            label="練習タイトル"
            placeholder="第○回定期練習"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.currentTarget.value)}
            required
            disabled={isLoading}
          />

          {/* 開始日時 */}
          <TextInput
            label="開始日時"
            type="datetime-local"
            value={formData.startTime}
            onChange={(e) => handleInputChange('startTime', e.currentTarget.value)}
            required
            disabled={isLoading}
          />

          {/* 終了日時 */}
          <TextInput
            label="終了日時"
            type="datetime-local"
            value={formData.endTime}
            onChange={(e) => handleInputChange('endTime', e.currentTarget.value)}
            disabled={isLoading}
          />

          {/* 練習場所 */}
          <TextInput
            label="練習場所"
            placeholder="○○ホール"
            value={formData.venue}
            onChange={(e) => handleInputChange('venue', e.currentTarget.value)}
            required
            disabled={isLoading}
          />

          {/* 住所 */}
          <TextInput
            label="住所"
            placeholder="東京都..."
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.currentTarget.value)}
            disabled={isLoading}
          />

          {/* 持ち物 */}
          <Textarea
            label="持ち物"
            placeholder="楽器、楽譜..."
            value={formData.items}
            onChange={(e) => handleInputChange('items', e.currentTarget.value)}
            disabled={isLoading}
          />

          {/* 注意事項 */}
          <Textarea
            label="注意事項"
            placeholder="開始15分前にお越しください..."
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.currentTarget.value)}
            disabled={isLoading}
          />

          {/* メモ */}
          <Textarea
            label="メモ"
            value={formData.memo}
            onChange={(e) => handleInputChange('memo', e.currentTarget.value)}
            disabled={isLoading}
          />

          {/* 録音URL */}
          <TextInput
            label="録音URL"
            placeholder="https://..."
            value={formData.audioUrl}
            onChange={(e) => handleInputChange('audioUrl', e.currentTarget.value)}
            disabled={isLoading}
          />

          {/* 録画URL */}
          <TextInput
            label="録画URL"
            placeholder="https://..."
            value={formData.videoUrl}
            onChange={(e) => handleInputChange('videoUrl', e.currentTarget.value)}
            disabled={isLoading}
          />

          {/* エラーメッセージ */}
          {error && (
            <Alert icon={<IconAlertCircle size="1rem" />} color="red" variant="light">
              {error}
            </Alert>
          )}

          {/* 送信ボタン */}
          <Group justify="flex-end" gap="sm" className="mt-4">
            {/* キャンセルボタン */}
            {onCancel && (
              <Button
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
              >
                キャンセル
              </Button>
            )}
            
            <Button
              type="submit"
              loading={isLoading}
            >
              {initialData ? "更新する" : "作成する"}
            </Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
}