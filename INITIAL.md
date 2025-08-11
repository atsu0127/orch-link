## FEATURE:

Refactor data fetching flow from mock-data to database-based API calls with proper type safety. Currently, the frontend directly uses mock-data functions while API routes already use database functions. Need to consolidate utility functions and ensure proper DateTime/Date type conversions between Prisma, API, and frontend.

## EXAMPLES:

Key files to examine:

- `src/app/page.tsx` - Currently uses `getConcertData()` and `getActiveConcerts()` from mock-data
- `src/app/api/concerts/route.ts` - Already implemented with DB functions
- `src/lib/seed-helpers.ts` - Contains DB query functions that should be moved to more general location
- `src/lib/mock-data.ts` - Contains duplicate utility functions and mock data that should be seed-only
- Multiple components import format functions from mock-data

## DOCUMENTATION:

- Next.js API Routes: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
- Prisma Client: https://www.prisma.io/docs/concepts/components/prisma-client
- TypeScript Date handling: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date

## OTHER CONSIDERATIONS:

- Prisma DateTime fields become strings when serialized through JSON APIs - need proper type conversion
- Duplicate format functions exist in both mock-data.ts and seed-helpers.ts
- Components currently import format utilities from mock-data, which should be moved to dedicated utility location
- Existing API routes use proper DB functions but frontend hasn't been updated to use them
- Need to preserve seed data functionality while removing direct mock-data usage in components
- Type definitions have inconsistencies between Date, DateTime, and string types across different layers

## ISSUE LINK:

https://github.com/atsu0127/orch-link/issues/9
