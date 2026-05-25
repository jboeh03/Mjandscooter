export type AvailabilityGig = {
  gig_date: string
  start_time: string | null
  end_time: string | null
  venue_name: string
}

// Buffer (minutes) required on either side of an existing gig. A new booking
// whose time window falls within this buffer of a scheduled gig conflicts.
export const BOOKING_BUFFER_MIN = 60

const DURATION_MIN: Record<string, number> = {
  '1 hour': 60,
  '2 hours': 120,
  '3 hours': 180,
  '4+ hours': 240,
  'Multiple sets': 240,
}

export function durationToMinutes(label: string): number {
  return DURATION_MIN[label] ?? 120
}

// Parse "8:00 PM", "8 PM", or 24h "20:00" into minutes from midnight.
export function parseTime(input: string | null): number | null {
  if (!input) return null
  const s = input.trim().toUpperCase()
  let m = s.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/)
  if (m) {
    let h = Number(m[1]) % 12
    if (m[3] === 'PM') h += 12
    return h * 60 + Number(m[2])
  }
  m = s.match(/^(\d{1,2})\s*(AM|PM)$/)
  if (m) {
    let h = Number(m[1]) % 12
    if (m[2] === 'PM') h += 12
    return h * 60
  }
  m = s.match(/^(\d{1,2}):(\d{2})$/)
  if (m) return Number(m[1]) * 60 + Number(m[2])
  return null
}

export function gigsOnDate(
  gigs: AvailabilityGig[],
  eventDate: string
): AvailabilityGig[] {
  if (!eventDate) return []
  return gigs.filter((g) => g.gig_date === eventDate)
}

// Returns the first scheduled gig that conflicts with the requested window,
// or null. A conflict means the requested [start, start+duration] window
// overlaps an existing gig window padded by BOOKING_BUFFER_MIN on each side.
export function findBookingConflict(
  gigs: AvailabilityGig[],
  eventDate: string,
  startTime: string,
  durationLabel: string,
  bufferMin: number = BOOKING_BUFFER_MIN
): AvailabilityGig | null {
  if (!eventDate || !startTime) return null
  const reqStart = parseTime(startTime)
  if (reqStart === null) return null
  const reqEnd = reqStart + durationToMinutes(durationLabel)

  for (const gig of gigsOnDate(gigs, eventDate)) {
    const gStart = parseTime(gig.start_time)
    if (gStart === null) continue
    let gEnd = parseTime(gig.end_time)
    if (gEnd === null) gEnd = gStart + 120
    if (gEnd <= gStart) gEnd += 1440 // crosses midnight

    const blockedStart = gStart - bufferMin
    const blockedEnd = gEnd + bufferMin
    if (reqStart < blockedEnd && reqEnd > blockedStart) return gig
  }
  return null
}
