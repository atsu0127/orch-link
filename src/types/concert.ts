// 演奏会関連型定義

import { Concert, AttendanceForm, Score, Practice } from "./index";

// 演奏会詳細情報型（関連データ含む）
export interface ConcertDetail extends Concert {
  attendanceForms: AttendanceForm[];
  scores: Score[];
  practices: Practice[];
}

// 演奏会作成・更新用フォーム型
export interface ConcertFormData {
  title: string;
  date: string; // フォーム入力用文字列形式
  venue: string;
  isActive: boolean;
}

// 演奏会選択肢型（セレクター用）
export interface ConcertOption {
  value: string; // concert.id
  label: string; // concert.title + 開催日
}