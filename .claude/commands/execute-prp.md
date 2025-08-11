# Execute BASE PRP

Implement a feature using using the PRP file.

## PRP File: $ARGUMENTS

## Execution Process

**USE SERENA MCP if you want to check codebase**

1. **Load PRP**

   - Read the specified PRP file
   - Understand all context and requirements
   - Follow all instructions in the PRP and extend the research if needed
   - Ensure you have all needed context to implement the PRP fully
   - Do more web searches and codebase exploration as needed

2. **ULTRATHINK**

   - Think hard before you execute the plan. Create a comprehensive plan addressing all requirements.
   - Break down complex tasks into smaller, manageable steps using your todos tools.
   - Use the TodoWrite tool to create and track your implementation plan.
   - Identify implementation patterns from existing code to follow.

3. **Prepare Git**

   - Create remote branch `${USERNAME}/<feat or bugfix>/<featurename ot bugname>` from default branch
   - Switch to created branch

4. **Execute the plan**

   - Execute the PRP
   - Implement all the code

5. **Validate**

   - Run each validation command
   - Fix any failures
   - Re-run until all pass

6. **Complete**

   - Ensure all checklist items done
   - Run final validation suite
   - Report completion status
   - Read the PRP again to ensure you have implemented everything

7. **Reference the PRP**

   - You can always reference the PRP again if needed

8. **Create PullRequest**

   - Please make commits at an appropriate granularity with git(separate commit if needed).
   - Please create the Pull Request based on the template below(use MCP Tool).
   - Think in English, but write in Japanese.

Note: If validation fails, use error patterns in PRP to fix and retry.

## Pull Request Template

```
## 概要
[Briefly describe the bug or new feature]

## 詳細
[List the actual changes made, concisely. with commit id.]

## 注意
[Bullet any points that require special attention during review]

## Issue
close [Put Issue link to close when merged]

```
