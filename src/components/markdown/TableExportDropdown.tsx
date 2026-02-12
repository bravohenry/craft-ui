/**
 * [INPUT]: react, lucide-react, @/utils/cn, ../primitives/StyledDropdown, @/lib/table-export
 * [OUTPUT]: TableExportDropdown component, TableExportDropdownProps
 * [POS]: markdown/ — copy/export dropdown for datatable & spreadsheet overlays
 * [PROTOCOL]: Update this header on change, then check AGENTS.md
 */

import { useState, useCallback } from 'react'
import { Check, ChevronDown, Copy, Download, FileText } from 'lucide-react'
import { cn } from '@/utils/cn'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  StyledDropdownMenuContent,
  StyledDropdownMenuItem,
} from '../primitives/StyledDropdown'
import { tableToMarkdown, tableToCsv, tableToXlsx, type ExportColumn } from '@/lib/table-export'

export interface TableExportDropdownProps {
  columns: ExportColumn[]
  rows: Record<string, unknown>[]
  filename: string
}

export function TableExportDropdown({ columns, rows, filename }: TableExportDropdownProps) {
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null)

  const handleExport = useCallback(async (format: 'markdown' | 'csv' | 'xlsx') => {
    if (format === 'xlsx') {
      tableToXlsx(columns, rows, filename)
      return
    }
    const text = format === 'markdown' ? tableToMarkdown(columns, rows) : tableToCsv(columns, rows)
    try {
      await navigator.clipboard.writeText(text)
      setCopiedFormat(format)
      setTimeout(() => setCopiedFormat(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }, [columns, rows, filename])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            'flex items-center gap-1 px-2 py-1.5 rounded-[6px] cursor-pointer select-none',
            'bg-background shadow-minimal',
            'opacity-70 hover:opacity-100 transition-opacity',
            'focus:outline-none focus-visible:ring-1 focus-visible:ring-ring',
          )}
          title="Export table"
        >
          <Copy className="w-4 h-4" />
          <ChevronDown className="w-3 h-3" />
        </button>
      </DropdownMenuTrigger>
      <StyledDropdownMenuContent sideOffset={6} align="end" style={{ zIndex: 400 }}>
        <StyledDropdownMenuItem onSelect={() => handleExport('markdown')}>
          {copiedFormat === 'markdown' ? <Check className="text-success" /> : <FileText />}
          Copy as Markdown
        </StyledDropdownMenuItem>
        <StyledDropdownMenuItem onSelect={() => handleExport('csv')}>
          {copiedFormat === 'csv' ? <Check className="text-success" /> : <FileText />}
          Copy as CSV
        </StyledDropdownMenuItem>
        <StyledDropdownMenuItem onSelect={() => handleExport('xlsx')}>
          <Download />
          Download as XLSX
        </StyledDropdownMenuItem>
      </StyledDropdownMenuContent>
    </DropdownMenu>
  )
}
