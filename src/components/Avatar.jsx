import { userByName } from '../data/users'
import Photo from './Photo'

/**
 * Round user avatar (`.uav`): a photo when given (or the user's own photo), otherwise the
 * initial on the user's colour. Pass photo={null} to force the initial.
 */
export default function Avatar({ user, username, size = 's36', photo, className = '', style }) {
  const u = user ?? userByName(username) ?? { initial: username?.[0] ?? '?', color: '#56653A' }
  const img = photo === undefined ? u.photo : photo
  return (
    <span
      className={`uav ${size} ${className}`.trim()}
      style={{ background: img ? 'rgb(231, 220, 201)' : u.color, ...style }}
    >
      {img ? <Photo img={img} /> : u.initial}
    </span>
  )
}
