import { motion } from 'framer-motion'
import { useRef } from 'react'
import type { GridFrame, CellState } from '@/types'
import { cn } from '@/lib/utils'

const CELL_STYLES: Record<CellState, string> = {
  empty: 'bg-muted/40',
  wall: 'bg-foreground/90',
  start: 'bg-primary text-primary-foreground',
  goal: 'bg-destructive text-destructive-foreground',
  visited: 'bg-sky-400/60',
  frontier: 'bg-warning/80',
  path: 'bg-success',
}

interface GridSearchChartProps {
  frame: GridFrame
  rows: number
  cols: number
  interactive: boolean
  onToggleWall?: (row: number, col: number) => void
}

export function GridSearchChart({ frame, rows, cols, interactive, onToggleWall }: GridSearchChartProps) {
  const { grid } = frame
  const isDragging = useRef(false)
  const dragMode = useRef<'add' | 'remove'>('add')

  const handlePointerDown = (r: number, c: number) => {
    if (!interactive || !onToggleWall) return
    isDragging.current = true
    dragMode.current = grid[r][c] === 'wall' ? 'remove' : 'add'
    onToggleWall(r, c)
  }

  const handlePointerEnter = (r: number, c: number) => {
    if (!isDragging.current || !interactive || !onToggleWall) return
    const isWall = grid[r][c] === 'wall'
    if (dragMode.current === 'add' && !isWall) onToggleWall(r, c)
    if (dragMode.current === 'remove' && isWall) onToggleWall(r, c)
  }

  const handlePointerUp = () => { isDragging.current = false }

  return (
    <div
      className="w-full select-none"
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <div
        className="grid w-full gap-px"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {Array.from({ length: rows }, (_, r) =>
          Array.from({ length: cols }, (__, c) => {
            const state: CellState = grid[r]?.[c] ?? 'empty'
            const isSpecial = state === 'start' || state === 'goal'
            return (
              <motion.div
                key={`${r}-${c}`}
                className={cn(
                  'aspect-square rounded-sm flex items-center justify-center text-[8px] font-bold',
                  CELL_STYLES[state],
                  interactive && state !== 'start' && state !== 'goal' ? 'cursor-pointer' : 'cursor-default',
                  state === 'path' ? 'ring-1 ring-success/50' : ''
                )}
                animate={state === 'path' ? { scale: [0.6, 1] } : { scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25, duration: 0.2 }}
                onPointerDown={() => handlePointerDown(r, c)}
                onPointerEnter={() => handlePointerEnter(r, c)}
              >
                {isSpecial && (state === 'start' ? 'S' : 'G')}
              </motion.div>
            )
          })
        )}
      </div>
    </div>
  )
}
