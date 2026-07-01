import { useEffect, useMemo, useRef, useState } from 'react'
import { Play, Pause, RotateCcw } from 'lucide-react'
import type { SearchAlgorithmMeta, ArraySearchFrame, GridFrame, Grid } from '@/types'
import { useSearch } from '@/hooks/useSearch'
import { ArraySearchChart } from '@/components/ArraySearchChart'
import { GridSearchChart } from '@/components/GridSearchChart'
import { CodePanel } from '@/components/CodePanel'
import { ComplexityTable } from '@/components/ComplexityTable'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const RANK_COLORS = [
  'bg-yellow-500 text-yellow-950',
  'bg-slate-400 text-slate-950',
  'bg-orange-600 text-orange-950',
  'bg-muted text-muted-foreground',
]
const RANK_LABELS = ['1st', '2nd', '3rd', '4th', '5th']

// ── Array Search Card ─────────────────────────────────────────

interface ArraySearchCardProps {
  meta: SearchAlgorithmMeta
  values: number[]
  target: number
  speedMs: number
  isPlayAllActive: boolean
  rank?: number
  onDone: () => void
}

export function ArraySearchCard({
  meta, values, target, speedMs, isPlayAllActive, rank, onDone,
}: ArraySearchCardProps) {
  const frames = useMemo(
    () => meta.generateArray!(values, target),
    [meta, values, target]
  ) as ArraySearchFrame[]

  const { currentFrame, currentFrameIndex, totalFrames, status, play, pause, reset } = useSearch(frames, speedMs)
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  useEffect(() => {
    if (isPlayAllActive) { reset(); setTimeout(play, 10) }
    else if (!isPlayAllActive && status === 'playing') pause()
  }, [isPlayAllActive])

  useEffect(() => { if (status === 'done') onDoneRef.current() }, [status])

  return (
    <div className="flex flex-col rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-sm">{meta.name}</h2>
          {rank !== undefined && (
            <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded-full', RANK_COLORS[Math.min(rank, 3)])}>
              {RANK_LABELS[rank]}
            </span>
          )}
        </div>
        <div className="flex gap-1.5">
          <Button variant="outline" size="icon" className="h-7 w-7"
            onClick={status === 'playing' ? pause : play} disabled={status === 'done'}>
            {status === 'playing' ? <Pause size={13} /> : <Play size={13} />}
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={reset}>
            <RotateCcw size={13} />
          </Button>
        </div>
      </div>

      <div className="p-3">
        {currentFrame && <ArraySearchChart frame={currentFrame} />}
      </div>

      <div className="px-4 py-1 text-[11px] text-muted-foreground border-t border-border flex justify-between">
        <span className="truncate">{currentFrame?.label ?? 'Ready'}</span>
        <span className="shrink-0">{currentFrameIndex + 1}/{totalFrames}</span>
      </div>

      <div className="flex gap-3 p-3 border-t border-border min-h-[140px]">
        <div className="flex-1 min-w-0">
          <CodePanel snippets={meta.snippets} />
        </div>
        <div className="w-36 shrink-0">
          <ComplexityTable complexity={meta.complexity} />
        </div>
      </div>

      <div className="px-4 pb-3">
        <p className="text-xs text-muted-foreground leading-relaxed">{meta.description}</p>
      </div>
    </div>
  )
}

// ── Graph Search Card ─────────────────────────────────────────

interface GraphSearchCardProps {
  meta: SearchAlgorithmMeta
  grid: Grid
  rows: number
  cols: number
  speedMs: number
  isPlayAllActive: boolean
  rank?: number
  onDone: () => void
  onToggleWall?: (r: number, c: number) => void
}

export function GraphSearchCard({
  meta, grid, rows, cols, speedMs, isPlayAllActive, rank, onDone, onToggleWall,
}: GraphSearchCardProps) {
  const frames = useMemo(
    () => meta.generateGrid!(grid, rows, cols),
    [meta, grid, rows, cols]
  ) as GridFrame[]

  const { currentFrame, currentFrameIndex, totalFrames, status, play, pause, reset } = useSearch(frames, speedMs)
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone
  const [localGrid, setLocalGrid] = useState<Grid>(grid)

  // When parent resets grid, sync local
  useEffect(() => { setLocalGrid(grid); reset() }, [grid])

  useEffect(() => {
    if (isPlayAllActive) { reset(); setTimeout(play, 10) }
    else if (!isPlayAllActive && status === 'playing') pause()
  }, [isPlayAllActive])

  useEffect(() => { if (status === 'done') onDoneRef.current() }, [status])

  const displayGrid = (status !== 'idle' && currentFrame) ? currentFrame.grid : localGrid
  const isIdle = status === 'idle' || status === 'paused'

  return (
    <div className="flex flex-col rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-sm">{meta.name}</h2>
          {rank !== undefined && (
            <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded-full', RANK_COLORS[Math.min(rank, 3)])}>
              {RANK_LABELS[rank]}
            </span>
          )}
        </div>
        <div className="flex gap-1.5">
          <Button variant="outline" size="icon" className="h-7 w-7"
            onClick={status === 'playing' ? pause : play} disabled={status === 'done'}>
            {status === 'playing' ? <Pause size={13} /> : <Play size={13} />}
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={reset}>
            <RotateCcw size={13} />
          </Button>
        </div>
      </div>

      <div className="p-3">
        <GridSearchChart
          frame={{ grid: displayGrid }}
          rows={rows}
          cols={cols}
          interactive={isIdle}
          onToggleWall={isIdle ? onToggleWall : undefined}
        />
      </div>

      <div className="px-4 py-1 text-[11px] text-muted-foreground border-t border-border flex justify-between">
        <span className="truncate">{currentFrame?.label ?? (isIdle ? 'Click/drag to draw walls, then Play' : 'Ready')}</span>
        <span className="shrink-0">{currentFrameIndex + 1}/{totalFrames}</span>
      </div>

      <div className="flex gap-3 p-3 border-t border-border min-h-[140px]">
        <div className="flex-1 min-w-0">
          <CodePanel snippets={meta.snippets} />
        </div>
        <div className="w-36 shrink-0">
          <ComplexityTable complexity={meta.complexity} />
        </div>
      </div>

      <div className="px-4 pb-3">
        <p className="text-xs text-muted-foreground leading-relaxed">{meta.description}</p>
      </div>
    </div>
  )
}
