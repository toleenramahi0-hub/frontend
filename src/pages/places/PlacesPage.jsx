import { Fragment, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppShell, { BackBar } from '../../components/AppShell'
import PlaceCard, { CategoryChips } from '../../components/PlaceCard'
import { useCurrentProfile } from '../../context/useCurrentProfile'
import { CATEGORIES } from '../../data/categories'
import { FEATURED, placeById } from '../../data/places'

const SLIDES = [
  { src: '/img/ph/hero_clock.jpg', alt: 'برج الساعة في نابلس', pos: 'center 40%' },
  { src: '/img/ph/hero_valley.jpg', alt: 'إطلالة على نابلس بين الجبلين', pos: 'center 55%' },
  { src: '/img/ph/hero_church.jpg', alt: 'كنيسة على تلة في نابلس', pos: 'center 35%' },
  { src: '/img/ph/hero_alley.jpg', alt: 'زقاق في البلدة القديمة', pos: 'center 55%' },
  { src: '/img/ph/hero_bird.jpg', alt: 'رسمة طبيعة', pos: 'center center' },
  { src: '/img/ph/hero_arches.jpg', alt: 'أقواس ودرج حجري', pos: 'center 45%' },
  { src: '/img/ph/hero_city.jpg', alt: 'نابلس والمسجد', pos: 'center 45%' },
]

const QUICK = ['مطعم رخيص وأكله زاكي', 'قهوة هادية للدراسة', 'كنافة سخنة قريبة مني', 'مكان للأولاد بالويكند']

const sectionHead = {
  gridColumn: '1 / -1',
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  gap: 10,
  marginTop: 10,
  paddingBottom: 6,
  borderBottom: '1.5px dashed #D5C4AA',
}

/**
 * Place discovery (UC-PB-02): natural-language search box (UC-AI-02) over a hero
 * slideshow, category chips, and the two top places of every category.
 */
export default function PlacesPage() {
  const me = useCurrentProfile()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  function search(e) {
    e.preventDefault()
    navigate(query.trim() ? `/search?q=${encodeURIComponent(query.trim())}` : '/search')
  }

  const featured = FEATURED.map(placeById)

  return (
    <AppShell page="Places" nav="places">
      <BackBar />
      <div className="page route" style={{ gap: 26 }}>
        <section className="hero" aria-label="ابحث">
          {SLIDES.map((s, i) => (
            <img key={s.src} className={`ph hslide hs${i}`} src={s.src} alt={s.alt} style={{ objectPosition: s.pos }} />
          ))}
          <span className="veil" aria-hidden="true" />
          <div className="in">
            <span
              className="chip"
              style={{
                alignSelf: 'flex-start',
                background: 'rgba(255, 246, 234, 0.14)',
                color: 'rgb(255, 246, 234)',
                borderColor: 'rgba(255, 246, 234, 0.35)',
              }}
            >
              {me ? `أهلاً ${me.name.split(' ')[0]} · شو بدك تكتشف اليوم؟` : 'أهلاً فيك · شو بدك تكتشف اليوم؟'}
            </span>
            <h1 className="h1" style={{ color: 'rgb(255, 246, 234)' }}>
              اكتشف نابلس
              <br />
              حارة حارة
            </h1>
            <p style={{ margin: 0, fontSize: 18, color: 'rgb(237, 227, 210)' }}>
              مطاعم، مقاهي، فنادق، حلويات، ملاهي وهدايا — اقتراحات من ناس البلد.
            </p>
            <form className="sbox" role="search" onSubmit={search}>
              <label htmlFor="exq" className="sr">
                ابحث عن مكان
              </label>
              <input
                id="exq"
                placeholder="احكيلنا شو بدك… مثلاً: مطعم رخيص وأكله زاكي"
                autoComplete="off"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button type="submit" className="st red" style={{ borderRadius: 12, minHeight: 50 }}>
                بحث
              </button>
            </form>
            <div className="row" style={{ gap: 8 }}>
              {QUICK.map((q) => (
                <button
                  key={q}
                  type="button"
                  className="qchip"
                  onClick={() => navigate(`/search?q=${encodeURIComponent(q)}`)}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section id="exres" className="expl" aria-label="الأماكن">
          <CategoryChips active="all" />
          <p className="small muted expl-count">{featured.length} مكان · أفضل مكانين من كل فئة</p>
          <div className="expl-list">
            {CATEGORIES.map((c) => (
              <Fragment key={c.id}>
                <div className="xcat" style={sectionHead}>
                  <strong style={{ fontSize: 19 }}>{c.label}</strong>
                  <span className="xs muted">
                    {'🔥 الأكثر رواجاً · '}
                    <Link to={`/category/${c.id}`} style={{ color: '#7E1514', fontWeight: 800, textDecoration: 'none' }}>
                      عرض الكل ←
                    </Link>
                  </span>
                </div>
                {featured
                  .filter((p) => p.category === c.id)
                  .map((p, i) => (
                    <PlaceCard key={p.id} place={p} rank={i + 1} />
                  ))}
              </Fragment>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  )
}
