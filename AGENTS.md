<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **android-automation-test** (27 symbols, 31 relationships, 0 execution flows).

> Index stale? Run `node .gitnexus/run.cjs analyze --index-only` from the project root — it auto-selects an available runner. No `.gitnexus/run.cjs` yet? Bootstrap with `npx`, `bunx`, or `pnpm dlx` — e.g. `bunx gitnexus@latest analyze` (npm 11 npx crash; #1939).

## Always Do

- **MUST run impact before editing.** Use `impact({target: "symbolName", direction: "upstream"})` or `node .gitnexus/run.cjs impact "symbolName" --direction upstream --repo .`; report callers, processes, and risk. Never substitute grep for graph analysis.
- **MUST analyze graph changes before committing.** Use `detect_changes({scope: "all"})` (MCP) or `node .gitnexus/run.cjs detect-changes --scope all --repo .` (CLI fallback). `partial: true` or `truncated: true` is not a clean check — a zero means unseen, not unaffected; re-run it. For regression review: `detect_changes({scope: "compare", base_ref: "main"})` or `node .gitnexus/run.cjs detect-changes --scope compare --base-ref "main" --repo .`.
- MUST warn on HIGH/CRITICAL `risk` pre-edit; never use `riskSharedAxes` to waive a HIGH/CRITICAL `risk` warning. Compare File/symbol: MCP File omits axes; Graph-RAG expands File.
- **MUST treat `risk: UNKNOWN` as unresolved, not as low.** An empty caller set is not evidence the symbol is unused — it can also mean the callers are not resolvable by the index (plain-object property access, dynamic dispatch, cross-language calls). `impact` pairs `UNKNOWN` with a `riskNote` saying so. Confirm with a text search before treating the symbol as safe to change or delete; do not proceed on the strength of a zero.
- **MUST use `query({search_query: "concept"})` for concepts/flows, `context({name: "symbolName"})` for a named symbol, or `impact` for blast radius, on read-only callers, dependencies, imports, or execution flow.** Graph first; text search only for empty/`UNKNOWN`/literals.
- For security review, `explain({target: "fileOrSymbol"})` lists taint findings (source→sink flows; needs `analyze --pdg`).

## Never Do

- NEVER edit a function, class, or method before MCP/CLI impact analysis.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis, and never read `UNKNOWN` as an all-clear — it means the walk could not answer, which is the one verdict that requires confirming by other means.
- NEVER rename symbols with find-and-replace — use `rename` which understands the call graph.
- NEVER commit before MCP/CLI graph change analysis.

## Resources

| Resource | Use for |
| --- | --- |
| `gitnexus://repo/android-automation-test/context` | Codebase overview, check index freshness |
| `gitnexus://repo/android-automation-test/clusters` | All functional areas |
| `gitnexus://repo/android-automation-test/processes` | All execution flows |
| `gitnexus://repo/android-automation-test/process/{name}` | Step-by-step execution trace |

## CLI

| Task | Read this skill file |
| --- | --- |
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus-cli/SKILL.md` |

<!-- gitnexus:end -->

---

## Project overview

Tiny Expo React Native app built for Android E2E automation testing. Two test strategies ship with the repo: deterministic Maestro UI flows and an ADB/Logcat controller designed for AI-agent-driven test loops.

## Package name

`com.example.aiautomationdemo`

If you rename it, update **all three** locations or the build/tests break:
- `app.json` → `expo.android.package`
- `maestro/basic-flow.yaml` → `appId`
- `scripts/test-controller.mjs` → `PACKAGE` constant

## android/ is gitignored — regenerate it

The `android/` directory is **not committed**. To create it from scratch:

```bash
rm -rf android
npm install
npx expo prebuild --platform android
```

After prebuild the Android project lives in `android/` and you can build/install normally.

## Commands

| What | Command |
| --- | --- |
| Install deps | `npm install` |
| Generate android project | `npx expo prebuild --platform android` |
| Build + run on device | `npx expo run:android --device` |
| Install existing APK | `adb install -r path/to/app.apk` |
| Run Maestro UI test | `npm run test:maestro` |
| Run ADB/log controller | `npm run test:controller` |

## Test strategies

**Maestro** (`npm run test:maestro`): Deterministic UI flow — launches app, enters name, asserts greeting, tests empty-name validation. Requires Maestro CLI installed.

**ADB controller** (`npm run test:controller`): Clears Logcat, launches app via `monkey`, taps coordinates, captures screenshots and logcat to `artifacts/`. Checks for crash signatures in logs. Requires exactly one connected device (`adb devices`).

## Key files

- `src/App.js` — single-screen app with `testID="name-input"` and `testID="hello-button"`, logs `[E2E]` tagged messages to Logcat
- `maestro/basic-flow.yaml` — Maestro UI test
- `scripts/test-controller.mjs` — ADB-based controller script
- `index.js` — Expo entry point

## Prerequisites

- Node.js 20+
- Android SDK + `adb` on PATH
- Physical Android phone with USB debugging enabled
- Maestro CLI (for `npm run test:maestro`)
