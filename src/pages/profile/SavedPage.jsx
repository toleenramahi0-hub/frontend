import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import AppShell, { BackBar } from '../../components/AppShell'
import Icon from '../../components/Icon'
import Photo from '../../components/Photo'
import { categoryLabel } from '../../data/categories'
import { placeById } from '../../data/places'
import { postById } from '../../data/posts'
import { useList, useValue } from '../../services/interactions'

function Empty({ title, text, to, link }) {
  return (
    <div className="empty">
      <span className="lk" aria-hidden="true">
        <Icon name="bookmark" size={32} />
      </span>
      <h2 className="h3">{title}</h2>
      <p className="muted" style={{ margin: 0 }}>
        {text}{' '}
        <Link to={to} className="link">
          {link}
        </Link>
      </p>
    </div>
  )
}

/** Posts the user saved with the bookmark button (newest first), as a grid like Instagram's Saved. */
export function SavedPosts() {
  const navigate = useNavigate()
  const ids = useList('savedPosts')
  const myPosts = useValue('myPosts', 'all') ?? []
  const posts = [...ids]
    .reverse()
    .map((id) => myPosts.find((p) => p.id === id) ?? postById(id))
    .filter(Boolean)

  if (!posts.length) {
    return <Empty title="احفظ اللي بدك ترجعله" text="اضغط على علامة الحفظ تحت أي منشور ليظهر هون. بس إنت بتشوف محفوظاتك." to="/home" link="تصفّح المنشورات" />
  }
  return (
    <div className="grid">
      {posts.map((p) => (
        <button key={p.id} type="button" className="tile" aria-label={`${p.user}: ${p.caption}`} onClick={() => navigate(`/post/${p.id}`)}>
          <Photo img={p.images[0]} />
          <span className="mark" aria-hidden="true">
            {p.images.length > 1 && <Icon name="copy" />}
          </span>
          <span className="ov" aria-hidden="true">
            <span className="row" style={{ gap: 6 }}>
              <Icon name="heart" />
              {p.likes}
            </span>
            <span className="row" style={{ gap: 6 }}>
              <Icon name="comment" />
              {p.comments}
            </span>
          </span>
        </button>
      ))}
    </div>
  )
}

/** Saved places of the signed-in user (UC-PB-04). */
export function SavedPlaces() {
  const places = useList('savedPlaces').map(placeById).filter(Boolean)
  if (!places.length) {
    return <Empty title="ما حفظت أماكن لسا" text="اضغط على علامة الحفظ بأي مكان ليظهر هون." to="/places" link="تصفّح الأماكن" />
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

/** /saved — everything the user saved: posts and places. Only the user can see it. */
export default function SavedPage({ overlay }) {
  const [params, setParams] = useSearchParams()
  const [tab, setTab] = useState(params.get('tab') === 'places' ? 'places' : 'posts')
  const posts = useList('savedPosts').length
  const places = useList('savedPlaces').length

  function pick(next) {
    setTab(next)
    setParams(next === 'places' ? { tab: 'places' } : {}, { replace: true })
  }

  return (
    <AppShell page="MyProfile" overlay={overlay}>
      <BackBar />
      <div className="page route">
        <div className="savedh">
          <h1 className="h3" style={{ margin: 0 }}>
            المحفوظات
          </h1>
          <span className="small muted">
            <Icon name="lock" d="M6 11h12v10H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3" size={14} /> بس إنت بتشوفها
          </span>
        </div>
        <div className="ptabs" role="tablist">
          <button type="button" role="tab" className="tabb" aria-selected={tab === 'posts'} onClick={() => pick('posts')}>
            <Icon name="grid" />
            <span>المنشورات{posts ? ` (${posts})` : ''}</span>
          </button>
          <button type="button" role="tab" className="tabb" aria-selected={tab === 'places'} onClick={() => pick('places')}>
            <Icon name="pin" />
            <span>الأماكن{places ? ` (${places})` : ''}</span>
          </button>
        </div>
        {tab === 'posts' ? <SavedPosts /> : <SavedPlaces />}
      </div>
    </AppShell>
  )
}
