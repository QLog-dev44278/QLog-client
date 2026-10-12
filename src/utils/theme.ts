import { useState } from 'react'

export type Theme = 'dark' | 'light'

/** index.html의 첫 화면 스크립트도 같은 키를 읽는다 */
const STORAGE_KEY = 'qlog-theme'

/** 저장된 테마. 처음 방문하면 기본 디자인인 다크 */
function getTheme(): Theme {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', theme === 'light' ? '#c2cdea' : '#0c1124')
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // 저장소를 못 쓰면 이번 방문 동안만 유지
  }
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getTheme)

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    applyTheme(next)
    setTheme(next)
  }

  return { theme, toggleTheme }
}
