import { useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw } from 'lucide-react'
import type { AlgorithmMeta } from '@/types'
import { useSort } from '@/hooks/useSort'
import { BarChart } from '@/components/BarChart'
import { CodePanel } from '@/components/CodePanel'
import { ComplexityTable } from '@/components/ComplexityTable'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const RANK_LABELS = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th']
const RANK_COLORS = [
  'bg-yellow-500 text-yellow-950',
  'bg-slate-400 text-slate-950',
  'bg-orange-600 text-orange-950',
  'bg-muted text-muted-foreground',
]

interface AlgorithmCardProps {
  meta: AlgorithmMeta
  array: number[]
  maxValue: number
  speedMs: number
  isPlayAllActive: boolean
  rank?: number
  onDone: () => void
}

export function AlgorithmCard({
  meta, array, maxValue, speedMs, isPlayAllActive, rank, onDone,
}: AlgorithmCardProps) {
  const { currentFrame, currentFrameIndex, frames, status, play, pause, reset } = useSort(meta, array, speedMs)
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  // Trigger play from Play All
  useEffect(() => {
    if (isPlayAllActive) { reset(); setTimeout(play, 10) }
    else if (!isPlayAllActive && status === 'playing') { pause() }
  }, [isPlayAllActive])

  // Notify parent when done
  useEffect(() => {
    if (status === 'done') onDoneRef.current()
  }, [status])

  const isPlaying = status === 'playing'

  return (
    <div className="flex flex-col rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-sm">{meta.name}</h2>
          {rank !== undefined && (
            <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded-full', RANK_COLORS[Math.min(rank, 3)])}>
              {RANK_LABELS[rank]}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={isPlaying ? pause : play}
            disabled={status === 'done'}
          >
            {isPlaying ? <Pause size={13} /> : <Play size={13} />}
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={reset}>
            <RotateCcw size={13} />
          </Button>
        </div>
      </div>

      {/* Visualization + Code */}
      <div className="flex gap-3 p-3 min-h-[180px]">
        <div className="flex-1 min-w-0 h-[160px]">
          {currentFrame && <BarChart frame={currentFrame} maxValue={maxValue} />}
        </div>
        <div className="w-[45%] min-w-0 h-[160px]">
          <CodePanel snippets={meta.snippets} />
        </div>
      </div>

      {/* Status strip */}
      <div className="px-4 py-1 text-[11px] text-muted-foreground border-t border-border flex justify-between gap-2">
        <span className="truncate">{currentFrame?.label ?? 'Ready'}</span>
        <span className="shrink-0">{currentFrameIndex + 1}/{frames.length}</span>
      </div>

      {/* Description + Complexity */}
      <div className="flex gap-3 p-3 border-t border-border">
        <p className="flex-1 text-xs text-muted-foreground leading-relaxed">{meta.description}</p>
        <div className="w-36 shrink-0">
          <ComplexityTable complexity={meta.complexity} />
        </div>
      </div>
    </div>
  )
}
