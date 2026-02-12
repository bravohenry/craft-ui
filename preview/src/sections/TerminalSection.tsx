import { TerminalOutput } from '@craft/ui/terminal'

const successOutput = `\x1b[1m> jest --coverage\x1b[0m

\x1b[32m PASS \x1b[0m src/utils/cn.test.ts
\x1b[32m PASS \x1b[0m src/lib/linkify.test.ts
\x1b[32m PASS \x1b[0m src/components/terminal/ansi-parser.test.ts

\x1b[1mTest Suites:\x1b[0m \x1b[32m3 passed\x1b[0m, 3 total
\x1b[1mTests:\x1b[0m       \x1b[32m24 passed\x1b[0m, 24 total
\x1b[1mSnapshots:\x1b[0m   0 total
\x1b[1mTime:\x1b[0m        1.842 s`

const errorOutput = `\x1b[31msrc/components/Markdown.tsx(42,5): error TS2322:\x1b[0m
  Type 'string' is not assignable to type 'number'.

\x1b[31msrc/components/CodeBlock.tsx(18,3): error TS2741:\x1b[0m
  Property 'language' is missing in type '{ code: string; }'
  but required in type 'CodeBlockProps'.

\x1b[1m\x1b[31mFound 2 errors in 2 files.\x1b[0m`

export function TerminalSection() {
  return (
    <div className="space-y-8">
      <section>
        <h3 className="mb-3 text-lg font-semibold">Success (exit 0)</h3>
        <TerminalOutput
          command="npm test"
          output={successOutput}
          exitCode={0}
        />
      </section>

      <section>
        <h3 className="mb-3 text-lg font-semibold">Failure (exit 1)</h3>
        <TerminalOutput
          command="tsc --noEmit"
          output={errorOutput}
          exitCode={1}
        />
      </section>
    </div>
  )
}
