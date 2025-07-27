import { NextRequest, NextResponse } from "next/server";
import { getTokenFromCookie, verifyToken } from "@/lib/auth";
import { mockPractices } from "@/lib/mock-data";

/**
 * GET /api/practices
 * 練習予定取得API
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
    const practiceId = searchParams.get('id');

    // 特定の練習予定を取得
    if (practiceId) {
      const practice = mockPractices.find(p => p.id === practiceId);
      if (!practice) {
        return NextResponse.json(
          { error: "練習予定が見つかりません" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: practice,
      });
    }

    // 演奏会に紐づく練習予定一覧を取得
    if (!concertId) {
      return NextResponse.json(
        { error: "演奏会IDが必要です" },
        { status: 400 }
      );
    }

    // 指定された演奏会の練習予定を時系列順で取得
    const practices = mockPractices
      .filter(practice => practice.concertId === concertId)
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    return NextResponse.json({
      success: true,
      data: practices,
    });

  } catch (error) {
    console.error("Practices API error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/practices
 * 練習予定作成API（管理者のみ）
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
    const { 
      concertId, 
      title, 
      date, 
      venue, 
      items, 
      notes, 
      memo, 
      audioUrl 
    } = body;

    // 入力値検証
    if (!concertId || !title || !date || !venue) {
      return NextResponse.json(
        { error: "必須項目が不足しています" },
        { status: 400 }
      );
    }

    // 日時の形式検証
    const practiceDate = new Date(date);
    if (isNaN(practiceDate.getTime())) {
      return NextResponse.json(
        { error: "有効な日時を入力してください" },
        { status: 400 }
      );
    }

    // 本来はここでデータベースに保存
    // Phase 1ではモックデータとして扱う
    console.log("練習予定作成（モック）:", {
      concertId,
      title,
      date: practiceDate,
      venue,
      items,
      notes,
      memo,
      audioUrl,
      createdBy: payload.userId,
    });

    return NextResponse.json({
      success: true,
      message: "練習予定を作成しました",
    });

  } catch (error) {
    console.error("Practice creation error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/practices
 * 練習予定更新API（管理者のみ）
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
    const { 
      practiceId, 
      title, 
      date, 
      venue, 
      items, 
      notes, 
      memo, 
      audioUrl 
    } = body;

    // 入力値検証
    if (!practiceId) {
      return NextResponse.json(
        { error: "練習予定IDが必要です" },
        { status: 400 }
      );
    }

    // 本来はここでデータベースを更新
    // Phase 1ではモックデータとして扱う
    console.log("練習予定更新（モック）:", {
      practiceId,
      title,
      date,
      venue,
      items,
      notes,
      memo,
      audioUrl,
      updatedBy: payload.userId,
    });

    return NextResponse.json({
      success: true,
      message: "練習予定を更新しました",
    });

  } catch (error) {
    console.error("Practice update error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/practices
 * 練習予定削除API（管理者のみ）
 */
export async function DELETE(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const practiceId = searchParams.get('id');

    if (!practiceId) {
      return NextResponse.json(
        { error: "練習予定IDが必要です" },
        { status: 400 }
      );
    }

    // 本来はここでデータベースから削除
    // Phase 1ではモックデータとして扱う
    console.log("練習予定削除（モック）:", {
      practiceId,
      deletedBy: payload.userId,
    });

    return NextResponse.json({
      success: true,
      message: "練習予定を削除しました",
    });

  } catch (error) {
    console.error("Practice deletion error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}