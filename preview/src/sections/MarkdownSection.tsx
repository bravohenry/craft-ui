import { Markdown } from '@craft/ui/markdown'

const markdownContent = `# Markdown Renderer

A full-featured markdown renderer with **bold**, *italic*, and \`inline code\`.

## Code Block

\`\`\`typescript
const greeting = (name: string) => \`Hello, \${name}!\`
console.log(greeting('World'))
\`\`\`

## Table

| Feature | Status | Notes |
|---------|--------|-------|
| GFM Tables | Done | Full support |
| Syntax Highlighting | Done | Via Shiki |
| Task Lists | Done | Checkbox rendering |

## Lists

- First item with **bold text**
- Second item with \`code\`
- Third item
  - Nested item A
  - Nested item B

### Ordered

1. Step one
2. Step two
3. Step three

## Blockquote

> The best way to predict the future is to invent it.
> — Alan Kay

## Task List

- [x] Design system tokens
- [x] Primitive components
- [ ] Chat rendering
- [ ] Overlay system
`

export function MarkdownSection() {
  return (
    <div className="space-y-8">
      <section>
        <h3 className="mb-3 text-lg font-semibold">Full Mode</h3>
        <div className="rounded-lg border border-border bg-background p-4">
          <Markdown mode="full">{markdownContent}</Markdown>
        </div>
      </section>
    </div>
  )
}
