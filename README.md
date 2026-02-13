# @craft/ui

Cross-platform React UI component library for developer tooling interfaces.

`React` `TypeScript` `Tailwind v4` `Radix UI` `oklch`

English | [Chinese](./README.zh-CN.md)

---

## What This Repo Is

`@craft/ui` is the standalone UI layer extracted from Craft.  
It is designed for teams building:

- agent/chat interfaces
- code and diff viewers
- markdown/data renderers
- terminal-style output
- preview overlays for complex content

The package is intentionally platform-agnostic so the same component surface can be reused in both browser React apps and Electron apps.

## Open Source Notice

- UI implementation source reference: [lukilabs/craft-agents-oss](https://github.com/lukilabs/craft-agents-oss/) (`Apache-2.0`)
- Shadcn-compatible API and composition patterns are aligned with [shadcn-ui/ui](https://github.com/shadcn-ui/ui) (`MIT`)
- This repository (`@craft/ui`) is licensed under `Apache-2.0`

## Core Goals

1. Keep API shape Shadcn-compatible for low adoption cost.
2. Keep visual language aligned with Craft tokens and spacing rhythm.
3. Keep business logic out of UI primitives.
4. Keep React + Electron integration friction low.
5. Keep package self-contained (no dependency on `@craft-agent/core`).

## Feature Snapshot

- Full UI primitive layer (`@craft/ui/ui`) with Craft-styled defaults
- Rich rendering modules:
  - syntax-highlighted code viewer (Shiki)
  - split and unified diff viewers
  - markdown blocks (mermaid/json/table/spreadsheet/diff)
  - terminal transcript with ANSI parsing
  - fullscreen and modal preview overlays
- Chat-oriented composition components:
  - session viewer
  - turn card
  - inline execution UI
- Tokenized CSS system:
  - oklch color model
  - 13-level foreground contrast scale
  - shared shadows, radii, motion tokens

## Architecture Principles

1. **Primitive first**: keep `src/components/ui/*` generic and reusable.
2. **Recipe second**: scenario components (cards/chat/overlay) compose primitives, not override them ad hoc.
3. **One source of truth for style**: use token CSS variables in `@craft/ui/styles`.
4. **No hidden platform branching**: platform differences are explicit via context providers.

## Package Exports

| Import Path | Purpose | Typical Use |
|---|---|---|
| `@craft/ui` | root primitives | tooltip/spinner/icons/dropdowns/preview header |
| `@craft/ui/ui` | base UI primitives | shadcn-style controls + craft tokens |
| `@craft/ui/styles` | design tokens | import once at app root |
| `@craft/ui/types` | app types | message/session/activity typed contracts |
| `@craft/ui/context` | environment and theme providers | platform-aware wiring for web/electron |
| `@craft/ui/lib` | pure helpers | parsing/classification/link helpers |
| `@craft/ui/code-viewer` | code & diff viewers | syntax and patch rendering |
| `@craft/ui/markdown` | markdown rendering system | LLM output + rich block content |
| `@craft/ui/overlay` | preview overlays | code/pdf/image/json/mermaid preview |
| `@craft/ui/terminal` | terminal transcript | command + output rendering |
| `@craft/ui/cards` | card recipes | action-oriented information cards |
| `@craft/ui/chat` | chat UI recipes | turn/session composition |

## Installation

```bash
npm install @craft/ui
```

Or:

```bash
pnpm add @craft/ui
# or
yarn add @craft/ui
```

## Required Peer Dependencies

| Package | Version |
|---|---|
| `react` | >= 18 |
| `react-dom` | >= 18 |
| `tailwindcss` | >= 4 |
| `shiki` | ^3.21.0 |
| `react-markdown` | >= 9 |
| `remark-gfm` | >= 4 |
| `rehype-raw` | >= 7 |
| `lucide-react` | >= 0.400 |
| `clsx` | >= 2 |
| `tailwind-merge` | >= 2 |
| `class-variance-authority` | >= 0.7 |
| `motion` | >= 11 |
| `@radix-ui/react-tooltip` | >= 1 |
| `@tailwindcss/typography` | >= 0.5 |

Optional peers are used by specific modules (`@radix-ui/react-dialog`, `react-pdf`, `@craft-agent/mermaid`, etc.).

## Quick Start (Web React)

```tsx
import '@craft/ui/styles'
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from '@craft/ui/ui'

export function LoginCard() {
  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input id="email" placeholder="team@craft.dev" />
        </div>
        <Button className="w-full">Continue</Button>
      </CardContent>
    </Card>
  )
}
```

## Quick Start (Electron + React)

```tsx
import '@craft/ui/styles'
import { PlatformProvider } from '@craft/ui/context'
import { SessionViewer } from '@craft/ui/chat'

export function App() {
  return (
    <PlatformProvider actions={{}}>
      <main className="h-dvh">
        <SessionViewer
          session={/* your session data */}
          turns={/* your turns */}
        />
      </main>
    </PlatformProvider>
  )
}
```

## High-value Usage Patterns

### 1) Markdown + code blocks

```tsx
import { Markdown } from '@craft/ui/markdown'

<Markdown content={markdownText} />
```

### 2) Code viewer

```tsx
import { ShikiCodeViewer } from '@craft/ui/code-viewer'

<ShikiCodeViewer code={source} language="typescript" />
```

### 3) Terminal transcript

```tsx
import { TerminalOutput } from '@craft/ui/terminal'

<TerminalOutput command="npm run build" output={ansiOutput} />
```

### 4) Table primitives

```tsx
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@craft/ui/ui'

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Key</TableHead>
      <TableHead>Value</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>theme</TableCell>
      <TableCell>craft</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

## Design Tokens and Styling

All visual defaults come from `@craft/ui/styles`.

- oklch token palette
- foreground contrast ladder (`fg-0` to `fg-12`)
- shadow/elevation tokens
- radius and border tokens
- animation keyframes and transitions

Recommendation:

1. Import `@craft/ui/styles` once at app root.
2. Prefer token classes/variables over page-level hard-coded colors.
3. Keep variant definitions in primitive layer (`src/components/ui/*`) instead of feature pages.

## Local Development

```bash
npm install
npm run build
```

Preview app:

```bash
cd preview
npm install
npm run dev
```

Quality gates:

```bash
npx tsc --noEmit
cd preview && npm run build
```

## Folder Layout

```text
src/
├── components/
│   ├── ui/           # Base primitives (shadcn-compatible API + craft defaults)
│   ├── primitives/   # Utility primitives and icon set
│   ├── code-viewer/  # Code/diff rendering
│   ├── markdown/     # Markdown + structured block renderers
│   ├── overlay/      # Fullscreen and modal preview system
│   ├── terminal/     # ANSI parser + transcript UI
│   ├── cards/        # Card recipes
│   └── chat/         # Session/turn chat recipes
├── context/          # Platform and theme providers
├── hooks/            # Shared hooks
├── lib/              # Pure utilities
├── styles/           # Token CSS and motion/elevation styles
├── types/            # Self-contained app types
└── utils/            # Generic helpers (e.g. cn)
```

## Best Practices for Teams

1. Import from `@craft/ui/ui` before creating one-off local components.
2. Add/adjust variants in primitives when multiple pages need the same behavior.
3. Keep recipe components scenario-focused and composition-driven.
4. Use context providers for platform branching, not conditional CSS hacks.
5. Keep component demos in `preview/` aligned with production usage.

## Troubleshooting

### Styles look broken

- Verify `@craft/ui/styles` is imported once.
- Verify Tailwind v4 pipeline is active.
- Verify peer dependencies are installed.

### Some modules fail to load

- Check optional peer dependencies required by that module.
- Example: overlay PDF previews require `react-pdf`.

### Theme mismatch between app and preview

- Confirm the same token CSS version is used.
- Check any app-level CSS reset that may override tokens.

## License

Apache-2.0

## Author

- Name: Zihan Huang
- Website: [z1han.com](https://z1han.com)
- GitHub: [bravohenry](https://github.com/bravohenry)
