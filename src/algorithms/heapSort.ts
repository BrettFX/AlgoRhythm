import type { SortFrame, BarState } from '@/types'
import { decimateFrames } from '@/lib/utils'

function snap(values: number[], highlights: [number, BarState][], label?: string): SortFrame {
  return { values: [...values], highlights: new Map(highlights), label }
}

function heapify(arr: number[], n: number, i: number, frames: SortFrame[], sortedFrom: number) {
  let largest = i
  const l = 2 * i + 1
  const r = 2 * i + 2
  const sortedHl: [number, BarState][] = Array.from({ length: arr.length - sortedFrom }, (_, k): [number, BarState] => [sortedFrom + k, 'sorted'])

  if (l < n) frames.push(snap(arr, [...sortedHl, [i, 'comparing'], [l, 'comparing']], `Heapify: compare [${i}]=${arr[i]} vs left child [${l}]=${arr[l]}`))
  if (l < n && arr[l] > arr[largest]) largest = l
  if (r < n) frames.push(snap(arr, [...sortedHl, [largest, 'comparing'], [r, 'comparing']], `Heapify: compare [${largest}]=${arr[largest]} vs right child [${r}]=${arr[r]}`))
  if (r < n && arr[r] > arr[largest]) largest = r

  if (largest !== i) {
    ;[arr[i], arr[largest]] = [arr[largest], arr[i]]
    frames.push(snap(arr, [...sortedHl, [i, 'swapping'], [largest, 'swapping']], `Swap [${i}] ↔ [${largest}]`))
    heapify(arr, n, largest, frames, sortedFrom)
  }
}

export function generateFrames(input: number[]): SortFrame[] {
  const arr = [...input]
  const frames: SortFrame[] = []
  const n = arr.length

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i, frames, n)
  }

  // Extract elements
  for (let i = n - 1; i > 0; i--) {
    ;[arr[0], arr[i]] = [arr[i], arr[0]]
    frames.push(snap(arr, [
      [0, 'swapping'], [i, 'sorted'],
      ...Array.from({ length: n - i }, (_, k): [number, BarState] => [i + k, 'sorted']),
    ], `Extract max to [${i}]`))
    heapify(arr, i, 0, frames, i)
  }

  frames.push(snap(arr, arr.map((_, i): [number, BarState] => [i, 'sorted']), 'Sorted!'))
  return decimateFrames(frames)
}
