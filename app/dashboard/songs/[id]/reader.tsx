'use client'

import { useActionState, useState } from 'react'
import {
  importLyrics,
  saveSongText,
  type SongEditState,
} from '@/app/actions'
import type { Song } from '@/lib/database.types'

const idle: SongEditState = { status: 'idle' }

export function SongReader({ song }: { song: Song }) {
  const hasLyrics = Boolean(song.lyrics)
  const hasChords = Boolean(song.chords)

  const [view, setView] = useState<'lyrics' | 'chords'>(
    hasLyrics || !hasChords ? 'lyrics' : 'chords'
  )
  const [size, setSize] = useState(20)
  const [editing, setEditing] = useState(false)

  const [importState, importAction, importing] = useActionState(
    importLyrics,
    idle
  )
  const [saveState, saveAction, saving] = useActionState(saveSongText, idle)

  const body = view === 'chords' ? song.chords : song.lyrics

  const meta = [
    song.artist ?? 'Original',
    song.song_key ? `Key of ${song.song_key}` : null,
    song.bpm ? `${song.bpm} BPM` : null,
  ]
    .filter(Boolean)
    .join('  ·  ')

  return (
    <div className="mx-auto max-w-3xl px-5 py-6 sm:px-8">
      {/* Toolbar */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
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
            className="flex h-9 w-9 items-center justify-center rounded-md border border-line text-mute hover:text-mist"
            aria-label="Smaller text"
          >
            A−
          </button>
          <button
            onClick={() => setSize((s) => Math.min(40, s + 2))}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-line text-base text-mute hover:text-mist"
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

      <p className="mb-4 text-sm text-faint">{meta}</p>

      {/* Reader body */}
      {body ? (
        <pre
          className={`rounded-2xl border border-line bg-surface/30 p-6 leading-relaxed text-mist ${
            view === 'chords'
              ? 'overflow-x-auto font-mono'
              : 'whitespace-pre-wrap font-sans'
          }`}
          style={{ fontSize: `${size}px`, lineHeight: 1.7 }}
        >
          {body}
        </pre>
      ) : (
        <div className="rounded-2xl border border-dashed border-line bg-surface/20 p-8 text-center">
          <p className="font-serif text-xl text-cream">
            No {view} yet
          </p>
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
                  saveState.status === 'success' ? 'text-sm text-tip' : 'text-sm text-live'
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
