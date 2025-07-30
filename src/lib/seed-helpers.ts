// シードとAPI操作のためのヘルパー関数
import { prisma } from "@/lib/db";
import { ConcertFormData } from "@/types/concert";

/**
 * 特定の演奏会のデータを取得（関連データ含む）
 * モックデータのgetConcertData()と同等の機能をPrismaで実装
 */
export async function getConcertDataFromDB(concertId: string) {
  const concert = await prisma.concert.findUnique({
    where: { id: concertId },
    include: {
      attendanceForms: {
        orderBy: { createdAt: 'desc' }
      },
      scores: {
        include: {
          comments: {
            orderBy: { createdAt: 'desc' }
          }
        },
        orderBy: { updatedAt: 'desc' }
      },
      practices: {
        orderBy: { startTime: 'asc' }
      }
    }
  });

  if (!concert) return null;

  // PATTERN: モックデータと同じ構造でレスポンスを返す
  return {
    concert,
    attendanceForms: concert.attendanceForms || [],
    scores: concert.scores || [],
    practices: concert.practices || [],
  };
}

/**
 * アクティブな演奏会のみ取得
 * モックデータのgetActiveConcerts()と同等の機能をPrismaで実装
 */
export async function getActiveConcertsFromDB() {
  return await prisma.concert.findMany({
    where: { isActive: true },
    orderBy: { updatedAt: 'desc' }
  });
}

/**
 * 全演奏会取得
 * モックデータのmockConcertsと同等の機能をPrismaで実装
 */
export async function getAllConcertsFromDB() {
  return await prisma.concert.findMany({
    orderBy: { updatedAt: 'desc' }
  });
}

/**
 * 特定演奏会の練習予定取得（時系列順）
 * モックデータのフィルタリングロジックをPrismaで実装
 */
export async function getPracticesByConcertFromDB(concertId: string) {
  return await prisma.practice.findMany({
    where: { concertId },
    orderBy: { startTime: 'asc' }
  });
}

/**
 * 特定演奏会の楽譜取得（コメント含む）
 * モックデータのフィルタリングロジックをPrismaで実装
 */
export async function getScoresByConcertFromDB(concertId: string) {
  return await prisma.score.findMany({
    where: { concertId },
    include: {
      comments: {
        orderBy: { createdAt: 'desc' }
      }
    },
    orderBy: { updatedAt: 'desc' }
  });
}

/**
 * 特定演奏会の出欠調整取得
 * モックデータのフィルタリングロジックをPrismaで実装
 */
export async function getAttendanceFormsByConcertFromDB(concertId: string) {
  return await prisma.attendanceForm.findMany({
    where: { concertId },
    orderBy: { createdAt: 'desc' }
  });
}

/**
 * 連絡先情報取得
 * モックデータのmockContactInfoと同等の機能をPrismaで実装
 */
export async function getContactInfoFromDB() {
  return await prisma.contactInfo.findMany({
    orderBy: { updatedAt: 'desc' }
  });
}

/**
 * 日付フォーマット用ヘルパー（モックデータから移植）
 * 元のformatDate関数と同じ機能
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * 日付のみフォーマット用ヘルパー（モックデータから移植）
 * 元のformatDateOnly関数と同じ機能
 */
export function formatDateOnly(date: Date): string {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long', 
    day: 'numeric',
  }).format(date);
}

/**
 * 演奏会作成
 * 管理者用のCRUD操作：新規演奏会作成
 */
export async function createConcertInDB(data: ConcertFormData) {
  const concertDate = new Date(data.date);
  
  return await prisma.concert.create({
    data: {
      title: data.title,
      date: concertDate,
      venue: data.venue,
      isActive: data.isActive,
    },
  });
}

/**
 * 演奏会更新
 * 管理者用のCRUD操作：既存演奏会の情報更新
 */
export async function updateConcertInDB(id: string, data: Partial<ConcertFormData>) {
  const updateData: {
    title?: string;
    date?: Date;
    venue?: string;
    isActive?: boolean;
  } = {};
  
  if (data.title !== undefined) updateData.title = data.title;
  if (data.date !== undefined) updateData.date = new Date(data.date);
  if (data.venue !== undefined) updateData.venue = data.venue;
  if (data.isActive !== undefined) updateData.isActive = data.isActive;
  
  return await prisma.concert.update({
    where: { id },
    data: updateData,
  });
}

/**
 * 演奏会論理削除
 * 管理者用のCRUD操作：演奏会をアクティブ状態から無効化（論理削除）
 */
export async function deleteConcertInDB(id: string) {
  return await prisma.concert.update({
    where: { id },
    data: { isActive: false },
  });
}