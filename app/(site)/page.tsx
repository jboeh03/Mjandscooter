import Image from 'next/image'
import { BookingForm } from './booking-form'

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

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line/70 bg-gradient-to-br from-surface-3 via-[#0c1f2b] to-ink">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          background:
            'radial-gradient(ellipse 60% 80% at 80% 0%, rgba(201,164,77,0.22), transparent 60%)',
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -right-6 top-1/2 -translate-y-1/2 select-none font-serif text-[18vw] font-bold leading-none text-cream/[0.04]"
      >
        BOOKING
      </span>
      <div className="relative mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <p className="eyebrow mb-4 flex items-center gap-3">
          <span className="h-px w-8 bg-gold/60" /> Venue &amp; Event Booking
        </p>
        <h1 className="max-w-2xl font-serif text-5xl font-semibold leading-[1.05] text-cream sm:text-6xl">
          Book Michael Paulik for Your Venue
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-mute">
          <span className="text-mist">
            Bars, private events, weddings, festivals
          </span>{' '}
          — acoustic sets that fill a room and make people stay another round.
        </p>
      </div>
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

export default function BookingPage() {
  return (
    <>
      <Hero />
      <section className="mx-auto max-w-6xl px-6 py-16">
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
