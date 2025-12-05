import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import AuthLayout from '../layouts/AuthLayout'
import Dashboard from '../pages/Dashboard'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import ForgotPassword from '../pages/auth/ForgotPassword'
import Appointments from '../pages/appointments/Appointments'
import AppointmentDetails from '../pages/appointments/AppointmentDetails'
import CreateAppointment from '../pages/appointments/CreateAppointment'
import Cases from '../pages/cases/Cases'
import CaseDetails from '../pages/cases/CaseDetails'
import CreateCase from '../pages/cases/CreateCase'
import Clients from '../pages/clients/Clients'
import ClientDetails from '../pages/clients/ClientDetails'
import AIAssistant from '../pages/ai/AIAssistant'
import Calendar from '../pages/calendar/Calendar'
import Reports from '../pages/reports/Reports'
import Settings from '../pages/settings/Settings'
import Profile from '../pages/profile/Profile'
import NotFound from '../pages/NotFound'

function AppRoutes() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Main App Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Appointments */}
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/appointments/:id" element={<AppointmentDetails />} />
        <Route path="/appointments/new" element={<CreateAppointment />} />
        
        {/* Cases */}
        <Route path="/cases" element={<Cases />} />
        <Route path="/cases/:id" element={<CaseDetails />} />
        <Route path="/cases/new" element={<CreateCase />} />
        
        {/* Clients */}
        <Route path="/clients" element={<Clients />} />
        <Route path="/clients/:id" element={<ClientDetails />} />
        
        {/* AI Assistant */}
        <Route path="/ai-assistant" element={<AIAssistant />} />
        
        {/* Calendar */}
        <Route path="/calendar" element={<Calendar />} />
        
        {/* Reports */}
        <Route path="/reports" element={<Reports />} />
        
        {/* Settings & Profile */}
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes
