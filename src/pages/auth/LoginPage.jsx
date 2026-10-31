import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import SiteHeader from '../../components/SiteHeader'
import { useAuth } from '../../context/useAuth'
import { messages, validateLogin, validateRegister } from '../../utils/validation'

const emptyForm = { name: '', username: '', email: '', login: '', password: '' }

// Known server error codes → Arabic messages; anything else is shown as sent.
const serverMessages = { username_taken: messages.usernameTaken, email_taken: messages.emailTaken }

function loginError(err) {
  if (err.status === 0) return 'تعذّر الاتصال بالخادم. تحقق من اتصالك وحاول مرة أخرى.'
  // UC-U02 A1: one generic message, never say which field was wrong.
  if (err.status === 401 || err.status === 422) return 'البريد الإلكتروني/اسم المستخدم أو كلمة المرور غير صحيحة.'
  if (err.status === 403) return 'لا يمكن الدخول إلى هذا الحساب حالياً. تواصل مع الدعم الفني.'
  if (err.status === 429) return 'محاولات كثيرة. انتظر قليلاً ثم حاول مرة أخرى.'
  return 'تعذّر تسجيل الدخول في الوقت الحالي. حاول مرة أخرى لاحقاً.'
}

function Field({ id, label, error, help, children }) {
  return (
    <div>
      <label className="lb" htmlFor={id}>
        {label}
      </label>
      {children}
      {error ? <p className="help err">{error}</p> : help && <p className="help muted">{help}</p>}
    </div>
  )
}

/** Sign in (UC-U02) and register (UC-U01) on one card with a tab switch. */
export default function LoginPage({ mode = 'login' }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, login, register } = useAuth()
  const isRegister = mode === 'register'

  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [remember, setRemember] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  if (isAuthenticated && !submitting) return <Navigate to="/home" replace />

  const update = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    setErrors(({ [field]: _drop, ...rest }) => rest)
  }

  function switchTo(next) {
    setErrors({})
    setFormError('')
    navigate(next === 'register' ? '/register' : '/login', { replace: true, state: location.state })
  }

  async function submit(e) {
    e.preventDefault()
    setFormError('')
    const clientErrors = isRegister ? validateRegister(form) : validateLogin(form)
    setErrors(clientErrors)
    if (Object.keys(clientErrors).length) return

    setSubmitting(true)
    try {
      if (isRegister) {
        await register({
          name: form.name.trim(),
          username: form.username,
          email: form.email.trim(),
          password: form.password,
          password_confirmation: form.password,
        })
        navigate('/preferences', { replace: true })
      } else {
        await login({ login: form.login.trim(), password: form.password, remember })
        navigate(location.state?.from?.pathname || '/home', { replace: true })
      }
    } catch (err) {
      setSubmitting(false)
      const fieldErrors = Object.fromEntries(Object.entries(err.fields || {}).map(([k, m]) => [k, serverMessages[m] || m]))
      if (isRegister && Object.keys(fieldErrors).length) setErrors(fieldErrors) // UC-U01 A1–A3
      else setFormError(isRegister ? 'تعذّر إنشاء الحساب في الوقت الحالي. حاول مرة أخرى لاحقاً.' : loginError(err))
    }
  }

  const submitStyle = { minHeight: 54, fontSize: 17, color: '#FFFFFF' }

  return (
    <div className="p-Login th-site">
      <div
        className="ge pg"
        style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative', overflow: 'hidden', background: '#E9D9BC' }}
      >
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
            <div className="seg" role="group" aria-label="نوع الدخول" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
              <button type="button" aria-pressed={!isRegister} onClick={() => switchTo('login')}>
                تسجيل الدخول
              </button>
              <button type="button" aria-pressed={isRegister} onClick={() => switchTo('register')}>
                إنشاء حساب
              </button>
            </div>

            <form className="stack" style={{ gap: 16 }} onSubmit={submit} noValidate>
              <h2 className="h2">{isRegister ? 'انضم إلى GoExplore' : 'أهلاً بعودتك'}</h2>
              {formError && (
                <div className="alert err" role="alert">
                  {formError}
                </div>
              )}

              {isRegister ? (
                <>
                  <Field id="n" label="الاسم" error={errors.name}>
                    <input id="n" className={errors.name ? 'field err' : 'field'} placeholder="مثلاً: ليلى حدّاد" autoComplete="name" maxLength={100} value={form.name} onChange={update('name')} />
                  </Field>
                  <Field id="un" label="اسم المستخدم" error={errors.username}>
                    <input
                      id="un"
                      className={errors.username ? 'field err' : 'field'}
                      dir="ltr"
                      style={{ textAlign: 'right' }}
                      placeholder="layla.explores"
                      autoComplete="username"
                      maxLength={30}
                      spellCheck={false}
                      autoCapitalize="none"
                      value={form.username}
                      onChange={update('username')}
                    />
                  </Field>
                  <Field id="e" label="البريد الإلكتروني" error={errors.email}>
                    <input id="e" className={errors.email ? 'field err' : 'field'} type="email" dir="ltr" style={{ textAlign: 'right' }} placeholder="name@example.com" autoComplete="email" value={form.email} onChange={update('email')} />
                  </Field>
                  <Field id="np" label="كلمة المرور" error={errors.password} help="8 أحرف على الأقل.">
                    <input id="np" className={errors.password ? 'field err' : 'field'} type="password" autoComplete="new-password" value={form.password} onChange={update('password')} />
                  </Field>
                  <button type="submit" className="st red wide" style={submitStyle} disabled={submitting} aria-busy={submitting}>
                    {submitting ? 'جارٍ إنشاء الحساب…' : 'إنشاء حساب'}
                  </button>
                </>
              ) : (
                <>
                  <Field id="u" label="البريد الإلكتروني أو اسم المستخدم" error={errors.login}>
                    <input id="u" className={errors.login ? 'field err' : 'field'} dir="ltr" style={{ textAlign: 'right' }} autoComplete="username" spellCheck={false} autoCapitalize="none" value={form.login} onChange={update('login')} />
                  </Field>
                  <div>
                    <div className="between" style={{ marginBottom: 6 }}>
                      <label className="lb" htmlFor="p" style={{ margin: 0 }}>
                        كلمة المرور
                      </label>
                      <Link className="link small" to="/login">
                        نسيت كلمة المرور؟
                      </Link>
                    </div>
                    <input id="p" className={errors.password ? 'field err' : 'field'} type="password" autoComplete="current-password" value={form.password} onChange={update('password')} />
                    {errors.password && <p className="help err">{errors.password}</p>}
                  </div>
                  <label className="remember" htmlFor="rm">
                    <input id="rm" type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                    <span className="box" aria-hidden="true">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12.5l4.5 4.5L19 7.5" />
                      </svg>
                    </span>
                    <span>تذكّرني</span>
                  </label>
                  <button type="submit" className="st grn wide" style={submitStyle} disabled={submitting} aria-busy={submitting}>
                    {submitting ? 'جارٍ تسجيل الدخول…' : 'تسجيل الدخول'}
                  </button>
                </>
              )}
            </form>
          </div>
        </section>
      </div>
    </div>
  )
}
