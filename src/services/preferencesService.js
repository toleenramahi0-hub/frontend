/**
 * Place-discovery preferences (UC-U11 View, UC-U12 Create, UC-U13 Update, UC-U14 Remove).
 *
 * Expected Laravel endpoints:
 *   GET  /preferences → { preferences } (404 or { preferences: null } when none saved yet)
 *   PUT  /preferences   body = preferences object → { preferences }
 *   DELETE /preferences → 204
 *
 * Shape (all optional except where noted; values are stable ids, not Arabic labels):
 *   {
 *     categories:      string[]              e.g. ['cafes', 'desserts']   (at least one)
 *     price_level:     'low'|'medium'|'high'|null
 *     max_spend:       number                ₪ per visit, 20–400 (400 = "400+")
 *     deals_first:     boolean
 *     use_location:    boolean
 *     areas:           string[]              Nablus area ids
 *     max_distance_km: 1|3|5|null            null = anywhere in Nablus
 *     company:         string[]
 *     times:           string[]
 *     vibes:           string[]
 *     needs:           string[]
 *   }
 */
import { apiRequest } from './api'
import * as mock from './mockPreferences'

const useMock = import.meta.env.VITE_USE_MOCK_API === 'true'

const real = {
  get: () => apiRequest('/preferences'),
  save: (preferences) => apiRequest('/preferences', { method: 'PUT', body: preferences }),
  remove: () => apiRequest('/preferences', { method: 'DELETE' }),
}

export const preferencesService = useMock ? mock : real
