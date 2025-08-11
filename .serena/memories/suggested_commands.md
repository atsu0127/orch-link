# Orch Link 開発用コマンド

## 基本開発コマンド

### プロジェクト起動
```bash
npm run dev  # 開発サーバー起動 (Turbopack使用)
npm run build  # 本番用ビルド
npm run start  # 本番サーバー起動
```

### コード品質チェック
```bash
npm run lint  # ESLint実行
npx tsc --noEmit  # TypeScript型チェック (エラー無し確認)
```

### データベース操作
```bash
npx prisma generate  # Prismaクライアント生成
npx prisma db push  # スキーマをデータベースに反映
npx prisma db seed  # シードデータ投入
npx prisma studio  # データベースブラウザ起動
```

### Git操作
```bash
git status  # ファイル状態確認
git add .  # 全変更をステージング
git commit -m "message"  # コミット
git push  # リモートにプッシュ
```

## システム固有コマンド (macOS/Darwin)
```bash
ls -la  # ファイル一覧表示
find . -name "*.ts" -type f  # TypeScriptファイル検索
grep -r "pattern" src/  # パターン検索
```

## タスク完了後の必須チェック
1. `npm run lint` - ESLintチェック
2. `npx tsc --noEmit` - 型エラーチェック  
3. `npm run build` - ビルド確認 (重要な変更時)
4. `npx prisma generate` - スキーマ変更時のクライアント再生成