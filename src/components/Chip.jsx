import './Chip.css'

/** Pill toggle used for multi- and single-select options. */
export default function Chip({ selected, onClick, children }) {
  return (
    <button type="button" className={`gx-chip ${selected ? 'gx-chip--on' : ''}`} aria-pressed={selected} onClick={onClick}>
      {children}
    </button>
  )
}
