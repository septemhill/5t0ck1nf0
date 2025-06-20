# OpenCode Guidelines for Agentic Coding in `qdash`

Welcome, Agent. This document provides essential guidelines for contributing to this repository. Adhering to these principles ensures code consistency and maintainability.

## Commands

- **Build:** `pnpm build` or `next build`
- **Lint:** `pnpm lint` or `next lint`
- **Dev Server:** `pnpm dev` or `next dev`
- **Start Server:** `pnpm start` or `next start`

Note: Specific test commands are not configured in `package.json`.

## Code Style

- **Language:** Use TypeScript (`.ts`, `.tsx`). Ensure strict typing as per `tsconfig.json`.
- **Imports:** Use `@/` alias for absolute imports from the project root.
- **Formatting:** Adhere to standard Prettier/ESLint formatting if configured (check configuration files if present, none found via initial analysis).
- **Naming:** Use PascalCase for React components and files, camelCase for variables, functions, and hooks.
- **Styling:** Utilize Tailwind CSS classes for styling components. Refer to `tailwind.config.ts` for theme details. Custom CSS should be minimal and added to `app/globals.css` if necessary.
- **Components:** Create reusable React components in the `components/` directory.
- **Hooks:** Custom hooks should reside in the `hooks/` directory.
- **Error Handling:** Implement robust error handling, especially in data fetching and user interactions.

No specific Cursor or Copilot rule files were found in the repository.
