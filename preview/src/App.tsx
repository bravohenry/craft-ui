import { useState, type ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  BookOpenText,
  Blocks,
  Box,
  Braces,
  LayoutGrid,
  MessageSquareText,
  Monitor,
  Palette,
  TerminalSquare,
  Text,
} from 'lucide-react'
import { PlatformProvider } from '@craft/ui/context'
import {
  DocumentationSection,
  DesignSystemSection,
  UISection,
  PrimitivesSection,
  CodeViewerSection,
  MarkdownSection,
  TerminalSection,
  CardsSection,
  OverlaySection,
  ChatSection,
} from './sections'

const sections = [
  'Documentation',
  'Foundations',
  'Component Gallery',
  'Primitive Components',
  'Code and Diff',
  'Markdown Rendering',
  'Terminal Output',
  'Card Patterns',
  'Overlay Previews',
  'Chat Experience',
] as const

type Section = (typeof sections)[number]

interface SectionMeta {
  description: string
  icon: LucideIcon
}

const sectionMeta: Record<Section, SectionMeta> = {
  Documentation: {
    description: 'Human-first onboarding, AI-first implementation contract.',
    icon: BookOpenText,
  },
  Foundations: {
    description: 'Design tokens, color scales, spacing, shadows.',
    icon: Palette,
  },
  'Component Gallery': {
    description: 'Full base components and craft recipes in action.',
    icon: Blocks,
  },
  'Primitive Components': {
    description: 'Small reusable building blocks and icon primitives.',
    icon: Box,
  },
  'Code and Diff': {
    description: 'Syntax highlighting and unified diff experiences.',
    icon: Braces,
  },
  'Markdown Rendering': {
    description: 'Markdown blocks, mermaid, table, and export flow.',
    icon: Text,
  },
  'Terminal Output': {
    description: 'Command transcript and ANSI output rendering.',
    icon: TerminalSquare,
  },
  'Card Patterns': {
    description: 'Action-driven card layouts and composable variants.',
    icon: LayoutGrid,
  },
  'Overlay Previews': {
    description: 'Modal and fullscreen previews for complex content.',
    icon: Monitor,
  },
  'Chat Experience': {
    description: 'Session and turn components for conversational UI.',
    icon: MessageSquareText,
  },
}

export function App() {
  const [active, setActive] = useState<Section>(sections[0])

  const sectionComponents: Record<Section, () => ReactNode> = {
    Documentation: () => (
      <DocumentationSection onNavigate={(section) => setActive(section)} />
    ),
    'Foundations': () => <DesignSystemSection />,
    'Component Gallery': () => <UISection />,
    'Primitive Components': () => <PrimitivesSection />,
    'Code and Diff': () => <CodeViewerSection />,
    'Markdown Rendering': () => <MarkdownSection />,
    'Terminal Output': () => <TerminalSection />,
    'Card Patterns': () => <CardsSection />,
    'Overlay Previews': () => <OverlaySection />,
    'Chat Experience': () => <ChatSection />,
  }

  const ActiveSection = sectionComponents[active]
  const activeMeta = sectionMeta[active]

  return (
    <PlatformProvider actions={{}}>
      <div className="flex h-dvh bg-background text-foreground">
        <nav className="w-72 shrink-0 border-r border-border bg-muted/20 p-4">
          <p className="mb-1 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Documentation</p>
          <h1 className="mb-6 text-lg font-semibold tracking-tight">
            craft/ui
          </h1>
          <ul className="space-y-1.5">
            {sections.map((s) => {
              const Icon = sectionMeta[s].icon
              return (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => setActive(s)}
                    className={`w-full rounded-lg border px-3 py-2 text-left transition-colors ${
                      active === s
                        ? 'border-primary/30 bg-primary/10 text-foreground'
                        : 'border-transparent text-muted-foreground hover:border-border hover:bg-muted/60 hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="size-4" />
                      <span className="text-sm font-medium">{s}</span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{sectionMeta[s].description}</p>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        <main className="flex-1 overflow-y-auto p-8">
          <header className="mb-6 space-y-1">
            <h2 className="text-2xl font-bold">{active}</h2>
            <p className="text-sm text-muted-foreground">{activeMeta.description}</p>
          </header>
          <ActiveSection />
        </main>
      </div>
    </PlatformProvider>
  )
}
