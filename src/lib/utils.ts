import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateArray(size: number): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 95) + 5)
}

/** Generates a sorted array with `target` guaranteed to be present. */
export function generateSortedArray(size: number, target?: number): { values: number[]; target: number } {
  const arr = Array.from({ length: size - 1 }, () => Math.floor(Math.random() * 95) + 5)
  const t = target ?? Math.floor(Math.random() * 95) + 5
  arr.push(t)
  arr.sort((a, b) => a - b)
  return { values: arr, target: t }
}

const FRAME_BUDGET = 2000

/** Decimates a frame array to at most FRAME_BUDGET entries. */
export function decimateFrames<T>(frames: T[]): T[] {
  if (frames.length <= FRAME_BUDGET) return frames
  const step = frames.length / FRAME_BUDGET
  const result: T[] = []
  for (let i = 0; i < FRAME_BUDGET; i++) {
    result.push(frames[Math.floor(i * step)])
  }
  // Always include the last frame
  result[result.length - 1] = frames[frames.length - 1]
  return result
}
