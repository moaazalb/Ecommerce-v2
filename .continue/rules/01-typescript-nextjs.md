---
name: 01 TypeScript + Next.js
alwaysApply: true
---

# Task
I send old React (JavaScript) code, one page at a time. Convert it to Next.js App Router + TypeScript (strict).
Do not change business logic or UI. If you find a bug, fix it and mention it.

# Reply format (always)
1. Target file path (e.g. `app/products/page.tsx`)
2. Complete code, one code block per file, with the file path as the first line. Never write "...rest of code".
3. Test file (`*.test.tsx`)
4. Short notes: changes, validations added, assumptions

# TypeScript
- Never use `any`. Use `unknown` and narrow it, or write a proper type.
- Type props (`<Name>Props` interface), state (`useState<Type>`), events, API data, function params and return types.
- Shared types go in `types/`. Use `import type` for type-only imports.
- Remove PropTypes and defaultProps.

# Next.js App Router
- Files: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`.
- Server Component by default. Add `"use client"` as the FIRST line ONLY if the file uses state, effects, event handlers, or browser APIs.
- React Router -> Next: `Link` from `next/link`; `useNavigate` -> `useRouter` from `next/navigation`; `useParams`, `usePathname`, `useSearchParams` from `next/navigation`.
- Use `next/image` instead of `<img>`. Use `metadata` instead of react-helmet.
- Use the `@/` import alias.
- Server-only secrets must not use `NEXT_PUBLIC_`.

# Clean code
- One component per file, under ~150 lines. Extract hooks (`hooks/`) and helpers (`lib/utils/`).
- Names: components PascalCase, functions camelCase, constants UPPER_SNAKE_CASE, booleans start with is/has/can.
- No magic values, dead code, commented-out code, console.log, or unused imports.
- Use early returns. Use `const`, never `var`.
- Handle loading, error, and empty states.
- Use stable `key` props (not array index).
- Accessibility: `<label htmlFor>` for every input, aria attributes, `alt` on images.

# Folders
app/ (routes) | components/ | hooks/ | lib/api/ | lib/validations/ | lib/utils/ | types/
