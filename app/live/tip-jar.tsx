'use client'

import { useActionState, useState, startTransition } from 'react'
import { submitTip, type TipState } from '@/app/actions'

const initialState: TipState = { status: 'idle' }

const PRESETS = [
  { amount: 1, label: 'Thanks!' },
  { amount: 5, label: 'Cheers 🍺' },
  { amount: 10, label: 'You Rock' },
]

export function TipJar({ gigId }: { gigId: string }) {
  const [state, formAction, pending] = useActionState(submitTip, initialState)
  const [amount, setAmount] = useState<number | null>(5)
  const [customOpen, setCustomOpen] = useState(false)
  const [custom, setCustom] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  const effectiveAmount = customOpen ? Number(custom) : amount

  function pay(method: string) {
    if (!effectiveAmount || effectiveAmount <= 0) {
      setLocalError('Choose a tip amount first.')
      return
    }
    setLocalError(null)
    const fd = new FormData()
    fd.set('gigId', gigId)
    fd.set('amount', String(effectiveAmount))
    fd.set('method', method)
    startTransition(() => formAction(fd))
  }

  const tileBase =
    'flex flex-col items-center justify-center rounded-xl border py-7 transition-colors'

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {PRESETS.map((p) => {
          const active = !customOpen && amount === p.amount
          return (
            <button
              key={p.amount}
              type="button"
              onClick={() => {
                setCustomOpen(false)
                setAmount(p.amount)
                setLocalError(null)
              }}
              className={`${tileBase} ${
                active
                  ? 'border-gold bg-gold/10'
                  : 'border-line bg-surface/60 hover:border-line-2'
              }`}
            >
              <span className="font-serif text-3xl text-gold">${p.amount}</span>
              <span className="mt-1 text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-mute">
                {p.label}
              </span>
            </button>
          )
        })}

        <button
          type="button"
          onClick={() => {
            setCustomOpen(true)
            setLocalError(null)
          }}
          className={`${tileBase} border-dashed ${
            customOpen
              ? 'border-gold bg-gold/10'
              : 'border-line text-faint hover:border-line-2'
          }`}
        >
          {customOpen ? (
            <div className="flex items-center text-gold">
              <span className="font-serif text-3xl">$</span>
              <input
                autoFocus
                inputMode="decimal"
                value={custom}
                onChange={(e) =>
                  setCustom(e.target.value.replace(/[^0-9.]/g, ''))
                }
                placeholder="?"
                className="w-16 bg-transparent text-center font-serif text-3xl text-gold outline-none placeholder:text-gold/50"
              />
            </div>
          ) : (
            <>
              <span className="font-serif text-3xl text-faint">$?</span>
              <span className="mt-1 text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-faint">
                Other
              </span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => pay('venmo')}
          disabled={pending}
          className="flex items-center gap-3 rounded-xl border border-line bg-surface/60 px-4 py-3 text-left transition-colors hover:border-venmo/60 disabled:opacity-60"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-venmo font-bold text-white">
            V
          </span>
          <span>
            <span className="block text-sm font-semibold text-mist">Venmo</span>
            <span className="block text-xs text-faint">@marcus-music</span>
          </span>
        </button>
        <button
          type="button"
          onClick={() => pay('cashapp')}
          disabled={pending}
          className="flex items-center gap-3 rounded-xl border border-line bg-surface/60 px-4 py-3 text-left transition-colors hover:border-cashapp/60 disabled:opacity-60"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cashapp font-bold text-white">
            $
          </span>
          <span>
            <span className="block text-sm font-semibold text-mist">CashApp</span>
            <span className="block text-xs text-faint">$marcusacoustic</span>
          </span>
        </button>
      </div>

      <button
        type="button"
        onClick={() => pay('applepay')}
        disabled={pending}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-cream py-4 text-lg font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        <span aria-hidden className="text-xl"></span> Pay
      </button>

      {localError && (
        <p className="text-center text-sm text-live">{localError}</p>
      )}
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
    </div>
  )
}
