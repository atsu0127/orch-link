# Score Management CRUD Feature PRP

## Purpose

Comprehensive implementation of score management functionality for administrators including score registration, editing, deletion, and update history management. This PRP provides complete context for one-pass implementation success.

## Goal

Implement a modal-based admin interface for comprehensive score management (CRUD operations) with update history tracking that integrates seamlessly with the existing read-only ScoresTab component.

## Issue Link

https://github.com/atsu0127/orch-link/issues/17

## Why

- **Admin Efficiency**: 管理者が楽譜情報を効率的に管理できるようにする
- **Update History**: 楽譜の変更履歴を追跡し、透明性を確保
- **Mobile-First**: スマートフォンでの操作性を最優先とした設計
- **Integration**: 既存のScoresTabコンポーネントと統合し、機能拡張

## What

管理者向けの楽譜管理機能を実装：
- 楽譜の新規登録（タイトル、URL入力）
- 既存楽譜の編集（タイトル、URL変更 + コメント追加）
- 楽譜の削除（確認モーダル付き）
- 更新履歴管理（コメント編集・削除）
- URL検証機能
- モバイルレスポンシブ対応

### Success Criteria

- [ ] 管理者が楽譜の作成・編集・削除を行えること
- [ ] 楽譜更新時にコメントを追加できること
- [ ] 更新履歴のコメント編集・削除ができること
- [ ] URL形式の検証が正常に動作すること
- [ ] 既存のScoresTabコンポーネントの表示が維持されること
- [ ] モバイル端末での操作が快適であること
- [ ] JWT認証によるadmin権限チェックが正常に動作すること

## All Needed Context

### Documentation & References

```yaml
- url: https://mantine.dev/core/modal/
  why: Modal component patterns and props for score management forms

- url: https://mantine.dev/form/use-form/
  why: Form validation patterns and state management

- url: https://mantine.dev/core/button/
  why: Action button styling and state patterns

- url: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
  why: API route patterns for DELETE endpoint implementation

- url: https://www.prisma.io/docs/concepts/components/prisma-client/crud
  why: Prisma delete operations and cascading behavior

- file: src/components/features/attendance/AttendanceTab.tsx
  why: CRUD modal implementation pattern to follow exactly

- file: src/components/features/attendance/AttendanceForm.tsx  
  why: Form component structure and validation patterns

- file: src/app/api/concerts/route.ts
  why: DELETE endpoint implementation pattern with authentication

- file: src/components/features/scores/ScoresTab.tsx
  why: Current score display component to integrate with

- file: src/app/api/scores/route.ts
  why: Existing GET, POST, PUT patterns to extend

- file: prisma/schema.prisma
  why: Score and ScoreComment model structure for delete operations

- file: src/lib/auth.ts
  why: JWT authentication patterns for admin verification

- file: src/types/index.ts
  why: Score, ScoreComment type definitions for TypeScript
```

### Current Codebase Tree (key files)

```bash
src/
├── components/features/scores/
│   └── ScoresTab.tsx                    # READ-ONLY display component
├── app/api/scores/
│   └── route.ts                        # GET, POST, PUT endpoints (missing DELETE)
├── types/
│   └── index.ts                        # Score, ScoreComment types
├── lib/
│   ├── auth.ts                         # JWT authentication utilities
│   └── api-client.ts                   # API client utilities
└── prisma/
    └── schema.prisma                   # Score, ScoreComment models with cascade delete
```

### Files to be Added/Modified

```bash
src/components/features/scores/
├── ScoresTab.tsx                       # MODIFY: Add admin controls integration
├── ScoreManagement.tsx                 # CREATE: CRUD modal management component
├── ScoreForm.tsx                       # CREATE: Score create/edit form
└── UpdateHistoryManager.tsx            # CREATE: Comment management component

src/app/api/scores/
└── route.ts                           # MODIFY: Add DELETE endpoint

src/app/api/score-comments/
└── route.ts                           # CREATE: ScoreComment CRUD API
```

### Known Gotchas & Library Quirks

```typescript
// CRITICAL: Mantine Modal requires specific props structure
<Modal opened={isOpen} onClose={handleClose} title="Title" size="lg">

// CRITICAL: Prisma cascade delete configured in schema
// Score deletion will auto-delete related ScoreComments

// CRITICAL: JWT admin check pattern (existing in all admin endpoints)
if (!payload || payload.role !== "admin") {
  return NextResponse.json({ error: "管理者権限が必要です" }, { status: 403 });
}

// CRITICAL: URL validation pattern (existing in score API)
try {
  new URL(url);
} catch {
  return NextResponse.json({ error: "有効なURLを入力してください" }, { status: 400 });
}

// CRITICAL: Mantine notifications pattern
notifications.show({
  title: "成功",
  message: "楽譜を削除しました",
  color: "green",
});
```

## Implementation Blueprint

### Data Models (Already Exist)

```typescript
// From src/types/index.ts
interface Score {
  id: string;
  concertId: string;
  title: string;
  url: string;
  isValid: boolean;
  updatedAt: Date;
  comments: ScoreComment[];
}

interface ScoreComment {
  id: string;
  scoreId: string;
  content: string;
  createdAt: Date;
}

// New types to add
interface ScoreFormData {
  title: string;
  url: string;
  comment?: string; // For updates
}
```

### Tasks in Implementation Order

```yaml
Task 1: "Create Score DELETE API endpoint":
  MODIFY src/app/api/scores/route.ts:
    - ADD DELETE function after PUT function
    - COPY authentication pattern from concerts API DELETE endpoint
    - USE existing pattern: const scoreId = searchParams.get('id')
    - PRISMA DELETE: await prisma.score.delete({ where: { id: scoreId } })
    - RETURN standardized success response

Task 2: "Create ScoreComment CRUD API":
  CREATE src/app/api/score-comments/route.ts:
    - IMPLEMENT PUT for comment editing
    - IMPLEMENT DELETE for comment deletion
    - MIRROR authentication patterns from scores API
    - FOLLOW existing error handling structure

Task 3: "Create ScoreForm component":
  CREATE src/components/features/scores/ScoreForm.tsx:
    - COPY structure from src/components/features/attendance/AttendanceForm.tsx
    - MODIFY for Score fields (title, url, comment)
    - KEEP same validation patterns (title required, URL format)
    - PRESERVE mobile-responsive styling classes

Task 4: "Create UpdateHistoryManager component":
  CREATE src/components/features/scores/UpdateHistoryManager.tsx:
    - DISPLAY comments in chronological order
    - ADD edit/delete actions for each comment
    - USE Mantine Accordion for collapsible history
    - IMPLEMENT inline editing pattern

Task 5: "Create ScoreManagement component":
  CREATE src/components/features/scores/ScoreManagement.tsx:
    - COPY EXACT structure from src/components/features/attendance/AttendanceTab.tsx
    - REPLACE AttendanceForm types with Score types
    - KEEP identical modal state management patterns
    - PRESERVE error handling and loading states

Task 6: "Integrate with ScoresTab":
  MODIFY src/components/features/scores/ScoresTab.tsx:
    - ADD admin controls (create, edit, delete buttons) to each score card
    - IMPORT and USE ScoreManagement component
    - PRESERVE all existing read-only display logic
    - ADD responsive admin action buttons
```

### Detailed Task Pseudocode

```typescript
// Task 1: DELETE API Endpoint
export async function DELETE(request: NextRequest) {
  // COPY authentication block from concerts/route.ts DELETE exactly
  const token = request.cookies.get("auth-token")?.value;
  const payload = await verifyToken(token);
  if (!payload || payload.role !== "admin") {
    return NextResponse.json({ error: "管理者権限が必要です" }, { status: 403 });
  }

  // PATTERN: Extract ID from query params
  const { searchParams } = new URL(request.url);
  const scoreId = searchParams.get('id');
  
  // CRITICAL: Cascade delete handles ScoreComments automatically
  await prisma.score.delete({ where: { id: scoreId } });
  
  // STANDARDIZED: Success response format
  return NextResponse.json({
    success: true,
    message: "楽譜を削除しました",
  });
}

// Task 3: ScoreForm Component Structure
export function ScoreForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState<ScoreFormData>({
    title: initialData?.title || "",
    url: initialData?.url || "",
    comment: "", // Always empty for new comments
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // PATTERN: Validation identical to AttendanceForm
    if (!formData.title.trim()) {
      notifications.show({ message: "タイトルを入力してください", color: "red" });
      return;
    }
    
    // PATTERN: URL validation (existing pattern)
    try {
      new URL(formData.url);
    } catch {
      notifications.show({ message: "有効なURLを入力してください", color: "red" });
      return;
    }
    
    await onSubmit(formData);
  };
  
  // PRESERVE: Mobile-responsive form styling from AttendanceForm
}

// Task 5: ScoreManagement Integration Pattern
export function ScoreManagement({ concertId, scores }) {
  // EXACT COPY: State management from AttendanceTab
  const [localScores, setLocalScores] = useState<Score[]>(scores);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingScore, setEditingScore] = useState<Score | null>(null);
  
  // PATTERN: CRUD operations following AttendanceTab exactly
  const createScore = async (data: ScoreFormData) => {
    const response = await fetch("/api/scores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ concertId, ...data }),
    });
    // ... existing error handling pattern
  };
  
  const deleteScore = async (scoreId: string) => {
    const response = await fetch(`/api/scores?id=${scoreId}`, {
      method: "DELETE",
      credentials: "include",
    });
    // ... existing error handling pattern
  };
  
  // CRITICAL: Confirmation modal using modals.openConfirmModal
  const handleDelete = (score: Score) => {
    modals.openConfirmModal({
      title: "楽譜削除の確認",
      children: <Text>「{score.title}」を削除してもよろしいですか？</Text>,
      labels: { confirm: "削除する", cancel: "キャンセル" },
      confirmProps: { color: "red" },
      onConfirm: () => performDelete(score.id),
    });
  };
}
```

### Integration Points

```yaml
SCORES_TAB:
  - modify: src/components/features/scores/ScoresTab.tsx
  - add: Admin action buttons in each score Paper component
  - pattern: "useAuth hook check for isAdmin before showing buttons"

API_ENDPOINTS:
  - add: DELETE /api/scores?id={scoreId}
  - add: PUT /api/score-comments (for comment editing)
  - add: DELETE /api/score-comments?id={commentId}

TYPES:
  - add to: src/types/index.ts
  - pattern: "ScoreFormData interface following AttendanceFormData structure"

DATABASE:
  - verify: CASCADE DELETE configured in prisma/schema.prisma
  - check: Score -> ScoreComment relationship handles cascading
```

## Validation Loop

### Level 1: Syntax & Style

```bash
# Run these FIRST - fix any errors before proceeding
npm run lint                           # Next.js linting
npx tsc --noEmit                      # TypeScript compilation check

# Expected: No errors. If errors, READ the error and fix.
```

### Level 2: Manual Integration Test

```bash
# Start development server
npm run dev

# Test the flow:
# 1. Login as admin
# 2. Navigate to a concert with scores
# 3. Click "楽譜を追加" button
# 4. Fill form and submit
# 5. Edit existing score with comment
# 6. Delete a score (confirm modal)
# 7. Edit/delete comments in history

# Expected: All operations succeed with proper notifications
```

### Level 3: API Endpoint Test

```bash
# Test DELETE endpoint
curl -X DELETE "http://localhost:3000/api/scores?id=SCORE_ID" \
  -H "Cookie: auth-token=YOUR_JWT_TOKEN"

# Expected: {"success": true, "message": "楽譜を削除しました"}

# Test ScoreComment operations
curl -X PUT "http://localhost:3000/api/score-comments" \
  -H "Content-Type: application/json" \
  -H "Cookie: auth-token=YOUR_JWT_TOKEN" \
  -d '{"commentId": "COMMENT_ID", "content": "Updated content"}'
```

## Final Validation Checklist

- [ ] All TypeScript compilation passes: `npx tsc --noEmit`
- [ ] No linting errors: `npm run lint` 
- [ ] Manual test: Score creation via modal works
- [ ] Manual test: Score editing with comment works
- [ ] Manual test: Score deletion with confirmation works
- [ ] Manual test: Comment editing works
- [ ] Manual test: Comment deletion works  
- [ ] Manual test: Mobile responsiveness verified
- [ ] API test: DELETE /api/scores endpoint works
- [ ] API test: ScoreComment endpoints work
- [ ] Existing ScoresTab display unchanged
- [ ] Issue #17 requirements fully met

## Anti-Patterns to Avoid

- ❌ Don't create new modal patterns - copy AttendanceTab exactly
- ❌ Don't skip JWT admin verification in any API endpoint
- ❌ Don't break existing ScoresTab read-only functionality
- ❌ Don't ignore mobile-responsive design requirements
- ❌ Don't use different notification or error handling patterns
- ❌ Don't forget cascade delete verification for ScoreComments

---

## Confidence Score: 9/10

High confidence for one-pass implementation success due to:
✅ Complete codebase patterns identified and documented
✅ Exact file references provided for copying patterns  
✅ All authentication and validation patterns documented
✅ Mobile-responsive requirements clearly specified
✅ Comprehensive validation steps provided