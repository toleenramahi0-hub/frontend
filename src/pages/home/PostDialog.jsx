import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import Avatar from '../../components/Avatar'
import Icon from '../../components/Icon'
import Overlay from '../../components/Overlay'
import Photo from '../../components/Photo'
import { profilePath } from '../../components/PostCard'
import { useCurrentProfile } from '../../context/useCurrentProfile'
import { placeByName } from '../../data/places'
import { SAMPLE_COMMENTS, postById } from '../../data/posts'
import { userByName } from '../../data/users'
import { bump, setValue, toggle, useList, useToggle, useValue } from '../../services/interactions'

const REPORT_REASONS = ['محتوى مسيء', 'سبام أو إعلان', 'معلومات مضللة', 'صورة غير لائقة', 'غير ذلك']

/** Report a post (UC-SR-06): a reason is required and a pending report isn't sent twice. */
function ReportForm({ postId, onDone }) {
  const existing = useValue('reports', postId)
  const [reason, setReason] = useState('')
  const [details, setDetails] = useState('')
  if (existing) {
    return <p className="small" style={{ padding: '10px 14px', margin: 0 }}>بلاغك عن هالمنشور قيد المراجعة.</p>
  }
  return (
    <form
      style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 8, borderBottom: '1px solid rgb(226, 212, 191)' }}
      onSubmit={(e) => {
        e.preventDefault()
        if (!reason) return
        setValue('reports', postId, { reason, details: details.trim(), status: 'pending', at: Date.now() })
        onDone()
      }}
    >
      <strong className="small">ليش بدك تبلّغ عن هالمنشور؟</strong>
      <div className="row" style={{ gap: 6 }}>
        {REPORT_REASONS.map((r) => (
          <button key={r} type="button" className="fchip" aria-pressed={reason === r} onClick={() => setReason(r)}>
            {r}
          </button>
        ))}
      </div>
      <input className="field" placeholder="تفاصيل إضافية (اختياري)" value={details} onChange={(e) => setDetails(e.target.value)} />
      <button type="submit" className="st sm red" disabled={!reason} style={{ alignSelf: 'flex-start' }}>
        إرسال البلاغ
      </button>
    </form>
  )
}

/** Post with its comments (UC-SR-02 view, UC-SR-03 comment, UC-SR-05/12 delete own). */
export default function PostDialog() {
  const { postId } = useParams()
  const navigate = useNavigate()
  const me = useCurrentProfile()
  const myPosts = useValue('myPosts', 'all') ?? []
  const post = myPosts.find((p) => p.id === postId) ?? postById(postId)
  const [index, setIndex] = useState(0)
  const [draft, setDraft] = useState('')
  const [reporting, setReporting] = useState(false)
  const [reported, setReported] = useState(false)
  const [liked, toggleLike] = useToggle('likedPosts', postId)
  const [saved, toggleSave] = useToggle('savedPosts', postId)
  const deleted = useList('deletedPosts')
  const myComments = useValue('comments', postId) ?? []

  const close = () => navigate(-1)
  if (!post || deleted.includes(post.id)) return <Navigate to="/home" replace />

  const mine = post.user === me.username
  const author = userByName(post.user)
  const images = post.images
  const comments = post.id.startsWith('my') ? myComments : [...SAMPLE_COMMENTS, ...myComments]

  function addComment(e) {
    e.preventDefault()
    const text = draft.trim()
    if (!text) return
    setValue('comments', postId, [...myComments, { id: `m${Date.now()}`, user: me.username, text, ago: 'الآن', mine: true }])
    setDraft('')
  }

  function deleteComment(id) {
    if (!confirm('حذف التعليق؟')) return
    setValue('comments', postId, myComments.filter((c) => c.id !== id))
  }

  function deletePost() {
    if (!confirm('متأكد إنك بدك تحذف المنشور؟ ما فيك ترجعه بعدين.')) return
    if (myPosts.some((p) => p.id === post.id)) setValue('myPosts', 'all', myPosts.filter((p) => p.id !== post.id))
    else toggle('deletedPosts', post.id)
    navigate('/home', { replace: true })
  }

  return (
    <Overlay label="منشور" onClose={close}>
      <button type="button" className="ib closex" aria-label="إغلاق" onClick={close}>
        <Icon name="close" />
      </button>
      <article className="pm">
        <div className="media">
          <Photo img={images[index]} alt={post.caption} />
          {index < images.length - 1 && (
            <button type="button" className="navarr l" aria-label="التالية" onClick={() => setIndex(index + 1)}>
              <Icon name="chevronLeft" />
            </button>
          )}
          {index > 0 && (
            <button type="button" className="navarr r" aria-label="السابقة" onClick={() => setIndex(index - 1)}>
              <Icon name="chevronRight" />
            </button>
          )}
          {images.length > 1 && (
            <span className="dots" aria-hidden="true">
              {images.map((_, i) => (
                <i key={i} className={i === index ? 'on' : ''} />
              ))}
            </span>
          )}
        </div>
        <div className="side2">
          <div className="between" style={{ padding: '10px 14px', borderBottom: '1px solid rgb(226, 212, 191)', flexWrap: 'nowrap' }}>
            <div className="row" style={{ gap: 10, flexWrap: 'nowrap', minWidth: 0 }}>
              <Link to={profilePath(post.user)} className="tbtn">
                <Avatar user={author} photo={post.avatar ?? null} />
              </Link>
              <div style={{ minWidth: 0, lineHeight: 1.3 }}>
                <Link to={profilePath(post.user)} className="ulink" style={{ fontSize: 14 }}>
                  {post.user}
                </Link>
                <br />
                <Link to={`/place/${placeByName(post.place)?.id ?? ''}`} className="tbtn xs muted">
                  {post.place}
                </Link>
              </div>
            </div>
            {mine ? (
              <button type="button" className="ib" aria-label="حذف المنشور" style={{ color: 'rgb(126, 21, 20)' }} onClick={deletePost}>
                <Icon name="trash" />
              </button>
            ) : (
              <button type="button" className="tbtn xs muted" onClick={() => setReporting((r) => !r)} style={{ minHeight: 44 }}>
                إبلاغ
              </button>
            )}
          </div>
          {reporting && !mine && (
            <ReportForm
              postId={post.id}
              onDone={() => {
                setReporting(false)
                setReported(true)
              }}
            />
          )}
          {reported && (
            <p className="small" role="status" style={{ padding: '8px 14px', margin: 0, color: '#24402B', fontWeight: 700 }}>
              ✓ وصلنا بلاغك، رح نراجعه.
            </p>
          )}
          <div className="cmts">
            <div className="row" style={{ gap: 10, alignItems: 'flex-start', flexWrap: 'nowrap' }}>
              <Avatar user={author} photo={post.avatar ?? null} />
              <div style={{ fontSize: 14, lineHeight: 1.6 }}>
                <Link to={profilePath(post.user)} className="ulink">
                  {post.user}
                </Link>{' '}
                <span>{post.caption}</span>
                <br />
                <span className="xs muted">{post.time}</span>
              </div>
            </div>
            {comments.map((c) => (
              <div
                key={c.id}
                className="row"
                style={{ gap: 10, alignItems: 'flex-start', flexWrap: 'nowrap', animation: '0.3s ease 0s 1 normal both running ge-fade' }}
              >
                <Link to={profilePath(c.user)} className="tbtn">
                  <Avatar user={c.mine ? me : userByName(c.user)} photo={c.mine ? undefined : c.photo} size="s32" />
                </Link>
                <div style={{ flex: '1 1 0%', fontSize: 14, lineHeight: 1.6 }}>
                  <Link to={profilePath(c.user)} className="ulink">
                    {c.user}
                  </Link>{' '}
                  <span>{c.text}</span>
                  <br />
                  <span className="xs muted">{c.ago}</span>
                  {c.mine && (
                    <>
                      {' · '}
                      <button type="button" className="tbtn xs muted" onClick={() => deleteComment(c.id)}>
                        حذف
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgb(226, 212, 191)', padding: '6px 8px 10px' }}>
            <div className="row" style={{ gap: 0, flexWrap: 'nowrap' }}>
              <button type="button" className="ib heartbtn" aria-pressed={liked} aria-label="أعجبني" onClick={toggleLike}>
                <Icon name="heart" className={liked ? 'ic fill' : 'ic'} />
              </button>
              <button
                type="button"
                className="ib"
                aria-label="مشاركة"
                onClick={() => navigator.share?.({ title: post.caption, url: location.href }).catch(() => {})}
              >
                <Icon name="send" />
              </button>
              <span style={{ flex: '1 1 0%' }} />
              <button type="button" className="ib heartbtn" aria-pressed={saved} aria-label="حفظ" onClick={toggleSave}>
                <Icon name="bookmark" className={saved ? 'ic fill' : 'ic'} />
              </button>
            </div>
            <div style={{ padding: '0 8px' }}>
              <strong>{liked ? bump(post.likes, 1) : post.likes} إعجاب</strong>
            </div>
          </div>
          <form className="cin" onSubmit={addComment}>
            <label htmlFor="pc" className="sr">
              تعليق
            </label>
            <input id="pc" placeholder="أضف تعليقاً…" autoComplete="off" value={draft} onChange={(e) => setDraft(e.target.value)} maxLength={500} />
            <button type="submit" className="post-btn" disabled={!draft.trim()}>
              نشر
            </button>
          </form>
        </div>
      </article>
    </Overlay>
  )
}
