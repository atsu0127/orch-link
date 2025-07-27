import { NextRequest, NextResponse } from "next/server";
import { getTokenFromCookie, verifyToken } from "@/lib/auth";
import { mockContactInfo } from "@/lib/mock-data";

/**
 * GET /api/contact
 * 連絡先情報取得API
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

    // 連絡先情報を取得（最初のアイテムを使用）
    const contactInfo = mockContactInfo[0];

    if (!contactInfo) {
      return NextResponse.json(
        { error: "連絡先情報が見つかりません" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: contactInfo,
    });

  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/contact
 * 連絡先情報更新API（管理者のみ）
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
    const { email, description } = body;

    // 入力値検証
    if (!email || !description) {
      return NextResponse.json(
        { error: "メールアドレスと説明文は必須です" },
        { status: 400 }
      );
    }

    // メールアドレス形式の簡易検証
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "有効なメールアドレスを入力してください" },
        { status: 400 }
      );
    }

    // 本来はここでデータベースを更新
    // Phase 1ではモックデータとして扱う
    console.log("連絡先情報更新（モック）:", {
      email,
      description,
      updatedBy: payload.userId,
    });

    return NextResponse.json({
      success: true,
      message: "連絡先情報を更新しました",
    });

  } catch (error) {
    console.error("Contact update error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/contact/send
 * メール送信API（将来の拡張用）
 * 現在はmailtoリンクを使用しているが、将来的に直接メール送信機能を追加する場合に使用
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
    if (!payload) {
      return NextResponse.json(
        { error: "無効なトークンです" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { subject, message, senderEmail } = body;

    // 入力値検証
    if (!subject || !message) {
      return NextResponse.json(
        { error: "件名とメッセージは必須です" },
        { status: 400 }
      );
    }

    // Phase 1では実際にはメール送信しない（将来の実装用）
    console.log("メール送信（モック）:", {
      subject,
      message,
      senderEmail,
      senderRole: payload.role,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "メールを送信しました（現在はモック実装）",
    });

  } catch (error) {
    console.error("Contact send error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}