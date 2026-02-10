# Petshop Mobile App - Software Design Document (SDD)

## 1. Architecture Overview
The application will be built using **React Native** (Expo) with a **Feature-First** modular architecture. This ensures scalability by keeping related components and logic together.

### Technology Stack
- **Framework**: React Native (via Expo SDK 52+).
- **Language**: TypeScript.
- **Navigation**: Expo Router (Filesystem-based routing).
- **State Management**: Zustand (Global UI state) + React Query (Data fetching/caching - if remote).
- **Database**: SQLite (via `expo-sqlite`) using **Drizzle ORM**.
- **UI/Styling**: NativeWind (TailwindCSS) or Custom StyleSheet with Design System tokens.

## 2. Directory Structure
The project will follow a strict organization pattern to separate concerns and improve maintainability.

```
/src
  /components           # Global shared UI components (Buttons, Inputs, Layouts)
  /constants            # App-wide constants (Colors, Fonts, Configs)
  /hooks                # Global custom hooks (useTheme, useAuth)
  /navigation           # Navigation layout and types (if not fully Expo Router)
  /screens              # Feature-based Screen organization
    /Home
      /components       # Components specific to Home screen
      HomeScreen.tsx    # Main entry for Home
    /Clients
      /components
      /hooks            # Hooks specific to Clients logic
      ClientsScreen.tsx
    /PetDetails
      /components
      PetDetailsScreen.tsx
  /services             # Business Logic & External Interactions
    /api                # API calls (if applicable)
    /validations        # Schema validations (Zod)
  /storage              # Data Persistence Layer
    /database           # Database connection & setup
    /schema             # Drizzle schema definitions
    /daos               # Data Access Objects (Direct DB interactions)
  /context              # React Contexts (Theme, Auth)
  /types                # Global TypeScript interfaces
  /utils                # Helper functions (Date formatting, String manipulation)
/app                    # Expo Router Entry points (connects to src/screens)
```

## 3. System Modules

### 3.1. Screens (Feature Modules)
Each screen folder is a self-contained module containing:
- **Main Screen Component**: The route entry point.
- **Local Components**: UI parts used only in this screen.
- **Local Hooks**: Logic specific to this screen (view models).

### 3.2. Service Layer (`src/services`)
handles complex business logic independent of UI.
- `ClientService`: Orchestrates Owner/Pet rules.
- `ScheduleService`: Algorithms for slot availability.
- `FinanceService`: Calculations for reports.

### 3.3. Storage Layer (`src/storage`)
- **Schema**: Defines tables using Drizzle ORM.
- **Initialization**: Sets up the SQLite database.
- **Repositories/DAOs**: Functions to perform CRUD operations (e.g., `getOwners()`, `addPet()`).

## 4. Data Flow
1. **Screen/Component** triggers action (User Input).
2. **Service/Hook** validates data.
3. **Storage Layer** executes DB query via Drizzle.
4. **UI** updates via state change or data refetch.

## 5. Security & Privacy
- Local-first architecture (SQLite).
- Data validation at Service layer.
