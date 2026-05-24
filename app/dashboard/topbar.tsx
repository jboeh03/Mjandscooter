import Link from 'next/link'

export function TopBar({
  breadcrumb,
  title,
  subtitle,
  action,
}: {
  breadcrumb?: { label: string; href?: string }[]
  title: string
  subtitle?: string
  action?: React.ReactNode
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-line/70 bg-ink/85 px-5 py-4 backdrop-blur sm:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          {breadcrumb ? (
            <p className="mb-0.5 flex items-center gap-1.5 text-xs text-faint">
              {breadcrumb.map((b, i) => (
                <span key={b.label} className="flex items-center gap-1.5">
                  {b.href ? (
                    <Link href={b.href} className="hover:text-mute">
                      {b.label}
                    </Link>
                  ) : (
                    <span className={i === breadcrumb.length - 1 ? 'text-mute' : ''}>
                      {b.label}
                    </span>
                  )}
                  {i < breadcrumb.length - 1 && <span>›</span>}
                </span>
              ))}
            </p>
          ) : null}
          <h1 className="truncate font-serif text-2xl text-cream">{title}</h1>
          {subtitle ? (
            <p className="text-xs text-faint">{subtitle}</p>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <label className="hidden items-center gap-2 rounded-lg border border-line bg-surface/60 px-3 py-2 text-xs text-faint md:flex">
            <span aria-hidden>⌕</span>
            <input
              placeholder="Search songs, venues…"
              className="w-40 bg-transparent text-mist outline-none placeholder:text-faint"
            />
          </label>
          <button
            className="hidden h-9 w-9 items-center justify-center rounded-lg border border-line text-mute transition-colors hover:text-mist sm:flex"
            aria-label="Notifications"
          >
            <span className="relative" aria-hidden>
              🔔
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-gold" />
            </span>
          </button>
          {action}
        </div>
      </div>
    </header>
  )
}
