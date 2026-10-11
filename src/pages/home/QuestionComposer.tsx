import { useState, type FormEvent } from 'react'
import { Button } from '../../components/Button/Button'
import { Surface } from '../../components/Surface/Surface'
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
    setContextOpen(false)
  }

  return (
    <Surface as="form" className={styles.card} onSubmit={handleSubmit}>
      <input
        className={styles.question}
        placeholder="예: Redis는 왜 빠른가?"
        aria-label="질문"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {contextOpen ? (
        <textarea
          className={styles.contextInput}
          placeholder="질문이 생긴 맥락을 적어주세요 · 강의, 링크, 책, 메모"
          aria-label="질문이 생긴 맥락"
          rows={3}
          autoFocus
          value={context}
          onChange={(e) => setContext(e.target.value)}
        />
      ) : (
        <button type="button" className={styles.contextToggle} onClick={() => setContextOpen(true)}>
          <span className={styles.plus}>＋</span>
          질문이 생긴 맥락 추가 (선택) · 강의, 링크, 책, 메모
        </button>
      )}

      <div className={styles.actions}>
        <span className={styles.dot} aria-hidden />
        <span className={styles.hint}>저장하면 AI가 분야를 자동으로 분류해요</span>
        <Button type="submit" className={styles.submit} disabled={!title.trim()}>
          질문 저장
        </Button>
      </div>
    </Surface>
  )
}
