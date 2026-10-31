import { Link } from 'react-router-dom'

/** Header of the site-theme screens (sign in, preferences, admin and business areas). */
export default function SiteHeader({ to = '/', label = 'الصفحة التعريفية', tagline = 'اكتشف فلسطين', title = 'GoExplore', children, inStyle }) {
  return (
    <header className="top" style={{ position: 'relative', zIndex: 2 }}>
      <img className="gec gec2" src="/img/tatreez_corner6.png" alt="" aria-hidden="true" />
      <div
        className="in"
        style={{
          gap: 'clamp(12px, 2vw, 24px)',
          minHeight: 'var(--bar)',
          padding: '6px clamp(16px, 3vw, 40px)',
          paddingLeft: 'calc(var(--corner) + 16px)',
          ...inStyle,
        }}
      >
        <Link className="brand" to={to} aria-label={label}>
          <svg viewBox="0 0 40 48" aria-hidden="true" style={{ width: 'calc(var(--bar) * .42)', height: 'calc(var(--bar) * .5)' }}>
            <image href="/img/logo_pin.png" x="0" y="0" width="40" height="48" preserveAspectRatio="xMidYMid meet" />
          </svg>
          <span>
            <b style={{ fontSize: 'calc(var(--bar) * .3)' }}>{title}</b>
            <small style={{ fontSize: 'calc(var(--bar) * .14)' }}>{tagline}</small>
          </span>
        </Link>
        {children}
      </div>
    </header>
  )
}
