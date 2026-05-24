'use client'

import { useActionState, useEffect, useRef } from 'react'
import { submitSongRequest, type RequestState } from '@/app/actions'

const initialState: RequestState = { status: 'idle' }

export function RequestForm({
  gigId,
  covers,
}: {
  gigId: string
  covers: string[]
}) {
  const [state, formAction, pending] = useActionState(
    submitSongRequest,
    initialState
  )
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.status === 'success') formRef.current?.reset()
  }, [state])

  return (
    <form ref={formRef} action={formAction} className="space-y-3">
      <input type="hidden" name="gigId" value={gigId} />

      <input
        name="songTitle"
        placeholder="Song title..."
        className="w-full rounded-lg border border-line bg-surface/70 px-4 py-3.5 text-mist outline-none transition-colors placeholder:text-faint focus:border-gold focus:ring-1 focus:ring-gold/40"
      />

      <div className="relative">
        <select
          name="coverPick"
          defaultValue=""
          className="w-full appearance-none rounded-lg border border-line bg-surface/70 px-4 py-3.5 text-mist outline-none transition-colors focus:border-gold focus:ring-1 focus:ring-gold/40"
        >
          <option value="" className="bg-surface text-faint">
            — Or pick a popular cover —
          </option>
          {covers.map((c) => (
            <option key={c} value={c} className="bg-surface text-mist">
              {c}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-faint">
          ▾
        </span>
      </div>

      <input
        name="requesterName"
        placeholder="Your name (optional)"
        className="w-full rounded-lg border border-line bg-surface/70 px-4 py-3.5 text-mist outline-none transition-colors placeholder:text-faint focus:border-gold focus:ring-1 focus:ring-gold/40"
      />

      {state.status === 'success' && (
        <p className="rounded-lg border border-tip/40 bg-tip/10 px-4 py-2.5 text-center text-sm text-tip">
          {state.message}
        </p>
      )}
      {state.status === 'error' && (
        <p className="rounded-lg border border-live/40 bg-live/10 px-4 py-2.5 text-center text-sm text-live">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-gold py-4 text-sm font-bold uppercase tracking-[0.16em] text-ink transition-colors hover:bg-gold-bright disabled:opacity-60"
      >
        <span aria-hidden>♪</span>
        {pending ? 'Sending…' : 'Send Request'}
      </button>
    </form>
  )
}
