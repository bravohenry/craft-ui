/**
 * [INPUT]: react SVGProps
 * [OUTPUT]: IconProps interface for all custom SVG icons
 * [POS]: Shared type contract for icons/ directory
 * [PROTOCOL]: Update on change, then check AGENTS.md
 */

import type { SVGProps } from 'react'

export interface IconProps extends SVGProps<SVGSVGElement> {
  /**
   * Icon size. Only used when className doesn't include size classes.
   * For Tailwind, prefer using className="size-4" etc.
   */
  size?: number | string
}
