import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import AppShell, { BackBar } from '../../components/AppShell'
import Avatar from '../../components/Avatar'
import Icon from '../../components/Icon'
import { profilePath } from '../../components/PostCard'
import { useCurrentProfile } from '../../context/useCurrentProfile'
import { userByName } from '../../data/users'

const clock = (pos, scale) => ({ src: '/assets/images/nablus-clock-tower.jpg', pos, scale })
const garden = (pos, scale) => ({ src: '/assets/images/nablus-garden.jpg', pos, scale })

const CONTACTS = {
  'sara.y': { name: 'سارة يوسف', photo: clock('72% 26%', 2.2), note: 'قهوة المسا ☕' },
  'ahmad.kh': { name: 'أحمد خليل', photo: clock('50% 20%', 1.6) },
  'nour.travels': { name: 'نور عودة', photo: garden('90% 22%', 1.8), note: 'جبل جرزيم الجمعة؟' },
}

const INITIAL_THREADS = {
  'sara.y': {
    unread: false,
    messages: [
      { from: 'them', text: 'شفت منشورك عن الكنافة، وين المحل بالزبط؟' },
      { from: 'me', text: 'بآخر سوق خان التجار، عاليمين' },
      { from: 'them', text: 'تمام بروح بكرا إن شاء الله' },
    ],
  },
  'ahmad.kh': { unread: true, messages: [{ from: 'them', text: 'جاي معنا مشوار الجمعة؟' }] },
  'nour.travels': { unread: true, messages: [{ from: 'them', text: 'شكراً كتير، رح أجربه' }] },
}

const contact = (username) => CONTACTS[username] ?? { name: userByName(username)?.name ?? username }

/** Direct messages: notes row, conversation list and the open thread. */
export default function InboxPage() {
  const me = useCurrentProfile()
  const [params] = useSearchParams()
  const [threads, setThreads] = useState(() => {
    const to = params.get('to')
    return to && !INITIAL_THREADS[to] ? { [to]: { unread: false, messages: [] }, ...INITIAL_THREADS } : INITIAL_THREADS
  })
  const [active, setActive] = useState(params.get('to') ?? 'sara.y')
  const [filter, setFilter] = useState('')
  const [draft, setDraft] = useState('')
  const msgsRef = useRef(null)

  useEffect(() => {
    msgsRef.current?.scrollTo({ top: msgsRef.current.scrollHeight })
  }, [active, threads])

  const unreadCount = Object.values(threads).filter((t) => t.unread).length

  function open(username) {
    setActive(username)
    setThreads((t) => ({ ...t, [username]: { ...t[username], unread: false } }))
  }

  function send(e) {
    e.preventDefault()
    const text = draft.trim()
    if (!text) return
    setThreads((t) => ({ ...t, [active]: { ...t[active], messages: [...t[active].messages, { from: 'me', text }] } }))
    setDraft('')
  }

  const list = Object.keys(threads).filter((u) => !filter || contact(u).name.includes(filter) || u.includes(filter))
  const current = contact(active)
  const thread = threads[active]

  return (
    <AppShell page="Inbox" dock="inbox" badges={{ inbox: unreadCount, notifications: 4 }}>
      <BackBar />
      <div className="page route dmpage" style={{ gap: 18 }}>
        <div className="inboxwrap has">
          <div className="list">
            <div className="dmtop">
              <h1 className="dmme" dir="ltr">
                {me.username}
              </h1>
              <Link to="/search" className="ib" aria-label="رسالة جديدة">
                <Icon name="edit" />
              </Link>
            </div>
            <div className="srbox dmsearch">
              <Icon name="search" className="ic sm" />
              <label htmlFor="dmq" className="sr">
                بحث
              </label>
              <input id="dmq" placeholder="بحث" autoComplete="off" value={filter} onChange={(e) => setFilter(e.target.value)} />
            </div>
            <div className="dmnotes">
              <Link to="/me" className="dmnote">
                <span className="dmbub">{me.note ?? 'شارك نوت…'}</span>
                <Avatar user={me} size="" />
                <small className="muted">نوتك</small>
              </Link>
              {Object.entries(CONTACTS)
                .filter(([, c]) => c.note)
                .map(([username, c]) => (
                  <button key={username} type="button" className="dmnote" onClick={() => open(username)}>
                    <span className="dmbub">{c.note}</span>
                    <Avatar username={username} photo={c.photo} size="" />
                    <small>{c.name}</small>
                  </button>
                ))}
            </div>
            <strong className="dmttl">الرسائل</strong>
            {list.map((username) => {
              const c = contact(username)
              const t = threads[username]
              const last = t.messages.at(-1)
              return (
                <button
                  key={username}
                  type="button"
                  className="mrow"
                  style={username === active ? { background: 'rgb(244, 236, 223)' } : undefined}
                  onClick={() => open(username)}
                >
                  <span className="dmav ring-on">
                    <Avatar username={username} photo={c.photo} size="" />
                  </span>
                  <span style={{ flex: '1 1 0%', minWidth: 0, lineHeight: 1.4 }}>
                    <span className={t.unread ? 'b' : ''} style={{ fontSize: 15 }}>
                      {c.name}
                    </span>
                    <br />
                    <span
                      className={t.unread ? 'small b' : 'small muted'}
                      style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    >
                      {last ? (last.from === 'me' ? `إنت: ${last.text}` : last.text) : 'ابدأ المحادثة'}
                    </span>
                  </span>
                  {t.unread && (
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgb(200, 70, 26)', flex: '0 0 auto' }} />
                  )}
                </button>
              )
            })}
          </div>
          <div className="thread">
            <div className="sh-h" style={{ justifyContent: 'flex-start', padding: '6px 12px' }}>
              <Link to="/home" className="ib" aria-label="رجوع">
                <Icon name="chevronRight" />
              </Link>
              <Link to={profilePath(active)} className="tbtn row" style={{ gap: 10, flexWrap: 'nowrap' }}>
                <Avatar username={active} photo={current.photo} />
                <span style={{ lineHeight: 1.3, textAlign: 'right' }}>
                  <strong>{current.name}</strong>
                  <br />
                  <span className="xs muted" dir="ltr">
                    @{active}
                  </span>
                </span>
              </Link>
            </div>
            <div className="msgs" ref={msgsRef}>
              {thread.messages.map((m, i) => (
                <div key={i} className={`msg ${m.from}`}>
                  {m.text}
                </div>
              ))}
            </div>
            <form className="cin" onSubmit={send}>
              <label htmlFor="dmin" className="sr">
                رسالة
              </label>
              <input id="dmin" placeholder="اكتب رسالة…" autoComplete="off" value={draft} onChange={(e) => setDraft(e.target.value)} />
              <button type="submit" className="post-btn" disabled={!draft.trim()}>
                إرسال
              </button>
            </form>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
