/**
 * APIクライアント
 * フロントエンドからAPIへの統一的なアクセスを提供
 */

import {
  ConcertsListResponse,
  ConcertDetailResponse,
  AttendanceFormsListResponse,
  ContactInfoResponse,
} from "@/types/serialized";
import {
  deserializeConcertData,
  deserializeConcertDetailData,
  deserializeAttendanceFormsData,
  deserializeContactInfoData,
} from "@/lib/utils";
import { Concert, ConcertDetail, ContactInfo, AttendanceForm } from "@/types";

/**
 * APIエラークラス
 */
export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * 演奏会一覧を取得
 * @param activeOnly - アクティブな演奏会のみ取得するかのフラグ（デフォルト: true）
 * @returns 演奏会リスト
 */
export async function fetchConcerts(
  activeOnly: boolean = true
): Promise<Concert[]> {
  const response = await fetch(`/api/concerts?active=${activeOnly}`, {
    method: "GET",
    credentials: "include", // JWT認証用クッキー
  });

  if (!response.ok) {
    throw new ApiError(
      response.status,
      `演奏会一覧の取得に失敗しました: ${response.status}`
    );
  }

  const data: ConcertsListResponse = await response.json();

  if (!data.success) {
    throw new ApiError(500, data.error || "演奏会一覧の取得に失敗しました");
  }

  return deserializeConcertData(data.data);
}

/**
 * 演奏会詳細データを取得
 * @param concertId - 演奏会ID
 * @returns 演奏会詳細データ（関連データ含む）
 */
export async function fetchConcertData(
  concertId: string
): Promise<ConcertDetail> {
  const response = await fetch(`/api/concerts?id=${concertId}`, {
    method: "GET",
    credentials: "include", // JWT認証用クッキー
  });

  if (!response.ok) {
    throw new ApiError(
      response.status,
      `演奏会データの取得に失敗しました: ${response.status}`
    );
  }

  const data: ConcertDetailResponse = await response.json();

  if (!data.success) {
    throw new ApiError(500, data.error || "演奏会データの取得に失敗しました");
  }

  // 日付フィールドをDateオブジェクトに変換
  return deserializeConcertDetailData(data.data);
}

/**
 * 出欠調整一覧を取得
 * @param concertId - 演奏会ID
 * @returns 出欠調整リスト
 */
export async function fetchAttendanceForms(
  concertId: string
): Promise<AttendanceForm[]> {
  const response = await fetch(`/api/attendance?concertId=${concertId}`, {
    method: "GET",
    credentials: "include", // JWT認証用クッキー
  });

  if (!response.ok) {
    throw new ApiError(
      response.status,
      `出欠調整一覧の取得に失敗しました: ${response.status}`
    );
  }

  const data: AttendanceFormsListResponse = await response.json();

  if (!data.success) {
    throw new ApiError(500, data.error || "出欠調整一覧の取得に失敗しました");
  }

  return deserializeAttendanceFormsData(data.data);
}

/**
 * 連絡先情報を取得
 * @returns 連絡先情報
 */
export async function fetchContactInfo(): Promise<ContactInfo> {
  const response = await fetch("/api/contact", {
    method: "GET",
    credentials: "include", // JWT認証用クッキー
  });

  if (!response.ok) {
    throw new ApiError(
      response.status,
      `連絡先情報の取得に失敗しました: ${response.status}`
    );
  }

  const data: ContactInfoResponse = await response.json();

  if (!data.success) {
    throw new ApiError(500, data.error || "連絡先情報の取得に失敗しました");
  }

  return deserializeContactInfoData(data.data);
}

/**
 * APIエラーハンドリングヘルパー
 * @param error - エラーオブジェクト
 * @returns ユーザーフレンドリーなエラーメッセージ
 */
export function handleApiError(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "ネットワークエラーが発生しました";
}
