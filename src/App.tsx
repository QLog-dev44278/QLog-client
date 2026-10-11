import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/AppLayout/AppLayout'
import { Background } from './components/Background/Background'
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage'
import { LoginPage } from './pages/auth/LoginPage'
import { SignupPage } from './pages/auth/SignupPage'
import { HomePage } from './pages/home/HomePage'
import { Placeholder } from './pages/Placeholder'
import { QuestionDetailPage } from './pages/question-detail/QuestionDetailPage'
import { QuestionsPage } from './pages/questions/QuestionsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Background />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/questions" element={<QuestionsPage />} />
          <Route path="/questions/:id" element={<QuestionDetailPage />} />
          <Route path="/questions/:id/compare" element={<Placeholder title="답변 버전 비교" />} />
          <Route path="/graph" element={<Placeholder title="지식 그래프" />} />
          <Route path="/notes" element={<Placeholder title="정리 노트" />} />
          <Route path="/settings" element={<Placeholder title="내 정보 · 설정" />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
