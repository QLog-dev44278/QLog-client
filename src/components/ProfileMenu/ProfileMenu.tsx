import { Link } from 'react-router-dom'
import iconLogout from '../../assets/figma/icon-logout.svg'
import iconUser from '../../assets/figma/icon-user.svg'
import type { User } from '../../data/types'
import { Surface } from '../Surface/Surface'
import styles from './ProfileMenu.module.css'

type ProfileMenuProps = {
  user: User
  onClose: () => void
  onLogout: () => void
  className?: string
}

export function ProfileMenu({ user, onClose, onLogout, className }: ProfileMenuProps) {
  return (
    <Surface className={[styles.menu, className].filter(Boolean).join(' ')} role="menu">
      <div className={styles.user}>
        <p className="label-13">{user.name}</p>
        <p className={`caption-12 ${styles.email}`}>{user.email}</p>
      </div>
      <hr className={styles.divider} />
      <Link to="/settings" className={styles.item} role="menuitem" onClick={onClose}>
        <img src={iconUser} width={16} height={16} alt="" />
        <span className="body-14">내 정보</span>
      </Link>
      <hr className={styles.divider} />
      <button
        type="button"
        className={`${styles.item} ${styles.danger}`}
        role="menuitem"
        onClick={onLogout}
      >
        <img src={iconLogout} width={16} height={16} alt="" />
        <span className="body-14">로그아웃</span>
      </button>
    </Surface>
  )
}
