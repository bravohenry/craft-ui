/**
 * [INPUT]: Depends on React, ./data-table, ./tone-badge, and @/utils/cn.
 * [OUTPUT]: RuleTable component and rule row types.
 * [POS]: components/ui craft recipe layer for rule-focused data table rendering.
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */

import * as React from 'react'

import { cn } from '@/utils/cn'
import { DataTable, SortableHeader, type ColumnDef } from './data-table'
import { ToneBadge, type Tone } from './tone-badge'

export type RuleAccess = 'allowed' | 'blocked'
export type RuleType = 'tool' | 'bash' | 'api' | 'mcp'

export interface RuleItem {
  access: RuleAccess
  type: RuleType
  pattern: string
  comment?: string | null
}

interface RuleTableProps {
  data: RuleItem[]
  hideTypeColumn?: boolean
  maxHeight?: number
  emptyContent?: React.ReactNode
  className?: string
}

function AccessBadge({ access }: { access: RuleAccess }) {
  const tone: Tone = access === 'allowed' ? 'success' : 'destructive'
  const label = access === 'allowed' ? 'Allowed' : 'Blocked'

  return <ToneBadge tone={tone}>{label}</ToneBadge>
}

function PatternBadge({ pattern }: { pattern: string }) {
  const onClick = React.useCallback(() => {
    void navigator.clipboard?.writeText(pattern)
  }, [pattern])

  return (
    <button type="button" className="text-left" title="Click to copy pattern" onClick={onClick}>
      <ToneBadge tone="muted" className="font-mono select-none">
        <span className="block max-w-[240px] truncate">{pattern}</span>
      </ToneBadge>
    </button>
  )
}

const columnsWithType: ColumnDef<RuleItem>[] = [
  {
    accessorKey: 'access',
    header: ({ column }) => <SortableHeader column={column} title="Access" />,
    cell: ({ row }) => (
      <div className="p-1.5 pl-2.5">
        <AccessBadge access={row.original.access} />
      </div>
    ),
    minSize: 80,
  },
  {
    accessorKey: 'type',
    header: ({ column }) => <SortableHeader column={column} title="Type" />,
    cell: ({ row }) => (
      <div className="p-1.5 pl-2.5">
        <ToneBadge tone="muted" className="capitalize whitespace-nowrap">
          {row.original.type}
        </ToneBadge>
      </div>
    ),
    minSize: 80,
  },
  {
    accessorKey: 'pattern',
    header: ({ column }) => <SortableHeader column={column} title="Pattern" />,
    cell: ({ row }) => (
      <div className="p-1.5 pl-2.5">
        <PatternBadge pattern={row.original.pattern} />
      </div>
    ),
    minSize: 100,
  },
  {
    accessorKey: 'comment',
    header: () => <span className="p-1.5 pl-2.5">Comment</span>,
    cell: ({ row }) => (
      <div className="min-w-0 p-1.5 pl-2.5">
        <span className="block truncate">{row.original.comment || '—'}</span>
      </div>
    ),
    meta: { fillWidth: true, truncate: true },
  },
]

const columnsWithoutType: ColumnDef<RuleItem>[] = [
  {
    accessorKey: 'access',
    header: ({ column }) => <SortableHeader column={column} title="Access" />,
    cell: ({ row }) => (
      <div className="p-1.5 pl-2.5">
        <AccessBadge access={row.original.access} />
      </div>
    ),
    minSize: 80,
  },
  {
    accessorKey: 'pattern',
    header: ({ column }) => <SortableHeader column={column} title="Pattern" />,
    cell: ({ row }) => (
      <div className="p-1.5 pl-2.5">
        <PatternBadge pattern={row.original.pattern} />
      </div>
    ),
    minSize: 100,
  },
  {
    accessorKey: 'comment',
    header: () => <span className="p-1.5 pl-2.5">Comment</span>,
    cell: ({ row }) => (
      <div className="min-w-0 p-1.5 pl-2.5">
        <span className="block truncate">{row.original.comment || '—'}</span>
      </div>
    ),
    meta: { fillWidth: true, truncate: true },
  },
]

export function RuleTable({
  data,
  hideTypeColumn = false,
  maxHeight = 400,
  emptyContent = 'No rules configured',
  className,
}: RuleTableProps) {
  const columns = hideTypeColumn ? columnsWithoutType : columnsWithType

  return (
    <div className={cn('overflow-y-auto overflow-x-hidden', className)} style={{ maxHeight }}>
      <DataTable columns={columns} data={data} emptyContent={emptyContent} noBorder noWrapper />
    </div>
  )
}
