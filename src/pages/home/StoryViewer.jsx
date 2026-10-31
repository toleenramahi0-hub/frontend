import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import Avatar from '../../components/Avatar'
import Icon from '../../components/Icon'
import Photo from '../../components/Photo'
import { profilePath } from '../../components/PostCard'
import { useCurrentProfile } from '../../context/useCurrentProfile'
import { STORIES } from '../../data/posts'

const clock = (pos, scale) => ({ src: '/assets/images/nablus-clock-tower.jpg', pos, scale })

// The signed-in user's own story (two frames); others have one frame from the stories row.
const MY_FRAMES = [
  { img: clock('48% 16%', 2.6), caption: 'صباح البلدة القديمة', ago: '3 س' },
  { img: clock('72% 26%', 2.2), caption: 'السهرة هون', place: 'قهوة السطح', ago: '40 د' },
]
const AGO = ['2 س', '4 س', '5 س', '6 س', '8 س', '10 س', '12 س', '20 س']

/** Full-screen story viewer over the feed. */
export default function StoryViewer() {
  const { username } = useParams()
  const navigate = useNavigate()
  const me = useCurrentProfile()
  const order = ['me', ...STORIES.map((s) => s.user)]
  const [frame, setFrame] = useState(0)
  const [paused, setPaused] = useState(false)
  const [muted, setMuted] = useState(false)

  const who = username === 'me' || username === me.username ? 'me' : username
  const index = order.indexOf(who)

  const frames =
    who === 'me'
      ? MY_FRAMES
      : [{ img: STORIES[index - 1]?.img, ago: AGO[(index - 1) % AGO.length] }]

  const close = () => navigate('/home')
  const goUser = (i) => {
    setFrame(0)
    if (i < 0 || i >= order.length) close()
    else navigate(`/story/${order[i]}`, { replace: true })
  }
  const next = () => (frame < frames.length - 1 ? setFrame(frame + 1) : goUser(index + 1))
  const prev = () => (frame > 0 ? setFrame(frame - 1) : goUser(index - 1))

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') navigate('/home')
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [navigate])

  if (index < 0) return <Navigate to="/home" replace />

  const current = frames[frame]
  const isMine = who === 'me'
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
        <div className={paused ? 'stv-card paused' : 'stv-card'}>
          <Photo key={`${who}-${frame}`} img={current.img} alt={current.caption ?? ''} className="kb b" />
          <span className="stv-shade-t" aria-hidden="true" />
          <span className="stv-shade-b" aria-hidden="true" />
          <div className="segs" style={{ zIndex: 6 }}>
            {frames.map((_, i) => (
              <span
                key={`${who}-${i}-${i === frame ? frame : ''}`}
                className={i < frame ? 'done' : i === frame ? 'cur b' : ''}
                onAnimationEnd={i === frame ? next : undefined}
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
            <span style={{ flex: '1 1 0%' }} />
            <button type="button" className="ib" aria-label={paused ? 'تشغيل' : 'إيقاف مؤقت'} onClick={() => setPaused((p) => !p)}>
              <Icon name="pause" d={paused ? 'M7 4l12 8-12 8z' : 'M7 4h3.5v16H7zM13.5 4H17v16h-3.5z'} />
            </button>
            <button type="button" className="ib" aria-label={muted ? 'تشغيل الصوت' : 'كتم الصوت'} onClick={() => setMuted((m) => !m)}>
              <Icon name="sound" d={muted ? 'M4 9h4l5-4v14l-5-4H4zM17 9l4 6M21 9l-4 6' : undefined} />
            </button>
            <button type="button" className="ib" aria-label="خيارات">
              <Icon name="dots" />
            </button>
            <button type="button" className="ib mclose" aria-label="إغلاق" onClick={close}>
              <Icon name="close" />
            </button>
          </div>
          <span className="stv-music">
            <i />
            <i />
            <i /> موسيقى أصلية · {isMine ? me.username : who}
          </span>
          {current.caption && <span className="stv-cap">{current.caption}</span>}
          <button type="button" className="tap r" aria-label="السابق" onClick={prev} />
          <button type="button" className="tap l" aria-label="التالي" onClick={next} />
          {current.place && (
            <button type="button" className="stv-loc" onClick={() => navigate('/place/rooftop-coffee')}>
              <Icon
                name="pin"
                d="M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"
              />
              {current.place}
            </button>
          )}
          {isMine && (
            <div className="stv-bottom" style={{ justifyContent: 'space-between' }}>
              <button type="button" className="stv-act">
                <span className="mut" aria-hidden="true">
                  <i style={{ background: '#9A2A1F' }}>س</i>
                  <i style={{ background: '#173022' }}>أ</i>
                  <i style={{ background: '#56653A' }}>ن</i>
                </span>
                <span>النشاط · 44</span>
              </button>
              <div className="row" style={{ gap: 2, flexWrap: 'nowrap' }}>
                <button type="button" className="stv-act">
                  <Icon name="plusCircle" />
                  تمييز
                </button>
                <Link to="/new-post" className="stv-act">
                  <Icon name="plusSquare" />
                  إضافة
                </Link>
                <button type="button" className="stv-act">
                  <Icon name="trash" />
                  حذف
                </button>
              </div>
            </div>
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
