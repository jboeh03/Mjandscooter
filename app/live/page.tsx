import Image from 'next/image'
import Link from 'next/link'
import { getActivity, getLiveGig, getSongs, timeAgo } from '@/lib/data'
import { RequestForm } from './request-form'
import { TipJar } from './tip-jar'

export const dynamic = 'force-dynamic'

function FauxQR() {
  return (
    <svg
      viewBox="0 0 100 100"
      className="h-14 w-14 rounded-md border border-line bg-ink p-1.5"
      aria-label="Scan QR"
    >
      <g fill="currentColor" className="text-gold">
        <path d="M0 0h28v28H0z" fillOpacity="0" />
        <path d="M4 4h20v20H4z" fill="none" stroke="currentColor" strokeWidth="6" />
        <path d="M72 4h20v20H72z" fill="none" stroke="currentColor" strokeWidth="6" />
        <path d="M4 72h20v20H4z" fill="none" stroke="currentColor" strokeWidth="6" />
        <rect x="40" y="6" width="6" height="6" />
        <rect x="52" y="6" width="6" height="6" />
        <rect x="40" y="18" width="6" height="6" />
        <rect x="60" y="40" width="6" height="6" />
        <rect x="40" y="40" width="6" height="6" />
        <rect x="6" y="40" width="6" height="6" />
        <rect x="18" y="52" width="6" height="6" />
        <rect x="40" y="60" width="6" height="6" />
        <rect x="52" y="52" width="6" height="6" />
        <rect x="72" y="52" width="6" height="6" />
        <rect x="84" y="40" width="6" height="6" />
        <rect x="72" y="72" width="6" height="6" />
        <rect x="84" y="84" width="6" height="6" />
        <rect x="52" y="84" width="6" height="6" />
        <rect x="40" y="84" width="6" height="6" />
      </g>
    </svg>
  )
}

function SetProgress({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center justify-between border-y border-line/70 py-3">
      <div className="flex items-center gap-3">
        <span className="label-caps text-mute">Set</span>
        <div className="flex gap-1.5">
          {Array.from({ length: total }).map((_, i) => (
            <span
              key={i}
              className={`h-2 w-2 rounded-full ${
                i < current ? 'bg-gold' : 'bg-line-2/60'
              }`}
            />
          ))}
        </div>
      </div>
      <span className="text-sm font-semibold text-mute">
        {current} / {total}
      </span>
    </div>
  )
}

function ActivityRow({
  initial,
  tone,
  children,
  when,
}: {
  initial: string
  tone: 'request' | 'tip'
  children: React.ReactNode
  when: string
}) {
  return (
    <li className="flex items-center gap-3 py-3">
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
          tone === 'tip'
            ? 'bg-tip/15 text-tip ring-1 ring-tip/40'
            : 'bg-teal-chip text-teal-ink ring-1 ring-teal-ink/30'
        }`}
      >
        {initial}
      </span>
      <p className="flex-1 text-sm text-mist">{children}</p>
      <span className="shrink-0 text-xs text-faint">{when}</span>
    </li>
  )
}

export default async function LivePage() {
  const gig = await getLiveGig()
  const [songs, activity] = await Promise.all([
    getSongs(),
    gig ? getActivity(gig.id) : Promise.resolve([]),
  ])
  const covers = songs.filter((s) => s.song_type === 'cover').map((s) => s.title)

  if (!gig) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 text-center">
        <div>
          <p className="font-serif text-2xl text-cream">No show running right now</p>
          <p className="mt-2 text-sm text-mute">Check back when Marcus is live.</p>
          <Link href="/" className="mt-6 inline-block text-sm text-gold">
            ← Back to booking
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="relative mx-auto min-h-screen max-w-md px-5 pb-16">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-64 overflow-hidden">
        <Image
          src="/marcus-neon.jpg"
          alt=""
          fill
          priority
          sizes="448px"
          className="object-cover object-top opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/80 to-ink" />
      </div>

      <div className="relative z-10">
      <header className="flex items-start justify-between pt-6">
        <div>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-live">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-live" />
            </span>
            Marcus is Live Now
          </p>
          <p className="mt-1 font-serif text-2xl text-gold">@ {gig.venue_name}</p>
        </div>
        <FauxQR />
      </header>

      <div className="mt-5">
        <SetProgress current={5} total={12} />
      </div>

      <section className="mt-8">
        <p className="eyebrow mb-3 flex items-center gap-3">
          <span className="h-px w-8 bg-gold/60" /> Make a Request
        </p>
        <h1 className="font-serif text-4xl text-cream">Request a Song</h1>
        <p className="mt-2 text-sm text-mute">
          If I know it, I’ll play it. If I don’t — I might just learn it.
        </p>
        <div className="mt-5">
          <RequestForm gigId={gig.id} covers={covers} />
        </div>
      </section>

      <div className="my-9 flex items-center gap-4">
        <span className="h-px flex-1 bg-line" />
        <span className="label-caps text-mute">Leave a Tip</span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <section>
        <h2 className="font-serif text-4xl text-cream">Enjoyed the show?</h2>
        <p className="mt-2 text-sm text-mute">
          Every tip helps keep the music going.
        </p>
        <div className="mt-5">
          <TipJar gigId={gig.id} />
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-line/70 bg-ink-2/50 p-5">
        <p className="eyebrow mb-1 flex items-center gap-2 text-gold">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" /> Live Activity
        </p>
        {activity.length === 0 ? (
          <p className="py-4 text-sm text-faint">
            No activity yet — be the first to request or tip.
          </p>
        ) : (
          <ul className="divide-y divide-line/60">
            {activity.map((item) =>
              item.kind === 'request' ? (
                <ActivityRow
                  key={item.id}
                  initial={item.name.charAt(0).toUpperCase()}
                  tone="request"
                  when={timeAgo(item.createdAt)}
                >
                  <span className="font-semibold text-mist">{item.name}</span>{' '}
                  requested{' '}
                  <span className="font-semibold text-gold">{item.song}</span> ♪
                </ActivityRow>
              ) : (
                <ActivityRow
                  key={item.id}
                  initial={item.name.charAt(0).toUpperCase()}
                  tone="tip"
                  when={timeAgo(item.createdAt)}
                >
                  <span className="font-semibold text-mist">{item.name}</span>{' '}
                  tipped{' '}
                  <span className="font-semibold text-tip">${item.amount}</span> ❤️
                </ActivityRow>
              )
            )}
          </ul>
        )}
      </section>
      </div>
    </div>
  )
}
