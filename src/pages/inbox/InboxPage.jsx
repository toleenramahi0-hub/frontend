import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import AppShell, { BackBar } from '../../components/AppShell'
import Avatar from '../../components/Avatar'
import Icon from '../../components/Icon'
import Photo from '../../components/Photo'
import { profilePath } from '../../components/PostCard'
import { useCurrentProfile } from '../../context/useCurrentProfile'
import { userByName } from '../../data/users'
import { appendTo, useMap } from '../../services/interactions'

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

// Last-message preview for the conversation list.
function preview(m) {
  if (!m) return 'ابدأ المحادثة'
  const text = m.reaction ? `تفاعل على القصة ${m.reaction}` : m.shared ? 'بعت قصة' : m.story ? `رد على القصة: ${m.text}` : m.text
  return m.from === 'me' ? `إنت: ${text}` : text
}

/** One message; story replies and reactions show the story they answer, like Instagram. */
function Message({ m, them }) {
  if (!m.story) return <div className={`msg ${m.from}`}>{m.text}</div>
  const label = m.shared ? `بعتت قصة ${m.story.owner}` : m.reaction ? 'تفاعلت على قصته' : 'رديت على قصته'
  return (
    <div className="dmstory">
      <span className="xs muted">{m.from === 'me' ? label : `${them} ${label}`}</span>
      <Link to={`/story/${m.story.owner}`} className="dmstory-im" aria-label="فتح القصة">
        <Photo img={m.story.img} />
      </Link>
      {m.reaction ? <span className="dmstory-r">{m.reaction}</span> : m.text && <div className={`msg ${m.from}`}>{m.text}</div>}
    </div>
  )
}

/** Direct messages: notes row, conversation list and the open thread. */
export default function InboxPage() {
  const me = useCurrentProfile()
  const [params] = useSearchParams()
  const sent = useMap('dms') // messages sent from this browser: replies, story replies, shared stories
  const [base, setBase] = useState(() => {
    const to = params.get('to')
    return to && !INITIAL_THREADS[to] ? { [to]: { unread: false, messages: [] }, ...INITIAL_THREADS } : INITIAL_THREADS
  })
  const threads = Object.fromEntries(
    [...new Set([...Object.keys(sent), ...Object.keys(base)])].map((u) => {
      const t = base[u] ?? { unread: false, messages: [] }
      return [u, { ...t, messages: [...t.messages, ...(sent[u] ?? [])] }]
    }),
  )
  const [active, setActive] = useState(params.get('to') ?? 'sara.y')
  const [filter, setFilter] = useState('')
  const [draft, setDraft] = useState('')
  const msgsRef = useRef(null)

  useEffect(() => {
    msgsRef.current?.scrollTo({ top: msgsRef.current.scrollHeight })
  }, [active, sent])

  const unreadCount = Object.values(threads).filter((t) => t.unread).length

  function open(username) {
    setActive(username)
    setBase((t) => (t[username] ? { ...t, [username]: { ...t[username], unread: false } } : t))
  }

  function send(e) {
    e.preventDefault()
    const text = draft.trim()
    if (!text) return
    appendTo('dms', active, { from: 'me', text, at: Date.now() })
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
                      {preview(last)}
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
                <Message key={i} m={m} them={current.name} />
              ))}
            </div>
            <form className="cin" onSubmit={send}>
              <label htmlFor="dmin" className="sr">
                رسالة
              </label>
              <input id="dmin" placeholder="اكتب رسالة…" autoComplete="off" value={draft} onChange={(e) => setDraft(e.target.value)} />
              <button type="submit" className="st sm red" disabled={!draft.trim()}>
                إرسال
              </button>
            </form>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
