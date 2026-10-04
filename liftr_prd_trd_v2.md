# Liftr v2 — Product & Technical Specification

Status: Rewritten from scratch after a first build cycle. This version incorporates every decision, bug, and lesson learned, made explicit up front rather than discovered mid-build.

---

## 1. Product Vision

Liftr is a premium fitness/gym tracking app. Core loop: **Plan → Train → Log → Analyze → Progress → Plan again.**

**The flagship feature — what makes Liftr different from Strong, Hevy, or any generic tracker:** an interactive anatomical body (male and female, selectable) where every muscle is clickable. This is not a secondary feature bolted onto a workout logger — it is the primary visual identity of the app and should be treated as such in build priority, polish, and prominence.

---

## 2. Design System

### 2.1 Density & layout
**Dashboard-card style** (reference: Strong app) — several distinct, self-contained cards visible at once (recent workout, weekly summary, streak), generous spacing between them, clear visual hierarchy (1–2 primary/larger cards, rest secondary). Not minimal single-focus, not data-dense/graph-heavy by default.

### 2.2 Theme
**Metallic, chrome/silver-accented, finance-app-inspired** (cool-toned, sleek, professional). Reference: a dark finance-app UI where the page background is flat, plain dark — but elevated surfaces (cards, progress rings, chart bars/lines) carry a subtle brushed-metal gradient sheen. This is the exact application pattern to follow:

- **Page/screen background:** flat, plain color (dark charcoal/black in dark mode, clean light neutral in light mode) — no gradient, no texture.
- **Elevated surfaces** (primary dashboard cards, the active workout card, key stat cards): subtle metallic gradient sheen — a soft light-to-dark diagonal or radial gradient in silver/chrome tones, not a loud effect.
- **Data visualization specifically** (progress rings, bar charts, volume/consistency indicators): rendered with a brushed-metal gradient fill rather than a flat solid color — this is where the metallic identity is most visible and where it should be leaned into most.
- **Secondary/lower-priority cards and body text areas:** stay flat and clean — no metallic treatment, to preserve the "not cluttered" requirement.

Both **light and dark mode** get this treatment — the metallic sheen on elevated surfaces and charts applies in both modes, just with the base palette (background/text/border) inverted appropriately.

**Customizable, same pattern as the original theme system:** Dark/Light/System toggle, predefined accent colors plus a custom color option, surface intensity variants. Centralized design tokens (background, surface, border, text, accent, success, warning, danger) extended with metallic-specific tokens (e.g., `surface-metallic-gradient`, `chart-metallic-fill`) so the effect is consistent and swappable per-theme, never hardcoded per-component.

### 2.3 Navigation
**Bottom tab bar, 5 items:** Dashboard · Workouts · Body · Progress · Calendar
- **Exercises** is folded into Workouts (browse/search exercises from within the workout-starting flow, not a separate top-level tab)
- **Activity** (steps/bodyweight) is folded into Progress (as a tab/section within Progress, not separate)
- **Profile/Settings** lives behind a persistent avatar icon (e.g., top corner), not a tab slot

This was decided by ranking all 7 original sections by desired one-tap access; the top 5 distinct areas after merging map exactly to the 5 tabs above.

---

## 3. Technical Decisions (confirmed, do not silently revisit)

| Decision | Value |
|---|---|
| Database | **Supabase Postgres**, real tables from Phase 0 onward — never a local file store or in-memory storage, for anything, at any point |
| Auth | **Supabase Auth** |
| Row Level Security | Enabled **at table creation time**, every user-owned table, policies scoped to `auth.uid()` — not added later as a retrofit |
| 1RM formula | **Epley**: `1RM = weight × (1 + reps/30)`, except `reps === 1` returns weight exactly |
| PR categories | All four: heaviest weight, best estimated 1RM, best **single-set** volume, rep PR at a given weight. **Strict `>`** — an exact tie is never a new PR |
| Timestamps | Stored in **UTC**; converted to local timezone only for display. Recurrence date-walking done in UTC; local-time conversion happens only at the point of computing each occurrence's timestamp |
| Calendar consistency % | `completed scheduled ÷ explicitly scheduled`; unscheduled workouts excluded from denominator; 0 scheduled → 100% (documented as intentional) |
| API response shape | **One shape, every endpoint, no exceptions**: `{ data: { items: [...], total, page, limit } }` — even for non-paginated/single-item responses (e.g., a single profile is still `{ data: { items: [profile], total: 1, page: 1, limit: 1 } }`, or equivalently a defined single-item variant — pick one sub-convention and document it, but never let some endpoints return raw arrays/objects and others wrapped) |
| Internationalization | **i18n-ready architecture only, no translations yet.** All user-facing strings must go through a translation-key pattern from day one (even with only one `en` locale file) so no retrofit is ever needed — but do not add a language selector or second locale until explicitly instructed |
| Verification requirement | **Every phase's "done" claim must include a visible proof-check** — for data persistence specifically, this means confirming the relevant row actually appears in Supabase's Table Editor, not just a code-level report. This is a hard acceptance-criterion, not an optional nice-to-have |

---

## 4. The Anatomy Feature (flagship — detailed spec)

### 4.1 Body representation
Male and female body models, **selectable by the user** from the start (not male-only with female added later).

### 4.2 Interaction modes
Two toggleable modes when a muscle is selected:
- **Explore mode:** shows exercises that train this muscle (ranked by contribution weight), general muscle info (function, anatomy) — this mode only depends on the exercise/muscle catalog, no workout history needed.
- **My Stats mode:** shows the user's actual training data for this muscle — sets, volume, frequency, last trained, estimated exposure. Depends on real logged workout data and muscle exposure calculations.

### 4.3 Highlight views
Two distinct, separate views (not merged into one):
- **Per-workout highlight:** user picks a specific past workout from history; the body view highlights exactly which muscles that workout trained.
- **Overall heatmap:** the body shows relative recent training intensity across all workouts (e.g., last 7/30 days), using neutral high/moderate/low language — never ranking muscles as good/bad, consistent with the original PRD's muscle-balance rule.

### 4.4 Exercise videos
- Sourced via **embedded YouTube videos** (curated link per exercise) — no self-hosting, no licensing cost.
- **Every one of the 203 exercises** should eventually have a curated video, added incrementally rather than requiring all 203 before shipping anything.
- Store as a `videoUrl` field on the Exercise entity (already scoped for this in the original data model — just needs actual values populated).

### 4.5 Build sequencing (see Section 6)
The anatomy feature is split into two build passes:
1. **Explore-mode shell** (visual body, zoom/drill-down navigation, muscle selection, Explore mode with exercise recommendations, video embeds) — built early, right after the exercise/muscle catalog phase, since it only depends on that data.
2. **Data-driven modes** (My Stats mode, both highlight views) — built later, alongside the analytics/progress phase, once real workout and exposure data exists to visualize.

---

## 5. Full Feature Scope

Everything is now planned as an explicit phase — nothing deferred to an unplanned "later":

- Auth, profile, theme, navigation shell (Phase 0)
- Exercise/muscle catalog, contribution system, reverse search (Phase 1)
- Anatomy Explore-mode shell + video embeds (Phase 2)
- Workout logging, calculations, PR detection, templates, active-workout modal + rest timer (Phase 3)
- Calendar, scheduling, recurrence, consistency analytics (Phase 4)
- Activity (steps/bodyweight), progress charts, full muscle exposure analytics, global search, anatomy My Stats + highlight views (Phase 5)
- Detailed analytics expansion (trends, comparisons, exportable reports) (Phase 6)
- i18n verification pass (confirm the i18n-ready architecture actually has zero hardcoded strings, in preparation for eventually adding translations) (Phase 7)
- Dedicated design/polish pass (Phase 8)
- App store packaging — Google Play first, then Apple App Store (Phase 9)
- Monetization implementation (Phase 10)
- Stretch: AI coaching assistant, wearables, social, admin tooling (Phase 11, gated behind explicit approval)

**Phase 11 AI coaching assistant — full scope (build only once explicitly approved, after Phase 10):**
1. **Post-workout feedback:** rate/comment on a just-completed workout using real data (e.g., volume trend vs. recent sessions, notable PRs, consistency context).
2. **Next-session recommendations:** suggest what to train next based on recent history and muscle exposure data (e.g., "shoulders haven't been trained in 9 days, consider adding).
3. **Auto-generated routines:** build a full training plan/routine for the user to follow, based on their goals, history, and available equipment.

All three depend entirely on Phases 3–5's data (logging, PRs, muscle exposure) being accurate and complete — this is exactly why it's sequenced last, not first: bad advice built on unverified data is worse than no advice.

---

## 6. Monetization Plan

**Freemium**, gated by analytical depth rather than core functionality:

| Tier | Includes |
|---|---|
| Free | Full workout logging, exercise library, calendar, basic 30-day progress charts, current-state muscle exposure (Explore + basic My Stats), limited templates (~3) |
| Premium (~$4–7/mo or ~$30–40/yr) | Full historical chart ranges (6mo/1yr/all-time), detailed muscle analytics + heatmap view, unlimited templates, CSV export, future AI coaching assistant |

Reasoning: users need to trust the app with their data before paying — gating basic logging kills that trust before it forms.

---

## 7. Testing & Acceptance Philosophy

Same core philosophy as before (a feature isn't done until UI works, data persists correctly for the right user, calculations are correct, related features update, empty/error states work, mobile works, nothing regressed) — **plus one addition learned the hard way:**

**For any phase involving data persistence, the acceptance criteria must include a step where the user personally verifies the data in Supabase's Table Editor** — not just a tool's self-reported "migration complete" message. This is now a standing requirement for every phase, not a one-time fix.
