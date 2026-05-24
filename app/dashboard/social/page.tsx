import { getGigs, getLiveGig } from '@/lib/data'
import { TopBar } from '../topbar'

export const dynamic = 'force-dynamic'

const PLATFORMS = [
  { name: 'Instagram', icon: '📷', connected: true, tint: 'text-pink-400' },
  { name: 'Facebook', icon: 'f', connected: true, tint: 'text-blue-400' },
  { name: 'TikTok', icon: '♪', connected: false, tint: 'text-mist' },
  { name: 'Spotify', icon: '♫', connected: false, tint: 'text-tip' },
]

const ENGAGEMENT = [
  { venue: "Pearl's Bar & Grill", date: 'Tonight · Jun 14', pct: 8.2 },
  { venue: "Molly Malone's", date: 'May 31 · OTR', pct: 7.4 },
  { venue: "Sitwell's Coffee", date: 'May 17 · Clifton', pct: 5.8 },
  { venue: 'Woodward Theater', date: 'May 3 · OTR', pct: 9.1 },
]

const CONTENT_TYPES = [
  { label: 'Behind-the-Scenes Video', sub: 'Reels & Stories', pct: 9.4, rank: '#1 Best' },
  { label: 'Stage / Performance Photo', sub: 'Feed posts', pct: 7.6, rank: '#2' },
  { label: 'Song Clip + Caption', sub: 'Reels', pct: 6.9, rank: '#3' },
]

function PhonePreview({ handle, tone }: { handle: string; tone: string }) {
  return (
    <div className="mx-auto w-32 overflow-hidden rounded-2xl border border-line bg-ink p-1.5">
      <div className="rounded-xl bg-surface-2">
        <div className="flex items-center gap-1.5 px-2 py-1.5">
          <span className="h-4 w-4 rounded-full bg-gold/40" />
          <span className="text-[0.55rem] text-mist">{handle}</span>
        </div>
        <div
          className="relative h-28"
          style={{
            background: `linear-gradient(160deg, ${tone}, #07111a)`,
          }}
        >
          <span className="absolute inset-0 flex items-center justify-center text-2xl opacity-70">
            🎸
          </span>
        </div>
        <div className="space-y-1 p-2">
          <span className="block h-1.5 w-3/4 rounded bg-line-2/60" />
          <span className="block h-1.5 w-1/2 rounded bg-line-2/40" />
        </div>
      </div>
    </div>
  )
}

function PostCard({
  platform,
  icon,
  when,
  caption,
  handle,
  tone,
  draft,
  connectOnly,
}: {
  platform: string
  icon: string
  when: string
  caption: string
  handle: string
  tone: string
  draft?: boolean
  connectOnly?: boolean
}) {
  return (
    <div className="flex flex-col rounded-xl border border-line bg-surface/40 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm font-semibold text-mist">
          <span aria-hidden>{icon}</span> {platform}
        </span>
        <span
          className={`rounded px-2 py-0.5 text-[0.58rem] font-semibold uppercase tracking-[0.1em] ${
            draft ? 'bg-surface-2 text-faint' : 'bg-gold/15 text-gold'
          }`}
        >
          {when}
        </span>
      </div>

      <PhonePreview handle={handle} tone={tone} />

      <p className="mt-3 text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-faint">
        Caption
      </p>
      <p className="mt-1 flex-1 whitespace-pre-line text-xs leading-relaxed text-mute">
        {caption}
      </p>

      <div className="mt-3 flex gap-2">
        {connectOnly ? (
          <>
            <button className="flex-1 rounded-md border border-line py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-mute hover:text-mist">
              ✎ Edit
            </button>
            <button className="flex-1 rounded-md border border-line py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-mute hover:text-mist">
              Connect TikTok
            </button>
          </>
        ) : (
          <>
            <button className="flex-1 rounded-md border border-line py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-mute hover:text-mist">
              ✎ Edit
            </button>
            <button className="flex-1 rounded-md border border-line py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-mute hover:text-mist">
              Schedule
            </button>
          </>
        )}
        <button className="flex-1 rounded-md bg-gold py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.1em] text-ink hover:bg-gold-bright">
          Post Now
        </button>
      </div>
    </div>
  )
}

function PerfStat({ value, label, delta }: { value: string; label: string; delta: string }) {
  return (
    <div>
      <p className="font-serif text-xl text-cream">{value}</p>
      <p className="text-[0.55rem] uppercase tracking-[0.1em] text-faint">{label}</p>
      <p className="text-[0.62rem] text-tip">↑ {delta}</p>
    </div>
  )
}

export default async function SocialPage() {
  const gig = await getLiveGig()
  await getGigs()
  const venue = gig?.venue_name ?? "Pearl's Bar & Grill"
  const hood = gig?.neighborhood ?? 'Hyde Park'
  const start = gig?.start_time ?? '8:00 PM'
  const end = gig?.end_time ?? '11:00 PM'

  const igCaption = `🎸 Playing tonight at ${venue} in ${hood}! Come hang, grab a drink, and let's make some memories. ${start} start — no cover, no fuss. Just good music in a great room.\n#CincinnatiMusic #LiveAcoustic #${hood.replace(/\s/g, '')} #LocalMusic`
  const fbCaption = `TONIGHT — Live acoustic at ${venue}, ${hood}. 🎵\n\nCome hang with us from ${start}–${end}. No cover. Good drinks. Real music — if you've been meaning to catch a show, this is the one.\n#Cincinnati #LiveMusic`
  const ttCaption = `POV: You found out your favorite bar has live music tonight 🎸 Come through ${venue} in ${hood}, Cincinnati — ${start}, no cover.\n#fyp #livemusic #cincinnati #acoustic`

  return (
    <>
      <TopBar
        breadcrumb={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Social & Marketing' }]}
        title="Social & Marketing"
        action={
          <button className="rounded-md bg-gold px-4 py-2 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-gold-bright">
            ✦ Generate All Posts
          </button>
        }
      />

      <div className="grid gap-6 px-5 py-6 sm:px-8 xl:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {/* Connected accounts */}
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-surface/40 px-4 py-3">
            <span className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-faint">
              Connected
            </span>
            {PLATFORMS.map((p) => (
              <span
                key={p.name}
                className="flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-xs"
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${p.connected ? 'bg-tip' : 'bg-faint'}`}
                />
                <span aria-hidden className={p.tint}>{p.icon}</span>
                <span className={p.connected ? 'text-mist' : 'text-faint'}>
                  {p.name}
                  {p.connected ? '' : ' — Connect'}
                </span>
              </span>
            ))}
            <button className="ml-auto rounded-md border border-line px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-mute hover:text-mist">
              Manage Accounts
            </button>
          </div>

          {/* Tabs + gig selector */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex rounded-md border border-line p-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.1em]">
              <span className="rounded bg-gold px-3 py-1 text-ink">Upcoming</span>
              <span className="px-3 py-1 text-mute">Past</span>
            </div>
            <span className="flex items-center gap-2 rounded-md border border-line bg-surface/60 px-3 py-1.5 text-xs text-mist">
              Gig: {venue} ▾
            </span>
            <span className="ml-auto flex gap-2">
              <span className="rounded-md border border-line px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.1em] text-gold">
                ✦ AI-Generated
              </span>
              <button className="rounded-md border border-line px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.1em] text-mute hover:text-mist">
                ↻ Refresh
              </button>
            </span>
          </div>

          {/* Tonight banner */}
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-gold/30 bg-gold/[0.06] px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="text-gold">🎸</span>
              <div>
                <p className="text-sm font-semibold text-cream">Tonight’s Gig — {venue}</p>
                <p className="text-xs text-faint">
                  {gig?.address}, {hood} · {gig?.city}
                </p>
              </div>
            </div>
            <span className="text-xs text-gold">🕗 {start} – {end}</span>
          </div>

          {/* Posts */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="eyebrow flex items-center gap-2">
                  <span className="h-px w-6 bg-gold/60" /> AI-Generated
                </p>
                <h2 className="mt-1 font-serif text-xl text-cream">This Week’s Gig Posts</h2>
              </div>
              <button className="rounded-md border border-line px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.1em] text-mute hover:text-mist">
                ↻ Regenerate
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <PostCard platform="Instagram" icon="📷" when="5:00 PM Today" handle="marcusacoustic" tone="#3a2030" caption={igCaption} />
              <PostCard platform="Facebook" icon="f" when="4:30 PM Today" handle="Marcus Acoustic" tone="#102a3a" caption={fbCaption} />
              <PostCard platform="TikTok" icon="♪" when="Draft" handle="@marcusacoustic" tone="#241a30" caption={ttCaption} draft connectOnly />
            </div>
          </section>

          {/* Marketing materials */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="eyebrow flex items-center gap-2">
                  <span className="h-px w-6 bg-gold/60" /> Printable &amp; Digital
                </p>
                <h2 className="mt-1 font-serif text-xl text-cream">Marketing Materials</h2>
              </div>
              <button className="rounded-md bg-gold px-3 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.1em] text-ink hover:bg-gold-bright">
                ✦ Generate New Flyer
              </button>
            </div>
            <div className="flex items-center gap-4 rounded-xl border border-line bg-surface/40 p-4">
              <div
                className="flex h-28 w-20 shrink-0 flex-col items-center justify-center rounded-lg border border-line text-center"
                style={{ background: 'linear-gradient(160deg,#16303d,#07111a)' }}
              >
                <span className="font-serif text-xs text-gold">MARCUS</span>
                <span className="mt-1 text-[0.5rem] uppercase tracking-widest text-mute">Live</span>
                <span className="mt-2 text-lg">🎸</span>
              </div>
              <div>
                <p className="font-serif text-base text-cream">{venue} — Tonight</p>
                <p className="mt-1 text-xs text-faint">
                  📍 {hood}, Cincinnati · 🕗 {start}–{end} · 💲 No Cover
                </p>
                <div className="mt-3 flex gap-2">
                  <button className="rounded-md border border-line px-3 py-1 text-[0.62rem] uppercase tracking-[0.1em] text-mute hover:text-mist">
                    Download PNG
                  </button>
                  <button className="rounded-md border border-line px-3 py-1 text-[0.62rem] uppercase tracking-[0.1em] text-mute hover:text-mist">
                    Print
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right column: analytics */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-line bg-surface/40 p-5">
            <h3 className="font-serif text-lg text-cream">Social Performance</h3>
            <p className="mb-4 text-xs text-faint">Last 30 days across all platforms</p>
            <div className="grid grid-cols-3 gap-3">
              <PerfStat value="4.2K" label="Followers" delta="+218" />
              <PerfStat value="6.8%" label="Avg Eng." delta="+1.2%" />
              <PerfStat value="31K" label="Reach" delta="+4.1K" />
            </div>

            <p className="mb-1 mt-5 text-[0.58rem] uppercase tracking-[0.12em] text-faint">
              Follower growth — last 12 weeks
            </p>
            <svg viewBox="0 0 240 60" className="h-16 w-full">
              <polyline
                fill="none"
                stroke="var(--color-gold)"
                strokeWidth="2"
                points="0,52 24,50 48,46 72,44 96,38 120,34 144,30 168,24 192,18 216,12 240,6"
              />
              <polygon
                fill="var(--color-gold)"
                fillOpacity="0.08"
                points="0,52 24,50 48,46 72,44 96,38 120,34 144,30 168,24 192,18 216,12 240,6 240,60 0,60"
              />
            </svg>

            <div className="mt-4 space-y-2">
              <p className="text-[0.58rem] uppercase tracking-[0.12em] text-faint">By Platform</p>
              {[
                ['📷 Instagram', '2.8K', 'bg-pink-400', '70%'],
                ['f Facebook', '1.4K', 'bg-blue-400', '40%'],
                ['♪ TikTok', '—', 'bg-line-2', '8%'],
              ].map(([label, val, color, w]) => (
                <div key={label} className="flex items-center gap-2 text-xs">
                  <span className="w-20 text-mute">{label}</span>
                  <span className="h-1.5 flex-1 rounded-full bg-line/60">
                    <span className={`block h-full rounded-full ${color}`} style={{ width: w }} />
                  </span>
                  <span className="w-8 text-right text-mist">{val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-surface/40 p-5">
            <h3 className="font-serif text-lg text-cream">Gig Post Engagement</h3>
            <p className="mb-4 text-xs text-faint">Last 4 shows · avg engagement rate</p>
            <div className="space-y-3">
              {ENGAGEMENT.map((e) => (
                <div key={e.venue}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-mist">{e.venue}</span>
                    <span className="text-gold">{e.pct}%</span>
                  </div>
                  <span className="block h-1.5 rounded-full bg-line/60">
                    <span
                      className="block h-full rounded-full bg-gold"
                      style={{ width: `${(e.pct / 10) * 100}%` }}
                    />
                  </span>
                  <p className="mt-0.5 text-[0.62rem] text-faint">{e.date}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-surface/40 p-5">
            <h3 className="font-serif text-lg text-cream">Top Content Types</h3>
            <p className="mb-4 text-xs text-faint">Ranked by engagement</p>
            <ul className="space-y-3">
              {CONTENT_TYPES.map((c) => (
                <li key={c.label} className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-md bg-surface-2 text-xs text-gold">
                    ▶
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm text-mist">{c.label}</span>
                    <span className="block text-[0.62rem] text-faint">{c.sub}</span>
                  </span>
                  <span className="text-right">
                    <span className="block text-sm font-semibold text-gold">{c.pct}%</span>
                    <span className="block text-[0.58rem] text-faint">{c.rank}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}
