// src/pages/admin/AdminRoutes.tsx - Fixed with relative imports
import React from 'react';
import { Routes, Route } from 'react-router-dom';
// FIXED: Use relative import instead of @ alias
import AdminLayout from '../../components/AdminLayout';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import UserManagement from './UserManagement';
import CriticManagement from './CriticManagement';
import ContentManagement from './ContentManagement';
import QuizManagement from './QuizManagement';
import ReviewSubmissions from './ReviewSubmissions';

// Admin route protection wrapper
const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const adminUser = localStorage.getItem('adminUser');
  
  if (!adminUser) {
    return <AdminLogin />;
  }
  
  return <>{children}</>;
};

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route path="/*" element={
        <AdminProtectedRoute>
          <AdminLayout>
            <Routes>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/dashboard" element={<AdminDashboard />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/critics" element={<CriticManagement />} />
              <Route path="/content" element={<ContentManagement />} />
              <Route path="/quizzes" element={<QuizManagement />} />
              <Route path="/submissions" element={<ReviewSubmissions />} />
              <Route path="*" element={<AdminDashboard />} />
            </Routes>
          </AdminLayout>
        </AdminProtectedRoute>
      } />
    </Routes>
  );
}