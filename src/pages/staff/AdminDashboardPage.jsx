import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { CATEGORIES } from '../../data/categories'
import { placeById } from '../../data/places'
import { postById } from '../../data/posts'
import { setValue, useMap, useValue } from '../../services/interactions'
import { endStaffSession, getStaffSession } from '../../services/staffSession'
import DashboardHeader, { Kpi, navIcon, OVERVIEW_ICON, SectionTitle } from './DashboardHeader'
import { ACTIVITY, CATEGORY_STATS, KPIS, OWNER_REQUESTS, PLACE_REQUESTS, REPORTS, TICKETS, TRENDING, USERS } from './adminData'

const SECTIONS = [
  {
    id: 'overview',
    full: 'نظرة عامة',
    short: 'عامة',
    icon: OVERVIEW_ICON,
  },
  { id: 'reports', full: 'البلاغات', short: 'البلاغات', icon: navIcon(<path d="M5 21V4M5 4h11l-2 4 2 4H5" />) },
  {
    id: 'places',
    full: 'طلبات الأماكن',
    short: 'الأماكن',
    icon: navIcon(
      <>
        <path d="M12 21.5s-7.5-6.4-7.5-12a7.5 7.5 0 0 1 15 0c0 5.6-7.5 12-7.5 12z" />
        <circle cx="12" cy="9.5" r="2.6" />
      </>,
    ),
  },
  { id: 'owners', full: 'طلبات المالكين', short: 'المالكين', icon: navIcon(<path d="M4 10v10h16V10M3 10l2-6h14l2 6M3 10h18M9 20v-6h6v6" />) },
  {
    id: 'users',
    full: 'المستخدمون',
    short: 'الحسابات',
    icon: navIcon(
      <>
        <circle cx="9" cy="8" r="3.5" />
        <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6M16 4.5a3.5 3.5 0 0 1 0 7M18 14c2.2.6 3.5 2.8 3.5 6" />
      </>,
    ),
  },
  {
    id: 'cats',
    full: 'الفئات',
    short: 'الفئات',
    icon: navIcon(
      <>
        <circle cx="12" cy="12" r="8.5" strokeDasharray="2 2.2" />
        <path d="M8.5 12h7M12 8.5v7" />
      </>,
    ),
  },
  {
    id: 'support',
    full: 'الدعم',
    short: 'الدعم',
    icon: navIcon(
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6M12 17v.01" />
      </>,
    ),
  },
]

const status = (val, okText, badText) =>
  val ? { text: val === 'ok' ? okText : badText, cls: `tag ${val === 'ok' ? 'ok' : 'bad'}`, open: false } : { text: 'بانتظار', cls: 'tag warn', open: true }

/**
 * Admin dashboard: overview, content reports (UC-SR-07), place submissions (UC-PB-07),
 * business-owner requests (UC-PB-06), users, categories and support tickets.
 * Every decision is added to the audit log shown under "آخر النشاطات".
 */
export default function AdminDashboardPage() {
  const navigate = useNavigate()
  const session = getStaffSession()
  const [tab, setTab] = useState('overview')
  const [userQuery, setUserQuery] = useState('')
  const decisions = useValue('admin', 'decisions') ?? {}
  const audit = useValue('admin', 'audit') ?? []
  const userReports = useMap('reports')

  if (session?.role !== 'admin') return <Navigate to="/admin/login" replace />
  const adminName = 'منى'

  function decide(key, value, description) {
    setValue('admin', 'decisions', { ...decisions, [key]: value })
    setValue('admin', 'audit', [{ who: adminName, text: description, at: Date.now() }, ...audit])
  }

  // Reports filed by users from the post dialog join the seeded ones.
  const filed = Object.entries(userReports).map(([postId, r]) => {
    const post = postById(postId)
    return {
      key: `user-${postId}`,
      img: post ? (typeof post.images[0] === 'string' ? post.images[0] : post.images[0]?.src) : '/img/logo_pin.png',
      text: `منشور: "${post?.caption ?? postId}"`,
      user: post?.user ?? '—',
      reason: r.reason,
      count: 1,
    }
  })
  const reports = [...filed, ...REPORTS]

  const open = {
    reports: reports.filter((r) => !decisions[`rep-${r.key}`]).length,
    places: PLACE_REQUESTS.filter((p) => !decisions[`pl-${p.key}`]).length,
    owners: OWNER_REQUESTS.filter((o) => !decisions[`ow-${o.key}`]).length,
    support: TICKETS.filter((t) => !decisions[`tk-${t.id}`]).length,
  }

  function logout() {
    endStaffSession()
    navigate('/admin/login', { replace: true })
  }

  const users = USERS.filter((u) => !userQuery || u.username.includes(userQuery.trim().toLowerCase()))

  return (
    <div className="p-AdminDashboard th-site">
      <div className="ge" style={{ minHeight: '100vh', background: '#F1E8DA' }}>
        <DashboardHeader
          home="/admin"
          word="الإدارة"
          subtitle="لوحة تحكّم المشرفين"
          navLabel="أقسام الإدارة"
          sections={SECTIONS}
          tab={tab}
          onTab={setTab}
          counts={open}
          onLogout={logout}
          avatar={{ letter: 'م', title: 'منى (مشرفة)' }}
        />

        <main className="wrap adm">
          <div>
            {tab === 'overview' && (
              <>
                <SectionTitle kicker="لوحة الإدارة" title="نظرة عامة">
                  <span className="muted small">آخر تحديث: قبل دقيقتين</span>
                </SectionTitle>
                <div className="kpis">
                  {KPIS.map((k) => (
                    <Kpi key={k.label} {...k} />
                  ))}
                </div>
                <div className="two">
                  <section className="card pad">
                    <h2 className="h3">تحتاج انتباهك</h2>
                    <div style={{ marginTop: 10 }}>
                      {[
                        ['reports', 'بلاغات للمراجعة', 'منشورات وتعليقات أبلغ عنها المستخدمون'],
                        ['places', 'طلبات إضافة أماكن', 'أماكن جديدة بانتظار الموافقة'],
                        ['owners', 'طلبات المالكين', 'أصحاب أنشطة بدهم يديروا صفحة مكانهم'],
                        ['support', 'تذاكر الدعم', 'تذاكر مفتوحة من المستخدمين'],
                      ].map(([id, title, sub]) => (
                        <div key={id} className="att">
                          <span className="num">{open[id]}</span>
                          <div style={{ flex: 1 }}>
                            <b>{title}</b>
                            <br />
                            <span className="small muted">{sub}</span>
                          </div>
                          <button type="button" className="lnk" onClick={() => setTab(id)}>
                            فتح ←
                          </button>
                        </div>
                      ))}
                    </div>
                  </section>
                  <section className="card pad">
                    <h2 className="h3">آخر النشاطات</h2>
                    <div className="feed" style={{ marginTop: 10 }}>
                      {audit.slice(0, 5).map((a) => (
                        <div key={a.at}>
                          <span style={{ flex: 1 }}>
                            <b>{a.who}</b> {a.text}
                          </span>
                          <small>الآن</small>
                        </div>
                      ))}
                      {ACTIVITY.slice(0, Math.max(0, 5 - audit.length)).map((a) => (
                        <div key={a.when}>
                          <span style={{ flex: 1 }}>{a.text}</span>
                          <small>{a.when}</small>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
                <section className="card pad" style={{ marginTop: 18 }}>
                  <div className="between">
                    <h2 className="h3">الأماكن الأكثر رواجاً هالأسبوع</h2>
                    <Link to="/places" className="link small">
                      عرض بالتطبيق ←
                    </Link>
                  </div>
                  <div className="tw">
                    <table className="tbl" style={{ marginTop: 8 }}>
                      <thead>
                        <tr>
                          <th>المكان</th>
                          <th>الفئة</th>
                          <th>تقييم</th>
                          <th>زيارات موثّقة</th>
                          <th className="hide-sm">التفاعل</th>
                        </tr>
                      </thead>
                      <tbody>
                        {TRENDING.map(([id, engagement]) => {
                          const p = placeById(id)
                          return (
                            <tr key={id}>
                              <td>
                                <span className="who">
                                  <span className="thumb" style={{ width: 40, height: 40 }}>
                                    <img src={p.img} alt="" />
                                  </span>
                                  {p.name}
                                </span>
                              </td>
                              <td>
                                <span className="tag">{CATEGORIES.find((c) => c.id === p.category).label}</span>
                              </td>
                              <td>★ {p.rating.toFixed(1)}</td>
                              <td>{p.reviews}</td>
                              <td className="hide-sm">
                                <div className="bar" style={{ width: 140 }}>
                                  <i style={{ width: `${engagement}%` }} />
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </section>
              </>
            )}

            {tab === 'reports' && (
              <>
                <SectionTitle kicker="الإشراف على المحتوى" title="البلاغات">
                  <span className="tag bad">{open.reports} مفتوحة</span>
                </SectionTitle>
                <section className="card pad">
                  <div className="tw">
                    <table className="tbl">
                      <thead>
                        <tr>
                          <th>المحتوى</th>
                          <th>صاحبه</th>
                          <th>السبب</th>
                          <th className="hide-sm">بلاغات</th>
                          <th>الحالة</th>
                          <th>إجراء</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reports.map((r) => {
                          const st = status(decisions[`rep-${r.key}`], 'تم الإبقاء', 'تم الحذف')
                          return (
                            <tr key={r.key}>
                              <td>
                                <span className="who">
                                  <span className="thumb">
                                    <img src={r.img} alt="" />
                                  </span>
                                  <span style={{ fontWeight: 500 }}>{r.text}</span>
                                </span>
                              </td>
                              <td dir="ltr" style={{ textAlign: 'right', fontWeight: 700 }}>
                                {r.user}
                              </td>
                              <td>
                                <span className="tag warn">{r.reason}</span>
                              </td>
                              <td className="hide-sm">{r.count}</td>
                              <td>
                                <span className={st.cls}>{st.text}</span>
                              </td>
                              <td>
                                {st.open && (
                                  <div className="acts">
                                    <button type="button" className="st sm red" onClick={() => decide(`rep-${r.key}`, 'bad', `حذفت محتوى ${r.user} (${r.reason})`)}>
                                      حذف
                                    </button>
                                    <button type="button" className="st sm lnn" onClick={() => decide(`rep-${r.key}`, 'ok', `أبقت على محتوى ${r.user}`)}>
                                      إبقاء
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </section>
              </>
            )}

            {tab === 'places' && (
              <>
                <SectionTitle kicker="مراجعة الأماكن" title="طلبات إضافة أماكن">
                  <span className="tag warn">{open.places} بانتظار المراجعة</span>
                </SectionTitle>
                <div className="stack" style={{ gap: 14 }}>
                  {PLACE_REQUESTS.map((p) => {
                    const st = status(decisions[`pl-${p.key}`], 'تمت الموافقة', 'مرفوض')
                    return (
                      <section key={p.key} className="card pad" style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                        <span className="thumb" style={{ width: 92, height: 92, borderRadius: 14 }}>
                          <img src={p.img} alt="" />
                        </span>
                        <div style={{ flex: 1, minWidth: 220 }}>
                          <div className="row" style={{ gap: 8 }}>
                            <b style={{ fontSize: 18 }}>{p.name}</b>
                            <span className="tag">{p.category}</span>
                          </div>
                          <span className="small muted">
                            {p.area} · أرسله <b dir="ltr">{p.by}</b> · {p.when}
                          </span>
                          <p className="small" style={{ margin: '6px 0 0' }}>
                            {p.note}
                          </p>
                        </div>
                        <span className={st.cls}>{st.text}</span>
                        {st.open && (
                          <div className="acts">
                            <button type="button" className="st sm grn" onClick={() => decide(`pl-${p.key}`, 'ok', `وافقت على مكان ${p.name}`)}>
                              موافقة
                            </button>
                            <button type="button" className="st sm lnn" onClick={() => decide(`pl-${p.key}`, 'bad', `رفضت طلب مكان ${p.name}`)}>
                              رفض
                            </button>
                          </div>
                        )}
                      </section>
                    )
                  })}
                </div>
              </>
            )}

            {tab === 'owners' && (
              <>
                <SectionTitle kicker="توثيق الملكية" title="طلبات المالكين" />
                <section className="card pad">
                  <div className="tw">
                    <table className="tbl">
                      <thead>
                        <tr>
                          <th>صاحب الطلب</th>
                          <th>المكان</th>
                          <th className="hide-sm">الإثبات</th>
                          <th>الحالة</th>
                          <th>إجراء</th>
                        </tr>
                      </thead>
                      <tbody>
                        {OWNER_REQUESTS.map((o) => {
                          const st = status(decisions[`ow-${o.key}`], 'موثّق', 'مرفوض')
                          return (
                            <tr key={o.key}>
                              <td>
                                <b>{o.name}</b>
                                <br />
                                <span className="xs muted" dir="ltr">
                                  {o.phone}
                                </span>
                              </td>
                              <td>{o.place}</td>
                              <td className="hide-sm">
                                <span className="tag">{o.proof}</span>
                              </td>
                              <td>
                                <span className={st.cls}>{st.text}</span>
                              </td>
                              <td>
                                {st.open && (
                                  <div className="acts">
                                    <button type="button" className="st sm grn" onClick={() => decide(`ow-${o.key}`, 'ok', `وثّقت صاحب ${o.place}`)}>
                                      توثيق
                                    </button>
                                    <button type="button" className="st sm lnn" onClick={() => decide(`ow-${o.key}`, 'bad', `رفضت طلب ملكية ${o.place}`)}>
                                      رفض
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </section>
              </>
            )}

            {tab === 'users' && (
              <>
                <SectionTitle kicker="الحسابات" title="المستخدمون">
                  <label className="search">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <circle cx="11" cy="11" r="7" />
                      <path d="M20.5 20.5l-4.5-4.5" />
                    </svg>
                    <input placeholder="ابحث باسم المستخدم…" aria-label="بحث" value={userQuery} onChange={(e) => setUserQuery(e.target.value)} />
                  </label>
                </SectionTitle>
                <section className="card pad">
                  <div className="tw">
                    <table className="tbl">
                      <thead>
                        <tr>
                          <th>المستخدم</th>
                          <th>النوع</th>
                          <th className="hide-sm">منشورات</th>
                          <th>الحالة</th>
                          <th>إجراء</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u) => {
                          const key = `us-${u.username}`
                          const suspended = decisions[key] === undefined ? u.suspended : decisions[key] === 'bad'
                          return (
                            <tr key={u.username}>
                              <td>
                                <span className="who">
                                  <span className="av" style={{ background: u.color }}>
                                    {u.img ? <img src={u.img} alt="" /> : u.initial}
                                  </span>
                                  <span dir="ltr">{u.username}</span>
                                </span>
                              </td>
                              <td>{u.type}</td>
                              <td className="hide-sm">{u.posts}</td>
                              <td>
                                <span className={suspended ? 'tag bad' : 'tag ok'}>{suspended ? 'موقوف' : 'نشط'}</span>
                              </td>
                              <td>
                                <div className="acts">
                                  <Link to={`/u/${u.username}`} className="st sm lnn" style={{ textDecoration: 'none' }}>
                                    عرض
                                  </Link>
                                  {suspended ? (
                                    <button type="button" className="st sm grn" onClick={() => decide(key, 'ok', `فعّلت حساب ${u.username}`)}>
                                      تفعيل
                                    </button>
                                  ) : (
                                    <button type="button" className="st sm red" onClick={() => confirm(`إيقاف حساب ${u.username}؟`) && decide(key, 'bad', `أوقفت حساب ${u.username}`)}>
                                      إيقاف
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </section>
              </>
            )}

            {tab === 'cats' && (
              <>
                <SectionTitle kicker="المحتوى" title="الفئات">
                  <button type="button" className="st sm red" style={{ color: '#fff' }}>
                    + فئة جديدة
                  </button>
                </SectionTitle>
                <section className="card pad">
                  <div className="tw">
                    <table className="tbl">
                      <thead>
                        <tr>
                          <th>الفئة</th>
                          <th>الأماكن</th>
                          <th>زيارات الشهر</th>
                          <th className="hide-sm">الشعبية</th>
                          <th>إجراء</th>
                        </tr>
                      </thead>
                      <tbody>
                        {CATEGORIES.map((c) => {
                          const s = CATEGORY_STATS[c.id]
                          return (
                            <tr key={c.id}>
                              <td>
                                <span className="who">
                                  <span className="av" style={{ background: '#FBF6EE', color: '#7E1514', boxShadow: 'inset 0 0 0 1.5px #C9955A' }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                      {c.icon}
                                    </svg>
                                  </span>
                                  {c.label}
                                </span>
                              </td>
                              <td>{s.places}</td>
                              <td>{s.visits}</td>
                              <td className="hide-sm">
                                <div className="bar" style={{ width: 160 }}>
                                  <i style={{ width: `${s.popularity}%` }} />
                                </div>
                              </td>
                              <td>
                                <div className="acts">
                                  <Link to={`/category/${c.id}`} className="st sm lnn" style={{ textDecoration: 'none' }}>
                                    عرض
                                  </Link>
                                  <button type="button" className="st sm grn">
                                    تعديل
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </section>
              </>
            )}

            {tab === 'support' && (
              <>
                <SectionTitle kicker="خدمة المستخدمين" title="تذاكر الدعم">
                  <span className="tag warn">{open.support} مفتوحة</span>
                </SectionTitle>
                <div className="stack" style={{ gap: 12 }}>
                  {TICKETS.map((t) => {
                    const done = !!decisions[`tk-${t.id}`]
                    return (
                      <section key={t.id} className="card pad" style={{ display: 'flex', gap: 14, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                        <span className="num" style={{ fontSize: 15 }}>
                          #{t.id}
                        </span>
                        <div style={{ flex: 1, minWidth: 220 }}>
                          <b>{t.title}</b>
                          <br />
                          <span className="small muted">
                            <span dir="ltr">{t.user}</span> · {t.when}
                          </span>
                          <p className="small" style={{ margin: '6px 0 0' }}>
                            {t.body}
                          </p>
                        </div>
                        <span className={done ? 'tag ok' : 'tag warn'}>{done ? 'محلولة' : 'مفتوحة'}</span>
                        {!done && (
                          <button type="button" className="st sm grn" style={{ color: '#fff' }} onClick={() => decide(`tk-${t.id}`, 'ok', `أغلقت التذكرة #${t.id}`)}>
                            تم الحل
                          </button>
                        )}
                      </section>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
