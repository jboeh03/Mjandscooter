'use client'

import { useActionState } from 'react'
import { submitBooking, type BookingState } from './actions'

const EVENT_TYPES = [
  'Wedding',
  'Corporate event',
  'Private party',
  'Birthday celebration',
  'Anniversary',
  'Bar / restaurant / venue',
  'Festival / public event',
  'Other',
]

const DURATIONS = [
  '1 hour',
  '2 hours',
  '3 hours',
  '4+ hours',
  'Multiple sets',
  'Not sure yet',
]

const REFERRALS = [
  'Saw you live',
  'Word of mouth',
  'Social media',
  'Web search',
  'Wedding / event planner',
  'Other',
]

const initialState: BookingState = { status: 'idle' }

const inputClass =
  'w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2.5 text-zinc-900 shadow-sm transition-colors placeholder:text-zinc-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30'

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p className="mt-1.5 text-sm text-red-600" aria-live="polite">
      {message}
    </p>
  )
}

export function BookingForm() {
  const [state, formAction, pending] = useActionState(
    submitBooking,
    initialState
  )

  if (state.status === 'success') {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500 text-2xl text-white">
          ♪
        </div>
        <h3 className="text-xl font-semibold text-zinc-900">
          Request received
        </h3>
        <p className="mt-2 text-zinc-700">{state.message}</p>
      </div>
    )
  }

  const v = state.values ?? {}
  const errors = state.errors ?? {}

  return (
    <form action={formAction} className="space-y-6" noValidate>
      {state.status === 'error' && state.message && (
        <div
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          aria-live="polite"
        >
          {state.message}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-zinc-800">
            Your name <span className="text-amber-600">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            defaultValue={v.name}
            aria-invalid={!!errors.name}
            className={inputClass}
            placeholder="Jamie Rivera"
          />
          <FieldError message={errors.name} />
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-zinc-800">
            Email <span className="text-amber-600">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            defaultValue={v.email}
            aria-invalid={!!errors.email}
            className={inputClass}
            placeholder="you@example.com"
          />
          <FieldError message={errors.email} />
        </div>

        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-zinc-800">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            defaultValue={v.phone}
            className={inputClass}
            placeholder="(555) 123-4567"
          />
        </div>

        <div>
          <label htmlFor="eventType" className="mb-1.5 block text-sm font-medium text-zinc-800">
            Event type <span className="text-amber-600">*</span>
          </label>
          <select
            id="eventType"
            name="eventType"
            defaultValue={v.eventType ?? ''}
            aria-invalid={!!errors.eventType}
            className={inputClass}
          >
            <option value="" disabled>
              Choose one…
            </option>
            {EVENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <FieldError message={errors.eventType} />
        </div>

        <div>
          <label htmlFor="eventDate" className="mb-1.5 block text-sm font-medium text-zinc-800">
            Event date <span className="text-amber-600">*</span>
          </label>
          <input
            id="eventDate"
            name="eventDate"
            type="date"
            defaultValue={v.eventDate}
            aria-invalid={!!errors.eventDate}
            className={inputClass}
          />
          <FieldError message={errors.eventDate} />
        </div>

        <div>
          <label htmlFor="eventTime" className="mb-1.5 block text-sm font-medium text-zinc-800">
            Start time
          </label>
          <input
            id="eventTime"
            name="eventTime"
            type="time"
            defaultValue={v.eventTime}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="duration" className="mb-1.5 block text-sm font-medium text-zinc-800">
            How long do you need us?
          </label>
          <select
            id="duration"
            name="duration"
            defaultValue={v.duration ?? ''}
            className={inputClass}
          >
            <option value="">Choose one…</option>
            {DURATIONS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="guests" className="mb-1.5 block text-sm font-medium text-zinc-800">
            Estimated guests
          </label>
          <input
            id="guests"
            name="guests"
            type="number"
            min={1}
            defaultValue={v.guests}
            className={inputClass}
            placeholder="120"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="location" className="mb-1.5 block text-sm font-medium text-zinc-800">
            Venue or city <span className="text-amber-600">*</span>
          </label>
          <input
            id="location"
            name="location"
            type="text"
            defaultValue={v.location}
            aria-invalid={!!errors.location}
            className={inputClass}
            placeholder="The Riverside Barn, Asheville NC"
          />
          <FieldError message={errors.location} />
        </div>

        <div>
          <label htmlFor="budget" className="mb-1.5 block text-sm font-medium text-zinc-800">
            Budget range
          </label>
          <input
            id="budget"
            name="budget"
            type="text"
            defaultValue={v.budget}
            className={inputClass}
            placeholder="$1,500 – $2,500"
          />
        </div>

        <div>
          <label htmlFor="referral" className="mb-1.5 block text-sm font-medium text-zinc-800">
            How did you hear about us?
          </label>
          <select
            id="referral"
            name="referral"
            defaultValue={v.referral ?? ''}
            className={inputClass}
          >
            <option value="">Choose one…</option>
            {REFERRALS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="details" className="mb-1.5 block text-sm font-medium text-zinc-800">
            Tell us about your event
          </label>
          <textarea
            id="details"
            name="details"
            rows={4}
            defaultValue={v.details}
            className={inputClass}
            placeholder="Song requests, vibe, schedule, anything else we should know…"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center rounded-full bg-amber-500 px-6 py-3.5 text-base font-semibold text-zinc-950 shadow-sm transition-colors hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {pending ? 'Sending…' : 'Request a date'}
      </button>
    </form>
  )
}
