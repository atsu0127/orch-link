import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

// JWTペイロード型定義
export interface JWTPayload {
  userId: string;
  role: "admin" | "viewer";
  email?: string;
  exp: number;
}

// 共通パスワード設定（本番環境では環境変数に移行）
const ADMIN_PASSWORD = "admin-password";
const VIEWER_PASSWORD = "viewer-password";

/**
 * JWTトークン生成関数
 * @param payload - ユーザー情報（有効期限以外）
 * @returns 生成されたJWTトークン
 */
export async function generateToken(
  payload: Omit<JWTPayload, "exp">
): Promise<string> {
  // セキュリティ: 短時間有効期限（1日）
  const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secret);

  return token;
}

/**
 * JWTトークン検証関数
 * @param token - 検証するJWTトークン
 * @returns 有効な場合はペイロード、無効な場合はnull
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    // 重要: 秘密鍵での署名検証
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);

    // JoseのJWTPayloadから我々のJWTPayloadに変換
    return {
      userId: payload.userId as string,
      role: payload.role as "admin" | "viewer",
      email: payload.email as string | undefined,
      exp: payload.exp as number,
    };
  } catch {
    return null;
  }
}

/**
 * Cookieからトークン取得
 * @returns トークン文字列またはnull
 */
export async function getTokenFromCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("auth-token")?.value || null;
}

/**
 * パスワード認証関数
 * @param password - 入力されたパスワード
 * @param role - ユーザーロール
 * @returns 認証成功時true、失敗時false
 */
export function authenticatePassword(
  password: string,
  role: "admin" | "viewer"
): boolean {
  if (role === "admin") {
    return password === ADMIN_PASSWORD;
  } else if (role === "viewer") {
    return password === VIEWER_PASSWORD;
  }
  return false;
}

/**
 * HTTPOnlyクッキー設定用のオプション生成
 * @returns クッキー設定オプション
 */
export function getCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: 24 * 60 * 60, // 1日
    path: "/",
  };
}
