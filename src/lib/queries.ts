/**
 * データベースクエリ関数集
 * Prismaクライアントを使用してデータベースにアクセス
 */

import { prisma } from "@/lib/db";

/**
 * 演奏会詳細データを取得（関連データ含む）
 * @param concertId - 演奏会ID
 * @returns 演奏会データ（出欠調整、楽譜、練習予定を含む）、見つからない場合はnull
 */
export async function getConcertData(concertId: string) {
  const concert = await prisma.concert.findUnique({
    where: { id: concertId },
    include: {
      attendanceForms: {
        orderBy: { createdAt: "desc" },
      },
      scores: {
        include: {
          comments: {
            orderBy: { createdAt: "desc" },
          },
        },
        orderBy: { updatedAt: "desc" },
      },
      practices: {
        orderBy: { startTime: "asc" },
      },
    },
  });

  if (!concert) return null;

  // モックデータと同じ構造でレスポンスを返す
  return {
    concert,
    attendanceForms: concert.attendanceForms || [],
    scores: concert.scores || [],
    practices: concert.practices || [],
  };
}

/**
 * アクティブな演奏会一覧を取得
 * @returns アクティブな演奏会リスト
 */
export async function getActiveConcerts() {
  return await prisma.concert.findMany({
    where: { isActive: true },
    orderBy: { updatedAt: "desc" },
  });
}

/**
 * 全演奏会一覧を取得
 * @returns 全演奏会リスト
 */
export async function getAllConcerts() {
  return await prisma.concert.findMany({
    orderBy: { updatedAt: "desc" },
  });
}

/**
 * 指定演奏会の練習予定一覧を取得
 * @param concertId - 演奏会ID
 * @returns 練習予定リスト
 */
export async function getPracticesByConcert(concertId: string) {
  return await prisma.practice.findMany({
    where: { concertId },
    orderBy: { startTime: "asc" },
  });
}

/**
 * 指定演奏会の楽譜一覧を取得（コメント付き）
 * @param concertId - 演奏会ID
 * @returns 楽譜リスト（コメント含む）
 */
export async function getScoresByConcert(concertId: string) {
  return await prisma.score.findMany({
    where: { concertId },
    include: {
      comments: {
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
}

/**
 * 指定演奏会の出欠調整一覧を取得
 * @param concertId - 演奏会ID
 * @returns 出欠調整リスト
 */
export async function getAttendanceFormsByConcert(concertId: string) {
  return await prisma.attendanceForm.findMany({
    where: { concertId },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * 連絡先情報を取得
 * @returns 連絡先情報（最新の1件）、見つからない場合はnull
 */
export async function getContactInfo() {
  const contactInfos = await prisma.contactInfo.findMany({
    orderBy: { updatedAt: "desc" },
  });

  // 最新の1件を返す（mockContactInfoは単一オブジェクトだったため）
  return contactInfos.length > 0 ? contactInfos[0] : null;
}
