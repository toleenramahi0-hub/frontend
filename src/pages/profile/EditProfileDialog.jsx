import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Avatar from '../../components/Avatar'
import Icon from '../../components/Icon'
import Overlay from '../../components/Overlay'
import { useCurrentProfile } from '../../context/useCurrentProfile'
import { setValue, useValue } from '../../services/interactions'
import { USERNAME_RE, messages } from '../../utils/validation'

const USERNAME_COOLDOWN_DAYS = 14
const BIO_MAX = 150
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const IMAGE_MAX_MB = 5

const fmtDate = (ms) => new Date(ms).toLocaleDateString('ar', { day: 'numeric', month: 'long' })

/**
 * Edit profile (UC-U06): display name (UC-U08), username with a 14-day cooldown (UC-U07),
 * profile image (UC-U09), bio (UC-U10) and account privacy. Changes are kept locally
 * until the profile API exists.
 */
export default function EditProfileDialog() {
  const navigate = useNavigate()
  const me = useCurrentProfile()
  const edits = useValue('profileEdits', 'me') ?? {}
  const fileRef = useRef(null)

  const [form, setForm] = useState({
    name: me.name,
    username: me.username,
    role: me.role ?? '',
    bio: me.bio ?? '',
    private: !!me.private,
    photo: me.photo,
  })
  const [errors, setErrors] = useState({})
  const [saved, setSaved] = useState(false)

  const close = () => navigate('/me')
  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    setErrors(({ [field]: _drop, ...rest }) => rest)
    setSaved(false)
  }

  const lastChange = edits.usernameChangedAt
  const nextChange = lastChange ? lastChange + USERNAME_COOLDOWN_DAYS * 864e5 : 0
  const usernameLocked = nextChange > Date.now()

  function pickImage(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return // UC-U09 A4: cancelled, nothing changes
    if (!IMAGE_TYPES.includes(file.type) || file.size > IMAGE_MAX_MB * 1024 * 1024) {
      setErrors((er) => ({ ...er, photo: `اختر صورة JPG أو PNG أو WebP حجمها أقل من ${IMAGE_MAX_MB} ميغا.` }))
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setForm((f) => ({ ...f, photo: reader.result }))
      setErrors(({ photo: _drop, ...rest }) => rest)
    }
    reader.readAsDataURL(file)
  }

  function save(e) {
    e.preventDefault()
    const errs = {}
    const name = form.name.trim()
    if (name.length < 2) errs.name = messages.nameLength
    if (form.username !== me.username) {
      if (usernameLocked) errs.username = `بتقدر تغيّر اسم المستخدم مرة كل ${USERNAME_COOLDOWN_DAYS} يوم. التغيير الجاي بعد ${fmtDate(nextChange)}.`
      else if (!USERNAME_RE.test(form.username)) errs.username = messages.username
    }
    if (form.bio.length > BIO_MAX) errs.bio = `النبذة لازم تكون ${BIO_MAX} حرف أو أقل.`
    setErrors(errs)
    if (Object.keys(errs).length) return

    const changedUsername = form.username !== me.username
    setValue('profileEdits', 'me', {
      ...edits,
      name,
      username: form.username,
      role: form.role.trim(),
      bio: form.bio,
      private: form.private,
      photo: form.photo,
      ...(changedUsername && { usernameChangedAt: Date.now() }),
    })
    setSaved(true)
  }

  const preview = { ...me, photo: form.photo, initial: form.name.trim()[0] ?? me.initial }

  return (
    <Overlay label="تعديل الملف الشخصي" onClose={close}>
      <form className="sheet wide" onSubmit={save} noValidate>
        <div className="sh-h">
          <button type="button" className="ib" aria-label="إلغاء" onClick={close}>
            <Icon name="close" />
          </button>
          <h2>تعديل الملف الشخصي</h2>
          <button type="submit" className="st sm red">
            حفظ
          </button>
        </div>
        <div className="sh-body" style={{ gap: 14 }}>
          <div
            className="row"
            style={{ gap: 16, background: 'rgb(244, 236, 223)', borderRadius: 16, padding: 14, flexWrap: 'nowrap' }}
          >
            <Avatar user={preview} size="s96" style={{ width: 72, height: 72, fontSize: 28 }} />
            <span style={{ flex: '1 1 0%', lineHeight: 1.4 }}>
              <strong>{form.name || me.name}</strong>
              <br />
              <span className="small muted" dir="ltr">
                @{form.username}
              </span>
            </span>
            <button type="button" className="st sm grn" onClick={() => fileRef.current?.click()}>
              تغيير الصورة
            </button>
            <input ref={fileRef} type="file" accept={IMAGE_TYPES.join(',')} hidden onChange={pickImage} />
          </div>
          {errors.photo && <p className="help err" role="alert">{errors.photo}</p>}
          <div>
            <label className="lb" htmlFor="ed-n" style={{ fontSize: 14 }}>
              الاسم
            </label>
            <input id="ed-n" className={errors.name ? 'field err' : 'field'} dir="rtl" value={form.name} onChange={set('name')} maxLength={100} style={{ minHeight: 46 }} />
            {errors.name && <p className="help err">{errors.name}</p>}
          </div>
          <div>
            <label className="lb" htmlFor="ed-u" style={{ fontSize: 14 }}>
              اسم المستخدم
            </label>
            <input id="ed-u" className={errors.username ? 'field err' : 'field'} dir="ltr" value={form.username} onChange={set('username')} maxLength={30} spellCheck={false} autoCapitalize="none" style={{ minHeight: 46 }} />
            {errors.username ? (
              <p className="help err">{errors.username}</p>
            ) : (
              usernameLocked && <p className="help">التغيير الجاي متاح بعد {fmtDate(nextChange)}.</p>
            )}
          </div>
          <div>
            <label className="lb" htmlFor="ed-c" style={{ fontSize: 14 }}>
              التصنيف
            </label>
            <input id="ed-c" className="field" dir="rtl" placeholder="مثلاً: مستكشف محلي" value={form.role} onChange={set('role')} maxLength={60} style={{ minHeight: 46 }} />
          </div>
          <div>
            <label className="lb" htmlFor="ed-b" style={{ fontSize: 14 }}>
              النبذة
            </label>
            <textarea id="ed-b" className={errors.bio ? 'field err' : 'field'} rows="4" placeholder="احكي عن حالك بسطرين…" value={form.bio} onChange={set('bio')} />
            <p className={errors.bio ? 'help err' : 'help'}>{errors.bio ?? `${form.bio.length}/${BIO_MAX}`}</p>
          </div>
          <button
            type="button"
            className="setrow"
            role="switch"
            aria-checked={form.private}
            style={{ borderTop: '1px solid rgb(239, 227, 207)' }}
            onClick={() => setForm((f) => ({ ...f, private: !f.private }))}
          >
            <span style={{ flex: '1 1 0%', lineHeight: 1.4 }}>
              <strong>حساب خاص</strong>
              <br />
              <span className="xs muted">بس متابعينك بيشوفوا منشوراتك</span>
            </span>
            <span className="sw" aria-checked={form.private}>
              <i />
            </span>
          </button>
          {saved && (
            <div className="alert tip" role="status">
              ✓ انحفظت التغييرات
            </div>
          )}
          <button type="submit" className="st grn wide">
            حفظ التغييرات
          </button>
        </div>
      </form>
    </Overlay>
  )
}
