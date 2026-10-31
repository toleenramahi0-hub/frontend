import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { CATEGORIES, categoryLabel } from '../data/categories'
import { SaveButton } from './PlaceStrip'
import Photo from './Photo'

const rankStyle = {
  position: 'absolute',
  top: 10,
  right: 10,
  background: '#7E1514',
  color: '#FFF6EA',
  fontSize: 12,
  fontWeight: 800,
  borderRadius: 999,
  padding: '3px 9px',
  zIndex: 2,
}

/** Place result card (`.xpl`) used on the Places and category pages (UC-PB-02). */
export default function PlaceCard({ place, rank, hot, tags = place.tags }) {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const to = `/place/${place.id}`
  return (
    <article className="xpl">
      <Link to={to} className="xpl-im" aria-label={place.name}>
        <Photo img={place.img} />
        {rank && <span className="xpl-rank" style={rankStyle}>{`#${rank}${hot ? ' 🔥' : ''}`}</span>}
        <span className="xpl-rate">★ {place.rating.toFixed(1)}</span>
      </Link>
      <div className="xpl-b">
        <Link to={to} className="xpl-n">
          {place.name}
        </Link>
        <span className="small muted">
          {categoryLabel(place.category)} · {place.area} · {place.price}
        </span>
        <span className="xpl-tags">
          {tags.map((t) => (
            <span key={t} className="xpl-tag">
              {t}
            </span>
          ))}
        </span>
        <span className="xpl-foot">
          <span className="xs muted">{place.reviews} تقييم</span>
          <Link to={to} className="st sm grn xpl-go">
            التفاصيل ←
          </Link>
        </span>
      </div>
      <SaveButton placeId={place.id} guest={!isAuthenticated} onRequireAuth={() => navigate('/login')} />
    </article>
  )
}

/** Category filter chips (`.fchip`), "الكل" first. */
export function CategoryChips({ active = 'all' }) {
  return (
    <div className="chips expl-cats">
      <Link to="/places" className="fchip" aria-pressed={active === 'all'}>
        الكل
      </Link>
      {CATEGORIES.map((c) => (
        <Link key={c.id} to={`/category/${c.id}`} className="fchip" aria-pressed={active === c.id}>
          {c.label}
        </Link>
      ))}
    </div>
  )
}
