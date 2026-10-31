import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import AppShell, { BackBar } from '../../components/AppShell'
import Avatar from '../../components/Avatar'
import Icon from '../../components/Icon'
import Photo from '../../components/Photo'
import { profilePath } from '../../components/PostCard'
import { categoryLabel } from '../../data/categories'
import { EXPLORE } from '../../data/explore'
import { PLACES } from '../../data/places'
import { USERS } from '../../data/users'
import { recommend } from '../../services/recommendations'

const norm = (s) => s.toLowerCase().replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').trim()

function ResultRow({ to, avatar, title, subtitle }) {
  return (
    <div className="srrow">
      <Link to={to} className="srrow-main">
        {avatar}
        <span className="srrow-t">
          <b>{title}</b>
          <span className="small muted">{subtitle}</span>
        </span>
      </Link>
    </div>
  )
}

const placeRow = (p) => (
  <ResultRow
    key={p.id}
    to={`/place/${p.id}`}
    avatar={
      <span className="srpin" aria-hidden="true">
        <Icon name="pin" />
      </span>
    }
    title={p.name}
    subtitle={`${categoryLabel(p.category)} · ${p.area} · ★ ${p.rating.toFixed(1)}`}
  />
)

/** Search people and places (UC-PB-02), with natural-language suggestions (UC-AI-02). */
export default function SearchPage() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const setQuery = (value) => setParams(value ? { q: value } : {}, { replace: true })

  const { suggested, places, people } = useMemo(() => {
    const n = norm(q)
    if (!n) return { suggested: [], places: [], people: [] }
    const { results } = recommend(q)
    const ids = new Set(results.map((p) => p.id))
    return {
      suggested: results,
      places: PLACES.filter(
        (p) => !ids.has(p.id) && (norm(p.name).includes(n) || norm(p.area).includes(n) || p.tags.some((t) => norm(t).includes(n))),
      ),
      people: Object.values(USERS).filter((u) => u.username.includes(n) || norm(u.name).includes(n)),
    }
  }, [q])

  const empty = q.trim() && !suggested.length && !places.length && !people.length

  return (
    <AppShell page="Search" dock="search">
      <BackBar />
      <div className="page route srpage">
        <form className="srbar" role="search" onSubmit={(e) => e.preventDefault()}>
          <div className="srbox">
            <Icon name="search" className="ic sm" />
            <label htmlFor="srq" className="sr">
              بحث
            </label>
            <input id="srq" placeholder="بحث" autoComplete="off" value={q} onChange={(e) => setQuery(e.target.value)} />
            {q && (
              <button type="button" className="srx" aria-label="مسح" onClick={() => setQuery('')}>
                ✕
              </button>
            )}
          </div>
          {q && (
            <button type="button" className="tbtn srcancel" onClick={() => setQuery('')}>
              إلغاء
            </button>
          )}
        </form>

        {!q.trim() && (
          <div className="srgrid">
            {EXPLORE.map((t) => (
              <Link
                key={`${t.user}-${t.caption}`}
                to={profilePath(t.user)}
                className={t.size ? `srt ${t.size}` : 'srt'}
                aria-label={`${t.user}: ${t.caption}`}
              >
                <Photo img={t.img} />
                {t.multi && (
                  <span className="srmulti" aria-hidden="true">
                    <Icon name="copy" />
                  </span>
                )}
                <span className="ov" aria-hidden="true">
                  <span className="row" style={{ gap: 14 }}>
                    <span>♥ {t.likes}</span>
                    <span>💬 {t.comments}</span>
                  </span>
                </span>
              </Link>
            ))}
          </div>
        )}

        {q.trim() && (
          <div className="srlist">
            {suggested.length > 0 && (
              <>
                <div className="srhead between">
                  <strong>اقتراحات إلك ✨</strong>
                  <span className="xs muted">حسب طلبك</span>
                </div>
                {suggested.map(placeRow)}
              </>
            )}
            {people.length > 0 && (
              <>
                <div className="srhead">
                  <strong>حسابات</strong>
                </div>
                {people.map((u) => (
                  <ResultRow
                    key={u.username}
                    to={profilePath(u.username)}
                    avatar={<Avatar user={u} />}
                    title={u.username}
                    subtitle={u.name}
                  />
                ))}
              </>
            )}
            {places.length > 0 && (
              <>
                <div className="srhead">
                  <strong>أماكن</strong>
                </div>
                {places.map(placeRow)}
              </>
            )}
            {empty && (
              <div className="srnone">
                <strong>ما لقينا نتائج لـ "{q}"</strong>
                <p className="small muted" style={{ margin: '6px 0 0' }}>
                  جرّب كلمة ثانية أو تصفّح{' '}
                  <Link to="/places" className="srlink">
                    الأماكن
                  </Link>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  )
}
