
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { Loader2 } from 'lucide-react';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
        <span className="ml-2 text-lg">Carregando...</span>
      </div>
    );
  }

  if (!user) {
    // Redirecionar para a página de login, preservando a rota pretendida
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
