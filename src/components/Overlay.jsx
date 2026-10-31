import { useEffect } from 'react'

/** Modal layer (`.ovl` + backdrop) used by the dialogs that open over a page. Escape closes it. */
export default function Overlay({ label, onClose, children, className = 'ovl' }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
    }
  }, [onClose])

  return (
    <div className={className} role="dialog" aria-modal="true" aria-label={label}>
      <button type="button" className="backdrop" aria-label="إغلاق" onClick={onClose} />
      {children}
    </div>
  )
}
