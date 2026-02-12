/**
 * [INPUT]: react (SVGProps)
 * [OUTPUT]: IconProps type
 * [POS]: primitives/icons/ — shared type contract for all custom SVG icons
 * [PROTOCOL]: Update this header on change, then check AGENTS.md
 */
import type { SVGProps } from 'react'

export type IconProps = SVGProps<SVGSVGElement> & {
  size?: number
}
