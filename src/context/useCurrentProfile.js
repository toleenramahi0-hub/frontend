import { USERS } from '../data/users'
import { useValue } from '../services/interactions'
import { useAuth } from './useAuth'

/**
 * Profile of the signed-in user for display (avatar, name, stats…).
 * Demo accounts get their full profile from data/users; any other account is
 * shown with its own name and username and an empty profile. Local edits from the
 * edit-profile dialog are applied on top. null for visitors.
 */
export function useCurrentProfile() {
  const { user } = useAuth()
  const edits = useValue('profileEdits', 'me')
  if (!user) return null
  const base = baseProfile(user)
  if (!edits) return base
  const { usernameChangedAt: _t, ...changes } = edits
  return { ...base, ...changes, initial: changes.name?.trim()?.[0] ?? base.initial }
}

function baseProfile(user) {
  const known = USERS[user.username]
  if (known) return { ...known, email: user.email }
  return {
    username: user.username,
    name: user.name,
    initial: user.name?.trim()?.[0] ?? user.username[0],
    color: 'rgb(126, 21, 20)',
    email: user.email,
    bio: user.bio ?? '',
    stats: { posts: 0, followers: 0, following: 0 },
    highlights: [],
    grid: [],
    reviews: [],
  }
}
