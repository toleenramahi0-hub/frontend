import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Avatar from '../../components/Avatar'
import Icon from '../../components/Icon'
import Photo from '../../components/Photo'
import { profilePath } from '../../components/PostCard'
import { useCurrentProfile } from '../../context/useCurrentProfile'
import { STORIES } from '../../data/posts'
import { toggle, useList, useToggle, useValue } from '../../services/interactions'
import StoryReplyBar from './StoryReplyBar'

const clock = (pos, scale) => ({ src: '/assets/images/nablus-clock-tower.jpg', pos, scale })

// The signed-in user's own story (two frames); others have one frame from the stories row.
const MY_FRAMES = [
  { img: clock('48% 16%', 2.6), caption: 'صباح البلدة القديمة', ago: '3 س' },
  { img: clock('72% 26%', 2.2), caption: 'السهرة هون', place: 'قهوة السطح', ago: '40 د' },
]
// Who viewed the signed-in user's story (shown under "النشاط").
const VIEWERS = ['sara.y', 'ahmad.kh', 'nour.travels']
const VIEW_COUNT = 44

const DAY = 24 * 60 * 60 * 1000

// "الآن" / "12 د" / "3 س" for a story added at `at`.
function agoFrom(at) {
  const min = Math.floor((Date.now() - at) / 60000)
  if (min < 1) return 'الآن'
  return min < 60 ? `${min} د` : `${Math.floor(min / 60)} س`
}

const AGO = ['2 س', '4 س', '5 س', '6 س', '8 س', '10 س', '12 س', '20 س']

function HighlightButton({ id }) {
  const [on, flip] = useToggle('highlightedStoryFrames', id)
  return (
    <button type="button" className="stv-act" aria-pressed={on} onClick={flip}>
      <Icon name="plusCircle" />
      {on ? 'مميّزة' : 'تمييز'}
    </button>
  )
}

/** Full-screen story viewer over the feed. */
export default function StoryViewer() {
  const { username } = useParams()
  const navigate = useNavigate()
  const me = useCurrentProfile()
  const order = ['me', ...STORIES.map((s) => s.user)]
  const [params] = useSearchParams()
  const added = useValue('myStories', 'all') ?? []
  const [frame, setFrame] = useState(() => (params.get('latest') ? Infinity : 0))
  const [paused, setPaused] = useState(false)
  const [muted, setMuted] = useState(false)
  const [sheet, setSheet] = useState(null) // 'options' | 'activity' | null
  const [copied, setCopied] = useState(false)
  const [replying, setReplying] = useState(false)
  const deleted = useList('deletedStoryFrames')

  const who = username === 'me' || username === me.username ? 'me' : username
  const index = order.indexOf(who)

  const frames =
    who === 'me'
      ? [
          ...MY_FRAMES.map((f, id) => ({ ...f, id })),
          // stories added with "إضافة"; like Instagram they disappear after 24 hours
          ...added.filter((s) => Date.now() - s.at < DAY).map((s) => ({ ...s, ago: agoFrom(s.at) })),
        ].filter((f) => !deleted.includes(f.id))
      : [{ img: STORIES[index - 1]?.img, ago: AGO[(index - 1) % AGO.length], audience: STORIES[index - 1]?.ring === 'close' ? 'close' : 'all' }]

  const close = () => navigate('/home')
  const goUser = (i) => {
    setFrame(0)
    setSheet(null)
    if (i < 0 || i >= order.length) close()
    else navigate(`/story/${order[i]}`, { replace: true })
  }
  const shown = Math.min(frame, frames.length - 1)
  const next = () => (shown < frames.length - 1 ? setFrame(shown + 1) : goUser(index + 1))
  const prev = () => (shown > 0 ? setFrame(shown - 1) : goUser(index - 1))

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      if (sheet) setSheet(null)
      else navigate('/home')
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [navigate, sheet])

  if (index < 0) return <Navigate to="/home" replace />

  const isMine = who === 'me'
  // Own story with every frame deleted: nothing left to show.
  if (!frames.length) return <Navigate to="/home" replace />
  const current = frames[shown]

  function deleteFrame() {
    toggle('deletedStoryFrames', current.id)
    setSheet(null)
    if (shown > 0 && shown >= frames.length - 1) setFrame(shown - 1)
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/story/${who}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard blocked: nothing to do
    }
  }
  const peeks = order.slice(index + 1, index + 3)

  return (
    <div className="stv" role="dialog" aria-modal="true" aria-label="القصص">
      <div className="stv-top">
        <span className="serif b" style={{ fontSize: 24 }}>
          GoExplore
        </span>
        <button type="button" className="ib" aria-label="إغلاق القصص" style={{ color: 'rgb(247, 240, 226)' }} onClick={close}>
          <Icon name="close" />
        </button>
      </div>
      <div className="stv-stage">
        <button type="button" className="stv-arrow" aria-label="القصة السابقة" onClick={() => goUser(index - 1)}>
          <Icon name="chevronRight" />
        </button>
        <div className={paused || sheet || replying ? 'stv-card paused' : 'stv-card'}>
          <Photo key={`${who}-${shown}`} img={current.img} alt={current.caption ?? ''} className="kb b" />
          <span className="stv-shade-t" aria-hidden="true" />
          <span className="stv-shade-b" aria-hidden="true" />
          <div className="segs" style={{ zIndex: 6 }}>
            {frames.map((_, i) => (
              <span
                key={`${who}-${i}-${i === shown ? shown : ''}`}
                className={i < shown ? 'done' : i === shown ? 'cur b' : ''}
                onAnimationEnd={i === shown ? next : undefined}
              >
                <i />
              </span>
            ))}
          </div>
          <div className="stv-head">
            <Link to={isMine ? '/me' : profilePath(who)} className="who">
              <Avatar user={isMine ? me : undefined} username={isMine ? undefined : who} photo={null} size="s32" style={{ boxShadow: 'none' }} />
              <strong style={{ fontSize: 14 }}>{isMine ? me.username : who}</strong>
            </Link>
            <span className="t">{current.ago}</span>
            {current.audience === 'close' && (
              <span className="cfbadge" title={isMine ? 'بيشوفها أصدقاؤك المقربين بس' : 'إنت بقائمة أصدقائه المقربين'}>
                ★ الأصدقاء المقربين
              </span>
            )}
            <span style={{ flex: '1 1 0%' }} />
            <button type="button" className="ib" aria-label={paused ? 'تشغيل' : 'إيقاف مؤقت'} onClick={() => setPaused((p) => !p)}>
              <Icon name="pause" d={paused ? 'M7 4l12 8-12 8z' : 'M7 4h3.5v16H7zM13.5 4H17v16h-3.5z'} />
            </button>
            <button type="button" className="ib" aria-label={muted ? 'تشغيل الصوت' : 'كتم الصوت'} onClick={() => setMuted((m) => !m)}>
              <Icon name="sound" d={muted ? 'M4 9h4l5-4v14l-5-4H4zM17 9l4 6M21 9l-4 6' : undefined} />
            </button>
            <button type="button" className="ib" aria-label="خيارات" aria-expanded={sheet === 'options'} onClick={() => setSheet('options')}>
              <Icon name="dots" />
            </button>
            <button type="button" className="ib mclose" aria-label="إغلاق" onClick={close}>
              <Icon name="close" />
            </button>
          </div>
          <span className={muted ? 'stv-music muted' : 'stv-music'}>
            <i />
            <i />
            <i /> موسيقى أصلية · {isMine ? me.username : who}
          </span>
          {current.caption && <span className="stv-cap">{current.caption}</span>}
          <button type="button" className="tap r" aria-label="السابق" onClick={prev} />
          <button type="button" className="tap l" aria-label="التالي" onClick={next} />
          {current.place && (
            <button type="button" className="stv-loc" onClick={() => navigate(`/place/${current.placeId ?? 'rooftop-coffee'}`)}>
              <Icon
                name="pin"
                d="M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"
              />
              {current.place}
            </button>
          )}
          {!isMine && <StoryReplyBar who={who} img={current.img} onBusy={setReplying} />}
          {isMine && (
            <div className="stv-bottom" style={{ justifyContent: 'space-between' }}>
              <button type="button" className="stv-act" onClick={() => setSheet('activity')}>
                <span className="mut" aria-hidden="true">
                  <i style={{ background: '#9A2A1F' }}>س</i>
                  <i style={{ background: '#173022' }}>أ</i>
                  <i style={{ background: '#56653A' }}>ن</i>
                </span>
                <span>النشاط · {VIEW_COUNT}</span>
              </button>
              <div className="row" style={{ gap: 2, flexWrap: 'nowrap' }}>
                <HighlightButton id={current.id} />
                <Link to="/new-story" className="stv-act">
                  <Icon name="plusSquare" />
                  إضافة
                </Link>
                <button type="button" className="stv-act" onClick={deleteFrame}>
                  <Icon name="trash" />
                  حذف
                </button>
              </div>
            </div>
          )}
          {sheet && (
            <>
              <button type="button" className="stv-sheet-bg" aria-label="إغلاق" onClick={() => setSheet(null)} />
              <div className="stv-sheet" role="menu">
                {sheet === 'activity' ? (
                  <>
                    <strong className="stv-sheet-t">شاهدها {VIEW_COUNT} شخص</strong>
                    {VIEWERS.map((u) => (
                      <Link key={u} to={profilePath(u)} className="stv-sheet-row" role="menuitem">
                        <Avatar username={u} photo={null} size="s32" />
                        <span dir="ltr">{u}</span>
                      </Link>
                    ))}
                    <span className="stv-sheet-note">و{VIEW_COUNT - VIEWERS.length} غيرهم</span>
                  </>
                ) : isMine ? (
                  <>
                    <button type="button" className="stv-sheet-row bad" role="menuitem" onClick={deleteFrame}>
                      حذف هاي القصة
                    </button>
                    <Link to="/new-story" className="stv-sheet-row" role="menuitem">
                      إضافة قصة جديدة
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to={profilePath(who)} className="stv-sheet-row" role="menuitem">
                      عرض الملف الشخصي
                    </Link>
                    <button type="button" className="stv-sheet-row" role="menuitem" onClick={copyLink}>
                      {copied ? 'تم نسخ الرابط ✓' : 'نسخ الرابط'}
                    </button>
                  </>
                )}
                <button type="button" className="stv-sheet-row muted" role="menuitem" onClick={() => setSheet(null)}>
                  إلغاء
                </button>
              </div>
            </>
          )}
        </div>
        <button type="button" className="stv-arrow" aria-label="القصة التالية" onClick={() => goUser(index + 1)}>
          <Icon name="chevronLeft" />
        </button>
        {peeks.map((u, i) => {
          const s = STORIES.find((x) => x.user === u)
          return (
            <button key={u} type="button" className="stv-peek" aria-label={`قصة ${u}`} onClick={() => goUser(index + 1 + i)}>
              <Photo img={s.img} />
              <span className="who">
                <span className="ring2">
                  <span style={{ background: 'rgb(231, 220, 201)' }}>
                    <Photo img={s.img} />
                  </span>
                </span>
                <span dir="ltr">{u}</span>
                <small>{AGO[(index + i) % AGO.length]}</small>
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
