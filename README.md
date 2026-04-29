# Habit Tracker PWA

A mobile-first, installable Progressive Web App (PWA) for tracking daily habits. Built with Next.js 15, Tailwind CSS, and local persistence.

## Project Overview
Habit Tracker is designed for simplicity and reliability. It allows users to create, manage, and track habits with immediate feedback on their current streaks. The app is fully functional offline after the first load and can be installed on mobile devices and desktops alike.

## Setup Instructions
1. **Clone the repository** (if applicable) or access the project folder.
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Environment variables**: Ensure a `.env.example` exists. For development, a `NEXT_PUBLIC_GEMINI_API_KEY` is supported but not strictly required for the core habit functionality.

## Run Instructions
*   **Development Server**:
    ```bash
    npm run dev
    ```
    The app will be available at `http://localhost:3000`.
*   **Production Build**:
    ```bash
    npm run build
    ```
*   **Start Production Server**:
    ```bash
    npm run start
    ```

## Test Instructions
*   **Unit & Integration Tests (Vitest)**:
    ```bash
    npm run test
    ```
*   **Coverage Report**:
    ```bash
    npx vitest run --coverage
    ```
*   **End-to-End Tests (Playwright)**:
    ```bash
    npx playwright test
    ```

## Local Persistence Structure
The app uses `window.localStorage` for its data layer, ensuring that your data stays on your device without the need for a complex backend for basic use. The keys used are:
- `habit-tracker-users`: Stores an array of user objects (id, email, hashed-password-placeholder).
- `habit-tracker-session`: Stores the currently logged-in user's metadata.
- `habit-tracker-habits`: Stores the global list of habits. Each habit contains a `userId` field to filter ownership.

## PWA Implementation
- **Manifest**: Located at `/public/manifest.json`, it defines the theme colors, display mode (`standalone`), and identifies the `/icons/icon-192.png` and `/icons/icon-512.png` for installation.
- **Service Worker**: `/public/sw.js` handles caching of the "App Shell" (HTML, CSS, Manifest). This allows the app to load even without an internet connection.
- **Registration**: The sw is registered via a `dangerouslySetInnerHTML` script in the root `layout.tsx` to ensure it boots as early as possible on the client.

## Trade-offs & Limitations
- **Client-Side Only**: Data is contained within the browser's local storage. Clearing browser data will delete habits. There is currently no cross-device synchronization.
- **Simple Caching**: The Service Worker caches the primary shell but does not implement complex background sync for data, as data is currently 100% local.
- **Security**: Local password storage is used for demonstration of flows; in a production SaaS environment, this would be handled via a secure server-side auth provider like Firebase or Auth0.

## Test Mapping
The following table maps our test suite to the verified application behaviors:

| Test File | Describe Block | Verified Behavior |
| :--- | :--- | :--- |
| `tests/unit/slug.test.ts` | `getHabitSlug` | URL-safe name generation, trimming, and character sanitization. |
| `tests/unit/validators.test.ts` | `validateHabitName` | Input constraints (required, length limits, whitespace handling). |
| `tests/unit/streaks.test.ts` | `calculateCurrentStreak` | Logic for counting consecutive completions, handling gaps, and duplicates. |
| `tests/unit/habits.test.ts` | `toggleHabitCompletion` | Idempotent toggling logic, ensuring no internal state mutation. |
| `tests/integration/auth-flow.test.tsx` | `auth flow` | Functional UI tests for Signup/Login, validation errors, and session storage. |
| `tests/integration/habit-form.test.tsx` | `habit form` | UI interactions for CRUD operations, streak updates, and confirmation dialogs. |
| `tests/e2e/app.spec.ts` | `Habit Tracker app` | Full flow validation: Auth redirects, Persistence, Sidebar/Dashboard flows, and PWA offline loading. |
