# Concert Management CRUD Operations PRP

name: "Concert Management CRUD Operations - Complete Admin Interface"
description: |

## Purpose

Implement complete CRUD operations for concert management in the Orch Link application, following established patterns from practices, scores, and attendance management.

## Core Principles

1. **Context is King**: Include ALL necessary documentation, examples, and caveats
2. **Validation Loops**: Provide executable tests/lints the AI can run and fix
3. **Information Dense**: Use keywords and patterns from the codebase
4. **Progressive Success**: Start simple, validate, then enhance
5. **Global rules**: Be sure to follow all rules in CLAUDE.md

---

## Goal

Implement complete concert management CRUD operations for administrators, including:

- POST /api/concerts API endpoint for creating new concerts
- PUT /api/concerts API endpoint for updating existing concerts
- DELETE /api/concerts API endpoint for deleting concerts
- Admin-only frontend interface for concert management following existing patterns from practices, scores, and attendance forms
- Proper authentication checks for admin role
- Form handling with ConcertFormData type (title, date, venue, isActive)

## Issue Link

https://github.com/atsu0127/orch-link/issues/11

## Why

- **Business Value**: Administrators need ability to manage concerts through the application interface
- **Integration**: Concert is the core entity that all other features (practices, scores, attendance) depend on
- **User Impact**: Eliminates need for manual database operations for concert management
- **Consistency**: Follows established CRUD patterns for unified admin experience

## What

### User-visible behavior:

- Admin users can create, update, and delete concerts through web interface
- Concert management follows same UI patterns as other admin features
- Proper validation and error handling with Japanese error messages
- Confirmation dialogs for destructive operations (delete)

### Technical requirements:

- REST API endpoints following existing conventions
- JWT admin authentication for all write operations
- Cascading delete handling for related data (attendanceForms, scores, practices)
- Form validation matching ConcertFormData type
- Mobile-responsive admin interface using Mantine components

### Success Criteria

- [x] POST /api/concerts endpoint creates concerts with admin auth check
- [x] PUT /api/concerts endpoint updates concerts with admin auth check
- [x] DELETE /api/concerts endpoint deletes concerts with cascading relations
- [x] Frontend admin interface for concert CRUD operations
- [x] Proper validation and error handling in both API and UI
- [x] Japanese error messages and UI text
- [x] Mobile-responsive design using Mantine components

## All Needed Context

### Documentation & References

```yaml
# MUST READ - Include these in your context window
- url: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
  why: API route implementation patterns for GET/POST/PUT/DELETE methods

- url: https://www.prisma.io/docs/concepts/components/prisma-client/crud
  why: Prisma Client CRUD operations and cascading delete handling

- file: src/app/api/practices/route.ts
  why: Complete CRUD pattern with admin authentication - EXACT pattern to follow
  critical: Shows JWT token validation, admin role check, input validation, error handling

- file: src/app/api/scores/route.ts
  why: POST/PUT operation patterns with admin checks
  critical: Shows URL validation and updateData pattern for partial updates

- file: src/app/api/attendance/route.ts
  why: POST operation pattern with admin authentication
  critical: Shows consistent error response format

- file: src/lib/auth.ts
  why: JWT authentication implementation and admin role verification
  critical: verifyToken function and JWTPayload structure with role checking

- file: prisma/schema.prisma
  why: Concert model definition and relations with onDelete: Cascade
  critical: Shows id, title, date, venue, isActive fields and relations to AttendanceForm, Score, Practice

- file: src/types/concert.ts
  why: ConcertFormData type definition for form handling
  critical: Shows title, date (string), venue, isActive structure

- file: src/components/features/auth/LoginForm.tsx
  why: Mantine component patterns and form handling
  critical: Shows Mantine UI patterns, form state management, error handling

- file: src/components/features/attendance/AttendanceTab.tsx
  why: Mantine UI layout patterns for admin content
  critical: Shows Paper, Stack, Title, Button, Alert patterns and responsive design
```

### Current Codebase Tree

```bash
src/
├── app/
│   ├── api/
│   │   ├── practices/route.ts     # COMPLETE CRUD PATTERN
│   │   ├── scores/route.ts        # POST/PUT PATTERN
│   │   └── attendance/route.ts    # POST PATTERN
│   ├── login/page.tsx
│   └── page.tsx                   # Main app with tabs
├── components/
│   ├── features/
│   │   ├── auth/
│   │   │   ├── AuthProvider.tsx
│   │   │   └── LoginForm.tsx      # MANTINE FORM PATTERN
│   │   ├── attendance/
│   │   │   └── AttendanceTab.tsx  # MANTINE UI PATTERN
│   │   ├── practices/
│   │   └── scores/
│   │       └── ScoresTab.tsx      # MANTINE UI PATTERN
│   └── layout/
├── lib/
│   ├── auth.ts                    # JWT AUTH PATTERN
│   ├── api-client.ts
│   └── db.ts
└── types/
    ├── concert.ts                 # CONCERTFORMDATA TYPE
    └── index.ts
```

### Desired Codebase Tree with New Files

```bash
src/
├── app/
│   ├── api/
│   │   └── concerts/route.ts      # NEW: Complete CRUD for concerts (GET/POST/PUT/DELETE)
├── components/
│   ├── features/
│   │   └── concerts/
│   │       ├── ConcertManagement.tsx    # NEW: Admin concert management interface
│   │       ├── ConcertForm.tsx          # NEW: Create/edit concert form
│   │       └── ConcertList.tsx          # NEW: Concert list with admin actions
```

### Known Gotchas & Library Quirks

```typescript
// CRITICAL: Prisma onDelete: Cascade is already configured in schema
// DELETE will automatically remove related attendanceForms, scores, practices

// CRITICAL: JWT authentication pattern - check both token AND admin role
const payload = await verifyToken(token);
if (!payload || payload.role !== "admin") {
  return NextResponse.json({ error: "管理者権限が必要です" }, { status: 403 });
}

// CRITICAL: Date handling - ConcertFormData.date is string, Concert.date is DateTime
const concertDate = new Date(date);
if (isNaN(concertDate.getTime())) {
  return NextResponse.json(
    { error: "有効な日付を入力してください" },
    { status: 400 }
  );
}

// CRITICAL: Mantine components require "use client" directive
// CRITICAL: Follow existing Japanese error messages for consistency
// CRITICAL: Use existing formatDate utility from src/lib/utils for date display
```

## Implementation Blueprint

### Data Models and Structure

The Concert model and ConcertFormData type are already defined:

```typescript
// From prisma/schema.prisma - Concert model
model Concert {
  id       String   @id @default(cuid())
  title    String
  date     DateTime
  venue    String
  isActive Boolean  @default(true)
  // Relations with cascading deletes configured
  attendanceForms AttendanceForm[]
  scores          Score[]
  practices       Practice[]
}

// From src/types/concert.ts - Form data type
interface ConcertFormData {
  title: string;
  date: string;     // フォーム入力用文字列形式
  venue: string;
  isActive: boolean;
}
```

### List of Tasks to Complete (in order)

```yaml
Task 1: Create Concert API Route Handler
CREATE src/app/api/concerts/route.ts:
  - MIRROR pattern from: src/app/api/practices/route.ts (complete CRUD)
  - INCLUDE: GET (with optional id query param), POST, PUT, DELETE methods
  - PRESERVE: JWT authentication pattern from existing routes
  - MODIFY: Entity type from Practice to Concert, validation for Concert fields
  - KEEP: Error handling, response format, logging pattern identical

Task 2: Create Concert Management Components Directory
CREATE src/components/features/concerts/ directory structure:
  - Follow existing component organization pattern
  - Prepare for three components: Management, Form, List

Task 3: Create Concert Form Component
CREATE src/components/features/concerts/ConcertForm.tsx:
  - MIRROR pattern from: src/components/features/auth/LoginForm.tsx (Mantine form)
  - INCLUDE: ConcertFormData fields (title, date, venue, isActive)
  - PRESERVE: Mantine component patterns, form validation, error handling
  - MODIFY: Field types for concert-specific validation

Task 4: Create Concert List Component
CREATE src/components/features/concerts/ConcertList.tsx:
  - MIRROR pattern from: src/components/features/attendance/AttendanceTab.tsx (UI layout)
  - INCLUDE: List view with edit/delete actions for admin users
  - PRESERVE: Paper, Stack, Button, Alert patterns from existing tabs
  - MODIFY: Content structure for concert data display

Task 5: Create Concert Management Main Component
CREATE src/components/features/concerts/ConcertManagement.tsx:
  - COMBINE: Form and List components into admin management interface
  - FOLLOW: Tab component patterns from existing features
  - INCLUDE: Create/Edit/Delete functionality with confirmation dialogs

Task 6: Add Concert Management to Main App
MODIFY src/app/page.tsx:
  - FIND pattern: "import { ContactTab }" section and existing tab implementations
  - INJECT: ConcertManagement import and conditional rendering for admin users
  - PRESERVE: Existing tab structure and role-based display logic
```

### Per Task Pseudocode

```typescript
// Task 1: API Route Implementation
// src/app/api/concerts/route.ts

export async function GET(request: NextRequest) {
  // PATTERN: JWT auth check (from practices/route.ts)
  const token = request.cookies.get("auth-token")?.value;
  const payload = await verifyToken(token);
  // Authentication required for all routes

  // PATTERN: Query param handling for single vs list
  const { searchParams } = new URL(request.url);
  const concertId = searchParams.get("id");

  if (concertId) {
    // Single concert with relations
    const concert = await prisma.concert.findUnique({
      where: { id: concertId },
      include: { attendanceForms: true, scores: true, practices: true },
    });
  } else {
    // All concerts list
    const concerts = await prisma.concert.findMany({
      orderBy: { date: "desc" },
    });
  }
}

export async function POST(request: NextRequest) {
  // PATTERN: Admin auth check (from practices/route.ts)
  const payload = await verifyToken(token);
  if (!payload || payload.role !== "admin") {
    return NextResponse.json(
      { error: "管理者権限が必要です" },
      { status: 403 }
    );
  }

  // PATTERN: Input validation (from practices POST)
  const { title, date, venue, isActive } = await request.json();
  if (!title || !date || !venue) {
    return NextResponse.json(
      { error: "必須項目が不足しています" },
      { status: 400 }
    );
  }

  // CRITICAL: Date conversion with validation
  const concertDate = new Date(date);
  if (isNaN(concertDate.getTime())) {
    return NextResponse.json(
      { error: "有効な日付を入力してください" },
      { status: 400 }
    );
  }

  // PATTERN: Prisma create operation
  const newConcert = await prisma.concert.create({
    data: { title, date: concertDate, venue, isActive: isActive ?? true },
  });
}

export async function PUT(request: NextRequest) {
  // PATTERN: Partial update pattern (from scores PUT)
  const updateData: any = {};
  if (title !== undefined) updateData.title = title;
  if (date !== undefined) updateData.date = new Date(date);
  if (venue !== undefined) updateData.venue = venue;
  if (isActive !== undefined) updateData.isActive = isActive;

  await prisma.concert.update({
    where: { id: concertId },
    data: updateData,
  });
}

export async function DELETE(request: NextRequest) {
  // PATTERN: Query param for ID (from practices DELETE)
  const { searchParams } = new URL(request.url);
  const concertId = searchParams.get("id");

  // CRITICAL: Cascading delete configured in schema, will auto-delete relations
  await prisma.concert.delete({
    where: { id: concertId },
  });
}

// Task 3: Concert Form Component
// src/components/features/concerts/ConcertForm.tsx

("use client");
// PATTERN: Mantine form with validation (from LoginForm.tsx)
const [formData, setFormData] = useState<ConcertFormData>({
  title: "",
  date: "",
  venue: "",
  isActive: true,
});
const [error, setError] = useState("");
const [isLoading, setIsLoading] = useState(false);

// PATTERN: Form submission with API call
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  // Validation and API call to POST/PUT endpoint
};

// PATTERN: Mantine UI components (Paper, TextInput, DateInput, Switch, Button)
return (
  <Paper shadow="sm" p="lg">
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <TextInput label="演奏会タイトル" required />
        <DateInput label="開催日" required />
        <TextInput label="開催場所" required />
        <Switch label="アクティブ状態" />
      </Stack>
    </form>
  </Paper>
);
```

### Integration Points

```yaml
DATABASE:
  - model: Concert already exists in prisma/schema.prisma
  - relations: AttendanceForm, Score, Practice with onDelete: Cascade configured
  - no migration needed: All required fields and relations already exist

API:
  - add to: src/app/api/concerts/route.ts (NEW FILE)
  - pattern: Follow src/app/api/practices/route.ts exact structure
  - authentication: Use existing verifyToken from src/lib/auth.ts

FRONTEND:
  - add to: src/components/features/concerts/ (NEW DIRECTORY)
  - pattern: Follow Mantine component patterns from AttendanceTab.tsx
  - integration: Add to main app tabs for admin users

TYPES:
  - use existing: ConcertFormData from src/types/concert.ts
  - import existing: Concert type from prisma client
```

## Validation Loop

### Level 1: Syntax & Style

```bash
# Run these FIRST - fix any errors before proceeding
npm run lint                                    # Next.js ESLint validation
npx tsc --noEmit                               # TypeScript type checking

# Expected: No errors. If errors, READ the error and fix.
```

### Level 2: API Testing

```bash
# Test API endpoints manually (after implementing route.ts)

# Test POST endpoint
curl -X POST http://localhost:3000/api/concerts \
  -H "Content-Type: application/json" \
  -H "Cookie: auth-token=ADMIN_JWT_TOKEN" \
  -d '{"title": "テストコンサート", "date": "2024-12-25T19:00:00.000Z", "venue": "テストホール", "isActive": true}'

# Expected: {"success": true, "message": "演奏会を作成しました"}

# Test GET endpoint
curl http://localhost:3000/api/concerts \
  -H "Cookie: auth-token=ADMIN_JWT_TOKEN"

# Expected: {"success": true, "data": [...]}

# Test PUT endpoint
curl -X PUT http://localhost:3000/api/concerts \
  -H "Content-Type: application/json" \
  -H "Cookie: auth-token=ADMIN_JWT_TOKEN" \
  -d '{"concertId": "CONCERT_ID", "title": "更新されたタイトル"}'

# Expected: {"success": true, "message": "演奏会を更新しました"}

# Test DELETE endpoint
curl -X DELETE "http://localhost:3000/api/concerts?id=CONCERT_ID" \
  -H "Cookie: auth-token=ADMIN_JWT_TOKEN"

# Expected: {"success": true, "message": "演奏会を削除しました"}
```

### Level 3: UI Integration Test

```bash
# Start development server
npm run dev

# Manual testing checklist:
# 1. Login as admin user
# 2. Navigate to concert management interface
# 3. Create new concert via form
# 4. Edit existing concert
# 5. Delete concert with confirmation
# 6. Verify responsive design on mobile viewport
# 7. Test all error scenarios (missing fields, invalid dates)
```

## Final Validation Checklist

- [ ] All API endpoints pass curl tests: `curl testing above`
- [ ] No linting errors: `npm run lint`
- [ ] No type errors: `npx tsc --noEmit`
- [ ] Build succeeds: `npm run build`
- [ ] Admin authentication enforced on all write operations
- [ ] Cascading deletes work correctly (test by deleting concert with related data)
- [ ] Frontend form validation works for all required fields
- [ ] Japanese error messages display correctly
- [ ] Mobile-responsive design verified in browser dev tools
- [ ] Issue #11 updated with implementation details

---

## Anti-Patterns to Avoid

- ❌ Don't create new authentication patterns - use existing verifyToken from src/lib/auth.ts
- ❌ Don't skip input validation - follow exact pattern from practices/route.ts
- ❌ Don't ignore cascading deletes - they're configured but test thoroughly
- ❌ Don't hardcode error messages - use Japanese messages matching existing routes
- ❌ Don't create new UI patterns - follow Mantine components from AttendanceTab.tsx
- ❌ Don't add English comments - all code comments must be in Japanese per CLAUDE.md
- ❌ Don't skip mobile responsiveness - this is primary interface per project requirements

## Critical Implementation Notes

1. **Authentication Flow**: All write operations (POST/PUT/DELETE) require admin role verification
2. **Date Handling**: Convert string dates from form to DateTime for database storage
3. **Error Responses**: Maintain consistent Japanese error message format across all endpoints
4. **UI Integration**: Admin-only concert management should be accessible from main app interface
5. **Cascading Deletes**: Deleting a concert will automatically delete all related attendanceForms, scores, and practices
6. **Mobile-First**: Interface must work well on mobile devices as primary use case

## Expected Implementation Quality Score: 9/10

This PRP provides comprehensive context with:

- Complete reference implementations to mirror
- Exact code patterns and authentication flows
- Detailed validation gates with executable commands
- Clear anti-patterns to avoid
- Specific error handling requirements
- Database model and type definitions
- UI component patterns to follow

The high score reflects the thorough analysis of existing codebase patterns and detailed implementation guidance that should enable one-pass successful implementation.
