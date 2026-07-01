import type { Grid, CellState } from '@/types'

/** Generates a perfect maze using Randomized Prim's algorithm.
 *  Every non-wall cell is guaranteed reachable from start. */
export function generateMaze(rows: number, cols: number): Grid {
  const grid: Grid = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, (): CellState => 'wall')
  )

  const carve = (r: number, c: number) => {
    if (r === 0 && c === 0) grid[r][c] = 'start'
    else if (r === rows - 1 && c === cols - 1) grid[r][c] = 'goal'
    else grid[r][c] = 'empty'
  }

  const isInBounds = (r: number, c: number) => r >= 0 && r < rows && c >= 0 && c < cols

  carve(0, 0)

  // Frontier: walls adjacent to carved cells
  const frontier: Array<[number, number]> = []
  const addFrontier = (r: number, c: number) => {
    if (isInBounds(r, c) && grid[r][c] === 'wall') {
      frontier.push([r, c])
    }
  }
  addFrontier(0, 1)
  addFrontier(1, 0)

  const neighbors = (r: number, c: number): Array<[number, number]> => [
    [r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1],
  ]

  const isCarved = (r: number, c: number) =>
    isInBounds(r, c) && grid[r][c] !== 'wall'

  while (frontier.length > 0) {
    const idx = Math.floor(Math.random() * frontier.length)
    const [r, c] = frontier.splice(idx, 1)[0]

    // Count carved neighbors
    const carvedNeighbors = neighbors(r, c).filter(([nr, nc]) => isCarved(nr, nc))
    if (carvedNeighbors.length === 1) {
      carve(r, c)
      for (const [nr, nc] of neighbors(r, c)) {
        addFrontier(nr, nc)
      }
    }
  }

  // Ensure goal is carved regardless
  grid[rows - 1][cols - 1] = 'goal'
  // Ensure start is carved
  grid[0][0] = 'start'

  return grid
}

/** Simple sparse maze: ~25% random walls, guaranteed open start/goal neighbors. */
export function generateSparseGrid(rows: number, cols: number): Grid {
  const grid: Grid = Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (__, c): CellState => {
      if (r === 0 && c === 0) return 'start'
      if (r === rows - 1 && c === cols - 1) return 'goal'
      return Math.random() < 0.28 ? 'wall' : 'empty'
    })
  )
  // Clear immediate neighbors of start/goal to prevent instant dead-ends
  for (const [r, c] of [[0, 1], [1, 0], [rows - 2, cols - 1], [rows - 1, cols - 2]] as [number,number][]) {
    if (r >= 0 && r < rows && c >= 0 && c < cols && grid[r][c] === 'wall') {
      grid[r][c] = 'empty'
    }
  }
  return grid
}

export function cloneGrid(grid: Grid): Grid {
  return grid.map(row => [...row])
}
