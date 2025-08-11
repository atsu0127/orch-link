// データベースシードスクリプト - JSONシードデータからPrisma操作への変換
import { PrismaClient } from "../src/generated/prisma";
import { readFileSync } from "fs";
import { join } from "path";

const prisma = new PrismaClient();

// JSONシードデータを読み込み
const seedDataPath = join(__dirname, "..", "src", "lib", "seed-data.json");
const seedDataRaw = readFileSync(seedDataPath, "utf-8");
const seedData = JSON.parse(seedDataRaw);

// ISO文字列をDateオブジェクトに変換するヘルパー関数
function parseDate(dateString: string): Date {
  return new Date(dateString);
}

async function main() {
  console.log("🌱 データベースシード開始...");

  // PATTERN: 依存関係の逆順でデータクリア（冪等性のため）
  console.log("📋 既存データの削除中...");
  await prisma.scoreComment.deleteMany({});
  await prisma.score.deleteMany({});
  await prisma.practice.deleteMany({});
  await prisma.attendanceForm.deleteMany({});
  await prisma.concert.deleteMany({});
  await prisma.contactInfo.deleteMany({});

  // CRITICAL: 依存関係順でデータ作成（親エンティティから子エンティティへ）
  console.log("🎼 演奏会データの作成中...");
  await prisma.concert.createMany({
    data: seedData.concerts.map((concert: any) => ({
      id: concert.id,
      title: concert.title,
      date: parseDate(concert.date),
      venue: concert.venue,
      isActive: concert.isActive,
      createdAt: parseDate(concert.updatedAt), // createdAtにupdatedAtを使用
      updatedAt: parseDate(concert.updatedAt),
    })),
  });

  console.log("📝 連絡先情報の作成中...");
  await prisma.contactInfo.createMany({
    data: seedData.contactInfo.map((contact: any) => ({
      id: contact.id,
      email: contact.email,
      description: contact.description,
      createdAt: parseDate(contact.updatedAt), // createdAtにupdatedAtを使用
      updatedAt: parseDate(contact.updatedAt),
    })),
  });

  console.log("📋 出欠調整の作成中...");
  await prisma.attendanceForm.createMany({
    data: seedData.attendanceForms.map((form: any) => ({
      id: form.id,
      concertId: form.concertId,
      title: form.title,
      url: form.url,
      description: form.description,
      createdAt: parseDate(form.updatedAt), // createdAtにupdatedAtを使用
      updatedAt: parseDate(form.updatedAt),
    })),
  });

  console.log("🎵 楽譜データの作成中...");
  // CRITICAL: 楽譜からcommentsフィールドを除外（別テーブルのため）
  await prisma.score.createMany({
    data: seedData.scores.map((score: any) => ({
      id: score.id,
      concertId: score.concertId,
      title: score.title,
      url: score.url,
      isValid: score.isValid,
      createdAt: parseDate(score.updatedAt), // createdAtにupdatedAtを使用
      updatedAt: parseDate(score.updatedAt),
    })),
  });

  console.log("💬 楽譜コメントの作成中...");
  await prisma.scoreComment.createMany({
    data: seedData.scoreComments.map((comment: any) => ({
      id: comment.id,
      scoreId: comment.scoreId,
      content: comment.content,
      createdAt: parseDate(comment.createdAt),
    })),
  });

  console.log("🎪 練習予定の作成中...");
  await prisma.practice.createMany({
    data: seedData.practices.map((practice: any) => ({
      id: practice.id,
      concertId: practice.concertId,
      title: practice.title,
      startTime: parseDate(practice.startTime),
      endTime: practice.endTime ? parseDate(practice.endTime) : null,
      venue: practice.venue,
      address: practice.address,
      items: practice.items,
      notes: practice.notes,
      memo: practice.memo,
      audioUrl: practice.audioUrl,
      videoUrl: practice.videoUrl,
      createdAt: parseDate(practice.updatedAt), // createdAtにupdatedAtを使用
      updatedAt: parseDate(practice.updatedAt),
    })),
  });

  // データ作成の検証
  const concertCount = await prisma.concert.count();
  const scoreCount = await prisma.score.count();
  const practiceCount = await prisma.practice.count();
  const attendanceFormCount = await prisma.attendanceForm.count();
  const scoreCommentCount = await prisma.scoreComment.count();
  const contactInfoCount = await prisma.contactInfo.count();

  console.log("✅ シード完了!");
  console.log(`📊 作成されたデータ:
    - 演奏会: ${concertCount}件
    - 楽譜: ${scoreCount}件  
    - 楽譜コメント: ${scoreCommentCount}件
    - 練習予定: ${practiceCount}件
    - 出欠調整: ${attendanceFormCount}件
    - 連絡先情報: ${contactInfoCount}件`);
}

main()
  .catch((e) => {
    console.error("🚨 シードエラー:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });