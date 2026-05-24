import Link from 'next/link'
import { getSongs } from '@/lib/data'
import type { Song } from '@/lib/database.types'
import { TopBar } from '../topbar'

export const dynamic = 'force-dynamic'

function SongRow({ song }: { song: Song }) {
  return (
    <li>
      <Link
        href={`/dashboard/songs/${song.id}`}
        className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-surface-2/60"
      >
        <span className="min-w-0 flex-1">
          <span className="block truncate font-medium text-mist">
            {song.title}
          </span>
          <span className="block truncate text-xs text-faint">
            {song.artist ?? 'Original'}
            {song.song_key ? ` · Key of ${song.song_key}` : ''}
            {song.bpm ? ` · ${song.bpm} BPM` : ''}
          </span>
        </span>
        <span className="hidden gap-1.5 sm:flex">
          <span
            className={`rounded px-2 py-0.5 text-[0.58rem] font-semibold uppercase tracking-[0.1em] ${
              song.lyrics
                ? 'bg-tip/15 text-tip'
                : 'bg-surface-2 text-faint'
            }`}
          >
            {song.lyrics ? '✓ Lyrics' : 'No lyrics'}
          </span>
          {song.chords ? (
            <span className="rounded bg-gold/15 px-2 py-0.5 text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-gold">
              ♯ Chords
            </span>
          ) : null}
        </span>
        <span className="text-faint">›</span>
      </Link>
    </li>
  )
}

function Group({ title, songs }: { title: string; songs: Song[] }) {
  if (!songs.length) return null
  return (
    <section className="mb-8">
      <h2 className="mb-3 flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-faint">
        {title}
        <span className="rounded-full bg-surface-2 px-2 py-0.5 text-mute">
          {songs.length}
        </span>
      </h2>
      <ul className="divide-y divide-line/60 overflow-hidden rounded-2xl border border-line bg-surface/30">
        {songs.map((s) => (
          <SongRow key={s.id} song={s} />
        ))}
      </ul>
    </section>
  )
}

export default async function LibraryPage() {
  const songs = await getSongs()
  const originals = songs.filter((s) => s.song_type === 'original')
  const covers = songs.filter((s) => s.song_type === 'cover')
  const withLyrics = songs.filter((s) => s.lyrics).length

  return (
    <>
      <TopBar
        breadcrumb={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Music Library' },
        ]}
        title="Music Library"
        subtitle={`${songs.length} songs · ${withLyrics} with lyrics`}
      />
      <div className="mx-auto max-w-3xl px-5 py-6 sm:px-8">
        <Group title="Originals" songs={originals} />
        <Group title="Covers" songs={covers} />
      </div>
    </>
  )
}
