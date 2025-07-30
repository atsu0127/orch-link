import { NextRequest, NextResponse } from "next/server";
import { getTokenFromCookie, verifyToken } from "@/lib/auth";
import { getPracticesByConcertFromDB } from "@/lib/seed-helpers";
import { prisma } from "@/lib/db";

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
      const practice = await prisma.practice.findUnique({
        where: { id: practiceId }
      });
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
    const practices = await getPracticesByConcertFromDB(concertId);

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
      startTime, 
      endTime,
      venue, 
      address,
      items, 
      notes, 
      memo, 
      audioUrl,
      videoUrl 
    } = body;

    // 入力値検証
    if (!concertId || !title || !startTime || !venue) {
      return NextResponse.json(
        { error: "必須項目が不足しています" },
        { status: 400 }
      );
    }

    // 開始時間の形式検証
    const practiceStartTime = new Date(startTime);
    if (isNaN(practiceStartTime.getTime())) {
      return NextResponse.json(
        { error: "有効な開始時間を入力してください" },
        { status: 400 }
      );
    }

    // 終了時間の検証（提供されている場合）
    let practiceEndTime;
    if (endTime) {
      practiceEndTime = new Date(endTime);
      if (isNaN(practiceEndTime.getTime())) {
        return NextResponse.json(
          { error: "有効な終了時間を入力してください" },
          { status: 400 }
        );
      }
      if (practiceEndTime <= practiceStartTime) {
        return NextResponse.json(
          { error: "終了時間は開始時間より後に設定してください" },
          { status: 400 }
        );
      }
    }

    // データベースに練習予定を作成
    const newPractice = await prisma.practice.create({
      data: {
        concertId,
        title,
        startTime: practiceStartTime,
        endTime: practiceEndTime,
        venue,
        address,
        items,
        notes,
        memo,
        audioUrl,
        videoUrl,
      },
    });
    
    console.log("練習予定作成完了:", {
      practiceId: newPractice.id,
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
      startTime,
      endTime, 
      venue,
      address, 
      items, 
      notes, 
      memo, 
      audioUrl,
      videoUrl 
    } = body;

    // 入力値検証
    if (!practiceId) {
      return NextResponse.json(
        { error: "練習予定IDが必要です" },
        { status: 400 }
      );
    }

    // 時間の検証（更新時）
    if (startTime !== undefined && endTime !== undefined) {
      const newStartTime = new Date(startTime);
      const newEndTime = new Date(endTime);
      if (!isNaN(newStartTime.getTime()) && !isNaN(newEndTime.getTime()) && newEndTime <= newStartTime) {
        return NextResponse.json(
          { error: "終了時間は開始時間より後に設定してください" },
          { status: 400 }
        );
      }
    }

    // データベースの練習予定を更新
    const updateData: Record<string, any> = {};
    if (title !== undefined) updateData.title = title;
    if (startTime !== undefined) updateData.startTime = new Date(startTime);
    if (endTime !== undefined) updateData.endTime = endTime ? new Date(endTime) : null;
    if (venue !== undefined) updateData.venue = venue;
    if (address !== undefined) updateData.address = address;
    if (items !== undefined) updateData.items = items;
    if (notes !== undefined) updateData.notes = notes;
    if (memo !== undefined) updateData.memo = memo;
    if (audioUrl !== undefined) updateData.audioUrl = audioUrl;
    if (videoUrl !== undefined) updateData.videoUrl = videoUrl;
    
    await prisma.practice.update({
      where: { id: practiceId },
      data: updateData,
    });
    
    console.log("練習予定更新完了:", {
      practiceId,
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

    // データベースから練習予定を削除
    await prisma.practice.delete({
      where: { id: practiceId },
    });
    
    console.log("練習予定削除完了:", {
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