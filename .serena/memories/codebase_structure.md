# Orch Link コードベース構造

## プロジェクト構造

```
orch-link/
├── docs/                    # プロジェクト仕様書
│   ├── architecture.md      # システム設計
│   ├── plan.md             # 開発計画
│   ├── requirements.md     # 要件定義
│   └── screen_design.md    # 画面設計
├── prisma/                 # データベース設定
│   ├── schema.prisma       # Prismaスキーマ定義
│   └── seed.ts            # シードデータ
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── api/           # APIエンドポイント
│   │   │   ├── auth/      # 認証関連API
│   │   │   ├── attendance/# 出欠調整API
│   │   │   ├── concerts/  # 演奏会API
│   │   │   ├── contact/   # 連絡先API
│   │   │   ├── practices/ # 練習予定API
│   │   │   └── scores/    # 楽譜API
│   │   ├── login/         # ログインページ
│   │   ├── layout.tsx     # ルートレイアウト
│   │   ├── page.tsx       # トップページ
│   │   └── globals.css    # グローバルスタイル
│   ├── components/        # Reactコンポーネント
│   │   ├── features/      # 機能別コンポーネント
│   │   │   ├── attendance/# 出欠調整コンポーネント
│   │   │   ├── auth/      # 認証コンポーネント
│   │   │   ├── contact/   # 連絡先コンポーネント
│   │   │   ├── practices/ # 練習予定コンポーネント
│   │   │   └── scores/    # 楽譜コンポーネント
│   │   └── layout/        # レイアウトコンポーネント
│   ├── generated/         # 自動生成ファイル
│   │   └── prisma/        # Prismaクライアント
│   ├── lib/               # ユーティリティライブラリ
│   │   ├── auth.ts        # 認証ロジック
│   │   ├── db.ts          # データベース接続
│   │   ├── mock-data.ts   # モックデータ
│   │   └── seed-helpers.ts # シード用ヘルパー
│   ├── types/             # 型定義
│   │   ├── auth.ts        # 認証関連型
│   │   ├── concert.ts     # 演奏会関連型
│   │   └── index.ts       # 型エクスポート
│   └── middleware.ts      # Next.js ミドルウェア
├── CLAUDE.md              # プロジェクト固有指示
├── README.md              # プロジェクト概要
├── package.json           # 依存関係・スクリプト
├── tsconfig.json          # TypeScript設定
├── eslint.config.mjs      # ESLint設定
├── postcss.config.mjs     # PostCSS設定
└── next.config.ts         # Next.js設定
```

## 主要ディレクトリの役割

### `/src/app/`
Next.js App Routerベースのページとエンドポイント

### `/src/components/features/`
機能別に整理されたReactコンポーネント
- 各機能ごとにサブディレクトリで整理
- ビジネスロジックを含む機能的なコンポーネント

### `/src/lib/`
アプリケーション全体で使用するユーティリティ
- 認証ロジック (`auth.ts`)
- データベース接続 (`db.ts`)
- モックデータ (`mock-data.ts`)

### `/src/types/`
TypeScript型定義ファイル
- 機能別に型定義を分離
- 中央集約されたexport

### `/prisma/`
Prismaに関連する設定とスクリプト
- スキーマ定義とシードデータ

## データフロー
1. ユーザー操作 → コンポーネント
2. コンポーネント → API Routes (/api/)
3. API Routes → Prismaクライアント → データベース
4. レスポンス → コンポーネント → ユーザー表示