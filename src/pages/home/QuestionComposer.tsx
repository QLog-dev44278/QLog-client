import { useState, type FormEvent } from 'react'
import { Button } from '../../components/Button/Button'
import { Surface } from '../../components/Surface/Surface'
import { ContextModal } from './ContextModal'
import styles from './QuestionComposer.module.css'

export type NewQuestion = {
  title: string
  context: string
}

/** 홈의 질문 입력 카드: 질문 + (선택) 질문이 생긴 맥락 */
type QuestionComposerProps = {
  onSave: (question: NewQuestion) => void
  /** 질문함의 예시 질문 등에서 넘어올 때 미리 채워둘 질문 */
  initialTitle?: string
}

export function QuestionComposer({ onSave, initialTitle = '' }: QuestionComposerProps) {
  const [title, setTitle] = useState(initialTitle)
  const [context, setContext] = useState('')
  const [contextOpen, setContextOpen] = useState(false)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!title.trim()) return
    onSave({ title: title.trim(), context: context.trim() })
    setTitle('')
    setContext('')
  }

  return (
    <Surface as="form" className={styles.card} onSubmit={handleSubmit}>
      <div className={styles.bar}>
        <button
          type="button"
          className={`${styles.plus} ${context ? styles.plusFilled : ''}`}
          aria-label={context ? '질문이 생긴 맥락 수정' : '질문이 생긴 맥락 추가'}
          aria-haspopup="dialog"
          title="질문이 생긴 맥락 추가 (선택) · 강의, 링크, 책, 메모"
          onClick={() => setContextOpen(true)}
        >
          ＋
        </button>
        <input
          className={styles.question}
          placeholder="예: Redis는 왜 빠른가?"
          aria-label="질문"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {context && (
        <button type="button" className={styles.contextPreview} onClick={() => setContextOpen(true)}>
          <span className={styles.contextLabel}>맥락</span>
          <span className={styles.contextText}>{context}</span>
        </button>
      )}

      <div className={styles.actions}>
        <span className={styles.dot} aria-hidden />
        <span className={styles.hint}>저장하면 AI가 분야를 자동으로 분류해요</span>
        <Button type="submit" className={styles.submit} disabled={!title.trim()}>
          질문 저장
        </Button>
      </div>

      {contextOpen && (
        <ContextModal initialContext={context} onSave={setContext} onClose={() => setContextOpen(false)} />
      )}
    </Surface>
  )
}
