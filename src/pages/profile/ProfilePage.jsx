import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import AppShell from '../../components/AppShell'
import Icon from '../../components/Icon'
import Photo, { photoSrc } from '../../components/Photo'
import { useCurrentProfile } from '../../context/useCurrentProfile'
import { categoryLabel } from '../../data/categories'
import { placeById, placeByName } from '../../data/places'
import { ME, userByName } from '../../data/users'
import { setValue, useList, useToggle, useValue } from '../../services/interactions'

const stars = (n) => '★'.repeat(n) + '☆'.repeat(5 - n)

function VerifiedTick() {
  return (
    <span className="vrbody" role="img" aria-label="حساب موثّق" style={{ width: 20, height: 20 }}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 12.5l4.5 4.5L19 7.5" />
      </svg>
    </span>
  )
}

/** Speech-bubble note over the avatar; the owner can edit it in place. */
function Note({ user, mine }) {
  const saved = useValue('notes', user.username)
  const text = saved ?? user.note ?? ''
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(text)

  if (!mine) {
    return text ? (
      <span className="note">
        <span className="note-t">{text}</span>
      </span>
    ) : null
  }
  if (editing) {
    return (
      <form
        className="note mine editing"
        onSubmit={(e) => {
          e.preventDefault()
          setValue('notes', user.username, draft.trim())
          setEditing(false)
        }}
      >
        <input
          className="note-t"
          autoFocus
          maxLength={60}
          value={draft}
          placeholder="شو ببالك؟"
          aria-label="النوت"
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => setEditing(false)}
          style={{ border: 0, background: 'transparent', font: 'inherit', textAlign: 'center', width: '100%', outline: 'none' }}
        />
      </form>
    )
  }
  return (
    <button
      type="button"
      className={text ? 'note mine' : 'note mine note-empty'}
      aria-label="تعديل النوت"
      onClick={() => {
        setDraft(text)
        setEditing(true)
      }}
    >
      <span className="note-t">{text || 'شارك نوت…'}</span>
    </button>
  )
}

function Mutuals({ text }) {
  return (
    <span className="small muted row" style={{ gap: 8, marginTop: 6 }}>
      <span className="mut" aria-hidden="true">
        <i style={{ background: 'rgb(23, 48, 34)' }}>أ</i>
        <i style={{ background: 'rgb(86, 101, 58)' }}>ن</i>
      </span>
      {text}
    </span>
  )
}

const btn = { flex: '1 1 140px', borderRadius: 12, minHeight: 44 }

function PostsGrid({ user }) {
  if (!user.grid?.length) {
    return (
      <div className="empty">
        <h2 className="h3">ما في منشورات لسا</h2>
      </div>
    )
  }
  return (
    <div className="grid" style={{ marginTop: -22 }}>
      {user.grid.map((t) => (
        <button
          key={t.caption}
          type="button"
          className="tile"
          aria-label={`${user.username}: ${t.caption}`}
          onClick={() => window.open(photoSrc(t.img), '_blank')}
        >
          <Photo img={t.img} />
          <span className="mark" aria-hidden="true">
            {t.multi && <Icon name="copy" />}
          </span>
          <span className="ov" aria-hidden="true">
            <span className="row" style={{ gap: 6 }}>
              <Icon name="heart" />
              {t.likes}
            </span>
            <span className="row" style={{ gap: 6 }}>
              <Icon name="comment" />
              {t.comments}
            </span>
          </span>
        </button>
      ))}
    </div>
  )
}

/** Places tab: the user's ratings, each from a location-verified visit (UC-PB-05). */
function PlaceReviews({ user, mine }) {
  const reviews = user.reviews ?? []
  return (
    <div className="vplaces">
      <div className="vhead">
        <strong style={{ fontSize: 17 }}>{mine ? 'تقييماتي للأماكن' : `تقييمات ${user.username} للأماكن`}</strong>
        <span className="xs muted">{reviews.length} تقييمات · كلها من زيارات موثّقة بالموقع</span>
      </div>
      <div className="vrevs">
        {reviews.map((r) => (
          <Link key={r.place} to={`/place/${placeByName(r.place)?.id ?? ''}`} className="vrev">
            <span className="vim">
              <img src={r.img} alt={r.place} />
            </span>
            <span className="vrbody">
              <span className="vtop">
                <span className="vname">{r.place}</span>
                <span className="vstars" aria-label={`${r.stars} من 5`}>
                  {stars(r.stars)}
                </span>
              </span>
              <span className="vtxt">{r.text}</span>
              <span className="vmeta">
                <span className="vbadge">✓ زيارة موثّقة</span>
                <span className="vcat">{r.category}</span>
                <span>
                  {mine ? 'زرته' : 'زارته'} {r.date}
                </span>
              </span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}

/**
 * Profile (UC-U05 own profile, UC-SR-17 another user's profile). Private accounts that
 * the viewer doesn't follow show only the header (UC-SR-17 A4).
 */
export default function ProfilePage({ overlay }) {
  const { username } = useParams()
  const me = useCurrentProfile()
  const navigate = useNavigate()
  const mine = !username || username === me?.username
  const user = mine ? me : userByName(username)
  const [params] = useSearchParams()
  const [tab, setTab] = useState(params.get('tab') ?? 'posts')
  const [following, toggleFollow] = useToggle('following', user?.username ?? '', !!user?.following)

  if (username === ME && mine) return <Navigate to="/me" replace />
  if (!user) {
    return (
      <AppShell page="PrivateProfile">
        <div className="page route">
          <div className="empty">
            <h2 className="h3">الحساب غير موجود</h2>
            <p className="muted" style={{ margin: 0 }}>
              يمكن انحذف أو تغيّر اسم المستخدم.
            </p>
          </div>
        </div>
      </AppShell>
    )
  }

  const locked = user.private && !following && !mine
  const page = mine ? 'MyProfile' : locked ? 'PrivateProfile' : 'FriendProfile'
  const requireAuth = () => navigate('/login')
  const share = () =>
    navigator.share?.({ title: user.name, url: `${location.origin}/u/${user.username}` }).catch(() => {})

  return (
    <AppShell page={page} dock={mine ? 'me' : undefined} overlay={overlay}>
      <div className="page route" style={{ gap: 26 }}>
        <section className="phead" aria-label="معلومات الحساب">
          <div className="a-av">
            <Note user={user} mine={mine} />
            <button type="button" className={user.highlights?.length ? 'ring' : 'ring none'} aria-label="صورة الملف">
              <span style={{ background: user.photo ? 'rgb(231, 220, 201)' : user.color }}>
                {user.photo ? <Photo img={user.photo} /> : user.initial}
              </span>
            </button>
            {mine && (
              <Link to="/edit" className="camb" aria-label="تعديل الملف الشخصي">
                <Icon name="camera" />
              </Link>
            )}
          </div>
          <div className="a-top" style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <h1 dir="ltr" style={{ margin: 0, fontSize: 22, fontWeight: 700, fontFamily: 'Tajawal, sans-serif' }}>
              {user.username}
            </h1>
            {user.verified && <VerifiedTick />}
            {locked && <Icon name="lock" d="M6 11h12v10H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3" />}
            {mine && <span className="tag ok">حسابك</span>}
            {!mine && user.followsYou && <span className="tag">يتابعك</span>}
            <span style={{ flex: '1 1 0%' }} />
            {mine ? (
              <Link to="/settings" className="ib" aria-label="الإعدادات">
                <Icon name="menu" />
              </Link>
            ) : (
              <button type="button" className="ib" aria-label="خيارات">
                <Icon name="dots" />
              </button>
            )}
          </div>
          <div className="a-stats stats-row" style={{ display: 'flex', gap: 'clamp(16px, 4vw, 40px)', flexWrap: 'wrap' }}>
            <span className="stat" style={{ cursor: 'default' }}>
              <b>{user.stats.posts}</b>
              <span>منشور</span>
            </span>
            <button type="button" className="stat">
              <b>{user.stats.followers}</b>
              <span>متابِع</span>
            </button>
            <button type="button" className="stat">
              <b>{user.stats.following}</b>
              <span>متابَع</span>
            </button>
          </div>
          <div className="a-bio" style={{ display: 'flex', flexDirection: 'column', gap: 4, maxWidth: 560 }}>
            <strong style={{ fontSize: 16 }}>{user.name}</strong>
            {user.role && <span className="small muted b">{user.role}</span>}
            {user.bio && <p style={{ margin: 0, whiteSpace: 'pre-line', lineHeight: 1.7 }}>{user.bio}</p>}
            {user.link && (
              <span dir="ltr" style={{ color: 'rgb(23, 48, 34)', fontWeight: 700, alignSelf: 'flex-end' }}>
                {user.link}
              </span>
            )}
            {!mine && user.mutuals && <Mutuals text={user.mutuals} />}
          </div>
          <div className="a-btns" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            {mine ? (
              <>
                <Link to="/edit" className="st sm crm" style={{ ...btn, flex: '1 1 150px' }}>
                  تعديل الملف الشخصي
                </Link>
                <button type="button" className="st sm crm" style={{ ...btn, flex: '1 1 120px' }} onClick={share}>
                  مشاركة
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className={following ? 'st sm crm' : 'st sm red'}
                  style={btn}
                  onClick={me ? toggleFollow : requireAuth}
                >
                  {following ? 'متابَع ▾' : user.private ? 'طلب متابعة' : 'متابعة'}
                </button>
                <Link to={me ? `/inbox?to=${user.username}` : '/login'} className="st sm crm" style={btn}>
                  مراسلة
                </Link>
                <button
                  type="button"
                  className="st sm crm"
                  aria-label="مشاركة الملف"
                  style={{ borderRadius: 12, minHeight: 44, minWidth: 48, padding: '7px 12px' }}
                  onClick={share}
                >
                  <Icon name="send" />
                </button>
              </>
            )}
          </div>
        </section>

        {locked ? (
          <div className="empty">
            <span className="lk" aria-hidden="true">
              <Icon name="lock" d="M6 11h12v10H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3" size={32} />
            </span>
            <h2 className="h3">هذا الحساب خاص</h2>
            <p className="muted" style={{ margin: 0 }}>
              تابِع {user.firstName ?? user.name} لتشوف منشوراته وأماكنه.
            </p>
          </div>
        ) : (
          <>
            <section className="hls" aria-label="القصص المميزة">
              {(user.highlights ?? []).map((h) => (
                <button key={h.label} type="button" className="hl">
                  <span className="c">
                    <span>
                      <Photo img={h.img} />
                    </span>
                  </span>
                  <small>{h.label}</small>
                </button>
              ))}
              {mine && (
                <Link to="/new-post" className="hl">
                  <span className="c">
                    <span style={{ background: 'rgb(251, 246, 238)' }}>
                      <Icon name="plus" />
                    </span>
                  </span>
                  <small>جديد</small>
                </Link>
              )}
            </section>
            <div className="ptabs" role="tablist">
              <button
                type="button"
                role="tab"
                className="tabb"
                aria-selected={tab === 'posts'}
                onClick={() => setTab('posts')}
                aria-label="المنشورات"
              >
                <Icon name="grid" />
                <span>المنشورات</span>
              </button>
              <button
                type="button"
                role="tab"
                className="tabb"
                aria-selected={tab === 'places'}
                onClick={() => setTab('places')}
                aria-label="الأماكن"
              >
                <Icon
                  name="pin"
                  d="M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"
                />
                <span>الأماكن</span>
              </button>
              {mine && (
                <button
                  type="button"
                  role="tab"
                  className="tabb"
                  aria-selected={tab === 'saved'}
                  onClick={() => setTab('saved')}
                  aria-label="المحفوظات"
                >
                  <Icon name="bookmark" />
                  <span>المحفوظات</span>
                </button>
              )}
            </div>
            {tab === 'posts' && <PostsGrid user={user} />}
            {tab === 'places' && <PlaceReviews user={user} mine={mine} />}
            {tab === 'saved' && <SavedPlaces />}
          </>
        )}
      </div>
    </AppShell>
  )
}

/** Saved places of the signed-in user (UC-PB-04). */
function SavedPlaces() {
  const places = useList('savedPlaces').map(placeById).filter(Boolean)
  if (!places.length) {
    return (
      <div className="empty">
        <span className="lk" aria-hidden="true">
          <Icon name="bookmark" size={32} />
        </span>
        <h2 className="h3">ما حفظت أماكن لسا</h2>
        <p className="muted" style={{ margin: 0 }}>
          اضغط على علامة الحفظ بأي مكان ليظهر هون.{' '}
          <Link to="/places" className="link">
            تصفّح الأماكن
          </Link>
        </p>
      </div>
    )
  }
  return (
    <div className="vplaces">
      <div className="vrevs">
        {places.map((p) => (
          <Link key={p.id} to={`/place/${p.id}`} className="vrev">
            <span className="vim">
              <img src={p.img} alt={p.name} />
            </span>
            <span className="vrbody">
              <span className="vtop">
                <span className="vname">{p.name}</span>
                <span className="vstars">★ {p.rating.toFixed(1)}</span>
              </span>
              <span className="vmeta">
                <span className="vcat">{categoryLabel(p.category)}</span>
                <span>{p.area}</span>
              </span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
