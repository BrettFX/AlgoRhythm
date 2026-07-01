import type { SortFrame, BarState } from '@/types'
import { decimateFrames } from '@/lib/utils'

function snap(values: number[], highlights: [number, BarState][], label?: string): SortFrame {
  return { values: [...values], highlights: new Map(highlights), label }
}

export function generateFrames(input: number[]): SortFrame[] {
  const arr = [...input]
  const frames: SortFrame[] = []
  const n = arr.length

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i
    for (let j = i + 1; j < n; j++) {
      const hl: [number, BarState][] = [
        [minIdx, 'pivot'],
        [j, 'comparing'],
        ...Array.from({ length: i }, (_, k): [number, BarState] => [k, 'sorted']),
      ]
      frames.push(snap(arr, hl, `Min=[${minIdx}]=${arr[minIdx]}, Checking [${j}]=${arr[j]}`))
      if (arr[j] < arr[minIdx]) {
        minIdx = j
      }
    }
    if (minIdx !== i) {
      ;[arr[i], arr[minIdx]] = [arr[minIdx], arr[i]]
      frames.push(snap(arr, [
        [i, 'swapping'], [minIdx, 'swapping'],
        ...Array.from({ length: i }, (_, k): [number, BarState] => [k, 'sorted']),
      ], `Placed minimum at [${i}]`))
    }
  }

  frames.push(snap(arr, arr.map((_, i): [number, BarState] => [i, 'sorted']), 'Sorted!'))
  return decimateFrames(frames)
}
