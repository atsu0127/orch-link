import { PrismaClient } from "@/generated/prisma";

// グローバル型定義（開発環境でのシングルトンパターン用）
const globalForPrisma = global as unknown as { 
  prisma: PrismaClient 
};

// Prismaクライアントのシングルトンインスタンス
// 開発環境では接続問題を避けるためシングルトンを使用
export const prisma = globalForPrisma.prisma || 
  new PrismaClient({
    log: ['query'], // 開発時のクエリログ出力
  });

// 本番環境以外では、グローバルオブジェクトにPrismaクライアントを保存
// これにより、Hot Reloadでの複数インスタンス化を防ぐ
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}