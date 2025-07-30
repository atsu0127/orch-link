name: "Practice Schedule Enhancements - Start/End Times, Address, Video Support"
description: |

## Goal

Enhance the practice schedule functionality by separating start/end times, adding address fields, and supporting video recordings. Transform the current single-date practice system into a more detailed schedule with time ranges, location details, and multimedia content support.

## Issue Link

https://github.com/atsu0127/orch-link/issues/5

## Why

- **User Value**: Musicians need precise timing information (start/end) to plan their schedules effectively
- **Location Clarity**: Address information helps extras find practice venues easily
- **Content Richness**: Video recordings alongside audio provide comprehensive practice reference materials
- **Mobile-First Design**: Better time display on mobile devices (primary use case)
- **Integration**: Seamlessly extends existing practice management without breaking current functionality

## What

Transform practice schedules from single-time entries to detailed time-ranged sessions with enhanced location and media support.

### Success Criteria

- [ ] Practice schedules display start and end times (e.g., "10:00 - 12:00")
- [ ] Address field is available for all practice venues (optional free text)
- [ ] Video URL field supports recording links alongside existing audio
- [ ] Existing data migrates without loss (date → startTime)
- [ ] Mobile-responsive display of new time and location information
- [ ] API validates time ranges (endTime > startTime when provided)
- [ ] Japanese localization maintained throughout

## All Needed Context

### Documentation & References

```yaml
# Database Migration Patterns
- url: https://www.prisma.io/docs/orm/prisma-migrate/workflows/customizing-migrations
  why: Adding optional fields to existing tables with data
  critical: Use optional fields first, then make required in subsequent migration

- url: https://www.prisma.io/docs/orm/prisma-migrate/workflows/data-migration
  why: Handling data transformation during schema changes
  section: "Migrating existing data"

# API Validation Best Practices  
- url: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
  why: App Router API patterns and TypeScript integration
  section: "Request Body Validation"

- url: https://dub.co/blog/zod-api-validation
  why: Zod validation patterns for Next.js App Router (industry standard)
  critical: Schema validation prevents runtime errors and improves type safety

# Date/Time Components and Localization
- url: https://mantine.dev/dates/time-input/
  why: Time input components for admin interface (future enhancement)
  
- url: https://mantine.dev/dates/getting-started/
  why: Japanese locale setup with dayjs for consistent date formatting
  section: "DatesProvider configuration"

# Project-Specific Patterns
- file: src/app/api/practices/route.ts
  why: Existing API patterns, validation, and error handling to mirror

- file: src/components/features/practices/PracticesList.tsx
  why: Current display patterns and mobile-responsive design approach

- file: src/components/features/practices/PracticeDetail.tsx
  why: Detail view structure and Japanese text patterns

- file: src/lib/mock-data.ts
  why: Date formatting utilities (formatDate) and mock data patterns

- file: prisma/schema.prisma
  why: Current Practice model structure and naming conventions
```

### Current Codebase Tree

```bash
src/
├── app/api/practices/route.ts           # API endpoints with JWT auth patterns
├── components/features/practices/
│   ├── PracticesList.tsx               # List view with time filtering
│   └── PracticeDetail.tsx              # Detail view with audio support
├── lib/
│   ├── mock-data.ts                    # formatDate utility and mock patterns
│   └── seed-helpers.ts                 # Database helpers and date formatting
├── types/index.ts                      # Practice interface definition
prisma/
├── schema.prisma                       # Practice model with current single date field
└── migrations/                         # Existing migration structure
```

### Desired Codebase Tree

```bash
# No new files needed - enhancing existing structure
prisma/migrations/[timestamp]_add_practice_time_fields/
└── migration.sql                       # New fields: startTime, endTime, address, videoUrl

src/types/index.ts                      # Updated Practice interface
src/lib/mock-data.ts                    # Enhanced mock data with new fields
src/lib/seed-helpers.ts                 # Updated formatters for time ranges
src/app/api/practices/route.ts          # Enhanced validation for new fields
src/components/features/practices/
├── PracticesList.tsx                   # Time range display (10:00-12:00)
└── PracticeDetail.tsx                  # Address and video URL display
```

### Known Gotchas & Critical Patterns

```typescript
// CRITICAL: Japanese date formatting pattern (from src/lib/mock-data.ts)
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

// CRITICAL: Date validation pattern (from src/app/api/practices/route.ts)
const practiceDate = new Date(date);
if (isNaN(practiceDate.getTime())) {
  return NextResponse.json(
    { error: "有効な日時を入力してください" },
    { status: 400 }
  );
}

// GOTCHA: Prisma DateTime vs Date handling
// Database stores DateTime, but frontend works with Date objects
// Always convert: new Date(dbDateTime) when fetching

// GOTCHA: Mobile-first responsive design (from existing components)
// Use Tailwind responsive utilities and Mantine responsive props
// All text should be in Japanese as per CLAUDE.md requirements

// CRITICAL: JWT Auth pattern (from existing API routes)
const token = request.cookies.get("auth-token")?.value;
const payload = await verifyToken(token);
if (!payload) return NextResponse.json({error: "認証が必要です"}, {status: 401});

// GOTCHA: SQLite DateTime storage format
// Stored as: "2025-12-15T13:00:00.000Z"
// Ensure timezone consistency between startTime and endTime
```

## Implementation Blueprint

### Data Model Enhancement

Extend the Practice model to support time ranges and enhanced location data:

```typescript
// Current model (prisma/schema.prisma)
model Practice {
  date      DateTime  // Single timestamp - BECOMES startTime
  venue     String    // Venue name only - ENHANCED with address
  audioUrl  String?   // Audio recording - ENHANCED with video
}

// Enhanced model
model Practice {
  startTime DateTime  // Renamed from 'date' 
  endTime   DateTime? // Optional end time
  venue     String    // Practice venue name (unchanged)
  address   String?   // Venue address (free text, optional)
  audioUrl  String?   // Audio recording URL (unchanged)
  videoUrl  String?   // Video recording URL (new)
}
```

### Implementation Tasks (Sequential Order)

```yaml
Task 1: Database Schema Migration
MODIFY prisma/schema.prisma:
  - ADD startTime DateTime field
  - ADD endTime DateTime? field (optional)
  - ADD address String? field (optional) 
  - ADD videoUrl String? field (optional)
  - KEEP existing date field temporarily for migration
  
CREATE migration file:
  - RENAME date column to startTime
  - ADD new optional columns with NULL defaults
  - ENSURE no data loss during migration

Task 2: TypeScript Interface Updates
MODIFY src/types/index.ts:
  - UPDATE Practice interface with new fields
  - MAINTAIN backward compatibility during transition
  - ADD JSDoc comments in Japanese for new fields

Task 3: Mock Data and Utilities Enhancement  
MODIFY src/lib/mock-data.ts:
  - UPDATE mock practice data with startTime/endTime examples
  - ADD formatTimeRange utility function
  - PRESERVE existing formatDate function for compatibility

MODIFY src/lib/seed-helpers.ts:
  - UPDATE database helper functions for new fields
  - ADD time range formatting utilities
  - MAINTAIN existing function signatures

Task 4: API Route Validation Enhancement
MODIFY src/app/api/practices/route.ts:
  - ADD validation for startTime/endTime relationship
  - ADD address and videoUrl validation
  - PRESERVE existing authentication patterns
  - ADD proper error messages in Japanese

Task 5: Frontend Component Updates
MODIFY src/components/features/practices/PracticesList.tsx:
  - UPDATE time display to show range format
  - MAINTAIN existing mobile-responsive design
  - PRESERVE current filtering logic (past/upcoming)

MODIFY src/components/features/practices/PracticeDetail.tsx:
  - ADD address display section
  - ADD video player section alongside audio
  - MAINTAIN existing UI patterns and Japanese text
  - HANDLE empty endTime/address/videoUrl gracefully

Task 6: Database Migration Execution
RUN migration commands:
  - npx prisma migrate dev --name practice_time_enhancements
  - UPDATE seed data with new field examples
  - VERIFY data integrity post-migration
```

### Per Task Pseudocode

```typescript
// Task 1: Database Schema (prisma/schema.prisma)
model Practice {
  id        String    @id @default(cuid())
  concertId String
  title     String    // 練習タイトル
  startTime DateTime  // 開始日時 (renamed from date)
  endTime   DateTime? // 終了日時 (optional)
  venue     String    // 練習場所
  address   String?   // 住所 (optional)
  items     String?   // 持ち物
  notes     String?   // 注意事項  
  memo      String?   // メモ
  audioUrl  String?   // 関連録音URL
  videoUrl  String?   // 関連録画URL (new)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  concert Concert @relation(fields: [concertId], references: [id], onDelete: Cascade)
  @@map("practices")
}

// Task 2: TypeScript Interface (src/types/index.ts)
export interface Practice {
  id: string;
  concertId: string;
  title: string; // 練習タイトル
  startTime: Date; // 開始日時
  endTime?: Date; // 終了日時（オプション）
  venue: string; // 練習場所
  address?: string; // 住所（オプション）
  items?: string; // 持ち物
  notes?: string; // 注意事項
  memo?: string; // メモ
  audioUrl?: string; // 関連録音URL
  videoUrl?: string; // 関連録画URL
  updatedAt: Date; // 最終更新日時
}

// Task 3: Time Range Formatting (src/lib/mock-data.ts)
// PATTERN: Follow existing formatDate structure
export function formatTimeRange(startTime: Date, endTime?: Date): string {
  const timeFormat = new Intl.DateTimeFormat('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
  });
  
  const start = timeFormat.format(startTime);
  if (!endTime) return start;
  
  const end = timeFormat.format(endTime);
  return `${start} - ${end}`;
}

// Task 4: API Validation (src/app/api/practices/route.ts)
// PATTERN: Follow existing validation approach
const startTime = new Date(body.startTime);
if (isNaN(startTime.getTime())) {
  return NextResponse.json(
    { error: "有効な開始時間を入力してください" },
    { status: 400 }
  );
}

if (body.endTime) {
  const endTime = new Date(body.endTime);
  if (isNaN(endTime.getTime()) || endTime <= startTime) {
    return NextResponse.json(
      { error: "終了時間は開始時間より後に設定してください" },
      { status: 400 }
    );
  }
}

// Task 5: Frontend Time Display (PracticesList.tsx)
// PATTERN: Follow existing Group/Text structure
<Group gap="sm">
  <IconClock size="1rem" className="text-gray-500" />
  <Text size="sm" className="text-gray-700">
    {practice.endTime 
      ? formatTimeRange(practice.startTime, practice.endTime)
      : formatDate(practice.startTime)
    }
  </Text>
</Group>
```

### Integration Points

```yaml
DATABASE:
  - migration: "ADD startTime, endTime, address, videoUrl to practices table"
  - strategy: "Rename date to startTime, add optional fields"
  - compatibility: "Maintain data integrity during transition"

API_VALIDATION:
  - pattern: "Extend existing JWT auth and error handling"
  - add: "Time range validation (endTime > startTime)"
  - maintain: "Japanese error messages and response format"

FRONTEND:
  - extend: "Existing mobile-responsive Mantine components"
  - pattern: "Follow PracticeDetail audio section for video section"
  - localization: "All new text in Japanese as per CLAUDE.md"

UTILITIES:
  - add: "formatTimeRange function to mock-data.ts"
  - maintain: "Existing formatDate function for backward compatibility" 
  - pattern: "Use Intl.DateTimeFormat with 'ja-JP' locale"
```

## Validation Loop

### Level 1: Syntax & Style

```bash
# CRITICAL: Run these first to catch syntax/style issues
npm run lint                            # Next.js ESLint validation
npx tsc --noEmit                       # TypeScript compilation check

# Expected: No errors. If errors exist, read and fix before proceeding.
```

### Level 2: Database Validation

```bash
# Verify migration creates correctly
npx prisma migrate dev --name practice_time_enhancements --create-only
# Review the generated SQL file before applying

# Apply migration and verify schema
npx prisma migrate dev
npx prisma db push                     # Sync schema to development database

# Verify seed data works with new fields
npx prisma db seed

# Expected: Migration applies cleanly, seed data populates new fields
```

### Level 3: API Integration Test

```bash
# Start development server
npm run dev

# Test practice creation with new fields (using curl or API testing tool)
curl -X POST http://localhost:3000/api/practices \
  -H "Content-Type: application/json" \
  -H "Cookie: auth-token=YOUR_TEST_TOKEN" \
  -d '{
    "concertId": "concert-1",
    "title": "テスト練習",
    "startTime": "2025-12-15T10:00:00",
    "endTime": "2025-12-15T12:00:00",
    "venue": "テスト会場",
    "address": "東京都渋谷区テスト1-1-1"
  }'

# Expected: 
# - Success response for valid data
# - Proper validation errors for invalid time ranges
# - Japanese error messages
```

### Level 4: Frontend Visual Validation

```bash
# Access practice list in browser
# Navigate to http://localhost:3000 after logging in
# Check practice detail views

# Verify:
# - Time ranges display correctly (e.g., "10:00 - 12:00")
# - Address information appears when present
# - Empty endTime displays single time gracefully
# - Mobile responsive design maintained
# - All text appears in Japanese
```

## Final Validation Checklist

- [ ] Migration applies without data loss: `npx prisma migrate dev`
- [ ] No TypeScript errors: `npx tsc --noEmit`
- [ ] No linting errors: `npm run lint`
- [ ] API accepts new fields and validates time ranges correctly
- [ ] Frontend displays time ranges in Japanese locale format
- [ ] Address field displays when present, hidden when empty
- [ ] Video URL field works alongside existing audio URL
- [ ] Mobile responsive design maintained
- [ ] Existing practice data displays correctly (backward compatibility)
- [ ] All new text and error messages in Japanese
- [ ] Issue #5 requirements fully satisfied

---

## Anti-Patterns to Avoid

- ❌ Don't remove the existing date field until migration is fully tested
- ❌ Don't skip time range validation (endTime must be after startTime)
- ❌ Don't hardcode time formats - use existing Intl.DateTimeFormat pattern
- ❌ Don't ignore mobile responsiveness requirements  
- ❌ Don't add English text - maintain Japanese localization
- ❌ Don't break existing audio URL functionality when adding video
- ❌ Don't change authentication patterns - follow existing JWT approach
- ❌ Don't skip migration testing on development database first

## Confidence Score: 9/10

This PRP provides comprehensive context including:
✅ Specific file patterns from codebase analysis
✅ External documentation URLs with critical sections identified  
✅ Database migration best practices with gotcha awareness
✅ Sequential implementation tasks with clear dependencies
✅ Executable validation commands for each phase
✅ Mobile-first and Japanese localization requirements preserved
✅ Backward compatibility strategy for existing data

The implementation should succeed in one pass with this level of detail and context.