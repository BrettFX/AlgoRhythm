import type { ArraySearchFrame, ArraySearchState } from '@/types'
import { decimateFrames } from '@/lib/utils'

function snap(values: number[], target: number, highlights: [number, ArraySearchState][], label?: string): ArraySearchFrame {
  return { values, target, highlights: new Map(highlights), label }
}

export function generateFrames(values: number[], target: number): ArraySearchFrame[] {
  const frames: ArraySearchFrame[] = []
  const n = values.length
  const step = Math.floor(Math.sqrt(n))
  let prev = 0

  // Jump phase
  while (prev < n && values[Math.min(prev + step, n) - 1] < target) {
    const blockEnd = Math.min(prev + step, n) - 1
    const hl: [number, ArraySearchState][] = []
    for (let i = 0; i < prev; i++) hl.push([i, 'eliminated'])
    for (let i = prev; i <= blockEnd; i++) hl.push([i, i === blockEnd ? 'active' : 'in-range'])
    frames.push(snap(values, target, hl, `Jump: block end [${blockEnd}]=${values[blockEnd]} < ${target}`))
    prev += step
  }

  // Linear phase within block
  const blockStart = prev
  const blockEnd = Math.min(prev + step, n)
  for (let i = blockStart; i < blockEnd; i++) {
    const hl: [number, ArraySearchState][] = []
    for (let k = 0; k < blockStart; k++) hl.push([k, 'eliminated'])
    for (let k = blockStart; k < blockEnd; k++) {
      if (k < i) hl.push([k, 'eliminated'])
      else if (k === i) hl.push([k, 'active'])
      else hl.push([k, 'in-range'])
    }
    for (let k = blockEnd; k < n; k++) hl.push([k, 'eliminated'])
    frames.push(snap(values, target, hl, `Linear scan: [${i}]=${values[i]}`))

    if (values[i] === target) {
      hl[i - blockStart + hl.filter(([, s]) => s === 'eliminated').length] = [i, 'found']
      const foundHl: [number, ArraySearchState][] = values.map((_, k) => {
        if (k === i) return [k, 'found']
        if (k < i) return [k, 'eliminated']
        return [k, 'in-range']
      })
      frames.push(snap(values, target, foundHl, `Found ${target} at index ${i}!`))
      return decimateFrames(frames)
    }
    if (values[i] > target) break
  }

  frames.push(snap(values, target,
    values.map((_, i): [number, ArraySearchState] => [i, 'eliminated']),
    `${target} not found`
  ))
  return decimateFrames(frames)
}
