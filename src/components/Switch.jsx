import './Switch.css'

export default function Switch({ checked, onChange, children }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className="gx-switch"
      onClick={() => onChange(!checked)}
    >
      <span className={`gx-switch__track ${checked ? 'gx-switch__track--on' : ''}`}>
        <span className="gx-switch__knob" />
      </span>
      {children}
    </button>
  )
}
