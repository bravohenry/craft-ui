/**
 * [INPUT]: react
 * [OUTPUT]: OverlayErrorBanner, OverlayErrorBannerProps
 * [POS]: overlay/ — destructive-tinted error banner for preview overlays
 * [PROTOCOL]: Update this header on change, then check AGENTS.md
 */

import type React from 'react'

export interface OverlayErrorBannerProps {
  label: string
  message: string
}

export function OverlayErrorBanner({ label, message }: OverlayErrorBannerProps) {
  return (
    <div className="w-full max-w-[850px] mx-auto">
      <div
        className="px-4 py-3 rounded-[8px] bg-[color-mix(in_oklab,var(--destructive)_5%,var(--background))] shadow-tinted"
        style={{ '--shadow-color': 'var(--destructive-rgb)' } as React.CSSProperties}
      >
        <div className="text-xs font-semibold text-destructive/70 mb-0.5">{label}</div>
        <p className="text-sm text-destructive whitespace-pre-wrap break-words font-mono">{message}</p>
      </div>
    </div>
  )
}
