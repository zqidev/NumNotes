import { generateJSON } from '@tiptap/core'
import { markdownToHtml } from '../../import/markdown.ts'
import { richExtensions } from './extensions.ts'

function escapeAttribute(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function markdownWithMath(text: string): string {
  const lines = text.split('\n')
  const out: string[] = []
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (line.startsWith('$$') && line.endsWith('$$') && line.length > 4) {
      const latex = line.slice(2, -2).trim()
      out.push(`<div data-latex="${escapeAttribute(latex)}"></div>`)
    } else if (line.startsWith('\\[') && line.endsWith('\\]')) {
      const latex = line.slice(2, -2).trim()
      out.push(`<div data-latex="${escapeAttribute(latex)}"></div>`)
    } else {
      out.push(lines[i])
    }
  }
  return out.join('\n')
}

export function pastedContent(text: string): Record<string, unknown> {
  const html = markdownToHtml(markdownWithMath(text))
  return generateJSON(html, richExtensions()) as Record<string, unknown>
}
