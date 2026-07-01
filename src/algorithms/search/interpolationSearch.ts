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

  while (lo <= hi && target >= values[lo] && target <= values[hi]) {
    if (lo === hi) {
      if (values[lo] === target) {
        frames.push(snap(values, target, [[lo, 'found']], lo, hi, `Found ${target} at index ${lo}!`))
      } else {
        frames.push(snap(values, target,
          values.map((_, i): [number, ArraySearchState] => [i, 'eliminated']), lo, hi, `${target} not found`
        ))
      }
      return decimateFrames(frames)
    }

    const range = values[hi] - values[lo]
    let pos: number
    if (range === 0) {
      pos = lo
    } else {
      pos = lo + Math.floor(((target - values[lo]) / range) * (hi - lo))
    }
    pos = Math.max(lo, Math.min(hi, pos))

    const hl: [number, ArraySearchState][] = values.map((_, i) => {
      if (i < lo || i > hi) return [i, 'eliminated']
      if (i === pos) return [i, 'active']
      return [i, 'in-range']
    })
    frames.push(snap(values, target, hl, lo, hi,
      `Interpolated pos=${pos}, val=${values[pos]} (lo=${lo}, hi=${hi})`
    ))

    if (values[pos] === target) {
      frames.push(snap(values, target,
        values.map((_, i): [number, ArraySearchState] => i === pos ? [i, 'found'] : i < lo || i > hi ? [i, 'eliminated'] : [i, 'in-range']),
        lo, hi, `Found ${target} at index ${pos}!`
      ))
      return decimateFrames(frames)
    }

    if (values[pos] < target) lo = pos + 1
    else hi = pos - 1
  }

  frames.push(snap(values, target,
    values.map((_, i): [number, ArraySearchState] => [i, 'eliminated']),
    lo, hi, `${target} not found`
  ))
  return decimateFrames(frames)
}
