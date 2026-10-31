import { Link } from 'react-router-dom'
import { categoryLabel } from '../data/categories'
import { placeById } from '../data/places'
import { useToggle } from '../services/interactions'
import Icon from './Icon'
import Photo from './Photo'

export function SaveButton({ placeId, guest, onRequireAuth }) {
  const [saved, toggle] = useToggle('savedPlaces', placeId)
  return (
    <button
      type="button"
      className="savebtn"
      aria-pressed={saved}
      aria-label="حفظ المكان"
      onClick={guest ? onRequireAuth : toggle}
    >
      <Icon name="bookmark" className={saved ? 'ic fill' : 'ic'} />
    </button>
  )
}

/** Horizontal "أبرز الأماكن" strip of place cards on the home feeds. */
export default function PlaceStrip({ ids, guest, onRequireAuth }) {
  return (
    <section aria-label="أبرز الأماكن" className="igplaces">
      <div className="between">
        <strong>أبرز الأماكن</strong>
        <Link to="/places" className="link tbtn small">
          شوف الكل
        </Link>
      </div>
      <div className="igpl-row">
        {ids.map(placeById).map((p) => (
          <div className="igpl" key={p.id}>
            <Link to={`/place/${p.id}`} className="igpl-im" aria-label={p.name}>
              <Photo img={p.img} />
              <span className="igpl-veil" aria-hidden="true" />
              <span className="igpl-cat">{categoryLabel(p.category)}</span>
              <span className="igpl-txt">
                <strong>{p.name}</strong>
                <span>
                  ★ {p.rating.toFixed(1)} · {p.area}
                </span>
              </span>
            </Link>
            <SaveButton placeId={p.id} guest={guest} onRequireAuth={onRequireAuth} />
          </div>
        ))}
      </div>
    </section>
  )
}
