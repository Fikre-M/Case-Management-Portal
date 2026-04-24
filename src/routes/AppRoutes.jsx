import { Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import MainLayout from '../layouts/MainLayout'
import AuthLayout from '../layouts/AuthLayout'
import ProtectedRoute from '../components/common/ProtectedRoute'
import Loading from '../components/common/Loading'

// Lazy loaded components for code splitting
const Dashboard = lazy(() => import('../pages/dashboard/Dashboard'))
const Login = lazy(() => import('../pages/auth/Login'))
const Register = lazy(() => import('../pages/auth/Register'))
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'))
const Landing = lazy(() => import('../pages/Landing'))
const Demo = lazy(() => import('../pages/Demo'))
const DemoShowcase = lazy(() => import('../pages/DemoShowcase'))
const AppointmentsList = lazy(() => import('../pages/appointments/AppointmentsList'))
const AppointmentDetails = lazy(() => import('../pages/appointments/AppointmentDetails'))
const NewAppointment = lazy(() => import('../pages/appointments/NewAppointment'))
const EditAppointment = lazy(() => import('../pages/appointments/EditAppointment'))
const CaseList = lazy(() => import('../pages/cases/CaseList'))
const CaseDetails = lazy(() => import('../pages/cases/CaseDetails'))
const NewCase = lazy(() => import('../pages/cases/NewCase'))
const EditCase = lazy(() => import('../pages/cases/EditCase'))
const Clients = lazy(() => import('../pages/clients/Clients'))
const ClientDetails = lazy(() => import('../pages/clients/ClientDetails'))
const AiChatPage = lazy(() => import('../pages/ai/AiChatPage'))
const Calendar = lazy(() => import('../pages/calendar/Calendar'))
const Reports = lazy(() => import('../pages/reports/Reports'))
const Settings = lazy(() => import('../pages/settings/Settings'))
const Profile = lazy(() => import('../pages/profile/Profile'))
const TechShowcase = lazy(() => import('../pages/showcase/TechShowcase'))
const DocumentUpload = lazy(() => import('../pages/documents/DocumentUpload'))
const NotFound = lazy(() => import('../pages/NotFound'))

function AppRoutes() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Root Route - Redirect to Landing */}
        <Route path="/" element={<Navigate to="/landing" replace />} />
        
        {/* Landing Page - Public */}
        <Route path="/landing" element={<Landing />} />
        
        {/* Demo Mode - Public */}
        <Route path="/demo" element={<Demo />} />
        
        {/* Demo Showcase - Public */}
        <Route path="/demo-showcase" element={<DemoShowcase />} />
        
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* Main App Routes */}
        <Route element={<MainLayout />}>
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Appointments */}
            <Route path="/appointments" element={<AppointmentsList />} />
            <Route path="/appointments/new" element={<NewAppointment />} />
            <Route path="/appointments/:id" element={<AppointmentDetails />} />
            <Route path="/appointments/:id/edit" element={<EditAppointment />} />
            
            {/* Cases */}
            <Route path="/cases" element={<CaseList />} />
            <Route path="/cases/new" element={<NewCase />} />
            <Route path="/cases/:id" element={<CaseDetails />} />
            <Route path="/cases/:id/edit" element={<EditCase />} />
            
            {/* Clients */}
            <Route path="/clients" element={<Clients />} />
            <Route path="/clients/:id" element={<ClientDetails />} />
            
            {/* AI Assistant */}
            <Route path="/ai-assistant" element={<AiChatPage />} />
            
            {/* Calendar */}
            <Route path="/calendar" element={<Calendar />} />
            
            {/* Reports */}
            <Route path="/reports" element={<Reports />} />
            
            {/* Documents */}
            <Route path="/documents/upload" element={<DocumentUpload />} />
            
            {/* Tech Showcase */}
            <Route path="/showcase" element={<TechShowcase />} />
            
            {/* Settings & Profile */}
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes