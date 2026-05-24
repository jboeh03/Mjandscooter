import Link from 'next/link'
import { getGigs, getSongs } from '@/lib/data'
import type { Gig, Song } from '@/lib/database.types'
import { TopBar } from './topbar'

export const dynamic = 'force-dynamic'

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
const DOW = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

function parseDate(d: string) {
  const [y, m, day] = d.split('-').map(Number)
  return new Date(y, m - 1, day)
}

function fmtGig(d: string) {
  const date = parseDate(d)
  return { day: date.getDate(), mon: MONTHS[date.getMonth()], dow: DOW[date.getDay()] }
}

const SETLIST_ORDER = [
  'Old River Road',
  'Wagon Wheel',
  'Last Light',
  'Fast Car',
  'Blackbird',
  'Harvest Moon',
  'River Bend',
]

const CHECKLIST = [
  { group: 'Gear', items: [['Guitar + capo packed', true], ['Cables & tuner', true], ['DI box', false]] },
  { group: 'Promo', items: [['Story posted on IG', true], ['Facebook event shared', true], ['Email list notified', false]] },
  { group: 'Payment', items: [['Venmo link sent to host', false]] },
] as const

function StatTile({ label, value, delta, deltaTone = 'up' }: { label: string; value: string; delta?: string; deltaTone?: 'up' | 'flat' }) {
  return (
    <div className="rounded-xl border border-line bg-surface/50 p-4">
      <p className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-faint">{label}</p>
      <p className="mt-1 font-serif text-2xl text-cream">{value}</p>
      {delta ? (
        <p className={`mt-0.5 text-xs ${deltaTone === 'up' ? 'text-tip' : 'text-faint'}`}>{delta}</p>
      ) : null}
    </div>
  )
}

function EnergyMeter({ energy }: { energy: string | null }) {
  const map: Record<string, { fill: number; color: string; label: string }> = {
    high: { fill: 3, color: 'bg-tip', label: 'High' },
    upbeat: { fill: 3, color: 'bg-gold', label: 'Upbeat' },
    mid: { fill: 2, color: 'bg-mute', label: 'Mid' },
    low: { fill: 1, color: 'bg-faint', label: 'Low' },
  }
  const e = map[energy ?? 'mid'] ?? map.mid
  return (
    <div className="flex items-center justify-end gap-2">
      <div className="flex items-end gap-0.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`w-1 rounded-sm ${i < e.fill ? e.color : 'bg-line-2/50'}`}
            style={{ height: `${6 + i * 4}px` }}
          />
        ))}
      </div>
      <span className="w-12 text-right text-xs text-mute">{e.label}</span>
    </div>
  )
}

function GigCard({ gig, tonight }: { gig: Gig; tonight: boolean }) {
  const d = fmtGig(gig.gig_date)
  return (
    <div className={`rounded-xl border bg-surface/50 p-4 ${tonight ? 'border-gold/50' : 'border-line'}`}>
      <div className="flex items-center justify-between">
        <span
          className={`rounded px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.12em] ${
            tonight ? 'bg-gold/20 text-gold' : 'bg-surface-2 text-mute'
          }`}
        >
          {tonight ? 'Tonight' : 'Upcoming'}
        </span>
        <span className="text-[0.65rem] text-faint">📍 {gig.neighborhood}</span>
      </div>

      <p className="mt-3 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-faint">
        {d.day} {d.mon} · {d.dow}
      </p>
      <h3 className="font-serif text-xl text-cream">{gig.venue_name}</h3>
      <p className="mt-1 text-xs text-mute">
        {gig.start_time}–{gig.end_time} · 👥 ~{gig.crowd_estimate} crowd
      </p>
      <p className="text-xs text-faint">{gig.address}, {gig.neighborhood}</p>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-line bg-ink/40 px-3 py-2">
          <p className="text-[0.55rem] uppercase tracking-[0.12em] text-faint">Payout</p>
          <p className="text-sm font-semibold text-tip">{gig.payout}</p>
        </div>
        <div className="rounded-lg border border-line bg-ink/40 px-3 py-2">
          <p className="text-[0.55rem] uppercase tracking-[0.12em] text-faint">Expected</p>
          <p className="text-sm font-semibold text-mist">
            {gig.expected_min}–{gig.expected_max}
          </p>
        </div>
      </div>

      <p className="mt-3 rounded-md bg-ink/40 px-3 py-2 text-[0.7rem] italic text-faint">
        {gig.cover_note}
      </p>

      <div className="mt-3 flex gap-2">
        {['Edit', 'Share', 'Setlist'].map((a) => (
          <button
            key={a}
            className={`flex-1 rounded-md border py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.1em] transition-colors ${
              a === 'Setlist'
                ? 'border-gold/40 bg-gold/10 text-gold hover:bg-gold/20'
                : 'border-line text-mute hover:text-mist'
            }`}
          >
            {a}
          </button>
        ))}
      </div>
    </div>
  )
}

export default async function DashboardPage() {
  const [gigs, songs] = await Promise.all([getGigs(), getSongs()])
  const week = gigs.slice(0, 3)
  const after = gigs.slice(3, 6)
  const tonightGig = week.find((g) => g.is_live) ?? week[0]

  const songsByTitle = new Map(songs.map((s) => [s.title, s]))
  const setlist = SETLIST_ORDER.map((t) => songsByTitle.get(t)).filter(
    (s): s is Song => Boolean(s)
  )

  const now = new Date()
  const thisMonth = gigs.filter((g) => {
    const d = parseDate(g.gig_date)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length
  const earnings = gigs.reduce((sum, g) => {
    const m = (g.payout ?? '').match(/\$([\d,]+)/)
    return sum + (m ? Number(m[1].replace(/,/g, '')) : 0)
  }, 0)

  const today = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  const rangeLabel = week.length
    ? `${MONTHS[parseDate(week[0].gig_date).getMonth()]} ${parseDate(week[0].gig_date).getDate()}–${parseDate(week[week.length - 1].gig_date).getDate()}`
    : ''

  return (
    <>
      <TopBar
        title="Dashboard"
        subtitle={today}
        action={
          <button className="rounded-md bg-gold px-4 py-2 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-gold-bright">
            + Add Gig
          </button>
        }
      />

      <div className="grid gap-6 px-5 py-6 sm:px-8 xl:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          {/* Your Week */}
          <section>
            <div className="mb-4 flex items-end justify-between">
              <div>
                <p className="eyebrow flex items-center gap-2">
                  <span className="h-px w-6 bg-gold/60" /> {rangeLabel}
                </p>
                <h2 className="mt-1 font-serif text-2xl text-cream">Your Week</h2>
              </div>
              <button className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-gold">
                View full schedule →
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {week.map((g) => (
                <GigCard key={g.id} gig={g} tonight={g.id === tonightGig?.id} />
              ))}
            </div>
          </section>

          {/* Smart Setlist */}
          <section className="rounded-2xl border border-line bg-surface/30">
            <div className="border-b border-line/70 p-5">
              <p className="eyebrow flex items-center gap-2">
                <span className="h-px w-6 bg-gold/60" /> AI-Powered
              </p>
              <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-serif text-2xl text-cream">
                  Smart Setlist Suggestions
                </h2>
                <button className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-gold">
                  Edit full library →
                </button>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="font-serif text-sm text-mist">
                  {tonightGig?.venue_name} · Tonight
                </span>
                {['Neighborhood Bar', '30s–50s Crowd', 'Friday Night'].map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-line px-2.5 py-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-mute"
                  >
                    {t}
                  </span>
                ))}
                <span className="ml-auto flex gap-2">
                  {['✦ AI Suggested', '↻ Regenerate'].map((b) => (
                    <button
                      key={b}
                      className="rounded-md border border-line px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-mute hover:text-mist"
                    >
                      {b}
                    </button>
                  ))}
                  <button className="rounded-md bg-gold px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.1em] text-ink hover:bg-gold-bright">
                    ✓ Save Setlist
                  </button>
                </span>
              </div>
            </div>

            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[0.6rem] uppercase tracking-[0.14em] text-faint">
                  <th className="px-5 py-2 font-semibold">Song</th>
                  <th className="px-3 py-2 font-semibold">Type</th>
                  <th className="px-3 py-2 font-semibold">BPM</th>
                  <th className="px-5 py-2 text-right font-semibold">Energy</th>
                </tr>
              </thead>
              <tbody>
                {setlist.map((s) => (
                  <tr key={s.id} className="border-t border-line/50">
                    <td className="px-5 py-3">
                      <Link
                        href={`/dashboard/songs/${s.id}`}
                        className="font-semibold text-mist transition-colors hover:text-gold"
                      >
                        {s.title}
                        {s.lyrics ? (
                          <span className="ml-2 align-middle text-[0.6rem] text-tip">
                            ♪ lyrics
                          </span>
                        ) : null}
                      </Link>
                      <p className="text-xs text-faint">
                        {s.artist ?? 'Original'} · Key of {s.song_key}
                      </p>
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`rounded px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.1em] ${
                          s.song_type === 'original'
                            ? 'bg-gold/15 text-gold'
                            : 'bg-surface-2 text-mute'
                        }`}
                      >
                        {s.song_type}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-mute">♩ {s.bpm} BPM</td>
                    <td className="px-5 py-3">
                      <EnergyMeter energy={s.energy} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3">
            <StatTile label="This Month" value={String(thisMonth)} delta="↑ +2 gigs" />
            <StatTile label="Earnings" value={`$${earnings}`} delta="↑ +18%" />
            <StatTile label="Songs" value={String(songs.length)} delta="library" deltaTone="flat" />
            <StatTile
              label="RSVPs"
              value={String(tonightGig?.expected_max ?? 0)}
              delta="tonight"
              deltaTone="flat"
            />
          </div>

          <div className="rounded-2xl border border-line bg-surface/40 p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg text-cream">Today’s Checklist</h3>
              <span className="text-xs text-gold">4/7</span>
            </div>
            <p className="mb-3 text-xs text-faint">
              {tonightGig?.venue_name} · Tonight {tonightGig?.start_time}
            </p>
            <div className="space-y-3">
              {CHECKLIST.map((c) => (
                <div key={c.group}>
                  <p className="mb-1.5 text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-faint">
                    {c.group}
                  </p>
                  <ul className="space-y-1.5">
                    {c.items.map(([label, done]) => (
                      <li key={label as string} className="flex items-center gap-2.5 text-sm">
                        <span
                          className={`flex h-4 w-4 items-center justify-center rounded border text-[0.6rem] ${
                            done
                              ? 'border-tip bg-tip/20 text-tip'
                              : 'border-line text-transparent'
                          }`}
                        >
                          ✓
                        </span>
                        <span className={done ? 'text-mute line-through' : 'text-mist'}>
                          {label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-surface/40 p-5">
            <h3 className="mb-3 font-serif text-lg text-cream">After This Week</h3>
            <ul className="space-y-2">
              {after.map((g) => {
                const d = fmtGig(g.gig_date)
                return (
                  <li
                    key={g.id}
                    className="flex items-center gap-3 rounded-lg border border-line/60 px-3 py-2"
                  >
                    <span className="flex h-9 w-9 flex-col items-center justify-center rounded-md bg-surface-2 leading-none">
                      <span className="text-sm font-semibold text-cream">{d.day}</span>
                      <span className="text-[0.5rem] uppercase text-faint">{d.mon}</span>
                    </span>
                    <span className="flex-1">
                      <span className="block text-sm font-medium text-mist">{g.venue_name}</span>
                      <span className="block text-xs text-faint">
                        {g.neighborhood} · {g.start_time}
                      </span>
                    </span>
                    <span className="text-faint">›</span>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}
