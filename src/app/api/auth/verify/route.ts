import { NextRequest, NextResponse } from "next/server";
import { getTokenFromCookie, verifyToken } from "@/lib/auth";

/**
 * GET /api/auth/verify
 * JWTトークン検証エンドポイント
 * クライアント側での認証状態確認に使用
 */
export async function GET(request: NextRequest) {
  try {
    // Cookieからトークンを取得
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json(
        { authenticated: false, error: "トークンが見つかりません" },
        { status: 401 }
      );
    }

    // トークンの検証
    const payload = await verifyToken(token);

    if (!payload) {
      // 無効なトークンの場合、クッキーを削除
      const response = NextResponse.json(
        { authenticated: false, error: "無効なトークンです" },
        { status: 401 }
      );
      response.cookies.delete("auth-token");
      return response;
    }

    // 有効なトークンの場合、ユーザー情報を返す
    return NextResponse.json({
      authenticated: true,
      user: {
        userId: payload.userId,
        role: payload.role,
        email: payload.email,
      },
    });
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json(
      { authenticated: false, error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/auth/logout
 * ログアウト処理
 */
export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({
      success: true,
      message: "ログアウトしました",
    });

    // 認証クッキーを削除
    response.cookies.delete("auth-token");

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}
