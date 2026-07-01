import type { ComplexityInfo } from '@/types'
import { cn } from '@/lib/utils'

function complexityColor(expr: string): string {
  if (expr === 'O(1)') return 'text-green-400'
  if (expr === 'O(n)') return 'text-green-400'
  if (expr.includes('log log')) return 'text-blue-400'
  if (expr.includes('log')) return 'text-yellow-400'
  if (expr.startsWith('O(n²') || expr === 'O(n^2)' || expr.startsWith('O(n^1')) return 'text-red-400'
  if (expr.startsWith('O(n²)') || expr === 'O(n²)') return 'text-red-400'
  return 'text-muted-foreground'
}

interface ComplexityTableProps {
  complexity: ComplexityInfo
  className?: string
}

export function ComplexityTable({ complexity, className }: ComplexityTableProps) {
  const rows = [
    { label: 'Best', value: complexity.best },
    { label: 'Average', value: complexity.average },
    { label: 'Worst', value: complexity.worst },
    { label: 'Space', value: complexity.space },
  ]

  return (
    <div className={cn('rounded-md border border-border overflow-hidden', className)}>
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-muted/50">
            <th className="text-left px-3 py-1.5 font-medium text-muted-foreground">Case</th>
            <th className="text-right px-3 py-1.5 font-medium text-muted-foreground">Complexity</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ label, value }) => (
            <tr key={label} className="border-t border-border">
              <td className="px-3 py-1.5 text-muted-foreground">{label}</td>
              <td className={cn('px-3 py-1.5 text-right font-mono font-semibold', complexityColor(value))}>
                {value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
