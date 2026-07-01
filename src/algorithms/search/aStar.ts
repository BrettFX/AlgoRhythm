import type { GridFrame, Grid, CellState } from '@/types'
import { MinHeap } from '@/lib/minHeap'
import { decimateFrames } from '@/lib/utils'

function cloneGrid(grid: Grid): Grid { return grid.map(r => [...r]) }

function snap(grid: Grid, label?: string, pathLength?: number): GridFrame {
  return { grid: cloneGrid(grid), label, pathLength }
}

const DIRS = [[-1, 0], [1, 0], [0, -1], [0, 1]]

export function generateFrames(initialGrid: Grid, rows: number, cols: number): GridFrame[] {
  const grid = cloneGrid(initialGrid)
  const frames: GridFrame[] = []
  const goalR = rows - 1, goalC = cols - 1

  const h = (r: number, c: number) => Math.abs(r - goalR) + Math.abs(c - goalC)

  const g = Array.from({ length: rows }, () => new Array(cols).fill(Infinity))
  const parent: Array<Array<[number, number] | null>> = Array.from({ length: rows }, () => new Array(cols).fill(null))
  const inOpen = Array.from({ length: rows }, () => new Array(cols).fill(false))

  g[0][0] = 0
  const heap = new MinHeap()
  heap.push({ priority: h(0, 0), row: 0, col: 0 })
  inOpen[0][0] = true

  let found = false

  while (!heap.isEmpty) {
    const { row: r, col: c } = heap.pop()!
    inOpen[r][c] = false

    if (grid[r][c] !== 'start') grid[r][c] = 'visited'

    // Mark open set as frontier
    for (let rr = 0; rr < rows; rr++) {
      for (let cc = 0; cc < cols; cc++) {
        if (inOpen[rr][cc] && grid[rr][cc] !== 'start' && grid[rr][cc] !== 'goal') {
          grid[rr][cc] = 'frontier'
        }
      }
    }

    const gCur = g[r][c]
    const hCur = h(r, c)
    frames.push(snap(grid, `A*: (${r},${c}) f=${gCur + hCur} (g=${gCur}+h=${hCur}), open: ${heap.size}`))

    if (r === goalR && c === goalC) { found = true; break }

    for (const [dr, dc] of DIRS) {
      const nr = r + dr, nc = c + dc
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue
      if ((grid[nr][nc] as CellState) === 'wall' || (grid[nr][nc] as CellState) === 'visited') continue

      const tentative = g[r][c] + 1
      if (tentative < g[nr][nc]) {
        g[nr][nc] = tentative
        parent[nr][nc] = [r, c]
        heap.push({ priority: tentative + h(nr, nc), row: nr, col: nc })
        inOpen[nr][nc] = true
      }
    }
  }

  if (!found) {
    frames.push(snap(grid, 'No path found'))
    return decimateFrames(frames)
  }

  // Trace path
  const path: [number, number][] = []
  let cur: [number, number] | null = [goalR, goalC]
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
