name: "Next.js 15 Orch Link Application - Initial Setup PRP"
description: |

## Purpose

Create a complete Next.js 15 application setup for the Orch Link (Orchestra Extra Communication Portal) project, implementing Phase 1 of development with local SQLite/mock data, JWT authentication foundation, and mobile-responsive UI components.

## Core Principles

1. **Context is King**: Include ALL necessary documentation, examples, and caveats
2. **Validation Loops**: Provide executable tests/lints the AI can run and fix
3. **Information Dense**: Use keywords and patterns from Next.js 15 best practices
4. **Progressive Success**: Start simple, validate, then enhance
5. **Global rules**: Follow CLAUDE.md instructions (Japanese comments, mobile-first design)

---

## Goal

Set up a production-ready Next.js 15 application from scratch that serves as the foundation for the Orchestra Extra Communication Portal. The application should include complete project scaffolding, authentication infrastructure, mobile-responsive UI components, and be ready for Phase 1 local development with mock data.

## Why

- **Business value**: Enables immediate UI/UX development and validation for Phase 1
- **Integration**: Creates foundation for GCP deployment in Phase 2-5
- **Problems solved**: Provides complete development environment for orchestra extra communication features

## What

A fully functional Next.js 15 application with:

- Mobile-first responsive design using Tailwind CSS
- JWT-based authentication system (dual: admin + viewer roles)
- Tab-based navigation UI for core features
- Mock data system for development
- Database-ready structure with Prisma ORM
- Japanese code comments and English documentation

### Success Criteria

- [ ] Next.js 15 app runs successfully with `npm run dev`
- [ ] All core UI components render correctly on mobile devices
- [ ] JWT authentication flow works for both admin and viewer roles
- [ ] Tab navigation between all 4 main sections functions properly
- [ ] Code passes all linting and type checking
- [ ] Mock data displays correctly in all sections
- [ ] Mobile-responsive design works across different screen sizes
- [ ] Use Component Library(Mantine)

## All Needed Context

### Documentation & References

```yaml
# MUST READ - Include these in your context window
- url: https://nextjs.org/docs/app/getting-started/installation
  why: Official Next.js 15 setup guide with App Router

- url: https://www.prisma.io/docs/guides/nextjs
  why: Prisma integration patterns and database setup

- url: https://tailwindcss.com/docs/responsive-design
  why: Mobile-first responsive design principles

- url: https://www.wisp.blog/blog/best-practices-in-implementing-jwt-in-nextjs-15
  why: JWT authentication security patterns for Next.js 15

- file: /Users/tabata/src/github.com/atsu0127/orch-link/CLAUDE.md
  why: Project-specific guidelines and architectural decisions

- file: /Users/tabata/src/github.com/atsu0127/orch-link/docs/requirements.md
  why: Detailed feature requirements and user stories

- file: /Users/tabata/src/github.com/atsu0127/orch-link/docs/screen_design.md
  why: UI/UX specifications for all components

- file: /Users/tabata/src/github.com/atsu0127/orch-link/docs/architecture.md
  why: System architecture and technology stack decisions
```

### Current Codebase tree

```bash
/Users/tabata/src/github.com/atsu0127/orch-link
├── CLAUDE.md
├── docs/
│   ├── architecture.md
│   ├── plan.md
│   ├── requirements.md
│   └── screen_design.md
├── INITIAL.md
├── PRPs/
│   ├── EXAMPLE_multi_agent_prp.md
│   └── templates/
│       └── prp_base.md
└── README.md
```

### Desired Codebase tree with files to be added

```bash
/Users/tabata/src/github.com/atsu0127/orch-link
├── .env.local                     # 環境変数設定
├── .gitignore                     # Git除外設定
├── next.config.js                 # Next.js設定
├── package.json                   # 依存関係定義
├── tailwind.config.js            # Tailwind CSS設定
├── tsconfig.json                 # TypeScript設定
├── postcss.config.js             # PostCSS設定
├── prisma/
│   ├── schema.prisma             # データベーススキーマ定義
│   ├── migrations/               # マイグレーションファイル
│   └── seed.ts                   # シードデータ
├── src/
│   ├── app/
│   │   ├── globals.css           # グローバルスタイル
│   │   ├── layout.tsx            # ルートレイアウト
│   │   ├── page.tsx              # ホームページ
│   │   ├── login/
│   │   │   └── page.tsx          # ログインページ
│   │   └── api/
│   │       ├── auth/
│   │       │   ├── login/route.ts     # ログインAPI
│   │       │   └── verify/route.ts    # JWT検証API
│   │       ├── concerts/route.ts      # 演奏会管理API
│   │       ├── attendance/route.ts    # 出欠調整API
│   │       ├── scores/route.ts        # 楽譜リンクAPI
│   │       ├── practices/route.ts     # 練習予定API
│   │       └── contact/route.ts       # 連絡先API
│   ├── components/
│   │   ├── layout/               # レイアウトコンポーネント
│   │   │   ├── Header.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── Footer.tsx
│   │   └── features/             # 機能別コンポーネント
│   │       ├── auth/
│   │       │   ├── LoginForm.tsx
│   │       │   └── AuthProvider.tsx
│   │       ├── concerts/
│   │       │   └── ConcertSelector.tsx
│   │       ├── attendance/
│   │       │   └── AttendanceTab.tsx
│   │       ├── scores/
│   │       │   └── ScoresTab.tsx
│   │       ├── practices/
│   │       │   ├── PracticesList.tsx
│   │       │   └── PracticeDetail.tsx
│   │       └── contact/
│   │           └── ContactTab.tsx
│   ├── lib/
│   │   ├── auth.ts               # JWT認証ユーティリティ
│   │   ├── db.ts                 # データベース接続
│   │   ├── mock-data.ts          # モックデータ
│   │   └── utils.ts              # 共通ユーティリティ
│   ├── types/
│   │   ├── auth.ts               # 認証関連型定義
│   │   ├── concert.ts            # 演奏会関連型定義
│   │   └── index.ts              # 共通型定義
│   └── middleware.ts             # Next.js ミドルウェア
├── docs/                         # 既存ドキュメント
├── PRPs/                         # 既存PRP
└── README.md                     # プロジェクト説明
```

### Known Gotchas & Library Quirks

```typescript
// CRITICAL: Next.js 15 uses React 19 - ensure compatibility
// CRITICAL: Prisma client must be singleton in development to avoid connection issues
// CRITICAL: JWT should use HttpOnly cookies, not localStorage for security
// CRITICAL: Mobile-first design required - all CSS should start with mobile styles
// CRITICAL: Japanese comments required for all business logic and component descriptions
// CRITICAL: Tailwind CSS v4 has different configuration than v3
// CRITICAL: App Router requires all components to be React Server Components by default
// CRITICAL: Use 'use client' directive only when absolutely necessary for interactivity
```

## Implementation Blueprint

### Data models and structure

```typescript
// types/index.ts - 基本データ構造
export interface User {
  id: string;
  email: string;
  role: "admin" | "viewer";
  name?: string;
}

export interface Concert {
  id: string;
  title: string; // 演奏会タイトル
  date: Date; // 開催日
  venue: string; // 開催場所
  isActive: boolean; // アクティブ状態
  updatedAt: Date; // 最終更新日時
}

export interface AttendanceForm {
  id: string;
  concertId: string;
  title: string; // フォームタイトル
  url: string; // 外部フォームURL
  description?: string; // 補足説明
  updatedAt: Date; // 最終更新日時
}

export interface Score {
  id: string;
  concertId: string;
  title: string; // 曲名
  url: string; // 楽譜URL
  isValid: boolean; // リンク有効性
  updatedAt: Date; // 最終更新日時
  comments: ScoreComment[]; // 更新履歴コメント
}

export interface ScoreComment {
  id: string;
  scoreId: string;
  content: string; // コメント内容
  createdAt: Date; // 作成日時
}

export interface Practice {
  id: string;
  concertId: string;
  title: string; // 練習タイトル
  date: Date; // 練習日時
  venue: string; // 練習場所
  items?: string; // 持ち物
  notes?: string; // 注意事項
  memo?: string; // メモ
  audioUrl?: string; // 関連録音URL
  updatedAt: Date; // 最終更新日時
}

export interface ContactInfo {
  id: string;
  email: string; // 管理者メールアドレス
  description: string; // 説明文
  updatedAt: Date; // 最終更新日時
}
```

### List of tasks to be completed

```yaml
Task 1: Initialize Next.js 15 Project → finished
CREATE new Next.js project:
  - COMMAND: npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias="@/*"
  - CONFIRM: TypeScript, Tailwind CSS, ESLint, App Router, src directory
  - VERIFY: Project structure matches expected layout

Task 2: Configure Development Environment → finished
CREATE .env.local:
  - JWT_SECRET for authentication
  - DATABASE_URL for Prisma connection
  - NEXTAUTH_URL for authentication

UPDATE .gitignore:
  - Add .env.local
  - Add database files
  - Add generated Prisma client

Task 3: Setup Prisma ORM → finished
INSTALL Prisma dependencies:
  - COMMAND: npm install prisma @prisma/client --save-dev
  - COMMAND: npx prisma init --datasource-provider sqlite

CREATE prisma/schema.prisma:
  - MIRROR: Database models from types definition
  - CONFIGURE: SQLite for Phase 1 development

GENERATE migration:
  - COMMAND: npx prisma migrate dev --name init

Task 4: Implement Authentication Infrastructure → finished
CREATE lib/auth.ts:
  - PATTERN: JWT creation and verification utilities
  - IMPLEMENT: Role-based token generation (admin/viewer)
  - SECURITY: HttpOnly cookie management

CREATE middleware.ts:
  - PATTERN: Route protection with JWT verification
  - PROTECT: Admin routes and API endpoints

CREATE api/auth routes:
  - IMPLEMENT: Login endpoint with role validation
  - IMPLEMENT: JWT verification endpoint

Task 6: Implement Layout Components
CREATE components/layout/:
  - Header.tsx (ヘッダーコンポーネント)
  - Navigation.tsx (ナビゲーションコンポーネント)
  - Footer.tsx (フッターコンポーネント)

INTEGRATE: Concert selector dropdown in header
IMPLEMENT: Mobile-responsive navigation menu

Task 7: Build Feature Components
CREATE components/features/ directories:
  - auth/ (認証関連コンポーネント)
  - concerts/ (演奏会関連コンポーネント)
  - attendance/ (出欠関連コンポーネント)
  - scores/ (楽譜関連コンポーネント)
  - practices/ (練習関連コンポーネント)
  - contact/ (連絡関連コンポーネント)

Task 8: Implement API Routes
CREATE api/ routes for all data operations:
  - PATTERN: RESTful API design with proper HTTP methods
  - AUTHENTICATION: JWT validation on all protected routes
  - ERROR HANDLING: Consistent error response format

Task 9: Create Mock Data System
CREATE lib/mock-data.ts:
  - GENERATE: Realistic Japanese concert data
  - INCLUDE: Multiple concerts, scores, practices
  - TIMESTAMPS: Current and historical data

Task 10: Implement Main Application Pages
CREATE app/page.tsx:
  - INTEGRATE: All tab components
  - IMPLEMENT: Last accessed tab memory
  - RESPONSIVE: Mobile-first layout

CREATE app/login/page.tsx:
  - IMPLEMENT: Dual login form (admin/viewer)
  - REDIRECT: After successful authentication

Task 11: Style and Polish
UPDATE app/globals.css:
  - CUSTOMIZE: Tailwind base styles
  - MOBILE: Ensure proper mobile viewport settings

IMPLEMENT: Consistent color scheme and typography
TEST: All components on various mobile screen sizes

Task 12: Add Development Scripts and Testing
UPDATE package.json:
  - ADD: Database reset script
  - ADD: Seed data script
  - ADD: Type checking script

CREATE: Basic component tests for critical functionality
```

### Per task pseudocode

```typescript
// Task 4: Authentication Infrastructure
// lib/auth.ts
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export interface JWTPayload {
  userId: string;
  role: "admin" | "viewer";
  email?: string;
  exp: number;
}

// JWTトークン生成関数
export function generateToken(payload: Omit<JWTPayload, "exp">): string {
  // SECURITY: 短時間有効期限（1日）
  const token = jwt.sign(
    { ...payload, exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60 },
    process.env.JWT_SECRET!
  );
  return token;
}

// JWTトークン検証関数
export function verifyToken(token: string): JWTPayload | null {
  try {
    // CRITICAL: 秘密鍵での署名検証
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    return payload;
  } catch (error) {
    return null;
  }
}

// Cookieからトークン取得
export function getTokenFromCookie(): string | null {
  const cookieStore = cookies();
  return cookieStore.get("auth-token")?.value || null;
}

// Task 7: Feature Components
// components/features/scores/ScoresTab.tsx
export function ScoresTab({ concertId }: { concertId: string }) {
  // 楽譜データの取得と状態管理
  const [scores, setScores] = useState<Score[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // MOBILE-FIRST: リスト表示レイアウト
  return (
    <div className="space-y-4">
      {/* 楽譜リスト */}
      {scores.map((score) => (
        <div key={score.id} className="p-4 border rounded-lg">
          {/* 曲名とリンク */}
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-lg">{score.title}</h3>
            {/* リンク切れ警告アイコン */}
            {!score.isValid && (
              <span className="text-red-500" title="リンク切れ">
                ⚠
              </span>
            )}
          </div>

          {/* 楽譜を開くボタン - モバイル最適化 */}
          <button
            onClick={() => window.open(score.url, "_blank")}
            className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            楽譜を開く
          </button>

          {/* 更新履歴 */}
          <div className="mt-3 text-sm text-gray-600">
            <p>最終更新: {formatDate(score.updatedAt)}</p>
            {/* コメント履歴表示 */}
            {score.comments.length > 0 && (
              <div className="mt-2 space-y-1">
                {score.comments.map((comment) => (
                  <p key={comment.id} className="text-xs">
                    {formatDate(comment.createdAt)}: {comment.content}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
```

### Integration Points

```yaml
ENVIRONMENT:
  - file: .env.local
  - variables: |
      # JWT認証設定
      JWT_SECRET=your-super-secret-jwt-key-change-in-production

      # データベース設定（Phase 1: SQLite）
      DATABASE_URL="file:./dev.db"

      # Next.js設定
      NEXTAUTH_URL=http://localhost:3000

CONFIGURATION:
  - Tailwind: Mobile-first breakpoints (sm: 640px, md: 768px, lg: 1024px)
  - Prisma: SQLite for development, PostgreSQL-ready schema
  - TypeScript: Strict mode with proper type definitions

DEPENDENCIES:
  - Next.js 15 with App Router
  - Tailwind CSS v4
  - Prisma ORM
  - jsonwebtoken for JWT handling
  - @types/jsonwebtoken for TypeScript support
```

## Validation Loop

### Level 1: Syntax & Style

```bash
# プロジェクト初期化確認
npm install

# TypeScript型チェック
npx tsc --noEmit

# ESLint実行
npm run lint

# Tailwindビルド確認
npm run build

# 期待結果: エラーなし。エラーがある場合は修正してから次へ
```

### Level 2: Development Server & Basic Functionality

```bash
# 開発サーバー起動
npm run dev

# データベース初期化
npx prisma migrate dev --name init
npx prisma db seed

# 期待結果:
# - http://localhost:3000 でアプリが起動
# - ログインページが表示される
# - モックデータが正しく表示される
```

### Level 3: Component & Authentication Testing

```typescript
// 手動テスト項目
test_scenarios = [
  // 認証フロー
  {
    name: "管理者ログイン",
    steps: [
      "ログインページにアクセス",
      "管理者パスワード入力",
      "JWTトークン発行確認",
      "管理者機能アクセス確認",
    ],
  },

  // 閲覧者ログイン
  {
    name: "エキストラログイン",
    steps: ["共通パスワード入力", "閲覧専用画面表示確認", "編集機能非表示確認"],
  },

  // レスポンシブデザイン
  {
    name: "モバイル表示",
    steps: [
      "Chrome DevTools でモバイル表示",
      "タブナビゲーション動作確認",
      "すべてのコンポーネント表示確認",
    ],
  },

  // 全機能タブ
  {
    name: "タブ機能",
    steps: [
      "出欠調整タブ表示",
      "楽譜リンクタブ表示",
      "練習予定タブ表示",
      "連絡タブ表示",
      "最後のタブ記憶確認",
    ],
  },
];
```

```bash
# API動作確認
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password": "admin-password", "role": "admin"}'

# 期待結果: JWT token return with proper payload

# データベース確認
npx prisma studio
# 期待結果: ブラウザでデータベース内容確認可能
```

## Final Validation Checklist

- [ ] Next.js 15 開発サーバーが正常起動: `npm run dev`
- [ ] TypeScript エラーなし: `npx tsc --noEmit`
- [ ] ESLint エラーなし: `npm run lint`
- [ ] JWT 認証フロー動作（管理者・閲覧者両方）
- [ ] 全 4 タブ（出欠・楽譜・練習・連絡）が正常表示
- [ ] モバイルレスポンシブデザイン確認
- [ ] モックデータが全セクションで表示
- [ ] データベース操作（CRUD）が正常動作
- [ ] セッション維持（ページリロード後もログイン状態）
- [ ] 日本語コメントが全コンポーネントに記載
- [ ] プロダクション ビルド成功: `npm run build`

---

## Anti-Patterns to Avoid

- ❌ localStorage で JWT を保存しない（XSS 攻撃対策）
- ❌ クライアントコンポーネントを多用しない（'use client'は最小限）
- ❌ TypeScript any 型を使用しない
- ❌ デスクトップファーストの CSS を書かない
- ❌ 英語でコンポーネント内コメントを書かない
- ❌ 秘密鍵をコードに埋め込まない
- ❌ Prisma クライアントを複数インスタンス化しない

## Confidence Score: 9/10

高い信頼度の理由:

- Next.js 15 の公式ドキュメントに基づく確実なセットアップ
- 明確なプロジェクト要件と詳細な画面設計
- 段階的な実装とテストプロセス
- 既存のベストプラクティスに基づくアーキテクチャ

リスク要因:

- JWT 実装の細かなセキュリティ設定
- モバイルレスポンシブの微調整が必要な場合
