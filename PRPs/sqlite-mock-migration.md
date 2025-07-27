name: "SQLite Mock Data Migration PRP - Orchestra Portal"
description: |

## Purpose
Migrate Orch Link orchestra portal from mock data to SQLite database for local development while maintaining full functionality. The application already has Prisma setup and database schemas, but APIs currently use static mock data instead of database operations.

## Core Principles
1. **Context is King**: All necessary Prisma patterns, existing code examples, and database schemas included
2. **Validation Loops**: Executable commands to verify migrations, data integrity, and API functionality
3. **Information Dense**: Uses existing Japanese codebase patterns and maintains code style consistency
4. **Progressive Success**: Seed database first, then migrate API routes one by one
5. **Global rules**: Follow all rules in CLAUDE.md - write all comments and variable names in Japanese

---

## Goal
Replace mock data usage in all API routes with actual SQLite database operations using the existing Prisma setup, ensuring seamless transition while maintaining all current functionality.

## Why
- **Development Consistency**: Use real database operations even in local development to match production behavior
- **Data Persistence**: Enable data persistence across application restarts for better development experience
- **Production Readiness**: Prepare codebase for Phase 2 migration to PostgreSQL on GCP
- **Testing Infrastructure**: Enable comprehensive integration testing with real database operations

## What
Transform all API routes from mock data arrays to Prisma database operations while maintaining identical response formats and behavior.

### Success Criteria
- [ ] Database populated with equivalent data from mock-data.ts
- [ ] All API routes (concerts, practices, scores, attendance, contact) use Prisma instead of mock data
- [ ] Response formats remain identical to maintain frontend compatibility
- [ ] All CRUD operations work correctly (GET, POST, PUT, DELETE)
- [ ] Database relationships and constraints are properly enforced
- [ ] Seeding mechanism in place for consistent development environment

## All Needed Context

### Documentation & References
```yaml
# MUST READ - Include these in your context window
- url: https://www.prisma.io/docs/orm/prisma-migrate/workflows/development-and-production
  why: Development workflow patterns for SQLite database operations
  
- url: https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding
  why: Database seeding best practices and script configuration
  
- file: src/lib/mock-data.ts
  why: Current mock data structure and utility functions to replicate in database
  
- file: src/lib/db.ts
  why: Existing Prisma client configuration with singleton pattern
  
- file: prisma/schema.prisma
  why: Database schema definitions matching mock data structure
  
- file: src/app/api/concerts/route.ts
  why: Current API pattern using mock data - template for database migration
  
- file: src/app/api/practices/route.ts
  why: CRUD operations pattern with authentication - shows full API structure
  
- critical: Prisma supports SQLite auto-creation when database file doesn't exist
  section: Database connection and migration commands
```

### Current Codebase tree (relevant sections)
```bash
src/
├── lib/
│   ├── db.ts              # Prisma client singleton setup
│   └── mock-data.ts       # Current mock data to migrate
├── app/api/
│   ├── concerts/route.ts  # Mock data usage example
│   ├── practices/route.ts # Full CRUD with mock data
│   ├── scores/route.ts    # Mock data with validation
│   ├── attendance/route.ts # Mock data usage
│   └── contact/route.ts   # Mock data usage
prisma/
├── schema.prisma          # Database schema (SQLite)
├── dev.db                 # Existing SQLite database
└── migrations/            # Migration files
```

### Desired Codebase tree with files to be added
```bash
prisma/
└── seed.ts               # Database seeding script (NEW)
package.json              # Add seed script configuration (MODIFY)
src/
├── lib/
│   ├── db.ts            # Keep existing Prisma setup
│   ├── mock-data.ts     # Keep for reference/types (DELETE)
│   └── seed-helpers.ts  # Utility functions for seeding (NEW)
```

### Known Gotchas of our codebase & Library Quirks
```typescript
// CRITICAL: Prisma client is already configured as singleton for development
// Pattern: Always use existing prisma instance from src/lib/db.ts

// CRITICAL: All API routes expect Japanese error messages
// Pattern: Maintain existing error message format

// CRITICAL: Mock data includes nested relationships (scores with comments)
// Gotcha: Prisma requires separate create operations for nested data

// CRITICAL: Date handling - mock data uses JavaScript Date objects
// Pattern: Prisma auto-handles Date serialization but validate input dates

// CRITICAL: Authentication middleware expects JWT verification
// Pattern: Keep existing auth patterns, only change data source

// CRITICAL: Response format must remain identical
// Pattern: Maintain { success: true, data: {...} } response structure
```

## Implementation Blueprint

### Data models and structure
The existing Prisma schema already matches mock data structure:
```typescript
// 演奏会 (Concerts) - main entity
// 出欠調整 (AttendanceForms) - linked to concerts
// 楽譜 (Scores) - linked to concerts
// 楽譜コメント (ScoreComments) - linked to scores  
// 練習予定 (Practices) - linked to concerts
// 連絡先情報 (ContactInfo) - standalone
```

### List of tasks to be completed to fulfill the PRP in the order they should be completed

```yaml
Task 1: Configure Database Seeding
MODIFY package.json:
  - ADD "prisma" configuration with seed script
  - PATTERN: "seed": "ts-node --transpile-only prisma/seed.ts"

CREATE prisma/seed.ts:
  - IMPORT existing mock data from src/lib/mock-data.ts
  - TRANSFORM mock data to Prisma create operations
  - HANDLE nested relationships (concerts -> scores -> comments)
  - IMPLEMENT deleteMany() for idempotent seeding

Task 2: Create Seeding Helper Functions
CREATE src/lib/seed-helpers.ts:
  - EXTRACT data transformation logic from mock-data.ts
  - CREATE helper functions for each entity type
  - ENSURE proper foreign key relationships

Task 3: Migrate Concerts API
MODIFY src/app/api/concerts/route.ts:
  - REPLACE mockConcerts imports with prisma calls
  - FIND pattern: "import { mockConcerts, getActiveConcerts, getConcertData }" 
  - REPLACE with: "import { prisma } from '@/lib/db'"
  - CONVERT getConcertData() to Prisma queries with include
  - PRESERVE existing response format

Task 4: Migrate Practices API  
MODIFY src/app/api/practices/route.ts:
  - REPLACE mockPractices with prisma.practice operations
  - CONVERT GET operations to findMany with proper filtering
  - CONVERT POST operations to prisma.practice.create
  - CONVERT PUT operations to prisma.practice.update
  - CONVERT DELETE operations to prisma.practice.delete
  - MAINTAIN existing validation and auth patterns

Task 5: Migrate Scores API
MODIFY src/app/api/scores/route.ts:
  - REPLACE mockScores with prisma.score operations
  - HANDLE score comments relationship with include
  - CONVERT CRUD operations to Prisma equivalents
  - PRESERVE nested comment creation logic

Task 6: Migrate Attendance API
MODIFY src/app/api/attendance/route.ts:
  - REPLACE mock data with prisma.attendanceForm operations
  - MAINTAIN concert relationship filtering

Task 7: Migrate Contact API
MODIFY src/app/api/contact/route.ts:
  - REPLACE mock data with prisma.contactInfo operations
  - HANDLE single contact info retrieval pattern
```

### Per task pseudocode as needed

```typescript
// Task 1: prisma/seed.ts
async function main() {
  // PATTERN: Clear existing data first for idempotency
  await prisma.scoreComment.deleteMany({})
  await prisma.score.deleteMany({})
  await prisma.practice.deleteMany({})
  await prisma.attendanceForm.deleteMany({})
  await prisma.concert.deleteMany({})
  await prisma.contactInfo.deleteMany({})
  
  // CRITICAL: Create in dependency order (parent before child)
  const concerts = await prisma.concert.createMany({ data: mockConcerts })
  const attendanceForms = await prisma.attendanceForm.createMany({ data: mockAttendanceForms })
  // ... etc for each entity
}

// Task 3: concerts/route.ts migration pattern
// BEFORE: const concerts = activeOnly ? getActiveConcerts() : mockConcerts;
// AFTER:
const concerts = await prisma.concert.findMany({
  where: activeOnly ? { isActive: true } : {},
  orderBy: { updatedAt: 'desc' }
})

// BEFORE: const concertData = getConcertData(concertId);
// AFTER:
const concertData = await prisma.concert.findUnique({
  where: { id: concertId },
  include: {
    attendanceForms: true,
    scores: {
      include: { comments: { orderBy: { createdAt: 'desc' } } }
    },
    practices: { orderBy: { date: 'asc' } }
  }
})
```

### Integration Points
```yaml
DATABASE:
  - migration: "Database already exists with proper schema"
  - seeding: "Run prisma db seed to populate with mock data"
  
AUTHENTICATION:
  - preserve: "Keep all JWT authentication middleware unchanged"
  - pattern: "Maintain existing token verification in all routes"
  
RESPONSE_FORMAT:
  - maintain: "Keep { success: true, data: ... } response structure"
  - critical: "Frontend expects exact same response format"

ERROR_HANDLING:
  - preserve: "Keep existing Japanese error messages"
  - pattern: "Handle Prisma errors and convert to user-friendly messages"
```

## Validation Loop

### Level 1: Database Setup & Seeding
```bash
# Generate Prisma client (if needed)
npx prisma generate

# Reset database and run seeding
npx prisma migrate reset --force

# Verify seeding worked
npx prisma studio
# Expected: All tables populated with data equivalent to mock data

# Manual verification queries
npx prisma db execute --stdin <<< "SELECT COUNT(*) FROM concerts;"
# Expected: 3 concerts (matching mockConcerts length)
```

### Level 2: API Route Testing
```bash
# Start development server
npm run dev

# Test concerts API
curl -H "Cookie: auth-token=VALID_JWT_TOKEN" \
  "http://localhost:3000/api/concerts"
# Expected: Same response format as before, but from database

# Test concert details with relationships
curl -H "Cookie: auth-token=VALID_JWT_TOKEN" \
  "http://localhost:3000/api/concerts?id=concert-1"
# Expected: Concert with nested attendanceForms, scores, and practices

# Test practices filtering
curl -H "Cookie: auth-token=VALID_JWT_TOKEN" \
  "http://localhost:3000/api/practices?concertId=concert-1"
# Expected: Practices filtered by concert ID, sorted by date
```

### Level 3: CRUD Operations Testing
```bash
# Test creating new practice (requires admin JWT)
curl -X POST -H "Cookie: auth-token=ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"concertId":"concert-1","title":"新しい練習","date":"2025-12-25T10:00:00","venue":"テスト会場"}' \
  "http://localhost:3000/api/practices"
# Expected: {"success": true, "message": "練習予定を作成しました"}

# Verify in database
npx prisma studio
# Expected: New practice appears in practices table
```

## Final validation Checklist
- [ ] Database seeded successfully: `npx prisma db seed`
- [ ] All API routes return data from database instead of mock data
- [ ] Response formats remain identical to previous mock data responses
- [ ] CRUD operations work correctly for admin users
- [ ] Relationships load correctly (concerts with scores, comments, practices)
- [ ] Authentication middleware continues to work unchanged
- [ ] Japanese error messages maintained
- [ ] Date formatting preserved in responses
- [ ] No TypeScript errors: `npm run build`

---

## Anti-Patterns to Avoid
- ❌ Don't change response formats - frontend depends on current structure
- ❌ Don't skip relationship loading - nested data is expected
- ❌ Don't ignore existing authentication patterns - security must be preserved
- ❌ Don't use English error messages - codebase is Japanese
- ❌ Don't hardcode IDs in seed data - use consistent ID generation
- ❌ Don't forget to handle Prisma connection errors gracefully
- ❌ Don't mix Promise patterns - use consistent async/await throughout

## Confidence Score: 9/10
This PRP provides comprehensive context including existing code patterns, Prisma best practices, complete mock data structure, and exact API patterns to follow. The step-by-step approach with validation at each level should enable successful one-pass implementation.