import { motion } from 'framer-motion'
import type { SortFrame, BarState } from '@/types'
import { cn } from '@/lib/utils'

const BAR_COLORS: Record<BarState, string> = {
  default: 'bg-primary/70',
  comparing: 'bg-warning',
  swapping: 'bg-destructive',
  sorted: 'bg-success',
  pivot: 'bg-purple-500',
}

interface BarChartProps {
  frame: SortFrame
  maxValue: number
}

export function BarChart({ frame, maxValue }: BarChartProps) {
  const { values, highlights } = frame
  const useLayout = values.length <= 60

  return (
    <div className="flex items-end gap-px h-full w-full">
      {values.map((v, i) => {
        const state = highlights.get(i) ?? 'default'
        const heightPct = maxValue > 0 ? (v / maxValue) * 100 : 0

        return (
          <motion.div
            key={i}
            className={cn('flex-1 rounded-t-sm transition-colors duration-100', BAR_COLORS[state])}
            style={{ flexBasis: 0 }}
            animate={{ height: `${heightPct}%` }}
            layout={useLayout}
            transition={{ type: 'tween', duration: 0.06 }}
          />
        )
      })}
    </div>
  )
}
