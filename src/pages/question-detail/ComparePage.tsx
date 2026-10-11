import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import iconChevron from '../../assets/figma/icon-chevron-down.svg'
import { Button } from '../../components/Button/Button'
import { Surface } from '../../components/Surface/Surface'
import { VerdictBadge } from '../../components/VerdictBadge/VerdictBadge'
import { getQuestionDetail, type AnswerVersion } from '../../data/questionDetail'
import styles from './ComparePage.module.css'
import { diffAdded } from './diff'

/** 05-3 답변 버전 비교: /questions/:id/compare?a=1&b=2 */
export function ComparePage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const question = getQuestionDetail(id)
  const versions = question?.versions ?? []

  if (!question || versions.length < 2) {
    return (
      <main className={styles.empty}>
        <p className="title-16">비교할 답변이 아직 없어요</p>
        <p className={styles.muted}>답변을 두 번 이상 평가받으면 버전끼리 비교할 수 있어요.</p>
        <Link to={`/questions/${id}`} className={styles.link}>
          질문으로 돌아가기
        </Link>
      </main>
    )
  }

  const pick = (key: 'a' | 'b', fallback: number) => {
    const n = Number(searchParams.get(key))
    return versions.find((v) => v.number === n) ?? versions.find((v) => v.number === fallback) ?? versions[0]
  }
  const before = pick('a', versions.at(-2)!.number)
  const after = pick('b', versions.at(-1)!.number)

  const select = (key: 'a' | 'b', value: string) => {
    const next = new URLSearchParams(searchParams)
    next.set(key, value)
    setSearchParams(next, { replace: true })
  }

  const changes = versions
    .filter((v) => v.number > before.number && v.number <= after.number)
    .flatMap((v) => v.evaluation?.changes ?? [])
  const nextNumber = versions.at(-1)!.number + 1

  return (
    <main className={styles.body}>
      <nav className={styles.breadcrumb} aria-label="위치">
        <Link to="/questions">질문함</Link>
        <span>/</span>
        <Link to={`/questions/${question.id}`}>{question.title}</Link>
        <span>/</span>
        <span className={styles.current}>답변 비교</span>
      </nav>

      <div className={styles.titleRow}>
        <div className={styles.titleText}>
          <h1 className="heading-24">답변 비교</h1>
          <p className={`body-14 ${styles.secondary}`}>{question.title}</p>
        </div>
        <VersionSelect label="이전 버전" versions={versions} value={before.number} onChange={(v) => select('a', v)} />
        <span className={styles.muted} aria-hidden>
          ↔
        </span>
        <VersionSelect label="비교할 버전" versions={versions} value={after.number} onChange={(v) => select('b', v)} />
      </div>

      <div className={styles.columns}>
        <AnswerColumn version={before} />
        <AnswerColumn version={after} compareTo={before.number < after.number ? before : undefined} />
      </div>

      <Surface as="section" className={styles.changes}>
        <div className={styles.changesHeader}>
          <h2 className="title-16">달라진 점</h2>
          {before.evaluation && after.evaluation && (
            <span className={styles.coverage}>
              핵심 개념 커버리지 {before.evaluation.coverage.covered} / {before.evaluation.coverage.total} →{' '}
              {after.evaluation.coverage.covered} / {after.evaluation.coverage.total}
            </span>
          )}
        </div>
        {changes.length > 0 ? (
          <ul className={styles.changeList}>
            {changes.map((change) => (
              <li key={change.text} className={styles.changeItem}>
                <span className={change.kind === 'plus' ? styles.plus : styles.warn}>
                  {change.kind === 'plus' ? '+' : '△'}
                </span>
                <span className="body-14">{change.text}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.muted}>이전 버전을 왼쪽에, 나중 버전을 오른쪽에 두면 달라진 점을 보여드려요.</p>
        )}
      </Surface>

      <div className={styles.actions}>
        <Button variant="ghost" onClick={() => navigate(`/questions/${question.id}`)}>
          학습 히스토리로 돌아가기
        </Button>
        <Button onClick={() => navigate(`/questions/${question.id}`)}>{nextNumber}차 답변 쓰러 가기</Button>
      </div>
    </main>
  )
}

type VersionSelectProps = {
  label: string
  versions: AnswerVersion[]
  value: number
  onChange: (value: string) => void
}

function VersionSelect({ label, versions, value, onChange }: VersionSelectProps) {
  return (
    <label className={styles.select}>
      <span className="sr-only">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {versions.map((v) => (
          <option key={v.number} value={v.number}>
            {v.number}차 · {v.date}
          </option>
        ))}
      </select>
      <img src={iconChevron} width={16} height={16} alt="" />
    </label>
  )
}

function AnswerColumn({ version, compareTo }: { version: AnswerVersion; compareTo?: AnswerVersion }) {
  const parts = compareTo ? diffAdded(compareTo.text, version.text) : [{ text: version.text, added: false }]
  const feedback = version.evaluation
    ? [...version.evaluation.good, ...version.evaluation.misconceptions, ...version.evaluation.missing]
    : []

  return (
    <Surface as="section" className={styles.column}>
      <div className={styles.columnHeader}>
        <h2 className="title-16">{version.number}차 답변</h2>
        <span className={styles.date}>{version.date}</span>
        {version.evaluation && <VerdictBadge verdict={version.evaluation.verdict} />}
      </div>
      <p className={styles.answer}>
        {parts.map((part, index) =>
          part.added ? (
            <mark key={index} className={styles.added}>
              {part.text}
            </mark>
          ) : (
            <span key={index}>{part.text}</span>
          ),
        )}
      </p>
      {feedback.length > 0 && (
        <div className={styles.feedback}>
          <p className={styles.feedbackLabel}>이때 받은 피드백</p>
          <ul>
            {feedback.map((item) => (
              <li key={item}>· {item}</li>
            ))}
          </ul>
        </div>
      )}
    </Surface>
  )
}
