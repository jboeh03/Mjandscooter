'use client'

import { useActionState, useMemo, useState } from 'react'
import { submitBooking, type BookingState } from '@/app/actions'
import {
  findBookingConflict,
  gigsOnDate,
  type AvailabilityGig,
} from '@/lib/availability'

const VENUE_TYPES = [
  { value: 'Bar / Pub', label: 'Bar / Pub', icon: '🍺' },
  { value: 'Private Event', label: 'Private Event', icon: '🏠' },
  { value: 'Wedding', label: 'Wedding', icon: '💍' },
  { value: 'Corporate', label: 'Corporate', icon: '💼' },
  { value: 'Festival', label: 'Festival', icon: '🎪' },
  { value: 'Other', label: 'Other', icon: '—' },
]

const DURATIONS = [
  '1 hour',
  '2 hours',
  '3 hours',
  '4+ hours',
  'Multiple sets',
]

const initialState: BookingState = { status: 'idle' }

const inputClass =
  'w-full rounded-md border border-line bg-surface/60 px-3.5 py-2.5 text-sm text-mist shadow-sm outline-none transition-colors placeholder:text-faint focus:border-gold focus:ring-1 focus:ring-gold/40'

const labelClass =
  'mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-faint'

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p className="mt-1.5 text-xs text-live" aria-live="polite">
      {message}
    </p>
  )
}

function SectionHeading({
  icon,
  children,
}: {
  icon: string
  children: React.ReactNode
}) {
  return (
    <h3 className="mb-5 flex items-center gap-2.5 font-serif text-xl text-cream">
      <span className="text-gold">{icon}</span>
      {children}
    </h3>
  )
}

export function BookingForm({ gigs = [] }: { gigs?: AvailabilityGig[] }) {
  const [state, formAction, pending] = useActionState(
    submitBooking,
    initialState
  )
  const [venueType, setVenueType] = useState('Bar / Pub')
  const [guests, setGuests] = useState(75)
  const [eventDate, setEventDate] = useState(state.values?.eventDate ?? '')
  const [startTime, setStartTime] = useState(state.values?.startTime ?? '')
  const [duration, setDuration] = useState(state.values?.duration || '2 hours')

  const conflict = useMemo(
    () => findBookingConflict(gigs, eventDate, startTime, duration),
    [gigs, eventDate, startTime, duration]
  )
  const sameDay = useMemo(() => gigsOnDate(gigs, eventDate), [gigs, eventDate])

  if (state.status === 'success') {
    return (
      <div className="rounded-2xl border border-gold/30 bg-surface p-10 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gold text-2xl text-ink">
          ♪
        </div>
        <h3 className="font-serif text-2xl text-cream">Request received</h3>
        <p className="mt-3 text-sm leading-relaxed text-mute">{state.message}</p>
      </div>
    )
  }

  const v = state.values ?? {}
  const errors = state.errors ?? {}

  return (
    <form action={formAction} className="space-y-10" noValidate>
      {state.status === 'error' && state.message && (
        <div className="rounded-md border border-live/40 bg-live/10 px-4 py-3 text-sm text-live">
          {state.message}
        </div>
      )}

      <section>
        <SectionHeading icon="👤">Your Information</SectionHeading>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className={labelClass}>
              Your name *
            </label>
            <input
              id="name"
              name="name"
              defaultValue={v.name}
              className={inputClass}
              placeholder="Jane Smith"
            />
            <FieldError message={errors.name} />
          </div>
          <div>
            <label htmlFor="venueName" className={labelClass}>
              Venue name
            </label>
            <input
              id="venueName"
              name="venueName"
              defaultValue={v.venueName}
              className={inputClass}
              placeholder="The Blue Owl Bar"
            />
          </div>
          <div>
            <label htmlFor="email" className={labelClass}>
              Email *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={v.email}
              className={inputClass}
              placeholder="jane@blueowl.com"
            />
            <FieldError message={errors.email} />
          </div>
          <div>
            <label htmlFor="phone" className={labelClass}>
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={v.phone}
              className={inputClass}
              placeholder="(513) 555-0123"
            />
          </div>
        </div>
      </section>

      <section>
        <SectionHeading icon="📖">Event Details</SectionHeading>

        <input type="hidden" name="venueType" value={venueType} />
        <div className="mb-1.5">
          <span className={labelClass}>Venue type *</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {VENUE_TYPES.map((t) => {
            const active = venueType === t.value
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => setVenueType(t.value)}
                className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.1em] transition-colors ${
                  active
                    ? 'border-gold bg-gold/10 text-gold'
                    : 'border-line text-mute hover:border-line-2 hover:text-mist'
                }`}
              >
                <span aria-hidden>{t.icon}</span>
                {t.label}
              </button>
            )
          })}
        </div>
        <FieldError message={errors.venueType} />

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="eventDate" className={labelClass}>
              Event date *
            </label>
            <input
              id="eventDate"
              name="eventDate"
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className={`${inputClass} [color-scheme:dark] ${
                conflict ? 'border-live focus:border-live focus:ring-live/40' : ''
              }`}
            />
            <FieldError message={errors.eventDate} />
          </div>
          <div>
            <label htmlFor="startTime" className={labelClass}>
              Start time
            </label>
            <input
              id="startTime"
              name="startTime"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className={`${inputClass} [color-scheme:dark] ${
                conflict ? 'border-live focus:border-live focus:ring-live/40' : ''
              }`}
            />
          </div>
          <div>
            <label htmlFor="duration" className={labelClass}>
              Duration
            </label>
            <select
              id="duration"
              name="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className={inputClass}
            >
              {DURATIONS.map((d) => (
                <option key={d} value={d} className="bg-surface">
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div>
            <span className={labelClass}>Expected guest count</span>
            <input type="hidden" name="guestCount" value={guests} />
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setGuests((g) => Math.max(0, g - 5))}
                className="flex h-10 w-10 items-center justify-center rounded-md border border-line text-lg text-mute transition-colors hover:border-gold hover:text-gold"
                aria-label="Decrease guests"
              >
                −
              </button>
              <span className="min-w-[3ch] text-center font-serif text-2xl text-cream">
                {guests}
              </span>
              <button
                type="button"
                onClick={() => setGuests((g) => g + 5)}
                className="flex h-10 w-10 items-center justify-center rounded-md border border-line text-lg text-mute transition-colors hover:border-gold hover:text-gold"
                aria-label="Increase guests"
              >
                +
              </button>
              <span className="text-xs text-faint">guests</span>
            </div>
          </div>
        </div>

        {conflict ? (
          <div className="mt-4 flex items-start gap-2.5 rounded-md border border-live/40 bg-live/10 px-4 py-3 text-sm text-live">
            <span aria-hidden>⚠</span>
            <span>
              Michael already has a show that day —{' '}
              <strong className="font-semibold">{conflict.venue_name}</strong>
              {conflict.start_time ? `, ${conflict.start_time}` : ''}
              {conflict.end_time ? `–${conflict.end_time}` : ''}. Please choose a
              start time at least an hour before or after, or pick another date.
            </span>
          </div>
        ) : sameDay.length > 0 ? (
          <div className="mt-4 flex items-start gap-2.5 rounded-md border border-gold/30 bg-gold/[0.06] px-4 py-3 text-sm text-mute">
            <span aria-hidden className="text-gold">
              ♪
            </span>
            <span>
              Heads up — there’s already a show that day (
              {sameDay[0].venue_name}
              {sameDay[0].start_time ? `, ${sameDay[0].start_time}` : ''}
              {sameDay[0].end_time ? `–${sameDay[0].end_time}` : ''}).{' '}
              {startTime
                ? 'Your selected time looks clear.'
                : 'Add a start time and we’ll make sure it doesn’t clash.'}
            </span>
          </div>
        ) : null}

        <div className="mt-6">
          <label htmlFor="message" className={labelClass}>
            Anything else?
          </label>
          <textarea
            id="message"
            name="message"
            rows={3}
            defaultValue={v.message}
            className={inputClass}
            placeholder="Set length, song requests, the vibe you're after…"
          />
        </div>
      </section>

      <button
        type="submit"
        disabled={pending || Boolean(conflict)}
        className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-gold px-6 py-3.5 text-sm font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-gold-bright disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending
          ? 'Sending…'
          : conflict
            ? 'Pick a conflict-free time'
            : 'Send Booking Request'}
      </button>
    </form>
  )
}
