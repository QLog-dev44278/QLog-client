import { Link } from 'react-router-dom'
import type { Question } from '../../data/types'
import { Chip } from '../Chip/Chip'
import { StatusBadge } from '../StatusBadge/StatusBadge'
import { Surface } from '../Surface/Surface'
import styles from './QuestionCard.module.css'

export function QuestionCard({ question, className }: { question: Question; className?: string }) {
  return (
    <Surface
      as={Link}
      to={`/questions/${question.id}`}
      className={[styles.card, className].filter(Boolean).join(' ')}
    >
      <div className={styles.top}>
        <StatusBadge status={question.status} />
        <span className={styles.date}>{question.date}</span>
      </div>
      <p className={`title-16 ${styles.title}`}>{question.title}</p>
      {question.topics.length > 0 && (
        <div className={styles.tags}>
          {question.topics.map((topic) => (
            <Chip key={topic}>{topic}</Chip>
          ))}
        </div>
      )}
      <p className={`caption-12 ${styles.meta}`}>{question.meta}</p>
    </Surface>
  )
}
