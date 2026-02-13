/**
 * [INPUT]: depends on @craft/ui/ui primitives and lucide-react icons.
 * [OUTPUT]: DocumentationSection component with human-first rationale and AI execution specification.
 * [POS]: preview homepage documentation entry that explains purpose for humans and implementation for agents.
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */

import { Code2 } from 'lucide-react'
import {
  SystemMessage,
  UserMessageBubble,
} from '@craft/ui/chat'
import {
  Button,
  Kbd,
  ScrollArea,
  Separator,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@craft/ui/ui'

const quickInstallCode = `npm install @craft/ui react react-dom @radix-ui/react-slot @radix-ui/react-dialog
# tailwind v4 project should also import:
# @import "@craft/ui/styles";`

const appShellCode = `import { useState } from 'react'
import { PlatformProvider } from '@craft/ui/context'

const sections = ['Overview', 'Foundations', 'Components'] as const
type Section = (typeof sections)[number]

export function AppShell() {
  const [active, setActive] = useState<Section>(sections[0])

  return (
    <PlatformProvider actions={{}}>
      <div className="flex h-dvh">
        <aside>{/* sidebar */}</aside>
        <main>{active}</main>
      </div>
    </PlatformProvider>
  )
}`

const componentUsageCode = `import { Button, Card, CardHeader, CardContent, Input, Label } from '@craft/ui/ui'

export function LoginCard() {
  return (
    <Card className="max-w-sm">
      <CardHeader>
        <h3 className="text-base font-semibold">Sign in</h3>
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
}`

const aiExecutionContract = `# AI EXECUTION CONTRACT
mode: deterministic
styling: shadcn-api and craft tokens
layout:
  shell: sidebar and content
  default_sidebar_item: first
rules:
  - always import from "@craft/ui/ui" first
  - avoid local one-off styles before checking existing ui primitives
  - keep reusable variants in ui layer, not in page layer
quality_gate:
  - run "npx tsc --noEmit"
  - run preview build
  - verify selected state and spacing in sidebar`

const componentContracts = [
  {
    group: 'Layout',
    importPath: '@craft/ui/ui',
    primitives: 'Card, SectionHeader, Separator, ScrollArea, Tabs',
    whenToUse: 'Compose pages, headers, and documentation blocks.',
  },
  {
    group: 'Actions',
    importPath: '@craft/ui/ui',
    primitives: 'Button, Badge, Kbd',
    whenToUse: 'Primary actions, state tags, keyboard hints.',
  },
  {
    group: 'Feedback',
    importPath: '@craft/ui/ui',
    primitives: 'Alert, Tooltip, Skeleton, Progress',
    whenToUse: 'Communicate status and loading state.',
  },
  {
    group: 'Data',
    importPath: '@craft/ui/ui',
    primitives: 'Table, DataTable, RuleTable, RuleSetCard',
    whenToUse: 'Structured rows, rule management, sortable grids.',
  },
]

const sectionMap = [
  { section: 'Foundations', purpose: 'colors, radius, shadows, typography rhythm' },
  { section: 'Component Gallery', purpose: 'all base UI and craft recipes with real composition examples' },
  { section: 'Primitive Components', purpose: 'small utility primitives and icons' },
  { section: 'Code and Diff', purpose: 'shiki renderers, diff viewers, and controls' },
  { section: 'Markdown Rendering', purpose: 'markdown blocks, mermaid, data tables, spreadsheet renderers' },
  { section: 'Terminal Output', purpose: 'command and output transcript presentation' },
  { section: 'Card Patterns', purpose: 'action-oriented cards' },
  { section: 'Overlay Previews', purpose: 'fullscreen and modal preview experiences' },
  { section: 'Chat Experience', purpose: 'turn card, session viewer, inline execution UI' },
]

interface DocumentationSectionProps {
  onNavigate?: (section: 'Foundations' | 'Component Gallery') => void
}

export function DocumentationSection({ onNavigate }: DocumentationSectionProps) {
  return (
    <div className="space-y-10">
      <section className="space-y-6">
        <p className="text-sm font-semibold text-primary">Getting Started</p>
        <h2 className="text-2xl font-semibold tracking-tight">Why This Kit Exists</h2>
        <p className="max-w-4xl text-base leading-8 text-muted-foreground">
          Agentic/ui exists because teams building agent products need more than standard application primitives.
          It merges the composable API style from
          {' '}
          <a
            href="https://github.com/shadcn-ui/ui"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4"
          >
            shadcn/ui
          </a>
          {' '}
          with production interaction patterns from
          {' '}
          <a
            href="https://github.com/lukilabs/craft-agents-oss/"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4"
          >
            Craft Agents OSS
          </a>
          .
        </p>

        <div className="max-w-4xl space-y-3 rounded-lg border border-border bg-muted/20 p-4">
          <p className="text-sm font-semibold text-foreground">Story</p>
          <UserMessageBubble
            compactMode
            className="items-start gap-2"
            content="We already use shadcn. Why create Agentic/ui?"
          />
          <SystemMessage
            className="px-0 py-0"
            type="system"
            content="Shadcn gives strong primitives for application UI, but agent products need additional first-class surfaces: reasoning flow, markdown reports, and generated Mermaid diagrams."
          />
          <UserMessageBubble
            compactMode
            className="items-start gap-2"
            content="What does this change for product teams?"
          />
          <SystemMessage
            className="px-0 py-0"
            type="system"
            content="One shared component layer for React and Electron, less one-off UI, faster implementation, and lower design drift across teams."
          />
        </div>

        <h3 className="pt-2 text-xl font-semibold tracking-tight">What Makes Agentic/ui Different</h3>
        <div className="max-w-4xl space-y-4 text-base leading-8 text-muted-foreground">
          <p>
            <span className="font-semibold text-foreground">Familiar foundation.</span>
            {' '}
            Engineers can keep the same composable mental model they already use in shadcn-style workflows, so adoption
            is immediate instead of disruptive. Teams spend less time re-learning component APIs and more time shipping
            product behavior.
          </p>
          <p>
            <span className="font-semibold text-foreground">Agent-native outputs.</span>
            {' '}
            Agent products are judged by generated outputs, not just forms and dialogs. Agentic/ui treats
            thinking-process UI, markdown-first reports, and Mermaid diagrams as first-class surfaces, so teams stop
            building one-off wrappers around core agent experiences.
          </p>
          <p>
            <span className="font-semibold text-foreground">One cross-platform surface.</span>
            {' '}
            A single component layer across React and Electron gives product, design, and engineering one shared contract.
            The result is faster delivery, fewer duplicated implementations, and lower design drift across web and desktop.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <h3 className="text-xl font-semibold tracking-tight">Section Map</h3>
          <p className="text-sm text-muted-foreground">Each sidebar section has a concrete implementation scope.</p>
          <div className="overflow-hidden rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Section</TableHead>
                  <TableHead>Purpose</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sectionMap.map((row) => (
                  <TableRow key={row.section}>
                    <TableCell className="font-medium">{row.section}</TableCell>
                    <TableCell>{row.purpose}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <h3 className="text-xl font-semibold tracking-tight">5-minute Setup</h3>
          <ol className="list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
            <li>Install and include the style entry.</li>
            <li>Wrap your app with <Kbd>PlatformProvider</Kbd>.</li>
            <li>Compose with <code>@craft/ui/ui</code> primitives before custom markup.</li>
          </ol>
          <div className="overflow-hidden rounded-lg border border-border bg-muted/30">
            <pre className="overflow-x-auto p-4 text-xs leading-relaxed">
              <code>{quickInstallCode}</code>
            </pre>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            <Button size="sm" onClick={() => onNavigate?.('Foundations')}>
              Open Foundations
            </Button>
            <Button variant="outline" size="sm" onClick={() => onNavigate?.('Component Gallery')}>
              Open Component Gallery
            </Button>
          </div>
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-primary">For AI</p>
          <h3 className="text-xl font-semibold tracking-tight">Execution Spec</h3>
          <p className="text-sm text-muted-foreground">Use these blocks as deterministic implementation context.</p>
        </div>

        <Tabs defaultValue="shell" className="space-y-4">
          <TabsList className="h-auto flex-wrap justify-start gap-1">
            <TabsTrigger value="shell">App Shell</TabsTrigger>
            <TabsTrigger value="usage">Component Usage</TabsTrigger>
            <TabsTrigger value="contract">Execution Contract</TabsTrigger>
          </TabsList>

          <TabsContent value="shell" className="space-y-3">
            <p className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Code2 className="size-4" />
              Sidebar and First-Item Default State
            </p>
            <div className="overflow-hidden rounded-lg border border-border bg-muted/30">
              <pre className="overflow-x-auto p-4 text-xs leading-relaxed">
                <code>{appShellCode}</code>
              </pre>
            </div>
          </TabsContent>

          <TabsContent value="usage" className="space-y-4">
            <p className="text-sm font-medium text-foreground">Canonical Component Composition</p>
            <div className="overflow-hidden rounded-lg border border-border bg-muted/30">
              <pre className="overflow-x-auto p-4 text-xs leading-relaxed">
                <code>{componentUsageCode}</code>
              </pre>
            </div>
            <div className="overflow-hidden rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Group</TableHead>
                    <TableHead>Import</TableHead>
                    <TableHead>Primitives</TableHead>
                    <TableHead>When To Use</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {componentContracts.map((row) => (
                    <TableRow key={row.group}>
                      <TableCell className="font-medium">{row.group}</TableCell>
                      <TableCell>
                        <code className="text-xs">{row.importPath}</code>
                      </TableCell>
                      <TableCell className="text-xs">{row.primitives}</TableCell>
                      <TableCell>{row.whenToUse}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="contract" className="space-y-3">
            <p className="text-sm font-medium text-foreground">Deterministic Build Contract</p>
            <ScrollArea className="h-72 rounded-lg border border-border bg-muted/30 p-4">
              <pre className="text-xs leading-relaxed">
                <code>{aiExecutionContract}</code>
              </pre>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  )
}
