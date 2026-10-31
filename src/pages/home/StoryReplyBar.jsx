import { useEffect, useRef, useState } from 'react'
import Avatar from '../../components/Avatar'
import Icon from '../../components/Icon'
import { appendTo, useToggle } from '../../services/interactions'

export const QUICK_REACTIONS = ['😂', '😮', '😍', '😢', '👏', '🔥']
const SHARE_TO = ['sara.y', 'ahmad.kh', 'nour.travels', 'majd.walks']

/**
 * Reply bar under someone else's story: message field, quick reactions while it is focused,
 * like and share. Replies and reactions go to the DM thread with the story's owner.
 * `onBusy(true)` pauses the story while the user is replying, reacting or sharing.
 */
export default function StoryReplyBar({ who, img, onBusy }) {
  const [text, setText] = useState('')
  const [focused, setFocused] = useState(false)
  const [sharing, setSharing] = useState(false)
  const [sentTo, setSentTo] = useState([])
  const [burst, setBurst] = useState(null) // { key, content }
  const [toast, setToast] = useState('')
  const [liked, toggleLike] = useToggle('likedStories', who)
  const inputRef = useRef(null)
  const timers = useRef([])

  const reacting = focused && !text.trim()
  const busy = focused || sharing || Boolean(text.trim())

  useEffect(() => {
    onBusy(busy)
  }, [busy, onBusy])
  useEffect(() => () => onBusy(false), [onBusy])

  // A new story starts with a clean bar.
  useEffect(() => {
    setText('')
    setSharing(false)
    setSentTo([])
  }, [who])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  function flash(content, message) {
    setBurst({ key: Date.now(), content })
    if (message) setToast(message)
    timers.current.push(setTimeout(() => setBurst(null), 800))
    if (message) timers.current.push(setTimeout(() => setToast(''), 1400))
  }

  function sendDm(message) {
    appendTo('dms', who, { from: 'me', story: { img, owner: who }, at: Date.now(), ...message })
  }

  function react(emoji) {
    sendDm({ reaction: emoji })
    inputRef.current?.blur()
    flash(<span style={{ fontSize: 96 }}>{emoji}</span>, 'تم الإرسال')
  }

  function submit(e) {
    e.preventDefault()
    const value = text.trim()
    if (!value) return
    sendDm({ text: value })
    setText('')
    inputRef.current?.blur()
    setToast('تم الإرسال')
    timers.current.push(setTimeout(() => setToast(''), 1400))
  }

  function like() {
    if (!liked) flash(<Icon name="heart" className="ic fill" size={110} style={{ color: '#E0453A' }} />)
    toggleLike()
  }

  function shareTo(username) {
    if (sentTo.includes(username)) return
    appendTo('dms', username, { from: 'me', story: { img, owner: who }, shared: true, at: Date.now() })
    setSentTo((s) => [...s, username])
  }

  return (
    <>
      {reacting && (
        // mouseDown keeps focus in the field so the tap lands on the emoji
        <div className="stv-react" onMouseDown={(e) => e.preventDefault()}>
          <strong>ردود سريعة</strong>
          <div className="g6">
            {QUICK_REACTIONS.map((emoji, i) => (
              <button key={emoji} type="button" aria-label={`تفاعل ${emoji}`} style={{ animationDelay: `${i * 0.04}s` }} onClick={() => react(emoji)}>
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
      {burst && (
        <span key={burst.key} className="stv-burst" aria-hidden="true">
          {burst.content}
        </span>
      )}
      {toast && (
        <span className="stv-sent" role="status">
          {toast}
        </span>
      )}

      <form className="stv-bottom" onSubmit={submit}>
        <label htmlFor="stv-reply" className="sr">
          رد على القصة
        </label>
        <input
          ref={inputRef}
          id="stv-reply"
          className="stv-in"
          placeholder={`رد على ${who}…`}
          autoComplete="off"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => e.key === 'Escape' && (e.stopPropagation(), e.currentTarget.blur())}
        />
        {text.trim() ? (
          <button type="submit" className="stv-send">
            إرسال
          </button>
        ) : (
          <>
            <button type="button" className="ib" aria-label={liked ? 'إلغاء الإعجاب' : 'أعجبني'} aria-pressed={liked} onClick={like}>
              <Icon name="heart" className={liked ? 'ic fill' : 'ic'} style={liked ? { color: '#E0453A' } : undefined} />
            </button>
            <button type="button" className="ib" aria-label="مشاركة القصة" onClick={() => setSharing(true)}>
              <Icon name="send" />
            </button>
          </>
        )}
      </form>

      {sharing && (
        <div className="stv-panel" role="dialog" aria-label="مشاركة القصة">
          <div className="stv-sheet-t" style={{ display: 'flex', alignItems: 'center', padding: '12px 14px 6px' }}>
            <strong style={{ flex: 1 }}>إرسال إلى</strong>
            <button type="button" className="ib" aria-label="إغلاق" onClick={() => setSharing(false)}>
              <Icon name="close" />
            </button>
          </div>
          <div style={{ overflowY: 'auto', padding: '0 8px 12px' }}>
            {SHARE_TO.filter((u) => u !== who).map((u) => {
              const sent = sentTo.includes(u)
              return (
                <div key={u} className="stv-sheet-row" style={{ cursor: 'default' }}>
                  <Avatar username={u} photo={null} size="s32" />
                  <span dir="ltr" style={{ flex: 1, textAlign: 'right' }}>
                    {u}
                  </span>
                  <button type="button" className={sent ? 'st sm crm' : 'st sm red'} disabled={sent} onClick={() => shareTo(u)}>
                    {sent ? 'تم الإرسال' : 'إرسال'}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}
