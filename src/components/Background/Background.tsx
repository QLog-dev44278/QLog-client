import gradientLight from '../../assets/figma/bg-gradient-light.svg'
import gradient from '../../assets/figma/bg-gradient.svg'
import stars from '../../assets/figma/bg-stars.svg'
import styles from './Background.module.css'

/**
 * 모든 화면 뒤에 깔리는 공통 배경. 그라데이션은 천천히 흐르고 별은 반짝인다.
 * 라이트 모드는 밝은 극야: 위가 진한 푸른 박명 하늘에 옅은 오로라, 흰 별은 하늘 위쪽에 남는다.
 */
export function Background() {
  return (
    <div className={styles.root} aria-hidden>
      <img className={`${styles.gradient} ${styles.dark}`} src={gradient} alt="" />
      <img className={`${styles.gradient} ${styles.light}`} src={gradientLight} alt="" />
      <img className={styles.stars} src={stars} alt="" />
    </div>
  )
}
