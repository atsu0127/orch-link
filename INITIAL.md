## FEATURE:
Implement comprehensive score management functionality for administrators including score registration, editing, deletion, and update history management. The feature should provide a modal-based interface for managing sheet music links with full CRUD operations and update history tracking.

## EXAMPLES:
- Existing ScoresTab component in src/components/features/scores/ScoresTab.tsx shows current read-only display
- Score API endpoints in src/app/api/scores/route.ts demonstrate existing GET, POST, PUT operations
- Prisma schema models (Score, ScoreComment) in prisma/schema.prisma show the database structure
- Authentication pattern in existing API routes shows JWT-based admin verification

## DOCUMENTATION:
- Mantine UI documentation for Modal, Form, and Table components: https://mantine.dev/
- Next.js App Router API routes: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
- Prisma ORM documentation: https://www.prisma.io/docs/

## OTHER CONSIDERATIONS:
- Must implement missing DELETE API for scores and score comments
- Modal should be mobile-responsive (primary use case)
- Strict admin-only access control (JWT role verification)
- Proper error handling and validation
- Integration with existing ScoresTab component without breaking current functionality
- Update history should show chronological changes with ability to edit/delete comments
- URL validation for score links
- Proper TypeScript types for all components and API responses

## ISSUE LINK:
https://github.com/atsu0127/orch-link/issues/17
