import { Link } from 'react-router-dom'
import { placeByName } from '../data/places'
import { ME, userByName } from '../data/users'
import { bump, useToggle } from '../services/interactions'
import Avatar from './Avatar'
import Icon from './Icon'
import Photo from './Photo'

export function VerifiedBadge() {
  return (
    <span className="vb" aria-label="موثّق">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12.5l4.5 4.5L19 7.5" />
      </svg>
    </span>
  )
}

export const profilePath = (username) => (username === ME ? '/me' : `/u/${username}`)

/** Feed post (UC-SR-02) with like / save (UC-SR-04) and a link to its comments (UC-SR-03). */
export default function PostCard({ post, guest = false, onRequireAuth }) {
  const user = userByName(post.user)
  const [liked, toggleLike] = useToggle('likedPosts', post.id)
  const [saved, toggleSave] = useToggle('savedPosts', post.id)
  const [following, toggleFollow] = useToggle('following', post.user)
  const likes = liked ? bump(post.likes, 1) : post.likes

  // Visitors can read the feed; interactions ask them to sign in (UC-SR-02 A4).
  const guard = (fn) => (guest ? onRequireAuth : fn)

  return (
    <article className="post">
      <div className="row" style={{ padding: '10px 4px', gap: 10, flexWrap: 'nowrap' }}>
        <Link to={profilePath(post.user)} className="tbtn igav" aria-label={`ملف ${post.user}`}>
          <Avatar user={user} photo={post.avatar ?? null} />
        </Link>
        <span style={{ flex: '1 1 0%', lineHeight: 1.3, minWidth: 0 }}>
          <Link to={profilePath(post.user)} className="ulink" style={{ fontSize: 14 }}>
            {post.user}
          </Link>{' '}
          {post.verified && <VerifiedBadge />}
          <span className="xs muted">{` • ${post.time}`}</span>
          <br />
          <Link to={`/place/${placeByName(post.place)?.id ?? ''}`} className="tbtn xs muted">
            {post.place}
          </Link>
        </span>
        {post.followable && (
          <button type="button" className={`st sm ${following ? 'crm' : 'red'}`} onClick={guard(toggleFollow)}>
            {following ? 'متابَع' : 'متابعة'}
          </button>
        )}
      </div>
      <Link to={`/post/${post.id}`} className="im" aria-label="فتح المنشور">
        <Photo img={post.images[0]} alt={post.caption} />
      </Link>
      <div style={{ padding: '4px 8px 14px' }}>
        <div className="row" style={{ gap: 0, flexWrap: 'nowrap' }}>
          <button type="button" className="ib heartbtn" aria-pressed={liked} aria-label="أعجبني" onClick={guard(toggleLike)}>
            <Icon name="heart" className={liked ? 'ic fill' : 'ic'} />
          </button>
          <span className="igcnt">{likes}</span>
          <Link to={`/post/${post.id}`} className="ib" aria-label="تعليق">
            <Icon name="comment" />
          </Link>
          <span className="igcnt">{post.comments}</span>
          <button
            type="button"
            className="ib"
            aria-label="مشاركة"
            onClick={() => navigator.share?.({ title: post.caption, url: `${location.origin}/post/${post.id}` }).catch(() => {})}
          >
            <Icon name="send" />
          </button>
          <span style={{ flex: '1 1 0%' }} />
          <button type="button" className="ib heartbtn" aria-pressed={saved} aria-label="حفظ" onClick={guard(toggleSave)}>
            <Icon name="bookmark" className={saved ? 'ic fill' : 'ic'} />
          </button>
        </div>
        <div style={{ padding: '0 8px', fontSize: 14, lineHeight: 1.65 }}>
          <strong>{likes} إعجاب</strong>
          <br />
          <Link to={profilePath(post.user)} className="ulink">
            {post.user}
          </Link>{' '}
          <span>{post.caption}</span>
          <br />
          <Link to={`/post/${post.id}`} className="tbtn small muted" style={{ minHeight: 30 }}>
            عرض كل التعليقات ({post.comments})
          </Link>
        </div>
      </div>
    </article>
  )
}
