# GoExplore — Frontend

React + Vite, Arabic / RTL. Implements the GoExplore prototype screens (tatreez design) and
talks to the Laravel REST API described in the SRS.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:5173. With `VITE_USE_MOCK_API=true` you can sign in with the demo
account (created on first sign-in by `src/services/mockAuth.js`):
username `mahmoud.jabr`, password `GoExplore2026`. Any account you register works too.

The admin (`/admin/login`) and business (`/business/login`) sign-ins accept any valid email +
password and any 6-digit code until the staff auth API exists (`src/services/staffSession.js`).

## Configuration (`.env.local`, see `.env.example`)

| Variable            | Meaning                                                          |
| ------------------- | ---------------------------------------------------------------- |
| `VITE_API_URL`      | Laravel API base URL, e.g. `http://localhost:8000/api`           |
| `VITE_USE_MOCK_API` | `true` = in-browser mock (no backend needed), `false` = real API |

## Screens and routes

| Route | Screen | Use cases |
| --- | --- | --- |
| `/` | Redirects: visitors → `/login`, signed-in users → `/home` | — |
| `/login`, `/register` | Sign in / create account | UC-U01, UC-U02 |
| `/preferences` | 4-step preferences wizard | UC-U11 – UC-U14 |
| `/home` | Feed: stories, highlighted places, posts, suggestions | UC-SR-02, UC-SR-04 |
| `/post/:id` | Post dialog: carousel, comments, like, report, delete own | UC-SR-03/05/06/12 |
| `/story/:user` | Story viewer | — |
| `/new-post` | New post (pick up to 5 images, caption, place) | UC-SR-01 |
| `/settings` | Settings & activity, logout | UC-U03 |
| `/places` | Discover: NL search hero, top 2 per category | UC-PB-02, UC-AI-02 |
| `/category/:id` | One category, ranked | UC-PB-02 |
| `/place/:id` | Place details, rate & review, save | UC-PB-01/03/04 |
| `/map` | Illustrated Nablus map | FR-14 |
| `/search?q=` | Explore grid / people & places search with NL suggestions | UC-AI-02 |
| `/me`, `/u/:username` | Profile (own / other / private) | UC-U05, UC-SR-17 |
| `/edit` | Edit profile dialog | UC-U06 – UC-U10 |
| `/inbox`, `/notifications` | Messages, notifications | UC-SR-15 |
| `/admin/login`, `/admin` | Admin sign-in (2 steps) and dashboard | UC-SR-07, UC-PB-06/07 |
| `/business/login`, `/business/signup`, `/business` | Business owner sign-in, registration, dashboard | UC-PB-06, UC-PB-08 – 11 |

## Structure

```
public/img, public/assets  photos, logo and tatreez artwork from the design
src/
  styles/                  design stylesheets: app-theme.css (social app), site-theme.css
                           (sign-in, preferences, admin, business), pages/*.css (one per
                           screen, scoped to .p-<Screen>), app.css (small additions)
  components/              AppShell (header + phone dock), PostCard, PlaceCard, Avatar, Photo,
                           Overlay, OtpInput, SiteHeader, Icon…
  data/                    demo content: places, categories, users, posts, explore grid
  context/                 AuthProvider, useAuth, useCurrentProfile
  services/                api.js, auth / preferences services + mocks, interactions.js
                           (likes, saves, ratings… in localStorage), recommendations.js
                           (client-side NL preference extraction), staffSession.js
  pages/                   one folder per area (home, places, search, profile, inbox,
                           notifications, preferences, auth, staff)
```

Each screen wraps its markup in `p-<Screen> th-app` (or `th-site`); keep those class names,
they select the screen's stylesheet.

## What still runs in the browser only

Until the matching API endpoints exist, these are kept in `localStorage` (`gx_interactions`):
likes, saves, follows, ratings, comments, published posts, reports, profile edits, and the
admin / business dashboard decisions. Places, users and posts come from `src/data/`.
`src/services/recommendations.js` is a keyword-based stand-in for the NLP endpoint.

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
| DELETE | `/preferences` | → 204                                             |

The full preferences shape is documented at the top of `src/services/preferencesService.js`;
option ids live in `src/pages/preferences/preferencesOptions.js`.
