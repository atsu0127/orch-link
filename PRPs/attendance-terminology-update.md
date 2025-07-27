# PRP: Attendance Terminology Update

## Goal

Update terminology from "出欠フォーム" (attendance form) to "出欠調整" (attendance coordination) throughout the Orch Link application to accurately reflect that these are external links to coordination apps, not actual forms within the application. This terminology change will improve user clarity about being redirected to external services like Google Forms or Microsoft Forms.

## Issue Link

https://github.com/atsu0127/orch-link/issues/3

## Why

- **User Clarity**: The current term "出欠フォーム" (attendance form) implies the form exists within the application, causing confusion when users are redirected to external services
- **Accurate Expectation Setting**: "出欠調整" (attendance coordination) more accurately describes the function of coordinating attendance through external tools
- **Reduced Support Inquiries**: Clear terminology reduces user confusion and potential support questions about why they're being redirected
- **Professional Communication**: More precise language enhances the professional appearance of the application

## What

Update all instances of "出欠フォーム" to "出欠調整" across the entire codebase while maintaining existing functionality. This includes:

- UI components and text
- Type definitions and interfaces
- Comments and documentation
- Database schema comments
- API endpoint documentation
- Mock data and seed files

### Success Criteria

- [ ] All 32+ instances of "出欠フォーム" are updated to "出欠調整"
- [ ] Application functionality remains unchanged
- [ ] All tests pass after terminology update
- [ ] Documentation reflects new terminology
- [ ] Build and lint processes complete successfully
- [ ] UI displays new terminology consistently across all tabs and components

## All Needed Context

### Documentation & References

```yaml
# MUST READ - Include these in your context window
- file: src/components/features/attendance/AttendanceTab.tsx
  why: Primary UI component displaying the terminology, contains multiple instances and user-facing text

- file: src/types/index.ts
  why: Type definitions and comments that need updating for consistency

- file: docs/screen_design.md
  why: Documentation that needs to reflect new terminology for future development

- file: src/app/api/attendance/route.ts
  why: API comments and documentation strings that reference the terminology

- file: prisma/schema.prisma
  why: Database schema comments that should align with new terminology

- file: CLAUDE.md
  why: Project guidelines specifying all code comments should be in Japanese

- url: https://www.nngroup.com/articles/consistency-and-standards/
  why: Best practices for maintaining UI/UX consistency during terminology updates
  critical: Consistency in terminology prevents user confusion and cognitive load
```

### Current Codebase Tree

```bash
.
├── src
│   ├── components
│   │   ├── features
│   │   │   └── attendance/AttendanceTab.tsx (8 instances)
│   │   └── layout
│   │       └── Navigation.tsx (2 instances)
│   ├── app
│   │   └── api
│   │       └── attendance/route.ts (5 instances)
│   ├── types
│   │   └── index.ts (1 instance + comments)
│   └── lib
│       ├── mock-data.ts (2 instances)
│       └── seed-helpers.ts (1 instance)
├── docs
│   ├── screen_design.md (4 instances)
│   └── requirements.md (1 instance)
├── prisma
│   ├── schema.prisma (1 instance)
│   └── seed.ts (3 instances)
└── PRPs
    └── sqlite-mock-migration.md (1 instance)
```

### Desired Codebase Tree - No New Files

All files remain the same structure - only terminology within existing files will be updated.

### Known Gotchas of Codebase & Library Quirks

```typescript
// CRITICAL: All code comments must be in Japanese per CLAUDE.md guidelines
// CRITICAL: Next.js with App Router - ensure no functional changes to routing
// CRITICAL: Prisma schema - only update comments, not table/field names
// CRITICAL: TypeScript interfaces - maintain exact same structure and field names
// CRITICAL: Mock data must remain functionally identical for testing
// CRITICAL: External URLs and functional behavior must remain unchanged
```

## Implementation Blueprint

### Data Models and Structure

The core data structure remains unchanged. Only comments and user-facing text are updated:

```typescript
// BEFORE:
// 出欠フォーム型定義
export interface AttendanceForm {
  // AFTER:
// 出欠調整型定義
export interface AttendanceForm {
  // Field names and structure remain identical
  // Only comments and descriptions change
}
```

### List of Tasks to Complete in Order

```yaml
Task 1: Update Core Component Files
MODIFY src/components/features/attendance/AttendanceTab.tsx:
  - FIND pattern: "出欠フォーム"
  - REPLACE with: "出欠調整"
  - PRESERVE all functional logic and component structure
  - UPDATE 8 instances including JSX text and comments

MODIFY src/components/layout/Navigation.tsx:
  - FIND pattern: "出欠フォーム"
  - REPLACE with: "出欠調整"
  - PRESERVE navigation functionality
  - UPDATE 2 instances in tab labels

Task 2: Update Type Definitions and API
MODIFY src/types/index.ts:
  - FIND pattern: "// 出欠フォーム型定義"
  - REPLACE with: "// 出欠調整型定義"
  - PRESERVE interface structure completely
  - UPDATE only comment line

MODIFY src/app/api/attendance/route.ts:
  - FIND pattern: "出欠フォーム"
  - REPLACE with: "出欠調整"
  - PRESERVE all API functionality and endpoints
  - UPDATE 5 instances in comments and console.log messages

Task 3: Update Data Layer
MODIFY src/lib/mock-data.ts:
  - FIND pattern: "// 出欠フォームモックデータ"
  - REPLACE with: "// 出欠調整モックデータ"
  - PRESERVE mock data structure and values
  - UPDATE 2 instances in comments

MODIFY src/lib/seed-helpers.ts:
  - FIND pattern: "特定演奏会の出欠フォーム取得"
  - REPLACE with: "特定演奏会の出欠調整取得"
  - PRESERVE function logic completely
  - UPDATE 1 instance in function comment

Task 4: Update Database Schema
MODIFY prisma/schema.prisma:
  - FIND pattern: "// 出欠フォームモデル"
  - REPLACE with: "// 出欠調整モデル"
  - PRESERVE all model definitions and field names
  - UPDATE only comment line

MODIFY prisma/seed.ts:
  - FIND pattern: "出欠フォーム"
  - REPLACE with: "出欠調整"
  - PRESERVE seed data functionality
  - UPDATE 3 instances in console.log messages

Task 5: Update Documentation
MODIFY docs/screen_design.md:
  - FIND pattern: "出欠フォーム"
  - REPLACE with: "出欠調整"
  - PRESERVE document structure
  - UPDATE 4 instances including section headers

MODIFY docs/requirements.md:
  - FIND pattern: "出欠フォーム"
  - REPLACE with: "出欠調整"
  - PRESERVE requirements content
  - UPDATE 1 instance

Task 6: Update Planning Documents
MODIFY PRPs/sqlite-mock-migration.md:
  - FIND pattern: "出欠フォーム"
  - REPLACE with: "出欠調整"
  - PRESERVE technical content
  - UPDATE 1 instance in comment

Task 7: Validate Consistency
RUN comprehensive grep search:
  - SEARCH for any remaining "出欠フォーム" instances
  - VERIFY all instances have been updated
  - ENSURE no instances were missed
```

### Per Task Pseudocode

```typescript
// Task 1: Component Updates
// PATTERN: Preserve all React component logic, only update display text
function updateAttendanceTab() {
  // CRITICAL: Maintain all state management and event handlers
  // CRITICAL: Preserve Tailwind CSS classes and responsive design
  // CRITICAL: Keep external link functionality identical
  // Example replacement pattern:
  // OLD: <Title order={3}>出欠フォーム</Title>
  // NEW: <Title order={3}>出欠調整</Title>
  // GOTCHA: Ensure mobile-responsive design remains intact
  // GOTCHA: Preserve all accessibility attributes
}

// Task 2: Type Definition Updates
// PATTERN: Only update comments, never change interface structure
function updateTypeDefinitions() {
  // CRITICAL: Interface AttendanceForm field names MUST remain identical
  // CRITICAL: Only update JSDoc style comments
  // CRITICAL: Maintain exact TypeScript typing
  // GOTCHA: Do not change any field names or types
  // GOTCHA: Export statements remain unchanged
}

// Task 3-6: Data and Documentation Updates
// PATTERN: Update text/comments only, preserve all functionality
function updateDataAndDocs() {
  // CRITICAL: Mock data values and structure unchanged
  // CRITICAL: Database queries and operations unchanged
  // CRITICAL: API endpoints and responses unchanged
  // GOTCHA: Prisma schema field names must not change
  // GOTCHA: Seed data functionality must remain identical
}
```

### Integration Points

```yaml
DATABASE:
  - schema: No migration needed - only comments updated
  - queries: All existing queries remain functional
  - relationships: AttendanceForm relationships unchanged

CONFIG:
  - no config changes needed
  - environment variables unchanged

ROUTES:
  - /api/attendance endpoints remain identical
  - response structure unchanged
  - authentication/authorization unchanged

UI/UX:
  - component hierarchy unchanged
  - styling and responsive design preserved
  - user interactions remain identical
  - external link behavior unchanged
```

## Validation Loop

### Level 1: Syntax & Style

```bash
# Run these FIRST - fix any errors before proceeding
npm run lint                    # ESLint checking
npm run type-check             # TypeScript compilation check
npx prisma validate            # Prisma schema validation

# Expected: No errors. If errors exist, read the error message and fix.
```

### Level 2: Build and Development Server

```bash
# Test that application builds successfully
npm run build

# Test that development server starts without issues
npm run dev

# Expected: Clean build and server startup with no errors
# If errors: Check console output for specific error details
```

### Level 3: Functionality Test

```bash
# Start the development server
npm run dev

# Manual testing checklist:
# 1. Navigate to attendance tab - verify new terminology displays
# 2. Check that external links still work correctly
# 3. Verify mobile responsive design is intact
# 4. Confirm no JavaScript console errors
# 5. Validate that all text consistently uses new terminology

# Expected: All functionality works identically with new terminology
# If issues: Check browser developer tools for errors
```

### Level 4: Comprehensive Terminology Verification

```bash
# Search for any remaining old terminology
grep -r "出欠フォーム" src/ docs/ prisma/ PRPs/ --exclude-dir=node_modules

# Expected: No results (all instances updated)
# If results found: Update the remaining instances

# Search for consistency of new terminology
grep -r "出欠調整" src/ docs/ prisma/ PRPs/ --exclude-dir=node_modules

# Expected: All instances where terminology should appear
```

## Final Validation Checklist

- [ ] All instances of "出欠フォーム" updated to "出欠調整": `grep -r "出欠フォーム" src/ docs/ prisma/ PRPs/`
- [ ] No linting errors: `npm run lint`
- [ ] No TypeScript errors: `npm run type-check`
- [ ] Application builds successfully: `npm run build`
- [ ] Development server starts: `npm run dev`
- [ ] Manual test: Navigation to attendance tab displays new terminology
- [ ] Manual test: External links function correctly
- [ ] Manual test: Mobile responsive design intact
- [ ] Documentation updated consistently
- [ ] Issue #3 updated with completion status
- [ ] All functional behavior unchanged
- [ ] Pull Request is created

## Anti-Patterns to Avoid

- ❌ Don't change any field names in TypeScript interfaces
- ❌ Don't modify database table or column names
- ❌ Don't alter API endpoint URLs or response structures
- ❌ Don't change mock data values or structure
- ❌ Don't modify external URL functionality
- ❌ Don't introduce new dependencies for this terminology change
- ❌ Don't skip comprehensive testing after updates
- ❌ Don't update English documentation - focus on Japanese terminology only

---

## Confidence Score: 9/10

**High confidence for one-pass implementation success due to:**

- Clear, well-defined scope (terminology only, no functional changes)
- Comprehensive mapping of all instances requiring updates
- Detailed validation steps to ensure nothing is missed
- Existing codebase patterns are well-established and consistent
- No complex integration requirements
- Straightforward find-and-replace pattern with clear guidelines

**Minor risk factors:**

- Ensuring absolutely no functional changes occur during updates
- Comprehensive testing across all affected components
