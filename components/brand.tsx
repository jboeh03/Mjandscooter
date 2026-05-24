import Link from 'next/link'

export function Brand({
  href = '/',
  subtitle,
  className = '',
}: {
  href?: string
  subtitle?: string
  className?: string
}) {
  return (
    <Link href={href} className={`group inline-flex flex-col leading-none ${className}`}>
      <span className="font-serif text-xl font-semibold tracking-[0.18em] text-cream">
        MARCUS
      </span>
      {subtitle ? (
        <span className="mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.28em] text-gold/80">
          {subtitle}
        </span>
      ) : null}
    </Link>
  )
}
