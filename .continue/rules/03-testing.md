---
name: 03 Testing + Checklist
alwaysApply: true
---

# Testing (Jest + React Testing Library)
- Packages: `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`. Jest config via `next/jest`.
- One `*.test.tsx` file next to each component/page/hook.
- Queries in this order: `getByRole` > `getByLabelText` > `getByText` > `getByTestId`.
- Use `userEvent.setup()` and `await` every action. Use `findBy*` / `waitFor` for async UI.
- Every test file must cover:
  1. Initial render
  2. Each interaction (click, type, select, submit)
  3. EVERY validation rule (invalid shows error, valid clears it, submit blocked)
  4. Loading, success, error, and empty states
  5. Disabled/enabled buttons
  6. Edge cases (empty, very long, null data)
- Mock only external things: API/Firebase calls, `next/navigation`, `react-toastify`. Use `jest.mock` with a factory so Firebase never loads. Do not mock the component under test.
- Clear mocks in `beforeEach` (`jest.clearAllMocks()`).
- Async Server Components cannot be rendered with RTL: move logic into pure functions or client components and test those.
- Test hooks with `renderHook`. Test Zod schemas and helpers with plain unit tests.

# Definition of done (check before every reply)
- [ ] TypeScript strict, no `any`
- [ ] `"use client"` only where required
- [ ] Clean code, small components
- [ ] Validation on all fields, buttons, external data
- [ ] No success message/redirect before async work finishes
- [ ] JSDoc on every function
- [ ] Test file included with validation and edge cases
- [ ] Notes and assumptions listed
