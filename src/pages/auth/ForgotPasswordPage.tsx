import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/Button/Button'
import { Input } from '../../components/Input/Input'
import styles from './Auth.module.css'
import { AuthLayout } from './AuthLayout'
import { validateEmail } from './validation'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string>()
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const next = validateEmail(email)
    setError(next)
    if (next) return
    // TODO: 재설정 메일 발송 API 연동
    setSent(true)
  }

  return (
    <AuthLayout title="비밀번호 찾기" description="가입한 이메일로 재설정 링크를 보내드려요" onSubmit={handleSubmit}>
      <Input
        label="이메일"
        type="email"
        autoComplete="email"
        placeholder="name@example.com"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value)
          setSent(false)
        }}
        error={error}
      />
      <Button type="submit" fullWidth disabled={sent}>
        {sent ? '재설정 링크를 보냈어요' : '재설정 링크 보내기'}
      </Button>
      <p className={styles.note}>
        <span className={styles.noteDot} aria-hidden />
        링크는 30분 동안 유효해요. 메일이 안 보이면 스팸함도 확인해 주세요.
      </p>
      <p className={styles.footer}>
        <Link to="/login" className={styles.link}>
          ← 로그인으로 돌아가기
        </Link>
      </p>
    </AuthLayout>
  )
}
