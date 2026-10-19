import { useId } from 'react'
import './TextField.css'

/**
 * Pill-shaped input with a leading icon, as in the design.
 * The label is visually hidden (the placeholder doubles as the visible label)
 * but stays available to screen readers. `trailing` renders after the input,
 * e.g. the show/hide password button.
 */
export default function TextField({ label, icon, error, trailing, className = '', ...inputProps }) {
  const id = useId()
  const errorId = `${id}-error`

  return (
    <div className={`gx-field ${className}`}>
      <div className={`gx-field__control ${error ? 'gx-field__control--invalid' : ''} ${trailing ? 'gx-field__control--trailing' : ''}`}>
        {icon}
        <label htmlFor={id} className="gx-visually-hidden">
          {label}
        </label>
        <input
          id={id}
          className="gx-field__input"
          placeholder={label}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? errorId : undefined}
          {...inputProps}
        />
        {trailing}
      </div>
      {error && (
        <p id={errorId} className="gx-field__error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
