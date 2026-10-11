import gradient from '../../assets/figma/bg-gradient.svg'
import stars from '../../assets/figma/bg-stars.svg'
import styles from './Background.module.css'

/** 모든 화면 뒤에 깔리는 공통 배경. 그라데이션은 천천히 흐르고 별은 반짝인다. */
export function Background() {
  return (
    <div className={styles.root} aria-hidden>
      <img className={styles.gradient} src={gradient} alt="" />
      <img className={styles.stars} src={stars} alt="" />
    </div>
  )
}
