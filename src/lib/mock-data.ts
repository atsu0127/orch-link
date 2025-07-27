// モックデータシステム - リアルな日本語演奏会データ

import { 
  Concert, 
  AttendanceForm, 
  Score, 
  ScoreComment, 
  Practice, 
  ContactInfo 
} from "@/types";

// 現在時刻のベースデータ
const now = new Date();
const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
const oneMonthLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

// 演奏会モックデータ
export const mockConcerts: Concert[] = [
  {
    id: "concert-1",
    title: "第45回定期演奏会「ベートーヴェン交響曲第9番」",
    date: new Date("2025-12-20T19:00:00"),
    venue: "サントリーホール 大ホール",
    isActive: true,
    updatedAt: oneWeekAgo,
  },
  {
    id: "concert-2", 
    title: "春のファミリーコンサート「ディズニー名曲集」",
    date: new Date("2025-05-10T14:00:00"),
    venue: "東京芸術劇場 コンサートホール",
    isActive: true,
    updatedAt: oneWeekAgo,
  },
  {
    id: "concert-3",
    title: "夏の野外コンサート「映画音楽の夕べ」",
    date: new Date("2025-08-15T18:00:00"),
    venue: "横浜赤レンガ倉庫イベント広場",
    isActive: false,
    updatedAt: oneWeekAgo,
  },
];

// 出欠フォームモックデータ
export const mockAttendanceForms: AttendanceForm[] = [
  {
    id: "attendance-1",
    concertId: "concert-1",
    title: "第45回定期演奏会 出欠確認フォーム",
    url: "https://forms.gle/sample-beethoven-9th",
    description: "12月20日の定期演奏会の出欠をお知らせください。リハーサル参加予定もご記入ください。",
    updatedAt: oneWeekAgo,
  },
  {
    id: "attendance-2",
    concertId: "concert-2", 
    title: "春のファミリーコンサート 参加確認",
    url: "https://forms.microsoft.com/sample-family-concert",
    description: "ファミリーコンサートの出演確認です。お子様連れでの参加も歓迎です。",
    updatedAt: oneWeekAgo,
  },
];

// 楽譜コメントモックデータ
export const mockScoreComments: ScoreComment[] = [
  {
    id: "comment-1",
    scoreId: "score-1",
    content: "第4楽章の合唱部分を追加しました",
    createdAt: oneWeekAgo,
  },
  {
    id: "comment-2",
    scoreId: "score-1", 
    content: "テンポ記号を修正（Allegro ma non troppo → Prestissimo）",
    createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: "comment-3",
    scoreId: "score-2",
    content: "ディズニーメドレー版に更新（7曲構成）",
    createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
  },
];

// 楽譜モックデータ
export const mockScores: Score[] = [
  {
    id: "score-1",
    concertId: "concert-1",
    title: "ベートーヴェン交響曲第9番ニ短調作品125「合唱」",
    url: "https://imslp.org/wiki/Symphony_No.9,_Op.125_(Beethoven,_Ludwig_van)",
    isValid: true,
    updatedAt: oneWeekAgo,
    comments: mockScoreComments.filter(c => c.scoreId === "score-1"),
  },
  {
    id: "score-2",
    concertId: "concert-2",
    title: "ディズニー名曲メドレー（編曲版）",
    url: "https://example.com/disney-medley.pdf",
    isValid: true,
    updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
    comments: mockScoreComments.filter(c => c.scoreId === "score-2"),
  },
  {
    id: "score-3",
    concertId: "concert-1",
    title: "歓喜の歌（合唱パート）",
    url: "https://example.com/ode-to-joy-chorus.pdf",
    isValid: false, // リンク切れ例
    updatedAt: oneWeekAgo,
    comments: [],
  },
];

// 練習予定モックデータ
export const mockPractices: Practice[] = [
  {
    id: "practice-1",
    concertId: "concert-1",
    title: "第9番全楽章通し練習",
    date: new Date("2025-12-15T13:00:00"),
    venue: "文京シビックホール リハーサル室",
    items: "楽譜、譜面台、筆記用具",
    notes: "第4楽章の合唱との合わせがあります。ソリストも参加予定です。",
    memo: "駐車場は混雑が予想されます。公共交通機関をご利用ください。",
    audioUrl: "https://example.com/rehearsal-audio-1.mp3",
    updatedAt: oneWeekAgo,
  },
  {
    id: "practice-2",
    concertId: "concert-1", 
    title: "セクション別練習（弦楽器）",
    date: new Date("2025-12-08T10:00:00"),
    venue: "杉並公会堂 小ホール",
    items: "楽譜、鉛筆、消しゴム",
    notes: "弦楽器セクションのみの練習です。細かいアンサンブルを中心に練習します。",
    memo: "昼食は近隣のコンビニまたはレストランをご利用ください。",
    updatedAt: oneWeekAgo,
  },
  {
    id: "practice-3",
    concertId: "concert-2",
    title: "ディズニーメドレー初回合わせ",
    date: oneMonthLater,
    venue: "豊島区民センター 文化ホール",
    items: "楽譜、水分補給用飲み物",
    notes: "初回の合わせ練習です。テンポやダイナミクスを中心に確認します。",
    memo: "お子様連れでの見学も可能です。",
    updatedAt: oneWeekAgo,
  },
  {
    id: "practice-4",
    concertId: "concert-1",
    title: "ゲネプロ（本番前最終リハーサル）", 
    date: new Date("2025-12-20T10:00:00"),
    venue: "サントリーホール 大ホール",
    items: "本番衣装、楽譜、全ての必要用具",
    notes: "本番と同じ条件でのゲネプロです。遅刻厳禁でお願いします。",
    memo: "リハーサル後、本番まで控室で待機となります。",
    audioUrl: "https://example.com/general-rehearsal.mp3",
    updatedAt: oneWeekAgo,
  },
];

// 連絡先情報モックデータ
export const mockContactInfo: ContactInfo[] = [
  {
    id: "contact-1",
    email: "admin@tokyo-symphony.jp",
    description: "演奏会に関するお問い合わせ、楽譜の質問、スケジュール調整などお気軽にご連絡ください。",
    updatedAt: oneWeekAgo,
  },
];

// ユーティリティ関数：特定の演奏会のデータを取得
export function getConcertData(concertId: string) {
  const concert = mockConcerts.find(c => c.id === concertId);
  if (!concert) return null;

  return {
    concert,
    attendanceForms: mockAttendanceForms.filter(a => a.concertId === concertId),
    scores: mockScores.filter(s => s.concertId === concertId),
    practices: mockPractices
      .filter(p => p.concertId === concertId)
      .sort((a, b) => a.date.getTime() - b.date.getTime()),
  };
}

// ユーティリティ関数：アクティブな演奏会のみ取得
export function getActiveConcerts(): Concert[] {
  return mockConcerts.filter(c => c.isActive);
}

// ユーティリティ関数：日付フォーマット
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

// ユーティリティ関数：日付のみフォーマット
export function formatDateOnly(date: Date): string {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long', 
    day: 'numeric',
  }).format(date);
}