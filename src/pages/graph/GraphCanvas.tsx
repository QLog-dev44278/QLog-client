import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { GraphNode } from '../../components/GraphNode/GraphNode'
import type { ConceptEdge, ConceptNode } from '../../data/graph'
import styles from './GraphCanvas.module.css'

const STAGE_WIDTH = 1440
const STAGE_HEIGHT = 900
const EDGE_GAP = 10
const MIN_ZOOM = 0.5
const MAX_ZOOM = 2

type GraphCanvasProps = {
  nodes: ConceptNode[]
  edges: ConceptEdge[]
  selectedId?: string
  /** 검색·분야 필터에 걸리지 않은 노드는 흐리게 */
  isDimmed: (node: ConceptNode) => boolean
  onSelect: (id: string) => void
}

/**
 * Figma 프레임(1440×900) 좌표계를 그대로 쓰는 별자리 캔버스.
 * 화면에 맞게 기본 배율을 정하고, 휠·버튼으로 확대, 드래그로 이동한다.
 */
export function GraphCanvas({ nodes, edges, selectedId, isDimmed, onSelect }: GraphCanvasProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [fit, setFit] = useState(1)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const drag = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const update = () => setFit(Math.min(root.clientWidth / STAGE_WIDTH, root.clientHeight / STAGE_HEIGHT))
    update()
    const observer = new ResizeObserver(update)
    observer.observe(root)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      setZoom((z) => clampZoom(z * (e.deltaY < 0 ? 1.1 : 1 / 1.1)))
    }
    root.addEventListener('wheel', handleWheel, { passive: false })
    return () => root.removeEventListener('wheel', handleWheel)
  }, [])

  const byId = new Map(nodes.map((node) => [node.id, node]))

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) return
    drag.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current) return
    setPan({ x: drag.current.panX + e.clientX - drag.current.x, y: drag.current.panY + e.clientY - drag.current.y })
  }

  const scale = fit * zoom

  return (
    <div
      ref={rootRef}
      className={styles.root}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={() => (drag.current = null)}
      onPointerCancel={() => (drag.current = null)}
    >
      <div
        className={styles.stage}
        style={{
          width: STAGE_WIDTH,
          height: STAGE_HEIGHT,
          transform: `translate(calc(-50% + ${pan.x}px), calc(-50% + ${pan.y}px)) scale(${scale})`,
        }}
      >
        <svg className={styles.edges} width={STAGE_WIDTH} height={STAGE_HEIGHT} aria-hidden>
          <defs>
            <filter id="edge-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {edges.map((edge) => {
            const from = byId.get(edge.from)
            const to = byId.get(edge.to)
            if (!from || !to) return null
            const [x1, y1, x2, y2] = shorten(from, to)
            const key = `${edge.from}-${edge.to}`
            const dimmed = isDimmed(from) && isDimmed(to)
            if (edge.recommended) {
              return (
                <line
                  key={key}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  className={dimmed ? styles.dimmed : undefined}
                  stroke="var(--accent-violet)"
                  strokeOpacity={0.5}
                  strokeWidth={1.2}
                  strokeLinecap="round"
                  strokeDasharray="1 5"
                />
              )
            }
            return (
              <g key={key} className={dimmed ? styles.dimmed : undefined}>
                <linearGradient id={`grad-${key}`} gradientUnits="userSpaceOnUse" x1={x1} y1={y1} x2={x2} y2={y2}>
                  <stop stopColor="#DBE3FF" stopOpacity={0.04} />
                  <stop offset={0.5} stopColor="#DBE3FF" stopOpacity={0.5} />
                  <stop offset={1} stopColor="#DBE3FF" stopOpacity={0.04} />
                </linearGradient>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={`url(#grad-${key})`}
                  strokeWidth={0.8}
                  filter="url(#edge-glow)"
                />
              </g>
            )
          })}
        </svg>

        {nodes.map((node) => (
          <div
            key={node.id}
            className={[styles.anchor, isDimmed(node) && styles.dimmed].filter(Boolean).join(' ')}
            style={{ left: node.x, top: node.y }}
          >
            {node.id === selectedId && <span className={styles.ring} aria-hidden />}
            <GraphNode
              label={node.label}
              status={node.status}
              selected={node.id === selectedId}
              className={styles.node}
              onClick={() => onSelect(node.id)}
            />
          </div>
        ))}
      </div>

      <div className={styles.zoom}>
        <button type="button" aria-label="축소" onClick={() => setZoom((z) => clampZoom(z / 1.2))}>
          -
        </button>
        <button
          type="button"
          aria-label="원래 크기로"
          onClick={() => {
            setZoom(1)
            setPan({ x: 0, y: 0 })
          }}
        >
          {Math.round(zoom * 100)}%
        </button>
        <button type="button" aria-label="확대" onClick={() => setZoom((z) => clampZoom(z * 1.2))}>
          +
        </button>
      </div>
    </div>
  )
}

function clampZoom(zoom: number) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom))
}

/** 별에 선이 닿지 않도록 양 끝을 조금씩 줄인다 */
function shorten(a: ConceptNode, b: ConceptNode) {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const length = Math.hypot(dx, dy) || 1
  const ux = (dx / length) * EDGE_GAP
  const uy = (dy / length) * EDGE_GAP
  return [a.x + ux, a.y + uy, b.x - ux, b.y - uy]
}
