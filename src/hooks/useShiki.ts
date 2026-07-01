import { createHighlighter, type Highlighter } from 'shiki'
import { useEffect, useState } from 'react'

let highlighterPromise: Promise<Highlighter> | null = null

function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['github-dark', 'github-light'],
      langs: ['python', 'javascript', 'java', 'rust', 'cpp'],
    })
  }
  return highlighterPromise
}

export function useShiki(): Highlighter | null {
  const [hl, setHl] = useState<Highlighter | null>(null)

  useEffect(() => {
    getHighlighter().then(setHl)
  }, [])

  return hl
}
