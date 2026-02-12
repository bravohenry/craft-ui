# @craft/ui Kit Completion — Waves 2-9

## TL;DR

> **Quick Summary**: Complete the @craft/ui cross-platform React component library by extracting remaining ~35 files from craft-agents-oss. Copy+adapt for most modules; fix imports for chat/ module (Path A — minimal, no TurnCard decomposition).
>
> **Deliverables**:
> - 4 code-viewer components (ShikiCodeViewer, ShikiDiffViewer, UnifiedDiffViewer, DiffViewerControls)
> - 9 markdown components (CodeBlock, CollapsibleSection, TableExportDropdown, Markdown, 5 block renderers)
> - 2 terminal components (ansi-parser, TerminalOutput)
> - 13 overlay components (base layer + composed previews)
> - 1 card component (ActionCard)
> - 8 chat components (TurnCard, SessionViewer, UserMessageBubble, SystemMessage, turn-utils, InlineExecution, AcceptPlanDropdown, TurnCardActionsMenu)
> - 2 lib utilities (file-classification, tool-parsers)
> - 1 new type file (activity.ts — extracted from TurnCard)
> - Updated barrel exports + package.json
>
> **Estimated Effort**: Large (10 tasks, ~35 files, ~13,500 lines)
> **Parallel Execution**: YES — 3 waves
> **Critical Path**: Task 1 → Task 4 → Task 5 → Task 6 → Task 7 → Task 8 → Task 9 → Task 10

---

## Context

### Original Request
Extract remaining components from `/tmp/craft-agents-oss/packages/ui/src/` into the new `@craft/ui` library at `/Users/henry/PARA/[01] Projects/Vibe/Craft/`. Phases 1-3 (foundation, primitives, Wave 1 utilities) are complete (2821 lines, 46 files). This plan covers Waves 2-9 to reach completion.

### Interview Summary
**Key Discussions**:
- Chat components included but with import-path fixes only (Path A — no TurnCard decomposition)
- Generic types already extracted to `src/types/message.ts` (325 lines, all @craft-agent/core types present)
- Path utilities already in `src/utils/paths.ts` (normalizePath, pathStartsWith, stripPathPrefix)
- @pierre/diffs already in peerDependencies
- GEB L3 headers mandatory on every file
- AGENTS.md updates after each module

**Research Findings**:
- markdown ↔ overlay circular dependency: MarkdownMermaidBlock/DatatableBlock/SpreadsheetBlock import overlay components; DocumentFormattedMarkdownOverlay imports Markdown. **Resolution**: Layer overlay into base (L4) + composed (L6) with markdown (L5) between.
- tool-parsers.ts has upward dependency: imports ActivityItem from chat/TurnCard and ToolType from terminal/TerminalOutput. **Resolution**: Extract ActivityItem + related types to `src/types/activity.ts` before tool-parsers migration.
- InlineExecution imports ActivityStatusIcon + SIZE_CONFIG from TurnCard. **Resolution**: Keep as-is (Path A), these are valid intra-module imports within chat/.
- TurnCard (2125L) uses scattered conditional branching for tool rendering — no centralized registry. Path A preserves this; Path B (future) would introduce injection pattern.

### Metis Review
**Identified Gaps** (addressed):
- markdown ↔ overlay cycle: Broken by splitting overlay into base/composed layers
- ActivityItem type location: Extracted to src/types/activity.ts
- @craft-agent/mermaid: Made optional peer dep with CodeBlock fallback
- Missing test infrastructure: No tests in scope; QA via tsc --noEmit + grep verification
- react-pdf for PDFPreviewOverlay: Added as optional peer dep

---

## Work Objectives

### Core Objective
Complete the @craft/ui library by extracting all remaining components from craft-agents-oss, replacing @craft-agent/core imports with local type references, and maintaining zero LSP errors throughout.

### Concrete Deliverables
- ~35 new component/utility files across 7 modules
- Updated barrel exports (index.ts) for each module
- Updated AGENTS.md at L1 and L2 levels
- Updated package.json with new optional peer deps

### Definition of Done
- [ ] `npx tsc --noEmit` → 0 errors
- [ ] `grep -r "@craft-agent/core" src/ --include="*.ts" --include="*.tsx" | wc -l` → 0
- [ ] All subpath exports in package.json resolve correctly
- [ ] Every .ts/.tsx file has GEB L3 header

### Must Have
- All source component behavior preserved verbatim
- All @craft-agent/core imports replaced with @/ local imports
- GEB L3 headers on every file
- AGENTS.md updated after each module

### Must NOT Have (Guardrails)
- DO NOT refactor TurnCard internals — import fixes only (Path A)
- DO NOT add error boundaries, loading states, or defensive checks not in source
- DO NOT split files that aren't scoped for splitting (e.g., don't split turn-utils.ts)
- DO NOT create wrapper components "for flexibility"
- DO NOT add TypeScript generics to currently-concrete types
- DO NOT "improve" any component logic while fixing imports — behavior preservation only
- DO NOT add tests (no test infrastructure exists)

---

## Verification Strategy

> **UNIVERSAL RULE: ZERO HUMAN INTERVENTION**
> ALL verification is agent-executed via commands. No "visually confirm" criteria.

### Test Decision
- **Infrastructure exists**: NO
- **Automated tests**: None
- **Framework**: N/A

### Agent-Executed QA (ALL tasks)

Every task gates on:
1. `npx tsc --noEmit 2>&1 | grep -c "error"` → `0`
2. Module-specific import verification via grep
3. AGENTS.md accuracy check

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately):
├── Task 1: types/activity.ts + lib/file-classification.ts (zero deps)
├── Task 2: terminal/ (zero internal deps)
└── Task 3: cards/ActionCard (zero internal deps)

Wave 2 (After Wave 1):
├── Task 4: code-viewer/ (depends on existing context/, lib/)
├── Task 5: overlay/base (depends on existing context/, primitives/)
│
│   (Task 6 starts after BOTH Task 4 AND Task 5):
├── Task 6: markdown/ (depends on code-viewer, overlay/base)
│
│   (Task 7 starts after Task 6):
└── Task 7: overlay/composed (depends on markdown, terminal, code-viewer)

Wave 3 (After Wave 2):
├── Task 8: chat/ (depends on markdown, terminal, overlay)
├── Task 9: lib/tool-parsers (depends on types/activity, terminal)
└── Task 10: Barrel exports + package.json + final verification

Critical Path: Task 1 → Task 4 → Task 6 → Task 7 → Task 8 → Task 10
Parallel Speedup: ~35% faster than sequential
```

### Dependency Matrix

| Task | Depends On | Blocks | Can Parallelize With |
|------|------------|--------|---------------------|
| 1 | None | 4,5,6,7,8,9 | 2, 3 |
| 2 | None | 7, 8 | 1, 3 |
| 3 | None | None | 1, 2 |
| 4 | 1 (types) | 6, 7 | 5 |
| 5 | 1 (types) | 6, 7 | 4 |
| 6 | 4, 5 | 7, 8 | None |
| 7 | 6, 2 | 8 | None |
| 8 | 6, 7, 2 | 10 | 9 |
| 9 | 1, 2 | 10 | 8 |
| 10 | 8, 9 | None | None (final) |

---

## TODOs

- [ ] 1. Extract ActivityItem types + add file-classification utility

  **What to do**:
  - Create `src/types/activity.ts`: Extract `ActivityItem`, `ActivityStatus`, `ActivityType`, `ResponseContent`, `TodoItem` type definitions from source TurnCard.tsx (lines ~50-120). These are currently defined inside TurnCard but consumed by tool-parsers and InlineExecution.
  - Create `src/lib/file-classification.ts`: Copy from `/tmp/craft-agents-oss/packages/ui/src/lib/file-classification.ts` (95L). Pure utility, zero internal deps.
  - Update `src/types/index.ts`: Add `export * from './activity'`
  - Update `src/lib/index.ts`: Add `export * from './file-classification'`
  - Add GEB L3 headers to both new files
  - Update `src/types/AGENTS.md` and `src/lib/AGENTS.md`

  **Must NOT do**:
  - Do NOT add generic type parameters to ActivityItem — keep concrete types from source
  - Do NOT create a ChatProvider or injection pattern — that's Path B (out of scope)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Two small files, straightforward extraction, no complex logic
  - **Skills**: []
    - No special skills needed — pure file creation + barrel updates

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2, 3)
  - **Blocks**: Tasks 4, 5, 6, 7, 8, 9
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `src/types/message.ts` — Follow this exact file structure pattern (section dividers, type grouping, L3 header format)
  - `src/lib/linkify.ts` — Follow this pattern for lib utility files (L3 header, pure functions)

  **Source References**:
  - `/tmp/craft-agents-oss/packages/ui/src/components/chat/TurnCard.tsx:50-120` — ActivityItem, ActivityStatus, ActivityType, ResponseContent, TodoItem type definitions to extract
  - `/tmp/craft-agents-oss/packages/ui/src/lib/file-classification.ts` — Copy verbatim, only change import paths

  **Type References**:
  - `src/types/message.ts:ToolStatus` — ActivityItem references ToolStatus, already available locally
  - `src/types/message.ts:ToolDisplayMeta` — ActivityItem references ToolDisplayMeta, already available locally

  **Acceptance Criteria**:

  ```
  Scenario: TypeScript compilation passes with new type file
    Tool: Bash
    Steps:
      1. npx tsc --noEmit 2>&1 | grep -c "error"
      2. Assert: Output is "0"
    Expected Result: Zero type errors
    Evidence: Command output captured

  Scenario: ActivityItem type is importable from types barrel
    Tool: Bash
    Steps:
      1. grep -c "ActivityItem" src/types/activity.ts
      2. Assert: Output >= 1
      3. grep -c "activity" src/types/index.ts
      4. Assert: Output >= 1
    Expected Result: Type exists and is exported
    Evidence: grep output

  Scenario: file-classification exports are available
    Tool: Bash
    Steps:
      1. grep -c "export" src/lib/file-classification.ts
      2. Assert: Output >= 1
      3. grep -c "file-classification" src/lib/index.ts
      4. Assert: Output >= 1
    Expected Result: Utility exists and is barrel-exported
    Evidence: grep output

  Scenario: GEB L3 headers present
    Tool: Bash
    Steps:
      1. grep -c "PROTOCOL" src/types/activity.ts
      2. Assert: Output >= 1
      3. grep -c "PROTOCOL" src/lib/file-classification.ts
      4. Assert: Output >= 1
    Expected Result: Both files have L3 headers
    Evidence: grep output
  ```

  **Commit**: YES
  - Message: `feat(types): extract ActivityItem types + add file-classification`
  - Files: `src/types/activity.ts`, `src/types/index.ts`, `src/lib/file-classification.ts`, `src/lib/index.ts`, `src/types/AGENTS.md`, `src/lib/AGENTS.md`
  - Pre-commit: `npx tsc --noEmit`

- [ ] 2. Add terminal/ module (ansi-parser + TerminalOutput)

  **What to do**:
  - Create `src/components/terminal/ansi-parser.ts`: Copy from source (153L). Pure utility — ANSI escape code parsing, grep output detection. Zero internal deps.
  - Create `src/components/terminal/TerminalOutput.tsx`: Copy from source (220L). Replace `import { cn } from '../../lib/utils'` → `import { cn } from '@/utils'`. Replace `import { parseAnsi, stripAnsi, isGrepContentOutput, parseGrepOutput } from './ansi-parser'` (stays same — sibling import).
  - Create `src/components/terminal/index.ts`: Barrel export both files
  - Add GEB L3 headers to all files
  - Create `src/components/terminal/AGENTS.md`
  - Update `src/components/index.ts`: Add `export * from './terminal'`

  **Must NOT do**:
  - Do NOT modify ANSI color mappings or parsing logic
  - Do NOT add additional terminal features not in source

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Two files, straightforward copy+adapt, only import path changes
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 3)
  - **Blocks**: Tasks 7, 8
  - **Blocked By**: None

  **References**:

  **Source References**:
  - `/tmp/craft-agents-oss/packages/ui/src/components/terminal/ansi-parser.ts` — Copy verbatim, no import changes needed
  - `/tmp/craft-agents-oss/packages/ui/src/components/terminal/TerminalOutput.tsx` — Copy, fix cn import path

  **Pattern References**:
  - `src/components/overlay/ContentFrame.tsx` — Follow same import pattern for cn (`@/utils`)
  - `src/components/overlay/AGENTS.md` — Follow same L2 AGENTS.md format

  **Acceptance Criteria**:

  ```
  Scenario: TypeScript compilation passes
    Tool: Bash
    Steps:
      1. npx tsc --noEmit 2>&1 | grep -c "error"
      2. Assert: Output is "0"
    Expected Result: Zero type errors
    Evidence: Command output

  Scenario: Terminal exports are available from barrel
    Tool: Bash
    Steps:
      1. grep -c "TerminalOutput" src/components/terminal/index.ts
      2. Assert: Output >= 1
      3. grep -c "parseAnsi" src/components/terminal/index.ts
      4. Assert: Output >= 1
      5. grep -c "terminal" src/components/index.ts
      6. Assert: Output >= 1
    Expected Result: All exports wired through barrels
    Evidence: grep output

  Scenario: No @craft-agent/core imports
    Tool: Bash
    Steps:
      1. grep -rc "@craft-agent/core" src/components/terminal/ | grep -v ":0$"
      2. Assert: No output (all files show :0)
    Expected Result: Zero external core imports
    Evidence: grep output
  ```

  **Commit**: YES
  - Message: `feat(terminal): add TerminalOutput + ansi-parser`
  - Files: `src/components/terminal/ansi-parser.ts`, `src/components/terminal/TerminalOutput.tsx`, `src/components/terminal/index.ts`, `src/components/terminal/AGENTS.md`, `src/components/index.ts`
  - Pre-commit: `npx tsc --noEmit`

- [ ] 3. Add cards/ActionCard component

  **What to do**:
  - Create `src/components/cards/ActionCard.tsx`: Copy from source (268L). Fix imports: `cn` → `@/utils`, lucide-react stays as peer dep. ActionCard is a fully independent leaf component — no internal deps beyond cn.
  - Create `src/components/cards/index.ts`: Barrel export
  - Add GEB L3 header
  - Create `src/components/cards/AGENTS.md`
  - Update `src/components/index.ts`: Add `export * from './cards'`

  **Must NOT do**:
  - Do NOT add variants or props not in source
  - Do NOT abstract ActionCard into a generic card system

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single component, zero internal deps, pure copy+adapt
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2)
  - **Blocks**: None (leaf component)
  - **Blocked By**: None

  **References**:

  **Source References**:
  - `/tmp/craft-agents-oss/packages/ui/src/components/cards/ActionCard.tsx` — Copy, fix cn import

  **Pattern References**:
  - `src/components/primitives/CopyButton.tsx` — Follow same import pattern and L3 header format

  **Acceptance Criteria**:

  ```
  Scenario: TypeScript compilation passes
    Tool: Bash
    Steps:
      1. npx tsc --noEmit 2>&1 | grep -c "error"
      2. Assert: Output is "0"
    Expected Result: Zero type errors
    Evidence: Command output

  Scenario: ActionCard exported from barrel
    Tool: Bash
    Steps:
      1. grep -c "ActionCard" src/components/cards/index.ts
      2. Assert: Output >= 1
      3. grep -c "cards" src/components/index.ts
      4. Assert: Output >= 1
    Expected Result: Export chain complete
    Evidence: grep output
  ```

  **Commit**: YES
  - Message: `feat(cards): add ActionCard component`
  - Files: `src/components/cards/ActionCard.tsx`, `src/components/cards/index.ts`, `src/components/cards/AGENTS.md`, `src/components/index.ts`
  - Pre-commit: `npx tsc --noEmit`

- [ ] 4. Add code-viewer composite components

  **What to do**:
  - Create `src/components/code-viewer/ShikiCodeViewer.tsx`: Copy from source (187L). Fix imports: `cn` → `@/utils`, `LANGUAGE_MAP` → `@/lib` (already exists as `src/lib/language-map.ts`). Uses `shiki` and `codeToHtml` from peer dep.
  - Create `src/components/code-viewer/ShikiDiffViewer.tsx`: Copy from source (221L). Fix imports: `cn` → `@/utils`, `LANGUAGE_MAP` → `@/lib`, `registerCraftShikiThemes` → sibling import (already exists). Uses `@pierre/diffs` peer dep. Includes custom element registration for `DIFFS_TAG_NAME`.
  - Create `src/components/code-viewer/UnifiedDiffViewer.tsx`: Copy from source (246L). Same import fixes as ShikiDiffViewer. Uses `parsePatchFiles` from `@pierre/diffs`.
  - Create `src/components/code-viewer/DiffViewerControls.tsx`: Copy from source (87L). Fix `cn` import. Uses sibling `DiffIcons` (already exists).
  - Update `src/components/code-viewer/index.ts`: Add exports for all 4 new components + existing DiffIcons and registerShikiThemes
  - Add GEB L3 headers to all 4 files
  - Update `src/components/code-viewer/AGENTS.md`

  **Must NOT do**:
  - Do NOT modify Shiki theme logic or diff rendering behavior
  - Do NOT change the custom element registration pattern for @pierre/diffs
  - Do NOT add language detection beyond what source provides

  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
    - Reason: 4 files, moderate complexity from @pierre/diffs integration, but all copy+adapt
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Task 5)
  - **Blocks**: Tasks 6, 7
  - **Blocked By**: Task 1 (needs types barrel updated)

  **References**:

  **Source References**:
  - `/tmp/craft-agents-oss/packages/ui/src/components/code-viewer/ShikiCodeViewer.tsx` — Copy, fix cn + LANGUAGE_MAP imports
  - `/tmp/craft-agents-oss/packages/ui/src/components/code-viewer/ShikiDiffViewer.tsx` — Copy, fix cn + LANGUAGE_MAP + registerCraftShikiThemes imports
  - `/tmp/craft-agents-oss/packages/ui/src/components/code-viewer/UnifiedDiffViewer.tsx` — Copy, same pattern as ShikiDiffViewer
  - `/tmp/craft-agents-oss/packages/ui/src/components/code-viewer/DiffViewerControls.tsx` — Copy, fix cn import

  **Pattern References**:
  - `src/components/code-viewer/DiffIcons.tsx` — Already exists, follow same import pattern
  - `src/components/code-viewer/registerShikiThemes.ts` — Already exists, sibling import pattern

  **API/Type References**:
  - `@pierre/diffs` — FileDiff, FileDiffProps, FileDiffMetadata, parseDiffFromFile, parsePatchFiles, DIFFS_TAG_NAME
  - `shiki` — codeToHtml, bundledLanguages, BundledLanguage

  **Acceptance Criteria**:

  ```
  Scenario: TypeScript compilation passes
    Tool: Bash
    Steps:
      1. npx tsc --noEmit 2>&1 | grep -c "error"
      2. Assert: Output is "0"
    Expected Result: Zero type errors
    Evidence: Command output

  Scenario: All code-viewer components exported
    Tool: Bash
    Steps:
      1. grep "ShikiCodeViewer" src/components/code-viewer/index.ts
      2. grep "ShikiDiffViewer" src/components/code-viewer/index.ts
      3. grep "UnifiedDiffViewer" src/components/code-viewer/index.ts
      4. grep "DiffViewerControls" src/components/code-viewer/index.ts
      5. Assert: All 4 greps return matches
    Expected Result: All components in barrel
    Evidence: grep output

  Scenario: No @craft-agent/core imports in code-viewer
    Tool: Bash
    Steps:
      1. grep -rc "@craft-agent/core" src/components/code-viewer/ | grep -v ":0$"
      2. Assert: No output
    Expected Result: Zero external core imports
    Evidence: grep output

  Scenario: @pierre/diffs imports are peer dep references (not local)
    Tool: Bash
    Steps:
      1. grep -c "@pierre/diffs" src/components/code-viewer/ShikiDiffViewer.tsx
      2. Assert: Output >= 1 (peer dep import present)
      3. grep "@pierre/diffs" package.json
      4. Assert: Match found in peerDependencies
    Expected Result: @pierre/diffs used as peer dep correctly
    Evidence: grep output
  ```

  **Commit**: YES
  - Message: `feat(code-viewer): add ShikiCodeViewer, ShikiDiffViewer, UnifiedDiffViewer, DiffViewerControls`
  - Files: `src/components/code-viewer/*.tsx`, `src/components/code-viewer/index.ts`, `src/components/code-viewer/AGENTS.md`
  - Pre-commit: `npx tsc --noEmit`

- [ ] 5. Add overlay base layer components

  **What to do**:
  - Create `src/components/overlay/FullscreenOverlayBase.tsx`: Copy from source (181L). Fix imports: `cn` → `@/utils`, Radix Dialog from peer dep. This is the foundational overlay wrapper — dialog + backdrop + close button.
  - Create `src/components/overlay/FullscreenOverlayBaseHeader.tsx`: Copy from source (252L). Fix imports: `cn` → `@/utils`, lucide-react icons. Header bar with title, actions, close button.
  - Create `src/components/overlay/PreviewOverlay.tsx`: Copy from source (210L). Fix imports: `cn` → `@/utils`, uses FullscreenOverlayBase + FullscreenOverlayBaseHeader as siblings.
  - Create `src/components/overlay/GenericOverlay.tsx`: Copy from source (181L). Fix imports: `cn` → `@/utils`, uses PreviewOverlay as sibling.
  - Create `src/components/overlay/ImagePreviewOverlay.tsx`: Copy from source (96L). Fix imports. Uses PreviewOverlay. Zero external deps beyond React.
  - Update `src/components/overlay/index.ts`: Add exports for all 5 new + existing 2 (OverlayErrorBanner, ContentFrame)
  - Add GEB L3 headers to all 5 files
  - Update `src/components/overlay/AGENTS.md`

  **Must NOT do**:
  - Do NOT add composed overlays here (Code/Terminal/JSON/PDF/Mermaid/DataTable/Document) — those go in Task 7 after markdown is ready
  - Do NOT modify dialog animation or backdrop behavior

  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
    - Reason: 5 files, moderate complexity, all copy+adapt with sibling imports
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Task 4)
  - **Blocks**: Tasks 6, 7
  - **Blocked By**: Task 1 (needs types barrel)

  **References**:

  **Source References**:
  - `/tmp/craft-agents-oss/packages/ui/src/components/overlay/FullscreenOverlayBase.tsx` — Copy, fix cn import
  - `/tmp/craft-agents-oss/packages/ui/src/components/overlay/FullscreenOverlayBaseHeader.tsx` — Copy, fix cn + lucide imports
  - `/tmp/craft-agents-oss/packages/ui/src/components/overlay/PreviewOverlay.tsx` — Copy, fix cn + sibling imports
  - `/tmp/craft-agents-oss/packages/ui/src/components/overlay/GenericOverlay.tsx` — Copy, fix cn + sibling imports
  - `/tmp/craft-agents-oss/packages/ui/src/components/overlay/ImagePreviewOverlay.tsx` — Copy, fix cn + sibling imports

  **Pattern References**:
  - `src/components/overlay/ContentFrame.tsx` — Already exists, follow same import pattern
  - `src/components/overlay/OverlayErrorBanner.tsx` — Already exists, follow same L3 header format

  **Acceptance Criteria**:

  ```
  Scenario: TypeScript compilation passes
    Tool: Bash
    Steps:
      1. npx tsc --noEmit 2>&1 | grep -c "error"
      2. Assert: Output is "0"
    Expected Result: Zero type errors
    Evidence: Command output

  Scenario: All base overlay components exported
    Tool: Bash
    Steps:
      1. grep "FullscreenOverlayBase" src/components/overlay/index.ts
      2. grep "PreviewOverlay" src/components/overlay/index.ts
      3. grep "GenericOverlay" src/components/overlay/index.ts
      4. grep "ImagePreviewOverlay" src/components/overlay/index.ts
      5. Assert: All greps return matches
    Expected Result: All base overlays in barrel
    Evidence: grep output

  Scenario: No @craft-agent/core imports
    Tool: Bash
    Steps:
      1. grep -rc "@craft-agent/core" src/components/overlay/ | grep -v ":0$"
      2. Assert: No output
    Expected Result: Zero external core imports
    Evidence: grep output
  ```

  **Commit**: YES
  - Message: `feat(overlay): add base overlay components`
  - Files: `src/components/overlay/Fullscreen*.tsx`, `src/components/overlay/PreviewOverlay.tsx`, `src/components/overlay/GenericOverlay.tsx`, `src/components/overlay/ImagePreviewOverlay.tsx`, `src/components/overlay/index.ts`, `src/components/overlay/AGENTS.md`
  - Pre-commit: `npx tsc --noEmit`

- [ ] 6. Add markdown/ composite components

  **What to do**:
  - Create `src/components/markdown/CodeBlock.tsx`: Copy from source (234L). Fix imports: `cn` → `@/utils`, `ShikiCodeViewer` → `@/components/code-viewer` (Task 4), `CopyButton` → `@/components/primitives`. Uses `CollapsibleMarkdownContext` (already exists as sibling).
  - Create `src/components/markdown/CollapsibleSection.tsx`: Copy from source (103L). Fix imports: `cn` → `@/utils`, `motion` from peer dep. Uses `CollapsibleMarkdownContext` (already exists).
  - Create `src/components/markdown/TableExportDropdown.tsx`: Copy from source (75L). Fix imports: `cn` → `@/utils`, `exportTable*` → `@/lib` (table-export already exists). Uses `StyledDropdown` → `@/components/primitives`.
  - Create `src/components/markdown/Markdown.tsx`: Copy from source (469L). Fix imports: `cn` → `@/utils`, `react-markdown` + `remark-gfm` + `rehype-raw` from peer deps. Uses sibling components (CodeBlock, CollapsibleSection, TableExportDropdown, safe-components, CollapsibleMarkdownContext). Uses `linkifyUrls` → `@/lib/linkify` (already exists).
  - Create `src/components/markdown/MarkdownDiffBlock.tsx`: Copy from source (163L). Fix imports: `ShikiDiffViewer` + `UnifiedDiffViewer` → `@/components/code-viewer` (Task 4).
  - Create `src/components/markdown/MarkdownJsonBlock.tsx`: Copy from source (205L). Fix imports: `@uiw/react-json-view` (already in deps). Uses `GenericOverlay` → `@/components/overlay` (Task 5).
  - Create `src/components/markdown/MarkdownMermaidBlock.tsx`: Copy from source (224L). Fix imports: `@craft-agent/mermaid` as optional peer dep with dynamic import + CodeBlock fallback. Uses `PreviewOverlay` → `@/components/overlay` (Task 5).
  - Create `src/components/markdown/MarkdownDatatableBlock.tsx`: Copy from source (718L). Fix imports: `cn` → `@/utils`, `nice-ticks` (already in deps). Uses `GenericOverlay` → `@/components/overlay` (Task 5). Large file — chart rendering + table display.
  - Create `src/components/markdown/MarkdownSpreadsheetBlock.tsx`: Copy from source (317L). Fix imports: `cn` → `@/utils`. Uses `GenericOverlay` → `@/components/overlay` (Task 5).
  - Update `src/components/markdown/index.ts`: Add exports for all 8 new components + existing 3 (safe-components, CollapsibleMarkdownContext, remarkCollapsibleSections)
  - Add GEB L3 headers to all 8 files
  - Update `src/components/markdown/AGENTS.md`

  **Must NOT do**:
  - Do NOT modify Markdown rendering pipeline or remark plugin chain
  - Do NOT change chart rendering logic in MarkdownDatatableBlock
  - Do NOT add markdown extensions not in source
  - Do NOT inline @craft-agent/mermaid — keep as optional peer dep with dynamic import

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: 8 files, ~2400 lines total, complex import rewiring across code-viewer + overlay + lib dependencies. MarkdownDatatableBlock alone is 718L.
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential — after Tasks 4 AND 5
  - **Blocks**: Tasks 7, 8
  - **Blocked By**: Task 4 (code-viewer), Task 5 (overlay/base)

  **References**:

  **Source References**:
  - `/tmp/craft-agents-oss/packages/ui/src/components/markdown/CodeBlock.tsx` — Copy, fix cn + ShikiCodeViewer + CopyButton imports
  - `/tmp/craft-agents-oss/packages/ui/src/components/markdown/CollapsibleSection.tsx` — Copy, fix cn import, motion peer dep
  - `/tmp/craft-agents-oss/packages/ui/src/components/markdown/TableExportDropdown.tsx` — Copy, fix cn + exportTable + StyledDropdown imports
  - `/tmp/craft-agents-oss/packages/ui/src/components/markdown/Markdown.tsx` — Copy, fix all imports (largest file, most rewiring)
  - `/tmp/craft-agents-oss/packages/ui/src/components/markdown/MarkdownDiffBlock.tsx` — Copy, fix ShikiDiffViewer + UnifiedDiffViewer imports
  - `/tmp/craft-agents-oss/packages/ui/src/components/markdown/MarkdownJsonBlock.tsx` — Copy, fix GenericOverlay import
  - `/tmp/craft-agents-oss/packages/ui/src/components/markdown/MarkdownMermaidBlock.tsx` — Copy, fix overlay import, keep @craft-agent/mermaid as optional
  - `/tmp/craft-agents-oss/packages/ui/src/components/markdown/MarkdownDatatableBlock.tsx` — Copy, fix cn + GenericOverlay imports (718L, careful)
  - `/tmp/craft-agents-oss/packages/ui/src/components/markdown/MarkdownSpreadsheetBlock.tsx` — Copy, fix cn + GenericOverlay imports

  **Pattern References**:
  - `src/components/markdown/safe-components.tsx` — Already exists, follow same import pattern
  - `src/components/markdown/CollapsibleMarkdownContext.tsx` — Already exists, sibling import pattern
  - `src/lib/linkify.ts` — Already exists, import as `@/lib/linkify`
  - `src/lib/table-export.ts` — Already exists, import as `@/lib/table-export`

  **API/Type References**:
  - `react-markdown` — ReactMarkdown component, Components type
  - `remark-gfm` — GFM plugin
  - `rehype-raw` — Raw HTML plugin
  - `@craft-agent/mermaid` — Optional, MermaidRenderer component (dynamic import)
  - `nice-ticks` — Tick generation for chart axes in MarkdownDatatableBlock

  **Acceptance Criteria**:

  ```
  Scenario: TypeScript compilation passes
    Tool: Bash
    Steps:
      1. npx tsc --noEmit 2>&1 | grep -c "error"
      2. Assert: Output is "0"
    Expected Result: Zero type errors
    Evidence: Command output

  Scenario: All markdown components exported
    Tool: Bash
    Steps:
      1. grep "Markdown" src/components/markdown/index.ts | wc -l
      2. Assert: Output >= 8 (Markdown, CodeBlock, CollapsibleSection, TableExportDropdown, MarkdownDiffBlock, MarkdownJsonBlock, MarkdownMermaidBlock, MarkdownDatatableBlock, MarkdownSpreadsheetBlock + existing 3)
    Expected Result: All components in barrel
    Evidence: grep output

  Scenario: No @craft-agent/core imports in markdown
    Tool: Bash
    Steps:
      1. grep -rc "@craft-agent/core" src/components/markdown/ | grep -v ":0$"
      2. Assert: No output
    Expected Result: Zero external core imports
    Evidence: grep output

  Scenario: @craft-agent/mermaid is optional (dynamic import)
    Tool: Bash
    Steps:
      1. grep "import(" src/components/markdown/MarkdownMermaidBlock.tsx
      2. Assert: Contains dynamic import() call (not static import)
    Expected Result: Mermaid loaded dynamically
    Evidence: grep output
  ```

  **Commit**: YES
  - Message: `feat(markdown): add Markdown, CodeBlock, CollapsibleSection, block renderers`
  - Files: `src/components/markdown/*.tsx`, `src/components/markdown/index.ts`, `src/components/markdown/AGENTS.md`
  - Pre-commit: `npx tsc --noEmit`

- [ ] 7. Add overlay composed preview components

  **What to do**:
  - Create `src/components/overlay/CodePreviewOverlay.tsx`: Copy from source (108L). Fix imports: uses `ShikiCodeViewer` → `@/components/code-viewer`, `PreviewOverlay` → sibling.
  - Create `src/components/overlay/TerminalPreviewOverlay.tsx`: Copy from source (94L). Fix imports: uses `TerminalOutput` → `@/components/terminal` (Task 2), `PreviewOverlay` → sibling.
  - Create `src/components/overlay/JSONPreviewOverlay.tsx`: Copy from source (170L). Fix imports: `@uiw/react-json-view` (already in deps), `PreviewOverlay` → sibling.
  - Create `src/components/overlay/PDFPreviewOverlay.tsx`: Copy from source (164L). Fix imports: `react-pdf` as optional peer dep with dynamic import, `PreviewOverlay` → sibling.
  - Create `src/components/overlay/MermaidPreviewOverlay.tsx`: Copy from source (470L). Fix imports: `@craft-agent/mermaid` as optional peer dep, `PreviewOverlay` → sibling. Large file — mermaid rendering + zoom/pan controls.
  - Create `src/components/overlay/MultiDiffPreviewOverlay.tsx`: Copy from source (395L). Fix imports: `ShikiDiffViewer` + `UnifiedDiffViewer` → `@/components/code-viewer`, `DiffViewerControls` → `@/components/code-viewer`, `PreviewOverlay` → sibling.
  - Create `src/components/overlay/DataTableOverlay.tsx`: Copy from source (63L). Fix imports: `GenericOverlay` → sibling.
  - Create `src/components/overlay/DocumentFormattedMarkdownOverlay.tsx`: Copy from source (90L). Fix imports: `Markdown` → `@/components/markdown` (Task 6), `PreviewOverlay` → sibling. **This is the markdown→overlay back-edge that completes the cycle.**
  - Update `src/components/overlay/index.ts`: Add exports for all 8 new composed overlays
  - Add GEB L3 headers to all 8 files
  - Update `src/components/overlay/AGENTS.md`
  - Add `react-pdf` and `@craft-agent/mermaid` to package.json peerDependencies + peerDependenciesMeta (optional)

  **Must NOT do**:
  - Do NOT modify zoom/pan logic in MermaidPreviewOverlay
  - Do NOT inline react-pdf or @craft-agent/mermaid — keep as optional peer deps
  - Do NOT add overlay types not in source

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: 8 files, ~1550 lines total, complex cross-module imports (code-viewer, terminal, markdown), optional peer dep handling
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential — after Task 6
  - **Blocks**: Task 8
  - **Blocked By**: Task 6 (markdown), Task 2 (terminal), Task 4 (code-viewer)

  **References**:

  **Source References**:
  - `/tmp/craft-agents-oss/packages/ui/src/components/overlay/CodePreviewOverlay.tsx` — Copy, fix ShikiCodeViewer + PreviewOverlay imports
  - `/tmp/craft-agents-oss/packages/ui/src/components/overlay/TerminalPreviewOverlay.tsx` — Copy, fix TerminalOutput + PreviewOverlay imports
  - `/tmp/craft-agents-oss/packages/ui/src/components/overlay/JSONPreviewOverlay.tsx` — Copy, fix json-view + PreviewOverlay imports
  - `/tmp/craft-agents-oss/packages/ui/src/components/overlay/PDFPreviewOverlay.tsx` — Copy, fix react-pdf (optional) + PreviewOverlay imports
  - `/tmp/craft-agents-oss/packages/ui/src/components/overlay/MermaidPreviewOverlay.tsx` — Copy, fix mermaid (optional) + PreviewOverlay imports (470L, careful)
  - `/tmp/craft-agents-oss/packages/ui/src/components/overlay/MultiDiffPreviewOverlay.tsx` — Copy, fix code-viewer imports (395L)
  - `/tmp/craft-agents-oss/packages/ui/src/components/overlay/DataTableOverlay.tsx` — Copy, fix GenericOverlay import
  - `/tmp/craft-agents-oss/packages/ui/src/components/overlay/DocumentFormattedMarkdownOverlay.tsx` — Copy, fix Markdown + PreviewOverlay imports

  **Pattern References**:
  - `src/components/overlay/ImagePreviewOverlay.tsx` — Created in Task 5, follow same pattern for other preview overlays
  - `src/components/overlay/FullscreenOverlayBase.tsx` — Created in Task 5, base layer pattern

  **Acceptance Criteria**:

  ```
  Scenario: TypeScript compilation passes
    Tool: Bash
    Steps:
      1. npx tsc --noEmit 2>&1 | grep -c "error"
      2. Assert: Output is "0"
    Expected Result: Zero type errors
    Evidence: Command output

  Scenario: All composed overlays exported
    Tool: Bash
    Steps:
      1. grep "Overlay" src/components/overlay/index.ts | wc -l
      2. Assert: Output >= 12 (5 base + 8 composed - some share names)
    Expected Result: All overlays in barrel
    Evidence: grep output

  Scenario: No @craft-agent/core imports in overlay
    Tool: Bash
    Steps:
      1. grep -rc "@craft-agent/core" src/components/overlay/ | grep -v ":0$"
      2. Assert: No output
    Expected Result: Zero external core imports
    Evidence: grep output

  Scenario: Optional peer deps added to package.json
    Tool: Bash
    Steps:
      1. grep "react-pdf" package.json
      2. Assert: Found in peerDependencies
      3. grep "@craft-agent/mermaid" package.json
      4. Assert: Found in peerDependencies
      5. grep -A1 "react-pdf" package.json | grep "optional"
      6. Assert: Marked as optional
    Expected Result: Optional peers configured
    Evidence: grep output
  ```

  **Commit**: YES
  - Message: `feat(overlay): add composed preview overlays`
  - Files: `src/components/overlay/*PreviewOverlay.tsx`, `src/components/overlay/DataTableOverlay.tsx`, `src/components/overlay/DocumentFormattedMarkdownOverlay.tsx`, `src/components/overlay/index.ts`, `src/components/overlay/AGENTS.md`, `package.json`
  - Pre-commit: `npx tsc --noEmit`

- [ ] 8. Add chat/ module (Path A — import fixes only)

  **What to do**:
  - Create `src/components/chat/turn-utils.ts`: Copy from source (1197L). Fix ALL imports: `Message`, `StoredMessage`, `ToolDisplayMeta`, `ToolStatus` → `@/types`. `normalizePath`, `pathStartsWith`, `stripPathPrefix` → `@/utils/paths` (already exists). This is the largest utility file — pure functions for turn lifecycle, activity processing, grouping.
  - Create `src/components/chat/TurnCard.tsx`: Copy from source (2125L). Fix imports: all `@craft-agent/core` types → `@/types`, `@craft-agent/core/utils` → `@/utils/paths`, `motion/react` stays as peer dep, `@pierre/diffs` stays as peer dep, `lucide-react` stays as peer dep, `react-dom` stays. Internal imports: `turn-utils` → sibling, `Markdown` → `@/components/markdown`, `TerminalOutput` → `@/components/terminal`, `ShikiDiffViewer` → `@/components/code-viewer`, overlay components → `@/components/overlay`. **CRITICAL**: Move `ActivityItem`, `ActivityStatus`, `ActivityType`, `ResponseContent`, `TodoItem` type exports to reference `@/types/activity` (Task 1) — re-export from TurnCard for backward compat if needed.
  - Create `src/components/chat/SessionViewer.tsx`: Copy from source (237L). Fix imports: `StoredSession` → `@/types`, uses `TurnCard` as sibling, `turn-utils` as sibling.
  - Create `src/components/chat/UserMessageBubble.tsx`: Copy from source (465L). Fix imports: `StoredAttachment`, `ContentBadge`, `Message` → `@/types`, `cn` → `@/utils`, `Markdown` → `@/components/markdown`, attachment helpers → `@/lib/attachment-helpers` (already exists).
  - Create `src/components/chat/SystemMessage.tsx`: Copy from source (84L). Fix imports: `Message` → `@/types`, `cn` → `@/utils`, `Markdown` → `@/components/markdown`.
  - Create `src/components/chat/InlineExecution.tsx`: Copy from source (234L). Fix imports: `ActivityItem` → `@/types/activity` (Task 1), `ActivityStatusIcon` + `SIZE_CONFIG` → sibling TurnCard (keep intra-module import), `TerminalOutput` → `@/components/terminal`.
  - Create `src/components/chat/AcceptPlanDropdown.tsx`: Copy from source (215L). Fix imports: `cn` → `@/utils`, lucide-react stays. Fully standalone — no @craft-agent/core deps.
  - Create `src/components/chat/TurnCardActionsMenu.tsx`: Copy from source (82L). Fix imports: `cn` → `@/utils`, lucide-react stays.
  - Create `src/components/chat/index.ts`: Barrel export all 8 components + turn-utils
  - Add GEB L3 headers to all 8 files
  - Create `src/components/chat/AGENTS.md`
  - Update `src/components/index.ts`: Add `export * from './chat'`

  **Must NOT do**:
  - Do NOT refactor TurnCard internals — import path changes ONLY
  - Do NOT decompose TurnCard into sub-components (that's Path B, out of scope)
  - Do NOT modify turn-utils function signatures or logic
  - Do NOT add ChatProvider context or tool renderer injection
  - Do NOT split turn-utils.ts into multiple files
  - Do NOT change conditional branching patterns in tool rendering
  - Do NOT add error boundaries or loading states not in source
  - Do NOT modify AcceptPlanDropdown business logic

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: 8 files, ~4600 lines total, heaviest import rewiring task. TurnCard (2125L) and turn-utils (1197L) are the two largest files in the entire kit. Requires careful import mapping across all modules.
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 3 — sequential after all Wave 2 tasks
  - **Blocks**: Task 10
  - **Blocked By**: Task 1 (types/activity), Task 2 (terminal), Task 6 (markdown), Task 7 (overlay/composed)

  **References**:

  **Source References**:
  - `/tmp/craft-agents-oss/packages/ui/src/components/chat/turn-utils.ts` — Copy, fix ALL @craft-agent/core imports (1197L)
  - `/tmp/craft-agents-oss/packages/ui/src/components/chat/TurnCard.tsx` — Copy, fix ALL imports (2125L, most complex file)
  - `/tmp/craft-agents-oss/packages/ui/src/components/chat/SessionViewer.tsx` — Copy, fix type + sibling imports
  - `/tmp/craft-agents-oss/packages/ui/src/components/chat/UserMessageBubble.tsx` — Copy, fix type + markdown + attachment imports
  - `/tmp/craft-agents-oss/packages/ui/src/components/chat/SystemMessage.tsx` — Copy, fix type + markdown imports
  - `/tmp/craft-agents-oss/packages/ui/src/components/chat/InlineExecution.tsx` — Copy, fix ActivityItem + terminal imports
  - `/tmp/craft-agents-oss/packages/ui/src/components/chat/AcceptPlanDropdown.tsx` — Copy, fix cn import (standalone)
  - `/tmp/craft-agents-oss/packages/ui/src/components/chat/TurnCardActionsMenu.tsx` — Copy, fix cn import (standalone)

  **Type References**:
  - `src/types/message.ts` — Message, StoredMessage, ToolDisplayMeta, ToolStatus, StoredAttachment, ContentBadge, MessageRole, AttachmentType
  - `src/types/session.ts` — StoredSession, Session, SessionMetadata
  - `src/types/activity.ts` — ActivityItem, ActivityStatus, ActivityType, ResponseContent, TodoItem (Task 1)

  **Pattern References**:
  - `src/utils/paths.ts` — normalizePath, pathStartsWith, stripPathPrefix (already exists, replaces @craft-agent/core/utils)
  - `src/lib/attachment-helpers.tsx` — Already exists, import as `@/lib/attachment-helpers`

  **Import Mapping Cheatsheet** (for executor):
  ```
  @craft-agent/core → @/types
  @craft-agent/core/utils → @/utils/paths
  ../../lib/utils → @/utils (cn)
  ../markdown/Markdown → @/components/markdown
  ../terminal/TerminalOutput → @/components/terminal
  ../code-viewer/ShikiDiffViewer → @/components/code-viewer
  ../overlay/* → @/components/overlay
  ../../lib/attachment-helpers → @/lib/attachment-helpers
  ```

  **Acceptance Criteria**:

  ```
  Scenario: TypeScript compilation passes
    Tool: Bash
    Steps:
      1. npx tsc --noEmit 2>&1 | grep -c "error"
      2. Assert: Output is "0"
    Expected Result: Zero type errors
    Evidence: Command output

  Scenario: ZERO @craft-agent/core imports remain in entire src/
    Tool: Bash
    Steps:
      1. grep -r "@craft-agent/core" src/ --include="*.ts" --include="*.tsx" | wc -l
      2. Assert: Output is "0"
    Expected Result: Complete decoupling from @craft-agent/core
    Evidence: grep output

  Scenario: All chat components exported
    Tool: Bash
    Steps:
      1. grep "TurnCard" src/components/chat/index.ts
      2. grep "SessionViewer" src/components/chat/index.ts
      3. grep "UserMessageBubble" src/components/chat/index.ts
      4. grep "SystemMessage" src/components/chat/index.ts
      5. grep "turn-utils" src/components/chat/index.ts
      6. grep "InlineExecution" src/components/chat/index.ts
      7. grep "AcceptPlanDropdown" src/components/chat/index.ts
      8. grep "TurnCardActionsMenu" src/components/chat/index.ts
      9. Assert: All 8 greps return matches
    Expected Result: All chat components in barrel
    Evidence: grep output

  Scenario: TurnCard uses local types, not external
    Tool: Bash
    Steps:
      1. grep -c "@/types" src/components/chat/TurnCard.tsx
      2. Assert: Output >= 1
      3. grep -c "@craft-agent/core" src/components/chat/TurnCard.tsx
      4. Assert: Output is "0"
    Expected Result: TurnCard fully decoupled
    Evidence: grep output

  Scenario: turn-utils uses local types, not external
    Tool: Bash
    Steps:
      1. grep -c "@/types" src/components/chat/turn-utils.ts
      2. Assert: Output >= 1
      3. grep -c "@craft-agent/core" src/components/chat/turn-utils.ts
      4. Assert: Output is "0"
    Expected Result: turn-utils fully decoupled
    Evidence: grep output
  ```

  **Commit**: YES
  - Message: `feat(chat): add TurnCard, SessionViewer, UserMessageBubble, SystemMessage + utils`
  - Files: `src/components/chat/*.ts(x)`, `src/components/chat/index.ts`, `src/components/chat/AGENTS.md`, `src/components/index.ts`
  - Pre-commit: `npx tsc --noEmit && grep -r "@craft-agent/core" src/ --include="*.ts" --include="*.tsx" | wc -l`

- [ ] 9. Add lib/tool-parsers utility

  **What to do**:
  - Create `src/lib/tool-parsers.ts`: Copy from source (580L). Fix ALL imports: `ActivityItem`, `ActivityType`, `ActivityStatus` → `@/types/activity` (Task 1). `ToolStatus`, `ToolDisplayMeta` → `@/types/message`. `ToolType` (if imported from TerminalOutput) → define locally or import from `@/components/terminal`. `normalizePath` → `@/utils/paths`. `getFileClassification` → sibling `@/lib/file-classification` (Task 1). This file parses raw tool events into structured ActivityItem objects — the bridge between agent events and UI rendering.
  - Update `src/lib/index.ts`: Add `export * from './tool-parsers'`
  - Add GEB L3 header
  - Update `src/lib/AGENTS.md`

  **Must NOT do**:
  - Do NOT modify parsing logic or tool classification rules
  - Do NOT add new tool types not in source
  - Do NOT refactor the switch/case structure (Path A — preserve as-is)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
    - Reason: Single file, moderate size, import rewiring only
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Task 8)
  - **Blocks**: Task 10
  - **Blocked By**: Task 1 (types/activity), Task 2 (terminal — for ToolType if needed)

  **References**:

  **Source References**:
  - `/tmp/craft-agents-oss/packages/ui/src/lib/tool-parsers.ts` — Copy, fix all type imports (580L)

  **Type References**:
  - `src/types/activity.ts` — ActivityItem, ActivityType, ActivityStatus (Task 1)
  - `src/types/message.ts` — ToolStatus, ToolDisplayMeta, Message
  - `src/lib/file-classification.ts` — getFileClassification (Task 1)
  - `src/utils/paths.ts` — normalizePath

  **Import Mapping Cheatsheet**:
  ```
  ../components/chat/TurnCard (ActivityItem etc.) → @/types/activity
  @craft-agent/core → @/types
  @craft-agent/core/utils → @/utils/paths
  ./file-classification → ./file-classification (sibling, stays same)
  ```

  **Acceptance Criteria**:

  ```
  Scenario: TypeScript compilation passes
    Tool: Bash
    Steps:
      1. npx tsc --noEmit 2>&1 | grep -c "error"
      2. Assert: Output is "0"
    Expected Result: Zero type errors
    Evidence: Command output

  Scenario: tool-parsers has no upward dependency on components
    Tool: Bash
    Steps:
      1. grep -c "components/" src/lib/tool-parsers.ts
      2. Assert: Output is "0"
    Expected Result: lib/ does not import from components/ (architectural inversion fixed)
    Evidence: grep output

  Scenario: tool-parsers exported from lib barrel
    Tool: Bash
    Steps:
      1. grep -c "tool-parsers" src/lib/index.ts
      2. Assert: Output >= 1
    Expected Result: Export chain complete
    Evidence: grep output
  ```

  **Commit**: YES
  - Message: `feat(lib): add tool-parsers with local type imports`
  - Files: `src/lib/tool-parsers.ts`, `src/lib/index.ts`, `src/lib/AGENTS.md`
  - Pre-commit: `npx tsc --noEmit`

- [ ] 10. Finalize barrel exports, package.json, AGENTS.md, verification

  **What to do**:
  - Verify and update `src/index.ts`: Ensure all module barrels are re-exported (types, utils, context, components, hooks, lib). Verify subpath exports for chat, markdown, code-viewer, terminal, overlay, context, types all resolve.
  - Update `src/components/index.ts`: Ensure all sub-module barrels are included (primitives, code-viewer, markdown, overlay, terminal, cards, chat).
  - Update `package.json`:
    - Add `"./cards": "./src/components/cards/index.ts"` to exports
    - Verify all existing subpath exports resolve to valid files
    - Add optional peer deps if not already added: `@craft-agent/mermaid`, `react-pdf`
    - Verify `@uiw/react-json-view`, `nice-ticks`, `fflate` in dependencies
  - Update root `AGENTS.md` (L1): Add cards/, chat/, terminal/ to directory listing. Update component counts and descriptions.
  - Final verification sweep:
    - `npx tsc --noEmit` → 0 errors
    - `grep -r "@craft-agent/core" src/` → 0 matches
    - `grep -rL "\[PROTOCOL\]" src/**/*.ts src/**/*.tsx` → 0 files missing L3 headers
    - Verify every AGENTS.md at L2 level is accurate (types, utils, context, lib, hooks, components/primitives, components/code-viewer, components/markdown, components/overlay, components/terminal, components/cards, components/chat)

  **Must NOT do**:
  - Do NOT add new components or utilities not covered in Tasks 1-9
  - Do NOT modify any component logic — barrel wiring and metadata only
  - Do NOT create README.md or documentation beyond AGENTS.md

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Barrel wiring, package.json edits, AGENTS.md updates — no complex logic
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Final — after Tasks 8 and 9
  - **Blocks**: None (final task)
  - **Blocked By**: Task 8 (chat), Task 9 (tool-parsers)

  **References**:

  **Pattern References**:
  - `src/index.ts` — Current barrel (7 lines), extend with any missing modules
  - `src/components/index.ts` — Current barrel, add chat, cards, terminal
  - `package.json` — Current exports map, extend

  **AGENTS.md References**:
  - `/AGENTS.md` — Root L1, update directory listing
  - `src/components/*/AGENTS.md` — All L2 files, verify accuracy

  **Acceptance Criteria**:

  ```
  Scenario: Full TypeScript compilation passes
    Tool: Bash
    Steps:
      1. npx tsc --noEmit 2>&1 | grep -c "error"
      2. Assert: Output is "0"
    Expected Result: Zero type errors across entire project
    Evidence: Command output

  Scenario: Zero @craft-agent/core imports in entire src/
    Tool: Bash
    Steps:
      1. grep -r "@craft-agent/core" src/ --include="*.ts" --include="*.tsx" | wc -l
      2. Assert: Output is "0"
    Expected Result: Complete decoupling
    Evidence: grep output

  Scenario: All subpath exports resolve
    Tool: Bash
    Steps:
      1. node -e "const p=require('./package.json'); Object.keys(p.exports).forEach(k => { try { require.resolve(p.exports[k], {paths:[__dirname]}); console.log('OK:', k); } catch(e) { console.log('FAIL:', k); process.exit(1); } })"
      2. Assert: All exports show "OK"
    Expected Result: Every package.json export resolves to a real file
    Evidence: Command output

  Scenario: All files have GEB L3 headers
    Tool: Bash
    Steps:
      1. find src -name "*.ts" -o -name "*.tsx" | xargs grep -L "PROTOCOL" | grep -v "index.ts" | grep -v "AGENTS.md" | wc -l
      2. Assert: Output is "0"
    Expected Result: Every non-barrel source file has L3 header
    Evidence: Command output

  Scenario: All L2 AGENTS.md files exist and are non-empty
    Tool: Bash
    Steps:
      1. for d in types utils context lib hooks components/primitives components/code-viewer components/markdown components/overlay components/terminal components/cards components/chat; do test -s "src/$d/AGENTS.md" && echo "OK: $d" || echo "MISSING: $d"; done
      2. Assert: All show "OK"
    Expected Result: Complete L2 documentation coverage
    Evidence: Command output

  Scenario: Line count sanity check
    Tool: Bash
    Steps:
      1. find src -name "*.ts" -o -name "*.tsx" | xargs wc -l | tail -1
      2. Assert: Total >= 14000 (2821 existing + ~13500 new, minus some variance)
    Expected Result: Approximately 16000 total lines
    Evidence: wc output
  ```

  **Commit**: YES
  - Message: `feat: finalize barrel exports + package.json + AGENTS.md`
  - Files: `src/index.ts`, `src/components/index.ts`, `package.json`, `AGENTS.md`, `src/*/AGENTS.md`
  - Pre-commit: `npx tsc --noEmit && grep -r "@craft-agent/core" src/ --include="*.ts" --include="*.tsx" | wc -l`

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 1 | `feat(types): extract ActivityItem types + add file-classification` | types/activity.ts, lib/file-classification.ts | tsc --noEmit |
| 2 | `feat(terminal): add TerminalOutput + ansi-parser` | terminal/*.ts(x) | tsc --noEmit |
| 3 | `feat(cards): add ActionCard component` | cards/*.tsx | tsc --noEmit |
| 4 | `feat(code-viewer): add ShikiCodeViewer, ShikiDiffViewer, UnifiedDiffViewer, DiffViewerControls` | code-viewer/*.tsx | tsc --noEmit |
| 5 | `feat(overlay): add base overlay components` | overlay/Fullscreen*, PreviewOverlay, GenericOverlay, ImagePreview | tsc --noEmit |
| 6 | `feat(markdown): add Markdown, CodeBlock, CollapsibleSection, block renderers` | markdown/*.tsx | tsc --noEmit |
| 7 | `feat(overlay): add composed preview overlays` | overlay/*PreviewOverlay, DataTable, DocumentFormatted | tsc --noEmit |
| 8 | `feat(chat): add TurnCard, SessionViewer, UserMessageBubble, SystemMessage + utils` | chat/*.ts(x) | tsc --noEmit + grep @craft-agent/core |
| 9 | `feat(lib): add tool-parsers with local type imports` | lib/tool-parsers.ts | tsc --noEmit |
| 10 | `feat: finalize barrel exports + package.json` | index.ts, */index.ts, package.json | tsc --noEmit |

---

## Success Criteria

### Verification Commands
```bash
npx tsc --noEmit 2>&1 | grep -c "error"
# Expected: 0

grep -r "@craft-agent/core" src/ --include="*.ts" --include="*.tsx" | wc -l
# Expected: 0

grep -rL "\[PROTOCOL\]" src/**/*.ts src/**/*.tsx 2>/dev/null | wc -l
# Expected: 0 (all files have GEB L3 headers)
```

### Final Checklist
- [ ] All "Must Have" present
- [ ] All "Must NOT Have" absent
- [ ] Zero @craft-agent/core imports in src/
- [ ] Every file has GEB L3 header
- [ ] All AGENTS.md files updated
- [ ] package.json has all required peer deps
