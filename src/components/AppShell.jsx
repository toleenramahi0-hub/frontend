import { Link, useNavigate } from 'react-router-dom'
import { useCurrentProfile } from '../context/useCurrentProfile'
import AppHeader from './AppHeader'
import Icon from './Icon'
import MobileDock from './MobileDock'

/**
 * Frame of every social-app screen: scoped page class (p-<page>, which selects that
 * screen's stylesheet), the header, the page body and the phone dock.
 */
export default function AppShell({ page, nav, dock, badges, guest, children, overlay }) {
  const me = useCurrentProfile()
  const isGuest = guest || !me
  return (
    <div className={`p-${page} th-app`}>
      <div
        className="ge pg gehost"
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'rgb(241, 232, 218)',
          overflowX: 'clip',
        }}
      >
        <AppHeader active={nav} guest={isGuest} badges={badges} />
        {children}
        <MobileDock active={dock ?? nav} me={isGuest ? null : me} inboxBadge={badges?.inbox ?? 3} />
        {overlay}
      </div>
    </div>
  )
}

/** "Back" arrow bar shown under the header on inner pages. */
export function BackBar({ to }) {
  const navigate = useNavigate()
  if (to) {
    return (
      <div className="backbar">
        <Link to={to} className="backbtn" aria-label="رجوع للصفحة اللي قبل">
          <Icon name="arrowRight" />
        </Link>
      </div>
    )
  }
  return (
    <div className="backbar">
      <button type="button" className="backbtn" aria-label="رجوع للصفحة اللي قبل" onClick={() => navigate(-1)}>
        <Icon name="arrowRight" />
      </button>
    </div>
  )
}
