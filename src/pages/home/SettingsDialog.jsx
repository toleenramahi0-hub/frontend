import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Icon from '../../components/Icon'
import Overlay from '../../components/Overlay'
import { useAuth } from '../../context/useAuth'
import { useCurrentProfile } from '../../context/useCurrentProfile'
import { useList, useToggle } from '../../services/interactions'

function Row({ to, icon, label, value, onClick, className = 'serow' }) {
  const content = (
    <>
      {icon && <Icon name={icon} />}
      <span className="serow-t">{label}</span>
      {value && <span className="serow-v">{value}</span>}
      <Icon name="chevronLeft" />
    </>
  )
  return to ? (
    <Link to={to} className={className}>
      {content}
    </Link>
  ) : (
    <button type="button" className={className} onClick={onClick}>
      {content}
    </button>
  )
}

/** Settings & activity menu, including logout (UC-U03). */
export default function SettingsDialog() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const me = useCurrentProfile()
  const [activityOn, toggleActivity] = useToggle('settings', 'activity-status', true)
  const [loggingOut, setLoggingOut] = useState(false)
  const closeFriends = useList('closeFriends')
  const close = () => navigate(-1)

  async function signOut() {
    setLoggingOut(true)
    await logout() // clears the local session even if the server call fails (UC-U03 A1/A2)
    navigate('/login', { replace: true })
  }

  return (
    <Overlay label="الإعدادات" onClose={close}>
      <div className="sheet wide sesheet">
        <div className="sh-h">
          <button type="button" className="ib" aria-label="رجوع" onClick={close}>
            <Icon name="chevronRight" />
          </button>
          <h2>الإعدادات والنشاط</h2>
          <span style={{ width: 44 }} />
        </div>
        <div className="sh-body sebody">
          <section className="segrp">
            <h3 className="segrp-t">كيف بتستعمل جو إكسبلور</h3>
            <Row to="/saved" icon="bookmark" label="المحفوظات" />
            <Row to="/notifications" icon="heart" label="نشاطك" />
            <Row to="/notifications" icon="bell" label="تنبيهات الإشعارات" />
            <Row to="/preferences" icon="pin" label="تفضيلاتي للأماكن" />
          </section>
          <section className="segrp">
            <h3 className="segrp-t">مين بيشوف محتواك</h3>
            <Row to="/edit" icon="lock" label="خصوصية الحساب" value={me.private ? 'خاص' : 'عام'} />
            <Row to="/close-friends" icon="star" label="الأصدقاء المقربين" value={closeFriends.length ? String(closeFriends.length) : undefined} />
            <Row icon="userGear" label="حالة النشاط" value={activityOn ? 'شغّالة' : 'مطفية'} onClick={toggleActivity} />
          </section>
          <section className="segrp">
            <h3 className="segrp-t">حسابك</h3>
            <Row to="/edit" icon="pencil" label="تعديل الملف الشخصي" />
            <Row to="/edit" icon="camera" label="صورة الملف الشخصي" />
          </section>
          <section className="segrp">
            <h3 className="segrp-t">تسجيل الدخول</h3>
            <button type="button" className="serow bad" onClick={signOut} disabled={loggingOut}>
              <span className="serow-t">
                {loggingOut ? 'جارٍ تسجيل الخروج…' : 'تسجيل الخروج من '}
                {!loggingOut && <span dir="ltr">{me.username}</span>}
              </span>
            </button>
          </section>
        </div>
      </div>
    </Overlay>
  )
}
