# Petshop Project - Agent Guidelines

This document provides instructions and constraints for AI agents working on this project to ensure consistency, quality, and adherence to the architecture.

## 1. Core Principles
- **Architecture First**: Always follow the architectural patterns defined in `docs/sdd.md`.
- **Type Safety**: Use TypeScript for all code. Avoid `any`. Define interfaces in `src/types`.
- **Local-First**: The app uses SQLite via Drizzle ORM. All data persistence must go through `src/storage`.
- **Business Logic Separation**: Keep business logic in `src/services`. Screens should only handle UI and call services.
- **Premium UI**: UI components must follow a consistent, high-quality design pattern. Use `src/components/ui` for shared base components.

## 2. Directory Structure Rules
Agents MUST strictly adhere to the following structure:
- `src/screens/<Feature>/`: Feature folder.
  - `HomeScreen.tsx`: Main entry.
  - `components/`: Feature-specific UI components.
  - `hooks/`: Feature-specific hooks.
- `src/services/`: Shared business logic.
- `src/storage/`: Database schema, DAOs, and connection setup.
- `src/components/ui/`: Global, reusable design system components.

## 3. Workflow for New Features
1. **Plan**: Analyze existing services and storage if a new data entity is needed.
2. **Database**: Update `src/storage/schema` and generate migrations (if applicable).
3. **Service**: Implement business logic in `src/services`.
4. **UI**: Create the screen in `src/screens` and components in its local `components` folder.
5. **Navigation**: Link the new screen in the `app/` router directory.

## 4. Coding Standards
- Use **Functional Components** and **Hooks**.
- Use **Zustand** for global UI state (e.g., theme, current user).
- Use **Drizzle ORM** for all DB queries.
- Prefer **Tailwind/NativeWind** or clean, modular **StyleSheet**.
- Document complex logic with comments.

## 5. Documentation
- Keep `docs/prd.md` and `docs/sdd.md` updated if there are significant changes to features or architecture.
- Use `task.md` in the brain directory to report progress to the user.

## 6. Prohibited Actions
- DO NOT create large, monolithic screen files. Split them into components early.
- DO NOT bypass the service layer to call the database directly from screens.
- DO NOT use external component libraries unless explicitly requested by the user.
