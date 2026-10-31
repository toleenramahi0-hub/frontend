import { Link, Navigate, useParams } from 'react-router-dom'
import AppShell, { BackBar } from '../../components/AppShell'
import PlaceCard, { CategoryChips } from '../../components/PlaceCard'
import { categoryById } from '../../data/categories'
import { placeById, RANKING } from '../../data/places'

// Each category page has its own stylesheet scope in the design (p-CategoryCafes, …).
const PAGE_CLASS = {
  restaurants: 'CategoryRestaurants',
  cafes: 'CategoryCafes',
  sweets: 'CategorySweets',
  hotels: 'CategoryHotels',
  fun: 'CategoryFun',
  toys: 'CategoryToys',
  gifts: 'CategoryGifts',
  pets: 'CategoryPets',
  electronics: 'CategoryElectronics',
}

/** All places of one category, most trending first (UC-PB-02 category filter). */
export default function CategoryPage() {
  const { categoryId } = useParams()
  const category = categoryById(categoryId)
  if (!category) return <Navigate to="/places" replace />

  const places = RANKING[category.id].map(placeById)

  return (
    <AppShell page={PAGE_CLASS[category.id]} nav="places">
      <BackBar />
      <div className="page route" style={{ gap: 26 }}>
        <section
          className="cathero"
          aria-label={category.label}
          style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 24,
            minHeight: 240,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 24,
            padding: '22px 28px',
            background: '#173022',
            color: '#FFF6EA',
            boxShadow: 'inset 0 0 0 6px #173022, inset 0 0 0 7.5px rgba(226,182,110,.45)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: '1 1 260px' }}>
            <Link to="/places" style={{ color: '#E9C896', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
              → كل الفئات
            </Link>
            <h1 className="h1" style={{ color: '#FFF6EA', margin: 0, fontSize: 'clamp(34px, 4.5vw, 52px)' }}>
              {category.label}
            </h1>
            <p style={{ margin: 0, color: '#EDE3D2', fontSize: 17 }}>{category.blurb}</p>
          </div>
          <span className="caticon" aria-hidden="true">
            <span className="cring">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {category.icon}
              </svg>
            </span>
          </span>
        </section>

        <section id="exres" className="expl" aria-label="الأماكن">
          <CategoryChips active={category.id} />
          <p className="small muted expl-count">{places.length} أماكن · مرتّبة من الأكثر رواجاً للأقل تقييماً</p>
          <div className="expl-list">
            {places.map((p, i) => (
              <PlaceCard key={p.id} place={p} rank={i + 1} hot={i < 2} tags={p.catTags ?? p.tags} />
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  )
}
