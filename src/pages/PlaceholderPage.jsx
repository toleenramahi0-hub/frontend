import { Link } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import './PlaceholderPage.css'

// Temporary stand-in for screens whose designs haven't been delivered yet.
export default function PlaceholderPage({ title }) {
  const { user, logout } = useAuth()

  return (
    <main className="placeholder">
      <h1 className="placeholder__title">{title}</h1>
      <p className="placeholder__text">سيتم بناء هذه الصفحة عند استلام التصميم.</p>

      {user ? (
        <div className="placeholder__box">
          <p>
            مسجّل الدخول باسم <strong>{user.name}</strong> (<span dir="ltr">@{user.username}</span>)
          </p>
          <button type="button" className="placeholder__btn" onClick={logout}>
            تسجيل الخروج
          </button>
        </div>
      ) : (
        <div className="placeholder__box">
          <Link to="/login">تسجيل الدخول</Link> · <Link to="/register">إنشاء حساب</Link>
        </div>
      )}
    </main>
  )
}
