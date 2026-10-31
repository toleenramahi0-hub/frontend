/**
 * Image in the design's `.ph` style. `img` is a URL or { src, pos, scale } —
 * pos/scale crop into a larger photo (e.g. a detail of the clock tower drawing).
 */
export default function Photo({ img, alt = '', className = 'ph', style }) {
  if (!img) return null
  const { src, pos = 'center', scale } = typeof img === 'string' ? { src: img } : img
  const crop = scale
    ? { objectPosition: pos, transform: `scale(${scale})`, transformOrigin: pos }
    : { objectPosition: pos, transform: 'none' }
  return <img className={className} src={src} alt={alt} style={{ ...crop, ...style }} />
}

export const photoSrc = (img) => (typeof img === 'string' ? img : img?.src)
