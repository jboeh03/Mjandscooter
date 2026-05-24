import Link from 'next/link'
import { DashboardNav } from './nav'

function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-line/70 bg-ink-2 py-6 lg:flex">
      <div className="px-6 pb-8">
        <Link href="/dashboard" className="block leading-none">
          <span className="font-serif text-lg font-semibold tracking-[0.14em] text-cream">
            MICHAEL PAULIK
          </span>
          <span className="mt-1 block text-[0.58rem] font-semibold uppercase tracking-[0.24em] text-gold/80">
            Artist Dashboard
          </span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto">
        <DashboardNav />
      </div>

      <div className="mx-3 mt-4 flex items-center gap-3 border-t border-line/70 px-3 pt-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/20 text-sm font-semibold text-gold">
          MP
        </span>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-mist">Michael Paulik</p>
          <p className="text-xs text-faint">Cincinnati, OH</p>
        </div>
      </div>
    </aside>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-ink">
      <Sidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}
