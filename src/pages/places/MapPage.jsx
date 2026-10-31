import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import AppShell, { BackBar } from '../../components/AppShell'
import Photo from '../../components/Photo'
import { CATEGORIES, categoryLabel } from '../../data/categories'
import { MAP_PINS, placeById } from '../../data/places'

const LABELS = [
  { text: 'الجبل الشمالي', style: { top: '8%', right: '30%' } },
  { text: 'الجبل الجنوبي', style: { bottom: '5%', right: '42%' } },
  { text: 'رفيديا', style: { top: '40%', left: '8%' } },
  { text: 'البلدة القديمة', style: { top: '58%', right: '20%' } },
  { text: 'شارع فيصل', style: { top: '74%', left: '30%' } },
]

const gmaps = (q) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`
const PINNED = Object.keys(MAP_PINS).map(placeById)

/** Illustrated Nablus map with category filter and place list (SRS FR-14). */
export default function MapPage() {
  const [params] = useSearchParams()
  const [category, setCategory] = useState('all')
  const [selectedId, setSelectedId] = useState(MAP_PINS[params.get('place')] ? params.get('place') : 'nablus-kunafa')

  const visible = PINNED.filter((p) => category === 'all' || p.category === category)
  const selected = placeById(selectedId)

  function pickCategory(id) {
    setCategory(id)
    const first = PINNED.find((p) => id === 'all' || p.category === id)
    if (first && id !== 'all' && placeById(selectedId).category !== id) setSelectedId(first.id)
  }

  return (
    <AppShell page="MapPage" nav="map">
      <BackBar />
      <div className="page route" style={{ gap: 18 }}>
        <div className="secttl" style={{ margin: 0 }}>
          <h1 className="h2">خريطة نابلس</h1>
          <div className="chips">
            {[{ id: 'all', label: 'الكل' }, ...CATEGORIES].map((c) => (
              <button
                key={c.id}
                type="button"
                className="fchip"
                aria-pressed={category === c.id}
                onClick={() => pickCategory(c.id)}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
        <div className="mapgrid">
          <div className="mapbox" style={{ minHeight: 520 }}>
            <a className="gmap-ov" href={gmaps('Nablus')} target="_blank" rel="noopener noreferrer" aria-label="افتح خريطة نابلس في خرائط Google" />
            <svg
              viewBox="0 0 160 100"
              preserveAspectRatio="none"
              aria-hidden="true"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
            >
              <path d="M0 62 C30 58 50 50 80 52 S130 60 160 48" fill="none" stroke="#D5C4AA" strokeWidth="3.5" />
              <path d="M0 62 C30 58 50 50 80 52 S130 60 160 48" fill="none" stroke="#FBF6EE" strokeWidth="1.2" strokeDasharray="3 2" />
              <path d="M70 0 C72 30 76 45 80 52 S88 80 92 100" fill="none" stroke="#D5C4AA" strokeWidth="3" />
              <path d="M20 0 C35 20 50 35 80 52" fill="none" stroke="#DDE4D3" strokeWidth="2" />
              <path d="M120 0 C118 25 110 40 80 52" fill="none" stroke="#DDE4D3" strokeWidth="2" />
              <path d="M0 20 C40 22 60 10 100 8 S150 18 160 14" fill="none" stroke="#C9B89C" strokeWidth=".6" strokeDasharray="1.5 1.5" />
              <path d="M0 88 C40 80 80 92 120 84 S150 90 160 86" fill="none" stroke="#C9B89C" strokeWidth=".6" strokeDasharray="1.5 1.5" />
            </svg>
            {LABELS.map((l) => (
              <span key={l.text} className="maplbl" style={l.style}>
                {l.text}
              </span>
            ))}
            {visible.map((p) => (
              <a
                key={p.id}
                href={gmaps(`${p.name} نابلس`)}
                target="_blank"
                rel="noopener noreferrer"
                className={p.id === selectedId ? 'pin on' : 'pin'}
                aria-label={p.name}
                data-pressed={p.id === selectedId}
                style={MAP_PINS[p.id]}
                onClick={(e) => {
                  // First click selects the pin; clicking the selected pin opens Google Maps.
                  if (p.id !== selectedId) {
                    e.preventDefault()
                    setSelectedId(p.id)
                  }
                }}
              >
                <i />
              </a>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div key={selected.id} className="card" style={{ overflow: 'hidden', animation: '0.3s ease 0s 1 normal both running ge-pop' }}>
              <div style={{ position: 'relative', aspectRatio: '16 / 9', overflow: 'hidden', background: 'rgb(231, 220, 201)' }}>
                <Photo img={selected.img} alt={selected.name} />
              </div>
              <div style={{ padding: '16px 18px 18px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span className="tag" style={{ alignSelf: 'flex-start' }}>
                  {categoryLabel(selected.category)}
                </span>
                <h2 className="h3">{selected.name}</h2>
                <span className="muted small">
                  {selected.area} · <span style={{ color: 'rgb(200, 70, 26)' }}>★ {selected.rating.toFixed(1)}</span> ·{' '}
                  {selected.price}
                </span>
                <Link to={`/place/${selected.id}`} className="st sm grn wtxt" style={{ marginTop: 6 }}>
                  صفحة المكان
                </Link>
              </div>
            </div>
            <div className="side-card" style={{ maxHeight: 300, overflowY: 'auto', gap: 2 }}>
              {visible.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className="mrow"
                  aria-pressed={p.id === selectedId}
                  style={p.id === selectedId ? { background: 'rgb(244, 236, 223)' } : undefined}
                  onClick={() => setSelectedId(p.id)}
                >
                  <span
                    style={{ position: 'relative', width: 44, height: 44, borderRadius: 10, overflow: 'hidden', flex: '0 0 auto' }}
                  >
                    <Photo img={p.img} />
                  </span>
                  <span style={{ flex: '1 1 0%', lineHeight: 1.3 }}>
                    <strong>{p.name}</strong>
                    <br />
                    <span className="xs muted">
                      {categoryLabel(p.category)} · {p.area}
                    </span>
                  </span>
                </button>
              ))}
              {visible.length === 0 && <p className="small muted">ما في أماكن من هالفئة على الخريطة.</p>}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
