import { useMemo, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Copy, Check, Maximize2, X } from 'lucide-react'
import type { Language } from '@/types'
import { useShiki } from '@/hooks/useShiki'
import { useIsDark } from '@/hooks/useIsDark'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

const LANG_LABELS: Record<Language, string> = {
  python: 'Python',
  javascript: 'JavaScript',
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

// ── Highlighted code block ─────────────────────────────────────

interface HighlightedCodeProps {
  code: string
  lang: Language
  isDark: boolean
  className?: string
}

function HighlightedCode({ code, lang, isDark, className }: HighlightedCodeProps) {
  const hl = useShiki()
  const shikiTheme = isDark ? 'github-dark' : 'github-light'

  const html = useMemo(() => {
    if (!hl) return null
    return hl.codeToHtml(code, { lang: SHIKI_LANG[lang], theme: shikiTheme })
  }, [hl, code, lang, shikiTheme])

  if (!html) {
    return (
      <pre className={cn('text-xs text-muted-foreground p-4 overflow-auto h-full', className)}>
        <code>{code}</code>
      </pre>
    )
  }

  return (
    <div
      className={cn(
        'text-xs overflow-auto h-full [&>pre]:p-4 [&>pre]:h-full [&>pre]:!bg-transparent',
        '[&>pre>code]:block [&>pre>code]:leading-5',
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

// ── Copy button ────────────────────────────────────────────────

function CopyButton({ code, className }: { code: string; className?: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <button
      onClick={handleCopy}
      title={copied ? 'Copied!' : 'Copy code'}
      className={cn(
        'flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-colors',
        copied
          ? 'text-success bg-success/10'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted/60',
        className
      )}
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}

// ── Fullscreen modal ───────────────────────────────────────────

interface CodeModalProps {
  open: boolean
  onClose: () => void
  snippets: Record<Language, string>
  title?: string
}

function CodeModal({ open, onClose, snippets, title }: CodeModalProps) {
  const [activeLang, setActiveLang] = useState<Language>('python')
  const isDark = useIsDark()
  const codeBg = isDark ? '#0d1117' : '#ffffff'

  return (
    <Dialog.Root open={open} onOpenChange={v => { if (!v) onClose() }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          className={cn(
            'fixed z-50 left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]',
            'w-[90vw] max-w-4xl h-[80vh] flex flex-col',
            'rounded-xl border border-border shadow-2xl',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'data-[state=closed]:slide-out-to-left-1/2 data-[state=open]:slide-in-from-left-1/2',
            'data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-top-[48%]',
          )}
          style={{ backgroundColor: codeBg }}
        >
          {/* Modal header */}
          <div
            className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0"
            style={{ backgroundColor: codeBg }}
          >
            <div className="flex items-center gap-3">
              <Dialog.Title className="text-sm font-semibold" style={{ color: isDark ? '#e6edf3' : '#1f2328' }}>
                {title ?? 'Code'}
              </Dialog.Title>
              <div className="flex gap-0.5 bg-black/10 rounded p-0.5">
                {LANGUAGES.map(lang => (
                  <button
                    key={lang}
                    onClick={() => setActiveLang(lang)}
                    className={cn(
                      'px-3 py-1 text-xs rounded font-medium transition-colors',
                      activeLang === lang
                        ? isDark ? 'bg-white/10 text-white' : 'bg-black/10 text-gray-900'
                        : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                    )}
                  >
                    {LANG_LABELS[lang]}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CopyButton code={snippets[activeLang]} />
              <Dialog.Close asChild>
                <button
                  className={cn(
                    'flex items-center justify-center w-7 h-7 rounded transition-colors',
                    isDark
                      ? 'text-gray-400 hover:text-white hover:bg-white/10'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-black/10'
                  )}
                  title="Close"
                >
                  <X size={15} />
                </button>
              </Dialog.Close>
            </div>
          </div>

          {/* Modal code body */}
          <div className="flex-1 min-h-0">
            <HighlightedCode
              code={snippets[activeLang]}
              lang={activeLang}
              isDark={isDark}
              className="[&>pre]:!text-sm [&>pre>code]:!leading-6 h-full"
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

// ── Main CodePanel ─────────────────────────────────────────────

interface CodePanelProps {
  snippets: Record<Language, string>
  algorithmName?: string
  className?: string
}

export function CodePanel({ snippets, algorithmName, className }: CodePanelProps) {
  const [activeLang, setActiveLang] = useState<Language>('python')
  const [modalOpen, setModalOpen] = useState(false)
  const isDark = useIsDark()
  const codeBg = isDark ? '#0d1117' : '#ffffff'

  return (
    <>
      <Tabs
        value={activeLang}
        onValueChange={v => setActiveLang(v as Language)}
        className={cn('flex flex-col h-full', className)}
      >
        {/* Tab bar + action buttons */}
        <div className="shrink-0 flex items-center bg-muted/50 rounded-t-md border border-border border-b-0">
          <TabsList className="flex-1 flex justify-start gap-0 bg-transparent p-0.5">
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
          {/* Action buttons */}
          <div className="flex items-center gap-0.5 pr-1">
            <CopyButton code={snippets[activeLang]} />
            <button
              onClick={() => setModalOpen(true)}
              title="View fullscreen"
              className="flex items-center justify-center w-7 h-7 rounded text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
            >
              <Maximize2 size={12} />
            </button>
          </div>
        </div>

        {/* Code content */}
        {LANGUAGES.map(lang => (
          <TabsContent
            key={lang}
            value={lang}
            className="flex-1 overflow-hidden mt-0 rounded-b-md border border-border border-t-0 min-h-0"
            style={{ backgroundColor: codeBg }}
          >
            <HighlightedCode code={snippets[lang]} lang={lang} isDark={isDark} />
          </TabsContent>
        ))}
      </Tabs>

      <CodeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        snippets={snippets}
        title={algorithmName ? `${algorithmName} — Code` : 'Code'}
      />
    </>
  )
}
