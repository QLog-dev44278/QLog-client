import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button } from '../../components/Button/Button'
import { Chip } from '../../components/Chip/Chip'
import { StatusBadge } from '../../components/StatusBadge/StatusBadge'
import { Surface } from '../../components/Surface/Surface'
import { getQuestionDetail, mockEvaluate, type QuestionDetail } from '../../data/questionDetail'
import type { QuestionStatus } from '../../data/types'
import { AnswerEditor } from './AnswerEditor'
import { EvaluationPanel } from './EvaluationPanel'
import { LearningTimeline } from './LearningTimeline'
import styles from './QuestionDetailPage.module.css'

export function QuestionDetailPage() {
  const { id = '' } = useParams()
  const initial = getQuestionDetail(id)
  if (!initial) {
    return (
      <main className={styles.notFound}>
        <p className="title-16">질문을 찾을 수 없어요</p>
        <Link to="/questions" className={styles.backLink}>
          질문함으로 돌아가기
        </Link>
      </main>
    )
  }
  // 질문이 바뀌면 상태를 새로 시작한다
  return <QuestionDetailView key={id} initial={initial} />
}

function QuestionDetailView({ initial }: { initial: QuestionDetail }) {
  const navigate = useNavigate()
  const [question, setQuestion] = useState(initial)
  const [selected, setSelected] = useState(initial.versions.at(-1)?.number ?? 1)
  const [evaluating, setEvaluating] = useState(false)
  const [savedLabel, setSavedLabel] = useState('자동 저장됨')
  const [added, setAdded] = useState<string[]>([])

  const versions = question.versions.length > 0 ? question.versions : [{ number: 1, date: today(), text: '' }]
  const current = versions.find((v) => v.number === selected)
  const isDone = question.versions.some((v) => v.evaluation?.verdict === 'done')
  const status: QuestionStatus = isDone ? 'done' : deriveStatus(question)

  const updateVersions = (update: (prev: QuestionDetail['versions']) => QuestionDetail['versions']) =>
    setQuestion((prev) => ({ ...prev, versions: update(prev.versions.length > 0 ? prev.versions : versions) }))

  const handleChange = (text: string) => {
    updateVersions((prev) => prev.map((v) => (v.number === selected ? { ...v, text, evaluation: undefined } : v)))
    setSavedLabel('자동 저장됨')
  }

  const handleAddVersion = () => {
    const last = versions.at(-1)
    const number = (last?.number ?? 0) + 1
    updateVersions((prev) => [...prev, { number, date: today(), text: last?.text ?? '' }])
    setSelected(number)
  }

  const handleEvaluate = async () => {
    setEvaluating(true)
    // TODO: AI 평가 API 연동
    const evaluation = await mockEvaluate(selected)
    updateVersions((prev) => prev.map((v) => (v.number === selected ? { ...v, evaluation } : v)))
    setEvaluating(false)
  }

  const addQuestion = (title: string) => {
    // TODO: 질문 저장 API 연동
    setAdded((prev) => [...prev, title])
  }

  return (
    <main className={styles.body}>
      <nav className={styles.breadcrumb} aria-label="위치">
        <Link to="/questions">질문함</Link>
        <span>/</span>
        <span className={styles.current}>{question.topics[0] ?? '기타'}</span>
      </nav>

      <Surface as="header" className={styles.questionHeader}>
        <div className={styles.metaRow}>
          <StatusBadge status={status} />
          {question.topics.map((topic) => (
            <Chip key={topic}>{topic}</Chip>
          ))}
          <span className={styles.metaText}>{metaText(question, isDone)}</span>
        </div>
        <h1 className={styles.title}>{question.title}</h1>
        {question.context && (
          <div className={styles.context}>
            <p className={styles.contextLabel}>질문이 생긴 맥락</p>
            <p className="body-14">{question.context}</p>
          </div>
        )}
      </Surface>

      {isDone && (
        <section className={styles.banner}>
          <span className={styles.bannerStar} aria-hidden />
          <div className={styles.bannerText}>
            <p className="title-16">이해 완료 · 새 별이 하나 떠올랐어요</p>
            <p className="body-14">
              지식 그래프에서 {question.concept ? `${question.concept}가` : '이 질문이'} 노란 별로 빛나기
              시작했어요. 지금까지의 답변과 피드백으로 정리 노트를 만들 수 있어요.
            </p>
          </div>
          <Button variant="secondary" onClick={() => navigate('/graph')}>
            그래프에서 보기
          </Button>
          <Button onClick={() => navigate('/notes')}>정리 노트 만들기</Button>
        </section>
      )}

      <div className={styles.answerRow}>
        <AnswerEditor
          versions={versions}
          selected={selected}
          onSelect={setSelected}
          onAddVersion={handleAddVersion}
          onChange={handleChange}
          references={question.references}
          onAddReference={(reference) =>
            setQuestion((prev) => ({ ...prev, references: [...prev.references, reference] }))
          }
          onSaveDraft={() => setSavedLabel('임시 저장됨')}
          onEvaluate={handleEvaluate}
          evaluating={evaluating}
          savedLabel={savedLabel}
        />
        <EvaluationPanel versionNumber={selected} evaluation={current?.evaluation} evaluating={evaluating} />
      </div>

      {(question.followUps.length > 0 || question.prerequisites.length > 0) && (
        <div className={styles.relatedRow}>
          <RelatedQuestions
            title="꼬리질문"
            caption="더 파고들 질문"
            items={question.followUps}
            added={added}
            onAdd={addQuestion}
          />
          <RelatedQuestions
            title="먼저 알아두면 좋은 질문"
            caption="선수 지식"
            items={question.prerequisites}
            added={added}
            onAdd={addQuestion}
          />
        </div>
      )}

      <LearningTimeline question={question} />
    </main>
  )
}

type RelatedQuestionsProps = {
  title: string
  caption: string
  items: string[]
  added: string[]
  onAdd: (title: string) => void
}

function RelatedQuestions({ title, caption, items, added, onAdd }: RelatedQuestionsProps) {
  return (
    <Surface as="section" className={styles.related}>
      <div className={styles.relatedHeader}>
        <h2 className="title-16">{title}</h2>
        <span className={styles.metaText}>{caption}</span>
      </div>
      <ul className={styles.relatedList}>
        {items.map((item) => {
          const isAdded = added.includes(item)
          return (
            <li key={item} className={styles.relatedItem}>
              <span className="body-14">{item}</span>
              <button
                type="button"
                className={styles.addButton}
                disabled={isAdded}
                onClick={() => onAdd(item)}
                aria-label={isAdded ? `${item} 추가됨` : `${item} 질문함에 추가`}
              >
                {isAdded ? '추가됨' : '＋ 추가'}
              </button>
            </li>
          )
        })}
      </ul>
    </Surface>
  )
}

function deriveStatus(question: QuestionDetail): QuestionStatus {
  const evaluated = question.versions.filter((v) => v.evaluation)
  if (evaluated.length > 0) return 'weak'
  if (question.versions.some((v) => v.text.trim())) return 'studying'
  return question.status === 'done' ? 'done' : question.status
}

function metaText(question: QuestionDetail, isDone: boolean) {
  const parts: string[] = []
  if (question.registeredAt) parts.push(`등록 ${question.registeredAt}`)
  const answered = question.versions.filter((v) => v.evaluation).length
  if (answered > 0) parts.push(`답변 ${answered}회`)
  const doneVersion = question.versions.find((v) => v.evaluation?.verdict === 'done')
  if (isDone && doneVersion) parts.push(`${doneVersion.date} 이해 완료`)
  return parts.join(' · ') || question.date
}

function today() {
  const now = new Date()
  return `${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`
}
