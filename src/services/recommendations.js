/**
 * Natural-language place search (UC-AI-02).
 *
 * Placeholder for the backend NLP + recommendation endpoint: it extracts the same
 * structured preferences the SRS describes (category, price, atmosphere, distance)
 * with simple Arabic keyword rules, then ranks approved places and returns up to three
 * (FR-44). Replace `recommend()` with a call to the API once it exists.
 */
import { PLACES } from '../data/places'

const CATEGORY_WORDS = {
  restaurants: ['مطعم', 'مطاعم', 'أكل', 'اكل', 'غدا', 'عشا', 'فطور', 'شاورما', 'فلافل'],
  cafes: ['قهوة', 'قهوه', 'كافيه', 'كوفي', 'مقهى', 'مقاهي'],
  sweets: ['كنافة', 'كنافه', 'حلويات', 'حلو', 'معمول', 'قطايف'],
  hotels: ['فندق', 'فنادق', 'إقامة', 'منتجع', 'نوم'],
  fun: ['ملاهي', 'ترفيه', 'للأولاد', 'الأولاد', 'أطفال'],
  toys: ['ألعاب', 'العاب', 'لعبة', 'دمى'],
  gifts: ['هدية', 'هدايا', 'صابون', 'تطريز'],
  pets: ['قطة', 'كلب', 'حيوان', 'حيوانات', 'أليف'],
  electronics: ['موبايل', 'جوال', 'سماعات', 'إلكترونيات', 'الكترونيات', 'لابتوب'],
}

const VIBE_WORDS = {
  quiet: { words: ['هادي', 'هادية', 'هادئ', 'للدراسة', 'دراسة'], tags: ['هادئ', 'مناسب للدراسة', 'واي فاي'] },
  view: { words: ['إطلالة', 'اطلالة', 'سطح', 'غروب'], tags: ['إطلالة'] },
  family: { words: ['عيلة', 'عائلة', 'عائلي', 'للأولاد', 'الأولاد'], tags: ['عائلي', 'للأطفال', 'غرف عائلية'] },
  fast: { words: ['سريع', 'تيك'], tags: ['سريع', 'تيك أواي'] },
}

/** Extract structured preferences from a free-text request. */
export function extractPreferences(text) {
  const q = text.trim()
  const has = (words) => words.some((w) => q.includes(w))
  const category = Object.keys(CATEGORY_WORDS).find((c) => has(CATEGORY_WORDS[c])) ?? null
  const price = has(['رخيص', 'رخيصة', 'اقتصادي', 'مش غالي']) ? 'low' : has(['فخم', 'راقي']) ? 'high' : null
  const vibes = Object.keys(VIBE_WORDS).filter((v) => has(VIBE_WORDS[v].words))
  const near = has(['قريب', 'قريبة', 'جنبي', 'مني'])
  return { category, price, vibes, near }
}

/** Rank places for a request; returns { prefs, results } with at most `limit` places. */
export function recommend(text, limit = 3) {
  const prefs = extractPreferences(text)
  const known = prefs.category || prefs.price || prefs.vibes.length
  if (!known) return { prefs, results: [] }

  const pool = prefs.category ? PLACES.filter((p) => p.category === prefs.category) : PLACES
  const scored = pool.map((p) => {
    let score = p.rating / 5 // rating baseline, normalised to 0–1
    if (prefs.price === 'low') score += p.price.length === 1 ? 0.6 : p.price.length === 2 ? 0.2 : 0
    if (prefs.price === 'high') score += p.price.length === 3 ? 0.6 : 0
    for (const v of prefs.vibes) if (p.tags.some((t) => VIBE_WORDS[v].tags.includes(t))) score += 0.5
    score += Math.min(p.reviews, 500) / 2500 // popularity
    return { place: p, score }
  })
  scored.sort((a, b) => b.score - a.score)
  return { prefs, results: scored.slice(0, limit).map((s) => s.place) }
}
