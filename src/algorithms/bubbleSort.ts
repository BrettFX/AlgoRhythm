import type { SortFrame, BarState } from '@/types'
import { decimateFrames } from '@/lib/utils'

function snap(values: number[], highlights: [number, BarState][], label?: string): SortFrame {
  return { values: [...values], highlights: new Map(highlights), label }
}

export function generateFrames(input: number[]): SortFrame[] {
  const arr = [...input]
  const frames: SortFrame[] = []
  const n = arr.length
  const sorted = new Set<number>()

  for (let i = 0; i < n - 1; i++) {
    let swapped = false
    for (let j = 0; j < n - i - 1; j++) {
      const hl: [number, BarState][] = [
        [j, 'comparing'], [j + 1, 'comparing'],
        ...([...sorted].map(s => [s, 'sorted'] as [number, BarState])),
      ]
      frames.push(snap(arr, hl, `Comparing [${j}]=${arr[j]} vs [${j + 1}]=${arr[j + 1]}`))
      if (arr[j] > arr[j + 1]) {
        ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
        swapped = true
        frames.push(snap(arr, [
          [j, 'swapping'], [j + 1, 'swapping'],
          ...([...sorted].map(s => [s, 'sorted'] as [number, BarState])),
        ], `Swapped [${j}] ↔ [${j + 1}]`))
      }
    }
    sorted.add(n - 1 - i)
    if (!swapped) break
  }

  const allSorted: [number, BarState][] = arr.map((_, i) => [i, 'sorted'])
  frames.push(snap(arr, allSorted, 'Sorted!'))
  return decimateFrames(frames)
}
