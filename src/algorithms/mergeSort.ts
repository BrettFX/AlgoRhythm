import type { SortFrame, BarState } from '@/types'
import { decimateFrames } from '@/lib/utils'

function snap(values: number[], highlights: [number, BarState][], label?: string): SortFrame {
  return { values: [...values], highlights: new Map(highlights), label }
}

export function generateFrames(input: number[]): SortFrame[] {
  const arr = [...input]
  const frames: SortFrame[] = []
  const n = arr.length

  // Bottom-up iterative merge sort
  for (let width = 1; width < n; width *= 2) {
    for (let lo = 0; lo < n; lo += 2 * width) {
      const mid = Math.min(lo + width, n)
      const hi = Math.min(lo + 2 * width, n)

      // Show merge window
      const windowHl: [number, BarState][] = []
      for (let k = lo; k < hi; k++) windowHl.push([k, 'comparing'])
      frames.push(snap(arr, windowHl, `Merging [${lo}..${mid - 1}] with [${mid}..${hi - 1}]`))

      // Merge
      const left = arr.slice(lo, mid)
      const right = arr.slice(mid, hi)
      let i = 0, j = 0, k = lo
      while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
          arr[k++] = left[i++]
        } else {
          arr[k++] = right[j++]
        }
        frames.push(snap(arr, [[k - 1, 'swapping']], `Writing ${arr[k - 1]} at [${k - 1}]`))
      }
      while (i < left.length) { arr[k++] = left[i++] }
      while (j < right.length) { arr[k++] = right[j++] }
    }
  }

  frames.push(snap(arr, arr.map((_, i): [number, BarState] => [i, 'sorted']), 'Sorted!'))
  return decimateFrames(frames)
}
