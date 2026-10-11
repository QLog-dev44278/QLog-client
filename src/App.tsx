import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Background } from './components/Background/Background'
import { Placeholder } from './pages/Placeholder'

export default function App() {
  return (
    <BrowserRouter>
      <Background />
      <Routes>
        <Route path="/login" element={<Placeholder title="로그인" />} />
        <Route path="/signup" element={<Placeholder title="회원가입" />} />
        <Route path="/forgot-password" element={<Placeholder title="비밀번호 찾기" />} />

        <Route path="/" element={<Placeholder title="홈" />} />
        <Route path="/questions" element={<Placeholder title="질문함" />} />
        <Route path="/questions/:id" element={<Placeholder title="질문 상세" />} />
        <Route path="/questions/:id/compare" element={<Placeholder title="답변 버전 비교" />} />
        <Route path="/graph" element={<Placeholder title="지식 그래프" />} />
        <Route path="/notes" element={<Placeholder title="정리 노트" />} />
        <Route path="/settings" element={<Placeholder title="내 정보 · 설정" />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
