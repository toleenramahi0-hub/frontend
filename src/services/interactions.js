/**
 * Likes, saves and follows made in this browser (UC-SR-04 like/unlike, UC-PB-04 save place,
 * follow). Kept in localStorage until the social API exists; each set holds ids, so the
 * same item can never be liked or saved twice.
 */
import { useSyncExternalStore } from 'react'

const KEY = 'gx_interactions'
const listeners = new Set()

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? {}
  } catch {
    return {}
  }
}

let state = load()

function emit() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // storage full or blocked: keep the in-memory state
  }
  listeners.forEach((fn) => fn())
}

export function toggle(kind, id) {
  const list = state[kind] ?? []
  state = { ...state, [kind]: list.includes(id) ? list.filter((x) => x !== id) : [...list, id] }
  emit()
}

const subscribe = (fn) => {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

/** [isOn, toggleFn] for one item, e.g. useToggle('likedPosts', post.id). */
export function useToggle(kind, id, initial = false) {
  const list = useSyncExternalStore(subscribe, () => state[kind])
  const on = list ? list.includes(id) !== initial : initial
  return [on, () => toggle(kind, id)]
}

// Formats "1,284" + delta for optimistic counters.
export function bump(count, delta) {
  const n = Number(String(count).replace(/,/g, '')) + delta
  return n.toLocaleString('en-US')
}

/** Stores one value per id, e.g. the user's current rating of a place (UC-PB-03: updated, never duplicated). */
export function setValue(kind, id, value) {
  state = { ...state, [kind]: { ...(state[kind] ?? {}), [id]: value } }
  emit()
}

export function useValue(kind, id) {
  return useSyncExternalStore(subscribe, () => state[kind]?.[id])
}

/** All ids in one set, e.g. useList('savedPlaces'). */
export function useList(kind) {
  return useSyncExternalStore(subscribe, () => state[kind]) ?? EMPTY
}
const EMPTY = []

/** Every stored value of one kind, keyed by id, e.g. useMap('reports'). */
export function useMap(kind) {
  return useSyncExternalStore(subscribe, () => state[kind]) ?? EMPTY_MAP
}
const EMPTY_MAP = {}
