// 認証関連型定義

// JWTペイロード型（lib/auth.tsと同期）
export interface JWTPayload {
  userId: string;
  role: "admin" | "viewer";
  email?: string;
  exp: number;
}

// ログインリクエスト型
export interface LoginRequest {
  password: string;
  role: "admin" | "viewer";
}

// ログインレスポンス型
export interface LoginResponse {
  success: boolean;
  user?: {
    role: "admin" | "viewer";
    email?: string;
  };
  error?: string;
}

// 認証コンテキスト型
export interface AuthContext {
  user: AuthUser | null;
  isLoading: boolean;
  login: (password: string, role: "admin" | "viewer") => Promise<boolean>;
  logout: () => void;
}

// 認証ユーザー型
export interface AuthUser {
  role: "admin" | "viewer";
  email?: string;
}