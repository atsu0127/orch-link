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
import { ScoreFormData } from "@/types";
import type { Score } from "@/types";

interface ScoreFormProps {
  /** 編集モード時の初期データ */
  initialData?: Score;
  /** フォーム送信時のハンドラ */
  onSubmit: (data: ScoreFormData) => Promise<void>;
  /** フォーム送信中の状態 */
  isLoading?: boolean;
  /** フォームタイトル */
  title?: string;
  /** キャンセルボタンのハンドラ */
  onCancel?: () => void;
}

/**
 * 楽譜作成・編集フォームコンポーネント
 * 管理者専用の楽譜データ入力フォーム
 */
export function ScoreForm({
  initialData,
  onSubmit,
  isLoading = false,
  title = "楽譜を追加",
  onCancel,
}: ScoreFormProps) {
  // フォーム状態管理
  const [formData, setFormData] = useState<ScoreFormData>({
    title: initialData?.title || "",
    url: initialData?.url || "",
    comment: "", // 常に空でスタート（新しいコメント用）
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
      setError("楽譜タイトルを入力してください");
      return;
    }

    if (!formData.url.trim()) {
      setError("楽譜URLを入力してください");
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
      console.error("Score form submission error:", error);
      setError("送信に失敗しました。もう一度お試しください。");
    }
  };

  /**
   * 入力値変更ハンドラ
   */
  const handleInputChange = (field: keyof ScoreFormData, value: string) => {
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
          {/* 楽譜タイトル */}
          <TextInput
            label="楽譜タイトル"
            placeholder="交響曲第○番 - 第○楽章"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.currentTarget.value)}
            required
            disabled={isLoading}
          />

          {/* 楽譜URL */}
          <TextInput
            label="楽譜URL"
            placeholder="https://example.com/scores/..."
            value={formData.url}
            onChange={(e) => handleInputChange('url', e.currentTarget.value)}
            required
            disabled={isLoading}
          />

          {/* 更新コメント（編集時のみ表示） */}
          {initialData && (
            <Textarea
              label="更新コメント（任意）"
              placeholder="楽譜の変更内容や注意事項があれば入力してください"
              value={formData.comment || ""}
              onChange={(e) => handleInputChange('comment', e.currentTarget.value)}
              disabled={isLoading}
              minRows={2}
            />
          )}

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
              {initialData ? "更新する" : "追加する"}
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