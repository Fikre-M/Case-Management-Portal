import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import AuthLayout from '../layouts/AuthLayout'
import Dashboard from '../pages/dashboard/Dashboard'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import ForgotPassword from '../pages/auth/ForgotPassword'
import AppointmentsList from '../pages/appointments/AppointmentsList'
import AppointmentDetails from '../pages/appointments/AppointmentDetails'
import NewAppointment from '../pages/appointments/NewAppointment'
import EditAppointment from '../pages/appointments/EditAppointment'
import CaseList from '../pages/cases/CaseList'
import CaseDetails from '../pages/cases/CaseDetails'
import NewCase from '../pages/cases/NewCase'
import EditCase from '../pages/cases/EditCase'
import Clients from '../pages/clients/Clients'
import ClientDetails from '../pages/clients/ClientDetails'
import AiChatPage from '../pages/ai/AiChatPage'
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
