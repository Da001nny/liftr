# Liftr v2 — Agent Build Prompts

Companion to `liftr_prd_trd_v2.md`. Paste one phase at a time into your coding tool, in order. Each phase must be confirmed complete — including the Supabase Table Editor proof-check where relevant — before moving to the next.

---

## Global Context (paste once at the start of a new project/session)

```
You are building "liftr" from scratch — a fitness/gym tracking app whose flagship feature
is an interactive anatomical body (male/female selectable) where every muscle is clickable.

Non-negotiable ground rules:
1. Database is Supabase Postgres from the very first line of backend code. Never a local
   file store, never in-memory storage, for anything, at any point in any phase.
2. Row Level Security is enabled at the moment each table is created, with policies scoped
   to auth.uid(). Not added later as a retrofit.
3. Auth is Supabase Auth.
4. One consistent API response shape for every single endpoint, no exceptions:
   { data: { items: [...], total, page, limit } } — including single-item responses.
   Never let some endpoints return raw arrays/objects while others are wrapped.
5. Never trust a client-supplied user ID for any read or write.
6. One authoritative implementation per calculation (volume, 1RM, PR detection,
   consistency %, muscle exposure) — never duplicated across files.
7. No mock or hardcoded data anywhere — real empty states only.
8. All user-facing strings go through a translation-key pattern from day one (single `en`
   locale file is fine for now — no second language yet, no language selector yet — but no
   raw hardcoded strings directly in JSX/components either).
9. Design system: dashboard-card density (multiple clean cards, generous spacing, 1-2
   primary + rest secondary), metallic chrome/silver theme applied via the specific pattern
   in Section 2.2 of the PRD (flat plain backgrounds; metallic gradient sheen ONLY on
   elevated surfaces — primary cards, progress rings, chart/bar fills; secondary cards and
   body text stay flat and clean). Both light and dark mode get this treatment. Customizable:
   Dark/Light/System toggle, predefined + custom accent colors, surface intensity.
10. Navigation: bottom tab bar with exactly 5 items — Dashboard, Workouts, Body, Progress,
    Calendar. Exercises lives inside Workouts. Activity lives inside Progress. Profile/
    Settings is behind a persistent avatar icon, not a tab.
11. Work in small, incremental phases — one at a time, confirmed working before the next.
12. For any phase involving data persistence: "done" requires the user to personally verify
    the data in Supabase's Table Editor, not just a code-level report. Always end a
    persistence-related phase by instructing the user to do this check themselves.

Confirmed calculation/logic decisions:
- Estimated 1RM: Epley — weight × (1 + reps/30), except reps===1 returns weight exactly.
- PR categories (all four): heaviest weight, best estimated 1RM, best single-set volume
  (weight × reps for ONE set, not session total), rep PR at a given weight. Strict > for
  all — an exact tie is never a new PR.
- Calendar consistency % = completed scheduled ÷ explicitly scheduled sessions. Unscheduled
  workouts excluded from the denominator entirely. 0 scheduled sessions → 100% (document
  this as an intentional default in a code comment).
- Timestamps stored in UTC; converted to local timezone only for display. Recurrence
  date-walking happens in UTC; local-time conversion happens only when computing each
  occurrence's actual timestamp — this avoids DST drift in the date-walking logic itself.

I will give you one phase at a time. Confirm each phase's acceptance criteria pass —
including any required Supabase Table Editor check — before telling me it's complete.
```

---

## Phase 0 — Foundation

```
PHASE 0: FOUNDATION

Objective: project scaffold, Supabase-backed auth/profile, navigation shell, theme system.
No workout, exercise, or calendar logic yet.

Step 1 — Set up Supabase from the very first commit:
- Create/confirm the Supabase project connection (URL + anon key provided separately).
- Create a `profiles` table (id referencing auth.users, theme preferences, accent color,
  surface intensity, rest-timer defaults as JSONB or discrete columns) with RLS enabled
  immediately, policy scoped to auth.uid().
- Set up a trigger so a profile row is auto-created when a new user signs up.

Step 2 — Auth: sign up, log in, log out, protected route handling — all via Supabase Auth.
Identity is always derived server-side from the authenticated session/JWT, never from a
client-supplied field.

Step 3 — Navigation shell: bottom tab bar with exactly 5 tabs — Dashboard, Workouts, Body,
Progress, Calendar — plus a persistent avatar icon (top corner) leading to Profile/Settings.
All tabs except Dashboard and Profile may be placeholder screens for now, with honest
"coming soon" empty states — no sample/fake content.

Step 4 — Dashboard shell: dashboard-card layout (per Global Context design rules), real
empty states only, no fabricated numbers.

Step 5 — Theme system: Dark/Light/System modes, predefined + custom accent colors, surface
intensity variants, and the metallic gradient treatment on elevated surfaces specifically
(not flat backgrounds) as described in the Global Context. Persist all preferences to the
`profiles` table via Supabase — not local state, not in-memory.

Step 6 — API response shape: establish the `{ data: { items, total, page, limit } }`
convention for every endpoint starting now, and document it in the codebase (a comment or
short README section) so it's never ambiguous later.

Acceptance criteria (all must pass):
- [ ] Sign up creates a user AND a corresponding profile row in Supabase — verify this
      yourself in Supabase's Table Editor (auth.users and public.profiles both show the
      new user)
- [ ] Log in / log out work correctly
- [ ] Protected routes reject unauthenticated access server-side
- [ ] 5-tab navigation renders correctly on desktop, tablet, and mobile
- [ ] Dashboard renders with correct empty states, dashboard-card layout
- [ ] Theme selection (including accent color and metallic surfaces) persists — verify by
      changing it, refreshing the page, and separately checking the `profiles` table in
      Supabase Table Editor to confirm the value is actually stored there, not just in
      browser state
- [ ] No client-supplied user ID trusted anywhere
- [ ] No mock/hardcoded dashboard data
```

---

## Phase 1 — Exercise & Muscle Data

```
PHASE 1: EXERCISE & MUSCLE DATA

Prerequisite: Phase 0 acceptance criteria all pass, including the Supabase Table Editor
verification.

Objective: muscle taxonomy, exercise catalog with video field, contribution system, library
UI, reverse search — as real Supabase tables from the start.

Step 1 — Build as real Supabase Postgres tables, RLS enabled where relevant (the catalog
itself is public/read-only for all authenticated users — no per-user RLS needed on Muscle,
MuscleRegion, Exercise, ExerciseMuscleContribution tables themselves, but confirm read access
is still gated behind authentication):
- Muscle and MuscleRegion: full hierarchy (region → subregion → muscle).
- Exercise: id, name, description, equipment, movementType, difficulty, instructions,
  optional imageUrl, and a `videoUrl` field (for a curated YouTube embed link — to be
  populated incrementally, can be null initially).
- ExerciseMuscleContribution: id, exerciseId, muscleId, percentage, role (Primary/Secondary/
  Stabilizer), notes.

Step 2 — Seed 150-250 exercises (reuse the validated 203-exercise catalog and full taxonomy
already known to be correct, covering: chest, shoulders, back, arms, core, glutes, legs,
inner thigh) with validated contribution distributions (Primary + Secondary ~100%,
Stabilizers separate, validated server-side before persistence, not just client-side).

Step 3 — Region filtering: filter by direct regionId/targetRegion match OR role === 'Primary'
contribution in that region — do NOT match on any Secondary/Stabilizer contribution, since
that causes compound lifts to incorrectly appear under every region they touch even slightly.

Step 4 — Ensure every exercise ID and contribution ID is unique — verify programmatically
across the full seeded dataset, not just visually.

Step 5 — Exercise library UI (accessible from within the Workouts tab): search/filter by
equipment, difficulty, movement pattern, muscle/region; paginated; exercise detail view
showing estimated involvement breakdown and an embedded video player when videoUrl exists
(graceful "video coming soon" state when it doesn't).

Step 6 — Reverse muscle search: select a muscle/region, see exercises that train it, ranked
by contribution weight.

Step 7 — All user-facing strings go through the translation-key pattern (Global Context
rule 8) — no raw hardcoded strings in JSX.

Acceptance criteria (all must pass):
- [ ] Verify in Supabase Table Editor that all seeded exercises, muscles, regions, and
      contributions actually exist as rows — not just that the app displays them
- [ ] Every exercise has a validated contribution distribution
- [ ] Region filtering returns correct results for every one of the 8 regions — spot check
      at least 3 regions personally
- [ ] All exercise/contribution IDs confirmed unique
- [ ] Library search/filter/pagination work correctly at full catalog scale
- [ ] Reverse muscle search returns correct, relevant results
- [ ] All percentage displays use "estimated" language
- [ ] Phase 0 functionality unaffected
```

---

## Phase 2 — Anatomy Explore-Mode Shell (flagship feature, part 1)

```
PHASE 2: ANATOMY EXPLORE-MODE SHELL

Prerequisite: Phase 1 acceptance criteria all pass.

Objective: the interactive anatomical body — male/female selectable, drill-down navigation,
Explore mode (exercise recommendations), video integration. This is the flagship feature —
give it real design attention, not a rushed placeholder.

Step 1 — Decision to confirm before building, not choose alone:
- Source of the anatomical body assets (male + female). Use a properly sourced/licensed
  anatomical SVG or equivalent with independently selectable muscle paths for both body
  types. Do not generate anatomical artwork from scratch. If a fully detailed licensed asset
  isn't available yet, build the broad-muscle-group interaction architecture so a detailed
  asset can be swapped in later without rework — flag this clearly if it's the fallback.

Step 2 — Body selector: user can switch between male and female body models at will (not a
one-time onboarding choice — accessible whenever, e.g., in the Body tab itself).

Step 3 — Data architecture: SVG path ID → Muscle database record → Exercise contributions
(Phase 1 data). Path IDs map deterministically — no separate hardcoded data living in the
visualization layer itself.

Step 4 — Navigation hierarchy: Full Body → Region → Sub-region → Individual Muscle,
matching the PRD taxonomy. Breadcrumbs + back control at every level — the user must never
be trapped in a zoomed state.

Step 5 — Interaction: desktop supports hover (highlight, subtle brightness change, tooltip)
plus click; mobile supports tap with zero dependency on hover for any essential function.

Step 6 — Explore mode (the only mode built this phase — My Stats mode comes in Phase 5):
selecting a muscle shows its function/anatomy description, and the exercises that train it
(from Phase 1's reverse search data), ranked by contribution weight. When an exercise has a
videoUrl, show an embedded video player inline in this view.

Step 7 — Accessibility: provide a non-visual list/search alternative that reaches the exact
same muscle detail information as the visual map — required, not optional.

Step 8 — All user-facing strings through the translation-key pattern.

Acceptance criteria (all must pass):
- [ ] Male/female body switch works and both render correctly
- [ ] Full Body → Region → Sub-region → Muscle navigation works with no dead ends in either
      direction
- [ ] Mobile tap interaction works with zero hover dependency
- [ ] Explore mode shows correct exercises per muscle, correctly ranked
- [ ] Video embeds display correctly when a videoUrl exists, and show a graceful fallback
      when it doesn't
- [ ] The non-visual list/search alternative reaches identical muscle data
- [ ] Phases 0-1 functionality unaffected
```

---

## Phase 3 — Workout Logging & Progression

```
PHASE 3: WORKOUT LOGGING & PROGRESSION

Prerequisite: Phases 0-2 acceptance criteria all pass.

Objective: full workout logging as real Supabase tables, calculations, PR detection,
templates, the active-workout takeover modal, and integrated rest timer — all built
correctly from the start this time (this exact area required significant bug-fixing last
build; build it right the first time).

Step 1 — Build as real Supabase Postgres tables, RLS enabled at creation, scoped to
auth.uid() — including correctly scoping child tables (workout_exercises, workout_sets)
through their parent workout's user_id via EXISTS-style policies, not just a direct
user_id column check where one doesn't naturally exist:
- Workout, WorkoutExercise, WorkoutSet, PersonalRecord, WorkoutTemplate, TemplateExercise.
- Foreign keys with ON DELETE CASCADE where appropriate (deleting a workout should cleanly
  cascade to its exercises and sets).

Step 2 — Calculations (single authoritative implementation, per Global Context):
- Total volume = sum(weight × reps) across completed, non-warmup working sets only.
- Estimated 1RM = Epley formula, with the reps===1 exception, applied everywhere 1RM appears.
- Set/rep counts = completed working sets only.

Step 3 — PR detection: all four categories (heaviest weight, best estimated 1RM, best
single-set volume, rep PR at a given weight), strict > tie rule, only completed non-warmup
sets with weight > 0 and reps > 0. Document the "best volume = single-set, not session
total" interpretation in a code comment immediately, don't leave it ambiguous.

Step 4 — Workout logging flow: start blank or from a template; add/reorder/remove exercises;
add/edit sets (weight, reps, optional RIR, completion); previous-value suggestions (never
overwrite user input); live client-side totals with server-side authoritative recalculation
on save/completion.

Step 5 — Active workout takeover modal: large overlay with dimmed backdrop, dockable/
minimizable (so the user can check other tabs without losing the session), re-expandable via
a persistent indicator.

Step 6 — Integrated rest timer: auto-starts on set completion AND can be started/restarted
manually; global default duration (configurable in settings) with optional per-exercise
override; sound + vibration alert on completion (vibration fails gracefully where
unsupported); visible countdown with quick-adjust and skip controls.

Step 7 — Templates: create, edit, duplicate, delete, start-from-template.

Step 8 — Transaction integrity: completing a workout and generating dependent records (PRs)
must be atomic. Deleting a workout must correctly reverse/recalculate any PRs it had
generated (replay remaining history chronologically), not leave phantom PRs behind. Use
a proper in-app confirmation dialog for discard/delete — do not rely on window.confirm(),
which fails silently in some sandboxed/iframe environments.

Step 9 — Wire the Dashboard's Recent Workout, Weekly Summary, and Recent PRs cards to this
real data, correct empty states when none exists yet.

Acceptance criteria (all must pass):
- [ ] Verify in Supabase Table Editor: log a workout in the app, then confirm the workout,
      its exercises, and its sets all actually appear as rows in the corresponding Supabase
      tables
- [ ] By hand: log a real workout, calculate volume and 1RM for at least one set manually,
      confirm the app's displayed numbers match your manual calculation exactly
- [ ] PR detection correctly identifies a genuine new PR and does NOT false-positive on a
      tied or lesser performance
- [ ] Delete a completed workout that had generated a PR; confirm the PR is correctly
      reversed/recalculated, not left as a phantom record
- [ ] Active workout modal minimizes and re-expands without losing in-progress data
- [ ] Rest timer auto-starts on set completion, can be manually triggered, respects a
      per-exercise override when set, and alerts via sound + vibration on completion
- [ ] Templates can be created and used to start a new workout
- [ ] Dashboard cards reflect real data immediately after workout completion
- [ ] Phases 0-2 functionality unaffected
```

---

## Phase 4 — Calendar

```
PHASE 4: CALENDAR

Prerequisite: Phases 0-3 acceptance criteria all pass.

Objective: scheduling, recurrence, calendar analytics, filters, PR markers — as real
Supabase tables, UTC-first from the start.

Step 1 — Build as real Supabase tables, RLS at creation: ScheduledWorkout/WorkoutSeries,
CalendarNote, CalendarRestDay.

Step 2 — All timestamps stored in UTC. Recurrence generation walks calendar dates in UTC
and converts to a local-time-equivalent UTC timestamp only at the point of computing each
occurrence — never let DST handling leak into the date-walking loop itself. If you need to
convert a local date+time+timezone into a UTC instant without a heavy library, an iterative
guess-and-correct approach using Intl.DateTimeFormat is a valid, tested pattern — just
document it clearly.

Step 3 — Calendar views: month, week, day, with prev/today/next navigation. Display:
scheduled workouts, completed workouts, missed (explicitly scheduled + not completed only —
never label an unscheduled gap as missed), rest days, notes, PR indicators (from Phase 3
PR data).

Step 4 — Recurrence: daily, weekly, biweekly, custom (including custom multi-day-per-week
patterns — ensure daysOfWeek selection is correctly retained for custom frequency). Editing
scope: this occurrence only, this and future, entire series — implement and personally test
each of the three scopes on a real recurring series before considering this done.

Step 5 — Consistency % (single authoritative implementation): completed scheduled ÷
explicitly scheduled, unscheduled excluded from denominator, 0 scheduled → 100% (documented
as intentional in a code comment).

Step 6 — Filters: by muscle (highlight trained dates) and exercise (highlight performed
dates), navigating to the relevant workout on selection.

Step 7 — Recurrence interval input: use a proper numeric stepper or equivalent robust input
pattern — verify manually that typing single digits (3, 5, 7) works correctly, not just
double digits.

Acceptance criteria (all must pass):
- [ ] Verify in Supabase Table Editor: create a scheduled/recurring workout, confirm the
      series and its occurrences appear correctly as rows
- [ ] Create a weekly recurring series, edit ONE occurrence with "this occurrence only,"
      and personally confirm the rest of the series is untouched
- [ ] Consistency % matches manual calculation for a test dataset
- [ ] A weekly recurrence spanning a DST transition does not shift the displayed local time
- [ ] PR markers appear on correct dates
- [ ] Recurrence interval field accepts any single or multi-digit number correctly
- [ ] Phases 0-3 functionality unaffected
```

---

## Phase 5 — Activity, Progress & Anatomy Data-Driven Modes (flagship feature, part 2)

```
PHASE 5: ACTIVITY, PROGRESS & ANATOMY DATA-DRIVEN MODES

Prerequisite: Phases 0-4 acceptance criteria all pass.

Objective: steps/bodyweight, progress charts, full muscle exposure analytics, global search,
AND the completion of the anatomy flagship feature — My Stats mode plus both highlight views.

Step 1 — Build as real Supabase tables, RLS at creation: BodyweightEntry, StepEntry
(architected so a future wearable integration can slot in without a schema rewrite — don't
hardcode "manual entry" as the only possible source).

Step 2 — Activity section (within the Progress tab): today's steps, goal, progress
indicator, manual entry.

Step 3 — Bodyweight: current, starting, net change, 7-day average, 30-day trend, chart.

Step 4 — Exercise progress charts: weight/reps/volume/1RM per exercise, reusing the exact
Phase 3 Epley function — do not reimplement it. Range filters: 7d/30d/3mo/6mo/1yr/all-time.

Step 5 — Full muscle exposure analytics (single authoritative implementation): completed
training × contribution weights, aggregated by muscle/region/week/month/session. Labeled as
estimates. Neutral high/moderate/low language only — never rank muscles as good/bad.

Step 6 — Global search: exercises, muscles, regions, workout history, dates — typed results,
direct navigation.

Step 7 — Anatomy: My Stats mode. Now that real logged data and exposure calculations exist,
build the second interaction mode from Phase 2's shell — selecting a muscle shows the user's
actual sets/volume/frequency/last-trained/estimated exposure for it, toggleable against the
existing Explore mode built in Phase 2.

Step 8 — Anatomy: both highlight views.
- Per-workout highlight: pick a specific past workout, see exactly which muscles it
  trained, highlighted on the body.
- Overall heatmap: relative recent training intensity (e.g., last 7/30 days) across the
  whole body, using the same neutral high/moderate/low language as Step 5 — never
  good/bad ranking.

Acceptance criteria (all must pass):
- [ ] Verify in Supabase Table Editor: bodyweight/step entries persist correctly per user
      and date
- [ ] Progress charts reflect real logged data correctly across all range filters
- [ ] Muscle exposure aggregates correctly for a test dataset, verified by rough manual
      cross-check on at least one muscle
- [ ] My Stats mode shows correct real data per muscle, toggles cleanly against Explore mode
- [ ] Per-workout highlight correctly shows only the muscles that specific workout trained
- [ ] Heatmap correctly reflects relative recent intensity using neutral language only
- [ ] Global search returns correct, correctly-typed, navigable results
- [ ] Phases 0-4 functionality unaffected
```

---

## Phase 6 — Detailed Analytics Expansion

```
PHASE 6: DETAILED ANALYTICS EXPANSION

Prerequisite: Phase 5 acceptance criteria all pass.

Objective: deeper analytical tools beyond Phase 5's baseline, since detailed analysis was
specifically requested as a differentiator.

Build:
- Trend comparisons across custom date ranges (e.g., "this month vs last month" for volume,
  a specific exercise, or a muscle group).
- Exportable reports (CSV export of workout history, progress data — this doubles as
  infrastructure for the future Premium-tier CSV export feature).
- Cross-exercise comparison views (e.g., compare progress trends across two exercises that
  train the same muscle).

Acceptance criteria:
- [ ] Trend comparisons produce correct results verified against at least one manual
      cross-check
- [ ] CSV export produces a correctly formatted, complete file
- [ ] Cross-exercise comparisons render correctly with real data
- [ ] Phases 0-5 functionality unaffected
```

---

## Phase 7 — i18n Verification Pass

```
PHASE 7: I18N VERIFICATION PASS

Prerequisite: Phase 6 acceptance criteria all pass.

Objective: confirm the i18n-ready architecture (Global Context rule 8) has actually been
followed with zero gaps across every phase built so far — do NOT add a second language or
language selector yet, this is a verification/cleanup pass only.

Step 1 — Audit every component built across Phases 0-6 for any raw hardcoded user-facing
string that bypasses the translation-key pattern. Report findings by feature area.

Step 2 — Fix every gap found — route all strings through the translation-key pattern
correctly, with matching keys in the single `en` locale file (no mismatches between what a
component calls and what the dictionary defines — verify this specifically, since key
mismatches can silently break the English UI even with only one language).

Step 3 — Confirm database-driven values (exercise difficulty, equipment, movement type, PR
type codes, etc.) use a label-mapping layer rather than translating the raw stored value
itself.

Acceptance criteria:
- [ ] Zero hardcoded strings remain outside the translation-key pattern, verified by the
      audit in Step 1
- [ ] Zero key mismatches between component calls and the locale dictionary
- [ ] English UI shows no raw keys or blank labels anywhere
- [ ] Database-driven values correctly separate stored value from displayed label
```

---

## Phase 8 — Design & Polish Pass

```
PHASE 8: DESIGN & POLISH PASS

Prerequisite: Phase 7 acceptance criteria all pass.

Objective: a dedicated visual refinement pass across the entire app, now that all core
functionality exists.

Review and refine, screen by screen:
- Consistency of the metallic gradient treatment (elevated surfaces + charts only, flat
  backgrounds elsewhere) across every screen built so far — some earlier phases may have
  drifted from this pattern under time pressure; bring them back in line.
- Spacing, typography, and visual hierarchy consistency app-wide.
- Restrained, purposeful transitions/animations (nothing excessive).
- Light mode parity — confirm every screen looks equally polished in light mode, not just
  dark mode (a common gap when dark mode is the default focus during building).
- Empty/loading/error state polish across every feature area.

Acceptance criteria:
- [ ] Personally review every major screen in both light and dark mode
- [ ] Metallic treatment is consistent and correctly scoped (not applied to flat backgrounds,
      not missing from primary cards/charts) app-wide
- [ ] No visual regressions in functionality from this pass
```

---

## Phase 9 — App Store Packaging

```
PHASE 9: APP STORE PACKAGING

Prerequisite: Phase 8 acceptance criteria all pass.

Objective: package the existing web app for distribution, Google Play first (cheaper, $25
one-time), then Apple App Store ($99/year).

Step 1 — Decision to confirm before building: packaging approach. Recommended: wrap the
existing React/web codebase using Capacitor, preserving the same codebase rather than a
native rewrite (consistent with the TSD's original principle of one shared codebase serving
future clients).

Step 2 — Google Play packaging: Capacitor Android build, required store assets (icon,
screenshots, feature graphic, privacy policy page), Play Console listing setup.

Step 3 — Apple App Store packaging (after Play Store is live and stable): Capacitor iOS
build, required store assets, App Store Connect listing setup.

Acceptance criteria:
- [ ] App builds and runs correctly as a packaged Android app via Capacitor, core flows
      (auth, logging, calendar, anatomy) tested on a real or emulated device
- [ ] All required Play Store listing assets prepared
- [ ] (After Play Store) Same verification repeated for iOS/App Store
```

---

## Phase 10 — Monetization Implementation

```
PHASE 10: MONETIZATION IMPLEMENTATION

Prerequisite: Phase 9 acceptance criteria all pass (or explicitly deferred if launching
free-only initially).

Objective: implement the freemium gating defined in the PRD.

Build:
- Free tier: full logging, exercise library, calendar, basic 30-day progress charts,
  current-state muscle exposure (Explore + basic My Stats), limited templates (~3).
- Premium tier gating: full historical chart ranges, detailed muscle analytics + heatmap,
  unlimited templates, CSV export.
- Payment integration (platform-appropriate: Stripe for web, respective in-app purchase
  systems for Play Store/App Store once packaged).
- Clear, honest upgrade prompts at natural gating points — never dark-pattern nagging.

Acceptance criteria:
- [ ] Free tier correctly restricts premium features without breaking core functionality
- [ ] Premium tier correctly unlocks all gated features upon successful payment
- [ ] Payment flow tested end-to-end in a sandbox/test mode before going live
```

---

## Phase 11 — AI Coaching Assistant (stretch, gated)

```
PHASE 11: AI COACHING ASSISTANT

Prerequisite: Phase 10 complete, AND explicit approval to begin this phase — do not start
automatically.

Objective: build the AI coaching feature in full, now that Phases 3-6's data (logging, PRs,
muscle exposure, trends) is verified accurate and complete.

Build, in this order:
1. Post-workout feedback: analyze a just-completed workout against recent history (volume
   trend, notable PRs, consistency context) and generate a short, genuinely useful comment
   — not generic praise.
2. Next-session recommendations: suggest what to train next based on recent muscle exposure
   data (e.g., under-trained muscle groups, days since last trained).
3. Auto-generated routines: build a full plan based on user goals, history, and equipment
   access — presented as an editable suggestion, never silently overwriting a user's
   existing templates or schedule without explicit confirmation.

This is a Premium-tier feature per the monetization plan — gate accordingly.

Acceptance criteria:
- [ ] Feedback/recommendations are grounded in real user data, not generic filler
- [ ] Auto-generated routines never silently overwrite existing user data
- [ ] Feature is correctly gated behind the Premium tier
```
