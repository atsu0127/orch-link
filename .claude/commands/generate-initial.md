# Generate INITIAL.md

## Basic Instructions

Follow the steps below to create the issue and INITIAL.md:

1. Infer the type and task content based on the user's input defined below.
2. Check the issue template corresponding to the inferred type.
3. If the issue does not satisfy the template requirements, interactively organize the content with the user to fill in the gaps:
   1. Review the codebase, create a draft based on your findings, and confirm it with the user.
   2. If the content cannot be inferred, do not force a draft—defer to the user instead.
   3. Ask and confirm one point at a time to make it easier for the user to respond.
4. Review the codebase to verify the validity of the content. If there are unclear points, ask the user to provide additional details.
5. Once the content is complete, create Github issue in Japanese(use mcp tool).
6. Create an English INITIAL.md summarizing the issue.

User input: ${ARGUMENTS}

If no user input is provided, confirm with the user what problem they want to solve or what feature they want to add, and proceed based on that content.

## Types of Issues

There are the following types of issues:

- Feature Addition
- Bug Report

## Issue Template

### Feature Addition

```

# 背景

[背景情報をここに記載]

# 仕様

## 入力

- [入力仕様をここに記載]

## 出力

- [出力仕様をここに記載]

# その他

[補足事項をここに記載]

```

### Bug Report

```

# 概要

<!-- バグの内容を明確かつ簡潔に説明。 -->

[バグの概要をここに記載]

# 再現手順

1. [手順 1]
2. [手順 2]
3. [手順 3]

# 想定挙動

<!-- 何が起こると予想したかを明確かつ簡潔に説明。 -->

[想定していた動作をここに記載]

# その他

[補足事項をここに記載]
```

## Abount INITIAL.md

INITIAL.md is an input used by the subsequent @.claude/commands/generate-prp.md command.
The content should be written in English, concisely and without unnecessary detail, following the template below.

## INITIAL.md Template

```
## FEATURE:
[Describe what you want to build - be specific about functionality and requirements]

## EXAMPLES:
[List any example files in the examples/ folder and explain how they should be used]

## DOCUMENTATION:
[Include links to relevant documentation, APIs, or MCP server resources]

## OTHER CONSIDERATIONS:
[Mention any gotchas, specific requirements, or things AI assistants commonly miss]

## ISSUE LINK:
[Put related issue link]
```

## Output

Save as: `INITIAL.md`
