/**
 * [INPUT]: depends on chat components from @craft/ui/chat and types from @craft/ui/types
 * [OUTPUT]: ChatSection component for preview app
 * [POS]: preview/sections — showcases chat primitives and full SessionViewer transcript
 * [PROTOCOL]: Update this header on change, then check AGENTS.md
 */

import { InlineExecution, SessionViewer, SystemMessage, UserMessageBubble } from '@craft/ui/chat'
import type { ContentBadge, StoredAttachment, StoredSession } from '@craft/ui/types'

const sampleAttachments: StoredAttachment[] = [
  {
    id: 'att-1',
    type: 'pdf',
    name: 'design-spec.pdf',
    mimeType: 'application/pdf',
    size: 248_000,
    storedPath: '/workspace/docs/design-spec.pdf',
  },
]

const sampleBadges: ContentBadge[] = [
  {
    type: 'source',
    label: 'workspace',
    rawText: '@workspace',
    start: 8,
    end: 17,
  },
  {
    type: 'file',
    label: 'src/components/overlay/PreviewOverlay.tsx',
    rawText: 'src/components/overlay/PreviewOverlay.tsx',
    start: 27,
    end: 66,
    filePath: '/workspace/src/components/overlay/PreviewOverlay.tsx',
  },
]

const sampleSession: StoredSession = {
  id: 'session-preview',
  workspaceId: 'preview',
  name: 'Overlay alignment iteration',
  createdAt: 1739400000000,
  lastUsedAt: 1739400060000,
  messages: [
    {
      id: 'msg-user-1',
      type: 'user',
      content: 'Please align all preview overlays and keep header spacing consistent.',
      timestamp: 1739400001000,
    },
    {
      id: 'msg-tool-1',
      type: 'tool',
      content: '',
      timestamp: 1739400003000,
      turnId: 'turn-1',
      toolName: 'Edit',
      toolUseId: 'tool-1',
      toolStatus: 'completed',
      toolInput: {
        file_path: '/workspace/src/components/overlay/PreviewOverlay.tsx',
        old_string: 'justify-center',
        new_string: 'justify-start',
      },
      toolResult: 'Updated 1 occurrence in PreviewOverlay.tsx',
    },
    {
      id: 'msg-assistant-1',
      type: 'assistant',
      content: 'Aligned overlay containers to top-start and removed layout drift from special cases.',
      timestamp: 1739400006000,
      turnId: 'turn-1',
    },
    {
      id: 'msg-info-1',
      type: 'info',
      content: 'Build passed: `npx tsc --noEmit`',
      timestamp: 1739400007000,
    },
  ],
  tokenUsage: {
    inputTokens: 932,
    outputTokens: 214,
    totalTokens: 1146,
    contextTokens: 8192,
    costUsd: 0.0042,
  },
}

export function ChatSection() {
  return (
    <div className="space-y-8">
      <section>
        <h3 className="mb-3 text-lg font-semibold">UserMessageBubble</h3>
        <div className="rounded-lg border border-border bg-background p-4">
          <UserMessageBubble
            content="Review @workspace and open src/components/overlay/PreviewOverlay.tsx before patching."
            badges={sampleBadges}
            attachments={sampleAttachments}
            onFileClick={() => {}}
          />
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-lg font-semibold">SystemMessage</h3>
        <div className="space-y-2 rounded-lg border border-border bg-background p-2">
          <SystemMessage type="info" content="Info: build finished successfully." />
          <SystemMessage type="warning" content="Warning: large response truncated to preview." />
          <SystemMessage type="error" content="Error: failed to parse diff hunk at line 42." />
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-lg font-semibold">InlineExecution</h3>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-lg border border-border bg-background p-4">
            <InlineExecution
              status="executing"
              activities={[
                { id: 'a1', name: 'Read', status: 'completed', description: 'Loaded PreviewOverlay.tsx' },
                { id: 'a2', name: 'Edit', status: 'running', description: 'Applying layout fix' },
              ]}
            />
          </div>

          <div className="rounded-lg border border-border bg-background p-4">
            <InlineExecution
              status="success"
              activities={[]}
              result="Updated overlay alignment and verified with `npx tsc --noEmit`."
            />
          </div>

          <div className="rounded-lg border border-border bg-background p-4">
            <InlineExecution
              status="error"
              activities={[]}
              error="Patch failed because the expected context was stale."
              onRetry={() => {}}
            />
          </div>
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-lg font-semibold">SessionViewer</h3>
        <div className="h-[560px] rounded-lg border border-border overflow-hidden bg-background">
          <SessionViewer session={sampleSession} sessionFolderPath="/workspace" />
        </div>
      </section>
    </div>
  )
}
