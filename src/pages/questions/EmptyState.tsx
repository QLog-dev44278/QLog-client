import { Button } from '../../components/Button/Button'
import { Chip } from '../../components/Chip/Chip'
import { Surface } from '../../components/Surface/Surface'
import styles from './EmptyState.module.css'

const EXAMPLES = ['Redis는 왜 빠른가?', 'HTTP/3는 왜 UDP를 쓸까?', '사람은 왜 꿈을 꿀까?']

/** 02-0 질문함 · 비어 있음 */
export function EmptyState({ onStart }: { onStart: (title?: string) => void }) {
  return (
    <Surface className={styles.empty}>
      <div className={styles.stars} aria-hidden>
        <span className={styles.starMain} />
        <span className={styles.starWhite} />
        <span className={styles.starViolet} />
      </div>
      <h2 className="heading-20">아직 저장한 질문이 없어요</h2>
      <p className={`body-14 ${styles.description}`}>
        공부하다 궁금한 게 생기면 질문으로 남겨두세요. 직접 답을 찾아가는 여정이 여기서 시작돼요.
      </p>
      <Button onClick={() => onStart()}>첫 질문 남기기</Button>
      <div className={styles.examples}>
        <p className={styles.examplesLabel}>이런 질문도 좋아요</p>
        <div className={styles.chips}>
          {EXAMPLES.map((example) => (
            <Chip key={example} onClick={() => onStart(example)}>
              {example}
            </Chip>
          ))}
        </div>
      </div>
    </Surface>
  )
}
