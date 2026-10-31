import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

const IMG = '/img/intro/'
const IMAGES = ['nablus2.jpg', 'pin.png', 'word.png', 'tag.png']
const ROLES_AT = 8300 // ms, when the role buttons appear (end of the logo animation)

const lineIcon = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

// Category badges that burst out of the pin and get pulled back in.
const BADGES = [
  { x: '-410%', y: '-160%', d: 'M6 3v7M4 3v5a2 2 0 0 0 4 0V3M6 10v11M17 3c-2 0-3 2-3 6v3h3v9' },
  { x: '-470%', y: '60%', d: 'M4 9h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM16 10h2a2 2 0 0 1 0 4h-2M8 3c0 1.5 1.5 1.5 1.5 3M12 3c0 1.5 1.5 1.5 1.5 3' },
  { x: '-400%', y: '280%', d: 'M5 10h14l-2 10H7zM8 10V8a4 4 0 0 1 8 0v2' },
  { x: '410%', y: '-160%', d: 'M3 18V6M3 14h18v4M21 14v-3a3 3 0 0 0-3-3h-7v6', circle: true },
  { x: '470%', y: '60%', d: 'M5 12.5v8h14v-8M12 8.5v12M12 8.5C10.5 4 6.5 4.5 7.5 7.2 8.2 8.5 12 8.5 12 8.5zM12 8.5c1.5-4.5 5.5-4 4.5-1.3-.7 1.3-4.5 1.3-4.5 1.3z', rect: true },
  { x: '400%', y: '280%', d: 'M3 11a9 9 0 0 1 18 0zM12 11v10M9 21h6' },
]

const CONFETTI_COLORS = ['#7E0E0D', '#123A20', '#E2B66E', '#56653A', '#C9955A']

function makeConfetti() {
  return Array.from({ length: 34 }, (_, i) => {
    const a = Math.random() * Math.PI * 2
    const r = 40 + Math.random() * 190
    return {
      '--dx': `${(Math.cos(a) * r).toFixed(0)}px`,
      '--dy': `${(Math.sin(a) * r * 0.7 + 60 + Math.random() * 80).toFixed(0)}px`,
      '--r': `${(Math.random() * 540 - 270).toFixed(0)}deg`,
      '--s': `${(5 + Math.random() * 7).toFixed(1)}px`,
      '--c': CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      animationDelay: `${(6.3 + Math.random() * 0.15).toFixed(2)}s`,
    }
  })
}

function Dove() {
  return (
    <svg viewBox="0 0 72 46">
      <g filter="url(#grain)">
        <path d="M3 24l14-5 3 11z" fill="#EAE4D9" />
        <path d="M3 24l7 1M4 27l8-1" stroke="#D6CCBC" strokeWidth=".8" />
        <path className="wing down" d="M30 27c-4 6-11 10-19 12 10 1 19-2 25-9z" fill="#E4DED3" />
        <path d="M13 25c6-8 22-10 34-6 4 1 6-2 8-5a8 8 0 1 1 6 12c-4 5-13 10-27 10-10 0-17-4-21-11z" fill="#FFFFFF" />
        <path d="M63 16l6 1.6-6 1.6z" fill="#D9A441" />
        <circle cx="59.5" cy="15.4" r="1.3" fill="#3A2A1F" />
        <circle cx="55" cy="20" r="2" fill="#F1D6CB" opacity=".8" />
        <path className="wing" d="M24 23c0-11 9-19 24-21-2 5-3 8-6 11 5 0 7 2 7 5-9 5-17 6-25 5z" fill="#F4F0E8" />
        <path d="M30 21c4-1 9-1 13 0M28 17c5-2 10-3 15-2M33 11c3-2 6-3 9-3" stroke="#DCD4C6" strokeWidth=".9" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  )
}

/** Animated landing page for visitors: the logo assembles over Nablus, then "enter as" buttons appear. */
export default function IntroPage() {
  const [playing, setPlaying] = useState(false)
  const [showRoles, setShowRoles] = useState(false)
  const confetti = useMemo(makeConfetti, [])
  const started = useRef(false)

  // Start once the artwork has loaded, so the timeline doesn't run over blank images.
  useEffect(() => {
    let left = IMAGES.length
    let timer
    const done = () => {
      if (--left > 0 || started.current) return
      started.current = true
      setPlaying(true)
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      timer = setTimeout(() => setShowRoles(true), reduced ? 0 : ROLES_AT)
    }
    const loaders = IMAGES.map((name) => {
      const im = new Image()
      im.onload = im.onerror = done
      im.src = IMG + name
      return im
    })
    return () => {
      clearTimeout(timer)
      loaders.forEach((im) => (im.onload = im.onerror = null))
    }
  }, [])

  return (
    <div className={`p-Intro${playing ? ' play' : ''}`} dir="rtl">
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
        <filter id="grain" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="2" seed="7" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 .29  0 0 0 0 .2  0 0 0 0 .14  0 0 0 .5 -.18" result="g" />
          <feComposite in="g" in2="SourceAlpha" operator="in" result="gm" />
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="gm" />
          </feMerge>
        </filter>
      </svg>
      <div className="city" role="img" aria-label="رسم ملوّن لمدينة نابلس بين جبلَي عيبال وجرزيم" />
      <div className="veil" aria-hidden="true" />

      {/* vintage cloth kite */}
      <div className="kite vint" aria-hidden="true">
        <svg viewBox="0 0 100 210">
          <path d="M50 92L-40 420" stroke="#6B5A48" strokeWidth="1" opacity=".7" fill="none" />
          <g className="kbody">
            <g filter="url(#grain)">
              <path d="M50 3L87 46H50z" fill="#B5533C" />
              <path d="M13 46L50 92V46z" fill="#B5533C" />
              <path d="M50 3L13 46H50z" fill="#D9A441" />
              <path d="M87 46L50 92V46z" fill="#C98E35" />
              <path d="M50 3L87 46 50 92z" fill="#000" opacity=".07" />
              <path d="M50 6V89M16 46H84" stroke="#F3E6C9" strokeWidth="1.6" strokeDasharray="3 2.4" />
              <path d="M50 36l7 7-7 7-7-7zM50 50l7 7-7 7-7-7z" fill="#2F5E5A" />
              <circle cx="50" cy="46" r="2.4" fill="#F3E6C9" />
              <path className="tailline" d="M50 92C40 112 60 128 48 150S52 182 44 200" fill="none" stroke="#6B4A2E" strokeWidth="1.5" />
              <path className="bow" d="M40 110l10 4 10-4v10l-10-4-10 4z" fill="#3F7F7A" />
              <path className="bow" d="M42 138l9 4 9-4v9l-9-4-9 4z" fill="#B5533C" />
              <path className="bow" d="M38 164l9 4 9-4v9l-9-4-9 4z" fill="#D9A441" />
              <path className="bow" d="M36 190l9 4 9-4v9l-9-4-9 4z" fill="#3F7F7A" />
            </g>
          </g>
        </svg>
      </div>

      {/* white doves */}
      <div className="flock vint" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`bird${playing ? ' flap' : ''}`}>
            <Dove />
          </div>
        ))}
      </div>

      {/* logo stage */}
      <div className="stagewrap">
        <main className="stage" role="img" aria-label="GoExplore — Discover Palestine — اكتشف فلسطين">
          <div className="rays" aria-hidden="true" />
          <div className="sunbig" aria-hidden="true" />
          <div className="ripple" aria-hidden="true" />
          <div className="shadow" aria-hidden="true" />
          {BADGES.map((b, i) => (
            <div
              key={i}
              className="badge"
              aria-hidden="true"
              style={{ '--x': b.x, '--y': b.y, animationDelay: `${3.75 + i * 0.12}s, ${4.9 + i * 0.05}s` }}
            >
              <svg {...lineIcon}>
                {b.rect && <rect x="3.5" y="8.5" width="17" height="4" rx="1" />}
                <path d={b.d} />
                {b.circle && <circle cx="7" cy="11" r="1.6" />}
              </svg>
            </div>
          ))}
          <div className="pinwrap" aria-hidden="true">
            <span className="scenebox">
              <img className="scene" src={`${IMG}pin.png`} alt="" />
            </span>
            <span className="sunglow" />
            <img className="frame" src={`${IMG}pin.png`} alt="" />
            <img className="full" src={`${IMG}pin.png`} alt="" />
            <span className="shine" />
          </div>
          <div className="lander vint" aria-hidden="true">
            <svg viewBox="0 0 72 50">
              <g filter="url(#grain)">
                <path d="M3 26l14-5 3 11z" fill="#EAE4D9" />
                <path d="M36 37l-1 9M43 37l1 9" stroke="#C26F4A" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M13 27c6-8 22-10 34-6 4 1 6-2 8-5a8 8 0 1 1 6 12c-4 5-13 10-27 10-10 0-17-4-21-11z" fill="#FFFFFF" />
                <path d="M63 18l6 1.6-6 1.6z" fill="#D9A441" />
                <circle cx="59.5" cy="17.4" r="1.3" fill="#3A2A1F" />
                <circle cx="55" cy="22" r="2" fill="#F1D6CB" opacity=".8" />
                <path className="wing" d="M20 27c4-8 14-12 28-10-2 6-8 12-18 14-4 0-8-2-10-4z" fill="#F4F0E8" />
                <path d="M26 26c5-2 10-3 15-3M30 29c4-1 7-2 10-3" stroke="#DCD4C6" strokeWidth=".9" fill="none" strokeLinecap="round" />
              </g>
            </svg>
          </div>
          <div className="word" aria-hidden="true">
            <img src={`${IMG}word.png`} alt="" />
            <span className="dia" />
          </div>
          <div className="confetti" aria-hidden="true">
            {confetti.map((style, i) => (
              <span key={i} style={style} />
            ))}
          </div>
          <div className="tagrow" dir="ltr" aria-hidden="true">
            <i />
            <img src={`${IMG}tag.png`} alt="" />
            <i />
          </div>
          <div className="ar">
            اكتشف <b>فلسطين</b>
          </div>
        </main>
      </div>

      <nav className={`roles th-site${showRoles ? ' show' : ''}`} aria-label="تسجيل الدخول">
        <span className="lbl">ادخل كـ</span>
        <div className="row">
          <Link className="role st grn" to="/login">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
            </svg>
            مستخدم
          </Link>
          <Link className="role st red" to="/business/login">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 10v10h16V10M3 10l2-6h14l2 6M3 10h18M9 20v-6h6v6" />
            </svg>
            صاحب عمل
          </Link>
          <Link className="role st lnn" to="/admin/login">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
            مشرف
          </Link>
        </div>
      </nav>
    </div>
  )
}
