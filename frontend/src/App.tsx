import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/MainLayout';
import { DashboardView } from './views/DashboardView';
import { CourseDetailsView } from './views/CourseDetailsView';
import { AuthView } from './views/AuthView';
import { AuthProvider, useAuth } from './context/AuthContext';

// Rutas protegidas que requieren autenticación
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black">
        <div className="w-8 h-8 rounded-full border-t-2 border-accent animate-spin"></div>
      </div>
    );
  }
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<AuthView />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardView />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/course/:id" 
        element={
          <ProtectedRoute>
            <CourseDetailsView />
          </ProtectedRoute>
        } 
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <div id="app-root">
      <AuthProvider>
        <BrowserRouter>
          <MainLayout>
            <AppRoutes />
          </MainLayout>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
