# Fix Concert Data Real-Time Reflection Issue

## Goal

Fix the bug where AttendanceTab and ScoresTab components don't update their displayed data when users switch between concerts using the header dropdown. Currently, old concert data persists until page reload, breaking the user experience.

## Issue Link

https://github.com/atsu0127/orch-link/issues/23

## Why

- **User Impact**: Users cannot see updated practice schedules and sheet music when switching concerts, leading to confusion and requiring manual page reloads
- **Data Integrity**: Displays stale data that doesn't match the selected concert, potentially causing users to access wrong information
- **UX Degradation**: Breaks the expected behavior of a single-page application where data should update immediately upon selection changes

## What

Fix React components that use `useState(props)` pattern but don't update when props change. The issue occurs specifically in:
- `AttendanceTab`: Shows old attendance forms after concert switch
- `ScoresTab` (via `ScoreManagement`): Shows old sheet music after concert switch
- `PracticesList`: Actually works correctly (uses props directly)

### Success Criteria

- [ ] Switching concerts in header dropdown immediately updates attendance forms display
- [ ] Switching concerts in header dropdown immediately updates sheet music display
- [ ] Practice schedules continue to work correctly (no regression)
- [ ] No unnecessary component re-renders or performance degradation
- [ ] Page reload is no longer required to see correct data

## All Needed Context

### Documentation & References

```yaml
# MUST READ - Include these in your context window
- url: https://react.dev/reference/react/useEffect
  why: Understanding dependency arrays and when to use useEffect

- url: https://react.dev/learn/you-might-not-need-an-effect
  why: React team's recommended patterns for handling prop changes

- url: https://stackoverflow.com/questions/54865764/react-usestate-does-not-reload-state-from-props
  why: Exact problem pattern and multiple solution approaches

- url: https://stackoverflow.com/questions/50601933/using-the-key-prop-to-force-re-mount-of-a-react-component
  why: Key prop pattern for forcing component remount (recommended solution)

- url: https://stackoverflow.com/questions/53070970/infinite-loop-in-useeffect
  why: CRITICAL - infinite loop patterns and how to avoid them with arrays/objects

- url: https://dmitripavlutin.com/react-useeffect-infinite-loop/
  why: Comprehensive guide on useEffect infinite loop causes and solutions

- url: https://react.dev/learn/removing-effect-dependencies
  why: React official guide on dependency optimization and avoiding infinite loops

- file: src/app/page.tsx:73-79
  why: Concert switching useEffect that triggers loadConcertData

- file: src/app/page.tsx:47-63
  why: loadConcertData function that fetches and sets concertData state

- file: src/components/features/attendance/AttendanceTab.tsx:58-61
  why: Problem pattern - useState(attendanceForms) never updates from props

- file: src/components/features/scores/ScoreManagement.tsx:60-61
  why: Problem pattern - useState(scores) never updates from props

- file: src/components/features/practices/PracticesList.tsx:40-56
  why: Working pattern - uses practices prop directly
```

### Current Codebase Tree (Relevant Parts)

```bash
src/
├── app/
│   └── page.tsx                 # MainApp component with concert switching logic
├── components/
│   ├── features/
│   │   ├── attendance/
│   │   │   └── AttendanceTab.tsx     # PROBLEM: useState(props) doesn't update
│   │   ├── scores/
│   │   │   ├── ScoresTab.tsx         # Wrapper component
│   │   │   └── ScoreManagement.tsx   # PROBLEM: useState(props) doesn't update
│   │   └── practices/
│   │       └── PracticesList.tsx     # WORKS: Uses props directly
│   └── layout/
│       └── Header.tsx                # Concert selection dropdown
└── lib/
    └── api-client.ts                 # fetchConcertData API call
```

### Known Gotchas & React Patterns

```typescript
// CRITICAL: useState only uses initial value ONCE
// This is the anti-pattern causing the bug:
const [localData, setLocalData] = useState(propsData); // ❌ Won't update when propsData changes

// CORRECT patterns:
// Option 1: Key prop to force remount (RECOMMENDED)
<Component key={uniqueId} data={propsData} />

// Option 2: useEffect to sync props to state (CAREFUL WITH ARRAYS!)
// ❌ DANGEROUS with arrays/objects:
useEffect(() => {
  setLocalData(propsData);
}, [propsData]); // Array reference changes every render = infinite loop

// ✅ SAFE with arrays - use stable identifier:
useEffect(() => {
  setLocalData(propsData);
}, [concertId]); // Only runs when concert actually changes

// Option 3: Use props directly (BEST)
// Just use propsData directly, no local state needed
```

### ⚠️ CRITICAL WARNING: useEffect Infinite Loop Risk

**Arrays and objects in useEffect dependencies cause infinite re-renders!**

```typescript
// Problem: Each render creates new array reference
const parentComponent = () => {
  const data = fetchedArray; // New array reference every render
  return <Child arrayProp={data} />;
};

// In Child component:
useEffect(() => {
  setLocalArray(arrayProp);
}, [arrayProp]); // ❌ Runs every render = infinite loop

// Solution: Use stable identifier instead
useEffect(() => {
  setLocalArray(arrayProp);
}, [concertId]); // ✅ Only runs when concert changes
```

## Implementation Blueprint

### Root Cause Analysis

The issue stems from React's useState behavior:
1. `useState(initialValue)` only uses `initialValue` during the first render
2. Subsequent prop changes are ignored by useState
3. Components maintain stale local state even when parent passes new data

**Affected Components:**
- `AttendanceTab`: `useState<AttendanceForm[]>(attendanceForms)`
- `ScoreManagement`: `useState<Score[]>(scores)`

**Working Component:**
- `PracticesList`: Uses `practices` prop directly in render

### List of tasks to be completed in order

```yaml
Task 1 - Apply Key Prop Pattern (Primary Solution):
MODIFY src/app/page.tsx:
  - FIND pattern: "<AttendanceTab" around line 273
  - ADD key prop: key={selectedConcertId}
  - FIND pattern: "<ScoresTab" around line 280
  - ADD key prop: key={selectedConcertId}
  - PRESERVE all existing props and functionality

Task 2 - Verify PracticesList Works Correctly:
REVIEW src/components/features/practices/PracticesList.tsx:
  - CONFIRM it uses practices prop directly (no useState issue)
  - ENSURE no key prop needed (should work correctly as-is)

Task 3 - Test Manual Concert Switching:
MANUAL_TEST:
  - Start development server
  - Login to application
  - Switch between concerts using header dropdown
  - VERIFY attendance forms update immediately
  - VERIFY sheet music updates immediately
  - VERIFY practice schedules update immediately (no regression)

Task 4 - Alternative Implementation (If Key Prop Has Issues):
CRITICAL WARNING: Arrays in useEffect dependencies can cause infinite loops!

OPTION A (RECOMMENDED): Use concertId dependency
MODIFY src/components/features/attendance/AttendanceTab.tsx:
  - ADD useEffect to sync attendanceForms prop to localForms state
  - SAFE PATTERN: useEffect(() => { setLocalForms(attendanceForms); }, [concertId]);

MODIFY src/components/features/scores/ScoreManagement.tsx:
  - ADD useEffect to sync scores prop to localScores state
  - SAFE PATTERN: useEffect(() => { setLocalScores(scores); }, [concertId]);

OPTION B (ADVANCED): Use memoized dependencies if array content changes matter
  - PATTERN: useMemo to create stable array reference before useEffect
  - ONLY use if you need to detect changes within same concert

AVOID: useEffect(() => {...}, [arrayProp]) - causes infinite re-renders!
```

### Implementation Approach: Key Prop Pattern (Recommended)

```typescript
// Task 1: Modify src/app/page.tsx
// FIND these components around lines 273 and 280:

// BEFORE (broken):
{activeTab === "attendance" && (
  <AttendanceTab
    concertId={selectedConcertId}
    attendanceForms={concertData.attendanceForms}
  />
)}

{activeTab === "scores" && (
  <ScoresTab
    concertId={selectedConcertId}
    scores={concertData.scores}
  />
)}

// AFTER (fixed):
{activeTab === "attendance" && (
  <AttendanceTab
    key={selectedConcertId}  // ← ADD THIS: Forces remount on concert change
    concertId={selectedConcertId}
    attendanceForms={concertData.attendanceForms}
  />
)}

{activeTab === "scores" && (
  <ScoresTab
    key={selectedConcertId}  // ← ADD THIS: Forces remount on concert change
    concertId={selectedConcertId}
    scores={concertData.scores}
  />
)}

// CRITICAL: When selectedConcertId changes, React will:
// 1. Unmount the old component instance (clearing all state)
// 2. Mount a new component instance with fresh props
// 3. Initialize useState with new prop values
```

### Alternative Implementation: useEffect Sync Pattern (CRITICAL: Avoid Infinite Loops)

```typescript
// Task 4: If key prop approach has issues, use this pattern:
// WARNING: Direct array dependencies can cause infinite re-renders!

// OPTION A: Safe useEffect with concertId dependency (RECOMMENDED for arrays)
// In AttendanceTab.tsx:
export function AttendanceTab({ concertId, attendanceForms }: AttendanceTabProps) {
  const [localForms, setLocalForms] = useState<AttendanceForm[]>(attendanceForms);

  // SAFE: Use concertId instead of array to avoid infinite loops
  useEffect(() => {
    setLocalForms(attendanceForms);
  }, [concertId]); // ← Only when concert changes, not on every array re-creation

  // Rest of component logic unchanged...
}

// OPTION B: Memoized comparison (if array contents need to be checked)
import { useMemo, useEffect } from 'react';

export function AttendanceTab({ concertId, attendanceForms }: AttendanceTabProps) {
  const [localForms, setLocalForms] = useState<AttendanceForm[]>(attendanceForms);

  // Create stable reference for array comparison
  const memoizedForms = useMemo(() => attendanceForms, [
    attendanceForms.length,
    JSON.stringify(attendanceForms.map(f => f.id))
  ]);

  useEffect(() => {
    setLocalForms(attendanceForms);
  }, [memoizedForms]);

  // Rest of component logic unchanged...
}

// OPTION C: JSON string comparison (simple but less performant)
export function AttendanceTab({ concertId, attendanceForms }: AttendanceTabProps) {
  const [localForms, setLocalForms] = useState<AttendanceForm[]>(attendanceForms);

  const formsJson = JSON.stringify(attendanceForms);

  useEffect(() => {
    setLocalForms(attendanceForms);
  }, [formsJson]);

  // Rest of component logic unchanged...
}

// ANTI-PATTERN (DO NOT USE):
// useEffect(() => {
//   setLocalForms(attendanceForms);
// }, [attendanceForms]); // ❌ Can cause infinite loops with array props!
```

## Validation Loop

### Level 1: Manual Testing

```bash
# Start development server
npm run dev

# Test Steps:
1. Open browser to http://localhost:3000
2. Login with test credentials
3. Note current concert name and data displayed
4. Use header dropdown to select different concert
5. VERIFY: Attendance forms update immediately (no page reload)
6. Switch to Scores tab
7. VERIFY: Sheet music updates immediately (no page reload)
8. Switch to Practices tab
9. VERIFY: Practice schedules update immediately (no regression)
10. Switch back to original concert
11. VERIFY: All data reverts to original concert data
```

### Level 2: Browser DevTools Verification

```bash
# Open React Developer Tools
# 1. Install React DevTools browser extension
# 2. Open DevTools → Components tab
# 3. Watch component tree while switching concerts
# 4. VERIFY: AttendanceTab/ScoresTab components unmount/remount (with key prop)
#    OR: State updates are reflected (with useEffect approach)

# Console debugging:
# Add temporary console.log in components to verify data flow:
console.log('AttendanceTab rendering with forms:', attendanceForms.length);
console.log('ScoreManagement rendering with scores:', scores.length);
```

### Level 3: Functional Testing

```bash
# Test different scenarios:

# Scenario 1: Switch between concerts with different data amounts
1. Select concert A (e.g., 5 attendance forms, 10 scores)
2. Select concert B (e.g., 2 attendance forms, 3 scores)
3. VERIFY: Correct counts displayed immediately

# Scenario 2: Switch to concert with no data
1. Select concert with empty forms/scores
2. VERIFY: Empty state shown immediately (not old data)

# Scenario 3: Rapid switching
1. Quickly switch between multiple concerts
2. VERIFY: No race conditions or stale data display
```

## Final Validation Checklist

- [ ] Concert switching updates attendance forms immediately
- [ ] Concert switching updates sheet music immediately
- [ ] Practice schedules continue to work (no regression)
- [ ] No JavaScript errors in browser console
- [ ] No unnecessary API calls or performance issues
- [ ] Empty state handling works correctly
- [ ] Rapid concert switching works without race conditions
- [ ] Manual testing completed for all tabs and concert combinations
- [ ] Browser DevTools confirm proper component behavior

## Anti-Patterns to Avoid

- ❌ Don't add useEffect with empty dependency array `[]` (will only run once)
- ❌ Don't use random values for key prop (causes unnecessary remounts)
- ❌ Don't add complex logic to useEffect sync patterns (keep it simple)
- ❌ Don't modify the data fetching logic (that works correctly)
- ❌ Don't change PracticesList (it already works correctly)
- ❌ Don't add loading states unless truly necessary (components remount quickly)
- ❌ **CRITICAL: Don't put arrays/objects directly in useEffect dependencies** (causes infinite loops)
  ```typescript
  // ❌ BAD - Infinite loop risk:
  useEffect(() => { setData(arrayProp); }, [arrayProp]);

  // ✅ GOOD - Use stable identifiers:
  useEffect(() => { setData(arrayProp); }, [concertId]);
  ```

## Confidence Score: 9/10

This PRP has high confidence for one-pass implementation because:
- ✅ Root cause clearly identified and well-understood
- ✅ Multiple proven solution patterns provided
- ✅ Exact file locations and code patterns specified
- ✅ Comprehensive testing strategy included
- ✅ Known gotchas and anti-patterns documented
- ✅ Issue occurs in only 2 specific components
- ✅ One component already works correctly as reference