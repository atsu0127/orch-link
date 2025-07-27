import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

/**
 * Next.js ミドルウェア - JWT認証とルート保護
 * 管理者専用ルートとAPIエンドポイントへのアクセスを制御
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 認証が不要なパス（ログインページと認証API）
  const publicPaths = ["/login", "/api/auth/login", "/api/auth/verify"];

  // 管理者専用パス
  const adminPaths = ["/admin"];

  // 保護が必要なAPIパス
  const protectedApiPaths = [
    "/api/concerts",
    "/api/attendance",
    "/api/scores",
    "/api/practices",
    "/api/contact",
  ];

  // パブリックパスの場合はそのまま通す
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // Cookieからトークンを取得
  const token = request.cookies.get("auth-token")?.value;
  if (!token) {
    // トークンがない場合はログインページにリダイレクト
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // トークンの検証
  const payload = await verifyToken(token);

  if (!payload) {
    // 無効なトークンの場合はログインページにリダイレクト
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("auth-token"); // 無効なトークンを削除
    return response;
  }

  // 管理者専用パスのチェック
  if (adminPaths.some((path) => pathname.startsWith(path))) {
    if (payload.role !== "admin") {
      // 管理者以外はアクセス禁止
      return NextResponse.json(
        { error: "管理者権限が必要です" },
        { status: 403 }
      );
    }
  }

  // 保護されたAPIパスのチェック
  if (protectedApiPaths.some((path) => pathname.startsWith(path))) {
    // リクエストヘッダーにユーザー情報を追加（API側で使用可能）
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", payload.userId);
    requestHeaders.set("x-user-role", payload.role);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // その他のパスはそのまま通す
  return NextResponse.next();
}

// ミドルウェアを適用するパスの設定
export const config = {
  matcher: [
    /*
     * 以下を除くすべてのパスにマッチ:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico|sw).*)",
  ],
};
