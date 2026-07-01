import { motion } from 'framer-motion'
import type { ArraySearchFrame, ArraySearchState } from '@/types'
import { cn } from '@/lib/utils'

const CELL_COLORS: Record<ArraySearchState, string> = {
  default: 'bg-muted text-muted-foreground',
  'in-range': 'bg-primary/20 text-primary',
  active: 'bg-warning text-warning-foreground',
  eliminated: 'bg-muted/30 text-muted-foreground/30',
  found: 'bg-success text-success-foreground',
}

interface ArraySearchChartProps {
  frame: ArraySearchFrame
}

export function ArraySearchChart({ frame }: ArraySearchChartProps) {
  const { values, target, highlights } = frame
  const showText = values.length <= 40

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>Target:</span>
        <span className="font-mono font-bold text-warning">{target}</span>
      </div>
      <div className="flex flex-wrap gap-1 w-full">
        {values.map((v, i) => {
          const state = highlights.get(i) ?? 'default'
          return (
            <motion.div
              key={i}
              className={cn(
                'flex flex-col items-center justify-center rounded border border-border/50 font-mono text-xs transition-colors duration-150 select-none',
                showText ? 'w-9 h-9' : 'w-4 h-4',
                CELL_COLORS[state]
              )}
              animate={{ scale: state === 'active' ? 1.15 : state === 'found' ? 1.2 : 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              {showText && <span className="font-bold leading-none">{v}</span>}
              {showText && <span className="text-[9px] opacity-50 leading-none">{i}</span>}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
