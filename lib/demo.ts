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

type OriginalSeed = {
  title: string
  key: string
  bpm: number
  energy: string
  lyrics: string
  chords: string
}

const originalSeeds: OriginalSeed[] = [
  {
    title: 'Old River Road',
    key: 'G',
    bpm: 84,
    energy: 'upbeat',
    lyrics: `[Verse 1]
Down where the willows lean over the line
I left my boots and a bottle of wine
The current keeps time like an old friend would
Down on the Old River Road

[Chorus]
And the water knows my name
Rolls on just the same
Carry me slow, carry me home
Down the Old River Road`,
    chords: `Capo 2 — Key of G

[Verse]
G                  C
Down where the willows lean over the line
G                       D
I left my boots and a bottle of wine
Em                 C
The current keeps time like an old friend would
G          D         G
Down on the Old River Road

[Chorus]
C             G
And the water knows my name
C               D
Rolls on just the same
Em            C
Carry me slow, carry me home
G          D         G
Down the Old River Road`,
  },
  {
    title: 'Last Light',
    key: 'D',
    bpm: 72,
    energy: 'mid',
    lyrics: `[Verse]
We watched the day go gold then gray
Said all the things we could not say
Hold on a little longer, stay
Until the last light fades away

[Chorus]
Oh, last light
Burning low on the kitchen wall
Oh, last light
Do not go out on us at all`,
    chords: `Key of D

[Verse]
D                  A
We watched the day go gold then gray
Bm                 G
Said all the things we could not say
D                   A
Hold on a little longer, stay
G          A        D
Until the last light fades away

[Chorus]
Bm        A
Oh, last light
G                    D
Burning low on the kitchen wall
Bm        A
Oh, last light
G               A      D
Do not go out on us at all`,
  },
  {
    title: 'River Bend',
    key: 'Bm',
    bpm: 90,
    energy: 'upbeat',
    lyrics: `[Verse]
Met you down at the river bend
Where the cold creek starts to mend
Swore to me you would not pretend
Meet me at the river bend

[Chorus]
Bend, river bend
Take me round the turn again
Everything I lost back then
Waits at the river bend`,
    chords: `Key of Bm

[Verse]
Bm                 G
Met you down at the river bend
D                  A
Where the cold creek starts to mend
Bm                  G
Swore to me you would not pretend
D        A         Bm
Meet me at the river bend

[Chorus]
G         D
Bend, river bend
A                   Bm
Take me round the turn again
G               D
Everything I lost back then
A          Bm
Waits at the river bend`,
  },
  {
    title: 'Hometown Glow',
    key: 'A',
    bpm: 88,
    energy: 'mid',
    lyrics: `[Verse]
Streetlights humming on Pearl and Main
Same old faces, same sweet refrain
Everybody here knows everybody's name
In that hometown glow

[Chorus]
Hometown glow, hometown glow
Brightest thing this side of the road
Wherever I go, wherever I go
I carry that hometown glow`,
    chords: `Key of A

[Verse]
A                   E
Streetlights humming on Pearl and Main
F#m                 D
Same old faces, same sweet refrain
A                            E
Everybody here knows everybody's name
D         E        A
In that hometown glow

[Chorus]
D             A
Hometown glow, hometown glow
E                       A
Brightest thing this side of the road
F#m            D
Wherever I go, wherever I go
E                  A
I carry that hometown glow`,
  },
]

type CoverSeed = [string, string, string, number, string]

const coverSeeds: CoverSeed[] = [
  ['Wagon Wheel', 'Old Crow Medicine Show', 'G', 96, 'high'],
  ['Fast Car', 'Tracy Chapman', 'A', 104, 'upbeat'],
  ['Blackbird', 'The Beatles', 'C', 66, 'mid'],
  ['Harvest Moon', 'Neil Young', 'E', 80, 'mid'],
  ['Brown Eyed Girl', 'Van Morrison', 'G', 100, 'high'],
  ["Free Fallin'", 'Tom Petty', 'F', 85, 'mid'],
  ['The Weight', 'The Band', 'A', 76, 'mid'],
  ['Sweet Caroline', 'Neil Diamond', 'B', 128, 'high'],
  ['Hallelujah', 'Leonard Cohen', 'C', 60, 'low'],
  ['Ho Hey', 'The Lumineers', 'C', 80, 'upbeat'],
  ['Take It Easy', 'Eagles', 'G', 138, 'high'],
  ['Cover Me Up', 'Jason Isbell', 'D', 72, 'mid'],
  ['The Night We Met', 'Lord Huron', 'A', 88, 'low'],
  ['Riptide', 'Vance Joy', 'C', 102, 'upbeat'],
  ['Hey There Delilah', "Plain White T's", 'D', 104, 'mid'],
  ['Wonderwall', 'Oasis', 'F#m', 87, 'mid'],
  ['Ring of Fire', 'Johnny Cash', 'G', 108, 'upbeat'],
  ['Folsom Prison Blues', 'Johnny Cash', 'E', 120, 'upbeat'],
  ['Mr. Brightside', 'The Killers', 'D', 148, 'high'],
  ['Use Somebody', 'Kings of Leon', 'C', 136, 'high'],
  ['Hotel California', 'Eagles', 'Bm', 75, 'mid'],
  ['Simple Man', 'Lynyrd Skynyrd', 'C', 70, 'mid'],
  ['The Joker', 'Steve Miller Band', 'F', 90, 'mid'],
  ['Banana Pancakes', 'Jack Johnson', 'G', 100, 'upbeat'],
  ['I Will Wait', 'Mumford & Sons', 'C', 132, 'high'],
  ['Little Talks', 'Of Monsters and Men', 'D', 120, 'high'],
  ['Stand By Me', 'Ben E. King', 'A', 118, 'mid'],
  ['Tennessee Whiskey', 'Chris Stapleton', 'A', 48, 'low'],
  ['Sweet Home Alabama', 'Lynyrd Skynyrd', 'D', 98, 'upbeat'],
  ['Margaritaville', 'Jimmy Buffett', 'D', 98, 'upbeat'],
  ['Wish You Were Here', 'Pink Floyd', 'G', 60, 'low'],
  ["Knockin' on Heaven's Door", 'Bob Dylan', 'G', 72, 'mid'],
  ['Country Roads', 'John Denver', 'A', 82, 'upbeat'],
  ['The A Team', 'Ed Sheeran', 'A', 84, 'mid'],
  ['Chicken Fried', 'Zac Brown Band', 'G', 110, 'upbeat'],
  ['Drift Away', 'Dobie Gray', 'A', 92, 'mid'],
  ['Landslide', 'Fleetwood Mac', 'C', 88, 'low'],
  ['More Than Words', 'Extreme', 'G', 92, 'mid'],
  ['Black', 'Pearl Jam', 'E', 76, 'mid'],
  ["Can't You See", 'The Marshall Tucker Band', 'D', 100, 'mid'],
  ['Patience', "Guns N' Roses", 'G', 60, 'mid'],
]

export const demoSongs: Song[] = [
  ...originalSeeds.map((o, i) => ({
    id: `demo-orig-${i}`,
    title: o.title,
    artist: null,
    song_type: 'original',
    song_key: o.key,
    bpm: o.bpm,
    energy: o.energy,
    lyrics: o.lyrics,
    chords: o.chords,
  })),
  ...coverSeeds.map(([title, artist, song_key, bpm, energy], i) => ({
    id: `demo-cover-${i}`,
    title,
    artist,
    song_type: 'cover',
    song_key,
    bpm,
    energy,
    lyrics: null,
    chords: null,
  })),
]

export const demoActivity: ActivityItem[] = [
  {
    kind: 'request',
    id: 'demo-act-1',
    name: 'Jake',
    song: 'Brown Eyed Girl',
    artist: 'Van Morrison',
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
    artist: 'Tom Petty',
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
