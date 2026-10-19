import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './context/useAuth'
import AuthPage from './pages/auth/AuthPage'
import OnboardingPage from './pages/onboarding/OnboardingPage'
import PlaceholderPage from './pages/PlaceholderPage'
import SplashPage from './pages/splash/SplashPage'

function AppRoutes() {
  const { status } = useAuth()
  // Wait for a saved session to be restored before routing.
  if (status === 'loading') return null

  return (
    <Routes>
      {/* Intro animation is the first screen; its button leads to sign in. */}
      <Route path="/" element={<SplashPage />} />
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/register" element={<AuthPage mode="register" />} />
      <Route path="/forgot-password" element={<PlaceholderPage title="استعادة كلمة المرور" />} />
      <Route path="/home" element={<PlaceholderPage title="الرئيسية" />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/profile" element={<PlaceholderPage title="الملف الشخصي" />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
