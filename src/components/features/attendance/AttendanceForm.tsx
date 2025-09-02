"use client";

import React, { useState } from "react";
import {
  Paper,
  Title,
  TextInput,
  Textarea,
  Button,
  Stack,
  Alert,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { AttendanceFormData } from "@/types";
import type { AttendanceForm } from "@/types";

interface AttendanceFormProps {
  /** 編集モード時の初期データ */
  initialData?: AttendanceForm;
  /** フォーム送信時のハンドラ */
  onSubmit: (data: AttendanceFormData) => Promise<void>;
  /** フォーム送信中の状態 */
  isLoading?: boolean;
  /** フォームタイトル */
  title?: string;
  /** キャンセルボタンのハンドラ */
  onCancel?: () => void;
}

/**
 * 出欠調整作成・編集フォームコンポーネント
 * 管理者専用の出欠調整データ入力フォーム
 */
export function AttendanceForm({
  initialData,
  onSubmit,
  isLoading = false,
  title = "出欠調整を作成",
  onCancel,
}: AttendanceFormProps) {
  // フォーム状態管理
  const [formData, setFormData] = useState<AttendanceFormData>({
    title: initialData?.title || "",
    url: initialData?.url || "",
    description: initialData?.description || "",
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
      setError("フォームタイトルを入力してください");
      return;
    }

    if (!formData.url.trim()) {
      setError("フォームURLを入力してください");
      return;
    }

    // URL形式の検証
    try {
      new URL(formData.url);
    } catch {
      setError("有効なURLを入力してください");
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Attendance form submission error:", error);
      setError("送信に失敗しました。もう一度お試しください。");
    }
  };

  /**
   * 入力値変更ハンドラ
   */
  const handleInputChange = (field: keyof AttendanceFormData, value: string) => {
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
          {/* フォームタイトル */}
          <TextInput
            label="フォームタイトル"
            placeholder="第○回定期演奏会 出欠調整"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.currentTarget.value)}
            required
            disabled={isLoading}
          />

          {/* フォームURL */}
          <TextInput
            label="フォームURL"
            placeholder="https://forms.google.com/..."
            value={formData.url}
            onChange={(e) => handleInputChange('url', e.currentTarget.value)}
            required
            disabled={isLoading}
          />

          {/* 説明文 */}
          <Textarea
            label="説明文（任意）"
            placeholder="出欠調整に関する補足説明があれば入力してください"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.currentTarget.value)}
            disabled={isLoading}
            minRows={3}
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