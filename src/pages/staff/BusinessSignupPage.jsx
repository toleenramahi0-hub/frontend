import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import OtpInput from '../../components/OtpInput'
import SiteHeader from '../../components/SiteHeader'
import { setValue } from '../../services/interactions'
import { startStaffSession } from '../../services/staffSession'
import { CATEGORIES } from '../preferences/preferencesOptions'

const STEPS = ['الحساب', 'تأكيد الجوال', 'النشاط', 'التوثيق']
const AREAS = ['البلدة القديمة', 'وسط البلد', 'رفيديا', 'المخفية', 'شارع فيصل', 'شارع عمّان', 'الجبل الشمالي', 'الجبل الجنوبي']
const DOC_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
const DOC_MAX_MB = 10

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^\+?[\d\s-]{9,15}$/

function Tick() {
  return (
    <span className="box" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12.5l4.5 4.5L19 7.5" />
      </svg>
    </span>
  )
}

/** One document slot: opens a file picker and checks type and size before accepting it. */
function DocSlot({ title, optional, hint, file, onFile, onError }) {
  const ref = useRef(null)
  return (
    <>
      <button type="button" className={file ? 'up done' : 'up'} onClick={() => ref.current?.click()}>
        <span className="ui">{file ? '✓' : '+'}</span>
        <span style={{ flex: 1, textAlign: 'right' }}>
          <b>{title}</b>
          {optional && (
            <span className="muted" style={{ fontWeight: 400 }}>
              {' '}
              (اختياري)
            </span>
          )}
          <br />
          <span className="xs muted">{file ? `${file.name} · ${(file.size / 1048576).toFixed(1)} MB` : hint}</span>
        </span>
        {file && <span className="link small">تغيير</span>}
      </button>
      <input
        ref={ref}
        type="file"
        hidden
        accept={DOC_TYPES.join(',')}
        onChange={(e) => {
          const f = e.target.files?.[0]
          e.target.value = ''
          if (!f) return
          if (!DOC_TYPES.includes(f.type) || f.size > DOC_MAX_MB * 1048576) {
            onError(`الملف لازم يكون PDF أو صورة وحجمه أقل من ${DOC_MAX_MB} MB.`)
            return
          }
          onError('')
          onFile(f)
        }}
      />
    </>
  )
}

/** First-time business registration and ownership verification request (UC-PB-06). */
export default function BusinessSignupPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [account, setAccount] = useState({ name: '', phone: '', email: '', password: '', password2: '' })
  const [agree, setAgree] = useState(false)
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [biz, setBiz] = useState({ name: '', category: '', area: AREAS[0], address: '', description: '' })
  const [docs, setDocs] = useState({ registry: null, license: null, storefront: null })
  const [claim, setClaim] = useState(false)
  const [error, setError] = useState('')

  const setA = (f) => (e) => setAccount((a) => ({ ...a, [f]: e.target.value }))
  const setB = (f) => (e) => setBiz((b) => ({ ...b, [f]: e.target.value }))

  function validate() {
    if (step === 1) {
      if (account.name.trim().length < 2) return 'اكتب اسمك الكامل.'
      if (!PHONE_RE.test(account.phone.trim())) return 'أدخل رقم جوال صحيح.'
      if (!EMAIL_RE.test(account.email.trim())) return 'أدخل بريداً إلكترونياً صالحاً.'
      if (account.password.length < 8 || !/\d/.test(account.password)) return 'كلمة المرور لازم تكون 8 أحرف على الأقل وفيها رقم.'
      if (account.password !== account.password2) return 'كلمتا المرور غير متطابقتين.'
      if (!agree) return 'لازم توافق على الشروط عشان نكمل.'
    }
    if (step === 2 && code.join('').length < 6) return 'أدخل الرمز كامل (6 أرقام).'
    if (step === 3) {
      if (!biz.name.trim()) return 'اكتب اسم النشاط.'
      if (!biz.category) return 'اختار فئة نشاطك.'
    }
    if (step === 4 && !docs.registry) return 'ارفع السجل التجاري عشان نقدر نراجع طلبك.'
    return ''
  }

  function next(e) {
    e?.preventDefault()
    const err = validate()
    setError(err)
    if (err) return
    if (step === 4) {
      // Request is recorded for admin review; owner permissions come only after approval.
      setValue('businessRequests', account.email.trim(), {
        owner: account.name.trim(),
        phone: account.phone.trim(),
        business: biz,
        claimExisting: claim,
        documents: Object.fromEntries(Object.entries(docs).map(([k, f]) => [k, f?.name ?? null])),
        status: 'pending',
        at: Date.now(),
      })
      startStaffSession('business', account.email.trim(), false)
    }
    setStep((s) => s + 1)
  }

  const back = () => {
    setError('')
    setStep((s) => Math.max(1, s - 1))
  }

  const errorBox = error && (
    <div className="alert err" role="alert">
      {error}
    </div>
  )

  return (
    <div className="p-BusinessSignup th-site">
      <div className="ge pg" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative', overflow: 'hidden', background: '#E9D9BC' }}>
        <img
          src="/img/auth_city.jpg"
          alt="رسم لمدينة نابلس على سفح الجبل"
          className="photo"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectPosition: 'center bottom' }}
        />
        <SiteHeader />
        <section
          className="amain"
          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(24px, 5vh, 56px) 16px', position: 'relative' }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 500,
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              gap: 18,
              background: 'rgba(251,246,238,.4)',
              WebkitBackdropFilter: 'blur(5px)',
              backdropFilter: 'blur(5px)',
              border: '1.5px dashed rgba(126,21,20,.45)',
              borderRadius: 22,
              padding: 'clamp(20px, 3vw, 34px)',
              boxShadow: '0 18px 50px rgba(60,40,20,.28)',
            }}
          >
            {step === 1 && (
              <div className="seg" role="group" aria-label="نوع الدخول" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                <button type="button" aria-pressed="false" onClick={() => navigate('/business/login', { replace: true })}>
                  تسجيل الدخول
                </button>
                <button type="button" aria-pressed="true">
                  إنشاء حساب
                </button>
              </div>
            )}
            {step < 5 && <h2 className="h2">سجّل نشاطك التجاري</h2>}
            {step < 5 && (
              <div className="steps" aria-label="مراحل التسجيل">
                {STEPS.map((label, i) => {
                  const n = i + 1
                  return (
                    <div key={label} className={step > n ? 'done' : step === n ? 'cur' : ''}>
                      <i>{step > n ? '✓' : n}</i>
                      <span>{label}</span>
                    </div>
                  )
                })}
              </div>
            )}

            {step === 1 && (
              <form className="stack" style={{ gap: 14 }} onSubmit={next} noValidate>
                <div>
                  <label className="lb" htmlFor="fn">
                    الاسم الكامل
                  </label>
                  <input id="fn" className="field" placeholder="مثلاً: خالد النابلسي" autoComplete="name" value={account.name} onChange={setA('name')} />
                </div>
                <div>
                  <label className="lb" htmlFor="ph">
                    رقم الجوال
                  </label>
                  <input id="ph" className="field" dir="ltr" style={{ textAlign: 'right' }} placeholder="+970 59 ___ ____" autoComplete="tel" value={account.phone} onChange={setA('phone')} />
                </div>
                <div>
                  <label className="lb" htmlFor="em">
                    البريد الإلكتروني
                  </label>
                  <input id="em" className="field" type="email" dir="ltr" style={{ textAlign: 'right' }} placeholder="name@business.ps" autoComplete="email" value={account.email} onChange={setA('email')} />
                </div>
                <div>
                  <label className="lb" htmlFor="pw">
                    كلمة المرور
                  </label>
                  <input id="pw" className="field" type="password" autoComplete="new-password" value={account.password} onChange={setA('password')} />
                  <p className="help muted">8 أحرف على الأقل، فيها رقم.</p>
                </div>
                <div>
                  <label className="lb" htmlFor="pw2">
                    تأكيد كلمة المرور
                  </label>
                  <input id="pw2" className="field" type="password" autoComplete="new-password" value={account.password2} onChange={setA('password2')} />
                </div>
                <label className="remember" htmlFor="ag">
                  <input id="ag" type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
                  <Tick />
                  <span>
                    {'بوافق على '}
                    <Link className="link" to="/business/signup">
                      شروط GoExplore للأعمال
                    </Link>
                    {' وسياسة الخصوصية'}
                  </span>
                </label>
                {errorBox}
                <button type="submit" className="st red wide" style={{ minHeight: 54, fontSize: 17, color: '#FFFFFF' }}>
                  إنشاء حساب
                </button>
              </form>
            )}

            {step === 2 && (
              <form className="stack" style={{ gap: 16 }} onSubmit={next} noValidate>
                <div>
                  <strong>تأكيد رقم الجوال</strong>
                  <p className="small" style={{ margin: '4px 0 0', color: '#3A2E26' }}>
                    {'بعتنالك رمز من 6 أرقام برسالة على '}
                    <b dir="ltr">{account.phone}</b>
                  </p>
                </div>
                <OtpInput value={code} onChange={setCode} />
                <span className="small muted" style={{ textAlign: 'center' }}>
                  {'ما وصلك؟ '}
                  <button type="button" className="link" style={{ background: 'none', border: 0, font: 'inherit', cursor: 'pointer' }}>
                    إعادة الإرسال
                  </button>
                </span>
                {errorBox}
                <div className="row" style={{ gap: 10 }}>
                  <button type="button" onClick={back} className="st lnn">
                    → السابق
                  </button>
                  <span style={{ flex: 1 }} />
                  <button type="submit" className="st grn" style={{ color: '#FFFFFF', minWidth: 160 }}>
                    تأكيد ←
                  </button>
                </div>
              </form>
            )}

            {step === 3 && (
              <form className="stack" style={{ gap: 14 }} onSubmit={next} noValidate>
                <div>
                  <label className="lb" htmlFor="bn">
                    اسم النشاط / المحل
                  </label>
                  <input id="bn" className="field" placeholder="مثلاً: محل الكنافة النابلسية" value={biz.name} onChange={setB('name')} />
                </div>
                <div>
                  <span className="lb">الفئة</span>
                  <div className="cgrid">
                    {CATEGORIES.map((c) => (
                      <button key={c.id} type="button" aria-pressed={biz.category === c.id} className={biz.category === c.id ? 'cb on' : 'cb'} onClick={() => setBiz((b) => ({ ...b, category: c.id }))}>
                        <span className="ci">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d={c.icon} />
                          </svg>
                        </span>
                        <span>{c.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="g2f">
                  <div>
                    <label className="lb" htmlFor="ar">
                      المنطقة
                    </label>
                    <select id="ar" className="field" value={biz.area} onChange={setB('area')}>
                      {AREAS.map((a) => (
                        <option key={a}>{a}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="lb" htmlFor="ad">
                      العنوان بالتفصيل
                    </label>
                    <input id="ad" className="field" placeholder="الشارع، قرب…" value={biz.address} onChange={setB('address')} />
                  </div>
                </div>
                <div>
                  <label className="lb" htmlFor="ds">
                    {'وصف قصير '}
                    <span className="muted" style={{ fontWeight: 400 }}>
                      (اختياري)
                    </span>
                  </label>
                  <textarea id="ds" className="field" rows="2" placeholder="شو بيميّز مكانك؟" value={biz.description} onChange={setB('description')} />
                </div>
                {errorBox}
                <div className="row" style={{ gap: 10 }}>
                  <button type="button" onClick={back} className="st lnn">
                    → السابق
                  </button>
                  <span style={{ flex: 1 }} />
                  <button type="submit" className="st grn" style={{ color: '#FFFFFF', minWidth: 160 }}>
                    التالي ←
                  </button>
                </div>
              </form>
            )}

            {step === 4 && (
              <form className="stack" style={{ gap: 14 }} onSubmit={next} noValidate>
                <div>
                  <strong>إثبات ملكية النشاط</strong>
                  <p className="small" style={{ margin: '4px 0 0', color: '#3A2E26' }}>
                    فريقنا بيراجع الوثائق عشان يحمي صفحات الأماكن من الانتحال. ما رح تنعرض لأي حد.
                  </p>
                </div>
                <DocSlot title="السجل التجاري" hint="PDF أو صورة · حتى 10 MB" file={docs.registry} onFile={(f) => setDocs((d) => ({ ...d, registry: f }))} onError={setError} />
                <DocSlot title="رخصة البلدية" optional hint="PDF أو صورة · حتى 10 MB" file={docs.license} onFile={(f) => setDocs((d) => ({ ...d, license: f }))} onError={setError} />
                <DocSlot title="صورة واجهة المحل" hint="بتساعدنا نتأكد من الموقع" file={docs.storefront} onFile={(f) => setDocs((d) => ({ ...d, storefront: f }))} onError={setError} />
                <label className="remember" htmlFor="cl">
                  <input id="cl" type="checkbox" checked={claim} onChange={(e) => setClaim(e.target.checked)} />
                  <Tick />
                  <span>مكاني موجود أصلاً على GoExplore وبدي أستلم إدارته</span>
                </label>
                {errorBox}
                <div className="row" style={{ gap: 10 }}>
                  <button type="button" onClick={back} className="st lnn">
                    → السابق
                  </button>
                  <span style={{ flex: 1 }} />
                  <button type="submit" className="st red" style={{ color: '#FFFFFF', minWidth: 180 }}>
                    إرسال للمراجعة ←
                  </button>
                </div>
              </form>
            )}

            {step === 5 && (
              <div className="stack" style={{ gap: 14, textAlign: 'center', alignItems: 'center' }}>
                <span className="okc" aria-hidden="true">
                  ✓
                </span>
                <h3 className="h3" style={{ margin: 0 }}>
                  تم استلام طلبك!
                </h3>
                <p style={{ margin: 0, color: '#3A2E26' }}>
                  {'فريق GoExplore بيراجع وثائقك خلال '}
                  <b>24–48 ساعة</b>، وبنبعتلك رسالة أول ما ينوثّق نشاطك.
                </p>
                <div className="todo">
                  <div>
                    <span className="tag ok">تم</span>
                    {' إنشاء الحساب وتأكيد الجوال'}
                  </div>
                  <div>
                    <span className="tag ok">تم</span>
                    {' معلومات النشاط'}
                  </div>
                  <div>
                    <span className="tag warn">بالمراجعة</span>
                    {' توثيق الملكية'}
                  </div>
                </div>
                <p className="small" style={{ margin: 0, color: '#3A2E26' }}>
                  لحد ما يخلص التوثيق، فيك تجهّز صفحتك: الصور، القائمة وساعات العمل.
                </p>
                <Link to="/business" className="st red wide" style={{ minHeight: 54, fontSize: 17, color: '#FFFFFF' }}>
                  ادخل لوحة نشاطي ←
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
