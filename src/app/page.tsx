"use client";

import React, { useState, useEffect, useCallback } from "react";
import { LoadingOverlay, Alert, Stack, Text } from "@mantine/core";
import { IconAlertCircle, IconCheck } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { AuthProvider, useAuth } from "@/components/features/auth/AuthProvider";
import { Header } from "@/components/layout/Header";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { AttendanceTab } from "@/components/features/attendance/AttendanceTab";
import { ScoresTab } from "@/components/features/scores/ScoresTab";
import { PracticesList } from "@/components/features/practices/PracticesList";
import { PracticeManagement } from "@/components/features/practices/PracticeManagement";
import { ContactTab } from "@/components/features/contact/ContactTab";
import { ConcertManagement } from "@/components/features/concerts/ConcertManagement";
import {
  fetchConcerts,
  fetchConcertData,
  handleApiError,
} from "@/lib/api-client";
import { Concert, ConcertDetail, TabType, Practice } from "@/types";

/**
 * メインアプリケーションページ
 * 認証、タブナビゲーション、演奏会選択を統合管理
 */
function MainApp() {
  const { user, isLoading } = useAuth();

  // 状態管理
  const [selectedConcertId, setSelectedConcertId] = useState<string | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<TabType>("attendance");
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [concertData, setConcertData] = useState<ConcertDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 練習予定管理用の状態
  const [editingPractice, setEditingPractice] = useState<Practice | null>(null);

  /**
   * 演奏会データの読み込み
   */
  const loadConcertData = useCallback(async (concertId: string) => {
    try {
      const data = await fetchConcertData(concertId);
      console.log(data);
      if (!data) {
        setError("演奏会データが見つかりません");
        return;
      }
      setConcertData(data);
      setError(null);
    } catch (error) {
      console.error("演奏会データ読み込みエラー:", error);
      setError(
        `演奏会データの読み込みに失敗しました: ${handleApiError(error)}`
      );
    }
  }, []);

  // 初期化時の処理
  useEffect(() => {
    if (user) {
      initializeApp();
    }
  }, [user]);

  // 演奏会変更時の処理
  useEffect(() => {
    if (selectedConcertId) {
      loadConcertData(selectedConcertId);
      // 選択された演奏会IDをローカルストレージに保存
      localStorage.setItem("lastSelectedConcert", selectedConcertId);
    }
  }, [selectedConcertId, loadConcertData]);

  // タブ変更時の処理
  useEffect(() => {
    // 最後に選択されたタブをローカルストレージに保存
    localStorage.setItem("lastActiveTab", activeTab);
  }, [activeTab]);

  /**
   * アプリケーション初期化
   * 最後に選択された演奏会・タブを復元
   */
  const initializeApp = async () => {
    try {
      // アクティブな演奏会を取得
      const activeConcerts = await fetchConcerts(true); // activeOnly = true

      if (activeConcerts.length === 0) {
        setError("アクティブな演奏会がありません");
        return;
      }

      // 状態に保存
      setConcerts(activeConcerts);

      // 最後に選択された演奏会を復元、なければ最初の演奏会を選択
      const lastConcertId = localStorage.getItem("lastSelectedConcert");
      const concertExists = activeConcerts.some((c) => c.id === lastConcertId);
      const initialConcertId = concertExists
        ? lastConcertId
        : activeConcerts[0].id;

      setSelectedConcertId(initialConcertId);

      // 最後に選択されたタブを復元
      const lastTab = localStorage.getItem("lastActiveTab") as TabType;
      if (
        lastTab &&
        ["attendance", "scores", "practices", "contact", "concerts"].includes(
          lastTab
        )
      ) {
        setActiveTab(lastTab);
      }
    } catch (error) {
      console.error("アプリケーション初期化エラー:", error);
      setError(
        `アプリケーションの初期化に失敗しました: ${handleApiError(error)}`
      );
    }
  };

  /**
   * 演奏会変更ハンドラ
   */
  const handleConcertChange = (concertId: string) => {
    setSelectedConcertId(concertId);
  };

  /**
   * タブ変更ハンドラ
   */
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  /**
   * 練習予定編集ハンドラ
   */
  const handlePracticeEdit = (practice: Practice) => {
    setEditingPractice(practice);
  };

  /**
   * 練習予定削除ハンドラ
   */
  const handlePracticeDelete = (practice: Practice) => {
    modals.openConfirmModal({
      title: "練習予定を削除",
      children: (
        <Stack gap="sm">
          <Text size="sm">
            「{practice.title}」を削除してもよろしいですか？
          </Text>
          <Alert color="yellow" variant="light">
            <Text size="sm">
              <strong>注意:</strong> この操作は元に戻せません。
            </Text>
          </Alert>
        </Stack>
      ),
      labels: { confirm: "削除する", cancel: "キャンセル" },
      confirmProps: { color: "red" },
      onConfirm: () => performPracticeDelete(practice.id),
    });
  };

  /**
   * 練習予定削除実行
   */
  const performPracticeDelete = async (practiceId: string) => {
    try {
      const response = await fetch(`/api/practices?id=${practiceId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`練習予定の削除に失敗しました: ${response.status}`);
      }

      notifications.show({
        title: "削除完了",
        message: "練習予定を削除しました",
        color: "green",
        icon: <IconCheck size="1rem" />,
      });

      // 演奏会データを再読み込み
      if (selectedConcertId) {
        loadConcertData(selectedConcertId);
      }
    } catch (error) {
      console.error("Delete error:", error);
      notifications.show({
        title: "削除エラー",
        message: handleApiError(error),
        color: "red",
        icon: <IconAlertCircle size="1rem" />,
      });
    }
  };

  /**
   * 練習予定更新時のコールバック
   */
  const handlePracticeUpdate = useCallback(() => {
    setEditingPractice(null);
    if (selectedConcertId) {
      loadConcertData(selectedConcertId);
    }
  }, [selectedConcertId, loadConcertData]);

  // ローディング中
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LoadingOverlay visible />
      </div>
    );
  }

  // 未認証の場合はログインページにリダイレクト
  if (!user) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return null;
  }

  // エラー表示
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Alert
          icon={<IconAlertCircle size="1rem" />}
          color="red"
          className="max-w-lg"
        >
          {error}
        </Alert>
      </div>
    );
  }

  // メインアプリケーション画面
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ヘッダー */}
      <Header
        selectedConcertId={selectedConcertId}
        onConcertChange={handleConcertChange}
        concerts={concerts}
      />

      {/* メインコンテンツ */}
      <Navigation activeTab={activeTab} onTabChange={handleTabChange}>
        {/* 演奏会管理は常に利用可能（管理者のみ） */}
        {activeTab === "concerts" && <ConcertManagement />}

        {/* 他のタブは選択された演奏会のデータが必要 */}
        {selectedConcertId && concertData && (
          <>
            {activeTab === "attendance" && (
              <AttendanceTab
                key={selectedConcertId}
                concertId={selectedConcertId}
                attendanceForms={concertData.attendanceForms}
              />
            )}

            {activeTab === "scores" && (
              <ScoresTab
                key={selectedConcertId}
                concertId={selectedConcertId}
                scores={concertData.scores}
              />
            )}

            {activeTab === "practices" && (
              <Stack gap="lg">
                {/* 練習予定一覧 */}
                <PracticesList
                  concertId={selectedConcertId}
                  practices={concertData.practices}
                  onEdit={
                    user?.role === "admin" ? handlePracticeEdit : undefined
                  }
                  onDelete={
                    user?.role === "admin" ? handlePracticeDelete : undefined
                  }
                />

                {/* 練習予定管理（管理者のみ） */}
                {user?.role === "admin" && (
                  <PracticeManagement
                    concertId={selectedConcertId}
                    onPracticeUpdate={handlePracticeUpdate}
                    initialEditingPractice={editingPractice}
                  />
                )}
              </Stack>
            )}

            {activeTab === "contact" && (
              <ContactTab concertId={selectedConcertId} />
            )}
          </>
        )}
      </Navigation>

      {/* フッター */}
      <Footer />
    </div>
  );
}

/**
 * ホームページコンポーネント
 * AuthProviderでラップして認証機能を提供
 */
export default function Home() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
