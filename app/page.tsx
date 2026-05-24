import { BookingForm } from './booking-form'

const EVENTS = [
  {
    title: 'Weddings',
    blurb:
      'Ceremony, cocktail hour, and first dance — we read the room and keep the floor moving all night.',
  },
  {
    title: 'Corporate events',
    blurb:
      'Polished, professional, and on-brand. Background sets for receptions or a full show for the after-party.',
  },
  {
    title: 'Private parties',
    blurb:
      'Birthdays, anniversaries, backyard bashes — an intimate solo set tailored to your crowd.',
  },
  {
    title: 'Bars & venues',
    blurb:
      'A reliable, draw-building live act with a deep, crowd-pleasing catalog and zero drama.',
  },
  {
    title: 'Festivals',
    blurb:
      'High-energy outdoor sets, fully self-contained PA, and the stage presence to hold a crowd.',
  },
  {
    title: 'Something else',
    blurb:
      'Brand launches, fundraisers, holiday parties — if there are people and a moment, we can score it.',
  },
]

const STATS = [
  { value: '300+', label: 'shows played' },
  { value: '8 yrs', label: 'performing' },
  { value: '200+', label: 'songs in rotation' },
]

const TESTIMONIALS = [
  {
    quote:
      'Mike read our wedding crowd perfectly. Grandparents and college friends were all on the floor by the second song.',
    name: 'Dana & Theo',
    detail: 'Wedding · Asheville, NC',
  },
  {
    quote:
      'Professional from the first email to load-out. Our guests are still asking who was playing.',
    name: 'Priya M.',
    detail: 'Corporate gala · Charlotte, NC',
  },
]

function Nav() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-zinc-950/80 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <a href="#top" className="text-lg font-bold tracking-tight text-white">
          Mike
        </a>
        <div className="hidden items-center gap-8 text-sm font-medium text-zinc-300 sm:flex">
          <a href="#about" className="transition-colors hover:text-white">
            About
          </a>
          <a href="#events" className="transition-colors hover:text-white">
            Events
          </a>
          <a href="#praise" className="transition-colors hover:text-white">
            Praise
          </a>
        </div>
        <a
          href="#book"
          className="rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-zinc-950 transition-colors hover:bg-amber-400"
        >
          Book us
        </a>
      </nav>
    </header>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-zinc-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(245,158,11,0.18),_transparent_55%)]" />
      <div className="relative mx-auto max-w-5xl px-6 py-24 sm:py-32">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-amber-400">
          Live music
        </p>
        <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-6xl">
          The right songs, the right room, the whole night.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-300">
          Mike is a singer and guitarist playing weddings, private parties, and
          venues. One voice, real instruments, and a catalog built to keep your
          people dancing.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a
            href="#book"
            className="inline-flex items-center justify-center rounded-full bg-amber-500 px-7 py-3.5 text-base font-semibold text-zinc-950 transition-colors hover:bg-amber-400"
          >
            Check your date
          </a>
          <a
            href="#events"
            className="inline-flex items-center justify-center rounded-full border border-white/20 px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-white/10"
          >
            See what we play
          </a>
        </div>
        <dl className="mt-16 grid max-w-lg grid-cols-3 gap-6">
          {STATS.map((s) => (
            <div key={s.label}>
              <dt className="text-3xl font-bold text-white">{s.value}</dt>
              <dd className="mt-1 text-sm text-zinc-400">{s.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

function About() {
  return (
    <section id="about" className="bg-white py-20 sm:py-28">
      <div className="mx-auto grid max-w-5xl gap-12 px-6 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            One musician, no filler
          </h2>
          <p className="mt-6 text-lg leading-8 text-zinc-600">
            Mike sings and plays guitar, covering everything from Motown and 90s
            radio to today&apos;s singalongs — arranged for a solo set so it
            never sounds thin.
          </p>
          <p className="mt-4 text-lg leading-8 text-zinc-600">
            I bring my own PA, dress for your event, and build a setlist with you
            ahead of time. You get one point of contact and a musician who shows
            up early.
          </p>
        </div>
        <ul className="space-y-4">
          {[
            'Pro-grade PA and lighting included',
            'Custom setlist + your must-play songs',
            'Acoustic ceremony sets to full dance party',
            'Fully insured, reliable, easy to work with',
          ].map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 rounded-xl border border-zinc-100 bg-zinc-50 px-5 py-4"
            >
              <span className="mt-0.5 text-amber-500" aria-hidden>
                ♪
              </span>
              <span className="text-zinc-800">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Events() {
  return (
    <section id="events" className="bg-zinc-50 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            Events we play
          </h2>
          <p className="mt-4 text-lg leading-8 text-zinc-600">
            Whatever the occasion, we tailor the sound and the energy to fit.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {EVENTS.map((e) => (
            <div
              key={e.title}
              className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <h3 className="text-lg font-semibold text-zinc-900">{e.title}</h3>
              <p className="mt-2 text-zinc-600">{e.blurb}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Testimonials() {
  return (
    <section id="praise" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
          What hosts say
        </h2>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="rounded-2xl border border-zinc-200 bg-zinc-50 p-8"
            >
              <blockquote className="text-lg leading-8 text-zinc-800">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6">
                <div className="font-semibold text-zinc-900">{t.name}</div>
                <div className="text-sm text-zinc-500">{t.detail}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

function BookingSection() {
  return (
    <section id="book" className="bg-zinc-950 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Check your date
          </h2>
          <p className="mt-4 text-lg leading-8 text-zinc-300">
            Tell us about your event and I&apos;ll reply within 48 hours with
            availability and a quote.
          </p>
        </div>
        <div className="mt-12 rounded-3xl bg-white p-6 shadow-xl sm:p-10">
          <BookingForm />
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-white/10">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-zinc-400 sm:flex-row">
        <span>Mike — live music for every occasion</span>
        <span>© {new Date().getFullYear()} Mike</span>
      </div>
    </footer>
  )
}

export default function Home() {
  return (
    <div id="top" className="flex-1">
      <Nav />
      <main>
        <Hero />
        <About />
        <Events />
        <Testimonials />
        <BookingSection />
      </main>
      <Footer />
    </div>
  )
}
