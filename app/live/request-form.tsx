'use client'

import {
  useActionState,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react'
import { submitSongRequest, type RequestState } from '@/app/actions'

const initialState: RequestState = { status: 'idle' }

export type SongOption = {
  title: string
  artist: string | null
  type: string
}

const inputClass =
  'w-full rounded-lg border border-line bg-surface/70 px-4 py-3.5 text-mist outline-none transition-colors placeholder:text-faint focus:border-gold focus:ring-1 focus:ring-gold/40'

export function RequestForm({
  gigId,
  songs,
}: {
  gigId: string
  songs: SongOption[]
}) {
  const [state, formAction, pending] = useActionState(
    submitSongRequest,
    initialState
  )
  const [query, setQuery] = useState('')
  const [artist, setArtist] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const formRef = useRef<HTMLFormElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (state.status === 'success') {
      formRef.current?.reset()
      setQuery('')
      setArtist('')
      setOpen(false)
    }
  }, [state])

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return songs
      .map((s) => {
        const t = s.title.toLowerCase()
        const a = (s.artist ?? '').toLowerCase()
        let score = -1
        if (t.startsWith(q)) score = 0
        else if (t.includes(q)) score = 1
        else if (a.startsWith(q)) score = 2
        else if (a.includes(q)) score = 3
        return { s, score }
      })
      .filter((x) => x.score >= 0)
      .sort((a, b) => a.score - b.score)
      .slice(0, 6)
      .map((x) => x.s)
  }, [query, songs])

  function choose(s: SongOption) {
    setQuery(s.title)
    setArtist(s.artist ?? '')
    setOpen(false)
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (!open || matches.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => (i + 1) % matches.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => (i - 1 + matches.length) % matches.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      choose(matches[active])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-3">
      <input type="hidden" name="gigId" value={gigId} />
      <input type="hidden" name="songTitle" value={query} />
      <input type="hidden" name="artist" value={artist} />

      <div ref={boxRef} className="relative">
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setArtist('')
            setOpen(true)
            setActive(0)
          }}
          onFocus={() => query.trim() && setOpen(true)}
          onKeyDown={onKeyDown}
          autoComplete="off"
          placeholder="Start typing a song…"
          className={inputClass}
        />
        {artist && !open ? (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-faint">
            by {artist}
          </span>
        ) : null}

        {open && matches.length > 0 ? (
          <ul className="absolute z-30 mt-1 w-full overflow-hidden rounded-lg border border-line bg-surface shadow-xl shadow-black/40">
            {matches.map((s, i) => (
              <li key={`${s.title}-${s.artist ?? ''}`}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => choose(s)}
                  className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors ${
                    i === active ? 'bg-gold/10' : 'hover:bg-surface-2'
                  }`}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm text-mist">
                      {s.title}
                    </span>
                    <span className="block truncate text-xs text-faint">
                      {s.artist ?? 'Original'}
                    </span>
                  </span>
                  {s.type === 'original' ? (
                    <span className="shrink-0 rounded bg-gold/15 px-1.5 py-0.5 text-[0.55rem] font-bold uppercase tracking-[0.1em] text-gold">
                      Original
                    </span>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <input
        name="requesterName"
        placeholder="Your name (optional)"
        className={inputClass}
      />

      {state.status === 'success' && (
        <p className="rounded-lg border border-tip/40 bg-tip/10 px-4 py-2.5 text-center text-sm text-tip">
          {state.message}
        </p>
      )}
      {state.status === 'error' && (
        <p className="rounded-lg border border-live/40 bg-live/10 px-4 py-2.5 text-center text-sm text-live">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-gold py-4 text-sm font-bold uppercase tracking-[0.16em] text-ink transition-colors hover:bg-gold-bright disabled:opacity-60"
      >
        <span aria-hidden>♪</span>
        {pending ? 'Sending…' : 'Send Request'}
      </button>
    </form>
  )
}
