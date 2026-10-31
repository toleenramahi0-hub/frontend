import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCurrentProfile } from '../context/useCurrentProfile'
import Avatar from './Avatar'
import Icon from './Icon'

const NAV = [
  { id: 'home', label: 'الرئيسية', to: '/home' },
  { id: 'places', label: 'الأماكن', to: '/places' },
  { id: 'map', label: 'الخريطة', to: '/map' },
]

export function Brand({ to = '/home' }) {
  return (
    <Link to={to} className="brand tbtn" aria-label="جو إكسبلور — الرئيسية">
      <svg viewBox="0 0 40 48" aria-hidden="true" style={{ width: 28, height: 34 }}>
        <image href="/img/logo_pin.png" x="0" y="0" width="40" height="48" preserveAspectRatio="xMidYMid meet" />
      </svg>
      <span>
        <b style={{ fontSize: 24 }}>GoExplore</b>
        <small style={{ fontSize: 11 }}>اكتشف فلسطين</small>
      </span>
    </Link>
  )
}

/** Dark header with the embroidery corner, main nav, search and account actions. */
export default function AppHeader({ active, guest = false, badges = { inbox: 3, notifications: 4 } }) {
  const navigate = useNavigate()
  const me = useCurrentProfile()
  guest = guest || !me
  const [query, setQuery] = useState('')

  function search(e) {
    e.preventDefault()
    navigate(query.trim() ? `/search?q=${encodeURIComponent(query.trim())}` : '/search')
  }

  return (
    <header className="top">
      <img className="gec" src="/img/tatreez_corner6.png" alt="" aria-hidden="true" />
      <div className="in">
        <Brand to={guest ? '/places' : '/home'} />
        <nav className="topnav" aria-label="القائمة الرئيسية">
          {NAV.filter((item) => !guest || item.id !== 'home').map((item) => (
            <Link key={item.id} to={item.to} aria-current={active === item.id ? 'page' : 'false'}>
              {item.label}
            </Link>
          ))}
        </nav>
        {!guest && (
          <form className="tsearch" role="search" style={{ marginInlineStart: 'auto' }} onSubmit={search}>
            <label htmlFor="tq" className="sr">
              بحث
            </label>
            <input
              id="tq"
              placeholder="ابحث عن شخص أو مكان…"
              autoComplete="off"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="ib" aria-label="بحث" style={{ minWidth: 38, minHeight: 38, color: 'rgb(230, 220, 203)' }}>
              <Icon name="search" className="ic sm" />
            </button>
          </form>
        )}
        <div className="tacts" style={{ display: 'flex', alignItems: 'center', gap: 2, color: 'rgb(230, 220, 203)' }}>
          {guest && (
            <Link to="/login" className="st sm red" style={{ color: '#fff' }}>
              تسجيل الدخول
            </Link>
          )}
          {!guest && (
            <>
              <Link to="/new-post" className="ib hide-md" aria-label="منشور جديد">
                <Icon name="plusSquare" />
              </Link>
              <Link to="/inbox" className="ib hide-md" aria-label="الرسائل">
                <Icon name="send" />
                {badges.inbox > 0 && <span className="badge2">{badges.inbox}</span>}
              </Link>
              <Link to="/map" className="ib show-md tplus" aria-label="الخريطة">
                <Icon name="map" size={26} />
              </Link>
              <Link to="/notifications" className="ib tnotif" aria-label="الإشعارات">
                <Icon name="heart" />
                {badges.notifications > 0 && <span className="badge2">{badges.notifications}</span>}
              </Link>
              <div className="hide-md" style={{ position: 'relative' }}>
                <Link to="/settings" className="ib" aria-label="قائمة الحساب">
                  <Avatar user={me} />
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
