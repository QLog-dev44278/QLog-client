import sparkleDone from '../../assets/figma/sparkle-done.svg'
import sparkleStudying from '../../assets/figma/sparkle-studying.svg'
import styles from './GraphNode.module.css'

export type GraphNodeStatus = 'done' | 'studying' | 'weak' | 'todo' | 'recommended'

type GraphNodeProps = {
  label: string
  status: GraphNodeStatus
  selected?: boolean
  onClick?: () => void
  className?: string
}

/** 지식 그래프의 별 노드. 이해 상태에 따라 크기·빛번짐·글자색이 달라지고 opacity로 반짝인다. */
export function GraphNode({ label, status, selected = false, onClick, className }: GraphNodeProps) {
  return (
    <button
      type="button"
      className={[styles.node, styles[status], selected && styles.selected, className].filter(Boolean).join(' ')}
      aria-pressed={selected}
      onClick={onClick}
    >
      <span className={styles.star}>
        {status === 'done' && (
          <img className={styles.sparkleDone} src={sparkleDone} width={23.2} height={23.2} alt="" />
        )}
        {status === 'studying' && (
          <img className={styles.sparkleStudying} src={sparkleStudying} width={17.2} height={17.2} alt="" />
        )}
      </span>
      <span className={styles.label}>{label}</span>
    </button>
  )
}
