import { NextRequest, NextResponse } from "next/server";
import {
  generateToken,
  authenticatePassword,
  getCookieOptions,
} from "@/lib/auth";

// ログインリクエストの型定義
interface LoginRequest {
  password: string;
  role: "admin" | "viewer";
}

/**
 * POST /api/auth/login
 * ユーザーログイン処理（管理者・閲覧者共通）
 */
export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();
    const { password, role } = body;

    // 入力値検証
    if (!password || !role) {
      return NextResponse.json(
        { error: "パスワードとロールを入力してください" },
        { status: 400 }
      );
    }

    if (role !== "admin" && role !== "viewer") {
      return NextResponse.json({ error: "無効なロールです" }, { status: 400 });
    }

    // パスワード認証
    const isAuthenticated = authenticatePassword(password, role);

    if (!isAuthenticated) {
      return NextResponse.json(
        { error: "パスワードが正しくありません" },
        { status: 401 }
      );
    }

    // JWTトークン生成
    const token = await generateToken({
      userId: role === "admin" ? "admin-user" : "viewer-user",
      role,
      email: role === "admin" ? "admin@orch-link.com" : undefined,
    });

    // レスポンスの作成
    const response = NextResponse.json({
      success: true,
      user: {
        role,
        email: role === "admin" ? "admin@orch-link.com" : undefined,
      },
    });

    // HTTPOnlyクッキーにトークンを設定
    response.cookies.set("auth-token", token, getCookieOptions());

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}
