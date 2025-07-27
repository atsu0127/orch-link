# オーケストラ・エキストラ連絡ポータル 開発進行計画

---

## 🎯 ゴール

- クラウド上で安全かつ簡便に運用可能な Next.js + PostgreSQL アプリケーションを構築
- 管理者とエキストラの両者が快適に使えるモバイル対応ポータルを提供
- Terraform によるインフラ自動化と Docker + K8s による安定運用を実現

---

## ✅ 開発フェーズ全体像

| フェーズ   | 内容                             | 目的                           |
| ---------- | -------------------------------- | ------------------------------ |
| フェーズ 1 | アプリケーション開発（ローカル） | UI とロジックの検証・完成      |
| フェーズ 2 | GCP インフラ構築（Terraform）    | 本番に耐えるクラウド基盤構築   |
| フェーズ 3 | アプリケーションの GCP デプロイ  | Kubernetes 上にアプリを展開    |
| フェーズ 4 | 機能結合・セキュリティ検証       | JWT 認証やメール通知の統合確認 |
| フェーズ 5 | 本番/ステージング環境整備        | 複数環境・永続運用への昇華     |

---

## 🥇 フェーズ 1：アプリケーション開発（ローカル）

### 構成

- Next.js + App Router
- Tailwind CSS
- Prisma (DB クライアント)
- SQLite or mock データ

### 実装対象

- [ ] トップページ＋タブ UI
- [ ] 出欠調整タブ（モック URL）
- [ ] 楽譜リンクタブ（履歴追加 UI 含む）
- [ ] 練習予定タブ（リスト＋詳細）
- [ ] 管理者連絡タブ
- [ ] 共通パスワードログイン UI（JWT 生成）
- [ ] API Routes での簡易 DB 操作（GET/POST）

---

## 🥈 フェーズ 2：GCP インフラ構築（Terraform）

### 使用サービス

- GKE Autopilot
- Cloud SQL for PostgreSQL
- Secret Manager
- cert-manager + Ingress + Let's Encrypt
- (オプション) GitHub Actions 用 Artifact Registry

### 構築手順（Terraform）

- [ ] GCP プロジェクトとサービスアカウントの準備
- [ ] GKE クラスタ作成（Autopilot）
- [ ] Cloud SQL インスタンス + DB ユーザ作成
- [ ] Secret Manager に JWT 鍵やメール API キー登録
- [ ] Ingress + TLS 構成（cert-manager 連携）

---

## 🥉 フェーズ 3：アプリケーションの GCP デプロイ

### 実施内容

- [ ] Next.js アプリの Dockerfile 作成
- [ ] GCP Artifact Registry へ push
- [ ] Kubernetes Deployment / Service / Ingress 作成
- [ ] JWT 認証ミドルウェアの組み込み
- [ ] PostgreSQL 接続設定（K8s Secret 経由）

---

## 🧪 フェーズ 4：機能結合・セキュリティ検証

### 検証項目

- [ ] 管理者：Auth0 ログイン → JWT セッション維持
- [ ] エキストラ：共通パスワード → JWT 発行＆検証
- [ ] API：JWT のロール検証（"viewer" / "admin"）
- [ ] メール通知（Resend/SendGrid）疎通
- [ ] リンク切れチェック CronJob（K8s）

---

## 🚀 フェーズ 5：本番/ステージング環境整備

### 実施内容

- [ ] namespace 分離（production / staging）
- [ ] 本番用 DB・Ingress を構築
- [ ] Secrets/ConfigMap の分離
- [ ] Terraform ワークスペース or モジュール化
- [ ] バックアップ・監視（Cloud Logging）

---

## 📌 メモ・補足

- 最初は SQLite + モックでも UI を固めることが重要
- GCP への接続情報や JWT 鍵などは必ず Secret Manager に保管
- Ingress 経由で HTTPS + path routing を行う
- JWT は Cookie or Authorization ヘッダどちらでも対応可
