import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import type { AlgorithmMeta, SortFrame, PlaybackStatus } from '@/types'

export interface UseSortResult {
  frames: SortFrame[]
  currentFrameIndex: number
  currentFrame: SortFrame | null
  status: PlaybackStatus
  play: () => void
  pause: () => void
  reset: () => void
}

export function useSort(
  meta: AlgorithmMeta,
  array: number[],
  speedMs: number
): UseSortResult {
  const frames = useMemo(() => meta.generate(array), [meta, array])
  const [frameIndex, setFrameIndex] = useState(0)
  const [status, setStatus] = useState<PlaybackStatus>('idle')
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const frameIndexRef = useRef(0)

  const clearTimer = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  // Reset when array changes
  useEffect(() => {
    clearTimer()
    setFrameIndex(0)
    frameIndexRef.current = 0
    setStatus('idle')
  }, [array, meta])

  // Restart interval when speed changes while playing
  useEffect(() => {
    if (status !== 'playing') return
    clearTimer()
    intervalRef.current = setInterval(() => {
      frameIndexRef.current += 1
      if (frameIndexRef.current >= frames.length - 1) {
        frameIndexRef.current = frames.length - 1
        clearTimer()
        setFrameIndex(frames.length - 1)
        setStatus('done')
      } else {
        setFrameIndex(frameIndexRef.current)
      }
    }, speedMs)
    return clearTimer
  }, [speedMs, status, frames.length])

  useEffect(() => { return clearTimer }, [])

  const play = useCallback(() => {
    if (status === 'done') return
    if (frameIndexRef.current >= frames.length - 1) return
    setStatus('playing')
    clearTimer()
    intervalRef.current = setInterval(() => {
      frameIndexRef.current += 1
      if (frameIndexRef.current >= frames.length - 1) {
        frameIndexRef.current = frames.length - 1
        clearTimer()
        setFrameIndex(frames.length - 1)
        setStatus('done')
      } else {
        setFrameIndex(frameIndexRef.current)
      }
    }, speedMs)
  }, [status, frames.length, speedMs])

  const pause = useCallback(() => {
    clearTimer()
    setStatus(s => (s === 'playing' ? 'paused' : s))
  }, [])

  const reset = useCallback(() => {
    clearTimer()
    frameIndexRef.current = 0
    setFrameIndex(0)
    setStatus('idle')
  }, [])

  return {
    frames,
    currentFrameIndex: frameIndex,
    currentFrame: frames[frameIndex] ?? null,
    status,
    play,
    pause,
    reset,
  }
}
