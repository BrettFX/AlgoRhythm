import { useState, useEffect, useRef, useCallback } from 'react'
import type { ArraySearchFrame, GridFrame, PlaybackStatus } from '@/types'

type SearchFrame = ArraySearchFrame | GridFrame

export interface UseSearchResult<F extends SearchFrame> {
  currentFrameIndex: number
  currentFrame: F | null
  totalFrames: number
  status: PlaybackStatus
  play: () => void
  pause: () => void
  reset: () => void
}

export function useSearch<F extends SearchFrame>(
  frames: F[],
  speedMs: number
): UseSearchResult<F> {
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

  // Reset when frames identity changes (new array/grid)
  useEffect(() => {
    clearTimer()
    setFrameIndex(0)
    frameIndexRef.current = 0
    setStatus('idle')
  }, [frames])

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
    currentFrameIndex: frameIndex,
    currentFrame: frames[frameIndex] ?? null,
    totalFrames: frames.length,
    status,
    play,
    pause,
    reset,
  }
}
