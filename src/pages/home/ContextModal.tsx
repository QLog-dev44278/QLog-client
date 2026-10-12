import { useState } from 'react'
import { Button } from '../../components/Button/Button'
import { Modal } from '../../components/Modal/Modal'
import styles from './ContextModal.module.css'

type ContextModalProps = {
  initialContext: string
  onSave: (context: string) => void
  onClose: () => void
}

/** 홈 입력 바의 ＋: 질문이 생긴 맥락(선택)을 적는다 */
export function ContextModal({ initialContext, onSave, onClose }: ContextModalProps) {
  const [draft, setDraft] = useState(initialContext)

  return (
    <Modal open onClose={onClose} labelledBy="context-modal-title" width={560}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h2 id="context-modal-title" className="title-16">
            질문이 생긴 맥락
          </h2>
          <span className={styles.optional}>선택</span>
        </div>
        <p className={styles.description}>
          어디서 이 질문이 떠올랐는지 남겨두면 나중에 다시 볼 때 도움이 돼요.
        </p>

        <textarea
          className={styles.input}
          placeholder="강의, 링크, 책, 메모 등"
          aria-label="질문이 생긴 맥락"
          rows={5}
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />

        <div className={styles.actions}>
          <Button variant="ghost" onClick={onClose}>
            취소
          </Button>
          <Button
            onClick={() => {
              onSave(draft.trim())
              onClose()
            }}
          >
            저장
          </Button>
        </div>
      </div>
    </Modal>
  )
}
