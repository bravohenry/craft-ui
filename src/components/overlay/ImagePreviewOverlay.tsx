/**
 * [INPUT]: lucide-react, ./PreviewOverlay, ../primitives/CopyButton
 * [OUTPUT]: ImagePreviewOverlay, ImagePreviewOverlayProps
 * [POS]: overlay/ — image preview with async data URL loading, consumed by link interceptor
 * [PROTOCOL]: Update this header on change, then check AGENTS.md
 */

import { useState, useEffect } from 'react'
import { Image } from 'lucide-react'
import { PreviewOverlay } from './PreviewOverlay'
import { CopyButton } from '../primitives/CopyButton'

export interface ImagePreviewOverlayProps {
  isOpen: boolean
  onClose: () => void
  /** Absolute file path for the image */
  filePath: string
  /** Async loader that returns a data URL (data:{mime};base64,...) */
  loadDataUrl: (path: string) => Promise<string>
  theme?: 'light' | 'dark'
}

export function ImagePreviewOverlay({
  isOpen,
  onClose,
  filePath,
  loadDataUrl,
  theme = 'light',
}: ImagePreviewOverlayProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isOpen || !filePath) return

    let cancelled = false
    setIsLoading(true)
    setError(null)
    setDataUrl(null)

    loadDataUrl(filePath)
      .then((url) => {
        if (!cancelled) {
          setDataUrl(url)
          setIsLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load image')
          setIsLoading(false)
        }
      })

    return () => { cancelled = true }
  }, [isOpen, filePath, loadDataUrl])

  const headerActions = (
    <CopyButton content={filePath} title="Copy path" />
  )

  return (
    <PreviewOverlay
      isOpen={isOpen}
      onClose={onClose}
      theme={theme}
      typeBadge={{
        icon: Image,
        label: 'Image',
        variant: 'purple',
      }}
      filePath={filePath}
      error={error ? { label: 'Load Failed', message: error } : undefined}
      headerActions={headerActions}
    >
      <div className="min-h-full flex items-center justify-center p-4">
        {isLoading && (
          <div className="text-muted-foreground text-sm">Loading image...</div>
        )}
        {dataUrl && (
          <img
            src={dataUrl}
            alt={filePath.split('/').pop() ?? 'Image preview'}
            className="max-w-full max-h-full object-contain rounded-sm"
            draggable={false}
          />
        )}
      </div>
    </PreviewOverlay>
  )
}
