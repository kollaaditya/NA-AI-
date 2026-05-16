import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/ui/ErrorBoundary';
import ProtectedRoute from './components/ui/ProtectedRoute';
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ProductAnalyzerPage from './pages/dashboard/ProductAnalyzerPage';
import ProposalGeneratorPage from './pages/dashboard/ProposalGeneratorPage';
import ImpactReportPage from './pages/dashboard/ImpactReportPage';
import ChatSupportPage from './pages/dashboard/ChatSupportPage';
import AdminPage from './pages/dashboard/AdminPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<PublicLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Route>
              <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/dashboard/products" element={<ProductAnalyzerPage />} />
                <Route path="/dashboard/proposals" element={<ProposalGeneratorPage />} />
                <Route path="/dashboard/impact" element={<ImpactReportPage />} />
                <Route path="/dashboard/chat" element={<ChatSupportPage />} />
                <Route path="/dashboard/admin" element={<AdminPage />} />
              </Route>
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </BrowserRouter>
          <ToastContainer
            position="top-right"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
            theme="dark"
            toastStyle={{ background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)' }}
          />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
