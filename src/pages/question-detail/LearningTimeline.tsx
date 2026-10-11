import { Link } from 'react-router-dom'
import { Surface } from '../../components/Surface/Surface'
import { VERDICT_LABEL, type QuestionDetail } from '../../data/questionDetail'
import styles from './LearningTimeline.module.css'

type Step = {
  key: string
  title: string
  caption: string
  reached: boolean
  /** 다음 단계까지 선이 이어졌는지 */
  linked: boolean
  to?: string
}

const PLANNED_VERSIONS = 3

/** 학습 히스토리: 질문 등록 → n차 답변 → 이해 완료. 답변 단계를 누르면 직전 버전과 비교한다. */
export function LearningTimeline({ question }: { question: QuestionDetail }) {
  const done = question.versions.some((v) => v.evaluation?.verdict === 'done')
  const lastVersion = question.versions.at(-1)
  const versionCount = Math.max(PLANNED_VERSIONS, question.versions.length)

  const versionSteps = Array.from({ length: versionCount }, (_, index): Omit<Step, 'linked'> => {
    const number = index + 1
    const version = question.versions.find((v) => v.number === number)
    const evaluated = Boolean(version?.evaluation)
    return {
      key: `v${number}`,
      title: `${number}차 답변`,
      caption: version?.evaluation
        ? `${version.date} · ${VERDICT_LABEL[version.evaluation.verdict]}`
        : version
          ? `${version.date} · 작성 중`
          : nextHint(question),
      reached: evaluated,
      to: evaluated && number > 1 ? `/questions/${question.id}/compare?a=${number - 1}&b=${number}` : undefined,
    }
  })

  const raw: Omit<Step, 'linked'>[] = [
    { key: 'registered', title: '질문 등록', caption: `${shortDate(question.registeredAt)} · 맥락 저장`, reached: true },
    ...versionSteps,
    {
      key: 'done',
      title: '이해 완료',
      caption: done && lastVersion ? `${lastVersion.date} · 정리 노트 만들기` : '정리 노트 자동 생성',
      reached: done,
      to: done ? '/notes' : undefined,
    },
  ]
  const steps: Step[] = raw.map((step, index) => ({ ...step, linked: step.reached && Boolean(raw[index + 1]?.reached) }))

  return (
    <Surface as="section" className={styles.card}>
      <div className={styles.header}>
        <h2 className="title-16">학습 히스토리</h2>
        <p className={styles.hint}>단계를 누르면 그때의 답변과 피드백을 비교할 수 있어요</p>
      </div>
      <ol className={styles.timeline}>
        {steps.map((step, index) => {
          const content = (
            <>
              <span className={styles.track}>
                <span className={step.reached ? styles.starOn : styles.starOff} />
                {index < steps.length - 1 && <span className={step.linked ? styles.lineOn : styles.lineOff} />}
              </span>
              <span className={step.reached ? styles.title : styles.titleMuted}>{step.title}</span>
              <span className={styles.caption}>{step.caption}</span>
            </>
          )
          return (
            <li key={step.key} className={styles.step}>
              {step.to ? (
                <Link to={step.to} className={styles.stepLink}>
                  {content}
                </Link>
              ) : (
                <div className={styles.stepLink}>{content}</div>
              )}
            </li>
          )
        })}
      </ol>
    </Surface>
  )
}

function shortDate(date: string) {
  return date.slice(5) || '-'
}

function nextHint(question: QuestionDetail) {
  const keyword = question.versions.at(-1)?.evaluation?.next.keywords[0]
  return keyword ? `${keyword} 보완 예정` : '답변 작성 전'
}
