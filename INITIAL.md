## FEATURE:

Standardize the application name to "Orch Link" across all components of the codebase. Currently, there are inconsistent naming conventions throughout the application: package.json uses "temp-nextjs", footer displays "Orchestra Extra Portal", page title shows "オーケストラ・エキストラ連絡ポータル", and login form displays mixed naming. The goal is to unify all references to use "Orch Link" consistently.

## EXAMPLES:

Target files for name standardization:

- package.json: Change name field from "temp-nextjs" to "orch-link"
- src/components/layout/Footer.tsx: Update footer text to "Orch Link"
- src/app/layout.tsx: Update page title to "Orch Link"
- src/components/features/auth/LoginForm.tsx: Update form title to "Orch Link"

## DOCUMENTATION:

- Project overview in CLAUDE.md already correctly references "Orch Link"
- README.md already uses correct "Orch Link" naming
- API email addresses (admin@orch-link.com) are already correctly formatted

## OTHER CONSIDERATIONS:

- Maintain Japanese language for user-facing text while using "Orch Link" as the brand name
- Preserve existing functionality while only updating display names
- Ensure all user-visible text maintains consistent branding
- Do not modify API endpoints or functional code, only display text

## Issue Link:

https://github.com/atsu0127/orch-link/issues/1
