import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../../components/Icon'
import Overlay from '../../components/Overlay'
import Photo from '../../components/Photo'
import { useCurrentProfile } from '../../context/useCurrentProfile'
import { PLACES } from '../../data/places'
import { setValue, useValue } from '../../services/interactions'

const clock = (pos, scale) => ({ src: '/assets/images/nablus-clock-tower.jpg', pos, scale })

// Device gallery shown in the picker (stand-in for the user's camera roll).
const GALLERY = [
  '/img/ph/sw_kunafa.jpg',
  '/img/ph/sw_qatayef.jpg',
  '/img/ph/cafe_croissant.jpg',
  clock('72% 26%', 2.2),
  clock('66% 40%', 2.4),
  '/img/ph/food_tacos2.jpg',
  '/img/ph/food_spread.jpg',
  '/img/ph/food_salad.jpg',
  '/img/ph/food_tacos.jpg',
  clock('22% 78%', 2.6),
  clock('24% 70%', 3),
  clock('50% 60%', 1.3),
  clock('48% 16%', 2.6),
  clock('10% 55%', 2.1),
  clock('90% 78%', 2.4),
  { src: '/assets/images/tatreez-rug.jpg', pos: '20% 50%', scale: 1.3 },
  { src: '/assets/images/tatreez-rug.jpg', pos: '70% 50%', scale: 1.3 },
  { src: '/assets/images/nablus-garden.jpg', pos: '90% 22%', scale: 1.8 },
  clock('50% 20%', 1.6),
  { src: '/assets/images/tatreez-corner.png', pos: '40% 22%', scale: 1.8 },
]

const MAX_IMAGES = 5
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const IMAGE_MAX_MB = 8

/**
 * Create an experience post (UC-SR-01): pick up to five images, then write the
 * experience and tag the place. Published posts are kept locally until the API exists.
 */
export default function NewPostDialog() {
  const navigate = useNavigate()
  const me = useCurrentProfile()
  const myPosts = useValue('myPosts', 'all') ?? []
  const [step, setStep] = useState(1)
  const [uploads, setUploads] = useState([])
  const [selected, setSelected] = useState([])
  const [caption, setCaption] = useState('')
  const [placeId, setPlaceId] = useState('')
  const [error, setError] = useState('')

  const pool = [...uploads, ...GALLERY]
  const close = () => navigate(-1)

  function togglePick(img) {
    setError('')
    setSelected((s) => {
      if (s.includes(img)) return s.filter((x) => x !== img)
      if (s.length >= MAX_IMAGES) {
        setError(`بتقدر تختار لحد ${MAX_IMAGES} صور.`)
        return s
      }
      return [...s, img]
    })
  }

  function upload(e) {
    const files = [...(e.target.files ?? [])]
    e.target.value = ''
    const bad = files.filter((f) => !IMAGE_TYPES.includes(f.type) || f.size > IMAGE_MAX_MB * 1024 * 1024)
    if (bad.length) setError(`بعض الملفات انرفضت: لازم تكون صور JPG أو PNG أو WebP وأقل من ${IMAGE_MAX_MB} ميغا.`)
    files
      .filter((f) => !bad.includes(f))
      .forEach((f) => {
        const reader = new FileReader()
        reader.onload = () => {
          setUploads((u) => [reader.result, ...u])
          setSelected((s) => (s.length < MAX_IMAGES ? [...s, reader.result] : s))
        }
        reader.readAsDataURL(f)
      })
  }

  function publish(e) {
    e.preventDefault()
    if (!caption.trim()) {
      setError('اكتب شي عن تجربتك قبل ما تنشر.')
      return
    }
    const place = PLACES.find((p) => p.id === placeId)
    const post = {
      id: `my${Date.now()}`,
      user: me.username,
      time: 'الآن',
      place: place?.name ?? 'نابلس',
      images: selected,
      likes: '0',
      comments: '0',
      caption: caption.trim(),
    }
    setValue('myPosts', 'all', [post, ...myPosts])
    navigate('/home', { replace: true })
  }

  return (
    <Overlay label="منشور جديد" onClose={close}>
      <form className="sheet xl" onSubmit={publish}>
        <div className="sh-h">
          {step === 1 ? (
            <button type="button" className="ib" aria-label="رجوع" onClick={close}>
              <Icon name="close" />
            </button>
          ) : (
            <button type="button" className="ib" aria-label="رجوع" onClick={() => setStep(1)}>
              <Icon name="chevronRight" />
            </button>
          )}
          <h2>منشور جديد</h2>
          {step === 1 ? (
            <button type="button" className="post-btn" disabled={!selected.length} onClick={() => setStep(2)}>
              التالي
            </button>
          ) : (
            <button type="submit" className="post-btn" disabled={!caption.trim()}>
              نشر
            </button>
          )}
        </div>
        <div className="sh-body" style={{ gap: 14 }}>
          <div
            style={{
              position: 'relative',
              aspectRatio: '16 / 9',
              borderRadius: 14,
              overflow: 'hidden',
              background: 'rgb(231, 220, 201)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgb(106, 92, 81)',
            }}
          >
            {selected.length ? <Photo img={selected[0]} /> : <span className="b">اختار صورة أو أكثر (لحد 5)</span>}
          </div>
          {error && (
            <div className="alert err" role="alert">
              {error}
            </div>
          )}
          {step === 1 ? (
            <div className="pickg">
              <label className="pick upl">
                <input type="file" accept={IMAGE_TYPES.join(',')} multiple className="sr" onChange={upload} />
                <Icon name="camera" d="M4 7h3l2-3h6l2 3h3v13H4zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                <span>من جهازك</span>
              </label>
              {pool.map((img, i) => {
                const n = selected.indexOf(img)
                return (
                  <button key={i} type="button" className="pick" aria-pressed={n >= 0} aria-label="صورة" onClick={() => togglePick(img)}>
                    <Photo img={img} />
                    <span className="num">{n >= 0 ? n + 1 : ''}</span>
                  </button>
                )
              })}
            </div>
          ) : (
            <>
              <div>
                <label className="lb" htmlFor="np-cap" style={{ fontSize: 14 }}>
                  احكي عن تجربتك
                </label>
                <textarea
                  id="np-cap"
                  className="field"
                  rows="4"
                  maxLength={2200}
                  placeholder="شو عجبك؟ شو جربت؟"
                  value={caption}
                  onChange={(e) => {
                    setCaption(e.target.value)
                    setError('')
                  }}
                />
              </div>
              <div>
                <label className="lb" htmlFor="np-place" style={{ fontSize: 14 }}>
                  المكان
                </label>
                <select id="np-place" className="field" value={placeId} onChange={(e) => setPlaceId(e.target.value)}>
                  <option value="">بدون مكان</option>
                  {PLACES.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="st grn wide" disabled={!caption.trim()}>
                نشر
              </button>
            </>
          )}
        </div>
      </form>
    </Overlay>
  )
}
