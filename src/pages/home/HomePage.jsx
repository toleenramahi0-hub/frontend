import { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'
import AppShell from '../../components/AppShell'
import Avatar from '../../components/Avatar'
import PlaceStrip from '../../components/PlaceStrip'
import PostCard from '../../components/PostCard'
import Photo from '../../components/Photo'
import { useCurrentProfile } from '../../context/useCurrentProfile'
import { HIGHLIGHTS } from '../../data/places'
import { FEED, STORIES } from '../../data/posts'
import { SUGGESTIONS, userByName } from '../../data/users'
import { useList, useToggle, useValue } from '../../services/interactions'

function FollowButton({ username, request, className = 'st sm red' }) {
  const [on, toggle] = useToggle('following', username)
  const idle = request ? 'طلب متابعة' : 'متابعة'
  const done = request ? 'تم الطلب' : 'متابَع'
  return (
    <button type="button" className={on ? className.replace('red', 'crm') : className} onClick={toggle}>
      {on ? done : idle}
    </button>
  )
}

const DAY = 24 * 60 * 60 * 1000

function Stories({ me }) {
  const added = useValue('myStories', 'all') ?? []
  const deleted = useList('deletedStoryFrames')
  // Green ring when your live story includes a close-friends item, like Instagram.
  const closeRing = added.some((s) => s.audience === 'close' && Date.now() - s.at < DAY && !deleted.includes(s.id))
  return (
    <section aria-label="القصص">
      <div className="stories">
        <Link to="/story/me" className="sto">
          <span className={closeRing ? 'c close' : 'c'}>
            <span style={{ background: me.color }}>{me.initial}</span>
          </span>
          <small>قصتك</small>
        </Link>
        {STORIES.map((s) => (
          <Link key={s.user} to={`/story/${s.user}`} className="sto">
            <span className={s.ring === 'close' ? 'c close' : 'c'}>
              <span>
                <Photo img={s.img} />
              </span>
            </span>
            <small dir="ltr">{s.user}</small>
          </Link>
        ))}
      </div>
    </section>
  )
}

// Phone-only "suggested for you" strip between posts (shown by CSS under 640px).
function MobileSuggestions({ hidden, onHide }) {
  return (
    <section className="msugg" aria-label="مقترحين إلك">
      <div className="between">
        <strong>مقترحين إلك</strong>
        <Link to="/search" className="link small" style={{ textDecoration: 'none', fontWeight: 700, color: '#7E1514' }}>
          عرض الكل
        </Link>
      </div>
      <div className="msrow">
        {SUGGESTIONS.filter((s) => s.card && !hidden.includes(s.username)).map((s) => (
          <div className="mscard" key={s.username}>
            <button type="button" className="msx" aria-label="إخفاء" onClick={() => onHide(s.username)}>
              ✕
            </button>
            <Link to={`/u/${s.username}`} className="msu">
              <span className="msav">
                <img src={s.card} alt="" />
              </span>
              <strong dir="ltr">{s.username}</strong>
              <span>{s.reason}</span>
            </Link>
            <FollowButton username={s.username} className="st sm red msbtn" />
          </div>
        ))}
      </div>
    </section>
  )
}

function Sidebar({ me }) {
  return (
    <aside className="feedside" style={{ display: 'flex', flexDirection: 'column', gap: 18, position: 'sticky', top: 90 }}>
      <div className="side-card" style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Link to="/me" className="tbtn">
          <Avatar user={me} size="s44" />
        </Link>
        <span style={{ flex: '1 1 0%', lineHeight: 1.35, minWidth: 0 }}>
          <strong>{me.name}</strong>
          <br />
          <span className="small muted" dir="ltr">
            @{me.username}
          </span>
        </span>
        <Link to="/me" className="link tbtn small">
          ملفي
        </Link>
      </div>
      <div className="side-card">
        <div className="between">
          <strong className="small">مقترحين إلك</strong>
          <Link to="/search" className="tbtn xs b">
            عرض الكل
          </Link>
        </div>
        {SUGGESTIONS.map((s) => (
          <div className="urow" key={s.username}>
            <Link to={`/u/${s.username}`} className="tbtn">
              <Avatar user={userByName(s.username)} photo={s.photo} />
            </Link>
            <span style={{ flex: '1 1 0%', minWidth: 0, lineHeight: 1.3 }}>
              <Link to={`/u/${s.username}`} className="ulink" style={{ fontSize: 14 }}>
                {s.username}
              </Link>
              <br />
              <span className="xs muted">{s.reason}</span>
            </span>
            <FollowButton username={s.username} request={s.request} />
          </div>
        ))}
      </div>
      <div className="igfoot xs muted">
        <Link to="/places" className="tbtn xs muted">
          الأماكن
        </Link>
        {' · '}
        <Link to="/map" className="tbtn xs muted">
          الخريطة
        </Link>
        <br />© 2026 جو إكسبلور
      </div>
    </aside>
  )
}

/**
 * Signed-in home feed (UC-SR-02): stories, highlighted places, posts and suggestions.
 * `overlay` lets post / story / settings / new-post dialogs open on top of the feed.
 */
export default function HomePage({ overlay }) {
  const me = useCurrentProfile()
  const [hiddenSuggestions, setHiddenSuggestions] = useState([])
  const hide = (username) => setHiddenSuggestions((h) => [...h, username])
  const myPosts = useValue('myPosts', 'all') ?? []
  const deleted = useList('deletedPosts')
  const feed = [...myPosts, ...FEED.filter((p) => !deleted.includes(p.id))]

  return (
    <AppShell page="Home" nav="home" overlay={overlay}>
      <div className="page route ig">
        <div className="feedgrid">
          <div className="igcol">
            <Stories me={me} />
            <PlaceStrip ids={HIGHLIGHTS} />
            <section aria-label="آخر المنشورات" className="igfeed">
              {feed.map((post, i) => (
                <Fragment key={post.id}>
                  <PostCard post={post} />
                  {i % 5 === 4 && i < 20 && <MobileSuggestions hidden={hiddenSuggestions} onHide={hide} />}
                </Fragment>
              ))}
            </section>
          </div>
          <Sidebar me={me} />
        </div>
      </div>
    </AppShell>
  )
}
