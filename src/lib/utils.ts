/**
 * ユーティリティ関数集
 * 日付フォーマットや共通処理を提供
 */

/**
 * 日付を日本語形式でフォーマット（日時含む）
 * @param date - フォーマット対象の日付
 * @returns フォーマットされた日付文字列
 */
import { Concert, ConcertDetail, ContactInfo } from "@/types";
import {
  ConcertAPI,
  ConcertDetailAPI,
  ContactInfoAPI,
} from "@/types/serialized";

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/**
 * 日付のみを日本語形式でフォーマット（時間なし）
 * @param date - フォーマット対象の日付
 * @returns フォーマットされた日付文字列
 */
export function formatDateOnly(date: Date): string {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

/**
 * 時間範囲を日本語形式でフォーマット
 * @param startTime - 開始時間
 * @param endTime - 終了時間（オプション）
 * @returns フォーマットされた時間範囲文字列
 */
export function formatTimeRange(startTime: Date, endTime?: Date): string {
  const timeFormat = new Intl.DateTimeFormat("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const start = timeFormat.format(startTime);
  if (!endTime) return start;

  const end = timeFormat.format(endTime);
  return `${start} - ${end}`;
}

/**
 * APIから取得したシリアライズされたコンサートデータをデシリアライズ
 * @param data - シリアライズされたコンサート関連データ
 * @returns デシリアライズされたコンサート関連データ
 */
export function deserializeConcertDetailData(
  data: ConcertDetailAPI
): ConcertDetail {
  return {
    ...data,
    concert: {
      ...data.concert,
      date: new Date(data.concert.date),
      updatedAt: new Date(data.concert.updatedAt),
    },
    attendanceForms: data.attendanceForms.map((form) => ({
      ...form,
      updatedAt: new Date(form.updatedAt),
    })),
    scores: data.scores.map((score) => ({
      ...score,
      updatedAt: new Date(score.updatedAt),
      comments: score.comments.map((comment) => ({
        ...comment,
        createdAt: new Date(comment.createdAt),
      })),
    })),
    practices: data.practices.map((practice) => ({
      ...practice,
      startTime: new Date(practice.startTime),
      endTime: practice.endTime ? new Date(practice.endTime) : undefined,
      updatedAt: new Date(practice.updatedAt),
    })),
  };
}

/**
 * APIから取得したシリアライズされたコンサート単体のデータをデシリアライズ
 * @param data - シリアライズされたコンサート単体のデータ
 * @returns デシリアライズされたコンサート単体のデータ
 */
export function deserializeConcertData(data: ConcertAPI[]): Concert[] {
  return data.map((concert) => ({
    ...concert,
    date: new Date(concert.date),
    updatedAt: new Date(concert.updatedAt),
  }));
}

/**
 * APIから取得したシリアライズされた連絡先情報をデシリアライズ
 * @param data - シリアライズされた連絡先情報
 * @returns デシリアライズされた連絡先情報
 */
export function deserializeContactInfoData(data: ContactInfoAPI): ContactInfo {
  return {
    ...data,
    updatedAt: new Date(data.updatedAt),
  };
}
