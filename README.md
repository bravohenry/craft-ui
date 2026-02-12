# @craft/ui

Cross-platform React UI component library.

`React` `TypeScript` `Tailwind v4` `Radix UI` `oklch`

English | [中文](./README.zh-CN.md)

---

## Overview

`@craft/ui` is a standalone, reusable UI layer extracted from Craft Agents. It provides a complete set of components for building developer tool interfaces — from syntax-highlighted code viewers and diff renderers to full chat turn rendering and terminal output display.

- Works in both Electron and Web environments via platform-agnostic context providers
- Built on an oklch color system with automatic light/dark theme support
- 85+ source files across 11 subpath exports
- Zero dependency on `@craft-agent/core` — all types are self-contained

## Installation

```bash
npm install @craft/ui
```

Peer dependencies are required. See [Peer Dependencies](#peer-dependencies) for the full list.

## Module Reference

| Import Path | Module | What It Provides |
|---|---|---|
| `@craft/ui` | Root | Primitives: Tooltip, Spinner, CopyButton, dropdowns, PreviewHeader, icons |
| `@craft/ui/styles` | Styles | oklch 6-color design system, 13-level foreground gradients, shadows, animations |
| `@craft/ui/types` | Types | TypeScript definitions for Message, Session, Activity, and related types |
| `@craft/ui/context` | Context | PlatformProvider (Electron/Web detection), ShikiThemeProvider |
| `@craft/ui/lib` | Utilities | Layout constants, language-map, table-export, linkify, file-classification, tool-parsers, attachment-helpers |
| `@craft/ui/code-viewer` | Code Viewer | ShikiCodeViewer, ShikiDiffViewer (side-by-side), UnifiedDiffViewer, DiffViewerControls, theme registration |
| `@craft/ui/markdown` | Markdown | Markdown/MemoizedMarkdown renderer, CodeBlock, CollapsibleSection, block renderers for Diff, JSON, Mermaid, DataTable, Spreadsheet |
| `@craft/ui/overlay` | Overlay | Fullscreen preview system — Code, Terminal, JSON, PDF, Image, Mermaid, MultiDiff, DataTable, Document overlays |
| `@craft/ui/terminal` | Terminal | ANSI escape code parser (parseAnsi, stripAnsi), TerminalOutput with color rendering and grep highlighting |
| `@craft/ui/cards` | Cards | ActionCard with themed header, scrollable content, and action footer |
| `@craft/ui/chat` | Chat | TurnCard, SessionViewer, UserMessageBubble, SystemMessage, InlineExecution, AcceptPlanDropdown |

## Quick Start

Import the design system CSS once at your app root:

```tsx
import '@craft/ui/styles'
```

### Markdown Rendering

```tsx
import { Markdown } from '@craft/ui/markdown'

<Markdown content="# Hello World" />
```

### Code Viewer with Syntax Highlighting

```tsx
import { ShikiCodeViewer } from '@craft/ui/code-viewer'

<ShikiCodeViewer code={code} language="typescript" />
```

### Chat Turn Rendering

```tsx
import { TurnCard } from '@craft/ui/chat'

<TurnCard turn={turn} />
```

### Terminal Output

```tsx
import { TerminalOutput } from '@craft/ui/terminal'

<TerminalOutput command="npm test" output={ansiOutput} />
```

## Design System

The style system is defined in `@craft/ui/styles` and uses CSS custom properties throughout.

- **oklch color system** — 6 base colors (background, foreground, primary, secondary, muted, accent) defined in oklch color space for perceptually uniform theming
- **13-level foreground gradients** — fine-grained text opacity levels from `fg-0` (invisible) through `fg-12` (full contrast)
- **Light/dark theme** — automatic switching via CSS custom properties; no JavaScript runtime cost
- **Shadow system** — elevation-based shadow tokens
- **Animations** — shared keyframes and transition tokens
- **Tailwind v4** — all tokens integrate as Tailwind utilities

## Peer Dependencies

### Required

| Package | Version |
|---|---|
| `react` | >= 18.0.0 |
| `react-dom` | >= 18.0.0 |
| `tailwindcss` | >= 4.0.0 |
| `shiki` | ^3.21.0 |
| `react-markdown` | >= 9.0.0 |
| `remark-gfm` | >= 4.0.0 |
| `rehype-raw` | >= 7.0.0 |
| `lucide-react` | >= 0.400.0 |
| `clsx` | >= 2.0.0 |
| `tailwind-merge` | >= 2.0.0 |
| `class-variance-authority` | >= 0.7.0 |
| `motion` | >= 11.0.0 |
| `@radix-ui/react-tooltip` | >= 1.0.0 |
| `@tailwindcss/typography` | >= 0.5.0 |

### Optional

| Package | Version | Used By |
|---|---|---|
| `@radix-ui/react-dialog` | >= 1.0.0 | Overlay system |
| `@radix-ui/react-dropdown-menu` | >= 2.0.0 | Styled dropdowns |
| `@radix-ui/react-context-menu` | >= 2.0.0 | Context menus |
| `@craft-agent/mermaid` | >= 0.1.0 | Mermaid diagram rendering |
| `react-pdf` | >= 7.0.0 | PDF preview overlay |
| `@pierre/diffs` | >= 0.1.0 | Diff viewing |

## Project Structure

```
src/
├── types/            # TypeScript type definitions (Message, Session, Activity)
├── utils/            # cn(), path normalization helpers
├── styles/           # oklch design system CSS
├── context/          # PlatformProvider, ShikiThemeProvider
├── lib/              # Pure utility functions
├── hooks/            # React hooks (useScrollFade)
└── components/
    ├── primitives/   # Atomic UI: Tooltip, Spinner, CopyButton, dropdowns, icons
    ├── code-viewer/  # Shiki code + diff viewers
    ├── markdown/     # Markdown renderer + block renderers
    ├── overlay/      # Fullscreen preview overlays
    ├── terminal/     # ANSI parser + terminal output
    ├── cards/        # ActionCard
    └── chat/         # Chat turn rendering system
```

## License

Apache-2.0
