## FEATURE:

Implement administrator-facing Practice Schedule CRUD functionality. The system currently has a complete Practice API and display components, but lacks the management UI for administrators to create, edit, and delete practice schedules directly within the application.

## EXAMPLES:

Reference existing management components in the codebase:

- `src/components/features/concerts/ConcertManagement.tsx` - Concert CRUD management interface pattern
- `src/components/features/concerts/ConcertForm.tsx` - Form component pattern for data input
- `src/components/features/scores/ScoreManagement.tsx` - Score management UI pattern with similar functionality

The implementation should follow the same architectural patterns as these existing management components.

## DOCUMENTATION:

- API endpoints already implemented: `/api/practices` (GET, POST, PUT, DELETE)
- Practice data model: `src/types/index.ts` - Practice interface definition
- Existing display components: `src/components/features/practices/PracticesList.tsx` and `PracticeDetail.tsx`
- Authentication patterns: Admin role checking with `user?.role === "admin"`
- Mantine UI components documentation: https://mantine.dev/

## OTHER CONSIDERATIONS:

- The Practice API is fully functional - no API modifications needed
- Follow existing UI patterns from Concert and Score management components
- Implement proper admin permission checks before showing management interfaces
- Use Mantine components for consistency with existing design system
- Handle timezone conversions properly for datetime fields
- Practice schedules are associated with specific concerts (concertId relationship)
- Include proper error handling and user feedback (notifications)
- Add management buttons to existing PracticesList component when user is admin
- Implement confirmation dialogs for destructive actions (deletion)

## ISSUE LINK:

https://github.com/atsu0127/orch-link/issues/19
