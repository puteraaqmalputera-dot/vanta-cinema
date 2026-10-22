# VANTA CINEMA — Premium Vue 3 Movie & TV Discovery Platform

> *"Every story starts with discovery."*

VANTA CINEMA is a cinematic, editorial, and responsive web application engineered for motion picture and television exploration. Developed with **Vue 3**, **Vite**, **Pinia**, **Vue Router**, and responsive CSS custom properties, it combines data from two independent third-party entertainment APIs—**The Movie Database (TMDB)** and **TVmaze**—into a unified discovery interface.

This project was built to satisfy university frontend engineering criteria, delivering production-grade architecture, accessible HTML5 semantics, and anti-AI-slop design aesthetics inspired by the editorial restraint of Apple TV+ and Letterboxd.

---

## Table of Contents

1. [Architectural Overview](#architectural-overview)
2. [Technology Stack](#technology-stack)
3. [Key Features](#key-features)
4. [Third-Party APIs & Integration](#third-party-apis--integration)
5. [Client-Side Security Notice](#client-side-security-notice)
6. [Local Development & Setup (Windows PowerShell)](#local-development--setup-windows-powershell)
7. [Vercel Deployment Guide](#vercel-deployment-guide)
8. [Project File Hierarchy](#project-file-hierarchy)
9. [Academic Rubric Alignment](#academic-rubric-alignment)
10. [Attribution & Legal Disclaimers](#attribution--legal-disclaimers)

---

## Architectural Overview

VANTA CINEMA operates strictly as a modern **frontend single-page application (SPA)**. It maintains zero backend dependencies, utilizing browser native standards and modern JavaScript ES2022+:

- **Declarative Reactivity:** Built with Vue 3 Composition API (`<script setup>`).
- **Composite Entity Identity:** Unifies disparate API schemas through standardized entities (`tmdb:movie:<id>` and `tvmaze:show:<id>`), preventing collisions across cross-provider media.
- **Client Storage Persistence:** Saved media and watched states persist in browser `localStorage` using a versioned schema (`vanta_cinema_watchlist_v1`).
- **Resilient Request Handling:** Every external request employs an `AbortController` timeout wrapper, debounced search pipelines (~350ms), and categorized error mapping (401, 404, 429, 500, and offline network faults).

---

## Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | **Vue 3** (v3.5+) | Modern component model with Composition API |
| **Build Tool** | **Vite** (v5.4+) | Ultra-fast HMR and optimized Rollup production builds |
| **Routing** | **Vue Router** (v4.5+) | History-mode SPA routing, scroll restoration, route meta titles |
| **State Store** | **Pinia** (v2.2+) | Modular reactive store for watchlist and user preferences |
| **Styling** | **Vanilla CSS + Tokens** | Custom properties (`tokens.css`), responsive grids, CSS variables |
| **Icons** | **@lucide/vue** | Clean, accessible vector SVG icons |
| **Data Fetching**| **Native Fetch API** | Configured with abort timeouts and status error handling |
| **Deployment** | **Vercel** | Static hosting with SPA rewrite rules (`vercel.json`) |

---

## Key Features

### 1. Discover (Home Page — `/`)
- **Cinematic Backdrop Hero:** Live trending backdrop with dark readability gradients, metadata badges, ratings, and synopsis.
- **Manual Carousel Navigation:** Non-intrusive manual slider allowing users to browse featured titles without disorienting auto-sliding.
- **Trailer Playback:** Integrated modal playing official YouTube trailers without page reload, automatically terminating playback on close.
- **Content Rows:** Trending This Week, Popular Right Now, Critically Acclaimed, Genre Navigation Chips, Television Spotlight (from TVmaze), and Mood Match Banner.

### 2. Movie Explorer (`/movies`)
- **Debounced Keyword Search:** Live searching via `/search/movie` with 350ms debounce and active request cancellation.
- **Structured Discovery Filters:** Dynamic genre selection, release year filtering, minimum rating thresholds (e.g., 7.0+, 8.0+), and sorting orders.
- **URL Query Parameter Synchronization:** Filter state (`q`, `genre`, `year`, `rating`, `sort`) mirrors to URL queries, preserving state across browser back/forward navigation.
- **Graceful Mode Distinction:** Clear visual separation between search mode and whole-database discovery mode.

### 3. Movie Details (`/movie/:id`)
- Deep-linked view retrieving full movie metadata via `append_to_response=credits,videos,recommendations,similar`.
- Renders director, screenwriter, starring cast carousel with portrait headshots, budget facts, runtime, and similar titles.
- Official trailer modal support with `Escape` key dismissal.

### 4. TV Series Explorer (`/tv`)
- Demonstrates **TVmaze API** integration (open, requires no API key).
- Debounced series search by title.
- Curated top-rated television catalog.
- **Today's Airing Schedule:** Live broadcast schedule fetching current US network airings directly from TVmaze.

### 5. TV Series Details (`/tv/:id`)
- Show artwork, broadcast network/platform, status (Ended, Running), premiere date, and runtime.
- **Interactive Season & Episode Guide:** Groups episodes by season with an intuitive tab selector, displaying air dates, runtimes, and sanitized summaries.
- Cast roster with character mappings.

### 6. Personal Watchlist (`/watchlist`)
- Save any movie or TV series directly from cards or details pages.
- Mark titles as "Watched" or "To Watch".
- Real-time filtering by status (All, To Watch, Watched) and media type (Movies vs. TV Series).
- Persisted locally in browser `localStorage`. No database or user authentication required.

### 7. Mood Match Engine (`/mood-match`)
- Signature interactive feature mapping human emotional states to deterministic discovery queries:
  - **Feel Good:** Uplifting comedies, wholesome animation, and family cinema.
  - **Mind-Bending:** Cerebral sci-fi, mind-twisting mysteries, and psychological cinema.
  - **Dark & Intense:** Gritty noir, crime sagas, and edge-of-seat thrillers.
  - **Romantic:** Intimate romance and relationship dramas.
  - **Adrenaline Rush:** High-octane action choreography and epic adventures.
  - **Weekend Chill:** Intriguing documentaries, musical films, and relaxing stories.
- Optional Era Filter (Modern, 2010s, 2000s, Classics) and minimum rating controls.
- "Reshuffle" capability pulling new titles across discovery page pools.

---

## Third-Party APIs & Integration

This project integrates **three (3) distinct third-party REST APIs**, fulfilling the academic requirement of **1 Unique API + 2 Shared APIs**:

### 1. API 1 (Unique): The Movie Database (TMDB)
- **Status:** Compulsory Unique API (Dedicated to this project).
- **Base URL:** `https://api.themoviedb.org/3`
- **Authentication:** Bearer Token via `VITE_TMDB_READ_TOKEN` (Read Access v4).
- **Key Endpoints:**
  - `GET /trending/movie/week`
  - `GET /movie/popular`
  - `GET /movie/top_rated`
  - `GET /discover/movie`
  - `GET /search/movie`
  - `GET /genre/movie/list`
  - `GET /movie/{id}?append_to_response=credits,videos,recommendations,similar`

### 2. API 2 (Shared #1): TVmaze (Television Series & Airing Schedule)
- **Status:** Open Public API.
- **Base URL:** `https://api.tvmaze.com`
- **Authentication:** None required. Public endpoints.
- **Key Endpoints:**
  - `GET /search/shows?q={query}`
  - `GET /shows?page={page}`
  - `GET /shows/{id}?embed[]=cast&embed[]=seasons`
  - `GET /shows/{id}/episodes`
  - `GET /shows/{id}/seasons`
  - `GET /schedule?country=US&date={YYYY-MM-DD}`

### 3. API 3 (Shared #2): Hipo Universities API (Academic Directory)
- **Status:** Shared API satisfying the requirement: **University details (name, country, website)**.
- **Base URL:** `http://universities.hipolabs.com/search` & fallback `https://raw.githubusercontent.com/Hipo/university-domains-list/master/world_universities_and_domains.json`
- **Authentication:** None required (Public).
- **Key Details Displayed:**
  - **Name:** Official higher education institution name.
  - **Country:** Country location with multi-nation filter (Malaysia, US, UK, Australia, Japan, etc.).
  - **Website:** Verified clickable official web URL (`web_pages[0]`).
- **Features:** 350ms debounced search, quick country pills, live status indicator, loading skeletons, error handling, and zero-result empty state.

---

## Client-Side Security Notice

> [!WARNING]
> In client-side single-page web applications (like Vue, React, or Vite SPAs), any environment variable prefixed with `VITE_` is bundled directly into the compiled JavaScript files sent to the browser. **These values are not secret and can be inspected in browser developer tools.**
>
> For this university academic project, use only a dedicated **TMDB Read Access Token (v4)** created for development purposes. Never commit production tokens or credentials granting administrative privileges.

---

## Local Development & Setup (Windows PowerShell)

### Prerequisites
- [Node.js](https://nodejs.org/) version 18.0.0 or higher (Tested on Node v24.20.0).
- Windows PowerShell or Command Prompt.

### 1. Clone or Open Workspace
Open Windows PowerShell in the project directory:
```powershell
cd C:\Users\USER\Desktop\PutraCinema
```

### 2. Install Dependencies
```powershell
npm.cmd install
```
*(On Windows systems where script execution policies are restricted, use `npm.cmd` rather than `npm`)*.

### 3. Configure TMDB Token
Copy the environment template:
```powershell
Copy-Item .env.example .env
```
Open `.env` in your editor and enter your TMDB v4 Read Access Token:
```env
VITE_TMDB_READ_TOKEN=your_tmdb_read_access_token_here
```
> **Quick Session Testing:** If you launch the application without setting `.env`, a setup card will appear in the UI allowing you to paste your token directly into the current browser session.

### 4. Run Development Server
```powershell
npm.cmd run dev
```
Open your browser at `http://localhost:5173`.

### 5. Production Build & Preview
To verify the production compilation:
```powershell
npm.cmd run build
npm.cmd run preview
```

---

## Vercel Deployment Guide

VANTA CINEMA is pre-configured for static deployment on [Vercel](https://vercel.com):

1. Push your repository to GitHub, GitLab, or Bitbucket.
2. In the Vercel Dashboard, select **Add New Project** and import the repository.
3. Configure the build parameters:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. In **Environment Variables**, add:
   - **Key:** `VITE_TMDB_READ_TOKEN`
   - **Value:** *(Your TMDB Read Access Token)*
5. Click **Deploy**.

The bundled `vercel.json` ensures that Vue Router history routes (`/movies`, `/tv/:id`, `/watchlist`, etc.) properly fallback to `/index.html` without 404 errors on browser page reloads:

```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## Project File Hierarchy

```text
PutraCinema/
├── .env.example              # Template for environment variables
├── .gitignore                # Git exclusions
├── index.html                # HTML5 entry with preconnected Google Fonts
├── package.json              # Project dependencies & npm scripts
├── README.md                 # Complete documentation & user guide
├── vercel.json               # Vercel SPA routing rewrite rules
├── vite.config.js            # Vite build configuration & '@' path alias
└── src/
    ├── App.vue               # Root layout shell with header, footer, & transitions
    ├── main.js               # Application bootstrap (Pinia, Router, Styles)
    ├── assets/               # Static assets & media
    ├── components/
    │   ├── common/
    │   │   ├── BackToTop.vue        # Smooth back-to-top floating button
    │   │   ├── ConfigBanner.vue     # Helpful TMDB credential helper & session prompt
    │   │   ├── EmptyState.vue       # Zero-result feedback with actionable CTAs
    │   │   ├── ErrorState.vue       # Network & API error state with retry
    │   │   ├── FilterControls.vue   # Genre, year, rating, and sorting controls
    │   │   ├── GenrePill.vue        # Accessible genre badges
    │   │   ├── MediaPoster.vue      # Aspect-ratio poster container with fallback art
    │   │   ├── PageTransition.vue   # Smooth view transition wrapper
    │   │   ├── RatingBadge.vue      # Star score badge with high-score highlight
    │   │   ├── SearchInput.vue      # Debounced search bar with clear button
    │   │   ├── SectionCarousel.vue  # Horizontal scrolling card carousel
    │   │   ├── SectionHeader.vue    # Section heading with eyebrow & action links
    │   │   ├── SkeletonCard.vue     # Shimmer skeleton for individual cards
    │   │   ├── SkeletonGrid.vue     # Responsive skeleton grid
    │   │   ├── TrailerModal.vue     # YouTube trailer dialog with Escape dismissal
    │   │   └── WatchlistButton.vue  # Toggle button for saving to watchlist
    │   ├── layout/
    │   │   ├── AppFooter.vue        # Semantic footer with attributions & disclaimers
    │   │   ├── AppHeader.vue        # Glassmorphic header with navigation & search
    │   │   └── MobileNavigation.vue # Slide-out drawer menu for mobile viewports
    │   ├── mood/
    │   │   └── MoodCard.vue         # Emotional category card with icon & description
    │   ├── movie/
    │   │   └── MovieCard.vue        # Poster, rating, year, and hover animation
    │   ├── tv/
    │   │   └── TVShowCard.vue       # TVmaze series card with network & status
    │   └── watchlist/
    │       └── WatchlistItem.vue    # Saved item row with watched toggle & remove
    ├── composables/
    │   └── useDebounce.js           # Debounced ref and function helpers
    ├── router/
    │   └── index.js                 # 8 routes with scrollBehavior & page titles
    ├── services/
    │   ├── apiClient.js             # Fetch wrapper with timeout & error classification
    │   ├── normalize.js             # Data standardizer for TMDB & TVmaze
    │   ├── tmdb.js                  # TMDB endpoints & image URL generators
    │   └── tvmaze.js                # TVmaze endpoints & HTML stripping helper
    ├── stores/
    │   └── watchlist.js             # Pinia store backed by localStorage
    └── styles/
        ├── global.css               # Global typography, resets, & reduced-motion
        ├── tokens.css               # Design system colors, fonts, spacing, shadows
        └── utilities.css            # Buttons, layout containers, and skeleton styles
```

---

## Academic Rubric Alignment

| Rubric Criterion | Weight | Code Evidence & Implementation Details |
| :--- | :---: | :--- |
| **Vue.js Framework** | 15% | Single-file components (SFCs), Composition API (`<script setup>`), reactive `ref`/`computed`/`watch`, Pinia store (`watchlist.js`), and Vue Router with deep links. |
| **Unique API (TMDB)** | 10% | Complete integration of TMDB v3 REST API: trending, popular, top-rated, keyword search, structured discovery, genres, and movie details with `append_to_response`. |
| **2nd API (TVmaze)** | 10% | Independent integration of TVmaze: live show search, series details, season/episode guide, and today's TV broadcast schedule. |
| **API Integration Quality** | 15% | Centralized `apiClient.js` with timeout handling, normalized data schemas (`normalize.js`), safe HTML stripping, composite IDs (`tmdb:movie:*`, `tvmaze:show:*`). |
| **HTML Semantic** | 8% | Strict semantic elements: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<dialog>`, skip links, and ARIA attributes. |
| **CSS Responsive** | 10% | Custom design tokens (`tokens.css`), responsive CSS Grid/Flexbox, tested breakpoints (375px, 768px, 1024px, 1440px), no horizontal overflow. |
| **JavaScript** | 8% | Modern ES2022+, `AbortController` cancellation, custom debouncing composable, versioned `localStorage` data handling. |
| **Loading & Error State** | 7% | Animated shimmer skeletons, user-friendly error banners with retry triggers, zero-result empty states across all routes. |
| **Search & Filter** | 7% | Debounced search (~350ms), multi-criteria discovery (genre, year, rating, sort), synchronized with URL parameters for browser history restoration. |
| **Vercel Deployment** | 5% | Production `dist` build verification, `vercel.json` SPA rewrite rules, client-side routing fallback configuration. |
| **Code Quality** | 5% | Clean modular separation (`components/`, `services/`, `stores/`, `views/`, `styles/`), no unused frameworks, clear comments. |

---

## Attribution & Legal Disclaimers

1. **The Movie Database (TMDB):**
   - This product uses the TMDB API but is not endorsed or certified by TMDB.
   - All movie artwork, descriptions, and metadata are copyright of their respective owners and TMDB.
2. **TVmaze:**
   - Television metadata, schedules, and episode information are provided by the TVmaze open API under CC BY-SA 4.0.
3. **Educational Purpose:**
   - VANTA CINEMA is created solely as an academic frontend web development project.
   - This application does not stream, host, or distribute copyrighted video files or media.
