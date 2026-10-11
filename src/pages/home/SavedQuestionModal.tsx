import { useState, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/Button/Button'
import { Chip } from '../../components/Chip/Chip'
import { Modal } from '../../components/Modal/Modal'
import styles from './SavedQuestionModal.module.css'

type SavedQuestionModalProps = {
  question: { title: string; topics: string[] }
  onClose: () => void
}

/** 01-2 질문 저장 직후: AI가 분류한 분야를 확인·수정한다 */
export function SavedQuestionModal({ question, onClose }: SavedQuestionModalProps) {
  const navigate = useNavigate()
  const [topics, setTopics] = useState(() => question.topics.map((name) => ({ name, selected: true })))
  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState('')

  const toggle = (name: string) =>
    setTopics((prev) => prev.map((t) => (t.name === name ? { ...t, selected: !t.selected } : t)))

  const addTopic = () => {
    const name = draft.trim()
    if (name && !topics.some((t) => t.name === name)) {
      setTopics((prev) => [...prev, { name, selected: true }])
    }
    setDraft('')
    setAdding(false)
  }

  const handleDraftKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTopic()
    }
    if (e.key === 'Escape') {
      e.stopPropagation()
      setAdding(false)
    }
  }

  return (
    <Modal open onClose={onClose} labelledBy="saved-question-title">
      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.star} aria-hidden />
          <h2 id="saved-question-title" className="title-16">
            질문을 저장했어요
          </h2>
          <span className={styles.time}>방금</span>
        </div>

        <p className={`body-14 ${styles.question}`}>{question.title}</p>

        <div className={styles.topics}>
          <p className={styles.label}>AI가 분류한 분야</p>
          <div className={styles.chips}>
            {topics.map((topic) => (
              <Chip key={topic.name} selected={topic.selected} onClick={() => toggle(topic.name)}>
                {topic.name}
              </Chip>
            ))}
            {adding ? (
              <input
                className={styles.topicInput}
                placeholder="분야 이름"
                aria-label="추가할 분야"
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={handleDraftKey}
                onBlur={addTopic}
              />
            ) : (
              <Chip onClick={() => setAdding(true)}>＋ 분야 추가</Chip>
            )}
          </div>
          <p className={styles.hint}>맞지 않으면 눌러서 바꿀 수 있어요</p>
        </div>

        <div className={styles.actions}>
          {/* TODO: 저장된 질문 id로 이동 */}
          <Button variant="secondary" onClick={() => navigate('/questions/redis-fast')}>
            지금 공부하기
          </Button>
          <Button onClick={onClose}>확인</Button>
        </div>
      </div>
    </Modal>
  )
}
