import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../../components/Button/Button'
import { Checkbox } from '../../components/Checkbox/Checkbox'
import { Input } from '../../components/Input/Input'
import styles from './Auth.module.css'
import { AuthLayout, OrDivider } from './AuthLayout'
import { validateEmail, validatePassword } from './validation'

type Errors = Partial<Record<'name' | 'email' | 'password' | 'passwordConfirm' | 'agree', string>>

export function SignupPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', passwordConfirm: '' })
  const [agree, setAgree] = useState(false)
  const [errors, setErrors] = useState<Errors>({})

  const update = (key: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }))

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const next: Errors = {
      name: form.name.trim() ? undefined : '이름을 입력해 주세요',
      email: validateEmail(form.email),
      password: validatePassword(form.password),
      passwordConfirm:
        form.password === form.passwordConfirm ? undefined : '비밀번호가 일치하지 않아요',
      agree: agree ? undefined : '이용약관에 동의해 주세요',
    }
    setErrors(next)
    if (Object.values(next).some(Boolean)) return
    // TODO: 회원가입 API 연동
    navigate('/')
  }

  return (
    <AuthLayout title="회원가입" description="질문을 별로 모아가는 여정을 시작해요" onSubmit={handleSubmit}>
      <Input
        label="이름"
        autoComplete="name"
        placeholder="홍길동"
        value={form.name}
        onChange={update('name')}
        error={errors.name}
      />
      <Input
        label="이메일"
        type="email"
        autoComplete="email"
        placeholder="name@example.com"
        value={form.email}
        onChange={update('email')}
        error={errors.email}
      />
      <Input
        label="비밀번호"
        type="password"
        autoComplete="new-password"
        placeholder="8자 이상, 영문과 숫자 포함"
        value={form.password}
        onChange={update('password')}
        error={errors.password}
      />
      <Input
        label="비밀번호 확인"
        type="password"
        autoComplete="new-password"
        placeholder="비밀번호를 한 번 더 입력"
        value={form.passwordConfirm}
        onChange={update('passwordConfirm')}
        error={errors.passwordConfirm}
      />
      <div>
        <div className={styles.options}>
          <Checkbox checked={agree} onChange={(e) => setAgree(e.target.checked)}>
            이용약관 및 개인정보 처리방침에 동의해요
          </Checkbox>
          {/* TODO: 약관 페이지 연결 */}
          <a href="#terms" className={styles.link}>
            보기
          </a>
        </div>
        {errors.agree && <p className={styles.formError}>{errors.agree}</p>}
      </div>
      <Button type="submit" fullWidth>
        가입하기
      </Button>
      <OrDivider />
      <Button variant="secondary" fullWidth>
        Google로 시작하기
      </Button>
      <p className={styles.footer}>
        이미 계정이 있나요?
        <Link to="/login" className={styles.link}>
          로그인
        </Link>
      </p>
    </AuthLayout>
  )
}
