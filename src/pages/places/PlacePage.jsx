import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import AppShell, { BackBar } from '../../components/AppShell'
import Avatar from '../../components/Avatar'
import Icon from '../../components/Icon'
import Photo, { photoSrc } from '../../components/Photo'
import { profilePath } from '../../components/PostCard'
import { useAuth } from '../../context/useAuth'
import { useCurrentProfile } from '../../context/useCurrentProfile'
import { categoryLabel } from '../../data/categories'
import { PLACE_DETAILS, placeById } from '../../data/places'
import { userByName } from '../../data/users'
import { setValue, useToggle, useValue } from '../../services/interactions'

const stars = (n) => '★'.repeat(n) + '☆'.repeat(5 - n)

/** Rate and review a place (UC-PB-03). A second submission replaces the user's earlier rating. */
function RateForm({ place }) {
  const saved = useValue('ratings', place.id)
  const [rating, setRating] = useState(saved?.stars ?? 5)
  const [text, setText] = useState(saved?.text ?? '')
  const [done, setDone] = useState(false)

  function submit(e) {
    e.preventDefault()
    if (rating < 1 || rating > 5) return
    setValue('ratings', place.id, { stars: rating, text: text.trim(), at: Date.now() })
    setDone(true)
  }

  return (
    <form
      onSubmit={submit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        background: 'rgb(244, 236, 223)',
        border: '1px dashed rgb(213, 196, 170)',
        borderRadius: 14,
        padding: 14,
        margin: '8px 0',
      }}
    >
      <strong>قيّم {place.name}</strong>
      <div className="starsin" role="group" aria-label="التقييم">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            className={n <= rating ? 'on' : ''}
            aria-label={`${n} نجوم`}
            aria-pressed={n === rating}
            onClick={() => {
              setRating(n)
              setDone(false)
            }}
          >
            ★
          </button>
        ))}
      </div>
      <label htmlFor="revt" className="sr">
        رأيك
      </label>
      <textarea
        id="revt"
        className="field"
        rows="3"
        placeholder="شو رأيك بالمكان؟"
        value={text}
        onChange={(e) => {
          setText(e.target.value)
          setDone(false)
        }}
      />
      <button type="submit" className="st sm red" disabled={!text.trim()} style={{ alignSelf: 'flex-start' }}>
        {saved ? 'تحديث التقييم' : 'نشر التقييم (+20 نقطة)'}
      </button>
      {done && (
        <span className="small" role="status" style={{ color: '#24402B', fontWeight: 700 }}>
          ✓ تم حفظ تقييمك
        </span>
      )}
    </form>
  )
}

/** Place details (UC-PB-01): gallery, description, ratings, save (UC-PB-04) and location. */
export default function PlacePage() {
  const { placeId } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const me = useCurrentProfile()
  const place = placeById(placeId)
  const [saved, toggleSave] = useToggle('savedPlaces', placeId)
  const myRating = useValue('ratings', placeId)
  if (!place) return <Navigate to="/places" replace />

  const details = PLACE_DETAILS[place.id] ?? {}
  const gallery = details.gallery ?? [place.img]
  const reviews = details.reviews ?? []
  const requireAuth = () => navigate('/login', { state: { from: { pathname: `/place/${place.id}` } } })

  return (
    <AppShell page="Place">
      <BackBar />
      <div className="page route" style={{ gap: 24 }}>
        <div className="crumb">
          <span>{categoryLabel(place.category)}</span>
          <span>·</span>
          <span>{place.area}</span>
        </div>
        <div className="gal">
          {gallery.map((img, i) => (
            <button key={i} type="button" aria-label="عرض الصورة" onClick={() => window.open(photoSrc(img), '_blank')}>
              <Photo img={img} alt={place.name} />
            </button>
          ))}
        </div>
        <div className="pinfo">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                <h1 className="h1" style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>
                  {place.name}
                </h1>
                <div className="row" style={{ gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                  <span className="tag dark">{categoryLabel(place.category)}</span>
                  {details.open !== undefined && (
                    <span className={details.open ? 'tag ok' : 'tag bad'}>{details.open ? 'مفتوح الآن' : 'مغلق الآن'}</span>
                  )}
                </div>
              </div>
              <span className="muted">
                {place.area}، نابلس · <b style={{ color: 'rgb(200, 70, 26)' }}>★ {place.rating.toFixed(1)}</b> ({place.reviews}{' '}
                تقييم)
              </span>
              {details.description && (
                <p style={{ margin: '6px 0 0', fontSize: 17, lineHeight: 1.8 }}>{details.description}</p>
              )}
              <div className="row" style={{ gap: 8 }}>
                {place.tags.map((t) => (
                  <span key={t} className="chip">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <section className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div className="between">
              <h2 className="h3">التقييمات</h2>
              <span className="b" style={{ color: 'rgb(200, 70, 26)', fontSize: 22 }}>
                ★ {place.rating.toFixed(1)}
              </span>
            </div>
            {isAuthenticated ? (
              <RateForm place={place} />
            ) : (
              <button type="button" className="st sm lnn" style={{ alignSelf: 'flex-start', margin: '8px 0' }} onClick={requireAuth}>
                سجّل دخولك لتقيّم المكان
              </button>
            )}
            {myRating && (
              <div className="rev">
                <span className="tbtn">
                  <Avatar user={me} />
                </span>
                <div style={{ flex: '1 1 0%', lineHeight: 1.6 }}>
                  <div className="between">
                    <strong>تقييمك</strong>
                    <span className="small" style={{ color: 'rgb(200, 70, 26)' }}>
                      {stars(myRating.stars)}
                    </span>
                  </div>
                  {myRating.text && <span>{myRating.text}</span>}
                </div>
              </div>
            )}
            {reviews.map((r) => (
              <div className="rev" key={r.user}>
                <Link to={profilePath(r.user)} className="tbtn">
                  <Avatar
                    user={{ ...userByName(r.user), ...(r.color && { color: r.color }) }}
                    photo={r.photo ?? null}
                  />
                </Link>
                <div style={{ flex: '1 1 0%', lineHeight: 1.6 }}>
                  <div className="between">
                    <Link to={profilePath(r.user)} className="ulink" style={{ textDecoration: 'none' }}>
                      {r.user}
                    </Link>
                    <span className="small" style={{ color: 'rgb(200, 70, 26)' }}>
                      {stars(r.stars)}
                    </span>
                  </div>
                  <span>{r.text}</span>
                  <br />
                  <span className="xs muted">{r.ago}</span>
                </div>
              </div>
            ))}
            {reviews.length === 0 && !myRating && <p className="small muted">ما في مراجعات مكتوبة لهالمكان لسا.</p>}
          </section>

          <aside style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 90 }}>
            <div className="row pacts" style={{ gap: 10 }}>
              <button
                type="button"
                className={saved ? 'st red' : 'st lnn'}
                aria-pressed={saved}
                onClick={isAuthenticated ? toggleSave : requireAuth}
              >
                {saved ? 'محفوظ ✓' : 'حفظ المكان'}
              </button>
              <Link to={`/map?place=${place.id}`} className="st grn">
                الاتجاهات
              </Link>
              <button
                type="button"
                className="st lnn"
                onClick={() => navigator.share?.({ title: place.name, url: location.href }).catch(() => {})}
              >
                مشاركة
              </button>
            </div>
            <div className="side-card">
              <strong>معلومات</strong>
              {details.hours && (
                <div className="row small" style={{ gap: 8 }}>
                  <Icon name="clock" className="ic sm" />
                  {details.open ? 'مفتوح' : 'مغلق'} · {details.hours}
                </div>
              )}
              <div className="row small" style={{ gap: 8 }}>
                <Icon name="pin" className="ic sm" />
                {place.area}، نابلس
              </div>
              <div className="mapbox" style={{ aspectRatio: '4 / 3', marginTop: 4 }}>
                <svg
                  viewBox="0 0 160 120"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                >
                  <path d="M0 70 C40 64 70 58 100 62 S140 70 160 60" fill="none" stroke="#D5C4AA" strokeWidth="4" />
                  <path d="M80 0 C82 40 86 60 92 120" fill="none" stroke="#D5C4AA" strokeWidth="3" />
                </svg>
                <span className="pin on" style={details.map ?? { left: '62%', top: '60%' }}>
                  <i />
                </span>
              </div>
              <Link to={`/map?place=${place.id}`} className="st sm lnn">
                عرض على الخريطة
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </AppShell>
  )
}
