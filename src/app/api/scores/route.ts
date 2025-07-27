import { NextRequest, NextResponse } from "next/server";
import { getTokenFromCookie, verifyToken } from "@/lib/auth";
import { mockScores } from "@/lib/mock-data";

/**
 * GET /api/scores
 * 楽譜取得API
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
    const concertId = searchParams.get('concertId');

    if (!concertId) {
      return NextResponse.json(
        { error: "演奏会IDが必要です" },
        { status: 400 }
      );
    }

    // 指定された演奏会の楽譜を取得
    const scores = mockScores.filter(score => score.concertId === concertId);

    return NextResponse.json({
      success: true,
      data: scores,
    });

  } catch (error) {
    console.error("Scores API error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/scores
 * 楽譜作成API（管理者のみ）
 */
export async function POST(request: NextRequest) {
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
    if (!payload || payload.role !== "admin") {
      return NextResponse.json(
        { error: "管理者権限が必要です" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { concertId, title, url } = body;

    // 入力値検証
    if (!concertId || !title || !url) {
      return NextResponse.json(
        { error: "必須項目が不足しています" },
        { status: 400 }
      );
    }

    // URL形式の簡易検証
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: "有効なURLを入力してください" },
        { status: 400 }
      );
    }

    // 本来はここでデータベースに保存
    // Phase 1ではモックデータとして扱う
    console.log("楽譜作成（モック）:", {
      concertId,
      title,
      url,
      createdBy: payload.userId,
    });

    return NextResponse.json({
      success: true,
      message: "楽譜を追加しました",
    });

  } catch (error) {
    console.error("Score creation error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/scores
 * 楽譜更新API（管理者のみ）
 */
export async function PUT(request: NextRequest) {
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
    if (!payload || payload.role !== "admin") {
      return NextResponse.json(
        { error: "管理者権限が必要です" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { scoreId, title, url, comment } = body;

    // 入力値検証
    if (!scoreId) {
      return NextResponse.json(
        { error: "楽譜IDが必要です" },
        { status: 400 }
      );
    }

    // 本来はここでデータベースを更新
    // Phase 1ではモックデータとして扱う
    console.log("楽譜更新（モック）:", {
      scoreId,
      title,
      url,
      comment,
      updatedBy: payload.userId,
    });

    return NextResponse.json({
      success: true,
      message: "楽譜を更新しました",
    });

  } catch (error) {
    console.error("Score update error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}