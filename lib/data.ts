import { getSupabase } from './supabase'
import { demoActivity, demoGigs, demoSongs } from './demo'
import type { Gig, Song } from './database.types'

export type ActivityItem =
  | {
      kind: 'request'
      id: string
      name: string
      song: string
      artist?: string | null
      createdAt: string
    }
  | {
      kind: 'tip'
      id: string
      name: string
      amount: number
      createdAt: string
    }

// supabase-js surfaces network failures as a thrown error or an `error` field
// depending on the transport. This helper treats either as "unavailable" and
// lets callers fall back to demo data (used when the DB host is unreachable).
async function query<T>(
  fn: () => PromiseLike<{ data: T | null; error: unknown }>
) {
  try {
    const { data, error } = await fn()
    if (error) return null
    return data
  } catch {
    return null
  }
}

export async function getGigs(): Promise<Gig[]> {
  const sb = getSupabase()
  const data = await query<Gig[]>(() =>
    sb.from('gigs').select('*').order('gig_date', { ascending: true })
  )
  return data && data.length ? data : demoGigs
}

export async function getLiveGig(): Promise<Gig | null> {
  const sb = getSupabase()
  const live = await query<Gig>(() =>
    sb.from('gigs').select('*').eq('is_live', true).limit(1).maybeSingle()
  )
  if (live) return live
  const next = await query<Gig>(() =>
    sb.from('gigs').select('*').order('gig_date', { ascending: true }).limit(1).maybeSingle()
  )
  if (next) return next
  return demoGigs.find((g) => g.is_live) ?? demoGigs[0] ?? null
}

export async function getSong(id: string): Promise<Song | null> {
  const sb = getSupabase()
  const data = await query<Song>(() =>
    sb.from('songs').select('*').eq('id', id).maybeSingle()
  )
  if (data) return data
  return demoSongs.find((s) => s.id === id) ?? null
}

export async function getSongs(): Promise<Song[]> {
  const sb = getSupabase()
  const data = await query<Song[]>(() =>
    sb.from('songs').select('*').order('title')
  )
  return data && data.length ? data : demoSongs
}

export async function getActivity(
  gigId?: string,
  limit = 12
): Promise<ActivityItem[]> {
  const sb = getSupabase()
  const reqs = await query<
    {
      id: string
      requester_name: string | null
      song_title: string
      artist: string | null
      created_at: string
    }[]
  >(() => {
    let q = sb
      .from('song_requests')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)
    if (gigId) q = q.eq('gig_id', gigId)
    return q
  })
  const tips = await query<
    { id: string; tipper_name: string | null; amount: number; created_at: string }[]
  >(() => {
    let q = sb
      .from('tips')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)
    if (gigId) q = q.eq('gig_id', gigId)
    return q
  })

  if (reqs === null && tips === null) return demoActivity

  const items: ActivityItem[] = [
    ...(reqs ?? []).map((r) => ({
      kind: 'request' as const,
      id: r.id,
      name: r.requester_name ?? 'Someone',
      song: r.song_title,
      artist: r.artist,
      createdAt: r.created_at,
    })),
    ...(tips ?? []).map((t) => ({
      kind: 'tip' as const,
      id: t.id,
      name: t.tipper_name ?? 'Someone',
      amount: Number(t.amount),
      createdAt: t.created_at,
    })),
  ]
  if (items.length === 0) return demoActivity
  items.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
  return items.slice(0, limit)
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.round(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  return `${days}d ago`
}
