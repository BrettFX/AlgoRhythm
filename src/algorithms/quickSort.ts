import type { SortFrame, BarState } from '@/types'
import { decimateFrames } from '@/lib/utils'

function snap(values: number[], highlights: [number, BarState][], label?: string): SortFrame {
  return { values: [...values], highlights: new Map(highlights), label }
}

function partition(arr: number[], lo: number, hi: number, frames: SortFrame[]): number {
  const pivot = arr[hi]
  frames.push(snap(arr, [[hi, 'pivot']], `Pivot = ${pivot} at [${hi}]`))
  let i = lo - 1
  for (let j = lo; j < hi; j++) {
    frames.push(snap(arr, [[hi, 'pivot'], [j, 'comparing']], `Comparing [${j}]=${arr[j]} with pivot ${pivot}`))
    if (arr[j] <= pivot) {
      i++
      if (i !== j) {
        ;[arr[i], arr[j]] = [arr[j], arr[i]]
        frames.push(snap(arr, [[hi, 'pivot'], [i, 'swapping'], [j, 'swapping']], `Swap [${i}] ↔ [${j}]`))
      }
    }
  }
  ;[arr[i + 1], arr[hi]] = [arr[hi], arr[i + 1]]
  frames.push(snap(arr, [[i + 1, 'sorted']], `Pivot placed at [${i + 1}]`))
  return i + 1
}

function quickSortHelper(arr: number[], lo: number, hi: number, frames: SortFrame[]) {
  if (lo < hi) {
    const p = partition(arr, lo, hi, frames)
    quickSortHelper(arr, lo, p - 1, frames)
    quickSortHelper(arr, p + 1, hi, frames)
  }
}

export function generateFrames(input: number[]): SortFrame[] {
  const arr = [...input]
  const frames: SortFrame[] = []
  quickSortHelper(arr, 0, arr.length - 1, frames)
  frames.push(snap(arr, arr.map((_, i): [number, BarState] => [i, 'sorted']), 'Sorted!'))
  return decimateFrames(frames)
}
