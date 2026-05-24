'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import {
  importLyrics,
  saveSongText,
  type SongEditState,
} from '@/app/actions'
import type { Song } from '@/lib/database.types'

const idle: SongEditState = { status: 'idle' }

/* ----------------------------- Transpose ---------------------------- */

const SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const FLAT_TO_SHARP: Record<string, string> = {
  Db: 'C#',
  Eb: 'D#',
  Gb: 'F#',
  Ab: 'G#',
  Bb: 'A#',
}
const CHORD_RE =
  /^[A-G][#b]?(?:m|min|maj|dim|aug|sus|add|M|\+)?\d{0,2}(?:sus|add)?\d{0,2}(?:\/[A-G][#b]?)?$/

function transposeNote(note: string, semis: number) {
  const n = FLAT_TO_SHARP[note] ?? note
  const i = SHARP.indexOf(n)
  if (i < 0) return note
  return SHARP[(i + semis + 120) % 12]
}

function transposeToken(token: string, semis: number) {
  return token
    .split('/')
    .map((part) => {
      const m = part.match(/^([A-G][#b]?)(.*)$/)
      if (!m) return part
      return transposeNote(m[1], semis) + m[2]
    })
    .join('/')
}

function isChordLine(line: string) {
  const t = line.trim()
  if (!t || t.startsWith('[')) return false
  return t.split(/\s+/).every((tok) => CHORD_RE.test(tok))
}

function transposeChart(text: string, semis: number) {
  if (!semis) return text
  return text
    .split('\n')
    .map((line) =>
      isChordLine(line)
        ? line.replace(/\S+/g, (tok) => transposeToken(tok, semis))
        : line
    )
    .join('\n')
}

function offsetLabel(n: number) {
  if (n === 0) return '±0'
  return n > 0 ? `+${n}` : `${n}`
}

/* ------------------------------ Reader ------------------------------ */

export function SongReader({ song }: { song: Song }) {
  const hasLyrics = Boolean(song.lyrics)
  const hasChords = Boolean(song.chords)

  const [view, setView] = useState<'lyrics' | 'chords'>(
    hasLyrics || !hasChords ? 'lyrics' : 'chords'
  )
  const [size, setSize] = useState(20)
  const [editing, setEditing] = useState(false)
  const [transpose, setTranspose] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(40)

  const scrollRef = useRef<HTMLPreElement>(null)
  const posRef = useRef(0)

  const [importState, importAction, importing] = useActionState(
    importLyrics,
    idle
  )
  const [saveState, saveAction, saving] = useActionState(saveSongText, idle)

  // Teleprompter autoscroll
  useEffect(() => {
    if (!playing) return
    const el = scrollRef.current
    if (!el) return
    posRef.current = el.scrollTop
    let last = performance.now()
    let raf = 0
    const step = (now: number) => {
      const dt = (now - last) / 1000
      last = now
      posRef.current += speed * dt
      el.scrollTop = posRef.current
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 1) {
        setPlaying(false)
        return
      }
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [playing, speed])

  // Stop scrolling when switching to the editor
  useEffect(() => {
    if (editing) setPlaying(false)
  }, [editing])

  const rawBody = view === 'chords' ? song.chords : song.lyrics
  const body =
    view === 'chords' && rawBody ? transposeChart(rawBody, transpose) : rawBody

  const meta = [
    song.artist ?? 'Original',
    song.song_key ? `Key of ${song.song_key}` : null,
    song.bpm ? `${song.bpm} BPM` : null,
  ]
    .filter(Boolean)
    .join('  ·  ')

  const btn =
    'flex h-9 items-center justify-center rounded-md border border-line px-2.5 text-mute transition-colors hover:text-mist'

  return (
    <div className="mx-auto max-w-3xl px-5 py-6 sm:px-8">
      {/* Toolbar */}
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <div className="flex rounded-md border border-line p-0.5 text-xs font-semibold uppercase tracking-[0.1em]">
          <button
            onClick={() => setView('lyrics')}
            className={`rounded px-3 py-1.5 transition-colors ${
              view === 'lyrics' ? 'bg-gold text-ink' : 'text-mute hover:text-mist'
            }`}
          >
            Lyrics
          </button>
          <button
            onClick={() => hasChords && setView('chords')}
            disabled={!hasChords}
            className={`rounded px-3 py-1.5 transition-colors ${
              view === 'chords'
                ? 'bg-gold text-ink'
                : hasChords
                  ? 'text-mute hover:text-mist'
                  : 'cursor-not-allowed text-faint/50'
            }`}
          >
            Chords
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setSize((s) => Math.max(14, s - 2))}
            className={btn}
            aria-label="Smaller text"
          >
            A−
          </button>
          <button
            onClick={() => setSize((s) => Math.min(44, s + 2))}
            className={`${btn} text-base`}
            aria-label="Larger text"
          >
            A+
          </button>
        </div>

        <button
          onClick={() => setEditing((e) => !e)}
          className="ml-auto rounded-md border border-line px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-mute transition-colors hover:text-mist"
        >
          {editing ? 'Close editor' : '✎ Edit'}
        </button>
      </div>

      {/* Secondary controls: autoscroll + transpose */}
      {body && !editing ? (
        <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border border-line/70 bg-surface/30 px-3 py-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPlaying((p) => !p)}
              className={`flex h-9 items-center gap-2 rounded-md px-3 text-xs font-bold uppercase tracking-[0.1em] transition-colors ${
                playing
                  ? 'bg-gold text-ink'
                  : 'border border-line text-mute hover:text-mist'
              }`}
            >
              {playing ? '⏸ Pause' : '▶ Auto-scroll'}
            </button>
            <span className="text-[0.62rem] uppercase tracking-[0.12em] text-faint">
              Speed
            </span>
            <button
              onClick={() => setSpeed((s) => Math.max(10, s - 10))}
              className={btn}
              aria-label="Slower"
            >
              −
            </button>
            <span className="w-8 text-center text-xs text-mist">
              {(speed / 40).toFixed(1)}×
            </span>
            <button
              onClick={() => setSpeed((s) => Math.min(160, s + 10))}
              className={btn}
              aria-label="Faster"
            >
              +
            </button>
          </div>

          {view === 'chords' ? (
            <div className="flex items-center gap-2">
              <span className="text-[0.62rem] uppercase tracking-[0.12em] text-faint">
                Transpose
              </span>
              <button
                onClick={() => setTranspose((t) => Math.max(-11, t - 1))}
                className={btn}
                aria-label="Down a semitone"
              >
                ♭
              </button>
              <span className="w-8 text-center text-xs font-semibold text-gold">
                {offsetLabel(transpose)}
              </span>
              <button
                onClick={() => setTranspose((t) => Math.min(11, t + 1))}
                className={btn}
                aria-label="Up a semitone"
              >
                ♯
              </button>
              {transpose !== 0 ? (
                <button
                  onClick={() => setTranspose(0)}
                  className="text-[0.62rem] uppercase tracking-[0.1em] text-faint hover:text-mist"
                >
                  Reset
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}

      <p className="mb-4 text-sm text-faint">{meta}</p>

      {/* Reader body */}
      {body ? (
        <pre
          ref={scrollRef}
          className={`max-h-[68vh] overflow-y-auto overscroll-contain rounded-2xl border border-line bg-surface/30 p-6 text-mist ${
            view === 'chords' ? 'font-mono' : 'whitespace-pre-wrap font-sans'
          }`}
          style={{ fontSize: `${size}px`, lineHeight: 1.7 }}
        >
          {body}
        </pre>
      ) : (
        <div className="rounded-2xl border border-dashed border-line bg-surface/20 p-8 text-center">
          <p className="font-serif text-xl text-cream">No {view} yet</p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-mute">
            {view === 'lyrics'
              ? 'Import them automatically from the artist + title, or paste them in the editor.'
              : 'Open the editor to paste a chord chart for this song.'}
          </p>
          {view === 'lyrics' && song.artist ? (
            <form action={importAction} className="mt-5">
              <input type="hidden" name="songId" value={song.id} />
              <button
                disabled={importing}
                className="rounded-md bg-gold px-5 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-gold-bright disabled:opacity-60"
              >
                {importing ? 'Importing…' : '⤓ Import lyrics'}
              </button>
            </form>
          ) : null}
        </div>
      )}

      {importState.status !== 'idle' && (
        <p
          className={`mt-3 rounded-lg border px-4 py-2.5 text-sm ${
            importState.status === 'success'
              ? 'border-tip/40 bg-tip/10 text-tip'
              : 'border-live/40 bg-live/10 text-live'
          }`}
        >
          {importState.message}
        </p>
      )}

      {/* Editor */}
      {editing && (
        <form
          action={saveAction}
          className="mt-6 space-y-4 rounded-2xl border border-line bg-ink-2/50 p-5"
        >
          <input type="hidden" name="songId" value={song.id} />
          <div>
            <label className="mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-faint">
              Lyrics
            </label>
            <textarea
              name="lyrics"
              defaultValue={song.lyrics ?? ''}
              rows={10}
              placeholder="Paste lyrics…"
              className="w-full rounded-lg border border-line bg-surface/70 p-3.5 font-sans text-sm text-mist outline-none focus:border-gold focus:ring-1 focus:ring-gold/40"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-faint">
              Chords (optional) — monospace, chords above the words
            </label>
            <textarea
              name="chords"
              defaultValue={song.chords ?? ''}
              rows={10}
              placeholder={'Capo 2 — Key of G\n\nG          C\nFirst line of the verse…'}
              className="w-full rounded-lg border border-line bg-surface/70 p-3.5 font-mono text-sm text-mist outline-none focus:border-gold focus:ring-1 focus:ring-gold/40"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              disabled={saving}
              className="rounded-md bg-gold px-5 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-gold-bright disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
            {saveState.status !== 'idle' && (
              <span
                className={
                  saveState.status === 'success'
                    ? 'text-sm text-tip'
                    : 'text-sm text-live'
                }
              >
                {saveState.message}
              </span>
            )}
          </div>
        </form>
      )}
    </div>
  )
}
