# Liftr v2 — Current Status

Companion to `liftr_prd_trd_v2.md` and `liftr_phase_prompts_v2.md`. This reflects actual progress as of switching to Antigravity — read this first for current state, then the other two docs for full spec/prompts.

---

## Build environment

- **Repo:** cloned into Antigravity, connected to GitHub (the v2 repo created from AI Studio's first push)
- **Database:** Supabase Postgres (new project, created fresh for this v2 restart) — URL/anon key already wired into the app
- **Prior tools used this build:** Google AI Studio (Phases 0-2 attempt), now moved to Antigravity for Phase 3 onward, due to AI Studio's GitHub sync issues and to take advantage of Antigravity's browser-verification loop (can take real screenshots to confirm work, addressing a recurring problem with unverifiable "done" claims)

---

## Phase status

- ✅ **Phase 0 (Foundation):** Complete and verified. Supabase Postgres + Auth wired from the start, RLS enabled at table creation, auto-profile-creation trigger confirmed working via Table Editor. 5-tab navigation (Dashboard, Workouts, Body, Progress, Calendar + avatar-based Profile). Theme system: metallic chrome/silver aesthetic refined through several iterations — near-black charcoal dark mode (not blue-tinted), airy white/soft-grey light mode, bold condensed athletic typography for headlines/stats. Accent color customization simplified/removed for now (can be re-added later). Persistence verified directly in Supabase Table Editor, not just trusted from tool reports.

- ✅ **Phase 1 (Exercise & Muscle Data):** Complete and verified. Full 203-exercise catalog, 36-muscle taxonomy across 8 regions, 820 contribution records, all seeded as real Supabase tables (migration run manually via Supabase SQL Editor — AI Studio could not execute SQL directly, only generate the migration file). Region filtering correctly uses Primary-role-only matching (avoiding the "compound lift pollutes every region" bug from the first build attempt). Region count overlap (244 vs 203 exercises) investigated and confirmed as genuine dual-primary-muscle exercises (e.g., squats = quads + glutes), not a bug. `videoUrl` field exists on Exercise for future YouTube embeds.

- ⚠️ **Phase 2 (Anatomy — flagship feature): ATTEMPTED AND DEFERRED, NOT COMPLETE.** This is important context for continuing work:
  - First attempt: hand-coded SVG vector paths. Failed — rendered as abstract geometric panels, not recognizable human anatomy. Root cause: generating convincing anatomical illustration through code is a fundamentally different skill than coding, and not something achievable through iterative prompting.
  - Researched licensed alternatives (OpenStax, Open Anatomy Project, Z-Anatomy, EMBL-EBI anatomogram) — none support both dual-sex models AND sub-region granularity matching the 36-muscle taxonomy. No viable free licensed 2D SVG asset exists for this use case.
  - Second attempt: AI-generated static avatar images (stylized 3D-rendered athletic figures, Fitbod-style) with invisible hotspot/glow overlays for broad regions, reduced to a simple heatmap (no drill-down, no Explore mode) showing training intensity.
  - This also failed at the execution level: hotspot/glow positioning was inaccurate and inconsistent, front/back and gender toggles showed mismatched images, and a "glow always on regardless of data" bug appeared. Multiple rounds of fixes did not resolve these reliably.
  - **Decision: the entire visual anatomy feature was removed from active use.** The Body tab now shows an honest "Coming Soon" placeholder. All underlying Phase 1 data (muscle taxonomy, regions, contributions) remains fully intact and unaffected — only the visual/interactive layer was removed.
  - **This phase needs to be revisited later**, likely with a different tool better suited to precise visual/image work, or by budgeting for a licensed illustration/asset purchase rather than attempting to generate one. Do not reattempt this with the same approach (AI-generated images + guessed hotspot coordinates) without a better positioning method — if reattempted, use something like a manual calibration/drag-to-position tool (partially built during the attempt, exists in git history if needed) rather than relying on automated coordinate guessing.

- 🔄 **Phase 3 (Workout Logging & Progression): CODE COMPLETE & READY FOR SUPABASE SQL VERIFICATION.**
  - Real Supabase schema migration written (`supabase/migrations/003_create_workout_tables.sql`) for `workouts`, `workout_exercises`, `workout_sets`, `personal_records`, `workout_templates`, and `template_exercises` with immediate Row Level Security (RLS) scoped to `auth.uid()`, CASCADE rules, and performance indexes.
  - Authoritative calculation engine (`src/lib/calculations.ts`): Epley 1RM with `reps === 1` exact weight return, single-set and session total volume across completed non-warmup sets only, calendar consistency % (with 100% default for 0 scheduled sessions).
  - All 4 PR categories strictly enforced with `>` tie rejection rule (verified with 24/24 passing unit tests in `scripts/verifyPhase3Calculations.ts`).
  - Active workout takeover modal with dockable/minimizable background mode, persistent floating resume banner, exercise reordering, set logging, and in-app confirm dialogs (no `window.confirm()`).
  - Integrated rest timer: Web Audio completion chime, haptic vibration with graceful fallback, +/- adjustment controls, and skip.
  - Template management: create, edit, duplicate, delete, and start workout from template.
  - Dashboard integration: Hero volume, completed session counter, consistency ring, recent workout, and recent PRs wired to real database metrics.
  - **Verification Step Required**: User executes `supabase/migrations/003_create_workout_tables.sql` in Supabase SQL Editor and verifies row persistence in Supabase Table Editor after logging a workout.

- **Not yet started:** Phase 4 (Calendar) onward, per the original phase prompts doc. Phase 2 (Anatomy) will need to be reinserted into the sequence whenever it's revisited — it is NOT currently positioned before Phase 3 anymore, since it was skipped, not completed.

---

## Standing rules that apply from here forward (learned the hard way across this build)

1. **Never trust a "done"/"verified" claim without seeing actual proof.** For data persistence: check Supabase's Table Editor directly. For visual work: get a real screenshot and look at it yourself — broken/placeholder image references have happened multiple times.
2. **For any visual/design feedback, ask clarifying questions with concrete reference images before writing a fix prompt** — vague feedback like "doesn't look premium" needs to be narrowed down before a tool can act on it usefully.
3. **One phase/feature at a time.** Don't let a tool build multiple things in one pass.
4. **For calculation/logic-heavy work** (PR detection, volume, 1RM, recurrence, consistency %): ask for the actual code, not a summary, and review it line by line.
5. **Push to GitHub after every confirmed-working checkpoint**, never mid-task or right after a tool's usage limit cuts off an uncertain state.
6. **If a visual/generative task fails repeatedly after 2-3 genuine attempts with different approaches, stop and reconsider the approach entirely** rather than continuing to iterate indefinitely — this is what happened with the anatomy feature, and deferring it was the right call rather than burning more time on a failing approach.
