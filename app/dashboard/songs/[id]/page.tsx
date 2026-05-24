import { notFound } from 'next/navigation'
import { getSong } from '@/lib/data'
import { TopBar } from '../../topbar'
import { SongReader } from './reader'

export const dynamic = 'force-dynamic'

export default async function SongPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const song = await getSong(id)
  if (!song) notFound()

  return (
    <>
      <TopBar
        breadcrumb={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Music Library', href: '/dashboard/songs' },
          { label: song.title },
        ]}
        title={song.title}
        subtitle={song.artist ?? 'Original'}
      />
      <SongReader song={song} />
    </>
  )
}
