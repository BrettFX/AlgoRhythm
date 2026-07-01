import type { SortFrame, BarState } from '@/types'
import { decimateFrames } from '@/lib/utils'

function snap(values: number[], highlights: [number, BarState][], label?: string): SortFrame {
  return { values: [...values], highlights: new Map(highlights), label }
}

export function generateFrames(input: number[]): SortFrame[] {
  const arr = [...input]
  const frames: SortFrame[] = []
  const n = arr.length

  for (let i = 1; i < n; i++) {
    let j = i
    while (j > 0) {
      const hl: [number, BarState][] = [
        [j, 'comparing'], [j - 1, 'comparing'],
      ]
      frames.push(snap(arr, hl, `Inserting [${i}]=${arr[j]} — comparing with [${j - 1}]=${arr[j - 1]}`))
      if (arr[j] < arr[j - 1]) {
        ;[arr[j], arr[j - 1]] = [arr[j - 1], arr[j]]
        frames.push(snap(arr, [[j, 'swapping'], [j - 1, 'swapping']], `Shifted right`))
        j--
      } else {
        break
      }
    }
  }

  frames.push(snap(arr, arr.map((_, i): [number, BarState] => [i, 'sorted']), 'Sorted!'))
  return decimateFrames(frames)
}
