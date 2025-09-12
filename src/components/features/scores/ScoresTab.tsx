"use client";

import React from "react";
import { Score } from "@/types";
import { ScoreManagement } from "./ScoreManagement";

interface ScoresTabProps {
  concertId: string;
  scores: Score[];
}

/**
 * 楽譜リンクタブコンポーネント
 * 楽譜管理機能を提供（管理者権限により表示が切り替わる）
 */
export function ScoresTab({ concertId, scores }: ScoresTabProps) {
  return <ScoreManagement concertId={concertId} scores={scores} />;
}
