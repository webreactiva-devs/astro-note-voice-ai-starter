# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Astro-based voice note application with AI transcription capabilities. It's a full-stack app using React components within Astro pages, featuring authentication, voice recording with waveform visualization, and database storage.

**📋 IMPORTANT: Project Status & Planning**
- **Primary Reference**: `documents/project-plan.md` - Contains detailed TODO items showing what's completed vs pending
- **Supporting Docs**: 
  - `documents/project-specs.md` - Complete technical requirements and specifications
  - `documents/project-architecture.md` - System architecture diagrams and data flow
- **Current Status**: Voice recording UI is complete, but transcription/AI features and note management are still pending implementation

**Key Technologies:**
- **Framework**: Astro 5.12+ with server-side rendering (`output: "server"`)
- **Frontend**: React 19+ with TypeScript
- **Auth**: Better Auth with email/password (auto-login enabled)
- **Database**: Turso (SQLite) with Kysely query builder
- **Styling**: Tailwind CSS 4+ with shadcn/ui components
- **Audio**: Web Audio API with MediaRecorder for voice recording

## Development Commands

```bash
# Development
npm run dev              # Start development server on http://localhost:4321
npm run build           # Build for production
npm run preview         # Preview production build

# Database & Auth
npm run db:generate     # Generate Better Auth schema: npx @better-auth/cli@latest generate
npm run db:migrate      # Apply database migrations: npx @better-auth/cli@latest migrate
npm run auth:secret     # Generate secure auth secret: npx @better-auth/cli@latest secret

# Code Quality
npm run type-check      # TypeScript type checking: astro check
npm run lint           # Lint with Astro: astro check

# UI Components
npm run ui:add [component]  # Add shadcn component: npx shadcn@latest add [component]

# Utilities
npm run clean          # Clean build artifacts: rm -rf dist .astro node_modules/.astro
```

## Architecture Overview

### Core Architecture Patterns
- **Server-Side Rendered SPA**: Astro with React islands for interactivity
- **Authentication Middleware**: All requests pass through session validation in `src/middleware.ts`
- **Protected Routes**: Pages check `Astro.locals.user` for authentication state
- **Modular Components**: Voice recording uses 5 specialized React components working together

### Database Schema
The app uses Better Auth's automatic schema generation. Key tables:
- `users` (id, email, name) - managed by Better Auth
- Auth sessions and related tables - auto-generated

### Voice Recording Architecture
Complex multi-component system documented in `documents/voice-recording-flow.md`:

**Components:**
- `VoiceRecorder.tsx` - Main orchestrator with state machine
- `TimerDisplay.tsx` - Countdown/duration display (MM:SS format)
- `WaveformVisualizer.tsx` - Real-time green waveform during recording
- `AudioPlayer.tsx` - Playback controls with blue waveform
- `PlaybackVisualizer.tsx` - Waveform visualization during playback

**Recording States:**
`IDLE → RECORDING → PAUSED ⇄ RECORDING → STOPPED ⇄ PLAYBACK → STOPPED`

## Authentication System

### Better Auth Configuration
- **Provider**: Email/password with auto-signin after registration
- **Session Management**: Handled by `src/middleware.ts` - sets `Astro.locals.user` and `Astro.locals.session`
- **Client**: Use `authClient` from `src/lib/auth-client.ts` for frontend auth operations
- **Server**: Auth instance in `src/lib/auth.ts` connects to Turso database

### Route Protection Pattern
```astro
---
// In any .astro page that requires authentication
const user = Astro.locals.user;
if (!user) {
  return Astro.redirect("/login");
}
---
```

### Environment Variables Required
```env
BETTER_AUTH_SECRET=          # Generate with: npm run auth:secret
BETTER_AUTH_URL=             # http://localhost:4321 (dev) or production URL
PUBLIC_BETTER_AUTH_URL=      # Same as above, but public
TURSO_DATABASE_URL=          # libsql://your-db.turso.io
TURSO_AUTH_TOKEN=            # Turso authentication token
```

## File Structure & Conventions

### Import Aliases
- Use `@/*` for imports from `src/` (configured in `tsconfig.json`)
- Example: `import { authClient } from "@/lib/auth-client"`

### Component Structure
```
src/components/
├── ui/                     # shadcn/ui components (auto-generated)
├── VoiceRecorder.tsx      # Main recording orchestrator
├── AudioPlayer.tsx        # Playback with visualization
├── TimerDisplay.tsx       # Time formatting component
├── WaveformVisualizer.tsx # Recording waveform
├── PlaybackVisualizer.tsx # Playback waveform
├── DashboardContent.tsx   # Protected dashboard content
├── LoginForm.tsx          # Auth forms
└── RegisterForm.tsx
```

### Pages Structure
```
src/pages/
├── api/
│   └── auth/[...all].ts   # Better Auth API routes (catch-all)
├── index.astro            # Landing page
├── login.astro            # Login page (redirects if authenticated)
├── register.astro         # Registration page
├── dashboard.astro        # Protected dashboard
├── record.astro           # Voice recording interface
└── logout.astro           # Logout handler
```

## Development Guidelines

### Adding New Auth Routes
- Use Better Auth's automatic API routing in `pages/api/auth/[...all].ts`
- Check `Astro.locals.user` for authentication state in pages
- Use `authClient` methods in React components for auth operations

### Database Operations
- Better Auth handles user/session tables automatically
- Run `npm run db:migrate` after Better Auth updates
- Use Kysely for any custom database queries (see `src/lib/turso.ts`)

### Voice Recording Development
- Recording limit: 2 minutes (auto-stop)
- Supports pause/resume during recording
- Uses WebM/Opus format for audio capture
- Cleanup audio contexts and media streams properly
- See `documents/voice-recording-flow.md` for detailed component interaction

### Adding UI Components
- Use `npm run ui:add [component]` to add shadcn components
- Components are auto-configured for the project's Tailwind setup
- Follow existing component patterns in `src/components/ui/`

### Code Quality
- Run `npm run type-check` before commits
- TypeScript strict mode is enabled
- Use React 19+ patterns (no React imports needed in TSX files)

## Testing
No test framework is currently configured. Verify functionality manually through:
1. Authentication flow (register/login/logout)
2. Voice recording (record/pause/resume/stop/playback)
3. Route protection (accessing `/dashboard` without auth)
4. Database operations (user creation, session management)