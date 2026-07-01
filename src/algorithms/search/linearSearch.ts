import type { ArraySearchFrame, ArraySearchState } from '@/types'
import { decimateFrames } from '@/lib/utils'

function snap(values: number[], target: number, highlights: [number, ArraySearchState][], label?: string): ArraySearchFrame {
  return { values, target, highlights: new Map(highlights), label }
}

export function generateFrames(values: number[], target: number): ArraySearchFrame[] {
  const frames: ArraySearchFrame[] = []
  const eliminated: number[] = []

  for (let i = 0; i < values.length; i++) {
    const hl: [number, ArraySearchState][] = [
      ...eliminated.map((e): [number, ArraySearchState] => [e, 'eliminated']),
      [i, 'active'],
    ]
    frames.push(snap(values, target, hl, `Checking [${i}] = ${values[i]}`))

    if (values[i] === target) {
      frames.push(snap(values, target, [
        ...eliminated.map((e): [number, ArraySearchState] => [e, 'eliminated']),
        [i, 'found'],
      ], `Found ${target} at index ${i}!`))
      return decimateFrames(frames)
    }
    eliminated.push(i)
  }

  frames.push(snap(values, target,
    values.map((_, i): [number, ArraySearchState] => [i, 'eliminated']),
    `${target} not found`
  ))
  return decimateFrames(frames)
}
