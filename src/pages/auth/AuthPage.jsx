import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import Logo from '../../components/Logo'
import Switch from '../../components/Switch'
import TextField from '../../components/TextField'
import { AtIcon, EyeIcon, LockIcon, MailIcon, UserIcon } from '../../components/icons'
import { useAuth } from '../../context/useAuth'
import { messages, validateLogin, validateRegister } from '../../utils/validation'
import background from '../../assets/old-city-alley.jpg'
import './AuthPage.css'

const copy = {
  login: {
    title: 'تسجيل الدخول',
    subtitle: 'مرحباً بعودتك، سعداء برؤيتك مجدداً',
    submit: 'تسجيل الدخول',
    submitting: 'جارٍ تسجيل الدخول…',
    google: 'تسجيل الدخول باستخدام Google',
    facebook: 'تسجيل الدخول باستخدام Facebook',
    switchText: 'ليس لديك حساب؟',
    switchLink: 'إنشاء حساب جديد',
    switchTo: '/register',
  },
  register: {
    title: 'إنشاء حساب جديد',
    subtitle: 'انضم إلى مجتمع GoExplore وابدأ رحلتك',
    submit: 'إنشاء حساب',
    submitting: 'جارٍ إنشاء الحساب…',
    google: 'التسجيل باستخدام Google',
    facebook: 'التسجيل باستخدام Facebook',
    switchText: 'لديك حساب بالفعل؟',
    switchLink: 'تسجيل الدخول',
    switchTo: '/login',
  },
}

const emptyForm = { name: '', username: '', email: '', login: '', password: '', passwordConfirmation: '' }

// Server field names (Laravel snake_case) → form field names.
const serverFieldMap = { password_confirmation: 'passwordConfirmation' }
// Known server error codes → Arabic messages; anything else is shown as sent.
const serverMessageMap = { username_taken: messages.usernameTaken, email_taken: messages.emailTaken }

function formErrorFor(err, mode) {
  if (err.status === 0) return 'تعذّر الاتصال بالخادم. تحقق من اتصالك وحاول مرة أخرى.'
  if (mode === 'login' && (err.status === 401 || err.status === 422)) {
    // UC-U02 A1: generic message, never reveal which field was wrong.
    return 'البريد الإلكتروني أو اسم المستخدم أو كلمة المرور غير صحيحة.'
  }
  if (err.status === 403) return 'لا يمكن الدخول إلى هذا الحساب حالياً. تواصل مع الدعم الفني.'
  if (err.status === 429) return 'محاولات كثيرة. انتظر قليلاً ثم حاول مرة أخرى.'
  return mode === 'login'
    ? 'تعذّر تسجيل الدخول في الوقت الحالي. حاول مرة أخرى لاحقاً.'
    : 'تعذّر إنشاء الحساب في الوقت الحالي. حاول مرة أخرى لاحقاً.'
}

export default function AuthPage({ mode }) {
  const t = copy[mode]
  const isRegister = mode === 'register'
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, login, register } = useAuth()

  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [notice, setNotice] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [lastMode, setLastMode] = useState(mode)

  // Reset transient UI when switching between /login and /register.
  if (lastMode !== mode) {
    setLastMode(mode)
    setErrors({})
    setFormError('')
    setNotice('')
    setShowPassword(false)
  }

  if (isAuthenticated && !submitting) {
    return <Navigate to="/home" replace />
  }

  const update = (field) => (e) => {
    const value = e.target.value
    setForm((f) => ({ ...f, [field]: value }))
    if (errors[field]) setErrors(({ [field]: _removed, ...rest }) => rest)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setFormError('')
    setNotice('')

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
          password_confirmation: form.passwordConfirmation,
        })
        navigate('/onboarding', { replace: true })
      } else {
        await login({ login: form.login.trim(), password: form.password, remember })
        navigate(location.state?.from?.pathname || '/home', { replace: true })
      }
    } catch (err) {
      setSubmitting(false)
      const fieldErrors = Object.fromEntries(
        Object.entries(err.fields || {}).map(([key, msg]) => [serverFieldMap[key] || key, serverMessageMap[msg] || msg]),
      )
      if (isRegister && Object.keys(fieldErrors).length) {
        setErrors(fieldErrors) // UC-U01 A1–A3
      } else {
        setFormError(formErrorFor(err, mode))
      }
    }
  }

  function handleSocial(provider) {
    // OAuth needs the backend (Laravel Socialite) redirect endpoint; wire it up once it exists.
    setFormError('')
    setNotice(`تسجيل الدخول عبر ${provider} غير متاح بعد. استخدم البريد الإلكتروني وكلمة المرور حالياً.`)
  }

  const passwordToggle = (
    <button
      type="button"
      className="gx-field__icon-btn"
      onClick={() => setShowPassword((v) => !v)}
      aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
      aria-pressed={showPassword}
    >
      <EyeIcon off={showPassword} />
    </button>
  )

  return (
    <div className="auth">
      <img className="auth__bg" src={background} alt="زقاق حجري بأقواس ودرج في البلدة القديمة" />

      <div className="auth__wrap">
        <Logo className="auth__logo" />

        <div className="auth__center">
          <section className="auth__card" aria-labelledby="auth-title">
            <header className="auth__header">
              <h1 id="auth-title" className="auth__title">
                {t.title}
              </h1>
              <p className="auth__subtitle">{t.subtitle}</p>
            </header>

            {formError && (
              <div className="auth__alert auth__alert--error" role="alert">
                {formError}
              </div>
            )}
            {notice && (
              <div className="auth__alert auth__alert--info" role="status">
                {notice}
              </div>
            )}

            <form className="auth__form" onSubmit={handleSubmit} noValidate>
              {isRegister && (
                <>
                  <TextField
                    label="الاسم الكامل"
                    icon={<UserIcon />}
                    autoComplete="name"
                    value={form.name}
                    onChange={update('name')}
                    error={errors.name}
                    maxLength={100}
                  />
                  <TextField
                    label="اسم المستخدم"
                    icon={<AtIcon />}
                    autoComplete="username"
                    dir="ltr"
                    className="auth__ltr-field"
                    value={form.username}
                    onChange={update('username')}
                    error={errors.username}
                    maxLength={30}
                    spellCheck={false}
                    autoCapitalize="none"
                  />
                  <TextField
                    label="البريد الإلكتروني"
                    icon={<MailIcon />}
                    type="email"
                    autoComplete="email"
                    dir="ltr"
                    className="auth__ltr-field"
                    value={form.email}
                    onChange={update('email')}
                    error={errors.email}
                  />
                </>
              )}

              {!isRegister && (
                <TextField
                  label="البريد الإلكتروني أو اسم المستخدم"
                  icon={<MailIcon />}
                  autoComplete="username"
                  value={form.login}
                  onChange={update('login')}
                  error={errors.login}
                  spellCheck={false}
                  autoCapitalize="none"
                />
              )}

              <TextField
                label="كلمة المرور"
                icon={<LockIcon />}
                type={showPassword ? 'text' : 'password'}
                autoComplete={isRegister ? 'new-password' : 'current-password'}
                value={form.password}
                onChange={update('password')}
                error={errors.password}
                trailing={passwordToggle}
              />

              {isRegister && (
                <TextField
                  label="تأكيد كلمة المرور"
                  icon={<LockIcon />}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={form.passwordConfirmation}
                  onChange={update('passwordConfirmation')}
                  error={errors.passwordConfirmation}
                />
              )}

              {!isRegister && (
                <div className="auth__row">
                  <Switch checked={remember} onChange={setRemember}>
                    تذكرني
                  </Switch>
                  <Link to="/forgot-password" className="auth__forgot">
                    نسيت كلمة المرور؟
                  </Link>
                </div>
              )}

              <button type="submit" className="auth__submit" disabled={submitting} aria-busy={submitting}>
                {submitting ? t.submitting : t.submit}
              </button>
            </form>

            <div className="auth__divider">
              <span />
              أو
              <span />
            </div>

            <button type="button" className="auth__social" onClick={() => handleSocial('Google')}>
              <span aria-hidden="true" className="auth__social-badge auth__social-badge--outline">
                G
              </span>
              {t.google}
            </button>
            <button type="button" className="auth__social" onClick={() => handleSocial('Facebook')}>
              <span aria-hidden="true" className="auth__social-badge auth__social-badge--solid">
                f
              </span>
              {t.facebook}
            </button>

            <p className="auth__switch">
              {t.switchText}{' '}
              <Link to={t.switchTo} replace className="auth__switch-link">
                {t.switchLink}
              </Link>
            </p>
            <Link to="/home" className="auth__guest">
              متابعة التصفح بدون حساب
            </Link>
          </section>
        </div>
      </div>
    </div>
  )
}
