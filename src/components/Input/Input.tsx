import { useId, type InputHTMLAttributes } from 'react'
import styles from './Input.module.css'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string
}

export function Input({ label, error, id, className, ...rest }: InputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const input = (
    <input
      id={inputId}
      className={[styles.input, error && styles.invalid, !label && className].filter(Boolean).join(' ')}
      aria-invalid={error ? true : undefined}
      {...rest}
    />
  )

  if (!label) return input

  return (
    <div className={[styles.field, className].filter(Boolean).join(' ')}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
      </label>
      {input}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  )
}
