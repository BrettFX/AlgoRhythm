import type { SortFrame, BarState } from '@/types'
import { decimateFrames } from '@/lib/utils'

function snap(values: number[], highlights: [number, BarState][], label?: string): SortFrame {
  return { values: [...values], highlights: new Map(highlights), label }
}

export function generateFrames(input: number[]): SortFrame[] {
  const arr = [...input]
  const frames: SortFrame[] = []
  const max = Math.max(...arr)

  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    const digit = (v: number) => Math.floor(v / exp) % 10

    // Show which digit we're sorting on
    frames.push(snap(arr, arr.map((_, i): [number, BarState] => [i, 'comparing']), `Pass: digit = 10^${Math.log10(exp) | 0} (ones, tens, …)`))

    const buckets: number[][] = Array.from({ length: 10 }, () => [])
    for (let i = 0; i < arr.length; i++) {
      const d = digit(arr[i])
      buckets[d].push(arr[i])
      frames.push(snap(arr, [[i, 'swapping']], `[${i}]=${arr[i]} → bucket ${d}`))
    }

    let k = 0
    for (let b = 0; b < 10; b++) {
      for (const v of buckets[b]) {
        arr[k++] = v
      }
    }
    frames.push(snap(arr, arr.map((_, i): [number, BarState] => [i, 'comparing']), `After digit pass exp=${exp}`))
  }

  frames.push(snap(arr, arr.map((_, i): [number, BarState] => [i, 'sorted']), 'Sorted!'))
  return decimateFrames(frames)
}
