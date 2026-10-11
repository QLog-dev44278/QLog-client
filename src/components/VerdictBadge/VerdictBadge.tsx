import { VERDICT_LABEL, type Verdict } from '../../data/questionDetail'
import styles from './VerdictBadge.module.css'

/** AI 평가 결과(이해도 판정) 배지 */
export function VerdictBadge({ verdict }: { verdict: Verdict }) {
  return <span className={`${styles.badge} ${verdict === 'done' ? styles.done : styles.weak}`}>{VERDICT_LABEL[verdict]}</span>
}
