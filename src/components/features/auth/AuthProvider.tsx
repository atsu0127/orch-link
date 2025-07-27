"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthContext, AuthUser, LoginRequest } from "@/types/auth";

// 認証コンテキストの作成
const AuthContext_Internal = createContext<AuthContext | undefined>(undefined);

// 認証プロバイダーコンポーネント
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // 認証状態の管理
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 初期化時にログイン状態を確認
  useEffect(() => {
    checkAuthStatus();
  }, []);

  /**
   * 認証状態確認関数
   * クッキーからJWTトークンを確認し、有効性を検証
   */
  const checkAuthStatus = async () => {
    try {
      // JWT検証APIを呼び出し
      const response = await fetch("/api/auth/verify", {
        method: "GET",
        credentials: "include", // クッキーを含める
      });

      if (response.ok) {
        const data = await response.json();
        if (data.authenticated && data.user) {
          // APIレスポンスから必要な情報を抽出してユーザー状態に設定
          setUser({
            role: data.user.role,
            email: data.user.email,
          });
        }
      }
    } catch (error) {
      console.error("認証状態確認エラー:", error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * ログイン処理関数
   * @param password - パスワード
   * @param role - ユーザーロール
   * @returns ログイン成功時true、失敗時false
   */
  const login = async (
    password: string,
    role: "admin" | "viewer"
  ): Promise<boolean> => {
    try {
      setIsLoading(true);

      const loginData: LoginRequest = { password, role };

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // クッキーを含める
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (data.success && data.user) {
        setUser(data.user);
        return true;
      }

      return false;
    } catch (error) {
      console.error("ログインエラー:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * ログアウト処理関数
   * 状態をクリアし、クッキーを削除
   */
  const logout = () => {
    setUser(null);

    // クッキーを削除（有効期限を過去に設定）
    document.cookie =
      "auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // ページをリロードしてログインページに戻る
    window.location.href = "/login";
  };

  // コンテキスト値
  const contextValue: AuthContext = {
    user,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext_Internal.Provider value={contextValue}>
      {children}
    </AuthContext_Internal.Provider>
  );
}

/**
 * 認証コンテキストを使用するためのカスタムフック
 * @returns 認証コンテキスト
 */
export function useAuth(): AuthContext {
  const context = useContext(AuthContext_Internal);
  if (context === undefined) {
    throw new Error("useAuth は AuthProvider 内で使用する必要があります");
  }
  return context;
}
