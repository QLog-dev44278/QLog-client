import { Link } from 'react-router-dom'
import styles from './Logo.module.css'

/** 별 + QLog 워드마크. md는 헤더용, lg는 로그인·회원가입 화면용 */
export function Logo({ size = 'md', to = '/' }: { size?: 'md' | 'lg'; to?: string }) {
  return (
    <Link to={to} className={`${styles.logo} ${styles[size]}`} aria-label="QLog 홈">
      <span className={styles.star} aria-hidden />
      <span className={styles.text}>QLog</span>
    </Link>
  )
}
