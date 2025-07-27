// 基本データ構造型定義

// ユーザー型定義
export interface User {
  id: string;
  email: string;
  role: "admin" | "viewer";
  name?: string;
}

// 演奏会型定義
export interface Concert {
  id: string;
  title: string; // 演奏会タイトル
  date: Date; // 開催日
  venue: string; // 開催場所
  isActive: boolean; // アクティブ状態
  updatedAt: Date; // 最終更新日時
}

// 出欠フォーム型定義
export interface AttendanceForm {
  id: string;
  concertId: string;
  title: string; // フォームタイトル
  url: string; // 外部フォームURL
  description?: string; // 補足説明
  updatedAt: Date; // 最終更新日時
}

// 楽譜型定義
export interface Score {
  id: string;
  concertId: string;
  title: string; // 曲名
  url: string; // 楽譜URL
  isValid: boolean; // リンク有効性
  updatedAt: Date; // 最終更新日時
  comments: ScoreComment[]; // 更新履歴コメント
}

// 楽譜コメント型定義
export interface ScoreComment {
  id: string;
  scoreId: string;
  content: string; // コメント内容
  createdAt: Date; // 作成日時
}

// 練習予定型定義
export interface Practice {
  id: string;
  concertId: string;
  title: string; // 練習タイトル
  date: Date; // 練習日時
  venue: string; // 練習場所
  items?: string; // 持ち物
  notes?: string; // 注意事項
  memo?: string; // メモ
  audioUrl?: string; // 関連録音URL
  updatedAt: Date; // 最終更新日時
}

// 連絡先情報型定義
export interface ContactInfo {
  id: string;
  email: string; // 管理者メールアドレス
  description: string; // 説明文
  updatedAt: Date; // 最終更新日時
}

// タブ種類型定義
export type TabType = "attendance" | "scores" | "practices" | "contact";

// API レスポンス共通型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// ページネーション型定義
export interface Pagination {
  page: number;
  limit: number;
  total: number;
}