name: "Data Fetching Flow Refactor - Complete Migration from Mock-data to Database"
description: |

## Goal

Complete migration from mock-data usage to database-backed API calls. Remove mock-data.ts entirely and ensure all data comes from the database via API routes. Consolidate utility functions, fix Date/DateTime type inconsistencies, and establish a clean data flow: Database → API → Frontend.

## Issue Link

https://github.com/atsu0127/orch-link/issues/9

## Why

- **Database-First Architecture**: All data should come from the database, not mock files
- **Production Readiness**: Mock-data prevents proper production deployment and data persistence
- **Type Safety**: Current Date/DateTime conversions between Prisma, API, and frontend are inconsistent
- **Code Organization**: Utility functions are duplicated, mock-data creates unnecessary complexity
- **Data Integrity**: Database ensures data consistency and enables proper CRUD operations
- **Scalability**: Proper API layer enables caching, validation, and external integrations

## What

Transform the application to use exclusively database-backed data fetching with:

### Success Criteria

- [ ] Complete removal of mock-data.ts file
- [ ] Frontend uses API calls for all data operations
- [ ] All Date/DateTime types handled consistently across layers
- [ ] Utility functions consolidated in single location
- [ ] Database seeding works with pure JSON data
- [ ] All existing functionality works identically
- [ ] No runtime dependencies on mock-data functions
- [ ] TypeScript compilation succeeds without errors

## All Needed Context

### Documentation & References

```yaml
# MUST READ - Include these in your context window
- url: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
  why: Next.js 15 App Router API patterns for database integration

- url: https://flaviocopes.com/nextjs-serialize-date-json/
  why: Critical Date serialization handling in Next.js JSON responses

- url: https://github.com/prisma/prisma/discussions/5522
  why: Prisma DateTime serialization behavior in API responses

- file: src/app/api/concerts/route.ts  
  why: Already implemented DB-based API route to extend for all data needs
  
- file: src/lib/seed-helpers.ts
  why: Contains DB query functions that need to be promoted to main API layer
  
- file: src/app/page.tsx
  why: Main component using mock-data functions to be replaced with API calls

- file: src/components/features/auth/AuthProvider.tsx
  why: Established pattern for authenticated fetch calls to follow
```

### Current Codebase tree (problematic areas)

```bash
src/
├── app/
│   ├── page.tsx                    # ❌ getConcertData(), getActiveConcerts() from mock-data
│   └── api/
│       └── concerts/route.ts       # ✅ Already uses DB via seed-helpers functions
├── components/features/
│   ├── attendance/AttendanceTab.tsx      # ❌ formatDate from mock-data
│   ├── contact/ContactTab.tsx            # ❌ formatDate + mockContactInfo from mock-data
│   ├── scores/ScoresTab.tsx              # ❌ formatDate from mock-data
│   ├── practices/PracticesList.tsx       # ❌ formatDate, formatTimeRange from mock-data
│   └── practices/PracticeDetail.tsx      # ❌ formatDate, formatTimeRange from mock-data
├── lib/
│   ├── mock-data.ts               # ❌ TO BE DELETED - contains runtime + utilities
│   └── seed-helpers.ts            # ❌ DB functions in wrong location + duplicate utilities
├── prisma/
│   └── seed.ts                    # ❌ Imports from mock-data.ts
```

### Desired Codebase tree after complete migration

```bash
src/
├── app/
│   └── api/
│       ├── concerts/route.ts      # 🔄 Enhanced with all concert operations
│       ├── contact/route.ts       # 🔄 Enhanced to return contact info from DB
│       └── ...                    # Other existing API routes
├── lib/
│   ├── queries.ts                 # 🆕 All database query functions (from seed-helpers)
│   ├── utils.ts                   # 🆕 All utility functions (date formatting, etc.)
│   ├── api-client.ts             # 🆕 Client-side API calling functions
│   └── seed-data.json            # 🆕 Pure JSON for seeding (no functions)
├── types/
│   └── serialized.ts             # 🆕 API response types with string dates
├── prisma/
│   └── seed.ts                   # 🔄 Uses JSON data + queries.ts functions
```

### Known Gotchas & Critical Patterns

```typescript
// CRITICAL: Complete mock-data elimination means no fallback
// All data MUST come from database or API will fail
const data = getConcertData(id);  // ❌ Will be deleted
const data = await fetchConcertData(id);  // ✅ API call only

// GOTCHA: Components currently expect immediate data from mock functions
// Need to handle loading states for async API calls
const concertData = getConcertData(id);  // ❌ Synchronous mock data
const [concertData, setConcertData] = useState(null);  // ✅ Async API pattern

// CRITICAL: ContactTab uses mockContactInfo directly from mock-data
// Must be replaced with API call to database
import { mockContactInfo } from '@/lib/mock-data';  // ❌ Will break
const contactInfo = await fetchContactInfo();  // ✅ API call

// GOTCHA: Date formatting functions exist in both mock-data and seed-helpers
// Must consolidate to single location before deleting mock-data
import { formatDate } from '@/lib/mock-data';  // ❌ File will be deleted
import { formatDate } from '@/lib/utils';      // ✅ Consolidated location
```

## Implementation Blueprint

### Data models and API response types

```typescript
// API response types (client-side, after JSON serialization)
export interface ConcertAPI {
  id: string;
  date: string;         // ISO string from JSON serialization
  updatedAt: string;
}

export interface ContactInfoAPI {
  id: string;
  email: string;
  description: string;
  updatedAt: string;
}

// Type utility for Date -> string conversion
export type WithSerializedDates<T> = {
  [K in keyof T]: T[K] extends Date ? string : 
                  T[K] extends Date | null ? string | null : T[K];
};
```

### List of tasks to be completed in the order they should be completed

```yaml
Task 1:
CREATE src/lib/utils.ts:
  - MOVE formatDate, formatTimeRange, formatDateOnly from mock-data.ts
  - MOVE same functions from seed-helpers.ts (remove duplicates)  
  - EXPORT consolidated utility functions
  - ENSURE exact same Japanese formatting behavior

Task 2:
CREATE src/lib/queries.ts:
  - MOVE all "*FromDB" functions from seed-helpers.ts
  - RENAME: getAllConcertsFromDB → getAllConcerts
  - RENAME: getActiveConcertsFromDB → getActiveConcerts  
  - RENAME: getConcertDataFromDB → getConcertData
  - ADD: getContactInfo() function for contact data
  - IMPORT prisma client from db.ts

Task 3:
CREATE src/types/serialized.ts:
  - DEFINE API response types with string dates
  - CREATE WithSerializedDates utility type
  - EXPORT all types for API responses

Task 4:
CREATE src/lib/api-client.ts:
  - IMPLEMENT fetchConcerts(activeOnly?) following AuthProvider pattern
  - IMPLEMENT fetchConcertData(concertId) 
  - IMPLEMENT fetchContactInfo()
  - HANDLE authentication with credentials: "include"
  - HANDLE proper error responses and TypeScript types

Task 5:
MODIFY src/app/api/contact/route.ts:
  - ADD GET endpoint to return contact info from database
  - USE getContactInfo() from queries.ts
  - FOLLOW same pattern as concerts API route
  - ENSURE proper JWT authentication

Task 6:
CREATE src/lib/seed-data.json:
  - EXTRACT raw data from mock-data.ts (concerts, scores, practices, etc.)
  - CONVERT to pure JSON format (no functions, no Date objects - use ISO strings)
  - STRUCTURE exactly like current mock data for prisma/seed.ts compatibility

Task 7:
MODIFY prisma/seed.ts:
  - REMOVE import from mock-data.ts
  - IMPORT raw data from seed-data.json
  - USE database functions from queries.ts
  - CONVERT JSON string dates to Date objects for Prisma
  - MAINTAIN identical seeding results

Task 8:
MODIFY src/app/page.tsx:
  - REPLACE getConcertData() with await fetchConcertData()
  - REPLACE getActiveConcerts() with await fetchConcerts()
  - ADD loading states for async operations
  - HANDLE API errors appropriately
  - CONVERT API string dates to Date objects for component usage

Task 9:
MODIFY src/components/features/contact/ContactTab.tsx:
  - REMOVE import of mockContactInfo from mock-data
  - ADD useState for contact info and loading state
  - IMPLEMENT useEffect to fetch contact info via API
  - USE fetchContactInfo() from api-client.ts

Task 10:
MODIFY all remaining components (AttendanceTab, ScoresTab, PracticesList, PracticeDetail):
  - FIND: import { formatDate, formatTimeRange } from '@/lib/mock-data'
  - REPLACE: import { formatDate, formatTimeRange } from '@/lib/utils'
  - VERIFY no other mock-data imports remain

Task 11:
DELETE src/lib/mock-data.ts:
  - ENSURE all functions have been moved to utils.ts or queries.ts
  - ENSURE all data has been moved to seed-data.json
  - ENSURE no remaining imports to mock-data exist
  - VERIFY application still works completely

Task 12:
CLEANUP src/lib/seed-helpers.ts:
  - REMOVE all functions that were moved to queries.ts
  - REMOVE duplicate utility functions that were moved to utils.ts
  - KEEP only functions that are truly seed-specific (if any)
  - OR DELETE entirely if all functions were moved
```

### Critical implementation details

```typescript
// Task 4: API client with complete database backing
// src/lib/api-client.ts
export async function fetchContactInfo(): Promise<ContactInfoAPI> {
  const response = await fetch('/api/contact', {
    method: 'GET',
    credentials: 'include',  // JWT auth
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch contact info: ${response.status}`);
  }
  
  const data = await response.json();
  return data.data as ContactInfoAPI;
}

// Task 8: Page.tsx with complete API integration
// src/app/page.tsx
const [isInitializing, setIsInitializing] = useState(true);

const initializeApp = async () => {
  try {
    // API call instead of mock function
    const activeConcerts = await fetchConcerts(true);
    
    if (activeConcerts.length === 0) {
      setError("アクティブな演奏会がありません");
      return;
    }
    
    // Convert API string dates to Date objects for components
    const concertsWithDates = activeConcerts.map(concert => ({
      ...concert,
      date: new Date(concert.date),
      updatedAt: new Date(concert.updatedAt),
    }));
    
    // Rest of initialization logic...
  } catch (error) {
    console.error("アプリケーション初期化エラー:", error);
    setError("アプリケーションの初期化に失敗しました");
  } finally {
    setIsInitializing(false);
  }
};

// Task 9: ContactTab with API integration
// src/components/features/contact/ContactTab.tsx
const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  const loadContactInfo = async () => {
    try {
      const apiContactInfo = await fetchContactInfo();
      // Convert string date to Date object
      const contactInfoWithDate = {
        ...apiContactInfo,
        updatedAt: new Date(apiContactInfo.updatedAt),
      };
      setContactInfo(contactInfoWithDate);
    } catch (error) {
      console.error("連絡先情報の取得エラー:", error);
      // Handle error appropriately
    } finally {
      setIsLoading(false);
    }
  };
  
  loadContactInfo();
}, []);
```

## Validation Loop

### Level 1: Syntax & Style

```bash
# Must pass without errors after mock-data deletion
npm run lint                  
npx tsc --noEmit             

# Expected: No references to deleted mock-data.ts
# If errors about missing imports: Check all imports updated to new locations
# If Date type errors: Ensure API types use string, components convert to Date
```

### Level 2: Database Integration Test

```bash
# Test complete database integration
npm run dev

# 1. Database seeding must work
npx prisma db seed
# Should succeed using only seed-data.json + queries.ts

# 2. API endpoints must return data
curl -b cookies.txt http://localhost:3000/api/concerts?active=true
# Should return concerts from database, not mock data

# 3. All data must load in browser
# Login → Main page should load concerts from DB via API
# All tabs should work: attendance, scores, practices, contact
# No console errors about missing mock functions
```

### Level 3: Mock-data Complete Elimination Test

```bash
# Final verification that mock-data is completely removed
find src/ -name "*.ts" -o -name "*.tsx" | xargs grep -l "mock-data" 
# Should return empty (no files reference mock-data)

grep -r "getConcertData\|getActiveConcerts" src/ --include="*.ts" --include="*.tsx"
# Should only show API client functions, not mock functions

# Browser Network tab should show:
# - API calls to /api/concerts
# - API calls to /api/contact  
# - No local function calls or mock data access
```

## Final validation Checklist

- [ ] File deleted: `src/lib/mock-data.ts` no longer exists
- [ ] No lint errors: `npm run lint` passes
- [ ] No type errors: `npx tsc --noEmit` passes  
- [ ] Seeding works: `npx prisma db seed` succeeds
- [ ] API calls work: All data loads from database via API
- [ ] UI identical: All formatting and functionality preserved
- [ ] No mock imports: No remaining references to mock-data in codebase
- [ ] Contact info loads: Contact tab gets data from database
- [ ] Loading states work: Async operations handled properly

---

## Anti-Patterns to Avoid

- ❌ Don't leave any fallback to mock-data - must be completely database-backed
- ❌ Don't break date formatting during utility function consolidation
- ❌ Don't skip loading states when converting from sync mock to async API calls
- ❌ Don't ignore TypeScript errors about missing mock-data imports - fix all
- ❌ Don't hardcode any data that should come from database
- ❌ Don't rush the deletion of mock-data.ts before ensuring all migrations are complete