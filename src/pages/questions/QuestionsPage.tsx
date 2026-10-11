import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import iconChevron from '../../assets/figma/icon-chevron-down.svg'
import { Button } from '../../components/Button/Button'
import { Chip } from '../../components/Chip/Chip'
import { Input } from '../../components/Input/Input'
import { QuestionCard } from '../../components/QuestionCard/QuestionCard'
import { Surface } from '../../components/Surface/Surface'
import { questions as mockQuestions, TOPICS } from '../../data/mock'
import { STATUS_LABEL, type Question, type QuestionStatus } from '../../data/types'
import { EmptyState } from './EmptyState'
import styles from './QuestionsPage.module.css'

const STATUSES: QuestionStatus[] = ['curious', 'studying', 'weak', 'done']
const STALE_DAYS = 30
const NO_QUESTIONS: Question[] = []

type Sort = 'latest' | 'oldest'

export function QuestionsPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  // ?demo=empty 로 02-0 빈 상태를 미리 볼 수 있다 (API 연동 전 확인용)
  const allQuestions = searchParams.get('demo') === 'empty' ? NO_QUESTIONS : mockQuestions

  const [status, setStatus] = useState<QuestionStatus | 'all'>('all')
  const [topic, setTopic] = useState<string>('all')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<Sort>('latest')

  const counts = useMemo(() => {
    const result: Record<QuestionStatus | 'all', number> = { all: allQuestions.length, curious: 0, studying: 0, weak: 0, done: 0 }
    for (const q of allQuestions) result[q.status] += 1
    return result
  }, [allQuestions])

  const visible = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    return allQuestions
      .filter((q) => status === 'all' || q.status === status)
      .filter((q) => topic === 'all' || q.topics.includes(topic))
      .filter((q) => !keyword || q.title.toLowerCase().includes(keyword))
      .sort((a, b) => (sort === 'latest' ? a.daysAgo - b.daysAgo : b.daysAgo - a.daysAgo))
  }, [allQuestions, status, topic, query, sort])

  const staleCount = allQuestions.filter((q) => q.status === 'curious' && q.daysAgo > STALE_DAYS).length
  const isEmpty = allQuestions.length === 0
  const startQuestion = (title?: string) => navigate(title ? `/?q=${encodeURIComponent(title)}` : '/')

  return (
    <main className={styles.body}>
      <Surface as="aside" className={styles.sidebar}>
        <h1 className="heading-20">질문함</h1>
        <Button fullWidth onClick={() => startQuestion()}>
          ＋ 새 질문
        </Button>

        <section className={styles.filterGroup}>
          <h2 className={styles.groupLabel}>상태</h2>
          <ul>
            {(['all', ...STATUSES] as const).map((key) => (
              <li key={key}>
                <button
                  type="button"
                  className={[styles.statusFilter, status === key && styles.active].filter(Boolean).join(' ')}
                  aria-pressed={status === key}
                  onClick={() => setStatus(key)}
                >
                  {key !== 'all' && <span className={`${styles.dot} ${styles[key]}`} aria-hidden />}
                  <span className={styles.statusLabel}>{key === 'all' ? '전체' : STATUS_LABEL[key]}</span>
                  <span className={styles.count}>{counts[key]}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        {!isEmpty && (
          <section className={styles.topicGroup}>
            <h2 className={styles.groupLabel}>분야 · AI 자동 분류</h2>
            <div className={styles.chips}>
              {['all', ...TOPICS].map((name) => (
                <Chip key={name} selected={topic === name} onClick={() => setTopic(name)}>
                  {name === 'all' ? '전체' : name}
                </Chip>
              ))}
            </div>
          </section>
        )}
      </Surface>

      <div className={styles.main}>
        <div className={styles.toolbar}>
          <Input
            type="search"
            placeholder="질문 검색"
            aria-label="질문 검색"
            className={styles.search}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {!isEmpty && (
            <label className={styles.sort}>
              <span className="sr-only">정렬</span>
              <select value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
                <option value="latest">최신순</option>
                <option value="oldest">오래된순</option>
              </select>
              <img src={iconChevron} width={16} height={16} alt="" />
            </label>
          )}
        </div>

        {isEmpty ? (
          <EmptyState onStart={startQuestion} />
        ) : (
          <>
            {(counts.weak > 0 || staleCount > 0) && (
              <p className={styles.summary}>
                <span className={styles.summaryDot} aria-hidden />
                보완이 필요한 질문 {counts.weak}개, {STALE_DAYS}일 넘게 방치된 질문 {staleCount}개가 있어요
              </p>
            )}
            {visible.length > 0 ? (
              <div className={styles.grid}>
                {visible.map((question) => (
                  <QuestionCard key={question.id} question={question} />
                ))}
              </div>
            ) : (
              <p className={styles.noResult}>조건에 맞는 질문이 없어요</p>
            )}
          </>
        )}
      </div>
    </main>
  )
}
