import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '../../components/Button/Button'
import { Chip } from '../../components/Chip/Chip'
import type { GraphNodeStatus } from '../../components/GraphNode/GraphNode'
import { Surface } from '../../components/Surface/Surface'
import { conceptEdges, conceptNodes, GRAPH_TOPICS, type ConceptNode } from '../../data/graph'
import { GraphCanvas } from './GraphCanvas'
import styles from './GraphPage.module.css'

const LEGEND: { status: GraphNodeStatus; label: string }[] = [
  { status: 'done', label: '이해 완료' },
  { status: 'studying', label: '공부 중' },
  { status: 'weak', label: '보완 필요' },
  { status: 'todo', label: '아직 공부 안 함' },
  { status: 'recommended', label: '추천 개념 · 아직 질문 안 함' },
]

/** 이 너비 이하에서는 두 패널이 기본으로 접히고, 한 번에 하나만 펼쳐진다 */
const NARROW_QUERY = '(max-width: 1100px)'

const STATUS_HEADING: Record<GraphNodeStatus, string> = {
  done: '이해 완료',
  studying: '공부 중',
  weak: '보완 필요',
  todo: '아직 공부 안 함',
  recommended: '추천 개념',
}

export function GraphPage() {
  const navigate = useNavigate()
  // ?demo=empty 로 03-0 빈 상태를 미리 볼 수 있다 (API 연동 전 확인용)
  const isEmpty = useSearchParams()[0].get('demo') === 'empty'

  const [topic, setTopic] = useState('all')
  const [query, setQuery] = useState('')
  const [showRecommended, setShowRecommended] = useState(true)
  const [selectedId, setSelectedId] = useState<string | undefined>('cache-stampede')
  const [dismissed, setDismissed] = useState<string[]>([])
  const [added, setAdded] = useState<string[]>([])

  const [isNarrow, setIsNarrow] = useState(() => window.matchMedia(NARROW_QUERY).matches)
  const [filterOpen, setFilterOpen] = useState(!isNarrow)
  const [detailOpen, setDetailOpen] = useState(!isNarrow)

  useEffect(() => {
    const media = window.matchMedia(NARROW_QUERY)
    const handleChange = (e: MediaQueryListEvent) => {
      setIsNarrow(e.matches)
      setFilterOpen(!e.matches)
      setDetailOpen(!e.matches)
    }
    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [])

  // 좁은 화면에서는 패널이 캔버스를 가리지 않도록 한쪽만 펼친다
  const openFilter = () => {
    setFilterOpen(true)
    if (isNarrow) setDetailOpen(false)
  }
  const openDetail = () => {
    setDetailOpen(true)
    if (isNarrow) setFilterOpen(false)
  }
  const handleSelect = (id: string) => {
    setSelectedId(id)
    openDetail()
  }

  const nodes = useMemo(
    () =>
      conceptNodes.filter(
        (node) => !dismissed.includes(node.id) && (showRecommended || node.status !== 'recommended'),
      ),
    [dismissed, showRecommended],
  )
  const visibleIds = new Set(nodes.map((node) => node.id))
  const edges = conceptEdges.filter((edge) => visibleIds.has(edge.from) && visibleIds.has(edge.to))
  const selected = nodes.find((node) => node.id === selectedId)

  const keyword = query.trim().toLowerCase()
  const isDimmed = (node: ConceptNode) =>
    (topic !== 'all' && !node.topics.includes(topic)) || (keyword !== '' && !node.label.toLowerCase().includes(keyword))

  const questionCount = conceptNodes.filter((n) => n.status !== 'recommended').length
  const recommendedCount = conceptNodes.length - questionCount
  const linkCount = conceptEdges.filter((e) => !e.recommended).length

  if (isEmpty) {
    return (
      <main className={styles.empty}>
        <div className={styles.orbits} aria-hidden>
          <span className={styles.orbitOuter} />
          <span className={styles.orbitInner} />
          <span className={styles.orbitStar} />
        </div>
        <h1 className="heading-20">첫 질문을 남기면 이곳에 별이 하나 생겨요</h1>
        <p className={`body-14 ${styles.emptyText}`}>
          질문을 공부하고 이해할수록 별이 밝아지고, 질문끼리 이어지면서 나만의 별자리가 그려져요.
        </p>
        <Button onClick={() => navigate('/')}>질문하러 가기</Button>
        <div className={styles.legendHint}>
          <span className={styles.hintItem}>
            <span className={`${styles.hintStar} ${styles.hintCurious}`} />
            궁금함
          </span>
          <span className={styles.hintItem}>
            <span className={`${styles.hintStar} ${styles.hintStudying}`} />
            공부 중
          </span>
          <span className={styles.hintItem}>
            <span className={`${styles.hintStar} ${styles.hintDone}`} />
            이해 완료
          </span>
        </div>
      </main>
    )
  }

  return (
    <main className={styles.page}>
      <GraphCanvas
        nodes={nodes}
        edges={edges}
        selectedId={selected?.id}
        isDimmed={isDimmed}
        onSelect={handleSelect}
      />

      <Surface
        as="button"
        type="button"
        className={`${styles.handle} ${styles.filterHandle} ${filterOpen ? styles.handleHidden : ''}`}
        aria-label="그래프 필터 펼치기"
        title="그래프 필터"
        tabIndex={filterOpen ? -1 : 0}
        onClick={openFilter}
      >
        <FilterIcon />
        <ChevronIcon direction="right" />
      </Surface>

      <Surface
        as="aside"
        className={`${styles.panel} ${styles.filterPanel} ${filterOpen ? '' : styles.collapsed}`}
        aria-label="그래프 필터"
        aria-hidden={!filterOpen}
        inert={!filterOpen}
      >
        <div className={styles.panelTitle}>
          <div className={styles.titleRow}>
            <h1 className="heading-20">지식 그래프</h1>
            <button
              type="button"
              className={styles.collapse}
              aria-label="그래프 필터 접기"
              title="접기"
              onClick={() => setFilterOpen(false)}
            >
              <ChevronIcon direction="left" />
            </button>
          </div>
          <p className={styles.caption}>
            질문 {questionCount}개 · 연결 {linkCount}개 · 추천 개념 {recommendedCount}개
          </p>
        </div>

        <input
          type="search"
          className={styles.search}
          placeholder="노드 검색"
          aria-label="노드 검색"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <section className={styles.section}>
          <h2 className={styles.sectionLabel}>이해 상태</h2>
          <ul className={styles.legend}>
            {LEGEND.map((item) => (
              <li key={item.status}>
                <span className={`${styles.legendStar} ${styles[item.status]}`} aria-hidden />
                {item.label}
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionLabel}>분야</h2>
          <div className={styles.chips}>
            {['all', ...GRAPH_TOPICS].map((name) => (
              <Chip key={name} selected={topic === name} onClick={() => setTopic(name)}>
                {name === 'all' ? '전체' : name}
              </Chip>
            ))}
          </div>
        </section>

        <label className={styles.toggleRow}>
          <span className="body-14">추천 개념 표시</span>
          <input
            type="checkbox"
            role="switch"
            className={styles.toggleInput}
            checked={showRecommended}
            onChange={(e) => setShowRecommended(e.target.checked)}
          />
          <span className={styles.toggle} aria-hidden />
        </label>

        <p className={`${styles.caption} ${styles.footnote}`}>
          별을 누르면 오른쪽에 상세가 열려요. 질문 노드는 질문 상세로 이동할 수 있어요.
        </p>
      </Surface>

      {selected && (
        <Surface
          as="button"
          type="button"
          className={`${styles.handle} ${styles.detailHandle} ${detailOpen ? styles.handleHidden : ''}`}
          aria-label={`${selected.label} 상세 펼치기`}
          title={selected.label}
          tabIndex={detailOpen ? -1 : 0}
          onClick={openDetail}
        >
          <ChevronIcon direction="left" />
          <span className={`${styles.handleStar} ${styles[selected.status]}`} aria-hidden />
        </Surface>
      )}

      {selected && (
        <Surface
          as="aside"
          className={`${styles.panel} ${styles.detailPanel} ${detailOpen ? '' : styles.collapsed}`}
          aria-label="노드 상세"
          aria-hidden={!detailOpen}
          inert={!detailOpen}
        >
          <div className={styles.detailHead}>
            <div className={styles.titleRow}>
              <p className={`label-13 ${styles[`heading-${selected.status}`]}`}>{STATUS_HEADING[selected.status]}</p>
              <button
                type="button"
                className={styles.collapse}
                aria-label="노드 상세 접기"
                title="접기"
                onClick={() => setDetailOpen(false)}
              >
                <ChevronIcon direction="right" />
              </button>
            </div>
            <h2 className="heading-24">{selected.label}</h2>
            <p className={`body-14 ${styles.secondary}`}>{selected.question ?? selected.description}</p>
          </div>

          {selected.reason ? (
            <section className={styles.detailSection}>
              <h3 className="title-16">왜 추천했나요?</h3>
              <p className={`body-14 ${styles.secondary}`}>{selected.reason}</p>
            </section>
          ) : (
            <section className={styles.detailSection}>
              <h3 className="title-16">개념 요약</h3>
              <p className={`body-14 ${styles.secondary}`}>{selected.description}</p>
            </section>
          )}

          {selected.related.length > 0 && (
            <section className={styles.detailSection}>
              <h3 className="title-16">연결된 질문</h3>
              <ul className={styles.relatedList}>
                {selected.related.map((item) => (
                  <li key={item.title} className={styles.relatedItem}>
                    <span className="body-14">{item.title}</span>
                    <span className={styles.relationType}>{item.type}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {selected.helpful && (
            <section className={styles.detailSection}>
              <h3 className="title-16">알면 도움이 되는 것</h3>
              <p className={`body-14 ${styles.secondary}`}>{selected.helpful}</p>
            </section>
          )}

          <div className={styles.detailActions}>
            {selected.status === 'recommended' ? (
              <>
                <Button
                  fullWidth
                  disabled={added.includes(selected.id)}
                  // TODO: 질문 저장 API 연동
                  onClick={() => setAdded((prev) => [...prev, selected.id])}
                >
                  {added.includes(selected.id) ? '질문함에 추가했어요' : '질문으로 추가'}
                </Button>
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => {
                    setDismissed((prev) => [...prev, selected.id])
                    setSelectedId(undefined)
                  }}
                >
                  관심 없음
                </Button>
              </>
            ) : (
              <Button
                fullWidth
                onClick={() =>
                  navigate(
                    selected.questionId
                      ? `/questions/${selected.questionId}`
                      : `/?q=${encodeURIComponent(selected.question ?? selected.label)}`,
                  )
                }
              >
                {selected.questionId ? '질문 상세 보기' : '이 질문 공부하기'}
              </Button>
            )}
          </div>
        </Surface>
      )}
    </main>
  )
}

function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={direction === 'left' ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'} />
    </svg>
  )
}

function FilterIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
      <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
      <circle cx="16" cy="7" r="2" />
      <circle cx="10" cy="17" r="2" />
    </svg>
  )
}
