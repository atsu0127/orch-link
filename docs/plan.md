# オーケストラ・エキストラ連絡ポータル 開発進行計画

---

## 🎯 ゴール

- クラウド上で安全かつ簡便に運用可能な Next.js + PostgreSQL アプリケーションを構築
- 管理者とエキストラの両者が快適に使えるモバイル対応ポータルを提供
- Terraform によるインフラ自動化と Docker + K8s による安定運用を実現

---

## ✅ 開発フェーズ全体像

| フェーズ | 内容 | 目的 |
|---------|------|------|
| フェーズ 1 | アプリケーション開発（ローカル） | UIとロジックの検証・完成 |
| フェーズ 2 | GCPインフラ構築（Terraform） | 本番に耐えるクラウド基盤構築 |
| フェーズ 3 | アプリケーションのGCPデプロイ | Kubernetes上にアプリを展開 |
| フェーズ 4 | 機能結合・セキュリティ検証 | JWT認証やメール通知の統合確認 |
| フェーズ 5 | 本番/ステージング環境整備 | 複数環境・永続運用への昇華 |

---

## 🥇 フェーズ 1：アプリケーション開発（ローカル）

### 構成
- Next.js + App Router
- Tailwind CSS
- Prisma (DBクライアント)
- SQLite or mockデータ

### 実装対象
- [ ] トップページ＋タブUI
- [ ] 出欠フォームタブ（モックURL）
- [ ] 楽譜リンクタブ（履歴追加UI含む）
- [ ] 練習予定タブ（リスト＋詳細）
- [ ] 管理者連絡タブ
- [ ] 共通パスワードログインUI（JWT生成）
- [ ] API Routesでの簡易DB操作（GET/POST）

---

## 🥈 フェーズ 2：GCPインフラ構築（Terraform）

### 使用サービス
- GKE Autopilot
- Cloud SQL for PostgreSQL
- Secret Manager
- cert-manager + Ingress + Let's Encrypt
- (オプション) GitHub Actions用Artifact Registry

### 構築手順（Terraform）
- [ ] GCPプロジェクトとサービスアカウントの準備
- [ ] GKEクラスタ作成（Autopilot）
- [ ] Cloud SQLインスタンス + DBユーザ作成
- [ ] Secret ManagerにJWT鍵やメールAPIキー登録
- [ ] Ingress + TLS構成（cert-manager連携）

---

## 🥉 フェーズ 3：アプリケーションのGCPデプロイ

### 実施内容
- [ ] Next.jsアプリの Dockerfile 作成
- [ ] GCP Artifact Registry へpush
- [ ] Kubernetes Deployment / Service / Ingress作成
- [ ] JWT認証ミドルウェアの組み込み
- [ ] PostgreSQL接続設定（K8s Secret経由）

---

## 🧪 フェーズ 4：機能結合・セキュリティ検証

### 検証項目
- [ ] 管理者：Auth0ログイン → JWTセッション維持
- [ ] エキストラ：共通パスワード → JWT発行＆検証
- [ ] API：JWTのロール検証（"viewer" / "admin"）
- [ ] メール通知（Resend/SendGrid）疎通
- [ ] リンク切れチェックCronJob（K8s）

---

## 🚀 フェーズ 5：本番/ステージング環境整備

### 実施内容
- [ ] namespace分離（production / staging）
- [ ] 本番用DB・Ingressを構築
- [ ] Secrets/ConfigMapの分離
- [ ] Terraformワークスペース or モジュール化
- [ ] バックアップ・監視（Cloud Logging）

---

## 📌 メモ・補足

- 最初は SQLite + モックでも UI を固めることが重要
- GCPへの接続情報やJWT鍵などは必ず Secret Manager に保管
- Ingress経由で HTTPS + path routing を行う
- JWTは Cookie or Authorizationヘッダどちらでも対応可