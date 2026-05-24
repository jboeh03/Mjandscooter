import Link from 'next/link'
import { SiteNav } from './site-nav'

function SiteFooter() {
  return (
    <footer className="border-t border-line/70 bg-ink-2">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm text-faint sm:flex-row">
        <span className="font-serif text-base text-mute">
          Michael Paulik — Live Acoustic · Cincinnati, OH
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
