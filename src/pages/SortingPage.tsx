import { useState, useRef, useCallback } from 'react'
import { ALGORITHM_META } from '@/data/algorithmMeta'
import { AlgorithmCard } from '@/components/AlgorithmCard'
import { GlobalControls } from '@/components/GlobalControls'
import { generateArray } from '@/lib/utils'

export function SortingPage() {
  const [arraySize, setArraySize] = useState(50)
  const [speedMs, setSpeedMs] = useState(300)
  const [array, setArray] = useState(() => generateArray(50))
  const [playAllActive, setPlayAllActive] = useState(false)
  const doneSetRef = useRef(new Set<string>())
  const finishOrderRef = useRef<string[]>([])
  const [rankMap, setRankMap] = useState<Record<string, number>>({})

  const regenerate = useCallback(() => {
    doneSetRef.current.clear()
    finishOrderRef.current = []
    setRankMap({})
    setPlayAllActive(false)
    setArray(generateArray(arraySize))
  }, [arraySize])

  const handleArraySizeChange = useCallback((size: number) => {
    setArraySize(size)
    doneSetRef.current.clear()
    finishOrderRef.current = []
    setRankMap({})
    setPlayAllActive(false)
    setArray(generateArray(size))
  }, [])

  const handlePlayAll = useCallback(() => {
    doneSetRef.current.clear()
    finishOrderRef.current = []
    setRankMap({})
    setPlayAllActive(true)
  }, [])

  const handleCardDone = useCallback((id: string) => {
    if (doneSetRef.current.has(id)) return
    doneSetRef.current.add(id)
    finishOrderRef.current.push(id)
    setRankMap(prev => ({ ...prev, [id]: finishOrderRef.current.length - 1 }))
    if (doneSetRef.current.size === ALGORITHM_META.length) {
      setPlayAllActive(false)
    }
  }, [])

  const maxValue = Math.max(...array)

  return (
    <>
      {/* Sticky controls */}
      <div className="sticky top-[57px] z-10 bg-background/90 backdrop-blur border-b border-border px-4 py-3">
        <GlobalControls
          arraySize={arraySize}
          onArraySizeChange={handleArraySizeChange}
          speedMs={speedMs}
          onSpeedChange={setSpeedMs}
          onRegenerate={regenerate}
          onPlayAll={handlePlayAll}
          isPlayingAll={playAllActive}
        />
      </div>

      {/* Cards grid */}
      <div className="p-4 grid grid-cols-1 xl:grid-cols-2 gap-4">
        {ALGORITHM_META.map(meta => (
          <AlgorithmCard
            key={meta.id}
            meta={meta}
            array={array}
            maxValue={maxValue}
            speedMs={speedMs}
            isPlayAllActive={playAllActive}
            rank={rankMap[meta.id]}
            onDone={() => handleCardDone(meta.id)}
          />
        ))}
      </div>
    </>
  )
}
