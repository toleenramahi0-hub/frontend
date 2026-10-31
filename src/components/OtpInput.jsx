import { useRef } from 'react'

/**
 * Six one-digit boxes (`.otp`). Typing moves forward, Backspace on an empty box moves
 * back, and pasting a whole code fills the boxes from the current one.
 */
export default function OtpInput({ value, onChange, length = 6 }) {
  const refs = useRef([])

  function handle(i, raw) {
    const digits = raw.replace(/\D/g, '')
    const next = [...value]
    let last = i
    if (digits.length <= 1) {
      next[i] = digits
    } else {
      // Paste or fast typing: if the box already held a digit, keep it and continue after it.
      const start = value[i] && digits.startsWith(value[i]) ? i + 1 : i
      const fresh = start > i ? digits.slice(1) : digits
      ;[...fresh].slice(0, length - start).forEach((d, k) => {
        next[start + k] = d
        last = start + k
      })
    }
    onChange(next)
    if (digits) refs.current[Math.min(last + 1, length - 1)]?.focus()
  }

  return (
    <div className="otp" dir="ltr">
      {value.map((d, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          value={d}
          aria-label={`الرقم ${i + 1}`}
          autoFocus={i === 0}
          onChange={(e) => handle(i, e.target.value)}
          onKeyDown={(e) => e.key === 'Backspace' && !d && i > 0 && refs.current[i - 1]?.focus()}
        />
      ))}
    </div>
  )
}
