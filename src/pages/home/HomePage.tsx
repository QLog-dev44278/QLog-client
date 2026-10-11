import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { QuestionCard } from '../../components/QuestionCard/QuestionCard'
import { classifyQuestion } from '../../data/classify'
import { recallQuestions } from '../../data/mock'
import styles from './HomePage.module.css'
import { QuestionComposer, type NewQuestion } from './QuestionComposer'
import { SavedQuestionModal } from './SavedQuestionModal'

export function HomePage() {
  const [saved, setSaved] = useState<(NewQuestion & { topics: string[] }) | null>(null)
  const prefill = useSearchParams()[0].get('q') ?? ''

  return (
    <main className={styles.body}>
      <section className={styles.hero}>
        <h1 className={styles.title}>오늘은 무엇이 궁금한가요?</h1>
        <p className={styles.subtitle}>
          질문을 저장해두고, 직접 공부한 뒤 내 말로 답해보세요. AI는 정답 대신 피드백을 줘요.
        </p>
      </section>

      <QuestionComposer
        key={prefill}
        initialTitle={prefill}
        // TODO: 질문 저장 API 연동
        onSave={(question) => setSaved({ ...question, topics: classifyQuestion(question.title) })}
      />

      <section className={styles.recall}>
        <div className={styles.recallHeader}>
          <h2 className="heading-20">다시 꺼내볼 질문</h2>
          <Link to="/questions" className={styles.more}>
            질문함 전체 보기
          </Link>
        </div>
        <div className={styles.cards}>
          {recallQuestions.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))}
        </div>
      </section>

      {saved && <SavedQuestionModal question={saved} onClose={() => setSaved(null)} />}
    </main>
  )
}
