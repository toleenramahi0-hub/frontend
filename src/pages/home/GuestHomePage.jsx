import { Link, Navigate, useNavigate } from 'react-router-dom'
import AppShell from '../../components/AppShell'
import Icon from '../../components/Icon'
import PlaceStrip from '../../components/PlaceStrip'
import PostCard from '../../components/PostCard'
import { useAuth } from '../../context/useAuth'
import { HIGHLIGHTS } from '../../data/places'
import { TRENDING } from '../../data/posts'

/** Visitor home (UC-SR-02 for visitors): public trending posts and calls to sign in. */
export default function GuestHomePage() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  if (isAuthenticated) return <Navigate to="/home" replace />

  // Protected interactions send the visitor to sign in (UC-SR-02 A4).
  const requireAuth = () => navigate('/login')

  return (
    <AppShell page="GuestHome" nav="home" guest>
      <div style={{ background: 'rgb(247, 235, 210)', borderBottom: '1px dashed rgb(217, 183, 122)', color: 'rgb(94, 66, 20)' }}>
        <div
          style={{
            maxWidth: 1240,
            margin: '0 auto',
            padding: '10px clamp(14px, 3vw, 32px)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          <Icon name="user" />
          <span style={{ flex: '1 1 260px', fontSize: 14.5 }}>
            <b>إنت بتتصفّح كزائر.</b>
            {' سجّل دخولك عشان تتابع الناس، تعلّق، تحفظ الأماكن وتنشر.'}
          </span>
          <Link to="/login" className="st sm grn wtxt">
            تسجيل الدخول
          </Link>
          <Link to="/register" className="st sm red wtxt">
            إنشاء حساب
          </Link>
        </div>
      </div>
      <div className="page route ig">
        <div className="feedgrid">
          <div className="igcol">
            <PlaceStrip ids={HIGHLIGHTS} guest onRequireAuth={requireAuth} />
            <section aria-label="آخر المنشورات" className="igfeed">
              <div className="between" style={{ padding: '6px 4px 2px', alignItems: 'flex-end' }}>
                <span>
                  <strong style={{ fontSize: 18 }}>منشورات رائجة 🔥</strong>
                  <br />
                  <span className="xs muted">الأكثر تفاعلاً هالأسبوع من حسابات عامة</span>
                </span>
              </div>
              {TRENDING.map((post) => (
                <PostCard key={post.id} post={post} guest onRequireAuth={requireAuth} />
              ))}
              <div
                className="side-card"
                style={{
                  alignItems: 'center',
                  textAlign: 'center',
                  padding: '24px 18px',
                  background: '#FBF6EE',
                  border: '1.5px dashed #D5C4AA',
                  borderRadius: 18,
                }}
              >
                <strong style={{ fontSize: 17 }}>بدك تشوف أكثر؟</strong>
                <span className="small muted">سجّل دخولك عشان تشوف كل المنشورات وتتابع الناس.</span>
                <div className="row" style={{ gap: 10, justifyContent: 'center', marginTop: 6 }}>
                  <Link to="/login" className="st grn" style={{ color: '#fff' }}>
                    تسجيل الدخول
                  </Link>
                  <Link to="/register" className="st red" style={{ color: '#fff' }}>
                    إنشاء حساب
                  </Link>
                </div>
              </div>
              <div className="ownercta">
                <span className="oic" aria-hidden="true">
                  <Icon name="store" />
                </span>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <strong style={{ fontSize: 17, color: '#FFF6EA' }}>عندك محل أو مكان بنابلس؟</strong>
                  <br />
                  <span className="small" style={{ color: '#D8CDBA' }}>
                    ادخل كصاحب نشاط وأدِر صفحة مكانك، عروضك وردود التقييمات.
                  </span>
                </div>
                <Link to="/business/login" className="st gld" style={{ whiteSpace: 'nowrap' }}>
                  دخول أصحاب الأنشطة ←
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
