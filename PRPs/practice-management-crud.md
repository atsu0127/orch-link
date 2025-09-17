name: "Practice Schedule Management CRUD Implementation"
description: |

## Purpose

Implement administrator-facing Practice Schedule CRUD functionality. The system currently has a complete Practice API and display components, but lacks the management UI for administrators to create, edit, and delete practice schedules directly within the application.

## Core Principles

1. **Context is King**: Include ALL necessary documentation, examples, and caveats
2. **Validation Loops**: Provide executable tests/lints the AI can run and fix
3. **Information Dense**: Use keywords and patterns from the codebase
4. **Progressive Success**: Start simple, validate, then enhance
5. **Global rules**: Be sure to follow all rules in CLAUDE.md

---

## Goal

Implement complete CRUD management interface for practice schedules that allows administrators to create, edit, and delete practice schedules directly within the application, following the same patterns as existing Concert and Score management components.

## Issue Link

https://github.com/atsu0127/orch-link/issues/19

## Why

- **Administrative Efficiency**: Enables administrators to manage practice schedules directly in the app without external tools
- **User Experience Consistency**: Provides same interface patterns as other management features (concerts, scores, attendance)
- **Data Integrity**: Ensures proper validation and error handling through established patterns
- **Integration**: Seamlessly integrates with existing authentication, notification, and UI systems

## What

Create a comprehensive practice schedule management system that includes:
- Practice schedule creation form with all required fields
- Edit functionality for existing practices
- Delete functionality with confirmation dialogs
- Admin-only access control
- Integration with existing PracticesList component
- Proper error handling and user feedback

### Success Criteria

- [ ] Administrators can create new practice schedules via modal form
- [ ] Administrators can edit existing practice schedules
- [ ] Administrators can delete practice schedules with confirmation
- [ ] Management buttons only appear for admin users
- [ ] All form validation works correctly (start/end times, required fields)
- [ ] Success and error notifications display properly
- [ ] Form data persists correctly to database via existing API
- [ ] Timezone handling works correctly for datetime fields
- [ ] Mobile-responsive design consistent with existing components

## All Needed Context

### Documentation & References

```yaml
# MUST READ - Include these in your context window
- url: https://mantine.dev/core/modal/
  why: Modal component for form dialogs, focus-trap, and accessibility

- url: https://mantine.dev/core/text-input/
  why: TextInput component with validation and error handling

- url: https://mantine.dev/dates/date-time-picker/
  why: DateTime input components for startTime/endTime fields

- url: https://mantine.dev/core/textarea/
  why: Textarea component for notes, memo, items fields

- url: https://mantine.dev/core/notifications/
  why: Success/error notification patterns with icons and colors

- url: https://mantine.dev/core/button/
  why: Button components with loading states and icons

- url: https://mantine.dev/core/action-icon/
  why: ActionIcon for edit/delete buttons in practice cards

- file: src/components/features/concerts/ConcertManagement.tsx
  why: Exact pattern to follow for CRUD management component

- file: src/components/features/concerts/ConcertForm.tsx
  why: Form component pattern with validation

- file: src/components/features/scores/ScoreManagement.tsx
  why: Additional management pattern reference

- file: src/app/api/practices/route.ts
  why: API interface requirements (POST, PUT, DELETE methods)

- file: src/types/index.ts
  why: Practice interface definition and field requirements

- file: src/lib/api-client.ts
  why: handleApiError utility function usage

# Critical authentication pattern
- file: src/components/features/auth/AuthProvider.tsx
  why: useAuth hook usage for admin role checking
```

### Current Codebase tree (relevant parts)

```bash
src/
├── components/features/
│   ├── auth/AuthProvider.tsx (useAuth hook)
│   ├── concerts/
│   │   ├── ConcertManagement.tsx (CRUD pattern)
│   │   └── ConcertForm.tsx (form pattern)
│   ├── scores/ScoreManagement.tsx (additional CRUD pattern)
│   └── practices/
│       ├── PracticesList.tsx (existing display)
│       └── PracticeDetail.tsx (existing display)
├── app/api/practices/route.ts (complete API)
├── types/index.ts (Practice interface)
└── lib/api-client.ts (error handling utils)
```

### Desired Codebase tree with files to be added

```bash
src/components/features/practices/
├── PracticesList.tsx (MODIFY: add admin buttons)
├── PracticeDetail.tsx (existing)
├── PracticeManagement.tsx (CREATE: main CRUD component)
└── PracticeForm.tsx (CREATE: form component)

src/types/
├── index.ts (existing Practice interface)
└── practice.ts (CREATE: PracticeFormData interface)
```

### Concrete Code Examples from Existing Components

```typescript
// EXACT IMPORT PATTERN from ConcertManagement.tsx (line 3-14)
import React, { useState, useEffect } from "react";
import {
  Container,
  Modal,
  Alert,
  Stack,
  Text,
  Group,
  Button,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconAlertCircle, IconPlus, IconEdit, IconTrash } from "@tabler/icons-react";

// EXACT AUTHENTICATION PATTERN (from all management components)
const { user } = useAuth();
const isAdmin = user?.role === "admin";

// EXACT STATE MANAGEMENT PATTERN from ConcertManagement.tsx
const [practices, setPractices] = useState<Practice[]>([]);
const [isLoading, setIsLoading] = useState(false);
const [isFormOpen, setIsFormOpen] = useState(false);
const [editingPractice, setEditingPractice] = useState<Practice | null>(null);
const [error, setError] = useState<string | null>(null);

// EXACT SUCCESS NOTIFICATION PATTERN (line 131-137 in ConcertManagement)
notifications.show({
  title: "作成完了",
  message: "練習予定を作成しました",
  color: "green",
  icon: <IconCheck size="1rem" />,
});

// EXACT ERROR NOTIFICATION PATTERN (line 154-159 in ConcertManagement)
notifications.show({
  title: "エラー",
  message: handleApiError(error),
  color: "red",
  icon: <IconAlertCircle size="1rem" />,
});

// EXACT DELETE CONFIRMATION PATTERN from ConcertManagement.tsx (line 183-201)
modals.openConfirmModal({
  title: "練習予定を削除",
  children: (
    <Stack gap="sm">
      <Text size="sm">
        「{practice.title}」を削除してもよろしいですか？
      </Text>
      <Alert color="yellow" variant="light">
        <Text size="sm">
          <strong>注意:</strong> この操作は元に戻せません。
        </Text>
      </Alert>
    </Stack>
  ),
  labels: { confirm: "削除する", cancel: "キャンセル" },
  confirmProps: { color: "red" },
  onConfirm: () => performDelete(practice.id),
});
```

### Known Gotchas of our codebase & Library Quirks

```typescript
// CRITICAL: All datetime handling must use proper Date objects
// Practice API expects Date objects, not strings for startTime/endTime
const practiceStartTime = new Date(startTime); // Convert string to Date

// CRITICAL: Form validation must check timezone conversions
// The form uses string inputs but API expects Date objects
if (endTime && new Date(endTime) <= new Date(startTime)) {
  setError("終了時間は開始時間より後に設定してください");
  return;
}

// CRITICAL: API expects practiceId for PUT/DELETE, not id
// Body must include practiceId: { practiceId, title, startTime, ... }
const updateData = { practiceId: practice.id, ...formData };

// CRITICAL: Loading state must be managed during API calls
try {
  setIsLoading(true);
  await updatePractice(practiceId, data);
} finally {
  setIsLoading(false);
}

// CRITICAL: All forms must handle cancellation
const handleCloseForm = () => {
  setIsFormOpen(false);
  setEditingPractice(null);
  setError("");
};
```

## Implementation Blueprint

### Data models and structure

Create the form data type to match the Practice API requirements.

```typescript
// src/types/practice.ts - Follow ConcertFormData pattern
export interface PracticeFormData {
  concertId: string;
  title: string;
  startTime: string; // ISO string for form input
  endTime?: string;  // ISO string for form input  
  venue: string;
  address?: string;
  items?: string;
  notes?: string;
  memo?: string;
  audioUrl?: string;
  videoUrl?: string;
}

// API response type (already exists in Practice interface)
export interface PracticeApiResponse {
  success: boolean;
  message?: string;
  error?: string;
}
```

### List of tasks to be completed to fulfill the PRP in the order they should be completed

```yaml
Task 1: Create PracticeFormData type
CREATE src/types/practice.ts:
  - DEFINE PracticeFormData interface matching API requirements
  - DEFINE PracticeApiResponse interface for consistency
  - EXPORT types for use in components

Task 2: Create PracticeForm component  
CREATE src/components/features/practices/PracticeForm.tsx:
  - MIRROR pattern from: src/components/features/concerts/ConcertForm.tsx
  - MODIFY fields to match Practice data model
  - IMPLEMENT datetime input validation (startTime before endTime)
  - ADD all Practice-specific fields (address, items, notes, memo, audioUrl, videoUrl)
  - PRESERVE error handling and loading states pattern

Task 3: Create PracticeManagement component
CREATE src/components/features/practices/PracticeManagement.tsx:
  - MIRROR pattern from: src/components/features/concerts/ConcertManagement.tsx  
  - MODIFY API endpoints to /api/practices
  - IMPLEMENT createPractice, updatePractice, deletePractice functions
  - PRESERVE authentication check, modal state management
  - KEEP notification patterns identical
  - IMPLEMENT confirmation dialog for deletion

Task 4: Modify PracticesList to add admin buttons
MODIFY src/components/features/practices/PracticesList.tsx:
  - ADD useAuth import and isAdmin check
  - INJECT management buttons in practice cards (when isAdmin)
  - ADD onEdit and onDelete callback props
  - PRESERVE existing display logic and styling
  - FOLLOW pattern from ConcertList.tsx for button placement

Task 5: Integration and testing
MODIFY src/app/page.tsx or relevant parent component:
  - INTEGRATE PracticeManagement component
  - ENSURE proper prop passing between components
  - TEST complete CRUD workflow
  - VERIFY admin permission checking
```

### Per task pseudocode

```typescript
// Task 2: PracticeForm component structure with CONCRETE form fields
interface PracticeFormProps {
  initialData?: Practice;
  onSubmit: (data: PracticeFormData) => Promise<void>;
  isLoading?: boolean;
  title?: string;
  onCancel?: () => void;
}

function PracticeForm({initialData, onSubmit, isLoading, title, onCancel}) {
  // EXACT STATE PATTERN from ConcertForm
  const [formData, setFormData] = useState<PracticeFormData>({
    concertId: initialData?.concertId || "",
    title: initialData?.title || "",
    startTime: initialData?.startTime ? initialData.startTime.toISOString().slice(0, 16) : "",
    endTime: initialData?.endTime ? initialData.endTime.toISOString().slice(0, 16) : "",
    venue: initialData?.venue || "",
    address: initialData?.address || "",
    items: initialData?.items || "",
    notes: initialData?.notes || "",
    memo: initialData?.memo || "",
    audioUrl: initialData?.audioUrl || "",
    videoUrl: initialData?.videoUrl || "",
  });
  const [error, setError] = useState("");
  
  // EXACT VALIDATION PATTERN from ConcertForm with Practice-specific logic
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Required field validation
    if (!formData.title.trim()) {
      setError("練習タイトルを入力してください");
      return;
    }
    if (!formData.startTime.trim()) {
      setError("開始日時を入力してください");
      return;
    }
    if (!formData.venue.trim()) {
      setError("練習場所を入力してください");
      return;
    }

    // Date validation - CRITICAL for Practice API
    const startDate = new Date(formData.startTime);
    if (isNaN(startDate.getTime())) {
      setError("有効な開始日時を入力してください");
      return;
    }

    if (formData.endTime) {
      const endDate = new Date(formData.endTime);
      if (isNaN(endDate.getTime())) {
        setError("有効な終了日時を入力してください");
        return;
      }
      if (endDate <= startDate) {
        setError("終了日時は開始日時より後に設定してください");
        return;
      }
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      setError("送信に失敗しました。もう一度お試しください。");
    }
  };
  
  // EXACT INPUT HANDLER from ConcertForm
  const handleInputChange = (field: keyof PracticeFormData, value: string) => {
    setFormData(prev => ({...prev, [field]: value}));
    if (error) setError("");
  };
  
  // CONCRETE FORM FIELDS - exact JSX structure to implement
  return (
    <Paper shadow="sm" p="lg" radius="md" className="w-full max-w-md">
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          {/* Required Fields */}
          <TextInput
            label="練習タイトル"
            placeholder="第○回定期練習"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.currentTarget.value)}
            required
          />
          
          <input
            type="datetime-local"
            label="開始日時"
            value={formData.startTime}
            onChange={(e) => handleInputChange('startTime', e.currentTarget.value)}
            required
          />
          
          <input
            type="datetime-local"
            label="終了日時"
            value={formData.endTime}
            onChange={(e) => handleInputChange('endTime', e.currentTarget.value)}
          />
          
          <TextInput
            label="練習場所"
            placeholder="○○ホール"
            value={formData.venue}
            onChange={(e) => handleInputChange('venue', e.currentTarget.value)}
            required
          />
          
          {/* Optional Fields */}
          <TextInput
            label="住所"
            placeholder="東京都..."
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.currentTarget.value)}
          />
          
          <Textarea
            label="持ち物"
            placeholder="楽器、楽譜..."
            value={formData.items}
            onChange={(e) => handleInputChange('items', e.currentTarget.value)}
          />
          
          <Textarea
            label="注意事項"
            placeholder="開始15分前にお越しください..."
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.currentTarget.value)}
          />
          
          <Textarea
            label="メモ"
            value={formData.memo}
            onChange={(e) => handleInputChange('memo', e.currentTarget.value)}
          />
          
          <TextInput
            label="録音URL"
            placeholder="https://..."
            value={formData.audioUrl}
            onChange={(e) => handleInputChange('audioUrl', e.currentTarget.value)}
          />
          
          <TextInput
            label="録画URL"
            placeholder="https://..."
            value={formData.videoUrl}
            onChange={(e) => handleInputChange('videoUrl', e.currentTarget.value)}
          />
          
          {/* Error Display */}
          {error && (
            <Alert color="red" variant="light">
              <Text size="sm">{error}</Text>
            </Alert>
          )}
          
          {/* Action Buttons */}
          <Group justify="flex-end" gap="sm">
            <Button variant="outline" onClick={onCancel}>
              キャンセル
            </Button>
            <Button type="submit" loading={isLoading}>
              {initialData ? "更新する" : "作成する"}
            </Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
}

// Task 3: PracticeManagement component structure  
function PracticeManagement() {
  // PATTERN: Identical state structure to ConcertManagement
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  
  const [practices, setPractices] = useState<Practice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPractice, setEditingPractice] = useState<Practice | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // API functions - modify endpoints but keep structure
  const createPractice = async (data: PracticeFormData) => {
    // POST to /api/practices with data
    // Convert string dates to Date objects
  };
  
  const updatePractice = async (practiceId: string, data: PracticeFormData) => {
    // PUT to /api/practices with practiceId and data
  };
  
  const deletePractice = async (practiceId: string) => {
    // DELETE to /api/practices?id=${practiceId}
  };
  
  // KEEP: Identical handler patterns from ConcertManagement
  // handleFormSubmit, handleCreateNew, handleEdit, handleDelete
}
```

### Integration Points

```yaml
AUTHENTICATION:
  - pattern: "const isAdmin = user?.role === 'admin'"
  - check: "if (!isAdmin) return access denied UI"

API_ENDPOINTS:
  - POST: "/api/practices" (create)
  - PUT: "/api/practices" (update with practiceId)  
  - DELETE: "/api/practices?id={practiceId}" (delete)

NOTIFICATIONS:
  - success: "notifications.show({title: 'success', color: 'green'})"
  - error: "notifications.show({title: 'error', message: handleApiError(error), color: 'red'})"

MODAL_MANAGEMENT:
  - pattern: "modals.openConfirmModal() for delete confirmations"
  - state: "isFormOpen, setIsFormOpen for create/edit modals"

DATE_HANDLING:
  - input: "string (ISO format) in forms"
  - api: "Date objects in API calls"
  - validation: "endTime > startTime if both provided"
```

## Validation Loop

### Level 1: Syntax & Style

```bash
# Run these FIRST - fix any errors before proceeding
npm run lint                    # ESLint checking
npm run build                   # TypeScript compilation check

# Expected: No errors. If errors, READ the error and fix.
```

### Level 2: Component Integration Test

```typescript
// Manual testing checklist - no automated tests exist in this codebase
// Test these scenarios in the browser:

// 1. Admin Authentication Test
// - Login as admin user
// - Verify management buttons appear in practice list
// - Login as viewer, verify buttons are hidden

// 2. Create Practice Test  
// - Click "new practice" button
// - Fill form with valid data including start/end times
// - Submit and verify success notification
// - Verify practice appears in list

// 3. Edit Practice Test
// - Click edit button on existing practice
// - Modify fields and save
// - Verify success notification and updated data

// 4. Delete Practice Test  
// - Click delete button
// - Verify confirmation modal appears
// - Confirm deletion and verify success notification

// 5. Form Validation Test
// - Try submitting empty required fields
// - Try end time before start time
// - Verify error messages display correctly
```

### Level 3: API Integration Test

```bash
# Test API endpoints directly if needed
# All endpoints are already implemented and working

# Create practice (admin only):
curl -X POST http://localhost:3000/api/practices \
  -H "Content-Type: application/json" \
  -H "Cookie: auth-token=ADMIN_JWT_TOKEN" \
  -d '{
    "concertId": "concert_id",
    "title": "Test Practice",
    "startTime": "2024-01-01T10:00:00Z",
    "endTime": "2024-01-01T12:00:00Z", 
    "venue": "Test Venue"
  }'

# Expected: {"success": true, "message": "練習予定を作成しました"}
```

## Final Validation Checklist

- [ ] No linting errors: `npm run lint`
- [ ] No TypeScript errors: `npm run build`
- [ ] Admin can create practices via form
- [ ] Admin can edit existing practices  
- [ ] Admin can delete practices with confirmation
- [ ] Viewer users cannot see management buttons
- [ ] Form validation works for required fields
- [ ] Date validation works (end after start)
- [ ] Success/error notifications display correctly
- [ ] Mobile-responsive design maintained
- [ ] All API calls use proper error handling
- [ ] Issue updated with completion status

---

## Anti-Patterns to Avoid

- ❌ Don't create new patterns when ConcertManagement pattern exists
- ❌ Don't skip admin permission checks in UI components
- ❌ Don't use direct string dates in API calls - convert to Date objects
- ❌ Don't ignore timezone handling for datetime fields
- ❌ Don't use different notification patterns than existing components
- ❌ Don't skip form validation for start/end time relationships
- ❌ Don't create new error handling when handleApiError exists
- ❌ Don't hardcode UI strings - follow existing Japanese text patterns
- ❌ Don't break mobile responsiveness - follow existing Mantine patterns
- ❌ Don't forget to handle loading states during API operations

### Integration with Parent Component Pattern

```typescript
// EXACT INTEGRATION PATTERN from page.tsx or parent component
import { PracticeManagement } from "@/components/features/practices/PracticeManagement";

// In the practices tab section:
{activeTab === "practices" && (
  <Stack gap="lg">
    {/* Existing PracticesList for viewing */}
    <PracticesList 
      practices={concertData.practices}
      // NEW: Add management callbacks when admin
      onEdit={isAdmin ? handleEditPractice : undefined}
      onDelete={isAdmin ? handleDeletePractice : undefined}
    />
    
    {/* NEW: Add PracticeManagement component for CRUD operations */}
    {isAdmin && (
      <PracticeManagement 
        concertId={selectedConcert}
        onPracticeUpdate={loadConcertData} // Refresh data after changes
      />
    )}
  </Stack>
)}
```

## Final Quality Assessment

### Quality Checklist ✅

- [x] **All necessary context included**: Complete with imports, patterns, and code examples
- [x] **Validation gates are executable**: `npm run lint` and `npm run build` work
- [x] **References existing patterns**: Exact ConcertManagement.tsx patterns referenced with line numbers
- [x] **Clear implementation path**: 5 detailed tasks with concrete code examples
- [x] **Error handling documented**: Complete handleApiError and notification patterns
- [x] **Issue link updated**: https://github.com/atsu0127/orch-link/issues/19 included

### Enhanced Features Added

- **Concrete Code Examples**: Real import statements and component patterns
- **Complete Form Implementation**: All 10 Practice fields with validation
- **Exact API Integration**: Specific parameter requirements and response handling  
- **Detailed Integration Patterns**: Parent component integration examples
- **Enhanced Documentation**: 7 specific Mantine component documentation URLs
- **Timezone Handling**: Specific Date conversion patterns for API compatibility

## Confidence Score: 9.5/10

This enhanced PRP now provides:
- **Exact code-to-copy patterns** from working components
- **Complete form field implementation** with all validation logic
- **Specific API parameter requirements** (practiceId, not id)
- **Concrete notification and error patterns** with exact text
- **Line-by-line reference examples** from existing codebase
- **Zero-ambiguity implementation path** with 5 detailed tasks

**Deduction (0.5 points)**: Minor uncertainty around concertId selection mechanism in the form - this may need slight adaptation based on current concert selection state management in the parent component.

**Success Probability**: 95% - One-pass implementation highly likely with this comprehensive context.