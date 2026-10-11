import { STATUS_LABEL, type QuestionStatus } from '../../data/types'
import styles from './StatusBadge.module.css'

export function StatusBadge({ status, className }: { status: QuestionStatus; className?: string }) {
  return (
    <span className={[styles.badge, styles[status], className].filter(Boolean).join(' ')}>
      <span className={styles.dot} aria-hidden />
      {STATUS_LABEL[status]}
    </span>
  )
}
