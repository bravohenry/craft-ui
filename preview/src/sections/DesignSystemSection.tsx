const COLORS = [
  { name: '--background', label: 'Background' },
  { name: '--foreground', label: 'Foreground' },
  { name: '--accent', label: 'Accent' },
  { name: '--muted', label: 'Muted' },
  { name: '--border', label: 'Border' },
  { name: '--info', label: 'Info' },
  { name: '--success', label: 'Success' },
  { name: '--destructive', label: 'Destructive' },
] as const

const FG_LEVELS = [2, 3, 5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95] as const

const SHADOWS = [
  { cls: 'shadow-minimal', label: 'minimal' },
  { cls: 'shadow-soft', label: 'soft' },
  { cls: 'shadow-medium', label: 'medium' },
  { cls: 'shadow-strong', label: 'strong' },
] as const

function Swatch({ name, label }: { name: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className="w-14 h-14 rounded-lg border border-border/50"
        style={{ backgroundColor: `var(${name})` }}
      />
      <span className="text-[11px] text-muted-foreground font-mono">{label}</span>
    </div>
  )
}

export function DesignSystemSection() {
  return (
    <div className="space-y-10">
      <section>
        <h3 className="text-sm font-semibold mb-4 text-foreground">Color Palette (oklch)</h3>
        <div className="flex flex-wrap gap-4">
          {COLORS.map((c) => (
            <Swatch key={c.name} name={c.name} label={c.label} />
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold mb-4 text-foreground">Foreground Gradients (13 levels)</h3>
        <div className="flex flex-wrap gap-2">
          {FG_LEVELS.map((level) => (
            <div key={level} className="flex flex-col items-center gap-1">
              <div
                className="w-10 h-10 rounded-md"
                style={{ backgroundColor: `var(--foreground-${level})` }}
              />
              <span className="text-[10px] text-muted-foreground font-mono">fg-{level}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold mb-4 text-foreground">Shadow System</h3>
        <div className="flex flex-wrap gap-6">
          {SHADOWS.map((s) => (
            <div
              key={s.label}
              className={`w-28 h-20 rounded-lg bg-background flex items-center justify-center ${s.cls}`}
            >
              <span className="text-[11px] text-muted-foreground font-mono">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold mb-4 text-foreground">Typography</h3>
        <div className="space-y-2">
          <p className="text-2xl font-bold">Heading — 2xl bold</p>
          <p className="text-lg font-semibold">Subheading — lg semibold</p>
          <p className="text-sm text-foreground">Body — sm foreground</p>
          <p className="text-sm text-muted-foreground">Muted — sm muted-foreground</p>
          <p className="text-xs font-mono text-muted-foreground">Mono — xs mono muted</p>
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold mb-2 text-foreground">Theme</h3>
        <p className="text-sm text-muted-foreground">
          Toggle <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">.dark</code> class
          on <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">html</code> to switch themes.
        </p>
      </section>
    </div>
  )
}
