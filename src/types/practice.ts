/**
 * 練習予定フォーム用のデータ型
 * フォーム入力では日時をISO文字列として扱う
 */
export interface PracticeFormData {
  concertId: string;
  title: string;
  startTime: string; // ISO文字列形式（フォーム入力用）
  endTime?: string;  // ISO文字列形式（フォーム入力用）
  venue: string;
  address?: string;
  items?: string;
  notes?: string;
  memo?: string;
  audioUrl?: string;
  videoUrl?: string;
}

/**
 * 練習予定API用のレスポンス型
 */
export interface PracticeApiResponse {
  success: boolean;
  message?: string;
  error?: string;
}