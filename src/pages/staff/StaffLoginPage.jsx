import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import OtpInput from '../../components/OtpInput'
import SiteHeader from '../../components/SiteHeader'
import { startStaffSession } from '../../services/staffSession'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^\+?[\d\s-]{9,15}$/

const VARIANTS = {
  admin: {
    page: 'AdminLogin',
    bg: { src: '/img/ph/hero_clock.jpg', alt: 'رسم لبرج الساعة في نابلس' },
    home: '/admin/login',
    brandLabel: 'دخول الإدارة',
    brandWord: 'الإدارة',
    tagline: 'لوحة تحكّم المشرفين',
    tag: 'منطقة محمية',
    title: 'دخول المشرفين',
    intro: 'هذه الصفحة لفريق إدارة GoExplore فقط. كل محاولات الدخول بتنسجّل.',
    idLabel: 'البريد الإلكتروني للعمل',
    otpHint: 'أدخل الرمز المكوّن من 6 أرقام من تطبيق المصادقة على جوالك.',
    submit: 'دخول لوحة الإدارة',
    dashboard: '/admin',
    icon: (
      <>
        <rect x="5" y="10.5" width="14" height="10" rx="2" />
        <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3M12 14.5v2.5" />
      </>
    ),
  },
  business: {
    page: 'BusinessLogin',
    bg: { src: '/img/ph/hero_valley.jpg', alt: 'رسم لنابلس بين الجبلين' },
    home: '/business/login',
    brandLabel: 'دخول أصحاب الأنشطة',
    brandWord: 'للأعمال',
    tagline: 'لأصحاب المحلات والأماكن',
    tag: 'GoExplore للأعمال',
    title: 'دخول أصحاب الأنشطة',
    intro: 'أدر صفحة مكانك: ساعات العمل، القائمة، الصور، العروض وردود التقييمات.',
    idLabel: 'البريد الإلكتروني أو رقم الجوال',
    allowPhone: true,
    otpHint: 'بعتنالك رمز من 6 أرقام برسالة على جوالك المسجّل.',
    submit: 'دخول لوحة نشاطي',
    dashboard: '/business',
    signup: true,
    icon: <path d="M4 10v10h16V10M3 10l2-6h14l2 6M3 10h18M9 20v-6h6v6" />,
  },
}

/** Two-step sign-in for administrators and business owners (password, then a 6-digit code). */
export default function StaffLoginPage({ variant }) {
  const v = VARIANTS[variant]
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')

  function next(e) {
    e.preventDefault()
    const value = id.trim()
    const validId = EMAIL_RE.test(value) || (v.allowPhone && PHONE_RE.test(value))
    if (!validId || !password) {
      setError(!value || !password ? 'عبّي كل الحقول.' : 'أدخل بريداً إلكترونياً صالحاً.')
      return
    }
    setError('')
    setStep(2)
  }

  function verify(e) {
    e.preventDefault()
    if (code.join('').length < 6) {
      setError('أدخل الرمز كامل (6 أرقام).')
      return
    }
    startStaffSession(variant, id.trim(), remember)
    navigate(v.dashboard, { replace: true })
  }

  return (
    <div className={`p-${v.page} th-site`}>
      <div
        className="ge pg"
        style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative', overflow: 'hidden', background: '#E9D9BC' }}
      >
        <img
          src={v.bg.src}
          alt={v.bg.alt}
          className="photo"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectPosition: 'center 40%' }}
        />
        <SiteHeader
          to={v.home}
          label={v.brandLabel}
          tagline={v.tagline}
          title={
            <>
              {'GoExplore '}
              <span style={{ color: '#E2B66E', fontWeight: 400 }}>{v.brandWord}</span>
            </>
          }
        >
          <Link to="/" className="small b" style={{ marginInlineStart: 'auto', color: '#E6DCCB', textDecoration: 'none' }}>
            → رجوع للتطبيق
          </Link>
        </SiteHeader>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span className="lock" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  {v.icon}
                </svg>
              </span>
              <div>
                <span className="tag dark">{v.tag}</span>
                <h2 className="h2" style={{ marginTop: 6 }}>
                  {v.title}
                </h2>
              </div>
            </div>
            <p className="small" style={{ margin: '-6px 0 0', color: '#3A2E26', fontWeight: 500 }}>
              {v.intro}
            </p>
            {error && (
              <div className="alert err" role="alert">
                {error}
              </div>
            )}

            {step === 1 ? (
              <form className="stack" style={{ gap: 16 }} onSubmit={next} noValidate>
                <div>
                  <label className="lb" htmlFor="ae">
                    {v.idLabel}
                  </label>
                  <input id="ae" className="field" dir="ltr" style={{ textAlign: 'right' }} autoComplete="username" value={id} onChange={(e) => setId(e.target.value)} />
                </div>
                <div>
                  <div className="between" style={{ marginBottom: 6 }}>
                    <label className="lb" htmlFor="ap" style={{ margin: 0 }}>
                      كلمة المرور
                    </label>
                    <Link className="link small" to={v.home}>
                      نسيت كلمة المرور؟
                    </Link>
                  </div>
                  <input id="ap" className="field" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <label className="remember" htmlFor="rm">
                  <input id="rm" type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                  <span className="box" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12.5l4.5 4.5L19 7.5" />
                    </svg>
                  </span>
                  <span>تذكّر هذا الجهاز لمدة 30 يوم</span>
                </label>
                <button type="submit" className="st grn wide" style={{ minHeight: 54, fontSize: 17, color: '#FFFFFF' }}>
                  متابعة ←
                </button>
                {v.signup && (
                  <p className="small" style={{ margin: 0, textAlign: 'center', color: '#3A2E26' }}>
                    {'ما عندك حساب؟ '}
                    <Link className="link" to="/business/signup">
                      سجّل نشاطك التجاري
                    </Link>
                  </p>
                )}
              </form>
            ) : (
              <form className="stack" style={{ gap: 16 }} onSubmit={verify} noValidate>
                <div>
                  <strong>التحقق بخطوتين</strong>
                  <p className="small" style={{ margin: '4px 0 0', color: '#3A2E26' }}>
                    {v.otpHint}
                  </p>
                </div>
                <OtpInput value={code} onChange={setCode} />
                <button type="submit" className="st red wide" style={{ minHeight: 54, fontSize: 17, color: '#FFFFFF' }}>
                  {v.submit}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStep(1)
                    setError('')
                  }}
                  className="link small"
                  style={{ background: 'none', border: 0, cursor: 'pointer', alignSelf: 'center', font: 'inherit', fontWeight: 700 }}
                >
                  → رجوع وتغيير الحساب
                </button>
              </form>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
