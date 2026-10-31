import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './context/useAuth'
import LoginPage from './pages/auth/LoginPage'
import HomePage from './pages/home/HomePage'
import IntroPage from './pages/intro/IntroPage'
import NewPostDialog from './pages/home/NewPostDialog'
import NewStoryDialog from './pages/home/NewStoryDialog'
import CloseFriendsPage from './pages/home/CloseFriends'
import PostDialog from './pages/home/PostDialog'
import SettingsDialog from './pages/home/SettingsDialog'
import StoryViewer from './pages/home/StoryViewer'
import InboxPage from './pages/inbox/InboxPage'
import NotificationsPage from './pages/notifications/NotificationsPage'
import CategoryPage from './pages/places/CategoryPage'
import MapPage from './pages/places/MapPage'
import PlacePage from './pages/places/PlacePage'
import PlacesPage from './pages/places/PlacesPage'
import PreferencesPage from './pages/preferences/PreferencesPage'
import EditProfileDialog from './pages/profile/EditProfileDialog'
import ProfilePage from './pages/profile/ProfilePage'
import SavedPage from './pages/profile/SavedPage'
import SearchPage from './pages/search/SearchPage'
import AdminDashboardPage from './pages/staff/AdminDashboardPage'
import BusinessDashboardPage from './pages/staff/BusinessDashboardPage'
import BusinessSignupPage from './pages/staff/BusinessSignupPage'
import StaffLoginPage from './pages/staff/StaffLoginPage'

// Start each new page at the top.
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

// Visitors start at the intro (pick user / business / admin); signed-in users at their feed.
function StartPage() {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <Navigate to="/home" replace /> : <IntroPage />
}

function AppRoutes() {
  const { status } = useAuth()
  // Wait for a saved session to be restored before routing.
  if (status === 'loading') return null

  return (
    <Routes>
      {/* Public: visitors can browse places and public profiles (SRS §2, Visitor). */}
      <Route path="/" element={<StartPage />} />
      <Route path="/login" element={<LoginPage mode="login" />} />
      <Route path="/register" element={<LoginPage mode="register" />} />
      <Route path="/places" element={<PlacesPage />} />
      <Route path="/category/:categoryId" element={<CategoryPage />} />
      <Route path="/place/:placeId" element={<PlacePage />} />
      <Route path="/map" element={<MapPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/u/:username" element={<ProfilePage />} />

      {/* Signed-in users. Dialogs open over the page they belong to. */}
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/post/:postId" element={<HomePage overlay={<PostDialog />} />} />
        <Route path="/story/:username" element={<HomePage overlay={<StoryViewer />} />} />
        <Route path="/new-post" element={<HomePage overlay={<NewPostDialog />} />} />
        <Route path="/new-story" element={<HomePage overlay={<NewStoryDialog />} />} />
        <Route path="/close-friends" element={<HomePage overlay={<CloseFriendsPage />} />} />
        <Route path="/settings" element={<HomePage overlay={<SettingsDialog />} />} />
        <Route path="/me" element={<ProfilePage />} />
        <Route path="/saved" element={<SavedPage />} />
        <Route path="/edit" element={<ProfilePage overlay={<EditProfileDialog />} />} />
        <Route path="/inbox" element={<InboxPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/preferences" element={<PreferencesPage />} />
      </Route>

      {/* Administrators and business owners have their own sign-in. */}
      <Route path="/admin/login" element={<StaffLoginPage variant="admin" />} />
      <Route path="/admin" element={<AdminDashboardPage />} />
      <Route path="/business/login" element={<StaffLoginPage variant="business" />} />
      <Route path="/business/signup" element={<BusinessSignupPage />} />
      <Route path="/business" element={<BusinessDashboardPage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
