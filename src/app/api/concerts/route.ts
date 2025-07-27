import { NextRequest, NextResponse } from "next/server";
import { getTokenFromCookie, verifyToken } from "@/lib/auth";
import { mockConcerts, getActiveConcerts, getConcertData } from "@/lib/mock-data";

/**
 * GET /api/concerts
 * 演奏会一覧取得API
 */
export async function GET(request: NextRequest) {
  try {
    // JWT認証チェック
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: "無効なトークンです" },
        { status: 401 }
      );
    }

    // クエリパラメータの処理
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';
    const concertId = searchParams.get('id');

    // 特定の演奏会詳細を取得
    if (concertId) {
      const concertData = getConcertData(concertId);
      if (!concertData) {
        return NextResponse.json(
          { error: "演奏会が見つかりません" },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        data: concertData,
      });
    }

    // 演奏会一覧を取得
    const concerts = activeOnly ? getActiveConcerts() : mockConcerts;

    return NextResponse.json({
      success: true,
      data: concerts,
    });

  } catch (error) {
    console.error("Concert API error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}