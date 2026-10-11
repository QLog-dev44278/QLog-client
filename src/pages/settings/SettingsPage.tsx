import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/Button/Button'
import { Input } from '../../components/Input/Input'
import { Modal } from '../../components/Modal/Modal'
import { Surface } from '../../components/Surface/Surface'
import { currentUser, questions } from '../../data/mock'
import { avatarInitial } from '../../utils/avatar'
import { validatePassword } from '../auth/validation'
import styles from './SettingsPage.module.css'

const SECTIONS = [
  { id: 'profile', label: '프로필' },
  { id: 'security', label: '계정 · 보안' },
]

export function SettingsPage() {
  const navigate = useNavigate()
  const [active, setActive] = useState('profile')
  const [withdrawOpen, setWithdrawOpen] = useState(false)

  const starCount = questions.filter((q) => q.status === 'done').length

  const scrollTo = (id: string) => {
    setActive(id)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <main className={styles.body}>
      <Surface as="nav" className={styles.nav} aria-label="설정 메뉴">
        <h1 className="heading-20">설정</h1>
        <ul>
          {SECTIONS.map((section) => (
            <li key={section.id}>
              <button
                type="button"
                className={[styles.navItem, active === section.id && styles.navActive].filter(Boolean).join(' ')}
                aria-current={active === section.id}
                onClick={() => scrollTo(section.id)}
              >
                {section.label}
              </button>
            </li>
          ))}
          <li>
            <button type="button" className={styles.navItem} disabled title="준비 중이에요">
              학습 설정
              <span className={styles.soon}>준비 중</span>
            </button>
          </li>
        </ul>
      </Surface>

      <div className={styles.main}>
        <ProfileSection questionCount={questions.length} starCount={starCount} />
        <PasswordSection />

        <Surface as="section" className={styles.card} aria-labelledby="account-title">
          <h2 id="account-title" className="title-16">
            계정
          </h2>
          <div className={styles.row}>
            <div className={styles.rowText}>
              <p className="body-14">로그아웃</p>
              <p className={styles.caption}>이 기기에서 로그아웃해요</p>
            </div>
            {/* TODO: 로그아웃 API 연동 */}
            <Button variant="secondary" onClick={() => navigate('/login')}>
              로그아웃
            </Button>
          </div>
          <div className={styles.row}>
            <div className={styles.rowText}>
              <p className={`body-14 ${styles.danger}`}>회원 탈퇴</p>
              <p className={styles.caption}>모든 질문, 답변, 정리 노트가 삭제되고 되돌릴 수 없어요</p>
            </div>
            <Button variant="danger" onClick={() => setWithdrawOpen(true)}>
              회원 탈퇴
            </Button>
          </div>
        </Surface>
      </div>

      <Modal open={withdrawOpen} onClose={() => setWithdrawOpen(false)} labelledBy="withdraw-title" width={420}>
        <div className={styles.modal}>
          <h2 id="withdraw-title" className="title-16">
            정말 탈퇴할까요?
          </h2>
          <p className={`body-14 ${styles.secondary}`}>
            지금까지 모은 질문 {questions.length}개, 별 {starCount}개, 답변과 정리 노트가 모두 삭제되고 되돌릴 수 없어요.
          </p>
          <div className={styles.modalActions}>
            <Button variant="secondary" onClick={() => setWithdrawOpen(false)}>
              취소
            </Button>
            {/* TODO: 회원 탈퇴 API 연동 */}
            <Button variant="danger" onClick={() => navigate('/login')}>
              탈퇴하기
            </Button>
          </div>
        </div>
      </Modal>
    </main>
  )
}

function ProfileSection({ questionCount, starCount }: { questionCount: number; starCount: number }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState(currentUser.name)
  const [photo, setPhoto] = useState<string>()
  const [saved, setSaved] = useState(false)

  useEffect(() => () => {
    if (photo) URL.revokeObjectURL(photo)
  }, [photo])

  const handlePhoto = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setPhoto(URL.createObjectURL(file))
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // TODO: 프로필 수정 API 연동
    setSaved(true)
  }

  return (
    <Surface as="form" id="profile" className={styles.card} onSubmit={handleSubmit} aria-labelledby="profile-title">
      <h2 id="profile-title" className="title-16">
        프로필
      </h2>
      <div className={styles.profileRow}>
        <span className={styles.avatar}>
          {photo ? <img src={photo} alt="프로필 사진" /> : avatarInitial(name || currentUser.name)}
        </span>
        <div className={styles.rowText}>
          <p className="title-16">{name || currentUser.name}</p>
          <p className={styles.caption}>
            2026.08 가입 · 질문 {questionCount}개 · 별 {starCount}개
          </p>
        </div>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={handlePhoto} />
        <Button variant="secondary" onClick={() => fileRef.current?.click()}>
          사진 변경
        </Button>
      </div>
      <div className={styles.fields}>
        <Input
          label="이름"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            setSaved(false)
          }}
          error={name.trim() ? undefined : '이름을 입력해 주세요'}
        />
        <Input label="이메일 (변경 불가)" value={currentUser.email} disabled className={styles.readonly} />
      </div>
      <div className={styles.actions}>
        {saved && <span className={styles.caption}>저장했어요</span>}
        <Button type="submit" disabled={!name.trim()}>
          저장
        </Button>
      </div>
    </Surface>
  )
}

function PasswordSection() {
  const [form, setForm] = useState({ current: '', next: '', confirm: '' })
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({})
  const [done, setDone] = useState(false)

  const update = (key: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }))
    setDone(false)
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const next = {
      current: form.current ? undefined : '현재 비밀번호를 입력해 주세요',
      next: validatePassword(form.next),
      confirm: form.next === form.confirm ? undefined : '비밀번호가 일치하지 않아요',
    }
    setErrors(next)
    if (Object.values(next).some(Boolean)) return
    // TODO: 비밀번호 변경 API 연동
    setForm({ current: '', next: '', confirm: '' })
    setDone(true)
  }

  return (
    <Surface as="form" id="security" className={styles.card} onSubmit={handleSubmit} noValidate aria-labelledby="password-title">
      <div className={styles.rowText}>
        <h2 id="password-title" className="title-16">
          비밀번호 변경
        </h2>
        <p className={styles.caption}>소셜 로그인으로 가입했다면 비밀번호를 새로 만들 수 있어요</p>
      </div>
      <Input
        label="현재 비밀번호"
        type="password"
        autoComplete="current-password"
        placeholder="현재 비밀번호 입력"
        value={form.current}
        onChange={update('current')}
        error={errors.current}
      />
      <div className={styles.fields}>
        <Input
          label="새 비밀번호"
          type="password"
          autoComplete="new-password"
          placeholder="8자 이상 입력"
          value={form.next}
          onChange={update('next')}
          error={errors.next}
        />
        <Input
          label="새 비밀번호 확인"
          type="password"
          autoComplete="new-password"
          placeholder="한 번 더 입력"
          value={form.confirm}
          onChange={update('confirm')}
          error={errors.confirm}
        />
      </div>
      <div className={styles.actions}>
        {done && <span className={styles.caption}>비밀번호를 변경했어요</span>}
        <Button type="submit" variant="secondary">
          비밀번호 변경
        </Button>
      </div>
    </Surface>
  )
}
