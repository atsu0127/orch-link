import { NextResponse } from "next/server";

/**
 * POST /api/auth/logout
 * ログアウト処理
 */
export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: "ログアウトしました",
    });

    // 認証クッキーを削除
    console.log("response", response);
    response.cookies.delete("auth-token");
    console.log("response", response);

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}
