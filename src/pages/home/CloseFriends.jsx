import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Avatar from '../../components/Avatar'
import Icon from '../../components/Icon'
import Overlay from '../../components/Overlay'
import { STORIES } from '../../data/posts'
import { userByName } from '../../data/users'
import { toggle, useList } from '../../services/interactions'

// People you can add (the accounts you follow).
const FOLLOWING = STORIES.map((s) => s.user)

export function StarBadge({ size = 22 }) {
  return (
    <span className="cfstar" style={{ width: size, height: size, fontSize: size * 0.55 }} aria-hidden="true">
      ★
    </span>
  )
}

/** Instagram-style close friends list: search, "your list" first, then suggestions, green ticks. */
export function CloseFriendsList({ onDone, doneLabel = 'تم' }) {
  const list = useList('closeFriends')
  const [q, setQ] = useState('')
  const match = (u) => !q.trim() || u.includes(q.trim()) || (userByName(u)?.name ?? '').includes(q.trim())
  const mine = FOLLOWING.filter((u) => list.includes(u) && match(u))
  const others = FOLLOWING.filter((u) => !list.includes(u) && match(u))

  const row = (u) => {
    const on = list.includes(u)
    return (
      <button key={u} type="button" className="cfrow" aria-pressed={on} onClick={() => toggle('closeFriends', u)}>
        <Avatar username={u} photo={null} size="s44" />
        <span className="cfrow-n">
          <b dir="ltr">{u}</b>
          <small>{userByName(u)?.name ?? ''}</small>
        </span>
        <span className={on ? 'cfchk on' : 'cfchk'} aria-hidden="true">
          {on && <Icon name="check" d="M5 12.5l4.5 4.5L19 7.5" size={16} />}
        </span>
      </button>
    )
  }

  return (
    <div className="cfl">
      <div className="cfl-intro">
        <StarBadge size={56} />
        <p>بس الأشخاص اللي بقائمتك بيقدروا يشوفوا القصص اللي بتشاركها مع الأصدقاء المقربين. ما حدا بيعرف إنك ضفته أو شلته.</p>
      </div>
      <div className="srbox cfl-search">
        <Icon name="search" className="ic sm" />
        <label htmlFor="cfq" className="sr">
          بحث
        </label>
        <input id="cfq" placeholder="بحث" autoComplete="off" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div className="cfl-body">
        {mine.length > 0 && (
          <>
            <strong className="cfl-h">قائمتك ({list.length})</strong>
            {mine.map(row)}
          </>
        )}
        {others.length > 0 && (
          <>
            <strong className="cfl-h">اقتراحات</strong>
            {others.map(row)}
          </>
        )}
        {!mine.length && !others.length && <p className="muted small" style={{ textAlign: 'center' }}>ما في نتائج</p>}
      </div>
      <div className="cfl-foot">
        <button type="button" className="st grn wide" onClick={onDone}>
          {doneLabel}
        </button>
      </div>
    </div>
  )
}

/** /close-friends — the list on its own, opened from settings. */
export default function CloseFriendsPage() {
  const navigate = useNavigate()
  const close = () => navigate(-1)
  return (
    <Overlay label="الأصدقاء المقربين" onClose={close}>
      <div className="sheet wide">
        <div className="sh-h">
          <button type="button" className="ib" aria-label="رجوع" onClick={close}>
            <Icon name="chevronRight" />
          </button>
          <h2>الأصدقاء المقربين</h2>
          <span style={{ width: 44 }} />
        </div>
        <CloseFriendsList onDone={close} />
      </div>
    </Overlay>
  )
}
