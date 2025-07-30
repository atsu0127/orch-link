import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { 
  getAllConcertsFromDB, 
  getActiveConcertsFromDB, 
  getConcertDataFromDB 
} from "@/lib/seed-helpers";
import { prisma } from "@/lib/db";

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
      const concertData = await getConcertDataFromDB(concertId);
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
    const concerts = activeOnly ? await getActiveConcertsFromDB() : await getAllConcertsFromDB();

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

/**
 * POST /api/concerts
 * 演奏会作成API（管理者のみ）
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
    const { title, date, venue, isActive } = body;

    // 入力値検証
    if (!title || !date || !venue) {
      return NextResponse.json(
        { error: "必須項目が不足しています" },
        { status: 400 }
      );
    }

    // 日付の形式検証
    const concertDate = new Date(date);
    if (isNaN(concertDate.getTime())) {
      return NextResponse.json(
        { error: "有効な日付を入力してください" },
        { status: 400 }
      );
    }

    // データベースに演奏会を作成
    const newConcert = await prisma.concert.create({
      data: {
        title,
        date: concertDate,
        venue,
        isActive: isActive ?? true,
      },
    });
    
    console.log("演奏会作成完了:", {
      concertId: newConcert.id,
      createdBy: payload.userId,
    });

    return NextResponse.json({
      success: true,
      message: "演奏会を作成しました",
    });

  } catch (error) {
    console.error("Concert creation error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/concerts
 * 演奏会更新API（管理者のみ）
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
    const { concertId, title, date, venue, isActive } = body;

    // 入力値検証
    if (!concertId) {
      return NextResponse.json(
        { error: "演奏会IDが必要です" },
        { status: 400 }
      );
    }

    // 日付の検証（更新時）
    let concertDate;
    if (date !== undefined) {
      concertDate = new Date(date);
      if (isNaN(concertDate.getTime())) {
        return NextResponse.json(
          { error: "有効な日付を入力してください" },
          { status: 400 }
        );
      }
    }

    // データベースの演奏会を更新
    const updateData: {
      title?: string;
      date?: Date;
      venue?: string;
      isActive?: boolean;
    } = {};
    if (title !== undefined) updateData.title = title;
    if (date !== undefined) updateData.date = concertDate;
    if (venue !== undefined) updateData.venue = venue;
    if (isActive !== undefined) updateData.isActive = isActive;
    
    await prisma.concert.update({
      where: { id: concertId },
      data: updateData,
    });
    
    console.log("演奏会更新完了:", {
      concertId,
      updatedBy: payload.userId,
    });

    return NextResponse.json({
      success: true,
      message: "演奏会を更新しました",
    });

  } catch (error) {
    console.error("Concert update error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/concerts
 * 演奏会論理削除API（管理者のみ）
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
    const concertId = searchParams.get('id');

    if (!concertId) {
      return NextResponse.json(
        { error: "演奏会IDが必要です" },
        { status: 400 }
      );
    }

    // データベースの演奏会を論理削除（isActive = false）
    await prisma.concert.update({
      where: { id: concertId },
      data: { isActive: false },
    });
    
    console.log("演奏会論理削除完了:", {
      concertId,
      deletedBy: payload.userId,
    });

    return NextResponse.json({
      success: true,
      message: "演奏会を削除しました",
    });

  } catch (error) {
    console.error("Concert deletion error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}