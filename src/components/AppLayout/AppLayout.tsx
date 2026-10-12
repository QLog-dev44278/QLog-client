import { useState } from 'react'
import { Outlet, useMatch } from 'react-router-dom'
import { Header } from '../Header/Header'
import styles from './AppLayout.module.css'

/**
 * 로그인 후 화면 공통 레이아웃: 상단 고정 헤더 + 그 아래에서만 스크롤되는 본문.
 * 스크롤하면 본문 윗부분이 헤더 근처에서 서서히 사라진다.
 */
export function AppLayout() {
  const [scrolled, setScrolled] = useState(false)
  // 지식 그래프는 캔버스가 헤더 뒤까지 화면 전체를 채우므로 페이드를 걸지 않는다
  const isGraph = useMatch('/graph') !== null

  return (
    <div className={styles.layout}>
      <Header />
      <div
        className={[styles.content, scrolled && !isGraph && styles.faded].filter(Boolean).join(' ')}
        onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 0)}
      >
        <Outlet />
      </div>
    </div>
  )
}
