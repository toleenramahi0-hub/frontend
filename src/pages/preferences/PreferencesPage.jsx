import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { preferencesService } from '../../services/preferencesService'
import { AREAS, CATEGORIES, DETAIL_GROUPS, DISTANCES, EMPTY_PREFERENCES, SPEND, STEPS } from './preferencesOptions'

const toggleIn = (list, id) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id])
const chipClass = (on) => (on ? 'st sm red' : 'st sm lnn')

function StepTitle({ title, children }) {
  return (
    <div>
      <h1 className="h2 step" tabIndex={-1}>
        {title}
      </h1>
      <p className="muted" style={{ margin: '6px 0 0' }}>
        {children}
      </p>
    </div>
  )
}

/**
 * Preferences wizard (UC-U11 view, UC-U12 create, UC-U13 update, UC-U14 remove).
 * Shown right after registration and reachable later from settings.
 */
export default function PreferencesPage() {
  const navigate = useNavigate()
  const cardRef = useRef(null)
  const [step, setStep] = useState(1)
  const [prefs, setPrefs] = useState(EMPTY_PREFERENCES)
  const [hasSaved, setHasSaved] = useState(false)
  const [tried, setTried] = useState(false)
  const [locating, setLocating] = useState(false)
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Prefill with saved preferences when editing (UC-U13); empty for a new account.
  useEffect(() => {
    let active = true
    preferencesService
      .get()
      .then((data) => {
        if (active && data?.preferences) {
          setPrefs({ ...EMPTY_PREFERENCES, ...data.preferences })
          setHasSaved(true)
        }
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    cardRef.current?.querySelector('h1')?.focus()
  }, [step])

  const set = (field, value) => setPrefs((p) => ({ ...p, [field]: value }))
  const toggle = (field, id) => setPrefs((p) => ({ ...p, [field]: toggleIn(p[field], id) }))

  const step1Error = step === 1 && prefs.categories.length === 0

  function next() {
    if (step1Error) {
      setTried(true)
      return
    }
    setTried(false)
    setStep((s) => s + 1)
  }

  function toggleLocation() {
    setNote('')
    if (prefs.use_location) {
      set('use_location', false)
      return
    }
    if (!('geolocation' in navigator)) {
      setNote('متصفحك لا يدعم تحديد الموقع.')
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      () => {
        setLocating(false)
        set('use_location', true)
      },
      (err) => {
        setLocating(false)
        setNote(
          err.code === err.PERMISSION_DENIED
            ? 'لم تسمح بالوصول إلى موقعك. يمكنك تفعيله من إعدادات المتصفح، أو اختيار المناطق يدوياً.'
            : 'تعذّر تحديد موقعك الآن. اختر المناطق يدوياً أو حاول مرة أخرى.',
        )
      },
      { timeout: 10000 },
    )
  }

  async function save() {
    setSaving(true)
    setError('')
    try {
      await preferencesService.save(prefs)
      navigate('/home', { replace: true })
    } catch {
      setError('تعذّر حفظ تفضيلاتك. تحقق من اتصالك وحاول مرة أخرى.') // UC-U12 A3
      setSaving(false)
    }
  }

  async function clearAll() {
    if (!confirm('مسح كل تفضيلاتك المحفوظة؟')) return
    try {
      await preferencesService.remove()
      setPrefs(EMPTY_PREFERENCES)
      setHasSaved(false)
      setStep(1)
    } catch {
      setError('تعذّر مسح التفضيلات. حاول مرة أخرى.') // UC-U14 A3
    }
  }

  const pct = Math.round(((prefs.max_spend - SPEND.min) / (SPEND.max - SPEND.min)) * 100)
  const spendLabel = `₪${prefs.max_spend}${prefs.max_spend >= SPEND.max ? '+' : ''}`

  return (
    <div className="p-Preferences th-site">
      <div className="ge pg" style={{ position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <header className="top">
          <img className="gec gec2" src="/img/tatreez_corner6.png" alt="" aria-hidden="true" />
          <div
            className="in hdr"
            style={{
              gap: 'clamp(12px, 2vw, 24px)',
              minHeight: 'var(--bar)',
              padding: '6px clamp(16px, 3vw, 40px)',
              paddingLeft: 'calc(var(--corner) + 16px)',
            }}
          >
            <Link className="brand" to="/home" aria-label="الصفحة الرئيسية">
              <svg viewBox="0 0 40 48" aria-hidden="true" style={{ width: 'calc(var(--bar) * .42)', height: 'calc(var(--bar) * .5)' }}>
                <image href="/img/logo_pin.png" x="0" y="0" width="40" height="48" preserveAspectRatio="xMidYMid meet" />
              </svg>
              <span>
                <b style={{ fontSize: 'calc(var(--bar) * .3)' }}>GoExplore</b>
                <small style={{ fontSize: 'calc(var(--bar) * .14)' }}>اكتشف فلسطين</small>
              </span>
            </Link>
            <div style={{ flex: '1 1 320px', display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 720, marginInlineStart: 'auto' }}>
              <div className="between small stepinfo" style={{ color: '#D8CDBA' }}>
                <span className="b" style={{ color: '#F7F0E2' }}>
                  {STEPS[step - 1]}
                </span>
                <span className="stepnum">
                  الخطوة {step} من {STEPS.length}
                </span>
              </div>
              <div
                role="progressbar"
                aria-label="تقدّم إعداد الاهتمامات"
                aria-valuemin={1}
                aria-valuemax={STEPS.length}
                aria-valuenow={step}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 6 }}
              >
                {STEPS.map((s, i) => (
                  <span key={s} className={i < step ? 'prog on' : 'prog'} />
                ))}
              </div>
            </div>
          </div>
        </header>
        <main
          className="pmain"
          style={{
            position: 'relative',
            overflow: 'hidden',
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            padding: 'clamp(20px, 5vh, 56px) clamp(12px, 3vw, 24px) clamp(24px, 6vh, 72px)',
            boxSizing: 'border-box',
            background: '#EBDDC4',
          }}
        >
          <img
            src="/img/prefs_bg2.jpg"
            alt=""
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center bottom', pointerEvents: 'none' }}
          />
          <section
            ref={cardRef}
            className="card pcard"
            aria-label="اهتماماتك"
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: 880,
              margin: '0 auto',
              borderRadius: 22,
              padding: 'clamp(20px, 3vw, 34px)',
              display: 'flex',
              flexDirection: 'column',
              gap: 22,
              background: 'rgba(251,246,238,.38)',
              border: '1.5px dashed rgba(126,21,20,.35)',
              WebkitBackdropFilter: 'blur(5px)',
              backdropFilter: 'blur(5px)',
              boxShadow: '0 18px 50px rgba(60,40,20,.18)',
              overflow: 'hidden',
            }}
          >
            {step === 1 && (
              <>
                <StepTitle title="شو الأماكن اللي بتحبها؟">اختر فئة واحدة أو أكثر — رح نعطيها أولوية في صفحتك الرئيسية.</StepTitle>
                <div className="catgrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 14 }}>
                  {CATEGORIES.map((c) => {
                    const on = prefs.categories.includes(c.id)
                    return (
                      <button
                        key={c.id}
                        type="button"
                        aria-pressed={on}
                        className={`catcard ${on ? 'on' : 'off'}`}
                        onClick={() => {
                          toggle('categories', c.id)
                          setTried(false)
                        }}
                      >
                        <span className="tick" aria-hidden="true">
                          ✓
                        </span>
                        <span className="ibox">
                          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d={c.icon} />
                          </svg>
                        </span>
                        <span className="b" style={{ position: 'relative' }}>
                          {c.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <StepTitle title="قديش ميزانيتك عادةً؟">بنستخدمها لنقترح أماكن بتناسب جيبتك.</StepTitle>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                    background: '#F4ECDF',
                    border: '1.5px dashed #D5C4AA',
                    borderRadius: 16,
                    padding: '18px 20px',
                  }}
                >
                  <label htmlFor="spend" className="between b">
                    <span>الحد الأقصى للصرف في الزيارة الواحدة</span>
                    <span className="serif" style={{ color: '#7E1514', fontSize: 22 }}>
                      {spendLabel}
                    </span>
                  </label>
                  <input
                    id="spend"
                    className="range"
                    type="range"
                    min={SPEND.min}
                    max={SPEND.max}
                    step={SPEND.step}
                    value={prefs.max_spend}
                    aria-valuetext={spendLabel}
                    onChange={(e) => set('max_spend', Number(e.target.value))}
                    style={{ background: `linear-gradient(to left, #7E1514 ${pct}%, #E4D8C6 ${pct}%)` }}
                  />
                  <div className="between xs muted">
                    <span>₪{SPEND.min}</span>
                    <span>₪{SPEND.max}+</span>
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={prefs.deals_first}
                  className="card"
                  onClick={() => set('deals_first', !prefs.deals_first)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                    padding: '16px 18px',
                    font: 'inherit',
                    color: '#231A15',
                    cursor: 'pointer',
                    textAlign: 'right',
                  }}
                >
                  <span>
                    <strong>أظهر لي العروض والخصومات أولاً</strong>
                    <br />
                    <span className="small muted">أماكن عليها مكافآت أو عروض قابلة للاستبدال بنقاطك</span>
                  </span>
                  <span className="sw" aria-checked={prefs.deals_first} style={{ background: prefs.deals_first ? '#173022' : '#CFC2AD' }}>
                    <i />
                  </span>
                </button>
              </>
            )}

            {step === 3 && (
              <>
                <StepTitle title="وين بتحب تطلع في نابلس؟">اختر المناطق اللي بتروحها أكثر — ممكن تختار أكثر من وحدة.</StepTitle>
                <button
                  type="button"
                  aria-pressed={prefs.use_location}
                  className={prefs.use_location ? 'st grn' : 'st lnn'}
                  style={{ alignSelf: 'flex-start' }}
                  onClick={toggleLocation}
                  disabled={locating}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
                    <circle cx="12" cy="12" r="8" />
                  </svg>
                  <span style={{ position: 'relative' }}>
                    {locating ? 'جارٍ تحديد موقعك…' : prefs.use_location ? 'نستخدم موقعك الحالي لحساب المسافات ✓' : 'استخدم موقعي الحالي'}
                  </span>
                </button>
                {note && (
                  <p className="small muted" role="status" style={{ margin: 0 }}>
                    {note}
                  </p>
                )}
                <div className="row" style={{ gap: 10 }}>
                  {AREAS.map((a) => (
                    <button key={a.id} type="button" aria-pressed={prefs.areas.includes(a.id)} className={chipClass(prefs.areas.includes(a.id))} onClick={() => toggle('areas', a.id)}>
                      {a.label}
                    </button>
                  ))}
                </div>
                <fieldset>
                  <legend>أقصى مسافة مناسبة لك</legend>
                  <div className="row" style={{ gap: 10 }}>
                    {DISTANCES.map((d) => {
                      const on = prefs.max_distance_km === d.id
                      return (
                        <button key={d.label} type="button" aria-pressed={on} className={on ? 'st sm grn' : 'st sm lnn'} onClick={() => set('max_distance_km', d.id)}>
                          {d.label}
                        </button>
                      )
                    })}
                  </div>
                </fieldset>
              </>
            )}

            {step === 4 && (
              <>
                <StepTitle title="تفاصيل أكثر عنك">كلها اختيارية، بس بتخلي الاقتراحات أدق بكثير.</StepTitle>
                {DETAIL_GROUPS.map((g) => (
                  <fieldset key={g.key}>
                    <legend>{g.label}</legend>
                    <div className="row" style={{ gap: 10 }}>
                      {g.options.map((o) => {
                        const on = prefs[g.key].includes(o.id)
                        return (
                          <button key={o.id} type="button" aria-pressed={on} className={chipClass(on)} onClick={() => toggle(g.key, o.id)}>
                            {o.label}
                          </button>
                        )
                      })}
                    </div>
                  </fieldset>
                ))}
              </>
            )}

            {tried && step1Error && (
              <p role="alert" className="alert err b" style={{ margin: 0 }}>
                اختر فئة واحدة على الأقل لنكمل.
              </p>
            )}
            {error && (
              <p role="alert" className="alert err b" style={{ margin: 0 }}>
                {error}
              </p>
            )}

            <div className="row" style={{ justifyContent: 'space-between', borderTop: '1.5px dashed #D5C4AA', paddingTop: 20, position: 'relative' }}>
              {step > 1 && (
                <button type="button" onClick={() => setStep((s) => s - 1)} className="st lnn">
                  → السابق
                </button>
              )}
              {step === 1 && hasSaved && (
                <button type="button" onClick={clearAll} className="st ghost">
                  مسح كل التفضيلات
                </button>
              )}
              <span style={{ flex: 1 }} />
              {step < STEPS.length ? (
                <button type="button" onClick={next} className="st grn" style={{ padding: '14px 30px' }}>
                  التالي ←
                </button>
              ) : (
                <button type="button" onClick={save} disabled={saving} className="st red" style={{ padding: '14px 30px', color: '#FFFFFF' }}>
                  {saving ? 'جارٍ الحفظ…' : 'احفظ وابدأ الاستكشاف ←'}
                </button>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
