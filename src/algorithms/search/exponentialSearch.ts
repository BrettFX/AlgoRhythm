import type { ArraySearchFrame, ArraySearchState } from '@/types'
import { decimateFrames } from '@/lib/utils'

function snap(
  values: number[], target: number,
  highlights: [number, ArraySearchState][],
  low?: number, high?: number, label?: string
): ArraySearchFrame {
  return { values, target, highlights: new Map(highlights), low, high, label }
}

export function generateFrames(values: number[], target: number): ArraySearchFrame[] {
  const frames: ArraySearchFrame[] = []
  const n = values.length

  if (values[0] === target) {
    frames.push(snap(values, target, [[0, 'found']], 0, 0, `Found ${target} at index 0!`))
    return frames
  }

  // Exponential phase: find range
  let i = 1
  while (i < n && values[i] <= target) {
    const hl: [number, ArraySearchState][] = values.map((_, k): [number, ArraySearchState] => {
      if (k < i) return [k, 'eliminated']
      if (k === i) return [k, 'active']
      return [k, 'default']
    })
    frames.push(snap(values, target, hl, undefined, undefined, `Exponential bound: [${i}]=${values[i]}, doubling…`))
    i *= 2
  }

  // Binary phase within [i/2, min(i, n-1)]
  let lo = Math.floor(i / 2)
  let hi = Math.min(i, n - 1)

  while (lo <= hi) {
    const mid = (lo + hi) >> 1
    const hl: [number, ArraySearchState][] = values.map((_, k): [number, ArraySearchState] => {
      if (k < lo || k > hi) return [k, 'eliminated']
      if (k === mid) return [k, 'active']
      return [k, 'in-range']
    })
    frames.push(snap(values, target, hl, lo, hi, `Binary phase: lo=${lo} mid=${mid} hi=${hi}`))

    if (values[mid] === target) {
      frames.push(snap(values, target,
        values.map((_, k): [number, ArraySearchState] => k === mid ? [k, 'found'] : k < lo || k > hi ? [k, 'eliminated'] : [k, 'in-range']),
        lo, hi, `Found ${target} at index ${mid}!`
      ))
      return decimateFrames(frames)
    }
    if (values[mid] < target) lo = mid + 1
    else hi = mid - 1
  }

  frames.push(snap(values, target,
    values.map((_, i): [number, ArraySearchState] => [i, 'eliminated']),
    lo, hi, `${target} not found`
  ))
  return decimateFrames(frames)
}
