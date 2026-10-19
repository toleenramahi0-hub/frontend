import { useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import './SplashPage.css'

// The map is drawn on a fixed 720×400 canvas (all coordinates below use it)
// and scaled down to fit narrow screens.
const MAP_W = 720
const MAP_H = 400
const ROUTE = 'M70 330 C 150 300, 170 230, 250 240 S 380 300, 420 230 S 520 120, 590 150'

const MINI_PINS = [
  { x: 160, y: 285, delay: 2.0, bg: '#FFFFFF', fg: '#0E5A4A', icon: 'M4 9h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM16 10h2a2 2 0 0 1 0 4h-2M8 3v3M12 3v3' },
  { x: 255, y: 228, delay: 2.25, bg: '#E8A33D', fg: '#15211F', icon: 'M7 3v8a2 2 0 0 0 4 0V3M9 11v10M17 3c-2 0-3 2-3 5s1 4 3 4v9' },
  { x: 120, y: 120, delay: 2.4, bg: '#7FC8B0', fg: '#0A4236', icon: 'M12 3a9 9 0 0 1 9 9H3a9 9 0 0 1 9-9zM12 12v9M8 21h8' },
  { x: 360, y: 262, delay: 2.55, bg: '#F4B183', fg: '#15211F', icon: 'M6 10h12l-2 11H8zM7 10a5 5 0 0 1 10 0M12 5V3' },
  { x: 330, y: 95, delay: 2.7, bg: '#FFFFFF', fg: '#0E5A4A', icon: 'M3 20V6M3 13h18v7M3 10h7a3 3 0 0 1 3 3M16 9a2 2 0 1 0 0 .01' },
  { x: 470, y: 205, delay: 2.85, bg: '#BFE3D6', fg: '#0A4236', icon: 'M3 8h18v4H3zM5 12v9h14v-9M12 8v13M12 8c-2-4-6-4-6-1s6 1 6 1 6 2 6-1-4-3-6 1z' },
  {
    x: 640,
    y: 320,
    delay: 3.0,
    bg: '#E8A33D',
    fg: '#15211F',
    icon: 'M12 14c-3 0-5 3-5 5a2 2 0 0 0 3 1.5 4 4 0 0 1 4 0A2 2 0 0 0 17 19c0-2-2-5-5-5zM6 10a1.5 2 0 1 0 0 .01M18 10a1.5 2 0 1 0 0 .01M9 6a1.5 2 0 1 0 0 .01M15 6a1.5 2 0 1 0 0 .01',
  },
]

// [left %, top %] for the twinkling background stars.
const STAR_SEEDS = [[6, 14], [14, 72], [24, 28], [32, 88], [70, 10], [78, 82], [88, 30], [94, 66], [10, 46], [86, 50], [4, 90], [96, 8], [20, 8], [60, 94]]
const STAR_COLORS = ['#F4B183', '#BFE3D6', '#E8A33D', '#7FC8B0']

const RIPPLES = [
  { color: '#C2410C', delay: 3.65 },
  { color: '#0E5A4A', delay: 3.9 },
  { color: '#E8A33D', delay: 4.15 },
]

/** Shared map artwork; each fold panel shows a slice of it. */
function MapArt() {
  return (
    <>
      <path d="M30 70 C 80 40, 190 50, 210 110 S 160 210, 90 200 S 10 120, 30 70 Z" fill="#BFE3D6" />
      <path d="M600 250 C 660 230, 720 260, 720 320 L 720 400 L 560 400 C 540 340, 560 270, 600 250 Z" fill="#BFE3D6" />
      <ellipse cx="470" cy="330" rx="70" ry="34" fill="#7FC8B0" opacity="0.7" />
      <path d="M0 250 C 120 240, 180 300, 300 290 S 420 330, 470 330" fill="none" stroke="#7FC8B0" strokeWidth="14" strokeLinecap="round" opacity="0.7" />
      <g fill="none" strokeLinecap="round">
        <path d="M0 180 H 720" stroke="#E3E1DA" strokeWidth="16" />
        <path d="M300 0 V 400" stroke="#E3E1DA" strokeWidth="16" />
        <path d="M540 0 C 520 120, 600 200, 580 400" stroke="#E3E1DA" strokeWidth="16" />
        <path d="M0 360 L 260 120 L 420 40 L 720 30" stroke="#E3E1DA" strokeWidth="12" />
        <path d="M0 180 H 720" stroke="#FFFFFF" strokeWidth="10" />
        <path d="M300 0 V 400" stroke="#FFFFFF" strokeWidth="10" />
        <path d="M540 0 C 520 120, 600 200, 580 400" stroke="#FFFFFF" strokeWidth="10" />
        <path d="M0 360 L 260 120 L 420 40 L 720 30" stroke="#FFFFFF" strokeWidth="7" />
      </g>
      <g fill="#E3E1DA">
        <rect x="330" y="200" width="44" height="30" rx="4" />
        <rect x="384" y="200" width="30" height="30" rx="4" />
        <rect x="330" y="120" width="60" height="40" rx="4" />
        <rect x="400" y="110" width="34" height="50" rx="4" />
        <rect x="230" y="200" width="50" height="34" rx="4" />
        <rect x="610" y="190" width="40" height="40" rx="4" />
        <rect x="660" y="120" width="44" height="44" rx="4" />
        <rect x="120" y="230" width="40" height="26" rx="4" />
        <rect x="440" y="60" width="50" height="36" rx="4" />
        <rect x="20" y="300" width="50" height="40" rx="4" />
      </g>
      <path d="M60 140 l6 -12 l6 12 z M90 160 l7 -14 l7 14 z M150 120 l6 -12 l6 12 z" fill="#3F8571" />
    </>
  )
}

/** One third of the folded map, cut from the full 720px artwork at `offset`. */
function MapPanel({ offset, className = '', children }) {
  return (
    <div className={`splash__panel ${className}`} style={{ left: offset }}>
      <svg width={MAP_W} height={MAP_H} viewBox={`0 0 ${MAP_W} ${MAP_H}`} style={{ left: -offset }}>
        <MapArt />
      </svg>
      {children}
    </div>
  )
}

/** Fits the fixed-size map into the available width. */
function useMapScale(frameRef) {
  const [scale, setScale] = useState(1)
  useLayoutEffect(() => {
    const frame = frameRef.current
    if (!frame) return
    const update = () => setScale(Math.min(1, frame.clientWidth / MAP_W))
    update()
    const observer = new ResizeObserver(update)
    observer.observe(frame)
    return () => observer.disconnect()
  }, [frameRef])
  return scale
}

/** Animated intro: a folded map opens, a route is drawn, and the GoExplore pin drops in. */
export default function SplashPage() {
  const { isAuthenticated } = useAuth()
  const frameRef = useRef(null)
  const scale = useMapScale(frameRef)

  return (
    <div className="splash">
      <div className="splash__bg splash-fade" aria-hidden="true" />
      <div className="splash__dots splash-fade" aria-hidden="true" />

      {STAR_SEEDS.map(([x, y], i) => {
        const size = i % 3 === 0 ? 12 : 7
        return (
          <span
            key={i}
            className="splash__star splash-twinkle"
            aria-hidden="true"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: size,
              height: size,
              background: STAR_COLORS[i % 4],
              animationDelay: `${((i * 0.43) % 2.8).toFixed(2)}s`,
            }}
          />
        )
      })}

      <main className="splash__content">
        <div ref={frameRef} className="splash__map-frame splash-rise" aria-hidden="true" style={{ height: MAP_H * scale }}>
          <div className="splash__map" dir="ltr" style={{ transform: `scale(${scale})` }}>
            <MapPanel offset={240} className="splash__panel--middle" />
            <MapPanel offset={0} className="splash__panel--left splash-unfold-left">
              <div className="splash__crease splash__crease--left" />
            </MapPanel>
            <MapPanel offset={480} className="splash__panel--right splash-unfold-right">
              <div className="splash__crease splash__crease--right" />
            </MapPanel>

            <svg className="splash__overlay" width={MAP_W} height={MAP_H} viewBox={`0 0 ${MAP_W} ${MAP_H}`}>
              <defs>
                <mask id="splash-route-mask" maskUnits="userSpaceOnUse" x="0" y="0" width={MAP_W} height={MAP_H}>
                  <path
                    className="splash-draw"
                    d={ROUTE}
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="12"
                    pathLength="1"
                    strokeDasharray="1"
                    strokeDashoffset="1"
                  />
                </mask>
              </defs>
              <path
                d={ROUTE}
                fill="none"
                stroke="#C2410C"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray="2 12"
                mask="url(#splash-route-mask)"
              />
              <g className="splash-fade" style={{ animationDelay: '1.7s' }}>
                <circle cx="70" cy="330" r="11" fill="#0E5A4A" stroke="#FFFFFF" strokeWidth="4" />
              </g>
              <g className="splash-compass">
                <circle cx="660" cy="62" r="34" fill="#FFFFFF" stroke="#0E5A4A" strokeWidth="3" />
                <text x="660" y="40" textAnchor="middle" fontFamily="Figtree, sans-serif" fontSize="11" fontWeight="700" fill="#0E5A4A">
                  N
                </text>
                <g className="splash-needle">
                  <path d="M660 36 L667 62 L660 88 L653 62 Z" fill="#E2EFEA" />
                  <path d="M660 36 L667 62 L653 62 Z" fill="#C2410C" />
                </g>
                <circle cx="660" cy="62" r="3.5" fill="#15211F" />
              </g>
            </svg>

            <span className="splash__walker splash-walk" style={{ offsetPath: `path('${ROUTE}')` }} />

            {MINI_PINS.map((m) => (
              <span key={`${m.x}-${m.y}`} className="splash__mini splash-pin-pop" style={{ left: m.x, top: m.y, animationDelay: `${m.delay}s` }}>
                <span
                  className="splash__mini-pin"
                  style={{ background: m.bg, borderColor: m.bg === '#FFFFFF' ? '#0E5A4A' : '#FFFFFF' }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={m.fg}
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d={m.icon} />
                  </svg>
                </span>
              </span>
            ))}

            <span className="splash__cloud splash__cloud--a splash-cloud" />
            <span className="splash__cloud splash__cloud--b splash-cloud" />

            {RIPPLES.map((r) => (
              <span key={r.color} className="splash__ripple splash-ripple" style={{ borderColor: r.color, animationDelay: `${r.delay}s` }} />
            ))}
            <span className="splash__pin-shadow splash-shadow" />
            <div className="splash__drop splash-drop">
              <div className="splash-float">
                <svg width="120" height="120" viewBox="0 0 64 64" overflow="visible">
                  <path
                    d="M32 3C18.7 3 8 13.5 8 26.6 8 44 32 61 32 61s24-17 24-34.4C56 13.5 45.3 3 32 3z"
                    fill="#0E5A4A"
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                  />
                  <circle className="splash-pop" cx="32" cy="26" r="15" fill="#FFFFFF" />
                  <path className="splash-spark" d="M32 15 L34.8 23.2 L43 26 L34.8 28.8 L32 37 L29.2 28.8 L21 26 L29.2 23.2 Z" fill="#C2410C" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="splash__brand">
          {/* dir="ltr" keeps the per-letter spans in reading order inside the RTL page. */}
          <h1 className="splash__title" dir="ltr" aria-label="GoExplore">
            {'GoExplore'.split('').map((ch, i) => (
              <span
                key={i}
                aria-hidden="true"
                className={`splash__letter splash-letter ${i < 2 ? 'splash__letter--go' : ''}`}
                style={{ animationDelay: `${(3.9 + i * 0.05).toFixed(2)}s` }}
              >
                {ch}
              </span>
            ))}
          </h1>
          <p className="splash__tagline splash-up" style={{ animationDelay: '4.3s' }}>
            اكتشف أماكن تناسبك.
          </p>
          <div className="splash__bar-track splash-up" style={{ animationDelay: '2.9s' }} aria-hidden="true">
            <div className="splash__bar splash-bar" />
          </div>
          <Link to={isAuthenticated ? '/home' : '/login'} className="splash__cta splash-cta">
            لنبدأ الاستكشاف ←
          </Link>
        </div>
      </main>
    </div>
  )
}
