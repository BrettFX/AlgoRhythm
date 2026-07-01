import type { GridFrame, Grid, CellState } from '@/types'
import { decimateFrames } from '@/lib/utils'

function cloneGrid(grid: Grid): Grid { return grid.map(r => [...r]) }

function snap(grid: Grid, label?: string, pathLength?: number): GridFrame {
  return { grid: cloneGrid(grid), label, pathLength }
}

const DIRS = [[-1, 0], [1, 0], [0, -1], [0, 1]]

export function generateFrames(initialGrid: Grid, rows: number, cols: number): GridFrame[] {
  const grid = cloneGrid(initialGrid)
  const frames: GridFrame[] = []
  const visited = Array.from({ length: rows }, () => new Array(cols).fill(false))
  const parent: Array<Array<[number, number] | null>> = Array.from({ length: rows }, () => new Array(cols).fill(null))

  const stack: [number, number][] = [[0, 0]]
  visited[0][0] = true

  let found = false

  while (stack.length > 0) {
    const [r, c] = stack.pop()!

    if (grid[r][c] !== 'start') grid[r][c] = 'visited'

    // Show top 5 of stack as frontier
    for (const [sr, sc] of stack.slice(-5)) {
      if (grid[sr][sc] !== 'start' && grid[sr][sc] !== 'goal' && grid[sr][sc] !== 'visited') {
        grid[sr][sc] = 'frontier'
      }
    }
    frames.push(snap(grid, `DFS: visiting (${r},${c}), stack: ${stack.length} nodes`))

    if (r === rows - 1 && c === cols - 1) { found = true; break }

    for (const [dr, dc] of DIRS) {
      const nr = r + dr, nc = c + dc
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited[nr][nc] && (grid[nr][nc] as CellState) !== 'wall') {
        visited[nr][nc] = true
        parent[nr][nc] = [r, c]
        stack.push([nr, nc])
      }
    }
  }

  if (!found) {
    frames.push(snap(grid, 'No path found'))
    return decimateFrames(frames)
  }

  // Trace path
  const path: [number, number][] = []
  let cur: [number, number] | null = [rows - 1, cols - 1]
  while (cur) {
    path.unshift(cur)
    cur = parent[cur[0]][cur[1]]
  }

  for (const [r, c] of path) {
    if (grid[r][c] !== 'start' && grid[r][c] !== 'goal') grid[r][c] = 'path'
    frames.push(snap(grid, `Path: length ${path.length}`, path.length))
  }

  return decimateFrames(frames)
}
