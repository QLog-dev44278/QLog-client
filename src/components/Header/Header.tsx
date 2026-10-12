import { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import iconChevron from '../../assets/figma/icon-chevron-down.svg'
import { currentUser } from '../../data/mock'
import { avatarInitial } from '../../utils/avatar'
import { Logo } from '../Logo/Logo'
import { ProfileMenu } from '../ProfileMenu/ProfileMenu'
import { ThemeToggle } from '../ThemeToggle/ThemeToggle'
import styles from './Header.module.css'

const NAV_ITEMS = [
  { to: '/', label: '홈', end: true },
  { to: '/questions', label: '질문함', end: false },
  { to: '/graph', label: '지식 그래프', end: false },
  { to: '/notes', label: '정리 노트', end: false },
]

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!menuOpen) return
    const handlePointer = (e: PointerEvent) => {
      if (!profileRef.current?.contains(e.target as Node)) setMenuOpen(false)
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('pointerdown', handlePointer)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('pointerdown', handlePointer)
      document.removeEventListener('keydown', handleKey)
    }
  }, [menuOpen])

  return (
    <header className={styles.header}>
      <Logo />
      <nav className={styles.nav}>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => [styles.navItem, isActive && styles.active].filter(Boolean).join(' ')}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className={styles.spacer} />
      <ThemeToggle />
      <div className={styles.profileWrap} ref={profileRef}>
        <button
          type="button"
          className={styles.profile}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className={styles.avatar}>{avatarInitial(currentUser.name)}</span>
          <span className={styles.name}>{currentUser.name}</span>
          <img src={iconChevron} width={16} height={16} alt="" />
        </button>
        {menuOpen && (
          <ProfileMenu
            user={currentUser}
            className={styles.menu}
            onClose={() => setMenuOpen(false)}
            onLogout={() => {
              setMenuOpen(false)
              navigate('/login')
            }}
          />
        )}
      </div>
    </header>
  )
}
