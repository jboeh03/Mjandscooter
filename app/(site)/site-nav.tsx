'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Brand } from '@/components/brand'

const NAV = [
  { label: 'Shows', href: '/#shows' },
  { label: 'Book', href: '/#book' },
  { label: 'Live Now', href: '/live' },
]

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-30 transition-colors duration-300 ${
        scrolled
          ? 'border-b border-line/70 bg-ink/85 backdrop-blur'
          : 'border-b border-transparent bg-gradient-to-b from-ink/70 via-ink/30 to-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Brand />
        <div className="hidden items-center gap-9 text-[0.8rem] font-semibold uppercase tracking-[0.16em] md:flex">
          {NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-mist/80 transition-colors hover:text-gold"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <Link
          href="/#book"
          className="rounded-md bg-gold px-4 py-2 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-gold-bright"
        >
          Book Michael
        </Link>
      </nav>
    </header>
  )
}
