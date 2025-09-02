## Goal

Add comprehensive attendance link management functionality for administrators within the existing attendance tab. Implement create, edit, and delete operations for attendance forms while maintaining the existing read-only display for viewers. The feature should integrate seamlessly into the current AttendanceTab component using role-based access control patterns established in the codebase.

## Issue Link

https://github.com/atsu0127/orch-link/issues/14

## Why

- **Admin Efficiency**: Administrators currently have no way to manage attendance links through the UI
- **User Experience**: Provides unified interface for attendance management within existing tab structure
- **Role-Based Access**: Maintains security by showing management controls only to administrators
- **Consistency**: Follows established CRUD patterns from concert management functionality

## What

### User-Visible Behavior

**For Administrators:**
- See existing attendance forms with edit/delete buttons
- "新規出欠調整を作成" button to add new attendance links
- Modal forms for creating/editing attendance forms (title, URL, description)
- Delete confirmation dialogs with appropriate warnings
- Success/error notifications for all operations
- Real-time list updates after CRUD operations

**For Viewers:**
- Unchanged read-only display of attendance forms
- No administrative controls visible

### Technical Requirements

- Role-based UI rendering using `useAuth` hook
- Form validation for required fields (title, URL)
- URL format validation for external form links
- Proper error handling and user feedback
- Mobile-responsive design consistency
- TypeScript type safety throughout

### Success Criteria

- [ ] Admin can create new attendance forms via modal
- [ ] Admin can edit existing attendance forms 
- [ ] Admin can delete attendance forms with confirmation
- [ ] Viewers see read-only display (unchanged behavior)
- [ ] All operations show proper loading states and notifications
- [ ] Form validation prevents invalid submissions
- [ ] Mobile-responsive design maintained
- [ ] No TypeScript errors or lint issues

## All Needed Context

### Documentation & References

```yaml
- file: src/components/features/concerts/ConcertManagement.tsx
  why: CRUD operation patterns, state management, modal handling, delete confirmations
  critical: Shows handleFormSubmit, loadConcerts, handleDelete patterns

- file: src/components/features/concerts/ConcertForm.tsx  
  why: Form implementation patterns, validation, error handling
  critical: Form state management and handleInputChange pattern

- file: src/components/features/attendance/AttendanceTab.tsx
  why: Current implementation to extend, UI structure to preserve
  critical: Read-only display must be maintained for viewers

- file: src/app/api/concerts/route.ts
  why: API endpoint patterns for PUT/DELETE operations
  critical: Authentication checks, validation patterns, response formats

- file: src/app/api/attendance/route.ts
  why: Existing POST endpoint, authentication and validation patterns
  critical: Already implements admin role checking and AttendanceForm creation

- file: src/components/features/auth/AuthProvider.tsx
  why: useAuth hook for role-based rendering
  critical: user.role === "admin" pattern for showing admin UI

- file: src/lib/api-client.ts
  why: API client patterns, error handling
  critical: handleApiError function and fetch patterns with credentials

- file: src/types/index.ts
  why: AttendanceForm interface definition
  critical: Required fields are id, concertId, title, url, description?, updatedAt

- url: https://mantine.dev/core/modal/
  why: Modal component usage for create/edit forms
  
- url: https://mantine.dev/core/notifications/
  why: Success/error notification patterns
</yaml>

### Current Codebase Structure (Relevant Parts)

```bash
src/
├── app/api/attendance/route.ts          # POST already exists, need PUT/DELETE
├── components/features/attendance/
│   └── AttendanceTab.tsx               # Component to extend with admin UI
├── components/features/concerts/
│   ├── ConcertManagement.tsx          # CRUD pattern reference
│   └── ConcertForm.tsx                # Form pattern reference  
├── lib/
│   └── api-client.ts                  # Need attendance API client functions
└── types/
    ├── index.ts                       # AttendanceForm interface exists
    └── concert.ts                     # ConcertFormData pattern reference
```

### Desired Codebase Changes

```bash
src/
├── app/api/attendance/route.ts          # Add PUT and DELETE endpoints
├── components/features/attendance/
│   ├── AttendanceTab.tsx               # Extend with admin UI and CRUD logic
│   └── AttendanceForm.tsx              # NEW: Form component for create/edit
├── lib/
│   └── api-client.ts                  # Add fetchAttendanceForms function
└── types/
    └── index.ts                       # Add AttendanceFormData interface
```

### Known Gotchas & Library Quirks

```typescript
// CRITICAL: Mantine notifications require notifications import
import { notifications } from "@mantine/notifications";

// CRITICAL: useAuth hook provides user.role for access control
const { user } = useAuth();
const isAdmin = user?.role === "admin";

// CRITICAL: API routes must verify admin role for write operations
const payload = await verifyToken(token);
if (!payload || payload.role !== "admin") {
  return NextResponse.json({ error: "管理者権限が必要です" }, { status: 403 });
}

// CRITICAL: Attendance API expects concertId, title, url as required fields
// description is optional

// CRITICAL: Modal state management pattern
const [isFormOpen, setIsFormOpen] = useState(false);
const [editingItem, setEditingItem] = useState<AttendanceForm | null>(null);

// CRITICAL: Delete confirmation uses modals.openConfirmModal
modals.openConfirmModal({
  title: "削除確認",
  children: <Text>削除してもよろしいですか？</Text>,
  labels: { confirm: "削除する", cancel: "キャンセル" },
  confirmProps: { color: "red" },
  onConfirm: () => performDelete(id),
});
```

## Implementation Blueprint

### Data Models and Structure

The AttendanceForm model already exists in Prisma schema with required fields. Need to add TypeScript form data interface:

```typescript
// Add to src/types/index.ts
export interface AttendanceFormData {
  title: string;        // フォームタイトル  
  url: string;          // 外部フォームURL
  description?: string; // 補足説明（任意）
}
```

### List of Tasks to Complete (In Order)

```yaml
Task 1: Extend API endpoints
MODIFY src/app/api/attendance/route.ts:
  - ADD PUT endpoint following concerts/route.ts pattern
  - ADD DELETE endpoint following concerts/route.ts pattern  
  - PRESERVE existing POST and GET endpoints
  - KEEP identical authentication and validation patterns

Task 2: Add form data types
MODIFY src/types/index.ts:
  - ADD AttendanceFormData interface 
  - MIRROR pattern from ConcertFormData structure
  - INCLUDE title, url, description fields

Task 3: Create attendance form component
CREATE src/components/features/attendance/AttendanceForm.tsx:
  - MIRROR pattern from concerts/ConcertForm.tsx
  - MODIFY field definitions for attendance form fields
  - KEEP identical validation and submission patterns
  - PRESERVE mobile-responsive design

Task 4: Add API client functions  
MODIFY src/lib/api-client.ts:
  - ADD fetchAttendanceForms function following fetchConcerts pattern
  - INCLUDE proper error handling with handleApiError
  - KEEP credentials: "include" for JWT authentication

Task 5: Extend AttendanceTab with admin functionality
MODIFY src/components/features/attendance/AttendanceTab.tsx:
  - ADD role-based UI rendering using useAuth hook
  - ADD CRUD state management following ConcertManagement pattern
  - ADD admin controls (create/edit/delete buttons)
  - ADD modal management for forms
  - PRESERVE existing read-only display for viewers
  - INJECT admin UI elements while maintaining existing layout
```

### Per Task Pseudocode

```typescript
// Task 1: API Endpoints Pseudocode
// PUT /api/attendance
async function PUT(request: NextRequest) {
  // PATTERN: Copy auth checks from concerts/route.ts PUT exactly
  // VALIDATE: attendanceFormId, title, url (required), description (optional)
  // UPDATE: prisma.attendanceForm.update with provided fields
  // RETURN: Standard success response
}

// DELETE /api/attendance  
async function DELETE(request: NextRequest) {
  // PATTERN: Copy auth checks from concerts/route.ts DELETE exactly
  // VALIDATE: attendanceFormId from query params
  // DELETE: prisma.attendanceForm.delete with cascade protection
  // RETURN: Standard success response
}

// Task 5: AttendanceTab Extension Pseudocode
function AttendanceTab({ concertId, attendanceForms }) {
  // PATTERN: Copy state management from ConcertManagement exactly
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [localForms, setLocalForms] = useState(attendanceForms);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingForm, setEditingForm] = useState(null);

  // CRITICAL: Preserve existing read-only display
  // ADD: Admin-only header with "新規作成" button
  // ADD: Edit/delete buttons to each form card (admin only)
  // ADD: Modal with AttendanceForm component
  // KEEP: All existing viewer functionality unchanged
}
```

### Integration Points

```yaml
COMPONENTS:
  - extend: src/components/features/attendance/AttendanceTab.tsx
  - create: src/components/features/attendance/AttendanceForm.tsx
  - pattern: "Mirror ConcertManagement modal and form patterns exactly"

API_ROUTES:  
  - extend: src/app/api/attendance/route.ts
  - add: "PUT and DELETE endpoints with admin auth"
  - pattern: "Copy concerts/route.ts authentication and validation exactly"

TYPES:
  - extend: src/types/index.ts  
  - add: "AttendanceFormData interface"
  - pattern: "Mirror ConcertFormData structure"

CLIENT_API:
  - extend: src/lib/api-client.ts
  - add: "fetchAttendanceForms function"
  - pattern: "Copy fetchConcerts pattern exactly"
```

## Validation Loop

### Level 1: Syntax & Style

```bash
# Run these FIRST - fix any errors before proceeding
npm run lint                    # ESLint validation
npx tsc --noEmit               # TypeScript compilation check

# Expected: No errors. If errors exist, read them carefully and fix.
```

### Level 2: Manual Testing

```bash
# Start development server
npm run dev

# Test scenarios to verify:
# 1. Login as admin - should see create/edit/delete controls
# 2. Login as viewer - should see read-only display only  
# 3. Create new attendance form - should appear in list
# 4. Edit existing form - should update in list
# 5. Delete form - should remove from list with confirmation
# 6. Form validation - should prevent empty title/invalid URL
# 7. Mobile responsive - should work on mobile screen sizes
```

### Level 3: API Testing (Optional)

```bash
# Test API endpoints directly
# Create attendance form (should work for admin)
curl -X POST http://localhost:3000/api/attendance \
  -H "Content-Type: application/json" \
  -H "Cookie: auth-token=<admin-token>" \
  -d '{"concertId": "test-concert", "title": "Test Form", "url": "https://forms.google.com/test"}'

# Expected: {"success": true, "message": "出欠調整を作成しました"}
```

## Final Validation Checklist

- [ ] No TypeScript errors: `npx tsc --noEmit`
- [ ] No lint errors: `npm run lint` 
- [ ] Admin can create attendance forms via modal
- [ ] Admin can edit existing forms by clicking edit button
- [ ] Admin can delete forms with confirmation dialog
- [ ] Viewers see unchanged read-only display
- [ ] Form validation prevents empty title/URL
- [ ] All operations show loading states and notifications
- [ ] Mobile-responsive design maintained
- [ ] JWT authentication working for all operations
- [ ] Database operations complete successfully

## Anti-Patterns to Avoid

- ❌ Don't break existing read-only functionality for viewers
- ❌ Don't create separate admin pages - integrate into existing tab
- ❌ Don't skip role-based access control checks
- ❌ Don't ignore existing UI/UX patterns from concert management
- ❌ Don't hardcode text that should be in Japanese
- ❌ Don't skip form validation on both client and server
- ❌ Don't forget to handle loading and error states properly

---

## Confidence Score: 9/10

High confidence due to:
- ✅ Existing similar CRUD patterns in ConcertManagement
- ✅ Well-established API endpoint patterns
- ✅ Clear authentication and authorization patterns
- ✅ Comprehensive component examples to follow
- ✅ Detailed validation and error handling examples

Minor risk: Integration complexity of adding admin UI to existing read-only component, but pattern is clear from other parts of codebase.