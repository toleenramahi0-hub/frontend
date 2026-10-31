import { Link } from 'react-router-dom'

export const navIcon = (children) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
)

const headerIcon = (children) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
)

export const OVERVIEW_ICON = navIcon(
  <>
    <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
    <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
    <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
    <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
  </>,
)

/** Top bar of the admin and business dashboards: brand, section tabs, preview/logout, avatar. */
export default function DashboardHeader({ home, word, subtitle, navLabel, sections, tab, onTab, counts = {}, onLogout, preview, avatar }) {
  return (
    <header className="top">
      <img className="gec" src="/img/tatreez_corner6.png" alt="" aria-hidden="true" />
      <div className="in ahdr">
        <Link className="brand" to={home}>
          <svg viewBox="0 0 40 48" aria-hidden="true" width="34" height="41">
            <image href="/img/logo_pin.png" x="0" y="0" width="40" height="48" preserveAspectRatio="xMidYMid meet" />
          </svg>
          <span>
            <b style={{ whiteSpace: 'nowrap' }}>
              {'GoExplore '}
              <span style={{ color: '#E2B66E', fontWeight: 400 }}>{word}</span>
            </b>
            <small>{subtitle}</small>
          </span>
        </Link>
        <nav className="anav" aria-label={navLabel}>
          {sections.map((s) => (
            <button key={s.id} type="button" className={tab === s.id ? 'on' : ''} aria-current={tab === s.id ? 'page' : undefined} onClick={() => onTab(s.id)}>
              <i className="ni">{s.icon}</i>
              <span className="lf">{s.full}</span>
              <span className="ls">{s.short}</span>
              {counts[s.id] > 0 && <b className="nb">{counts[s.id]}</b>}
            </button>
          ))}
        </nav>
        <div className="aend">
          {preview && (
            <Link to={preview} className="ib" aria-label="معاينة صفحة المكان" title="معاينة صفحة المكان">
              {headerIcon(
                <>
                  <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
                  <circle cx="12" cy="12" r="3" />
                </>,
              )}
            </Link>
          )}
          <button type="button" className="ib" aria-label="تسجيل الخروج" title="تسجيل الخروج" onClick={onLogout}>
            {headerIcon(<path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10" />)}
          </button>
          <span className="avatar" title={avatar.title} style={{ background: '#D8A659', color: '#2A1A0C', boxShadow: '0 0 0 2px #7E1514' }}>
            {avatar.letter}
          </span>
        </div>
      </div>
    </header>
  )
}

/** Section title used on every dashboard tab. */
export function SectionTitle({ kicker, title, children }) {
  return (
    <div className="secttl">
      <div>
        <span className="small b" style={{ color: '#56653A' }}>
          {kicker}
        </span>
        <h1 className="h1" style={{ fontSize: 'clamp(30px, 3.6vw, 44px)', margin: 0 }}>
          {title}
        </h1>
      </div>
      {children}
    </div>
  )
}

export function Kpi({ label, value, change, up, spark }) {
  return (
    <div className="card kpi">
      <span className="small muted">{label}</span>
      <b>{value}</b>
      {change && <span className={up === undefined ? 'muted small' : up ? 'up' : 'dn'}>{change}</span>}
      <div className="spark" aria-hidden="true">
        {spark.map((h, i) => (
          <i key={i} style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  )
}
