# Orch Link コーディング規約・スタイルガイド

## 言語ポリシー
- **ドキュメント**: 英語
- **コードコメント・変数名**: 日本語
- **コミュニケーション**: 日本語

## コード規約

### TypeScript設定
- Strictモード有効
- `noEmit: true` (型チェックのみ)
- ES2017ターゲット
- ESNext モジュール

### ESLint設定  
- Next.js推奨設定 (`next/core-web-vitals`, `next/typescript`)
- 未使用変数警告
- `any`型の使用禁止
- `require()`スタイルインポート禁止

### コーディングスタイル

#### 関数・コンポーネント
```typescript
/**
 * 機能の説明（日本語）
 */
export function ComponentName() {
  // コンポーネント内コメントも日本語
  const [状態変数, set状態変数] = useState("");
  
  /**
   * ハンドラー関数の説明
   */
  const handleSubmit = async (e: React.FormEvent) => {
    // 処理内容の説明
  };
  
  return (
    // JSX構造
  );
}
```

#### API Routes
```typescript
export async function GET(request: Request) {
  // リクエスト処理の説明
  try {
    // 処理内容
    return NextResponse.json(data);
  } catch (error) {
    // エラーハンドリング
    return NextResponse.json({ error: 'エラーメッセージ' }, { status: 500 });
  }
}
```

### ファイル構成パターン
- コンポーネント: `components/features/[機能]/`
- API: `app/api/[エンドポイント]/route.ts`
- 型定義: `types/[機能].ts`
- ユーティリティ: `lib/[用途].ts`

### インポート順序
1. React関連
2. Next.js関連
3. サードパーティライブラリ
4. 内部モジュール (`@/`)

### 命名規則
- コンポーネント: PascalCase
- 関数: camelCase
- 定数: UPPER_SNAKE_CASE
- ファイル: kebab-case (コンポーネントはPascalCase)

## UIライブラリ使用方針
- Mantine を主要UIライブラリとして使用
- Tailwind CSS で補完的なスタイリング
- モバイルレスポンシブデザイン優先