import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import AppShell, { BackBar } from '../../components/AppShell'
import Avatar from '../../components/Avatar'
import Photo from '../../components/Photo'
import { profilePath } from '../../components/PostCard'
import { useToggle } from '../../services/interactions'

const clock = (pos, scale) => ({ src: '/assets/images/nablus-clock-tower.jpg', pos, scale })
const garden = (pos, scale) => ({ src: '/assets/images/nablus-garden.jpg', pos, scale })

// Social notifications (UC-SR-15). `thumb` links to the related post; `follow` offers follow-back.
const GROUPS = [
  {
    title: 'اليوم',
    items: [
      { user: 'nour.travels', photo: garden('90% 22%', 1.8), text: 'بلّش يتابعك.', ago: '2 د', follow: true },
      { user: 'sara.y', photo: clock('72% 26%', 2.2), text: 'و12 آخرين أعجبهم منشورك.', ago: '15 د', thumb: clock('48% 16%', 2.6), post: 'f3' },
      { user: 'ahmad.kh', photo: clock('50% 20%', 1.6), text: 'علّق: وين هاد بالزبط؟', ago: '1 س', thumb: clock('90% 78%', 2.4), post: 'f3' },
      { user: 'majd.walks', photo: clock('10% 55%', 2.1), text: 'بلّش يتابعك.', ago: '3 س', follow: true },
    ],
  },
  {
    title: 'هذا الأسبوع',
    items: [
      { user: 'hala.food', photo: '/img/ph/sw_kunafa.jpg', text: 'أعجبها دليلك للكنافة.', ago: '2 ي', thumb: '/img/ph/sw_kunafa.jpg', post: 'f8' },
      { user: 'tariq.photo', photo: garden('55% 36%', 3), text: 'ذكرك بتعليق.', ago: '4 ي', thumb: garden('55% 36%', 3), post: 'f12' },
    ],
  },
]

function FollowBack({ username }) {
  const [on, toggle] = useToggle('following', username)
  return (
    <button type="button" className={on ? 'st sm crm' : 'st sm red'} onClick={toggle}>
      {on ? 'متابَع' : 'متابعة بالمثل'}
    </button>
  )
}

export default function NotificationsPage() {
  return (
    <AppShell page="Notifications" badges={{ inbox: 3, notifications: 0 }}>
      <BackBar />
      <div className="page route" style={{ gap: 14, maxWidth: 720 }}>
        <h1 className="h2">الإشعارات</h1>
        {GROUPS.map((g) => (
          <Fragment key={g.title}>
            <strong style={{ marginTop: 10 }}>{g.title}</strong>
            {g.items.map((n) => (
              <div
                key={n.user + n.ago}
                className="urow card"
                style={{ padding: '10px 14px', animation: '0.4s ease 0s 1 normal both running ge-up' }}
              >
                <Link to={profilePath(n.user)} className="tbtn">
                  <Avatar username={n.user} photo={n.photo} size="" />
                </Link>
                <span style={{ flex: '1 1 0%', minWidth: 0, fontSize: 14.5, lineHeight: 1.55 }}>
                  <Link to={profilePath(n.user)} className="ulink">
                    {n.user}
                  </Link>{' '}
                  <span>{n.text}</span> <span className="muted xs">{n.ago}</span>
                </span>
                {n.follow && <FollowBack username={n.user} />}
                {n.thumb && (
                  <Link
                    to={`/post/${n.post}`}
                    className="tile sq"
                    aria-label="فتح"
                    style={{ width: 48, height: 48, borderRadius: 8, flex: '0 0 auto', animation: 'none' }}
                  >
                    <Photo img={n.thumb} />
                  </Link>
                )}
              </div>
            ))}
          </Fragment>
        ))}
      </div>
    </AppShell>
  )
}
