## FEATURE:
Enhance practice schedule tab with separate start/end times, address field, and video recording support. Currently, practice schedules only store a single date/time, venue name without address, and audio recording only. This enhancement will add:

1. Separate startTime and endTime fields instead of single date field
2. Optional address field for practice venues (free text)
3. videoUrl field in addition to existing audioUrl field

The implementation requires database schema changes, TypeScript interface updates, API route modifications, and frontend component enhancements to display the new time format and additional information fields.

## EXAMPLES:
No specific examples folder available, but existing practice-related files provide patterns:
- `src/components/features/practices/PracticesList.tsx` - List view component
- `src/components/features/practices/PracticeDetail.tsx` - Detail view component
- `src/types/index.ts` - Practice interface definition
- `src/app/api/practices/route.ts` - API endpoints for CRUD operations

## DOCUMENTATION:
- Project documentation in `docs/` folder:
  - `docs/requirements.md` - Feature requirements specification
  - `docs/architecture.md` - System architecture and GCP services
  - `docs/screen_design.md` - UI/UX specifications
  - `docs/plan.md` - Development roadmap
- Prisma documentation: https://www.prisma.io/docs/
- Next.js App Router documentation: https://nextjs.org/docs/app
- Mantine UI components: https://mantine.dev/

## OTHER CONSIDERATIONS:
- **Database Migration**: Existing data with single `date` field needs migration strategy. Suggest treating existing `date` as `startTime` and leaving `endTime` as null for backward compatibility
- **API Backward Compatibility**: Consider maintaining support for existing API calls while adding new fields
- **Time Zone Handling**: Ensure consistent time zone handling between start and end times
- **Validation**: Add proper validation to ensure endTime is after startTime
- **UI/UX**: Time display format should be user-friendly (e.g., "10:00 - 12:00" instead of full ISO strings)
- **Mobile Responsiveness**: Ensure new fields display properly on mobile devices (primary use case)
- **Empty State Handling**: Gracefully handle cases where endTime, address, or videoUrl are not provided
- **Video Link Validation**: Consider adding URL validation for video links similar to existing audio functionality
- **Japanese Localization**: All UI text should be in Japanese as per project requirements

## ISSUE LINK:
https://github.com/atsu0127/orch-link/issues/5
