/**
 * [INPUT]: unist-util-visit, unified (Plugin), @types/mdast (Root, Content, Heading, Parent)
 * [OUTPUT]: remarkCollapsibleSections (default export)
 * [POS]: markdown/ — remark plugin wrapping heading+content into collapsible section nodes
 * [PROTOCOL]: Update this header on change, then check AGENTS.md
 */

import type { Plugin } from 'unified'
import type { Root, Content, Heading, Parent } from 'mdast'

interface SectionNode extends Parent {
  type: 'section'
  depth: number
  data: {
    hName: 'div'
    hProperties: {
      'data-section-id': string
      'data-heading-level': number
      className: string
    }
  }
  children: Content[]
}

let sectionCounter = 0

const remarkCollapsibleSections: Plugin<[], Root> = () => {
  return (tree: Root) => {
    sectionCounter = 0
    for (let depth = 6; depth >= 1; depth--) {
      wrapHeadingsAtDepth(tree, depth)
    }
  }
}

function wrapHeadingsAtDepth(tree: Root, depth: number): void {
  const processNode = (parent: Parent) => {
    let i = 0
    while (i < parent.children.length) {
      const node = parent.children[i]
      if (!node) {
        i++
        continue
      }

      if ((node as { type: string }).type === 'section') {
        processNode(node as Parent)
        i++
        continue
      }

      if (node.type === 'heading' && (node as Heading).depth === depth) {
        const sectionId = `section-${++sectionCounter}`

        let endIndex = i + 1
        while (endIndex < parent.children.length) {
          const sibling = parent.children[endIndex]
          if (!sibling) break

          if (sibling.type === 'heading' && (sibling as Heading).depth <= depth) {
            break
          }

          if ((sibling as { type: string }).type === 'section' && (sibling as unknown as SectionNode).depth <= depth) {
            break
          }

          endIndex++
        }

        const sectionChildren = parent.children.slice(i, endIndex) as Content[]

        const section: SectionNode = {
          type: 'section',
          depth,
          children: sectionChildren,
          data: {
            hName: 'div',
            hProperties: {
              'data-section-id': sectionId,
              'data-heading-level': depth,
              className: 'markdown-section',
            },
          },
        }

        parent.children.splice(i, sectionChildren.length, section as unknown as Content)
      }

      i++
    }
  }

  processNode(tree)
}

export default remarkCollapsibleSections
