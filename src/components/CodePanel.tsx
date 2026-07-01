import { useMemo, useState } from 'react'
import type { Language } from '@/types'
import { useShiki } from '@/hooks/useShiki'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

const LANG_LABELS: Record<Language, string> = {
  python: 'Python',
  javascript: 'JS',
  java: 'Java',
  rust: 'Rust',
  cpp: 'C++',
}

const SHIKI_LANG: Record<Language, string> = {
  python: 'python',
  javascript: 'javascript',
  java: 'java',
  rust: 'rust',
  cpp: 'cpp',
}

const LANGUAGES: Language[] = ['python', 'javascript', 'java', 'rust', 'cpp']

interface CodePanelProps {
  snippets: Record<Language, string>
  className?: string
}

function HighlightedCode({ code, lang }: { code: string; lang: Language }) {
  const hl = useShiki()

  const html = useMemo(() => {
    if (!hl) return null
    return hl.codeToHtml(code, { lang: SHIKI_LANG[lang], theme: 'github-dark' })
  }, [hl, code, lang])

  if (!html) {
    return (
      <pre className="text-xs text-muted-foreground p-3 overflow-auto h-full">
        <code>{code}</code>
      </pre>
    )
  }

  return (
    <div
      className={cn(
        'text-xs overflow-auto h-full [&>pre]:p-3 [&>pre]:h-full [&>pre]:!bg-transparent',
        '[&>pre>code]:block [&>pre>code]:leading-5'
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

export function CodePanel({ snippets, className }: CodePanelProps) {
  const [activeLang, setActiveLang] = useState<Language>('python')

  return (
    <Tabs
      value={activeLang}
      onValueChange={v => setActiveLang(v as Language)}
      className={cn('flex flex-col h-full', className)}
    >
      <TabsList className="shrink-0 flex justify-start gap-0.5 bg-muted/50 p-0.5 rounded-t-md rounded-b-none">
        {LANGUAGES.map(lang => (
          <TabsTrigger
            key={lang}
            value={lang}
            className="text-xs px-2 py-1 rounded-sm data-[state=active]:bg-card"
          >
            {LANG_LABELS[lang]}
          </TabsTrigger>
        ))}
      </TabsList>
      {LANGUAGES.map(lang => (
        <TabsContent
          key={lang}
          value={lang}
          className="flex-1 overflow-hidden mt-0 rounded-b-md bg-[#0d1117] border border-border border-t-0 min-h-0"
        >
          <HighlightedCode code={snippets[lang]} lang={lang} />
        </TabsContent>
      ))}
    </Tabs>
  )
}
