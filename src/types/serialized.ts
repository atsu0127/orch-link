/**
 * API応答型定義
 * JSON経由でDate型がstring型に変換された後の型定義
 */

import {
  Concert,
  AttendanceForm,
  Score,
  ScoreComment,
  Practice,
  ContactInfo,
} from "./index";

/**
 * Date型をstring型に変換するユーティリティ型
 */
export type WithSerializedDates<T> = {
  [K in keyof T]: T[K] extends Date
    ? string
    : T[K] extends Date | null
    ? string | null
    : T[K] extends Date | undefined
    ? string | undefined
    : T[K] extends (infer U)[]
    ? WithSerializedDates<U>[]
    : T[K] extends object
    ? WithSerializedDates<T[K]>
    : T[K];
};

// API応答用の個別型定義
export type ConcertAPI = WithSerializedDates<Concert>;
export type AttendanceFormAPI = WithSerializedDates<AttendanceForm>;
export type ScoreAPI = WithSerializedDates<Score>;
export type ScoreCommentAPI = WithSerializedDates<ScoreComment>;
export type PracticeAPI = WithSerializedDates<Practice>;
export type ContactInfoAPI = WithSerializedDates<ContactInfo>;

// 演奏会詳細データのAPI応答型
export interface ConcertDetailAPI {
  concert: ConcertAPI;
  attendanceForms: AttendanceFormAPI[];
  scores: ScoreAPI[];
  practices: PracticeAPI[];
}

// API共通レスポンス型
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// API呼び出しの具体的なレスポンス型
export type ConcertsListResponse = ApiResponse<ConcertAPI[]>;
export type ConcertDetailResponse = ApiResponse<ConcertDetailAPI>;
export type ContactInfoResponse = ApiResponse<ContactInfoAPI>;
