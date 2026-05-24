import Image from 'next/image'
import Link from 'next/link'
import { getGigs } from '@/lib/data'
import type { Gig } from '@/lib/database.types'
import { BookingForm } from './booking-form'

export const dynamic = 'force-dynamic'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function fmtDate(d: string) {
  const [y, m, day] = d.split('-').map(Number)
  const date = new Date(y, m - 1, day)
  return { day: date.getDate(), mon: MONTHS[date.getMonth()], dow: DOW[date.getDay()] }
}

const STATS = [
  { value: '120+', label: 'Gigs booked' },
  { value: '3×', label: 'Per week' },
  { value: '50mi', label: 'Travel range' },
]

const TAGS = [
  'Acoustic Covers',
  'Originals',
  'Folk / Rock',
  'Pop',
  'Hyde Park Based',
]

function directionsUrl(gig: Gig) {
  const dest = [gig.venue_name, gig.address, gig.neighborhood, gig.city]
    .filter(Boolean)
    .join(', ')
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest)}`
}

function PlayingBanner({ gig }: { gig: Gig }) {
  const live = gig.is_live || gig.status === 'tonight'
  return (
    <div className="relative z-20 bg-gold">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-3 text-ink">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-ink/70">
            {live ? (
              <>
                <span className="h-2 w-2 animate-pulse rounded-full bg-live" />
                Playing Tonight
              </>
            ) : (
              'Next Show'
            )}
          </p>
          <p className="truncate font-serif text-lg leading-tight">
            {gig.venue_name}
            {gig.start_time ? ` — ${gig.start_time}` : ''}
          </p>
          {gig.cover_note ? (
            <p className="truncate text-xs text-ink/70">{gig.cover_note}</p>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <a
            href="#shows"
            className="rounded-md border border-ink/30 px-3 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-ink/80 transition-colors hover:bg-ink/10"
          >
            Details
          </a>
          <a
            href={directionsUrl(gig)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-gold transition-colors hover:bg-ink-2"
          >
            <span aria-hidden>➤</span> Directions
          </a>
        </div>
      </div>
    </div>
  )
}

function Shows({ gigs }: { gigs: Gig[] }) {
  if (!gigs.length) return null
  return (
    <section id="shows" className="scroll-mt-20 border-b border-line/70 bg-ink-2/40">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <p className="eyebrow flex items-center gap-3">
          <span className="h-px w-8 bg-gold/60" /> Upcoming
        </p>
        <h2 className="mt-2 font-serif text-4xl font-semibold text-cream">Shows</h2>
        <ul className="mt-8 divide-y divide-line/60 overflow-hidden rounded-2xl border border-line bg-surface/30">
          {gigs.map((g) => {
            const d = fmtDate(g.gig_date)
            const tonight = g.is_live || g.status === 'tonight'
            return (
              <li
                key={g.id}
                className="flex flex-wrap items-center gap-4 px-5 py-5 sm:px-6"
              >
                <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-lg border border-line bg-ink/40 leading-none">
                  <span className="font-serif text-xl text-cream">{d.day}</span>
                  <span className="text-[0.55rem] uppercase tracking-[0.1em] text-faint">
                    {d.mon}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate font-serif text-xl text-cream">
                      {g.venue_name}
                    </h3>
                    {tonight ? (
                      <span className="rounded bg-gold/20 px-2 py-0.5 text-[0.55rem] font-bold uppercase tracking-[0.12em] text-gold">
                        Tonight
                      </span>
                    ) : null}
                  </div>
                  <p className="text-sm text-mute">
                    {d.dow} · {g.start_time}
                    {g.end_time ? `–${g.end_time}` : ''} · {g.neighborhood},{' '}
                    {g.city}
                  </p>
                  {g.cover_note ? (
                    <p className="mt-0.5 text-xs text-faint">{g.cover_note}</p>
                  ) : null}
                </div>
                <a
                  href={directionsUrl(g)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 rounded-md border border-line px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-mute transition-colors hover:border-gold hover:text-gold"
                >
                  Directions
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

function Hero({ gig }: { gig: Gig | null }) {
  return (
    <section className="relative isolate flex min-h-[600px] flex-col overflow-hidden border-b border-line/70 sm:min-h-[82vh]">
      <Image
        src="/IMG_1176.jpeg"
        alt="Michael Paulik performing live"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[50%_26%]"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/75 via-ink/20 to-ink" />
      <div className="absolute inset-0 bg-gradient-to-tr from-ink/85 via-ink/10 to-transparent" />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-end px-6 pb-12 pt-28">
        <p className="eyebrow mb-4 flex items-center gap-3">
          <span className="h-px w-8 bg-gold/70" /> Acoustic · Original · Real
        </p>
        <h1 className="font-serif text-6xl font-bold uppercase leading-[0.9] tracking-tight text-cream drop-shadow-[0_2px_24px_rgba(0,0,0,0.5)] sm:text-8xl">
          Michael
          <br />
          Paulik
        </h1>
        <p className="mt-5 text-sm uppercase tracking-[0.22em] text-mist sm:text-base">
          Live Acoustic · Cincinnati, OH
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#book"
            className="inline-flex items-center gap-2 rounded-md bg-gold px-6 py-3 text-sm font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-gold-bright"
          >
            <span aria-hidden>📅</span> Book Me
          </a>
          <Link
            href="/live"
            className="inline-flex items-center gap-2 rounded-md border border-cream/30 bg-ink/30 px-6 py-3 text-sm font-bold uppercase tracking-[0.14em] text-cream backdrop-blur transition-colors hover:bg-ink/50"
          >
            <span aria-hidden>♥</span> Tip Me
          </Link>
        </div>
      </div>

      {gig ? <PlayingBanner gig={gig} /> : null}
    </section>
  )
}

function ArtistCard() {
  return (
    <div className="space-y-6">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-surface-3 to-ink">
        <div
          className="absolute inset-0 z-0 opacity-40"
          style={{
            background:
              'radial-gradient(circle at 50% 35%, rgba(201,164,77,0.35), transparent 55%)',
          }}
        />
        <Image
          src="/IMG_1175.jpeg"
          alt="Michael Paulik playing a live acoustic set"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 40vw"
          className="z-10 object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 z-20 h-1/3 bg-gradient-to-t from-ink/90 to-transparent" />
        <span className="absolute bottom-4 left-4 z-30 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-ink/70 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-gold backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-gold" />
          Available for booking
        </span>
      </div>

      <div>
        <h2 className="font-serif text-3xl text-cream">Michael Paulik</h2>
        <p className="mt-1 text-sm uppercase tracking-[0.16em] text-mute">
          Live Acoustic · Cincinnati, OH
        </p>
      </div>

      <div className="grid grid-cols-3 divide-x divide-line rounded-xl border border-line bg-surface/50">
        {STATS.map((s) => (
          <div key={s.label} className="px-4 py-5 text-center">
            <div className="font-serif text-2xl text-gold">{s.value}</div>
            <div className="mt-1 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-faint">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {TAGS.map((t) => (
          <span
            key={t}
            className="rounded-full border border-gold/30 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-gold/90"
          >
            {t}
          </span>
        ))}
      </div>

      <blockquote className="border-l-2 border-gold/40 pl-5 font-serif text-lg italic leading-relaxed text-mist">
        “Michael is the reason our Tuesday nights went from half-empty to standing
        room only. He reads the room better than anyone we’ve had — and our
        customers always ask when he’s back.”
      </blockquote>
    </div>
  )
}

export default async function BookingPage() {
  const gigs = await getGigs()
  const heroGig =
    gigs.find((g) => g.is_live || g.status === 'tonight') ?? gigs[0] ?? null
  return (
    <>
      <Hero gig={heroGig} />
      <Shows gigs={gigs.slice(0, 6)} />
      <section
        id="book"
        className="mx-auto max-w-6xl scroll-mt-20 px-6 py-16"
      >
        <div className="mb-10 max-w-2xl">
          <p className="eyebrow mb-3 flex items-center gap-3">
            <span className="h-px w-8 bg-gold/60" /> Venue &amp; Event Booking
          </p>
          <h2 className="font-serif text-4xl font-semibold leading-[1.05] text-cream">
            Book Michael Paulik for Your Venue
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-mute">
            <span className="text-mist">
              Bars, private events, weddings, festivals
            </span>{' '}
            — acoustic sets that fill a room and make people stay another round.
          </p>
        </div>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <ArtistCard />
          <div className="rounded-2xl border border-line bg-ink-2/60 p-6 sm:p-8">
            <BookingForm />
          </div>
        </div>
      </section>
    </>
  )
}
