import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Avatar from '../../components/Avatar'
import Icon from '../../components/Icon'
import Photo from '../../components/Photo'
import { useCurrentProfile } from '../../context/useCurrentProfile'
import { PLACES } from '../../data/places'
import { appendTo, useList } from '../../services/interactions'
import { CloseFriendsList, StarBadge } from './CloseFriends'
import { GALLERY, IMAGE_MAX_MB, IMAGE_TYPES } from './NewPostDialog'

/**
 * Instagram-style story composer: pick a photo from the gallery, add text ("Aa") and a
 * location sticker on the full-screen preview, then share with "قصتك" or "الأصدقاء المقربين".
 * Stories are kept locally (24 hours) until the API exists.
 */
export default function NewStoryDialog() {
  const navigate = useNavigate()
  const me = useCurrentProfile()
  const closeFriends = useList('closeFriends')
  const [uploads, setUploads] = useState([])
  const [img, setImg] = useState(null)
  const [caption, setCaption] = useState('')
  const [place, setPlace] = useState(null)
  const [tool, setTool] = useState(null) // 'text' | 'place' | 'friends' | null
  const [draft, setDraft] = useState('')
  const [placeQ, setPlaceQ] = useState('')
  const [error, setError] = useState('')
  const textRef = useRef(null)

  const close = () => navigate(-1)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      if (tool) setTool(null)
      else if (img) setImg(null)
      else navigate(-1)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [tool, img, navigate])

  useEffect(() => {
    if (tool === 'text') textRef.current?.focus()
  }, [tool])

  function upload(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (!IMAGE_TYPES.includes(file.type) || file.size > IMAGE_MAX_MB * 1024 * 1024) {
      setError(`لازم تكون صورة JPG أو PNG أو WebP وأقل من ${IMAGE_MAX_MB} ميغا.`)
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setUploads((u) => [reader.result, ...u])
      setImg(reader.result)
      setError('')
    }
    reader.readAsDataURL(file)
  }

  function openText() {
    setDraft(caption)
    setTool('text')
  }

  function placeText(e) {
    e?.preventDefault()
    setCaption(draft.trim())
    setTool(null)
  }

  function share(audience) {
    if (audience === 'close' && !closeFriends.length) {
      setTool('friends') // first time: pick your close friends, then it shares
      return
    }
    appendTo('myStories', 'all', {
      id: `s${Date.now()}`,
      img,
      caption: caption || undefined,
      place: place?.name,
      placeId: place?.id,
      audience,
      at: Date.now(),
    })
    navigate('/story/me?latest=1', { replace: true })
  }

  const places = PLACES.filter((p) => !placeQ.trim() || p.name.includes(placeQ.trim()))

  return (
    <div className="stv nsc" role="dialog" aria-modal="true" aria-label="إضافة إلى القصة">
      <div className="stv-stage">
        <div className="stv-card nsc-card">
          {!img ? (
            <div className="nsc-pick">
              <div className="nsc-pick-h">
                <button type="button" className="ib" aria-label="إغلاق" onClick={close}>
                  <Icon name="close" />
                </button>
                <strong>إضافة إلى القصة</strong>
                <span style={{ width: 44 }} />
              </div>
              {error && (
                <div className="alert err" role="alert" style={{ margin: '0 10px 8px' }}>
                  {error}
                </div>
              )}
              <span className="nsc-pick-t">الصور الأخيرة</span>
              <div className="nsc-grid">
                <label className="nsc-cam">
                  <input type="file" accept={IMAGE_TYPES.join(',')} className="sr" onChange={upload} />
                  <Icon name="camera" d="M4 7h3l2-3h6l2 3h3v13H4zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" size={30} />
                  <span>من جهازك</span>
                </label>
                {[...uploads, ...GALLERY].map((g, i) => (
                  <button key={i} type="button" className="nsc-tile" aria-label="اختيار الصورة" onClick={() => setImg(g)}>
                    <Photo img={g} />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              <Photo img={img} />
              <span className="stv-shade-t" aria-hidden="true" />
              <span className="stv-shade-b" aria-hidden="true" />

              <div className="nsc-top">
                <button type="button" className="nsc-ic" aria-label="رجوع للصور" onClick={() => setImg(null)}>
                  <Icon name="chevronRight" />
                </button>
                <span style={{ flex: 1 }} />
                <button type="button" className="nsc-ic nsc-aa" aria-label="إضافة نص" onClick={openText}>
                  Aa
                </button>
                <button type="button" className="nsc-ic" aria-label="ملصق الموقع" onClick={() => setTool('place')}>
                  <Icon name="pin" />
                </button>
              </div>

              {caption && tool !== 'text' && (
                <button type="button" className="stv-cap nsc-tap" onClick={openText} aria-label="تعديل النص">
                  {caption}
                </button>
              )}
              {place && (
                <button type="button" className="stv-loc" onClick={() => setTool('place')} aria-label="تغيير الموقع">
                  <Icon name="pin" d="M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
                  {place.name}
                </button>
              )}

              {!tool && (
                <div className="nsc-bottom">
                  <button type="button" className="nsc-share" onClick={() => share('all')}>
                    <Avatar user={me} size="s32" />
                    قصتك
                  </button>
                  <button type="button" className="nsc-share" onClick={() => share('close')}>
                    <StarBadge size={32} />
                    الأصدقاء المقربين
                  </button>
                </div>
              )}

              {tool === 'text' && (
                <form className="nsc-text" onSubmit={placeText}>
                  <button type="submit" className="nsc-done">
                    تم
                  </button>
                  <input
                    ref={textRef}
                    className="nsc-text-in"
                    maxLength={120}
                    placeholder="اكتب…"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    aria-label="نص القصة"
                  />
                </form>
              )}

              {tool === 'place' && (
                <div className="stv-panel" role="dialog" aria-label="اختيار الموقع">
                  <div className="nsc-panel-h">
                    <strong>الموقع</strong>
                    {place && (
                      <button
                        type="button"
                        className="link small"
                        style={{ background: 'none', border: 0, cursor: 'pointer', font: 'inherit' }}
                        onClick={() => {
                          setPlace(null)
                          setTool(null)
                        }}
                      >
                        إزالة
                      </button>
                    )}
                    <button type="button" className="ib" aria-label="إغلاق" onClick={() => setTool(null)}>
                      <Icon name="close" />
                    </button>
                  </div>
                  <div className="srbox" style={{ margin: '0 12px 8px' }}>
                    <Icon name="search" className="ic sm" />
                    <input placeholder="ابحث عن مكان" aria-label="ابحث عن مكان" value={placeQ} onChange={(e) => setPlaceQ(e.target.value)} />
                  </div>
                  <div style={{ overflowY: 'auto', padding: '0 8px 12px' }}>
                    {places.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        className="stv-sheet-row"
                        style={{ width: '100%' }}
                        onClick={() => {
                          setPlace(p)
                          setTool(null)
                        }}
                      >
                        <Icon name="pin" />
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {tool === 'friends' && (
                <div className="stv-panel nsc-friends" role="dialog" aria-label="الأصدقاء المقربين">
                  <div className="nsc-panel-h">
                    <strong>الأصدقاء المقربين</strong>
                    <button type="button" className="ib" aria-label="إغلاق" onClick={() => setTool(null)}>
                      <Icon name="close" />
                    </button>
                  </div>
                  <CloseFriendsList doneLabel="مشاركة" onDone={() => (closeFriends.length ? share('close') : setTool(null))} />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
