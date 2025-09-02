## FEATURE:
Add attendance link management functionality for administrators within the existing attendance tab. Implement create, edit, and delete operations for attendance forms while maintaining read-only display for viewers. The feature should integrate seamlessly into the current AttendanceTab component and follow role-based access control.

## EXAMPLES:
- Reference ConcertManagement.tsx for CRUD operation patterns and form handling
- Reference ConcertForm.tsx for form implementation patterns
- Reference existing AttendanceTab.tsx for current display logic

## DOCUMENTATION:
- Prisma schema: AttendanceForm model already exists with required fields (title, url, description)
- API endpoint: POST /api/attendance already implemented for creation
- Authentication: JWT role-based access control using verifyToken function
- UI Components: Mantine library for form components and notifications

## OTHER CONSIDERATIONS:
- Must preserve existing read-only functionality for viewers
- Add role-based UI rendering (admin vs viewer)
- Implement PUT and DELETE API endpoints for attendance forms
- Ensure proper error handling and loading states
- Follow mobile-first responsive design principles
- Maintain consistency with existing concert management patterns

## ISSUE LINK:
https://github.com/atsu0127/orch-link/issues/14
