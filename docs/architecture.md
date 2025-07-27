# オーケストラ・エキストラ連絡ポータル システム構成設計書

---

## ✅ 構成の基本方針

- DB・認証などは **クラウドのマネージドサービス** を活用
- アプリケーションは **マネージドKubernetes（GKE）** 上で運用
- インフラはすべて **Terraform などで自動展開** できる構成
- 閲覧者（エキストラ）は **共通パスワード + JWT** で簡易ログイン
- 管理者は Auth0 等で厳密な認証を行う

---

## 🌐 採用クラウド：**Google Cloud Platform (GCP)**

| 項目 | 使用サービス | 理由 |
|------|----------------|------|
| Kubernetes基盤 | GKE Autopilot | ノードレス、運用不要、Terraform対応◎ |
| データベース | Cloud SQL (PostgreSQL) | マネージドPostgreSQL、UIもCLIも◎ |
| 秘密情報管理 | Secret Manager | JWT秘密鍵やメールAPIキーなどを安全に保管 |
| TLS証明書 | cert-manager + Ingress | Let's Encryptを自動で取得 |
| メール通知 | Resend または SendGrid | リンク切れ通知用の軽量メールAPI |
| 認証（管理者） | Auth0（外部連携） | GUIで管理しやすく、JWT対応済み |
| 認証（エキストラ） | 共通パスワード + JWT（アプリ内） | 匿名・簡易・安全なアクセス制御 |

---

## 🏗️ システム構成図（概念）

[ PC / スマホ ]
↓
[ Next.js App (on GKE) ]
↓ ↘
[ API (同Pod or BFF) ] [ Auth Proxy (管理者用)]
↓
[ Cloud SQL (PostgreSQL) ]
↓
[ Email Provider (Resend / SendGrid)]

Secrets → GCP Secret Manager

CronJob → GKE CronJob でリンク切れチェック

---

## 🔧 自動構成対象（Terraform）

- GKEクラスタ（Autopilot）
- Cloud SQL（PostgreSQL）
- Secret Manager（JWT鍵・メールキーなど）
- Ingress + TLS（cert-manager）
- CronJob定義（K8sリソース）
- CI/CD（GitHub Actions連携）

---

## 🔐 認証設計のポイント

### 管理者
- Auth0やCognitoなどの外部認証
- JWTで管理者セッション保持（1日）

### エキストラ（閲覧者）
- 共通パスワード式ログイン
- 合格時にJWTを発行（閲覧専用ロール）
- 個人情報を一切保持しない

---

## 📦 アプリ構成（Next.js）

- Next.js（App Router）
- Tailwind CSS（スマホUI対応）
- API RoutesでJWT検証・DB接続
- Docker化してK8s上にデプロイ
- セッション：JWT + Cookie or localStorage

---

## 💡 メリットまとめ

- ☁ すべてマネージド：インフラ運用最小限
- 🔐 匿名＋安全な閲覧者認証（JWT）
- 🐳 アプリ開発と運用が完全に分離・管理可能
- ⚙ 自動展開可能なインフラ（IaC）