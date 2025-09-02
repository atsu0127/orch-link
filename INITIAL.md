## FEATURE:

Implement concert management CRUD operations for administrators in the Orch Link application. This includes:
- POST /api/concerts API endpoint for creating new concerts
- PUT /api/concerts API endpoint for updating existing concerts  
- DELETE /api/concerts API endpoint for deleting concerts
- Admin-only frontend interface for concert management (following existing patterns from practices, scores, and attendance forms)
- Proper authentication checks for admin role
- Form handling with ConcertFormData type (title, date, venue, isActive)

## EXAMPLES:

Reference existing CRUD implementations in the codebase:
- src/app/api/practices/route.ts - Shows complete CRUD pattern with admin authentication
- src/app/api/scores/route.ts - Shows POST/PUT operations with admin checks
- src/app/api/attendance/route.ts - Shows POST operations with admin checks

## DOCUMENTATION:

- Next.js API Routes: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
- Prisma Client documentation: https://www.prisma.io/docs/concepts/components/prisma-client
- JWT authentication pattern already implemented in src/lib/auth.ts

## OTHER CONSIDERATIONS:

- Concert model already defined in prisma/schema.prisma with proper relations
- ConcertFormData type already defined in src/types/concert.ts
- Admin authentication middleware pattern established (check payload.role === "admin")
- Need to handle cascading deletes for related data (attendanceForms, scores, practices)
- Follow existing error handling patterns from other API routes
- UI should follow existing admin interface patterns from other features

## ISSUE LINK:

https://github.com/atsu0127/orch-link/issues/11
