import { Link } from 'react-router-dom'
import Avatar from './Avatar'
import Icon from './Icon'

const label = (text) => <span style={{ position: 'relative' }}>{text}</span>
const iconStyle = { position: 'relative' }

/** Bottom navigation shown on phones (`.mdock` is hidden on wider screens by app-theme.css). */
export default function MobileDock({ active, me, inboxBadge = 3 }) {
  const cls = (id) => (active === id ? 'on' : '')

  if (!me) {
    return (
      <div className="mdock">
        <nav className="dock" aria-label="التنقل">
          <Link to="/" className={cls('home')}>
            <Icon name="home" style={iconStyle} />
            {label('الرئيسية')}
          </Link>
          <Link to="/places" className={cls('places')}>
            <Icon name="pin" style={iconStyle} />
            {label('الأماكن')}
          </Link>
          <Link to="/map" className={cls('map')}>
            <Icon name="mapAlt" style={iconStyle} />
            {label('الخريطة')}
          </Link>
        </nav>
      </div>
    )
  }

  return (
    <div className="mdock">
      <nav className="dock" aria-label="التنقل">
        <Link to="/home" className={cls('home')}>
          <Icon name="home" style={iconStyle} />
          {label('الرئيسية')}
        </Link>
        <Link to="/places" className={cls('places')}>
          <Icon name="pin" style={iconStyle} />
          {label('الأماكن')}
        </Link>
        <Link to="/search" className={cls('search')}>
          <Icon name="search" style={iconStyle} />
          {label('بحث')}
        </Link>
        <Link to="/new-post">
          <Icon name="plusSquare" />
          نشر
        </Link>
        <Link to="/inbox" className={cls('inbox')}>
          <Icon name="send" style={iconStyle} />
          {inboxBadge > 0 && <span className="badge">{inboxBadge}</span>}
          {label('الرسائل')}
        </Link>
        <Link to="/me" className={cls('me')}>
          <Avatar user={me} size="dkav" />
          {label('ملفي')}
        </Link>
      </nav>
    </div>
  )
}
