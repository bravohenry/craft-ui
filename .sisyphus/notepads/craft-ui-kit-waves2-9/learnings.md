# Learnings — craft-ui-kit-waves2-9

## 2026-02-12T05:11 Session ses_3afbd5999ffeGpnoNVMa57fMVu
- Source at `/tmp/craft-agents-oss/packages/ui/src/`
- Target at `/Users/henry/PARA/[01] Projects/Vibe/Craft/src/`
- Existing code-viewer: DiffIcons.tsx, registerShikiThemes.ts
- Existing markdown: CollapsibleMarkdownContext.tsx, remarkCollapsibleSections.ts, safe-components.tsx
- Existing overlay: ContentFrame.tsx, OverlayErrorBanner.tsx
- cards/, chat/, terminal/ directories exist but are EMPTY
- Import pattern: `cn` from `@/utils`, types from `@/types`
- Path utils already at `src/utils/paths.ts`
- GEB L3 headers mandatory on every file with [PROTOCOL] tag

## 2026-02-12 ActionCard migration
- Source ActionCard had `import { cn } from '../../lib/utils'` → fixed to `@/utils/cn`
- Source buttons missing `type="button"` — lint rule requires explicit type prop on `<button>`
- ActionCard uses `lucide-react` (Copy, Check) — stays as peer dep, no change needed
- No `@craft-agent/core` imports in ActionCard — pure React + cn + lucide
- Pre-existing tsc errors in StyledDropdown.tsx (missing @radix-ui/react-dropdown-menu peer dep) — unrelated to cards/
- Parent barrel `src/components/index.ts` was created fresh (root-commit) with all 5 module exports
