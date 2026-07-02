# Agent Guide

## Project Shape

This frontend is a small Vite React SPA for submitting and viewing customer
feedback. Keep it simple, typed, and easy to review.

- `src/App.tsx`: page state, API calls, and high-level composition.
- `src/components`: presentational form/list/status components.
- `src/lib`: API client and domain helpers.
- `src/constants.ts`: shared UI/domain constants.
- `src/types.ts`: shared TypeScript types.
- `src/__tests__`: Jest and Testing Library tests.

## Patterns

- Use function components and React hooks only.
- Keep API calls in `src/lib/feedbackApi.ts`.
- Keep form/domain validation helpers in `src/lib/feedback.ts`.
- Keep shared literal values in `src/constants.ts`.
- Prefer explicit props types near the component that uses them.
- Avoid global mutable state and extra state libraries.
- Do not duplicate backend/OpenAPI rules unless the UI needs immediate feedback.

## Styling

- Use Tailwind utility classes; do not add component CSS files.
- Reuse the existing color tokens: `cafe`, `sage`, and `ink`.
- Keep the cafe UI quiet and practical: simple borders, small radius, readable
  spacing, and clear focus states.
- Preserve accessible labels, roles, and keyboard-friendly controls.
- Avoid decorative-only UI, gradients, large hero sections, and unrelated visual
  flourishes.

## Testing

- Use Jest with Testing Library.
- Test user-visible behavior and validation helpers first.
- Snapshot tests are acceptable for small stable components, but update them
  intentionally with `corepack pnpm test -- --updateSnapshot`.
- Keep test data small and realistic.

## Quality Tools

Use pnpm from `frontend-spa`.

```bash
corepack pnpm install
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm test:ci
corepack pnpm build
```

Use Corepack when pnpm is not installed directly.

## Local Run

```bash
corepack pnpm dev
```

The Vite dev server proxies `/api` to `http://127.0.0.1:8000`.

Frontend: `http://127.0.0.1:5173`

## Style

- Keep imports at the top.
- Keep components focused and reasonably small.
- Use `type` imports where possible.
- Let TypeScript narrow values instead of using broad casts.
- Comments should explain non-obvious intent, not restate JSX.
- Keep generated folders such as `dist`, `coverage`, and `node_modules` out of
  Git.
