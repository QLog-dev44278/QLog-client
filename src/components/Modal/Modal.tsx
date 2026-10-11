import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Surface } from '../Surface/Surface'
import styles from './Modal.module.css'

type ModalProps = {
  open: boolean
  onClose: () => void
  labelledBy?: string
  width?: number
  children: ReactNode
}

/** 배경을 어둡게 덮는 scrim 위에 Surface 카드를 띄운다. ESC·바깥 클릭으로 닫힘. */
export function Modal({ open, onClose, labelledBy, width = 480, children }: ModalProps) {
  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className={styles.scrim} onPointerDown={(e) => e.target === e.currentTarget && onClose()}>
      <Surface
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className={styles.dialog}
        style={{ width }}
      >
        {children}
      </Surface>
    </div>,
    document.body,
  )
}
