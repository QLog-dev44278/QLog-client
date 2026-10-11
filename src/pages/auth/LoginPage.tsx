import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../../components/Button/Button'
import { Checkbox } from '../../components/Checkbox/Checkbox'
import { Input } from '../../components/Input/Input'
import styles from './Auth.module.css'
import { AuthLayout, OrDivider } from './AuthLayout'
import { validateEmail } from './validation'

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [keepSignedIn, setKeepSignedIn] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const next = {
      email: validateEmail(email),
      password: password ? undefined : '비밀번호를 입력해 주세요',
    }
    setErrors(next)
    if (next.email || next.password) return
    // TODO: 로그인 API 연동
    navigate('/')
  }

  return (
    <AuthLayout
      title="로그인"
      description="다시 오신 걸 환영해요"
      tagline="질문을 저장하고, 직접 답을 만들어가요"
      onSubmit={handleSubmit}
    >
      <Input
        label="이메일"
        type="email"
        autoComplete="email"
        placeholder="name@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
      />
      <Input
        label="비밀번호"
        type="password"
        autoComplete="current-password"
        placeholder="8자 이상"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
      />
      <div className={styles.options}>
        <Checkbox checked={keepSignedIn} onChange={(e) => setKeepSignedIn(e.target.checked)}>
          로그인 상태 유지
        </Checkbox>
        <Link to="/forgot-password" className={styles.link}>
          비밀번호 찾기
        </Link>
      </div>
      <Button type="submit" fullWidth>
        로그인
      </Button>
      <OrDivider />
      <Button variant="secondary" fullWidth>
        Google로 계속하기
      </Button>
      <p className={styles.footer}>
        아직 계정이 없나요?
        <Link to="/signup" className={styles.link}>
          회원가입
        </Link>
      </p>
    </AuthLayout>
  )
}
