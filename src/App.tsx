import { Sun, Moon } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { SortingPage } from '@/pages/SortingPage'
import { SearchingPage } from '@/pages/SearchingPage'
import { useTheme } from '@/hooks/useTheme'

export default function App() {
  const { theme, toggle } = useTheme()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Tabs defaultValue="sorting" className="flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-border px-4 py-3 flex items-center gap-4">
          <div>
            <span className="text-lg font-bold tracking-tight text-primary">AlgoRhythm</span>
            <span className="ml-1.5 text-xs text-muted-foreground hidden sm:inline">
              Watch algorithms compete
            </span>
          </div>
          <TabsList className="ml-auto">
            <TabsTrigger value="sorting">Sorting</TabsTrigger>
            <TabsTrigger value="searching">Searching</TabsTrigger>
          </TabsList>
          <button
            onClick={toggle}
            title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            className="flex items-center justify-center w-8 h-8 rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </header>

        <TabsContent value="sorting" className="flex-1 mt-0">
          <SortingPage />
        </TabsContent>
        <TabsContent value="searching" className="flex-1 mt-0">
          <SearchingPage />
        </TabsContent>
      </Tabs>
    </div>
  )
}
