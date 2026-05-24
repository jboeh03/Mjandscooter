'use server'

import { revalidatePath } from 'next/cache'
import { getSupabase } from '@/lib/supabase'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function field(formData: FormData, name: string) {
  return (formData.get(name) ?? '').toString().trim()
}

/* ----------------------------- Booking ----------------------------- */

export type BookingState = {
  status: 'idle' | 'success' | 'error'
  message?: string
  errors?: Record<string, string>
  values?: Record<string, string>
}

export async function submitBooking(
  _prev: BookingState,
  formData: FormData
): Promise<BookingState> {
  const values = {
    name: field(formData, 'name'),
    venueName: field(formData, 'venueName'),
    email: field(formData, 'email'),
    phone: field(formData, 'phone'),
    venueType: field(formData, 'venueType'),
    eventDate: field(formData, 'eventDate'),
    startTime: field(formData, 'startTime'),
    duration: field(formData, 'duration'),
    guestCount: field(formData, 'guestCount'),
    message: field(formData, 'message'),
  }

  const errors: Record<string, string> = {}
  if (!values.name) errors.name = 'Please tell us your name.'
  if (!values.email) errors.email = 'An email is required so Michael can reply.'
  else if (!EMAIL_RE.test(values.email))
    errors.email = 'That email address doesn’t look right.'
  if (!values.venueType) errors.venueType = 'Pick a venue type.'
  if (!values.eventDate) errors.eventDate = 'What date do you have in mind?'

  if (Object.keys(errors).length > 0) {
    return {
      status: 'error',
      message: 'Please fix the highlighted fields and try again.',
      errors,
      values,
    }
  }

  const sb = getSupabase()
  const { error } = await sb.from('bookings').insert({
    name: values.name,
    venue_name: values.venueName || null,
    email: values.email,
    phone: values.phone || null,
    venue_type: values.venueType,
    event_date: values.eventDate || null,
    start_time: values.startTime || null,
    duration: values.duration || null,
    guest_count: values.guestCount ? Number(values.guestCount) : null,
    message: values.message || null,
  })

  if (error) {
    return {
      status: 'error',
      message: 'Something went wrong saving your request. Please try again.',
      values,
    }
  }

  return {
    status: 'success',
    message: `Thanks, ${values.name}! Your booking request is in. Michael will get back to you within 48 hours.`,
  }
}

/* --------------------------- Song request --------------------------- */

export type RequestState = { status: 'idle' | 'success' | 'error'; message?: string }

export async function submitSongRequest(
  _prev: RequestState,
  formData: FormData
): Promise<RequestState> {
  const gigId = field(formData, 'gigId')
  const song = field(formData, 'songTitle')
  const artist = field(formData, 'artist')
  const requester = field(formData, 'requesterName')

  if (!song) {
    return { status: 'error', message: 'Start typing a song to request it.' }
  }

  const sb = getSupabase()
  const { error } = await sb.from('song_requests').insert({
    gig_id: gigId || null,
    song_title: song,
    artist: artist || null,
    requester_name: requester || null,
  })

  if (error) {
    return { status: 'error', message: 'Could not send your request. Try again.' }
  }

  revalidatePath('/live')
  return {
    status: 'success',
    message: `Request for “${song}”${artist ? ` by ${artist}` : ''} sent!`,
  }
}

/* ------------------------------- Tip -------------------------------- */

export type TipState = { status: 'idle' | 'success' | 'error'; message?: string }

export async function submitTip(
  _prev: TipState,
  formData: FormData
): Promise<TipState> {
  const gigId = field(formData, 'gigId')
  const amount = Number(field(formData, 'amount'))
  const method = field(formData, 'method')

  if (!amount || amount <= 0) {
    return { status: 'error', message: 'Choose a tip amount.' }
  }

  const sb = getSupabase()
  const { error } = await sb.from('tips').insert({
    gig_id: gigId || null,
    amount,
    method: method || null,
    tipper_name: field(formData, 'tipperName') || null,
  })

  if (error) {
    return { status: 'error', message: 'Could not record your tip. Try again.' }
  }

  revalidatePath('/live')
  return {
    status: 'success',
    message: `Thank you for the $${amount} tip! 🎵`,
  }
}

/* --------------------------- Song lyrics ---------------------------- */

export type SongEditState = {
  status: 'idle' | 'success' | 'error'
  message?: string
}

export async function importLyrics(
  _prev: SongEditState,
  formData: FormData
): Promise<SongEditState> {
  const songId = field(formData, 'songId')
  if (!songId) return { status: 'error', message: 'Missing song.' }

  const sb = getSupabase()
  const { data: song } = await sb
    .from('songs')
    .select('title, artist')
    .eq('id', songId)
    .maybeSingle()

  if (!song) return { status: 'error', message: 'Song not found.' }
  if (!song.artist) {
    return {
      status: 'error',
      message: 'Add an artist first — it’s needed to look up the right lyrics.',
    }
  }

  try {
    const res = await fetch(
      `https://api.lyrics.ovh/v1/${encodeURIComponent(song.artist)}/${encodeURIComponent(song.title)}`,
      { cache: 'no-store' }
    )
    if (!res.ok) {
      return {
        status: 'error',
        message: 'No match from the lyrics service. Paste them manually below.',
      }
    }
    const json = (await res.json()) as { lyrics?: string }
    const lyrics = (json.lyrics ?? '').replace(/\r\n/g, '\n').trim()
    if (!lyrics) {
      return {
        status: 'error',
        message: 'No lyrics found for that title/artist. Paste them manually below.',
      }
    }
    const { error } = await sb.from('songs').update({ lyrics }).eq('id', songId)
    if (error) {
      return { status: 'error', message: 'Found lyrics but could not save them.' }
    }
    revalidatePath(`/dashboard/songs/${songId}`)
    return { status: 'success', message: 'Lyrics imported.' }
  } catch {
    return {
      status: 'error',
      message:
        'Could not reach the lyrics service from this environment. Paste manually, or try on the deployed site.',
    }
  }
}

export async function saveSongText(
  _prev: SongEditState,
  formData: FormData
): Promise<SongEditState> {
  const songId = field(formData, 'songId')
  if (!songId) return { status: 'error', message: 'Missing song.' }

  const lyrics = (formData.get('lyrics') ?? '').toString()
  const chords = (formData.get('chords') ?? '').toString()

  const sb = getSupabase()
  const { error } = await sb
    .from('songs')
    .update({ lyrics: lyrics || null, chords: chords || null })
    .eq('id', songId)

  if (error) {
    return { status: 'error', message: 'Could not save. Try again.' }
  }

  revalidatePath(`/dashboard/songs/${songId}`)
  return { status: 'success', message: 'Saved.' }
}
