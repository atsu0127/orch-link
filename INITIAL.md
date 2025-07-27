## FEATURE:

Update terminology from "出欠フォーム" (attendance form) to "出欠調整" (attendance coordination) throughout the application to accurately reflect that these are external links to coordination apps, not actual forms within the application. This includes updating UI components, type definitions, comments, and documentation to use consistent terminology that clearly indicates users will be redirected to external services like Google Forms or Microsoft Forms.

## EXAMPLES:

No specific example files are provided in the examples/ folder for this task. The changes involve updating existing components and maintaining current functionality while improving terminology clarity.

## DOCUMENTATION:

- Project documentation in docs/screen_design.md contains terminology that needs updating
- Component comments and JSDoc should be updated for clarity
- Type definitions in src/types/index.ts need comment updates
- CLAUDE.md indicates all code comments should be in Japanese

## OTHER CONSIDERATIONS:

- Maintain consistency across all Japanese terminology throughout the application
- Ensure the new terminology clearly communicates that users will be redirected to external services
- Do not change any functional behavior, only update text/terminology
- Consider user experience - the new terminology should reduce confusion about what happens when users click the links
- Keep mobile-responsive design considerations intact as this is the primary use case
- Maintain the existing icon usage and visual design while updating text

## ISSUE LINK:

https://github.com/atsu0127/orch-link/issues/3
