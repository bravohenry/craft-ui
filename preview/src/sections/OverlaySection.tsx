/**
 * [INPUT]: depends on React state, overlay components from @/components/overlay, lucide-react icons
 * [OUTPUT]: OverlaySection component for preview app
 * [POS]: preview/sections — showcases embedded and modal overlay components
 * [PROTOCOL]: Update this header on change, then check AGENTS.md
 */

import { useState } from 'react'
import { FileText } from 'lucide-react'
import { CodePreviewOverlay } from '@/components/overlay/CodePreviewOverlay'
import { JSONPreviewOverlay } from '@/components/overlay/JSONPreviewOverlay'
import { MermaidPreviewOverlay } from '@/components/overlay/MermaidPreviewOverlay'
import { MultiDiffPreviewOverlay, type FileChange } from '@/components/overlay/MultiDiffPreviewOverlay'
import { TerminalPreviewOverlay } from '@/components/overlay/TerminalPreviewOverlay'

const sampleCode = `export function sum(a: number, b: number): number {
  return a + b
}

const result = sum(3, 9)
console.log(result)
`

const sampleOutput = `> npm run test

PASS src/lib/layout.test.ts
PASS src/components/overlay/PreviewOverlay.test.tsx

Test Suites: 2 passed, 2 total
Tests:       18 passed, 18 total
Time:        0.98 s`

const sampleJson = {
  tool: 'read_file',
  path: '/workspace/src/components/overlay/PreviewOverlay.tsx',
  range: { start: 120, end: 168 },
  status: 'ok',
}

const sampleDiff: FileChange[] = [
  {
    id: 'change-1',
    filePath: '/workspace/src/components/overlay/PreviewOverlay.tsx',
    toolType: 'Edit',
    original: '',
    modified: '',
    unifiedDiff: `--- a/src/components/overlay/PreviewOverlay.tsx
+++ b/src/components/overlay/PreviewOverlay.tsx
@@ -136,7 +136,7 @@
-        <div className="min-h-full flex flex-col justify-center">
+        <div className="min-h-full flex flex-col justify-start">
           {errorBanner}
           {children}
         </div>`,
  },
]

const sampleMermaidSvg = `
<svg width="520" height="220" viewBox="0 0 520 220" xmlns="http://www.w3.org/2000/svg">
  <rect x="40" y="70" width="120" height="50" rx="8" fill="#edf4ff" stroke="#4f46e5" />
  <text x="100" y="100" text-anchor="middle" fill="#312e81" font-size="14">User Input</text>
  <rect x="200" y="70" width="120" height="50" rx="8" fill="#f0fdf4" stroke="#16a34a" />
  <text x="260" y="100" text-anchor="middle" fill="#14532d" font-size="14">Parser</text>
  <rect x="360" y="70" width="120" height="50" rx="8" fill="#fff7ed" stroke="#ea580c" />
  <text x="420" y="100" text-anchor="middle" fill="#9a3412" font-size="14">Renderer</text>
  <path d="M160 95 L200 95" stroke="#64748b" stroke-width="2" />
  <path d="M320 95 L360 95" stroke="#64748b" stroke-width="2" />
</svg>
`.trim()

export function OverlaySection() {
  const [isMermaidOpen, setIsMermaidOpen] = useState(false)

  return (
    <div className="space-y-8">
      <section>
        <h3 className="mb-3 text-lg font-semibold">Embedded Overlays</h3>
        <div className="space-y-6">
          <div className="h-[420px] rounded-lg border border-border overflow-hidden">
            <CodePreviewOverlay
              isOpen
              embedded
              onClose={() => {}}
              content={sampleCode}
              filePath="/workspace/src/lib/math.ts"
              mode="read"
              theme="light"
            />
          </div>

          <div className="h-[360px] rounded-lg border border-border overflow-hidden">
            <TerminalPreviewOverlay
              isOpen
              embedded
              onClose={() => {}}
              command="npm run test"
              output={sampleOutput}
              exitCode={0}
              toolType="bash"
              description="Test run"
            />
          </div>

          <div className="h-[360px] rounded-lg border border-border overflow-hidden">
            <JSONPreviewOverlay
              isOpen
              embedded
              onClose={() => {}}
              data={sampleJson}
              filePath="/workspace/output/result.json"
              theme="light"
            />
          </div>

          <div className="h-[420px] rounded-lg border border-border overflow-hidden">
            <MultiDiffPreviewOverlay
              isOpen
              embedded
              onClose={() => {}}
              changes={sampleDiff}
              theme="light"
            />
          </div>
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-lg font-semibold">Modal Overlay</h3>
        <div className="rounded-lg border border-border bg-background p-4 space-y-3">
          <p className="text-sm text-muted-foreground">
            Mermaid overlay is modal-only by design. Use this trigger to validate fullscreen rendering.
          </p>
          <button
            type="button"
            onClick={() => setIsMermaidOpen(true)}
            className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted transition-colors"
          >
            <FileText className="h-4 w-4" />
            Open Mermaid Preview Overlay
          </button>
        </div>

        <MermaidPreviewOverlay
          isOpen={isMermaidOpen}
          onClose={() => setIsMermaidOpen(false)}
          code="flowchart LR; Input --> Parser --> Renderer;"
          svg={sampleMermaidSvg}
        />
      </section>
    </div>
  )
}
