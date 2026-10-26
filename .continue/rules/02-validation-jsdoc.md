---
name: 02 Validation + JSDoc
alwaysApply: true
---

# Validation (add everywhere it is needed)
- Use Zod schemas in `lib/validations/<name>.schema.ts`. Infer types with `z.infer`.
- Use `react-hook-form` + `@hookform/resolvers/zod` for forms with 2+ fields.
- Validate: required, min/max length, email, phone, number range, password + confirmation, dates, URLs, file type and size.
- Show an error message under each invalid field: `<p id="x-error" role="alert">`, and set `aria-invalid` and `aria-describedby` on the input.
- Buttons: disable submit while submitting or invalid; show a loading state; ask for confirmation before delete/destructive actions.
- Never show success or redirect before the async work has finished. `await` it inside try/catch, show an error on failure.
- Validate API responses, `params` and `searchParams` with Zod before using them.
- Validate again on the server (Route Handlers, Server Actions). Never use `dangerouslySetInnerHTML` with unsanitized input.

# JSDoc (every function)
Add a JSDoc block to EVERY function: components, hooks, helpers, handlers, Server Actions, Route Handlers.

```ts
/**
 * Short one-line description.
 *
 * @param {string} email - What this param is.
 * @param {number} [limit=10] - Optional param.
 * @returns {Promise<User[]>} What is returned.
 * @throws {Error} When it fails.
 */
```
- Components: describe each prop and add `@returns {JSX.Element}`.
- Comments explain WHY, not what.
