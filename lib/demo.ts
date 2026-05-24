import type { ActivityItem } from './data'
import type { Gig, Song } from './database.types'

// Demo dataset mirroring the seeded Supabase rows. Used as a graceful fallback
// when the database is unreachable (e.g. a sandbox with a restricted network
// policy) so the UI always renders the same content it shows in production.

function dateOffset(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

function minutesAgo(mins: number): string {
  return new Date(Date.now() - mins * 60000).toISOString()
}

export const demoGigs: Gig[] = [
  {
    id: 'demo-pearls',
    created_at: new Date().toISOString(),
    venue_name: "Pearl's Bar & Grill",
    address: '3985 Erie Ave',
    neighborhood: 'Hyde Park',
    city: 'Cincinnati, OH',
    gig_date: dateOffset(0),
    start_time: '8:00 PM',
    end_time: '11:00 PM',
    payout: '$150',
    expected_min: 55,
    expected_max: 65,
    crowd_estimate: 60,
    cover_note: 'No cover · 21+ after 10 PM · PA provided',
    status: 'tonight',
    is_live: true,
  },
  {
    id: 'demo-sitwells',
    created_at: new Date().toISOString(),
    venue_name: "Sitwell's Coffee",
    address: '324 Ludlow Ave',
    neighborhood: 'Clifton',
    city: 'Cincinnati, OH',
    gig_date: dateOffset(7),
    start_time: '7:00 PM',
    end_time: '9:30 PM',
    payout: 'Set rate',
    expected_min: 35,
    expected_max: 45,
    crowd_estimate: 40,
    cover_note: 'No cover · All ages · Bring own amp',
    status: 'upcoming',
    is_live: false,
  },
  {
    id: 'demo-molly',
    created_at: new Date().toISOString(),
    venue_name: "Molly Malone's",
    address: '112 W Elder St',
    neighborhood: 'OTR',
    city: 'Cincinnati, OH',
    gig_date: dateOffset(14),
    start_time: '9:00 PM',
    end_time: '12:00 AM',
    payout: '$200',
    expected_min: 80,
    expected_max: 100,
    crowd_estimate: 90,
    cover_note: '$5 cover · 21+ · Late night energy',
    status: 'upcoming',
    is_live: false,
  },
  {
    id: 'demo-comet',
    created_at: new Date().toISOString(),
    venue_name: 'The Comet',
    address: '4579 Hamilton Ave',
    neighborhood: 'Northside',
    city: 'Cincinnati, OH',
    gig_date: dateOffset(21),
    start_time: '9:00 PM',
    end_time: '11:30 PM',
    payout: '$175',
    expected_min: 40,
    expected_max: 60,
    crowd_estimate: 50,
    cover_note: 'No cover · 21+',
    status: 'upcoming',
    is_live: false,
  },
  {
    id: 'demo-ludlow',
    created_at: new Date().toISOString(),
    venue_name: 'Ludlow Garage',
    address: '342 Ludlow Ave',
    neighborhood: 'Clifton',
    city: 'Cincinnati, OH',
    gig_date: dateOffset(28),
    start_time: '8:00 PM',
    end_time: '11:00 PM',
    payout: '$250',
    expected_min: 100,
    expected_max: 150,
    crowd_estimate: 120,
    cover_note: 'Ticketed show',
    status: 'upcoming',
    is_live: false,
  },
  {
    id: 'demo-arnolds',
    created_at: new Date().toISOString(),
    venue_name: "Arnold's Bar & Grill",
    address: '210 E 8th St',
    neighborhood: 'Downtown',
    city: 'Cincinnati, OH',
    gig_date: dateOffset(35),
    start_time: '7:30 PM',
    end_time: '10:30 PM',
    payout: '$150',
    expected_min: 50,
    expected_max: 70,
    crowd_estimate: 60,
    cover_note: 'No cover · All ages until 9',
    status: 'upcoming',
    is_live: false,
  },
]

type SongSeed = [string, string | null, string, string, number, string]

const songSeeds: SongSeed[] = [
  ['Old River Road', null, 'original', 'G', 84, 'upbeat'],
  ['Wagon Wheel', 'Old Crow Medicine Show', 'cover', 'G', 96, 'high'],
  ['Last Light', null, 'original', 'D', 72, 'mid'],
  ['Fast Car', 'Tracy Chapman', 'cover', 'A', 104, 'upbeat'],
  ['Blackbird', 'The Beatles', 'cover', 'C', 66, 'mid'],
  ['Harvest Moon', 'Neil Young', 'cover', 'E', 80, 'mid'],
  ['River Bend', null, 'original', 'Bm', 90, 'upbeat'],
  ['Brown Eyed Girl', 'Van Morrison', 'cover', 'G', 100, 'high'],
  ["Free Fallin'", 'Tom Petty', 'cover', 'F', 85, 'mid'],
  ['The Weight', 'The Band', 'cover', 'A', 76, 'mid'],
  ['Sweet Caroline', 'Neil Diamond', 'cover', 'B', 128, 'high'],
  ['Hallelujah', 'Leonard Cohen', 'cover', 'C', 60, 'low'],
  ['Ho Hey', 'The Lumineers', 'cover', 'C', 80, 'upbeat'],
  ['Take It Easy', 'Eagles', 'cover', 'G', 138, 'high'],
  ['Hometown Glow', null, 'original', 'A', 88, 'mid'],
]

export const demoSongs: Song[] = songSeeds.map(
  ([title, artist, song_type, song_key, bpm, energy], i) => ({
    id: `demo-song-${i}`,
    title,
    artist,
    song_type,
    song_key,
    bpm,
    energy,
  })
)

export const demoActivity: ActivityItem[] = [
  {
    kind: 'request',
    id: 'demo-act-1',
    name: 'Jake',
    song: 'Brown Eyed Girl',
    createdAt: minutesAgo(1),
  },
  {
    kind: 'tip',
    id: 'demo-act-2',
    name: 'Sarah',
    amount: 5,
    createdAt: minutesAgo(2),
  },
  {
    kind: 'request',
    id: 'demo-act-3',
    name: 'Mike',
    song: "Free Fallin'",
    createdAt: minutesAgo(3),
  },
  {
    kind: 'tip',
    id: 'demo-act-4',
    name: 'Emma',
    amount: 10,
    createdAt: minutesAgo(5),
  },
]
