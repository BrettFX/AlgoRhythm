import { useState, useRef, useCallback } from 'react'
import { Shuffle, Play, Square, Eraser, Gauge } from 'lucide-react'
import { ARRAY_SEARCH_META, GRAPH_SEARCH_META } from '@/data/searchAlgorithmMeta'
import { ArraySearchCard, GraphSearchCard } from '@/components/SearchCard'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { generateSortedArray } from '@/lib/utils'
import { generateMaze, cloneGrid } from '@/lib/mazeGenerator'
import type { Grid } from '@/types'

const GRID_ROWS = 15
const GRID_COLS = 22

function speedLabel(ms: number): string {
  if (ms >= 800) return '0.5×'
  if (ms >= 400) return '1×'
  if (ms >= 150) return '2×'
  if (ms >= 70) return '4×'
  return '8×'
}

export function SearchingPage() {
  const [arrayData, setArrayData] = useState(() => generateSortedArray(24))
  const [speedMs, setSpeedMs] = useState(200)
  const [grid, setGrid] = useState<Grid>(() => generateMaze(GRID_ROWS, GRID_COLS))
  const [playAllArrayActive, setPlayAllArrayActive] = useState(false)
  const [playAllGraphActive, setPlayAllGraphActive] = useState(false)

  const arrayDoneRef = useRef(new Set<string>())
  const arrayOrderRef = useRef<string[]>([])
  const [arrayRankMap, setArrayRankMap] = useState<Record<string, number>>({})

  const graphDoneRef = useRef(new Set<string>())
  const graphOrderRef = useRef<string[]>([])
  const [graphRankMap, setGraphRankMap] = useState<Record<string, number>>({})

  const regenerateArray = useCallback(() => {
    arrayDoneRef.current.clear(); arrayOrderRef.current = []
    setArrayRankMap({}); setPlayAllArrayActive(false)
    setArrayData(generateSortedArray(24))
  }, [])

  const handlePlayAllArray = useCallback(() => {
    arrayDoneRef.current.clear(); arrayOrderRef.current = []
    setArrayRankMap({}); setPlayAllArrayActive(true)
  }, [])

  const handleArrayCardDone = useCallback((id: string) => {
    if (arrayDoneRef.current.has(id)) return
    arrayDoneRef.current.add(id)
    arrayOrderRef.current.push(id)
    setArrayRankMap(prev => ({ ...prev, [id]: arrayOrderRef.current.length - 1 }))
    if (arrayDoneRef.current.size === ARRAY_SEARCH_META.length) setPlayAllArrayActive(false)
  }, [])

  const regenerateGrid = useCallback(() => {
    graphDoneRef.current.clear(); graphOrderRef.current = []
    setGraphRankMap({}); setPlayAllGraphActive(false)
    setGrid(generateMaze(GRID_ROWS, GRID_COLS))
  }, [])

  const clearWalls = useCallback(() => {
    setGrid(prev => prev.map((row, r) =>
      row.map((cell, c) => {
        if (r === 0 && c === 0) return 'start'
        if (r === GRID_ROWS - 1 && c === GRID_COLS - 1) return 'goal'
        return cell === 'wall' ? 'empty' : cell
      })
    ))
  }, [])

  const handlePlayAllGraph = useCallback(() => {
    graphDoneRef.current.clear(); graphOrderRef.current = []
    setGraphRankMap({}); setPlayAllGraphActive(true)
  }, [])

  const handleGraphCardDone = useCallback((id: string) => {
    if (graphDoneRef.current.has(id)) return
    graphDoneRef.current.add(id)
    graphOrderRef.current.push(id)
    setGraphRankMap(prev => ({ ...prev, [id]: graphOrderRef.current.length - 1 }))
    if (graphDoneRef.current.size === GRAPH_SEARCH_META.length) setPlayAllGraphActive(false)
  }, [])

  const handleToggleWall = useCallback((r: number, c: number) => {
    setGrid(prev => {
      const next = cloneGrid(prev)
      if (next[r][c] === 'empty') next[r][c] = 'wall'
      else if (next[r][c] === 'wall') next[r][c] = 'empty'
      return next
    })
    // Reset graph cards when grid changes
    graphDoneRef.current.clear(); graphOrderRef.current = []
    setGraphRankMap({}); setPlayAllGraphActive(false)
  }, [])

  const sliderToMs = (v: number) => Math.round(1600 - v * 15.8)
  const msToSlider = (ms: number) => Math.round((1600 - ms) / 15.8)

  return (
    <>
      {/* Sticky controls */}
      <div className="sticky top-[57px] z-10 bg-background/90 backdrop-blur border-b border-border px-4 py-3 flex flex-wrap gap-6">
        {/* Array controls */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-medium text-muted-foreground">Array Search</span>
          <div className="flex items-center gap-2">
            <Gauge size={13} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{speedLabel(speedMs)}</span>
            <Slider min={0} max={100} step={1} value={[msToSlider(speedMs)]}
              onValueChange={([v]) => setSpeedMs(sliderToMs(v))} className="w-20" />
          </div>
          <Button variant="outline" size="sm" onClick={regenerateArray} className="gap-1.5">
            <Shuffle size={13} /> Regenerate
          </Button>
          <Button variant={playAllArrayActive ? 'destructive' : 'default'} size="sm"
            onClick={handlePlayAllArray} className="gap-1.5">
            {playAllArrayActive ? <><Square size={13} /> Stop</> : <><Play size={13} /> Play All</>}
          </Button>
        </div>

        <div className="w-px bg-border h-6 self-center hidden sm:block" />

        {/* Graph controls */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-medium text-muted-foreground">Graph Search</span>
          <Button variant="outline" size="sm" onClick={regenerateGrid} className="gap-1.5">
            <Shuffle size={13} /> New Maze
          </Button>
          <Button variant="outline" size="sm" onClick={clearWalls} className="gap-1.5">
            <Eraser size={13} /> Clear Walls
          </Button>
          <Button variant={playAllGraphActive ? 'destructive' : 'default'} size="sm"
            onClick={handlePlayAllGraph} className="gap-1.5">
            {playAllGraphActive ? <><Square size={13} /> Stop</> : <><Play size={13} /> Play All</>}
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-8">
        {/* Array Search section */}
        <section>
          <h2 className="text-base font-semibold mb-3 text-foreground/80">Array Search Algorithms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {ARRAY_SEARCH_META.map(meta => (
              <ArraySearchCard
                key={meta.id}
                meta={meta}
                values={arrayData.values}
                target={arrayData.target}
                speedMs={speedMs}
                isPlayAllActive={playAllArrayActive}
                rank={arrayRankMap[meta.id]}
                onDone={() => handleArrayCardDone(meta.id)}
              />
            ))}
          </div>
        </section>

        {/* Graph Search section */}
        <section>
          <h2 className="text-base font-semibold mb-1 text-foreground/80">Graph Search Algorithms</h2>
          <p className="text-xs text-muted-foreground mb-3">
            All three algorithms run on the same maze. Click or drag cells to draw/erase walls when idle.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {GRAPH_SEARCH_META.map(meta => (
              <GraphSearchCard
                key={meta.id}
                meta={meta}
                grid={grid}
                rows={GRID_ROWS}
                cols={GRID_COLS}
                speedMs={speedMs}
                isPlayAllActive={playAllGraphActive}
                rank={graphRankMap[meta.id]}
                onDone={() => handleGraphCardDone(meta.id)}
                onToggleWall={handleToggleWall}
              />
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
