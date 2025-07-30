## FEATURE:
Implement comprehensive concert management functionality for administrators, including create, update, and delete operations. This feature will add full CRUD capabilities to the existing concert system, allowing administrators to efficiently manage concert information through both API endpoints and a dedicated management interface.

The implementation requires:
- POST/PUT/DELETE API endpoints for concert operations
- Admin-only access control with JWT authentication
- Concert management UI with form validation
- Logical deletion (isActive: false) instead of physical deletion
- Mobile-responsive design consistent with existing patterns

## EXAMPLES:
- Existing GET API pattern in `src/app/api/concerts/route.ts` shows JWT authentication flow
- Database operations in `src/lib/seed-helpers.ts` demonstrate Prisma query patterns
- Concert type definitions in `src/types/concert.ts` include ConcertFormData interface
- Authentication middleware in `src/middleware.ts` provides role-based access control

## DOCUMENTATION:
- Prisma schema: `/prisma/schema.prisma` defines Concert model with all required fields
- JWT auth implementation: `src/lib/auth.ts` handles token verification
- Existing API structure follows Next.js App Router conventions
- Database helpers in `src/lib/seed-helpers.ts` show established patterns

## OTHER CONSIDERATIONS:
- Maintain backward compatibility with existing GET endpoints
- Ensure proper error handling and validation on both client and server
- Follow existing code patterns for consistency (Japanese comments, mobile-first design)
- Implement proper loading states and user feedback for operations
- Consider cascade deletion implications for related data (attendanceForms, scores, practices)

## ISSUE LINK:
https://github.com/atsu0127/orch-link/issues/7
