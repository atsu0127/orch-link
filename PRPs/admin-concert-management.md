# Admin Concert Management CRUD Implementation

## Goal

Implement comprehensive concert management functionality for administrators, providing full CRUD operations (Create, Read, Update, Delete) through both API endpoints and a dedicated admin management interface. This feature will enable administrators to efficiently manage concert information with proper authentication, validation, and user feedback.

## Issue Link

https://github.com/atsu0127/orch-link/issues/7

## Why

- **Business Value**: Administrators need to efficiently manage concert information without manual database access
- **User Impact**: Enables dynamic concert content management, reducing deployment frequency for data changes
- **Integration**: Builds upon existing JWT authentication and Prisma database patterns
- **Problems Solved**: Eliminates need for direct database manipulation and enables self-service concert management

## What

User-visible behavior and technical requirements:

### Admin Interface
- Concert list view with edit/delete actions for each concert
- "Add New Concert" button to create concerts
- Modal or page-based forms for create/edit operations
- Success/error feedback messages for all operations
- Mobile-responsive design consistent with existing UI

### API Functionality
- POST `/api/concerts` - Create new concert (admin only)
- PUT `/api/concerts` - Update existing concert (admin only) 
- DELETE `/api/concerts?id={id}` - Logical deletion via isActive=false (admin only)
- Maintain existing GET functionality for backward compatibility

### Success Criteria

- [ ] Admin can create new concerts via web interface
- [ ] Admin can edit existing concert information
- [ ] Admin can deactivate concerts (logical deletion)
- [ ] All operations require admin authentication
- [ ] Form validation prevents invalid data submission
- [ ] Success/error feedback is provided for all operations
- [ ] Mobile interface remains functional and responsive

## All Needed Context

### Documentation & References

```yaml
# MUST READ - Include these in your context window
- file: src/app/api/practices/route.ts
  why: Perfect CRUD pattern template - exact structure to mirror for concerts API
  critical: Shows POST/PUT/DELETE with admin auth, validation, error handling

- file: src/middleware.ts
  why: JWT authentication pattern and admin role checking
  critical: Admin paths protection and auth token validation

- file: src/lib/auth.ts
  why: Token verification and authentication utilities
  critical: verifyToken function and JWTPayload interface

- file: src/components/features/auth/LoginForm.tsx
  why: Mantine form patterns, validation, error handling
  critical: Form state management, validation patterns, UI components

- file: src/types/concert.ts
  why: Concert type definitions and form data structure
  critical: ConcertFormData interface already defined

- file: prisma/schema.prisma
  why: Concert model definition and field requirements
  critical: Required fields (title, date, venue), isActive for logical deletion

- url: https://mantine.dev/form/use-form/
  why: Mantine form hook documentation for validation patterns

- url: https://www.prisma.io/docs/orm/prisma-client/client-extensions/middleware/soft-delete-middleware
  why: Prisma logical deletion best practices
```

### Current Codebase Tree (relevant sections)

```bash
src/
├── app/
│   ├── api/
│   │   ├── concerts/
│   │   │   └── route.ts          # GET only - needs POST/PUT/DELETE
│   │   └── practices/
│   │       └── route.ts          # PERFECT CRUD template to mirror
│   └── login/
│       └── page.tsx              # Authentication flow reference
├── components/
│   └── features/
│       └── auth/
│           └── LoginForm.tsx     # Mantine form pattern reference
├── lib/
│   ├── auth.ts                   # JWT utilities
│   ├── db.ts                     # Prisma client
│   └── seed-helpers.ts          # Database operation helpers
├── types/
│   ├── concert.ts               # Concert type definitions
│   └── auth.ts                  # Auth type definitions
└── middleware.ts                 # Route protection middleware
```

### Desired Codebase Tree with New Files

```bash
src/
├── app/
│   ├── admin/                    # NEW: Admin management pages
│   │   ├── concerts/
│   │   │   └── page.tsx         # Concert management interface
│   │   └── layout.tsx           # Admin layout wrapper
│   └── api/
│       └── concerts/
│           └── route.ts         # ENHANCED: Add POST/PUT/DELETE methods
├── components/
│   └── features/
│       └── admin/               # NEW: Admin-specific components
│           ├── ConcertForm.tsx  # Concert create/edit form
│           └── ConcertList.tsx  # Concert list with actions
└── lib/
    └── seed-helpers.ts          # ENHANCED: Add concert CRUD helpers
```

### Known Gotchas & Library Quirks

```typescript
// CRITICAL: Mantine Modal Manager doesn't support dynamic content
// Use internal state or modal component instead of modals manager
// From version 7.15.0+, can use modals.updateModal for dynamic updates

// CRITICAL: Prisma logical deletion pattern
// Must filter { isActive: true } in all queries to exclude deleted records
// Consider middleware for automatic filtering

// CRITICAL: Next.js API Route authentication pattern
// Always check admin role: payload.role !== "admin" returns 403
// Use request.cookies.get("auth-token")?.value for token extraction

// CRITICAL: Date handling in forms
// Convert string inputs to Date objects for Prisma: new Date(dateString)
// Validate date parsing: isNaN(date.getTime()) checks for invalid dates

// CRITICAL: Japanese comments requirement (from CLAUDE.md)
// All code comments must be in Japanese
// UI text should be in Japanese
```

## Implementation Blueprint

### Data Models and Structure

The Concert model already exists in Prisma schema with all required fields:

```typescript
// FROM: prisma/schema.prisma
model Concert {
  id       String   @id @default(cuid())
  title    String   // 演奏会タイトル - REQUIRED
  date     DateTime // 開催日 - REQUIRED  
  venue    String   // 開催場所 - REQUIRED
  isActive Boolean  @default(true) // 論理削除フラグ
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations cascade on delete
  attendanceForms AttendanceForm[]
  scores          Score[]
  practices       Practice[]
}

// FROM: src/types/concert.ts - Form data interface already defined
export interface ConcertFormData {
  title: string;
  date: string; // Form input as string
  venue: string;
  isActive: boolean;
}
```

### List of Tasks (Implementation Order)

```yaml
Task 1 - Enhanced API Routes:
MODIFY src/app/api/concerts/route.ts:
  - KEEP existing GET method functionality intact
  - ADD POST method for concert creation (admin only)
  - ADD PUT method for concert updates (admin only) 
  - ADD DELETE method for logical deletion (admin only)
  - MIRROR exact patterns from src/app/api/practices/route.ts
  - PRESERVE all auth checking: verifyToken + admin role validation

Task 2 - Database Helper Functions:
MODIFY src/lib/seed-helpers.ts:
  - ADD createConcertInDB(data: ConcertFormData)
  - ADD updateConcertInDB(id: string, data: Partial<ConcertFormData>)
  - ADD deleteConcertInDB(id: string) // Sets isActive = false
  - FOLLOW existing helper patterns in same file

Task 3 - Concert Form Component:
CREATE src/components/features/admin/ConcertForm.tsx:
  - USE Mantine useForm hook for state management
  - MIRROR form patterns from src/components/features/auth/LoginForm.tsx
  - VALIDATE required fields: title, date, venue
  - HANDLE create vs edit modes with single component
  - IMPLEMENT proper loading states and error handling

Task 4 - Concert List Component:
CREATE src/components/features/admin/ConcertList.tsx:
  - DISPLAY concerts in responsive list/table format
  - PROVIDE edit and delete actions for each concert
  - IMPLEMENT confirmation modal for delete operations
  - HANDLE loading and error states
  - USE existing Mantine components for consistency

Task 5 - Admin Layout and Pages:
CREATE src/app/admin/layout.tsx:
  - IMPLEMENT admin-only access protection
  - USE consistent styling with existing layouts

CREATE src/app/admin/concerts/page.tsx:
  - COMBINE ConcertList and ConcertForm components
  - MANAGE modal state for create/edit forms
  - HANDLE API calls and state updates
  - PROVIDE user feedback for all operations

Task 6 - Middleware Updates:
MODIFY src/middleware.ts:
  - ADD "/admin/concerts" to adminPaths array
  - ENSURE proper admin role enforcement
```

### Per Task Pseudocode

```typescript
// Task 1 - API Routes Enhancement
// CRITICAL: Mirror exact patterns from practices/route.ts

// POST /api/concerts - Create concert
export async function POST(request: NextRequest) {
  // PATTERN: Exact auth flow from practices API
  const token = request.cookies.get("auth-token")?.value;
  const payload = await verifyToken(token);
  if (!payload || payload.role !== "admin") {
    return NextResponse.json({ error: "管理者権限が必要です" }, { status: 403 });
  }

  // PATTERN: Extract and validate form data
  const { title, date, venue, isActive } = await request.json();
  if (!title || !date || !venue) {
    return NextResponse.json({ error: "必須項目が不足しています" }, { status: 400 });
  }

  // CRITICAL: Date parsing validation
  const concertDate = new Date(date);
  if (isNaN(concertDate.getTime())) {
    return NextResponse.json({ error: "有効な日付を入力してください" }, { status: 400 });
  }

  // PATTERN: Prisma create operation
  const newConcert = await prisma.concert.create({
    data: { title, date: concertDate, venue, isActive: isActive ?? true }
  });

  return NextResponse.json({ success: true, message: "演奏会を作成しました" });
}

// Task 3 - Concert Form Component
// CRITICAL: Mirror LoginForm.tsx patterns for Mantine usage

function ConcertForm({ concert, onSuccess, onCancel }) {
  // PATTERN: useForm hook with validation (from LoginForm)
  const form = useForm({
    initialValues: {
      title: concert?.title || "",
      date: concert?.date ? formatDateForInput(concert.date) : "",
      venue: concert?.venue || "",
      isActive: concert?.isActive ?? true
    },
    validate: {
      title: (value) => value.length < 1 ? "タイトルを入力してください" : null,
      date: (value) => !value ? "開催日を入力してください" : null,
      venue: (value) => value.length < 1 ? "開催場所を入力してください" : null
    }
  });

  const handleSubmit = async (values) => {
    // PATTERN: API call with loading state management
    setLoading(true);
    try {
      const method = concert ? 'PUT' : 'POST';
      const response = await fetch('/api/concerts', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(concert ? { ...values, concertId: concert.id } : values)
      });
      
      if (response.ok) {
        onSuccess();
      } else {
        const error = await response.json();
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };
}
```

### Integration Points

```yaml
MIDDLEWARE:
  - update: src/middleware.ts
  - pattern: "adminPaths = [...adminPaths, '/admin/concerts']"

DATABASE:
  - no migration needed: Concert model already complete
  - use existing: isActive field for logical deletion

ROUTES:
  - add: src/app/admin/concerts/page.tsx
  - protect: admin role required via middleware

UI_COMPONENTS:
  - pattern: Use existing Mantine components (Paper, Button, TextInput, etc.)
  - styling: Follow existing Tailwind patterns from LoginForm
```

## Validation Loop

### Level 1: Syntax & Style

```bash
# Run these FIRST - fix any errors before proceeding
npm run lint                    # Next.js linting with auto-fix
npx tsc --noEmit               # TypeScript compilation check

# Expected: No errors. If errors, READ the error and fix.
```

### Level 2: Manual Testing

```bash
# Start development server
npm run dev

# Test concert creation:
# 1. Navigate to http://localhost:3000/admin/concerts
# 2. Verify admin authentication is required
# 3. Create new concert via form
# 4. Verify concert appears in list
# 5. Test edit functionality
# 6. Test delete functionality (logical deletion)

# Expected: All CRUD operations work without errors
```

### Level 3: API Testing

```bash
# Test API endpoints directly
curl -X POST http://localhost:3000/api/concerts \
  -H "Content-Type: application/json" \
  -H "Cookie: auth-token=ADMIN_TOKEN" \
  -d '{"title": "Test Concert", "date": "2024-12-01T19:00:00Z", "venue": "Test Hall"}'

# Expected: {"success": true, "message": "演奏会を作成しました"}
```

## Final Validation Checklist

- [ ] All API methods (POST/PUT/DELETE) work correctly: `curl test all endpoints`
- [ ] Admin authentication is enforced: `test without admin token`
- [ ] Form validation prevents invalid submissions: `test empty fields`
- [ ] Logical deletion works (isActive=false): `verify deleted concerts hidden`
- [ ] UI is mobile-responsive: `test on mobile viewport`
- [ ] Error handling provides useful feedback: `test invalid data submission`
- [ ] Loading states work properly: `verify loading indicators`
- [ ] Success messages appear after operations: `test all CRUD operations`
- [ ] No linting errors: `npm run lint`
- [ ] TypeScript compilation succeeds: `npx tsc --noEmit`
- [ ] Existing functionality unaffected: `test existing concert list/detail views`

## Anti-Patterns to Avoid

- ❌ Don't create new auth patterns - use existing JWT middleware
- ❌ Don't skip admin role validation - always check payload.role
- ❌ Don't physically delete records - use isActive=false
- ❌ Don't ignore form validation - validate both client and server side
- ❌ Don't break mobile responsiveness - test on mobile viewports
- ❌ Don't hardcode strings - use proper Japanese error messages
- ❌ Don't forget loading states - provide user feedback during operations
- ❌ Don't ignore TypeScript errors - fix all type issues

---

**Confidence Score: 9/10** - This PRP provides comprehensive context, exact patterns to follow, and clear validation steps for successful one-pass implementation. The practices API provides a perfect CRUD template, and all necessary authentication/UI patterns are well-established in the codebase.