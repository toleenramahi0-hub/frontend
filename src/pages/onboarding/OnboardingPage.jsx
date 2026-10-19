import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Chip from '../../components/Chip'
import Logo from '../../components/Logo'
import { preferencesService } from '../../services/preferencesService'
import {
  AREAS,
  CATEGORIES,
  DETAIL_GROUPS,
  DISTANCES,
  EMPTY_PREFERENCES,
  PRICE_LEVELS,
  SPEND,
  STEPS,
} from './onboardingOptions'
import '../../components/Switch.css'
import './OnboardingPage.css'

const toggleIn = (list, id) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id])

/**
 * Interests setup wizard shown right after registration.
 * Creates the user's preferences (UC-U12), or edits them if some are already saved (UC-U13).
 */
export default function OnboardingPage() {
  const navigate = useNavigate()
  const headingRef = useRef(null)
  const stepShownAt = useRef(0)

  const [step, setStep] = useState(1)
  const [prefs, setPrefs] = useState(EMPTY_PREFERENCES)
  const [stepError, setStepError] = useState('')
  const [locationNote, setLocationNote] = useState('')
  const [locating, setLocating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  // Prefill with saved preferences, if any (e.g. the user comes back to edit them).
  useEffect(() => {
    let active = true
    preferencesService
      .get()
      .then((data) => {
        if (active && data?.preferences) setPrefs({ ...EMPTY_PREFERENCES, ...data.preferences })
      })
      .catch(() => {}) // nothing saved yet or unavailable: start empty
    return () => {
      active = false
    }
  }, [])

  // Move focus to the new step's heading so keyboard and screen-reader users follow along.
  useEffect(() => {
    stepShownAt.current = Date.now()
    window.scrollTo({ top: 0 })
    headingRef.current?.focus()
  }, [step])

  const set = (field, value) => setPrefs((p) => ({ ...p, [field]: value }))
  const toggle = (field, id) => setPrefs((p) => ({ ...p, [field]: toggleIn(p[field], id) }))

  function next() {
    if (step === 1 && prefs.categories.length === 0) {
      setStepError('اختر فئة واحدة على الأقل لنكمل.')
      return
    }
    setStepError('')
    setStep((s) => s + 1)
  }

  function back() {
    setStepError('')
    setSaveError('')
    setStep((s) => s - 1)
  }

  function toggleLocation() {
    setLocationNote('')
    if (prefs.use_location) {
      set('use_location', false)
      return
    }
    if (!('geolocation' in navigator)) {
      setLocationNote('متصفحك لا يدعم تحديد الموقع.')
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
        setLocationNote(
          err.code === err.PERMISSION_DENIED
            ? 'لم تسمح بالوصول إلى موقعك. يمكنك تفعيله من إعدادات المتصفح، أو اختيار المناطق يدوياً.'
            : 'تعذّر تحديد موقعك الآن. اختر المناطق يدوياً أو حاول مرة أخرى.',
        )
      },
      { timeout: 10000 },
    )
  }

  async function save() {
    // "Save" replaces "Next" in the same spot; ignore the second half of a double-click on Next.
    if (Date.now() - stepShownAt.current < 500) return
    setSaving(true)
    setSaveError('')
    try {
      await preferencesService.save(prefs)
      navigate('/home', { replace: true })
    } catch {
      // UC-U12 A3: never claim the preferences were saved.
      setSaveError('تعذّر حفظ تفضيلاتك. تحقق من اتصالك وحاول مرة أخرى.')
      setSaving(false)
    }
  }

  const spendLabel = `₪${prefs.max_spend}${prefs.max_spend >= SPEND.max ? '+' : ''}`

  return (
    <div className="onb">
      <header className="onb__header">
        <div className="onb__header-inner">
          <Logo variant="dark" />
          <div className="onb__progress">
            <div className="onb__progress-text">
              <span>{STEPS[step - 1]}</span>
              <span>
                الخطوة {step} من {STEPS.length}
              </span>
            </div>
            <div
              className="onb__bars"
              role="progressbar"
              aria-label="تقدّم إعداد الاهتمامات"
              aria-valuemin={1}
              aria-valuemax={STEPS.length}
              aria-valuenow={step}
            >
              {STEPS.map((title, i) => (
                <span key={title} className={`onb__bar ${i < step ? 'onb__bar--done' : ''}`} />
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="onb__main">
        <section className="onb__card" aria-labelledby="onb-title">
          {step === 1 && (
            <>
              <StepHeading headingRef={headingRef} title="شو الأماكن اللي بتحبها؟">
                اختر فئة واحدة أو أكثر — رح نعطيها أولوية في صفحتك الرئيسية.
              </StepHeading>
              <div className="onb__cats">
                {CATEGORIES.map((c) => {
                  const on = prefs.categories.includes(c.id)
                  return (
                    <button
                      key={c.id}
                      type="button"
                      className={`onb__cat ${on ? 'onb__cat--on' : ''}`}
                      aria-pressed={on}
                      onClick={() => {
                        toggle('categories', c.id)
                        setStepError('')
                      }}
                    >
                      <span className="onb__cat-icon">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.9"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d={c.icon} />
                        </svg>
                      </span>
                      <span className="onb__cat-label">{c.label}</span>
                      <span className="onb__cat-check" aria-hidden="true">
                        ✓
                      </span>
                    </button>
                  )
                })}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <StepHeading headingRef={headingRef} title="قديش ميزانيتك عادةً؟">
                بنستخدمها لنقترح أماكن بتناسب جيبتك.
              </StepHeading>

              <fieldset className="onb__fieldset">
                <legend className="onb__legend">مستوى الأسعار</legend>
                <div className="onb__prices">
                  {PRICE_LEVELS.map((p) => {
                    const on = prefs.price_level === p.id
                    return (
                      <button
                        key={p.id}
                        type="button"
                        className={`onb__price ${on ? 'onb__price--on' : ''}`}
                        aria-pressed={on}
                        onClick={() => set('price_level', on ? null : p.id)}
                      >
                        <strong className="onb__price-label">{p.label}</strong>
                        <span className="onb__price-desc">{p.desc}</span>
                      </button>
                    )
                  })}
                </div>
              </fieldset>

              <div className="onb__spend">
                <label htmlFor="onb-spend" className="onb__spend-head">
                  <span>الحد الأقصى للصرف في الزيارة الواحدة</span>
                  <span className="onb__spend-value">{spendLabel}</span>
                </label>
                <input
                  id="onb-spend"
                  className="onb__range"
                  type="range"
                  min={SPEND.min}
                  max={SPEND.max}
                  step={SPEND.step}
                  value={prefs.max_spend}
                  aria-valuetext={spendLabel}
                  onChange={(e) => set('max_spend', Number(e.target.value))}
                />
                <div className="onb__range-ends">
                  <span>₪{SPEND.min}</span>
                  <span>₪{SPEND.max}+</span>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={prefs.deals_first}
                className="onb__toggle-row"
                onClick={() => set('deals_first', !prefs.deals_first)}
              >
                <span>
                  <strong>أظهر لي العروض والخصومات أولاً</strong>
                  <br />
                  <span className="onb__muted-sm">أماكن عليها مكافآت أو عروض قابلة للاستبدال بنقاطك</span>
                </span>
                <span className={`gx-switch__track gx-switch__track--lg ${prefs.deals_first ? 'gx-switch__track--on' : ''}`}>
                  <span className="gx-switch__knob" />
                </span>
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <StepHeading headingRef={headingRef} title="وين بتحب تطلع في نابلس؟">
                اختر المناطق اللي بتروحها أكثر — ممكن تختار أكثر من وحدة.
              </StepHeading>

              <div className="onb__loc-wrap">
                <button
                  type="button"
                  className={`onb__loc ${prefs.use_location ? 'onb__loc--on' : ''}`}
                  aria-pressed={prefs.use_location}
                  onClick={toggleLocation}
                  disabled={locating}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
                    <circle cx="12" cy="12" r="8" />
                  </svg>
                  {locating
                    ? 'جارٍ تحديد موقعك…'
                    : prefs.use_location
                      ? 'نستخدم موقعك الحالي لحساب المسافات ✓'
                      : 'استخدم موقعي الحالي'}
                </button>
                {locationNote && (
                  <p className="onb__note" role="status">
                    {locationNote}
                  </p>
                )}
              </div>

              <div className="onb__chips" role="group" aria-label="المناطق">
                {AREAS.map((a) => (
                  <Chip key={a.id} selected={prefs.areas.includes(a.id)} onClick={() => toggle('areas', a.id)}>
                    {a.label}
                  </Chip>
                ))}
              </div>

              <fieldset className="onb__fieldset">
                <legend className="onb__legend">أقصى مسافة مناسبة لك</legend>
                <div className="onb__chips onb__chips--tight">
                  {DISTANCES.map((d) => (
                    <Chip
                      key={d.label}
                      selected={prefs.max_distance_km === d.id}
                      onClick={() => set('max_distance_km', d.id)}
                    >
                      {d.label}
                    </Chip>
                  ))}
                </div>
              </fieldset>
            </>
          )}

          {step === 4 && (
            <>
              <StepHeading headingRef={headingRef} title="تفاصيل أكثر عنك">
                كلها اختيارية، بس بتخلي الاقتراحات أدق بكثير.
              </StepHeading>
              {DETAIL_GROUPS.map((g) => (
                <fieldset key={g.key} className="onb__fieldset">
                  <legend className="onb__legend">{g.label}</legend>
                  <div className="onb__chips onb__chips--tight">
                    {g.options.map((o) => (
                      <Chip key={o.id} selected={prefs[g.key].includes(o.id)} onClick={() => toggle(g.key, o.id)}>
                        {o.label}
                      </Chip>
                    ))}
                  </div>
                </fieldset>
              ))}
            </>
          )}

          {(stepError || saveError) && (
            <p className="onb__error" role="alert">
              {stepError || saveError}
            </p>
          )}

          <div className="onb__nav">
            {step > 1 && (
              <button type="button" className="onb__btn onb__btn--back" onClick={back} disabled={saving}>
                → السابق
              </button>
            )}
            <span className="onb__nav-spacer" />
            {step < STEPS.length ? (
              <button type="button" className="onb__btn onb__btn--next" onClick={next}>
                التالي ←
              </button>
            ) : (
              <button
                type="button"
                className="onb__btn onb__btn--finish"
                onClick={save}
                disabled={saving}
                aria-busy={saving}
              >
                {saving ? 'جارٍ الحفظ…' : 'احفظ وابدأ الاستكشاف ←'}
              </button>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

function StepHeading({ headingRef, title, children }) {
  return (
    <div>
      <h1 id="onb-title" ref={headingRef} tabIndex={-1} className="onb__title">
        {title}
      </h1>
      <p className="onb__subtitle">{children}</p>
    </div>
  )
}
