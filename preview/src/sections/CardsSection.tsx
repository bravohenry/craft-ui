import { ActionCard } from '@craft/ui/cards'
import { Code, Mail, FileText } from 'lucide-react'

export function CardsSection() {
  return (
    <div className="space-y-8">
      <section>
        <h3 className="mb-3 text-lg font-semibold">ActionCard</h3>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ActionCard
            icon={<Code className="h-4 w-4" />}
            title="Code Review"
            tag="PR #142"
            brandColor="#3b82f6"
            actions={[
              { label: 'Approve', variant: 'primary', onClick: () => {} },
              { label: 'Request Changes', variant: 'secondary', onClick: () => {} },
            ]}
          >
            <p className="text-sm text-muted-foreground">
              Refactored the authentication module to use JWT tokens instead of
              session cookies. Updated middleware, added refresh token rotation,
              and wrote integration tests for all auth endpoints.
            </p>
          </ActionCard>

          <ActionCard
            icon={<Mail className="h-4 w-4" />}
            title="Email Draft"
            tag="team@craft.dev"
            brandColor="#10b981"
            actions={[
              { label: 'Send', variant: 'primary', onClick: () => {} },
              { label: 'Discard', variant: 'ghost', onClick: () => {} },
            ]}
          >
            <p className="text-sm text-muted-foreground">
              Weekly sprint summary: completed 12 story points, shipped the new
              markdown renderer, and resolved 3 critical bugs in the overlay system.
            </p>
          </ActionCard>

          <ActionCard
            icon={<FileText className="h-4 w-4" />}
            title="Documentation"
            brandColor="#f59e0b"
          >
            <p className="text-sm text-muted-foreground">
              A card without actions — useful for read-only content display,
              status summaries, or informational panels.
            </p>
          </ActionCard>
        </div>
      </section>
    </div>
  )
}
