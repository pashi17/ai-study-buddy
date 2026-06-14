import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import IntroPage from './pages/IntroPage'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import DashboardPage from './pages/DashboardPage'
import SyllabusUploadPage from './pages/SyllabusUploadPage'
import StudyPlanPage from './pages/StudyPlanPage'
import QuizPage from './pages/QuizPage'
import AIChatPage from './pages/AIChatPage'
import WeakTopicsPage from './pages/WeakTopicsPage'
import RevisionRoadmapPage from './pages/RevisionRoadmapPage'
import DashboardLayout from './layout/DashboardLayout'

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:id/:token" element={<ResetPasswordPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="syllabus" element={<SyllabusUploadPage />} />
            <Route path="study-plan" element={<StudyPlanPage />} />
            <Route path="quiz" element={<QuizPage />} />
            <Route path="chat" element={<AIChatPage />} />
            <Route path="weak-topics" element={<WeakTopicsPage />} />
            <Route path="roadmap" element={<RevisionRoadmapPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/landing" replace />} />
      </Routes>
    </BrowserRouter>
  )
}