## FEATURE:
Fix real-time data reflection issue when switching concerts. Currently, when users select a different concert from the dropdown menu in the header, the practice schedules and sheet music data do not update to reflect the newly selected concert. The old concert's data remains displayed until the page is reloaded. The issue appears to be in the UI update timing rather than the data fetching process itself.

## EXAMPLES:
- src/app/page.tsx:73-79 - Concert switching useEffect that should trigger loadConcertData
- src/app/page.tsx:47-63 - loadConcertData function that fetches and sets concert data
- src/components/layout/Header.tsx:58-66 - Concert selection dropdown component
- src/lib/api-client.ts:65-88 - fetchConcertData API client function

## DOCUMENTATION:
- React useEffect dependencies: https://react.dev/reference/react/useEffect
- React state updates: https://react.dev/learn/state-a-components-memory
- Next.js data fetching patterns: https://nextjs.org/docs/app/building-your-application/data-fetching

## OTHER CONSIDERATIONS:
- The data fetching API calls appear to be working correctly based on code review
- localStorage is being updated properly for concert selection persistence
- The issue manifests specifically in the UI components (AttendanceTab, ScoresTab, PracticesList) not re-rendering with new data
- Consider React component re-rendering patterns and dependency arrays in useEffect hooks
- Check if child components are properly receiving updated props and re-rendering accordingly
- Verify that concertData state is being properly updated and propagated to child components

## ISSUE LINK:
https://github.com/atsu0127/orch-link/issues/23
