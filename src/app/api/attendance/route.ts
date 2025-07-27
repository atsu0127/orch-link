import { NextRequest, NextResponse } from "next/server";
import { getTokenFromCookie, verifyToken } from "@/lib/auth";
import { getAttendanceFormsByConcertFromDB } from "@/lib/seed-helpers";
import { prisma } from "@/lib/db";

/**
 * GET /api/attendance
 * 出欠調整取得API
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

    // 指定された演奏会の出欠調整を取得
    const attendanceForms = await getAttendanceFormsByConcertFromDB(concertId);

    return NextResponse.json({
      success: true,
      data: attendanceForms,
    });

  } catch (error) {
    console.error("Attendance API error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/attendance
 * 出欠調整作成API（管理者のみ）
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
    const { concertId, title, url, description } = body;

    // 入力値検証
    if (!concertId || !title || !url) {
      return NextResponse.json(
        { error: "必須項目が不足しています" },
        { status: 400 }
      );
    }

    // データベースに出欠調整を作成
    const newAttendanceForm = await prisma.attendanceForm.create({
      data: {
        concertId,
        title,
        url,
        description,
      },
    });
    
    console.log("出欠調整作成完了:", {
      attendanceFormId: newAttendanceForm.id,
      createdBy: payload.userId,
    });

    return NextResponse.json({
      success: true,
      message: "出欠調整を作成しました",
    });

  } catch (error) {
    console.error("Attendance creation error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}