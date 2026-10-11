import { useState, type KeyboardEvent } from 'react'
import { Button } from '../../components/Button/Button'
import { Chip } from '../../components/Chip/Chip'
import { Surface } from '../../components/Surface/Surface'
import type { AnswerVersion } from '../../data/questionDetail'
import styles from './AnswerEditor.module.css'

type AnswerEditorProps = {
  versions: AnswerVersion[]
  selected: number
  onSelect: (versionNumber: number) => void
  onAddVersion: () => void
  onChange: (text: string) => void
  references: string[]
  onAddReference: (reference: string) => void
  onSaveDraft: () => void
  onEvaluate: () => void
  evaluating: boolean
  savedLabel: string
}

export function AnswerEditor({
  versions,
  selected,
  onSelect,
  onAddVersion,
  onChange,
  references,
  onAddReference,
  onSaveDraft,
  onEvaluate,
  evaluating,
  savedLabel,
}: AnswerEditorProps) {
  const version = versions.find((v) => v.number === selected)
  const text = version?.text ?? ''
  const [addingReference, setAddingReference] = useState(false)
  const [referenceDraft, setReferenceDraft] = useState('')

  const commitReference = () => {
    if (referenceDraft.trim()) onAddReference(referenceDraft.trim())
    setReferenceDraft('')
    setAddingReference(false)
  }

  const handleReferenceKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') commitReference()
    if (e.key === 'Escape') setAddingReference(false)
  }

  return (
    <Surface as="section" className={styles.card}>
      <div className={styles.header}>
        <h2 className="title-16">내 답변</h2>
        <div className={styles.tabs} role="tablist" aria-label="답변 버전">
          {versions.map((v) => (
            <button
              key={v.number}
              type="button"
              role="tab"
              aria-selected={v.number === selected}
              className={[styles.tab, v.number === selected && styles.tabActive].filter(Boolean).join(' ')}
              onClick={() => onSelect(v.number)}
            >
              {v.number}차
            </button>
          ))}
          <button type="button" className={styles.tab} onClick={onAddVersion} disabled={evaluating}>
            ＋ 새 버전
          </button>
        </div>
      </div>

      <textarea
        className={styles.editor}
        aria-label={`${selected}차 답변`}
        placeholder="공부한 내용을 내 말로 설명해보세요"
        value={text}
        readOnly={evaluating}
        onChange={(e) => onChange(e.target.value)}
      />
      <p className={styles.meta}>
        {text.length}자 · {savedLabel}
      </p>

      <div className={styles.references}>
        <span className={styles.meta}>참고한 자료</span>
        {references.map((reference) => (
          <Chip key={reference}>{reference}</Chip>
        ))}
        {addingReference ? (
          <input
            className={styles.referenceInput}
            placeholder="자료 이름 또는 링크"
            aria-label="참고한 자료 추가"
            autoFocus
            value={referenceDraft}
            onChange={(e) => setReferenceDraft(e.target.value)}
            onKeyDown={handleReferenceKey}
            onBlur={commitReference}
          />
        ) : (
          <Chip onClick={() => setAddingReference(true)}>＋ 자료 추가</Chip>
        )}
      </div>

      <div className={styles.actions}>
        <p className={styles.meta}>AI는 정답 대신 맞은 점과 더 찾아볼 방향을 알려줘요</p>
        <Button variant="secondary" onClick={onSaveDraft} disabled={evaluating}>
          임시 저장
        </Button>
        <Button onClick={onEvaluate} disabled={evaluating || !text.trim()}>
          {evaluating ? '평가 중…' : 'AI 평가 받기'}
        </Button>
      </div>
    </Surface>
  )
}
