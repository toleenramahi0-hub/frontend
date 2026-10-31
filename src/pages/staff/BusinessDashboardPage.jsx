import { useRef, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { setValue, useValue } from '../../services/interactions'
import { endStaffSession, getStaffSession } from '../../services/staffSession'
import DashboardHeader, { Kpi, navIcon, OVERVIEW_ICON, SectionTitle } from './DashboardHeader'

const PLACE_ID = 'nablus-kunafa'
const DAYS = ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة']
const HOURS_RE = /^\d{1,2}:\d{2} [صم] – \d{1,2}:\d{2} [صم]$/
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const IMAGE_MAX_MB = 8
const MAX_PHOTOS = 30

const SECTIONS = [
  { id: 'overview', full: 'نظرة عامة', short: 'عامة', icon: OVERVIEW_ICON },
  { id: 'info', full: 'صفحة المكان', short: 'المكان', icon: navIcon(<path d="M4 20h4L19 9l-4-4L4 16zM14 6l4 4" />) },
  { id: 'menu', full: 'الأكثر مبيعاً', short: 'الأكثر مبيعاً', icon: navIcon(<path d="M6 3v7M4 3v5a2 2 0 0 0 4 0V3M6 10v11M17 3c-2 0-3 2-3 6v3h3v9" />) },
  {
    id: 'photos',
    full: 'الصور',
    short: 'الصور',
    icon: navIcon(
      <>
        <rect x="3.5" y="5" width="17" height="14" rx="2" />
        <circle cx="9" cy="10" r="1.8" />
        <path d="M20.5 16l-5-5-8 8" />
      </>,
    ),
  },
  {
    id: 'offers',
    full: 'العروض',
    short: 'العروض',
    icon: navIcon(
      <path d="M3.5 8.5h17v4h-17zM5 12.5v8h14v-8M12 8.5v12M12 8.5C10.5 4 6.5 4.5 7.5 7.2 8.2 8.5 12 8.5 12 8.5zM12 8.5c1.5-4.5 5.5-4 4.5-1.3-.7 1.3-4.5 1.3-4.5 1.3z" />,
    ),
  },
  { id: 'reviews', full: 'التقييمات', short: 'التقييمات', icon: navIcon(<path d="M12 2.5l2.9 6 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.2 1.3-6.6-4.9-4.6 6.6-.8z" />) },
  { id: 'stats', full: 'الإحصائيات', short: 'الأرقام', icon: navIcon(<path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />) },
]

const KPIS = [
  { label: 'زيارات الصفحة (7 أيام)', value: '4,812', change: '▲ 18% عن الأسبوع الماضي', up: true, spark: [40, 48, 52, 60, 58, 74, 90] },
  { label: 'زيارات موثّقة بالمحل', value: '386', change: '▲ 9%', up: true, spark: [50, 55, 52, 60, 64, 66, 72] },
  { label: 'حفظوا مكانك', value: '1,204', change: '▲ 64 هالأسبوع', up: true, spark: [30, 40, 44, 50, 58, 62, 70] },
  {
    label: 'التقييم',
    value: (
      <>
        {'4.9 '}
        <span style={{ fontSize: 20, color: '#C8461A' }}>★</span>
      </>
    ),
    change: 'من 412 تقييم',
    spark: [92, 92, 94, 94, 96, 96, 98],
  },
]

const BEST_SELLERS = [
  { name: 'كنافة خشنة', img: '/img/ph/sw_kunafa.jpg', sold: 1240, price: '12 ₪', hot: true },
  { name: 'حلاوة الجبن', img: '/img/ph/sw_halawa.jpg', sold: 860, price: '15 ₪' },
  { name: 'كنافة ناعمة', img: '/img/ph/sw_kunafa.jpg', sold: 712, price: '12 ₪' },
  { name: 'قطايف بالجوز', img: '/img/ph/sw_qatayef.jpg', sold: 540, price: '20 ₪ / دزينة' },
  { name: 'معمول بالتمر', img: '/img/ph/sw_maamoul.jpg', sold: 395, price: '35 ₪ / كيلو' },
]

const GALLERY = ['/img/ph/sw_kunafa.jpg', '/img/ph/sw_halawa.jpg', '/img/ph/sw_qatayef.jpg', '/img/ph/sw_awameh.jpg', '/img/ph/sw_maamoul.jpg', '/img/ph/hero_clock.jpg']
const CUSTOMER_PHOTOS = [
  { user: 'hala.food', img: '/img/ph/sw_kunafa.jpg' },
  { user: 'sara.y', img: '/img/ph/cafe_terrace.jpg' },
]

const REVIEWS = [
  { user: 'sara.y', letter: 'س', color: '#56653A', stars: 5, text: 'أحلى كنافة بالبلد، سخنة والجبنة بتمط.', when: 'قبل ساعتين' },
  { user: 'ahmad.kh', letter: 'أ', color: '#9A2E22', stars: 4, text: 'طيبة كثير بس زحمة وقت الظهر.', when: 'أمس' },
  { user: 'rania.h', letter: 'ر', color: '#7E1514', stars: 5, text: 'مناسب للعيلة والأولاد، والخدمة سريعة.', when: 'قبل يومين' },
  { user: 'hala.food', letter: 'ه', color: '#C8461A', stars: 5, text: 'جربت الناعمة والخشنة… الخشنة أطيب.', when: 'قبل أسبوع', reply: 'شكراً هالة! نورتينا 🤍' },
]

const VISITS = [
  ['سبت', 124],
  ['أحد', 96],
  ['إثنين', 80],
  ['ثلاثاء', 88],
  ['أربعاء', 104],
  ['خميس', 156],
  ['جمعة', 200],
]
const SOURCES = [
  ['صفحة الأماكن والفئات', 38],
  ['منشورات وقصص الناس', 27],
  ['البحث', 19],
  ['الخريطة', 11],
  ['العروض', 5],
]

const DEFAULT_INFO = {
  name: 'محل الكنافة النابلسية',
  category: 'حلويات',
  description: 'من أقدم محلات الكنافة بالبلدة القديمة. الكنافة الخشنة بتطلع سخنة من الصينية كل نص ساعة، وبنقدّمها مع قطر خفيف.',
  phone: '+970 9 238 4411',
  address: 'البلدة القديمة، قرب برج الساعة',
  tags: ['كنافة خشنة', 'جلسة شعبية', 'تيك أواي'],
  hours: DAYS.map((d) => ({ day: d, text: d === 'الجمعة' ? '1:00 م – 11:30 م' : '8:00 ص – 11:00 م', open: true })),
}

const stars = (n) => '★'.repeat(n) + '☆'.repeat(5 - n)

/** Place info, opening hours (UC-PB-08, UC-PB-09) with a live customer preview. */
function InfoTab({ info, onSave }) {
  const [form, setForm] = useState(info)
  const [newTag, setNewTag] = useState('')
  const [errors, setErrors] = useState({})
  const [saved, setSaved] = useState(false)

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    setSaved(false)
  }
  const setHour = (i, patch) => {
    setForm((f) => ({ ...f, hours: f.hours.map((h, j) => (j === i ? { ...h, ...patch } : h)) }))
    setSaved(false)
  }

  function save() {
    const errs = {}
    if (!form.name.trim()) errs.name = 'اسم المكان مطلوب.'
    form.hours.forEach((h, i) => {
      if (h.open && !HOURS_RE.test(h.text.trim())) errs[`h${i}`] = true
    })
    setErrors(errs)
    if (Object.keys(errs).length) return
    onSave(form)
    setSaved(true)
  }

  const hoursError = Object.keys(errors).some((k) => k.startsWith('h'))

  return (
    <>
      <SectionTitle kicker="معلومات النشاط" title="صفحة المكان" />
      <div className="two" style={{ marginTop: 0 }}>
        <section className="card pad stack" style={{ gap: 16 }}>
          <div className="fgrid">
            <div>
              <label className="lbl" htmlFor="pn">
                اسم المكان
              </label>
              <input id="pn" className="field2" value={form.name} onChange={set('name')} />
              {errors.name && <p className="help err">{errors.name}</p>}
            </div>
            <div>
              <label className="lbl" htmlFor="pc">
                الفئة
              </label>
              <select id="pc" className="field2" value={form.category} onChange={set('category')}>
                <option>حلويات</option>
                <option>مطاعم</option>
                <option>مقاهي</option>
              </select>
            </div>
          </div>
          <div>
            <label className="lbl" htmlFor="pd">
              الوصف
            </label>
            <textarea id="pd" className="field2" value={form.description} onChange={set('description')} />
          </div>
          <div className="fgrid">
            <div>
              <label className="lbl" htmlFor="pp">
                رقم الهاتف
              </label>
              <input id="pp" className="field2" dir="ltr" style={{ textAlign: 'right' }} value={form.phone} onChange={set('phone')} />
            </div>
            <div>
              <label className="lbl" htmlFor="pa">
                العنوان
              </label>
              <input id="pa" className="field2" value={form.address} onChange={set('address')} />
            </div>
          </div>
          <div>
            <label className="lbl" htmlFor="tag-new">
              الوسوم
            </label>
            <div className="row" style={{ gap: 8 }}>
              {form.tags.map((t) => (
                <button
                  key={t}
                  type="button"
                  className="chip"
                  aria-label={`حذف وسم ${t}`}
                  onClick={() => setForm((f) => ({ ...f, tags: f.tags.filter((x) => x !== t) }))}
                >
                  {t} ✕
                </button>
              ))}
              <input
                id="tag-new"
                className="field2"
                style={{ width: 130, minHeight: 36 }}
                placeholder="وسم جديد"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    document.getElementById('tag-add')?.click()
                  }
                }}
              />
              <button
                id="tag-add"
                type="button"
                className="st sm lnn"
                onClick={() => {
                  const t = newTag.trim()
                  if (t && !form.tags.includes(t)) setForm((f) => ({ ...f, tags: [...f.tags, t] }))
                  setNewTag('')
                }}
              >
                + وسم
              </button>
            </div>
          </div>
          <div>
            <label className="lbl">ساعات العمل</label>
            <div className="hours">
              {form.hours.map((h, i) => (
                <div key={h.day} style={{ display: 'contents' }}>
                  <span className="b">{h.day}</span>
                  <input
                    className={errors[`h${i}`] ? 'field2 err' : 'field2'}
                    value={h.open ? h.text : 'مغلق'}
                    disabled={!h.open}
                    aria-label={`ساعات ${h.day}`}
                    onChange={(e) => setHour(i, { text: e.target.value })}
                  />
                  <button type="button" className={h.open ? 'sw on' : 'sw'} aria-label={h.open ? 'مفتوح' : 'مغلق'} aria-pressed={h.open} onClick={() => setHour(i, { open: !h.open })}>
                    <i />
                  </button>
                </div>
              ))}
            </div>
            {hoursError && <p className="help err">اكتب الساعات بهالشكل: 8:00 ص – 11:00 م</p>}
          </div>
          <div className="row" style={{ gap: 10 }}>
            <button type="button" className="st grn" style={{ color: '#fff' }} onClick={save}>
              حفظ التغييرات
            </button>
            <span className="small" role="status" style={{ color: '#2E6B3A', fontWeight: 700 }}>
              {saved ? '✓ تم الحفظ' : ''}
            </span>
          </div>
        </section>
        <aside className="stack" style={{ gap: 12 }}>
          <span className="small b muted">معاينة كيف بتظهر للزبائن</span>
          <div className="preview">
            <img src="/img/ph/sw_kunafa.jpg" alt="" />
            <div style={{ padding: '14px 16px' }}>
              <div className="row" style={{ gap: 8 }}>
                <b style={{ fontSize: 18 }}>{form.name || '—'}</b>
                <span className="tag dark">{form.category}</span>
                <span className="tag ok">مفتوح الآن</span>
              </div>
              <span className="small muted">البلدة القديمة · ★ 4.9 (412)</span>
            </div>
          </div>
        </aside>
      </div>
    </>
  )
}

/** Business owner dashboard for one verified place (UC-PB-08 – UC-PB-11). */
export default function BusinessDashboardPage() {
  const navigate = useNavigate()
  const session = getStaffSession()
  const [tab, setTab] = useState('overview')
  const stored = useValue('business', PLACE_ID) ?? {}
  const fileRef = useRef(null)
  const [photoError, setPhotoError] = useState('')
  const [drafts, setDrafts] = useState({})

  if (session?.role !== 'business') return <Navigate to="/business/login" replace />

  const info = stored.info ?? DEFAULT_INFO
  const open = stored.open ?? true
  const replies = stored.replies ?? {}
  const photos = stored.photos ?? GALLERY
  const customerDecisions = stored.customerPhotos ?? {}
  const offers = stored.offers ?? { half: 'active', points: 'active', students: 'paused' }

  const update = (patch) => setValue('business', PLACE_ID, { ...stored, ...patch })

  const reviews = REVIEWS.map((r, i) => ({ ...r, reply: r.reply ?? replies[i] }))
  const unanswered = reviews.filter((r) => !r.reply).length
  const pendingPhotos = CUSTOMER_PHOTOS.filter((_, i) => !customerDecisions[i])

  function logout() {
    endStaffSession()
    navigate('/business/login', { replace: true })
  }

  function addPhotos(e) {
    const files = [...(e.target.files ?? [])]
    e.target.value = ''
    const bad = files.find((f) => !IMAGE_TYPES.includes(f.type) || f.size > IMAGE_MAX_MB * 1048576)
    if (bad) {
      setPhotoError(`الصور لازم تكون JPG أو PNG أو WebP وأقل من ${IMAGE_MAX_MB} ميغا.`)
      return
    }
    if (photos.length + files.length > MAX_PHOTOS) {
      setPhotoError(`الحد الأقصى ${MAX_PHOTOS} صورة.`)
      return
    }
    setPhotoError('')
    Promise.all(
      files.map(
        (f) =>
          new Promise((resolve) => {
            const reader = new FileReader()
            reader.onload = () => resolve(reader.result)
            reader.readAsDataURL(f)
          }),
      ),
    ).then((urls) => update({ photos: [...photos, ...urls] }))
  }

  return (
    <div className="p-BusinessDashboard th-site">
      <div className="ge" style={{ minHeight: '100vh', background: '#F1E8DA' }}>
        <DashboardHeader
          home="/business"
          word="للأعمال"
          subtitle={info.name}
          navLabel="أقسام لوحة النشاط"
          sections={SECTIONS}
          tab={tab}
          onTab={setTab}
          counts={{ reviews: unanswered }}
          onLogout={logout}
          preview={`/place/${PLACE_ID}`}
          avatar={{ letter: 'خ', title: 'خالد (صاحب المكان)' }}
        />
        <main className="wrap adm">
          {tab === 'overview' && (
            <>
              <SectionTitle kicker="لوحة نشاطي" title="أهلاً خالد 👋">
                <Link to={`/place/${PLACE_ID}`} className="st sm lnn" style={{ textDecoration: 'none', color: '#231A15' }}>
                  معاينة صفحتك ←
                </Link>
              </SectionTitle>
              <div className="kpis">
                {KPIS.map((k) => (
                  <Kpi key={k.label} {...k} />
                ))}
              </div>
              <div className="two">
                <section className="card pad">
                  <h2 className="h3">مهام اليوم</h2>
                  <div style={{ marginTop: 10 }}>
                    {[
                      [unanswered, 'تقييمات بدون رد', 'الرد السريع بيرفع ثقة الزبائن', 'reviews', 'رد ←'],
                      [1, 'عرض بينتهي اليوم', '"كنافة ثانية بنص السعر" — آخر يوم', 'offers', 'تمديد ←'],
                      [pendingPhotos.length, 'صور جديدة من الزبائن', 'ممكن تضيفها لمعرض مكانك', 'photos', 'عرض ←'],
                    ].map(([n, title, sub, to, cta]) => (
                      <div key={title} className="att">
                        <span className="num">{n}</span>
                        <div style={{ flex: 1 }}>
                          <b>{title}</b>
                          <br />
                          <span className="small muted">{sub}</span>
                        </div>
                        <button type="button" className="lnk" onClick={() => setTab(to)}>
                          {cta}
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
                <section className="card pad">
                  <div className="between">
                    <h2 className="h3">حالة المكان</h2>
                    <span className={open ? 'tag ok' : 'tag bad'}>{open ? 'مفتوح الآن' : 'مغلق مؤقتاً'}</span>
                  </div>
                  <div className="row" style={{ gap: 12, marginTop: 14, alignItems: 'center' }}>
                    <button type="button" className={open ? 'sw on' : 'sw'} aria-pressed={open} onClick={() => update({ open: !open })} aria-label="تبديل حالة المكان">
                      <i />
                    </button>
                    <span className="small">{open ? 'الزبائن بيشوفوا إنك فاتح' : 'رح يظهر "مغلق مؤقتاً" على صفحتك'}</span>
                  </div>
                  <div className="feed" style={{ marginTop: 14 }}>
                    <div>
                      <span style={{ flex: 1 }}>ساعات اليوم</span>
                      <b>8 ص – 11 م</b>
                    </div>
                    <div>
                      <span style={{ flex: 1 }}>الأكثر طلباً</span>
                      <b>كنافة خشنة</b>
                    </div>
                    <div>
                      <span style={{ flex: 1 }}>ترتيبك بفئة حلويات</span>
                      <b style={{ color: '#7E1514' }}>#1 🔥</b>
                    </div>
                  </div>
                </section>
              </div>
            </>
          )}

          {tab === 'info' && <InfoTab info={info} onSave={(next) => update({ info: next })} />}

          {tab === 'menu' && (
            <>
              <SectionTitle kicker="الأصناف" title="الأكثر مبيعاً">
                <span className="muted small">آخر 30 يوم · 5 أصناف كحد أقصى</span>
              </SectionTitle>
              <section className="card pad">
                {BEST_SELLERS.map((item, i) => (
                  <div key={item.name} className="mitem">
                    <span className="rk">#{i + 1}</span>
                    <span className="thumb">
                      <img src={item.img} alt="" />
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="row" style={{ gap: 8 }}>
                        <b>{item.name}</b>
                        {item.hot && <span className="tag bad">🔥</span>}
                      </div>
                      <div className="bar" style={{ marginTop: 8, maxWidth: 320 }}>
                        <i style={{ width: `${Math.round((item.sold / BEST_SELLERS[0].sold) * 100)}%` }} />
                      </div>
                      <span className="xs muted">{item.sold.toLocaleString('en-US')} قطعة مباعة</span>
                    </div>
                    <span className="price">{item.price}</span>
                    <button type="button" className="st sm lnn">
                      تعديل
                    </button>
                  </div>
                ))}
              </section>
              <p className="small muted" style={{ margin: '10px 4px 0' }}>
                بنعرض أكثر 5 أصناف مبيعاً بس — هاي اللي بتظهر للزبائن على صفحة مكانك.
              </p>
            </>
          )}

          {tab === 'photos' && (
            <>
              <SectionTitle kicker="المعرض" title="الصور">
                <span className="muted small">
                  {photos.length} صور · الحد الأقصى {MAX_PHOTOS}
                </span>
              </SectionTitle>
              {photoError && (
                <div className="alert err" role="alert" style={{ marginBottom: 12 }}>
                  {photoError}
                </div>
              )}
              <section className="card pad">
                <div className="gal">
                  <label className="add">
                    <input ref={fileRef} type="file" accept={IMAGE_TYPES.join(',')} multiple hidden onChange={addPhotos} />
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                    إضافة صور
                  </label>
                  {photos.map((src, i) => (
                    <figure key={i}>
                      <img src={src} alt="" />
                      {i === 0 && (
                        <figcaption>
                          <span className="tag dark">صورة الغلاف</span>
                        </figcaption>
                      )}
                    </figure>
                  ))}
                </div>
              </section>
              <section className="card pad" style={{ marginTop: 18 }}>
                <h2 className="h3">صور من الزبائن بانتظار موافقتك</h2>
                {pendingPhotos.length === 0 && <p className="small muted">ما في صور جديدة.</p>}
                <div className="gal" style={{ marginTop: 12 }}>
                  {CUSTOMER_PHOTOS.map((p, i) =>
                    customerDecisions[i] ? null : (
                      <figure key={p.user}>
                        <img src={p.img} alt="" />
                        <figcaption>
                          <span className="tag">{p.user}</span>
                        </figcaption>
                        <div className="acts" style={{ position: 'absolute', bottom: 8, left: 8, right: 8 }}>
                          <button
                            type="button"
                            className="st sm grn"
                            style={{ flex: 1 }}
                            onClick={() => update({ photos: [...photos, p.img], customerPhotos: { ...customerDecisions, [i]: 'added' } })}
                          >
                            إضافة
                          </button>
                          <button type="button" className="st sm lnn" onClick={() => update({ customerPhotos: { ...customerDecisions, [i]: 'ignored' } })}>
                            تجاهل
                          </button>
                        </div>
                      </figure>
                    ),
                  )}
                </div>
              </section>
            </>
          )}

          {tab === 'offers' && (
            <>
              <SectionTitle kicker="جذب الزبائن" title="العروض والمكافآت">
                <button type="button" className="st sm red" style={{ color: '#fff' }}>
                  + عرض جديد
                </button>
              </SectionTitle>
              <div className="stack" style={{ gap: 12 }}>
                <div className="offer">
                  <span className="otag">½</span>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <b>كنافة ثانية بنص السعر</b>
                    <br />
                    <span className="small muted">
                      {'لكل الزبائن · بينتهي '}
                      <b style={{ color: '#9A2A1F' }}>{offers.halfExtended ? 'بعد أسبوع' : 'اليوم'}</b>
                      {' · استُخدم 128 مرة'}
                    </span>
                  </div>
                  <span className="tag ok">فعّال</span>
                  {!offers.halfExtended && (
                    <button type="button" className="st sm grn" style={{ color: '#fff' }} onClick={() => update({ offers: { ...offers, halfExtended: true } })}>
                      تمديد أسبوع
                    </button>
                  )}
                </div>
                <div className="offer">
                  <span className="otag">150</span>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <b>صحن كنافة مجاني مقابل 150 نقطة</b>
                    <br />
                    <span className="small muted">مكافأة نقاط GoExplore · استُبدل 42 مرة</span>
                  </div>
                  <span className="tag ok">فعّال</span>
                  <button type="button" className="st sm lnn">
                    تعديل
                  </button>
                </div>
                <div className="offer">
                  <span className="otag">10%</span>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <b>خصم 10% لطلاب الجامعة</b>
                    <br />
                    <span className="small muted">مع بطاقة الجامعة · {offers.students === 'active' ? 'فعّال' : 'متوقف مؤقتاً'}</span>
                  </div>
                  <span className={offers.students === 'active' ? 'tag ok' : 'tag warn'}>{offers.students === 'active' ? 'فعّال' : 'متوقف'}</span>
                  <button
                    type="button"
                    className="st sm lnn"
                    onClick={() => update({ offers: { ...offers, students: offers.students === 'active' ? 'paused' : 'active' } })}
                  >
                    {offers.students === 'active' ? 'إيقاف' : 'تفعيل'}
                  </button>
                </div>
              </div>
            </>
          )}

          {tab === 'reviews' && (
            <>
              <SectionTitle kicker="آراء الزبائن" title="التقييمات">
                <span className="tag warn">{unanswered} بدون رد</span>
              </SectionTitle>
              <section className="card pad">
                {reviews.map((r, i) => (
                  <div key={r.user} className="rev">
                    <div className="between">
                      <span className="who">
                        <span className="av" style={{ background: r.color }}>
                          {r.letter}
                        </span>
                        <span>
                          <span dir="ltr">{r.user}</span>{' '}
                          <span className="tag ok" style={{ fontSize: 11 }}>
                            ✓ زيارة موثّقة
                          </span>
                        </span>
                      </span>
                      <span className="stars">{stars(r.stars)}</span>
                    </div>
                    <p style={{ margin: '8px 0 0' }}>{r.text}</p>
                    <span className="xs muted">{r.when}</span>
                    {r.reply ? (
                      <div className="reply">
                        <b>ردّك:</b> {r.reply}
                      </div>
                    ) : (
                      <form
                        className="row"
                        style={{ gap: 8, marginTop: 10 }}
                        onSubmit={(e) => {
                          e.preventDefault()
                          const text = (drafts[i] ?? '').trim()
                          if (!text) return
                          update({ replies: { ...replies, [i]: text } })
                        }}
                      >
                        <input
                          className="field2"
                          style={{ flex: 1, minHeight: 42 }}
                          placeholder="اكتب ردّك…"
                          aria-label="الرد"
                          value={drafts[i] ?? ''}
                          onChange={(e) => setDrafts((d) => ({ ...d, [i]: e.target.value }))}
                        />
                        <button type="submit" className="st sm grn" style={{ color: '#fff' }} disabled={!(drafts[i] ?? '').trim()}>
                          إرسال
                        </button>
                      </form>
                    )}
                  </div>
                ))}
              </section>
            </>
          )}

          {tab === 'stats' && (
            <>
              <SectionTitle kicker="أداء مكانك" title="الإحصائيات">
                <span className="muted small">آخر 30 يوم</span>
              </SectionTitle>
              <div className="two" style={{ marginTop: 0 }}>
                <section className="card pad">
                  <h2 className="h3">الزيارات الموثّقة حسب اليوم</h2>
                  <div className="chart" style={{ marginTop: 8 }}>
                    {VISITS.map(([day, n]) => (
                      <div key={day} className={n === 200 ? 'hi' : ''}>
                        <b style={{ color: '#231A15' }}>{n}</b>
                        <i style={{ height: `${Math.round((n / 250) * 100)}%` }} />
                        {day}
                      </div>
                    ))}
                  </div>
                </section>
                <section className="card pad">
                  <h2 className="h3">من وين بيجوا الزبائن</h2>
                  <div className="stack" style={{ gap: 14, marginTop: 14 }}>
                    {SOURCES.map(([label, pct]) => (
                      <div key={label}>
                        <div className="between small">
                          <b>{label}</b>
                          <span>{pct}%</span>
                        </div>
                        <div className="bar">
                          <i style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
              <section className="card pad" style={{ marginTop: 18 }}>
                <h2 className="h3">ساعات الذروة</h2>
                <p className="small muted" style={{ margin: '6px 0 0' }}>
                  {'أكثر وقت زحمة: '}
                  <b style={{ color: '#7E1514' }}>الخميس والجمعة بين 7 و 10 مساءً</b>. فكّر بعرض خاص للصبح عشان توزّع الزبائن.
                </p>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
