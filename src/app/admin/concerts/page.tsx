"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";
import { ConcertList } from "@/components/features/admin/ConcertList";
import { ConcertForm } from "@/components/features/admin/ConcertForm";
import { Concert } from "@/types";

/**
 * 演奏会管理ページ
 * 演奏会のCRUD操作を統合管理するメインページ
 */
export default function ConcertsAdminPage() {
  // 状態管理
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedConcert, setSelectedConcert] = useState<Concert | null>(null);
  
  // モーダル状態管理
  const [formModalOpened, { open: openFormModal, close: closeFormModal }] = useDisclosure(false);

  /**
   * 演奏会一覧を取得
   */
  const fetchConcerts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/concerts');
      const result = await response.json();
      
      if (response.ok && result.success) {
        setConcerts(result.data || []);
      } else {
        setError(result.error || "演奏会の取得に失敗しました");
      }
    } catch (error) {
      console.error("演奏会取得エラー:", error);
      setError("サーバーエラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * コンポーネント初期化時に演奏会一覧を取得
   */
  useEffect(() => {
    fetchConcerts();
  }, []);

  /**
   * 新規作成モーダルを開く
   */
  const handleAdd = () => {
    setSelectedConcert(null);
    openFormModal();
  };

  /**
   * 編集モーダルを開く
   */
  const handleEdit = (concert: Concert) => {
    setSelectedConcert(concert);
    openFormModal();
  };

  /**
   * 演奏会削除処理
   */
  const handleDelete = async (concertId: string) => {
    try {
      const response = await fetch(`/api/concerts?id=${concertId}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        // 成功通知
        notifications.show({
          title: "削除完了",
          message: result.message || "演奏会を削除しました",
          color: "green",
        });
        
        // 演奏会一覧を再取得
        await fetchConcerts();
      } else {
        // エラー通知
        notifications.show({
          title: "削除エラー",
          message: result.error || "演奏会の削除に失敗しました",
          color: "red",
        });
      }
    } catch (error) {
      console.error("削除エラー:", error);
      notifications.show({
        title: "削除エラー",
        message: "サーバーエラーが発生しました",
        color: "red",
      });
    }
  };

  /**
   * フォーム送信成功時の処理
   */
  const handleFormSuccess = async () => {
    // モーダルを閉じる
    closeFormModal();
    setSelectedConcert(null);
    
    // 成功通知
    notifications.show({
      title: selectedConcert ? "更新完了" : "作成完了",
      message: selectedConcert ? "演奏会を更新しました" : "演奏会を作成しました",
      color: "green",
    });
    
    // 演奏会一覧を再取得
    await fetchConcerts();
  };

  /**
   * フォームキャンセル時の処理
   */
  const handleFormCancel = () => {
    closeFormModal();
    setSelectedConcert(null);
  };

  return (
    <>
      {/* 演奏会一覧 */}
      <ConcertList
        concerts={concerts}
        isLoading={isLoading}
        error={error}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* 作成・編集フォームモーダル */}
      <Modal
        opened={formModalOpened}
        onClose={handleFormCancel}
        title={selectedConcert ? "演奏会編集" : "新規演奏会作成"}
        centered
        size="md"
      >
        <ConcertForm
          concert={selectedConcert || undefined}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      </Modal>
    </>
  );
}