"use client";

import React, { useState, useEffect } from "react";
import { LoadingOverlay, Alert } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { AuthProvider, useAuth } from "@/components/features/auth/AuthProvider";
import { Header } from "@/components/layout/Header";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { AttendanceTab } from "@/components/features/attendance/AttendanceTab";
import { ScoresTab } from "@/components/features/scores/ScoresTab";
import { PracticesList } from "@/components/features/practices/PracticesList";
import { ContactTab } from "@/components/features/contact/ContactTab";
import {
  fetchConcerts,
  fetchConcertData,
  handleApiError,
} from "@/lib/api-client";
import { Concert, ConcertDetail, TabType } from "@/types";
import { ConcertAPI } from "@/types/serialized";

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
  }, [selectedConcertId]);

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
        ["attendance", "scores", "practices", "contact"].includes(lastTab)
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
   * 演奏会データの読み込み
   */
  const loadConcertData = async (concertId: string) => {
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
        {selectedConcertId && concertData && (
          <>
            {activeTab === "attendance" && (
              <AttendanceTab
                concertId={selectedConcertId}
                attendanceForms={concertData.attendanceForms}
              />
            )}

            {activeTab === "scores" && (
              <ScoresTab
                concertId={selectedConcertId}
                scores={concertData.scores}
              />
            )}

            {activeTab === "practices" && (
              <PracticesList
                concertId={selectedConcertId}
                practices={concertData.practices}
              />
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
