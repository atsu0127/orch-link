name: "Application Name Standardization PRP - Orch Link Branding"
description: |

## Goal

Standardize the application name to "Orch Link" across all components of the codebase to achieve consistent branding and improved user experience. Currently, there are inconsistent naming conventions throughout the application that create confusion and weaken brand identity.

## Issue Link

https://github.com/atsu0127/orch-link/issues/1

## Why

- **Brand Consistency**: Unified naming across all user touchpoints strengthens brand recognition
- **User Experience**: Consistent naming eliminates confusion for users navigating the application
- **Professional Image**: Proper branding demonstrates attention to detail and professional development
- **Maintainability**: Standardized naming makes future updates and references clearer for developers
- **Project Identity**: Clear application identity supports long-term project evolution

## What

Replace inconsistent application names with "Orch Link" branding while maintaining Japanese language for user-facing text according to the language policy defined in CLAUDE.md. This involves updating 5 specific locations in the codebase:

### Success Criteria

- [ ] package.json name field changed from "temp-nextjs" to "orch-link"
- [ ] Footer component displays "Orch Link" instead of mixed naming
- [ ] Page title uses "Orch Link" consistently
- [ ] Login form title reflects proper branding
- [ ] Header component uses "Orch Link" instead of "オーケストラポータル"
- [ ] Contact email subject reflects brand name appropriately
- [ ] All lint and build commands pass without errors
- [ ] No functional changes to user interactions or API behavior

## All Needed Context

### Documentation & References

```yaml
# MUST READ - Next.js 2025 Best Practices
- url: https://nextjs.org/docs/app/getting-started/project-structure
  why: Official Next.js project structure and naming conventions

- url: https://docs.npmjs.com/package-name-guidelines/
  why: NPM package naming rules - kebab-case, lowercase requirements

- url: https://dev.to/vikasparmar/nextjs-component-naming-conventions-best-practices-for-file-and-component-names-39o2
  why: 2025 component naming conventions and file structure best practices

# CRITICAL - Project Language Policy
- file: CLAUDE.md:27-28
  why: "Write all documentation in English, code comments in Japanese, communicate in Japanese"
  critical: Must maintain Japanese UI text while using "Orch Link" as brand name

# Pattern References
- file: src/components/layout/Footer.tsx:20,32
  why: Current inconsistent naming patterns to be fixed

- file: src/app/layout.tsx:21
  why: Page title pattern for metadata

- file: package.json:2
  why: Current temp naming to be standardized
```

### Current Codebase tree (key areas affected)

```bash
src/
├── app/
│   └── layout.tsx                 # Page title metadata
├── components/
│   ├── layout/
│   │   ├── Footer.tsx            # Footer branding text
│   │   └── Header.tsx            # Header title display
│   └── features/
│       ├── auth/
│       │   └── LoginForm.tsx     # Login form title
│       └── contact/
│           └── ContactTab.tsx    # Email subject line
package.json                       # NPM package name
```

### Desired Codebase tree with files to be modified

```bash
# No new files - only modifications to existing files
# All changes are text replacements maintaining existing functionality
```

### Known Gotchas of our codebase & Library Quirks

```javascript
// CRITICAL: Language Policy Requirements
// Japanese UI text MUST be preserved for user-facing content
// Only brand name "Orch Link" should be used consistently
// Example: "Orch Link ログイン" not "Login"

// GOTCHA: package-lock.json will auto-update when package.json changes
// Don't manually edit package-lock.json - npm will handle it

// PATTERN: Mantine UI components follow specific text props
// Text components use size, className props for styling
// Title components use order prop for heading hierarchy

// CRITICAL: Contact email subject considerations
// Email subjects should be functional while reflecting brand
// Use "Orch Link エキストラからのお問い合わせ" pattern
```

## Implementation Blueprint

### Data models and structure

No data model changes required - this is purely a text standardization task maintaining existing component structure and functionality.

### List of tasks to be completed in order

```yaml
Task 1: Update package.json name field
MODIFY package.json:
  - FIND pattern: '"name": "temp-nextjs",'
  - REPLACE with: '"name": "orch-link",'
  - PRESERVE all other package.json content unchanged

Task 2: Standardize Footer component branding
MODIFY src/components/layout/Footer.tsx:
  - FIND pattern: 'オーケストラ・エキストラ連絡ポータル' (line 20)
  - REPLACE with: 'Orch Link'
  - FIND pattern: 'Orchestra Extra Portal' (line 32)
  - REPLACE with: 'Orch Link'
  - PRESERVE all Japanese descriptive text and functionality

Task 3: Update page title metadata
MODIFY src/app/layout.tsx:
  - FIND pattern: 'title: "オーケストラ・エキストラ連絡ポータル",' (line 21)
  - REPLACE with: 'title: "Orch Link",'
  - PRESERVE description and all other metadata

Task 4: Standardize login form title
MODIFY src/components/features/auth/LoginForm.tsx:
  - FIND pattern: 'オーケストラ・エキストラ連絡ポータル' (line 62)
  - REPLACE with: 'Orch Link'
  - PRESERVE all form functionality and Japanese labels

Task 5: Update header component branding
MODIFY src/components/layout/Header.tsx:
  - FIND pattern: 'オーケストラポータル' (line 50)
  - REPLACE with: 'Orch Link'
  - PRESERVE all functionality and component logic

Task 6: Improve contact email subject branding
MODIFY src/components/features/contact/ContactTab.tsx:
  - FIND pattern: 'オーケストラ・エキストラからのお問い合わせ' (line 47)
  - REPLACE with: 'Orch Link エキストラからのお問い合わせ'
  - PRESERVE email functionality and template content
```

### Per task pseudocode

```javascript
// Task 1: Package.json standardization
// NPM package naming follows 2025 best practices
// kebab-case, lowercase, descriptive but concise
const newPackageName = "orch-link"; // follows npm guidelines

// Task 2-6: Text replacement pattern
// PATTERN: Preserve component structure, update display text only
function updateDisplayText(component) {
  // CRITICAL: Only change display strings, not functionality
  // PRESERVE: All props, state management, event handlers
  // UPDATE: Only hardcoded display text strings
  // MAINTAIN: Japanese language for user instructions
  // APPLY: "Orch Link" for brand name references
}

// GOTCHA: Mantine components use specific prop patterns
<Title order={3} className="text-blue-700">
  Orch Link  {/* Brand name in English */}
</Title>

<Text size="sm" className="text-gray-300">
  演奏会情報の効率的な共有と管理をサポート  {/* Descriptive text in Japanese */}
</Text>
```

### Integration Points

```yaml
NO INTEGRATION CHANGES:
  - No database changes required
  - No API endpoint modifications needed
  - No configuration changes required
  - No new dependencies or imports

VALIDATION POINTS:
  - Visual consistency check across all pages
  - Email functionality verification after subject change
  - Browser title display verification
  - Footer display verification
```

## Validation Loop

### Level 1: Syntax & Style

```bash
# Run these FIRST - fix any errors before proceeding
npm run lint              # Next.js linting
npm run build             # Verify build succeeds
npm run typecheck         # If available in project

# Expected: No errors. If errors, READ the error and fix.
```

### Level 2: Manual Testing

```bash
# Start development server
npm run dev

# Visual verification checklist:
# 1. Check browser tab title shows "Orch Link"
# 2. Verify footer displays "Orch Link" consistently
# 3. Confirm header shows "Orch Link" 
# 4. Test login form title display
# 5. Verify contact email opens with correct subject

# Test email functionality:
# Navigate to contact tab → click "メールで連絡する"
# Expected: Email opens with subject "Orch Link エキストラからのお問い合わせ"
```

### Level 3: Build Verification

```bash
# Production build test
npm run build
npm run start

# Navigate through all pages to verify:
# - No broken functionality
# - Consistent branding display
# - All Japanese text preserved correctly
# - Email functionality works properly
```

## Final validation Checklist

- [ ] Lint passes: `npm run lint`
- [ ] Build succeeds: `npm run build`
- [ ] Manual test successful: All pages display "Orch Link" consistently
- [ ] Email functionality verified: Contact form opens email with correct subject
- [ ] Japanese text preserved: All user instructions remain in Japanese
- [ ] Brand consistency achieved: No mixed naming conventions remain
- [ ] No functional regressions: All features work as before
- [ ] Issue updated: GitHub issue #1 status updated

---

## Anti-Patterns to Avoid

- ❌ Don't change functional text that affects user workflow
- ❌ Don't modify component structure or props
- ❌ Don't change Japanese user-facing text to English (except brand name)
- ❌ Don't update package-lock.json manually
- ❌ Don't modify email template content beyond subject line
- ❌ Don't skip build verification after changes

---

## Confidence Score: 9/10

This PRP has high confidence for one-pass implementation because:
- ✅ Clear, specific text replacements with exact line numbers
- ✅ Comprehensive context including language policy requirements
- ✅ Validated patterns from 2025 Next.js best practices
- ✅ Executable validation steps with specific commands
- ✅ All target files identified and analyzed
- ✅ No complex logic changes - pure text standardization
- ✅ Clear success criteria and anti-patterns defined