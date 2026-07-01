// ── Sorting ───────────────────────────────────────────────────

export type BarState = 'default' | 'comparing' | 'swapping' | 'sorted' | 'pivot'

export interface SortFrame {
  values: number[]
  highlights: Map<number, BarState>
  label?: string
}

// ── Array Search ──────────────────────────────────────────────

export type ArraySearchState = 'default' | 'active' | 'eliminated' | 'in-range' | 'found'

export interface ArraySearchFrame {
  values: number[]
  target: number
  highlights: Map<number, ArraySearchState>
  low?: number
  high?: number
  label?: string
}

// ── Grid Search ───────────────────────────────────────────────

export type CellState =
  | 'empty'
  | 'wall'
  | 'start'
  | 'goal'
  | 'visited'
  | 'frontier'
  | 'path'

export type Grid = CellState[][]

export interface GridFrame {
  grid: Grid
  label?: string
  pathLength?: number
}

// ── Shared ────────────────────────────────────────────────────

export type Language = 'python' | 'javascript' | 'java' | 'rust' | 'cpp'

export type PlaybackStatus = 'idle' | 'playing' | 'paused' | 'done'

export interface ComplexityInfo {
  best: string
  average: string
  worst: string
  space: string
}

// ── Algorithm Meta ────────────────────────────────────────────

export interface AlgorithmMeta {
  id: string
  name: string
  description: string
  complexity: ComplexityInfo
  snippets: Record<Language, string>
  generate: (arr: number[]) => SortFrame[]
}

export type SearchCategory = 'array' | 'graph'

export interface SearchAlgorithmMeta {
  id: string
  name: string
  category: SearchCategory
  description: string
  complexity: ComplexityInfo
  snippets: Record<Language, string>
  generateArray?: (values: number[], target: number) => ArraySearchFrame[]
  generateGrid?: (grid: Grid, rows: number, cols: number) => GridFrame[]
}
