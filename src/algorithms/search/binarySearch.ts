import type { ArraySearchFrame, ArraySearchState } from '@/types'
import { decimateFrames } from '@/lib/utils'

function snap(
  values: number[], target: number,
  highlights: [number, ArraySearchState][],
  low: number, high: number, label?: string
): ArraySearchFrame {
  return { values, target, highlights: new Map(highlights), low, high, label }
}

export function generateFrames(values: number[], target: number): ArraySearchFrame[] {
  const frames: ArraySearchFrame[] = []
  const n = values.length
  let lo = 0, hi = n - 1

  while (lo <= hi) {
    const mid = (lo + hi) >> 1

    const hl: [number, ArraySearchState][] = []
    for (let i = 0; i < n; i++) {
      if (i < lo || i > hi) hl.push([i, 'eliminated'])
      else if (i === mid) hl.push([i, 'active'])
      else hl.push([i, 'in-range'])
    }
    frames.push(snap(values, target, hl, lo, hi, `lo=${lo} mid=${mid} hi=${hi}, checking ${values[mid]}`))

    if (values[mid] === target) {
      const foundHl: [number, ArraySearchState][] = values.map((_, i) => {
        if (i === mid) return [i, 'found']
        if (i < lo || i > hi) return [i, 'eliminated']
        return [i, 'in-range']
      })
      frames.push(snap(values, target, foundHl, lo, hi, `Found ${target} at index ${mid}!`))
      return decimateFrames(frames)
    } else if (values[mid] < target) {
      lo = mid + 1
    } else {
      hi = mid - 1
    }
  }

  frames.push(snap(values, target,
    values.map((_, i): [number, ArraySearchState] => [i, 'eliminated']),
    lo, hi, `${target} not found`
  ))
  return decimateFrames(frames)
}
