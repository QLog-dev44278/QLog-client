import { useEffect, useState } from 'react'
import { Chip } from '../../components/Chip/Chip'
import { Surface } from '../../components/Surface/Surface'
import { VerdictBadge } from '../../components/VerdictBadge/VerdictBadge'
import type { Evaluation } from '../../data/questionDetail'
import styles from './EvaluationPanel.module.css'

const PROGRESS_STEPS = [
  '질문의 핵심 개념 정리',
  '답변과 비교하며 맞은 점 찾는 중',
  '오개념과 빠진 개념 확인',
  '더 찾아볼 방향 정리',
]
const SKELETON_WIDTHS = ['100%', '82%', '64%', '90%', '50%']

type EvaluationPanelProps = {
  versionNumber: number
  evaluation?: Evaluation
  evaluating: boolean
}

export function EvaluationPanel({ versionNumber, evaluation, evaluating }: EvaluationPanelProps) {
  return (
    <Surface as="section" className={styles.panel} aria-live="polite">
      <div className={styles.header}>
        <h2 className="title-16">AI 평가</h2>
        <span className={styles.basis}>{versionNumber}차 답변 기준</span>
        {!evaluating && evaluation && <VerdictBadge verdict={evaluation.verdict} />}
      </div>

      {evaluating ? (
        <EvaluatingState />
      ) : evaluation ? (
        <EvaluationResult evaluation={evaluation} />
      ) : (
        <p className={styles.placeholder}>
          답변을 작성하고 AI 평가를 받아보세요.
          <br />
          정답 대신 맞은 점과 더 찾아볼 방향을 알려드려요.
        </p>
      )}
    </Surface>
  )
}

/** 05-2 AI 평가 중: 별이 순서대로 반짝이고 단계가 하나씩 진행된다 */
function EvaluatingState() {
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setActiveStep((step) => Math.min(step + 1, PROGRESS_STEPS.length - 1)), 1200)
    return () => clearInterval(timer)
  }, [])

  return (
    <>
      <div className={styles.loading}>
        <div className={styles.twinkle} aria-hidden>
          <span />
          <span />
          <span />
        </div>
        <p className="title-16">답변을 살펴보고 있어요</p>
        <p className={styles.loadingHint}>보통 5~10초 정도 걸려요</p>
      </div>
      <ol className={styles.steps}>
        {PROGRESS_STEPS.map((step, index) => (
          <li
            key={step}
            className={index < activeStep ? styles.stepDone : index === activeStep ? styles.stepActive : styles.stepTodo}
          >
            <span className={styles.stepState} aria-hidden />
            {step}
          </li>
        ))}
      </ol>
      <div className={styles.skeleton} aria-hidden>
        {SKELETON_WIDTHS.map((width, index) => (
          <span key={index} style={{ width }} />
        ))}
      </div>
    </>
  )
}

function EvaluationResult({ evaluation }: { evaluation: Evaluation }) {
  const { covered, total } = evaluation.coverage
  return (
    <>
      <div className={styles.coverage}>
        <div className={styles.coverageRow}>
          <span className={styles.coverageLabel}>핵심 개념 커버리지</span>
          <span className="label-13">
            {covered} / {total}
          </span>
        </div>
        <div
          className={styles.bar}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={covered}
          aria-label="핵심 개념 커버리지"
        >
          <span style={{ width: `${(covered / total) * 100}%` }} />
        </div>
      </div>

      <FeedbackList mark="○" tone="star" title="잘 이해한 부분" items={evaluation.good} />
      <FeedbackList mark="△" tone="coral" title="보완이 필요한 부분" items={evaluation.missing} />
      <FeedbackList mark="×" tone="coral" title="오개념" items={evaluation.misconceptions} />

      <section className={styles.group}>
        <h3 className={styles.groupTitle}>
          <span className={styles.violet}>→</span>
          {evaluation.next.title}
        </h3>
        <div className={styles.keywords}>
          {evaluation.next.keywords.map((keyword) => (
            <Chip key={keyword} selected>
              {keyword}
            </Chip>
          ))}
        </div>
        <p className={styles.hint}>{evaluation.next.hint}</p>
      </section>
    </>
  )
}

type FeedbackListProps = {
  mark: string
  tone: 'star' | 'coral'
  title: string
  items: string[]
}

function FeedbackList({ mark, tone, title, items }: FeedbackListProps) {
  if (items.length === 0) return null
  return (
    <section className={styles.group}>
      <h3 className={styles.groupTitle}>
        <span className={styles[tone]}>{mark}</span>
        {title}
      </h3>
      <ul className={styles.items}>
        {items.map((item) => (
          <li key={item}>· {item}</li>
        ))}
      </ul>
    </section>
  )
}
