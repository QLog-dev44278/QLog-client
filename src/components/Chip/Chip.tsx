import type { ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './Chip.module.css'

type ChipProps = {
  children: ReactNode
  selected?: boolean
  className?: string
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>

/** 분야·키워드 태그. onClick을 주면 선택 가능한 필터 칩이 된다. */
export function Chip({ children, selected = false, className, onClick, ...rest }: ChipProps) {
  const classes = [styles.chip, selected && styles.selected, onClick && styles.clickable, className]
    .filter(Boolean)
    .join(' ')

  if (!onClick) return <span className={classes}>{children}</span>

  return (
    <button type="button" className={classes} aria-pressed={selected} onClick={onClick} {...rest}>
      {children}
    </button>
  )
}
