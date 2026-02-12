import { ShikiCodeViewer } from '@craft/ui/code-viewer'

const sampleCode = `interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
}

function greet(user: User): string {
  return \`Hello, \${user.name}!\`
}

const users: User[] = [
  { id: '1', name: 'Alice', email: 'alice@example.com', role: 'admin' },
  { id: '2', name: 'Bob', email: 'bob@example.com', role: 'user' },
]

users.forEach((u) => console.log(greet(u)))`

export function CodeViewerSection() {
  return (
    <div className="space-y-8">
      <section>
        <h3 className="mb-3 text-lg font-semibold">TypeScript</h3>
        <ShikiCodeViewer code={sampleCode} language="typescript" />
      </section>
    </div>
  )
}
