import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/db";

/**
 * PUT /api/score-comments
 * 楽譜コメント編集API（管理者のみ）
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
    const { commentId, content } = body;

    // 入力値検証
    if (!commentId || !content) {
      return NextResponse.json(
        { error: "コメントIDと内容が必要です" },
        { status: 400 }
      );
    }

    if (content.trim().length === 0) {
      return NextResponse.json(
        { error: "コメント内容を入力してください" },
        { status: 400 }
      );
    }

    // データベースのコメントを更新
    await prisma.scoreComment.update({
      where: { id: commentId },
      data: { content: content.trim() },
    });
    
    console.log("楽譜コメント更新完了:", {
      commentId,
      updatedBy: payload.userId,
    });

    return NextResponse.json({
      success: true,
      message: "コメントを更新しました",
    });

  } catch (error) {
    console.error("ScoreComment update error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/score-comments
 * 楽譜コメント削除API（管理者のみ）
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
    const commentId = searchParams.get('id');

    if (!commentId) {
      return NextResponse.json(
        { error: "コメントIDが必要です" },
        { status: 400 }
      );
    }

    // データベースからコメントを削除
    await prisma.scoreComment.delete({
      where: { id: commentId },
    });
    
    console.log("楽譜コメント削除完了:", {
      commentId,
      deletedBy: payload.userId,
    });

    return NextResponse.json({
      success: true,
      message: "コメントを削除しました",
    });

  } catch (error) {
    console.error("ScoreComment delete error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}