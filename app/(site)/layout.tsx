import Link from 'next/link'
import { Brand } from '@/components/brand'

const NAV = [
  { label: 'Shows', href: '/#shows' },
  { label: 'Music', href: '/#music' },
  { label: 'About', href: '/#about' },
  { label: 'Book Me', href: '/', active: true },
]

function SiteNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-ink/85 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Brand />
        <div className="hidden items-center gap-9 text-[0.8rem] font-semibold uppercase tracking-[0.16em] md:flex">
          {NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={
                item.active
                  ? 'text-gold'
                  : 'text-mute transition-colors hover:text-mist'
              }
            >
              {item.label}
            </Link>
          ))}
        </div>
        <Link
          href="/"
          className="rounded-md bg-gold px-4 py-2 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-gold-bright"
        >
          Book Marcus
        </Link>
      </nav>
    </header>
  )
}

function SiteFooter() {
  return (
    <footer className="border-t border-line/70 bg-ink-2">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm text-faint sm:flex-row">
        <span className="font-serif text-base text-mute">
          Marcus — Live Acoustic · Cincinnati, OH
        </span>
        <div className="flex items-center gap-5 text-xs uppercase tracking-[0.16em]">
          <Link href="/live" className="transition-colors hover:text-gold">
            Live Now
          </Link>
          <Link href="/dashboard" className="transition-colors hover:text-gold">
            Artist Login
          </Link>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  )
}

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-full flex-col">
      <SiteNav />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}
