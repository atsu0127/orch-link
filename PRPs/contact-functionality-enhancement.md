name: "Contact Functionality Enhancement - Remove Email Button & Add Admin Edit UI"
description: |

## Purpose

Enhance contact functionality by removing the "Send Email" button and replacing it with copy-to-clipboard functionality, while adding an admin-only modal interface for updating contact information (email address and description) directly in the browser.

## Core Principles

1. **Context is King**: Include ALL necessary documentation, examples, and caveats
2. **Validation Loops**: Provide executable tests/lints the AI can run and fix
3. **Information Dense**: Use keywords and patterns from the codebase
4. **Progressive Success**: Start simple, validate, then enhance
5. **Global rules**: Be sure to follow all rules in CLAUDE.md (Japanese comments, English docs)

---

## Goal

Transform the ContactTab component to:
1. Remove the "メールで連絡する" button that uses mailto links
2. Add copy-to-clipboard functionality for the email address
3. Add an admin-only edit button and modal form for updating contact information
4. Maintain all existing functionality while improving usability

## Issue Link

https://github.com/atsu0127/orch-link/issues/21

## Why

- **User Experience**: Copy-to-clipboard is more convenient than mailto links on mobile devices
- **Admin Productivity**: Enable direct browser-based updates without needing to access backend
- **Consistency**: Follow the established admin editing pattern used throughout the app
- **Mobile-First**: Better mobile experience which is the primary use case for this application

## What

### User-visible behavior:
- **All Users**: Click email address to copy to clipboard with visual feedback
- **Admins Only**: Edit button to open modal for updating email and description
- **Form Validation**: Proper email validation and error handling
- **Success Notifications**: Visual feedback for successful operations

### Technical requirements:
- Preserve existing API endpoint `PUT /api/contact`
- Follow existing admin authentication patterns
- Use established Modal + Form pattern from AttendanceTab
- Mobile-responsive design
- Japanese UI text and comments

### Success Criteria

- [ ] Email button completely removed from ContactTab
- [ ] Copy-to-clipboard works with visual feedback
- [ ] Admin edit modal opens and submits successfully
- [ ] Email validation matches existing API regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- [ ] Success/error notifications display properly
- [ ] Mobile-responsive on all screen sizes
- [ ] No breaking changes to existing functionality

## All Needed Context

### Documentation & References

```yaml
# MUST READ - Include these in your context window
- url: https://mantine.dev/hooks/use-clipboard/
  why: useClipboard hook for copy functionality with timeout and error handling

- url: https://mantine.dev/core/modal/
  why: Modal component props, accessibility, and form integration patterns

- url: https://mantine.dev/x/notifications/
  why: notifications.show() API for success/error feedback

- file: src/components/features/contact/ContactTab.tsx
  why: Current implementation with handleSendEmail function to be removed

- file: src/components/features/attendance/AttendanceTab.tsx
  why: Established admin edit pattern with Modal + useState + notifications

- file: src/app/api/contact/route.ts
  why: Existing PUT endpoint with email validation regex and admin auth check

- file: src/lib/api-client.ts
  why: fetchContactInfo pattern and error handling approach

- file: src/types/index.ts
  why: ContactInfo interface and existing type definitions
```

### Current Codebase tree (relevant sections)

```bash
src/
├── components/features/contact/
│   └── ContactTab.tsx              # Target file to modify
├── components/features/attendance/
│   └── AttendanceTab.tsx           # Reference pattern for admin modal
├── app/api/contact/
│   └── route.ts                    # Existing API endpoint to reuse
├── lib/
│   ├── api-client.ts               # Existing fetch patterns
│   └── utils.ts                    # Helper functions
└── types/
    └── index.ts                    # ContactInfo interface
```

### Known Gotchas of our codebase & Library Quirks

```typescript
// CRITICAL: Mantine useClipboard requires @mantine/hooks import
// Example: import { useClipboard } from '@mantine/hooks';

// CRITICAL: notifications require @mantine/notifications setup
// Example: Already configured in app, use notifications.show() directly

// CRITICAL: Admin auth pattern used throughout codebase
// Example: const isAdmin = user?.role === "admin";

// CRITICAL: API expects exact field names: { email, description }
// Example: Email regex in API: /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// CRITICAL: Japanese UI text conventions
// Example: All user-facing text in Japanese, comments in Japanese

// CRITICAL: Modal state management pattern
// Example: const [isEditModalOpen, setIsEditModalOpen] = useState(false);
```

## Implementation Blueprint

### Data models and structure

Reuse existing ContactInfo interface, no new models needed:

```typescript
// From src/types/index.ts
interface ContactInfo {
  id: string;
  email: string; // 管理者メールアドレス
  description: string; // 説明文
  updatedAt: Date; // 最終更新日時
}

// Form data structure (for API calls)
interface ContactUpdateData {
  email: string;
  description: string;
}
```

### List of tasks to be completed to fulfill the PRP in the order they should be completed

```yaml
Task 1: Add useClipboard hook and remove email button
MODIFY src/components/features/contact/ContactTab.tsx:
  - IMPORT useClipboard from @mantine/hooks
  - REMOVE handleSendEmail function completely
  - REMOVE Button with "メールで連絡する"
  - REPLACE email display with clickable copy functionality
  - ADD visual feedback for copy success/failure

Task 2: Add admin authentication and modal state
MODIFY src/components/features/contact/ContactTab.tsx:
  - IMPORT useAuth hook
  - ADD isAdmin check: user?.role === "admin"
  - ADD useState for modal management (isEditModalOpen, editData)
  - ADD useState for form loading state

Task 3: Create admin edit modal with form
MODIFY src/components/features/contact/ContactTab.tsx:
  - CREATE Modal component with form fields (email, description)
  - ADD form validation matching API regex
  - IMPLEMENT handleSubmit function using existing PUT /api/contact
  - ADD success/error notifications using notifications.show()
  - FOLLOW AttendanceTab modal pattern exactly

Task 4: Add admin edit button conditionally
MODIFY src/components/features/contact/ContactTab.tsx:
  - ADD edit button visible only to admins (isAdmin check)
  - CONNECT button to modal open handler
  - PLACE button appropriately in existing layout
  - MAINTAIN mobile responsiveness

Task 5: Test and validate complete functionality
- VERIFY copy-to-clipboard works on mobile and desktop
- VERIFY admin modal works with proper validation
- VERIFY existing API integration works
- VERIFY error handling and notifications work
- VERIFY mobile responsiveness maintained
```

### Per task pseudocode

```typescript
// Task 1: Copy functionality
const clipboard = useClipboard({ timeout: 1000 });

const handleCopyEmail = () => {
  clipboard.copy(contactInfo.email);
  // Visual feedback handled by useClipboard hook
};

// Task 2: Admin state management
const { user } = useAuth();
const isAdmin = user?.role === "admin";
const [isEditModalOpen, setIsEditModalOpen] = useState(false);
const [isLoading, setIsLoading] = useState(false);

// Task 3: Modal form submission
const handleSubmit = async (formData: ContactUpdateData) => {
  try {
    setIsLoading(true);
    const response = await fetch("/api/contact", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // JWT authentication
      body: JSON.stringify(formData),
    });

    if (!response.ok) throw new Error("更新に失敗しました");

    notifications.show({
      title: "更新完了",
      message: "連絡先情報を更新しました",
      color: "green",
    });

    // Reload contact info
    await loadContactInfo();
    setIsEditModalOpen(false);
  } catch (error) {
    notifications.show({
      title: "エラー",
      message: handleApiError(error),
      color: "red",
    });
  } finally {
    setIsLoading(false);
  }
};
```

### Integration Points

```yaml
COMPONENTS:
  - modify: src/components/features/contact/ContactTab.tsx
  - pattern: Follow AttendanceTab modal and notification pattern exactly

HOOKS:
  - add: useClipboard from @mantine/hooks
  - add: useAuth (already imported)
  - existing: useState, useEffect (already imported)

API:
  - reuse: PUT /api/contact (no changes needed)
  - validation: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ (existing in API)

NOTIFICATIONS:
  - reuse: notifications.show() (already configured)
  - colors: "green" for success, "red" for error
```

## Validation Loop

### Level 1: Syntax & Style

```bash
# Run these FIRST - fix any errors before proceeding
npm run lint                     # ESLint checking
npm run typecheck               # TypeScript type checking

# Expected: No errors. If errors, READ the error and fix.
```

### Level 2: Component Testing

```typescript
// Manual testing steps:
// 1. Test copy functionality
//    - Click email address
//    - Verify clipboard contains email
//    - Verify visual feedback appears

// 2. Test admin functionality (login as admin)
//    - Verify edit button appears for admins only
//    - Click edit button, verify modal opens
//    - Test form validation with invalid email
//    - Submit valid data, verify success notification
//    - Verify contact info updates on page

// 3. Test non-admin view
//    - Login as viewer
//    - Verify edit button is hidden
//    - Verify copy functionality still works
```

### Level 3: Integration Test

```bash
# Start development server
npm run dev

# Test in browser:
# 1. Navigate to contact tab
# 2. Test copy functionality on mobile and desktop
# 3. Login as admin, test edit modal
# 4. Verify API calls in Network tab
# 5. Check console for any errors

# Expected: All functionality works without errors
```

## Final validation Checklist

- [ ] No lint errors: `npm run lint`
- [ ] No type errors: `npm run typecheck`
- [ ] Copy-to-clipboard works on mobile and desktop
- [ ] Admin edit modal works with proper validation
- [ ] Non-admin users see no edit button
- [ ] Success/error notifications display correctly
- [ ] Mobile responsiveness maintained
- [ ] Japanese text throughout UI
- [ ] No breaking changes to existing functionality
- [ ] Issue #21 requirements fully met

---

## Anti-Patterns to Avoid

- ❌ Don't create new API endpoints - reuse existing PUT /api/contact
- ❌ Don't change email validation - match existing regex in API
- ❌ Don't break mobile responsiveness - test on mobile viewport
- ❌ Don't add English text - maintain Japanese UI convention
- ❌ Don't skip admin authentication checks
- ❌ Don't ignore notification feedback - users need visual confirmation
- ❌ Don't hardcode text that should be Japanese
- ❌ Don't create new patterns when AttendanceTab pattern works perfectly