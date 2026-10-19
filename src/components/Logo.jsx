import { Link } from 'react-router-dom'
import './Logo.css'

/**
 * variant="light": white wordmark with tagline, for photo backgrounds (auth pages).
 * variant="dark":  green/ink wordmark, no tagline, for white headers.
 */
export default function Logo({ to = '/home', variant = 'light', className = '' }) {
  const dark = variant === 'dark'

  return (
    <Link to={to} className={`gx-logo gx-logo--${variant} ${className}`} aria-label="GoExplore — الصفحة الرئيسية">
      <svg width={dark ? 36 : 44} height={dark ? 36 : 44} viewBox="0 0 64 64" aria-hidden="true" className="gx-logo__mark">
        <path
          d="M32 3C18.7 3 8 13.5 8 26.6 8 44 32 61 32 61s24-17 24-34.4C56 13.5 45.3 3 32 3z"
          fill={dark ? 'var(--gx-primary)' : '#FFFFFF'}
        />
        <circle cx="32" cy="26" r="15" fill={dark ? '#FFFFFF' : 'var(--gx-primary)'} />
        <path
          d="M32 15 L34.8 23.2 L43 26 L34.8 28.8 L32 37 L29.2 28.8 L21 26 L29.2 23.2 Z"
          fill={dark ? 'var(--gx-accent-strong)' : 'var(--gx-accent)'}
        />
      </svg>
      <span className="gx-logo__text">
        <span className="gx-logo__word" dir="ltr">
          <span className="gx-logo__go">Go</span>Explore
        </span>
        {!dark && <span className="gx-logo__tagline">اكتشف · استكشف · شارك</span>}
      </span>
    </Link>
  )
}
