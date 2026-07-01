import { Play, Square, Shuffle, Gauge } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'

function speedLabel(ms: number): string {
  if (ms >= 800) return '0.5×'
  if (ms >= 400) return '1×'
  if (ms >= 150) return '2×'
  if (ms >= 70) return '4×'
  return '8×'
}

interface GlobalControlsProps {
  arraySize: number
  onArraySizeChange: (size: number) => void
  speedMs: number
  onSpeedChange: (ms: number) => void
  onRegenerate: () => void
  onPlayAll: () => void
  isPlayingAll: boolean
  className?: string
}

export function GlobalControls({
  arraySize,
  onArraySizeChange,
  speedMs,
  onSpeedChange,
  onRegenerate,
  onPlayAll,
  isPlayingAll,
  className,
}: GlobalControlsProps) {
  // Invert: higher slider = faster (lower ms)
  // slider value 0 → 1600ms, 100 → 20ms
  const sliderToMs = (v: number) => Math.round(1600 - v * 15.8)
  const msToSlider = (ms: number) => Math.round((1600 - ms) / 15.8)

  return (
    <div className={cn('flex flex-wrap items-center gap-4', className)}>
      <div className="flex items-center gap-2 min-w-[160px]">
        <span className="text-xs text-muted-foreground whitespace-nowrap">Size: {arraySize}</span>
        <Slider
          min={10}
          max={120}
          step={5}
          value={[arraySize]}
          onValueChange={([v]) => onArraySizeChange(v)}
          className="w-28"
        />
      </div>

      <div className="flex items-center gap-2 min-w-[140px]">
        <Gauge size={14} className="text-muted-foreground" />
        <span className="text-xs text-muted-foreground whitespace-nowrap">{speedLabel(speedMs)}</span>
        <Slider
          min={0}
          max={100}
          step={1}
          value={[msToSlider(speedMs)]}
          onValueChange={([v]) => onSpeedChange(sliderToMs(v))}
          className="w-24"
        />
      </div>

      <Button variant="outline" size="sm" onClick={onRegenerate} className="gap-1.5">
        <Shuffle size={14} />
        Regenerate
      </Button>

      <Button
        variant={isPlayingAll ? 'destructive' : 'default'}
        size="sm"
        onClick={onPlayAll}
        className="gap-1.5"
      >
        {isPlayingAll ? <><Square size={14} /> Stop All</> : <><Play size={14} /> Play All</>}
      </Button>
    </div>
  )
}
