import { Outlet } from 'react-router-dom'
import { Header } from '../Header/Header'

/** 로그인 후 화면 공통 레이아웃: 상단 헤더 + 본문 */
export function AppLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}
