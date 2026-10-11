import type { InputHTMLAttributes, ReactNode } from 'react'
import styles from './Checkbox.module.css'

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  children: ReactNode
}

export function Checkbox({ children, className, ...rest }: CheckboxProps) {
  return (
    <label className={[styles.label, className].filter(Boolean).join(' ')}>
      <input type="checkbox" className={styles.input} {...rest} />
      <span className={styles.box} aria-hidden />
      <span>{children}</span>
    </label>
  )
}
