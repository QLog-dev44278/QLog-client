import type { FormEvent, ReactNode } from 'react'
import { Logo } from '../../components/Logo/Logo'
import { Surface } from '../../components/Surface/Surface'
import styles from './Auth.module.css'

type AuthLayoutProps = {
  title: string
  description: string
  /** 로고 아래 한 줄 소개. 로그인 화면에서만 쓴다. */
  tagline?: string
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
  children: ReactNode
}

/** 로그인·회원가입·비밀번호 찾기 공통 틀: 가운데 로고 + 폼 카드 */
export function AuthLayout({ title, description, tagline, onSubmit, children }: AuthLayoutProps) {
  return (
    <main className={styles.page}>
      <div className={styles.brand}>
        <Logo size="lg" to="/login" />
        {tagline && <p className={styles.tagline}>{tagline}</p>}
      </div>
      <Surface as="form" className={styles.card} onSubmit={onSubmit} noValidate>
        <div className={styles.heading}>
          <h1 className="heading-24">{title}</h1>
          <p className={`body-14 ${styles.description}`}>{description}</p>
        </div>
        {children}
      </Surface>
    </main>
  )
}

export function OrDivider() {
  return (
    <div className={styles.divider}>
      <span className={styles.line} />
      <span>또는</span>
      <span className={styles.line} />
    </div>
  )
}
