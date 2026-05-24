'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

type Item = {
  label: string
  href?: string
  icon: string
  badge?: number
}

const SECTIONS: { title: string; items: Item[] }[] = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: '◎' },
      { label: 'Gigs', href: '/dashboard', icon: '🎫', badge: 3 },
      { label: 'Setlists', icon: '♬' },
    ],
  },
  {
    title: 'Content',
    items: [
      { label: 'Music Library', icon: '♫' },
      { label: 'Social', href: '/dashboard/social', icon: '📣' },
      { label: 'Marketing', href: '/dashboard/social', icon: '✦' },
    ],
  },
  {
    title: 'Insights',
    items: [
      { label: 'Analytics', icon: '📈' },
      { label: 'Settings', icon: '⚙' },
    ],
  },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="space-y-6 px-3">
      {SECTIONS.map((section) => (
        <div key={section.title}>
          <p className="px-3 pb-2 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-faint">
            {section.title}
          </p>
          <ul className="space-y-0.5">
            {section.items.map((item) => {
              const active = item.href === pathname
              const inner = (
                <span
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    active
                      ? 'bg-gold/12 font-semibold text-gold'
                      : item.href
                        ? 'text-mute hover:bg-surface hover:text-mist'
                        : 'cursor-default text-faint/70'
                  }`}
                >
                  <span className="w-4 text-center" aria-hidden>
                    {item.icon}
                  </span>
                  <span className="flex-1">{item.label}</span>
                  {item.badge ? (
                    <span className="rounded-full bg-gold/20 px-2 py-0.5 text-[0.65rem] font-bold text-gold">
                      {item.badge}
                    </span>
                  ) : null}
                </span>
              )
              return (
                <li key={item.label}>
                  {item.href ? <Link href={item.href}>{inner}</Link> : inner}
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}
