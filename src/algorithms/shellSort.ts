import type { SortFrame, BarState } from '@/types'
import { decimateFrames } from '@/lib/utils'

function snap(values: number[], highlights: [number, BarState][], label?: string): SortFrame {
  return { values: [...values], highlights: new Map(highlights), label }
}

export function generateFrames(input: number[]): SortFrame[] {
  const arr = [...input]
  const frames: SortFrame[] = []
  const n = arr.length

  // Knuth sequence gaps
  let gap = 1
  while (gap < Math.floor(n / 3)) gap = gap * 3 + 1

  while (gap >= 1) {
    for (let i = gap; i < n; i++) {
      let j = i
      while (j >= gap) {
        frames.push(snap(arr, [[j, 'comparing'], [j - gap, 'comparing']], `Gap=${gap}: compare [${j}]=${arr[j]} vs [${j - gap}]=${arr[j - gap]}`))
        if (arr[j] < arr[j - gap]) {
          ;[arr[j], arr[j - gap]] = [arr[j - gap], arr[j]]
          frames.push(snap(arr, [[j, 'swapping'], [j - gap, 'swapping']], `Gap=${gap}: swap [${j}] ↔ [${j - gap}]`))
          j -= gap
        } else {
          break
        }
      }
    }
    gap = Math.floor(gap / 3)
  }

  frames.push(snap(arr, arr.map((_, i): [number, BarState] => [i, 'sorted']), 'Sorted!'))
  return decimateFrames(frames)
}
