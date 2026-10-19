# GoExplore — Frontend

React + Vite, Arabic / RTL. Talks to the Laravel REST API described in the SRS.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:5173/login.

## Configuration (`.env.local`, see `.env.example`)

| Variable            | Meaning                                                       |
| ------------------- | ------------------------------------------------------------- |
| `VITE_API_URL`      | Laravel API base URL, e.g. `http://localhost:8000/api`        |
| `VITE_USE_MOCK_API` | `true` = in-browser mock (no backend needed), `false` = real API |

## Structure

```
src/
  styles/theme.css      design tokens (colors, fonts, radii) — use these, not raw hex
  components/           shared UI: Logo, TextField, Switch, icons, ProtectedRoute
  context/              AuthProvider + useAuth (current user, login/register/logout)
  services/             api.js (fetch wrapper), authService.js, mockAuth.js
  utils/validation.js   client-side form rules + Arabic messages
  pages/splash/         Intro animation, the first screen (/)
  pages/auth/           Sign in / Register (UC-U01, UC-U02)
  pages/onboarding/     Interests setup wizard after registration (UC-U12 / UC-U13)
```

Flow: `/` (intro animation) → `/login` or `/register` → `/onboarding` (4 steps) → `/home`.

## Auth API contract expected from the backend

| Method | Path             | Body                                                      | Response          |
| ------ | ---------------- | --------------------------------------------------------- | ----------------- |
| POST   | `/auth/register` | `name, username, email, password, password_confirmation`  | `{ user, token }` |
| POST   | `/auth/login`    | `login` (email or username), `password`, `remember`       | `{ user, token }` |
| POST   | `/auth/logout`   | —                                                         | 204               |
| GET    | `/auth/me`       | —                                                         | `{ user }`        |

Validation errors use Laravel's 422 format (`{ message, errors: { field: [..] } }`);
`username_taken` / `email_taken` codes get Arabic messages, other messages are shown as sent.
Bad credentials should return 401 — the UI shows one generic message (UC-U02 A1).

## Preferences API

| Method | Path           | Body / Response                                   |
| ------ | -------------- | ------------------------------------------------- |
| GET    | `/preferences` | → `{ preferences }` (`null` if none saved)        |
| PUT    | `/preferences` | preferences object → `{ preferences }`            |

The full preferences shape (field names and allowed ids) is documented at the top of
`src/services/preferencesService.js`; option ids live in `src/pages/onboarding/onboardingOptions.js`.
