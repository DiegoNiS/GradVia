import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { parseApiError, type ParsedApiError } from '../utils/apiError';
import { AuthPanel } from '../components/panels/AuthPanel';

export const AuthView: React.FC = () => {
  const [error, setError] = useState<ParsedApiError | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      const response = await loginUser(data);
      login(response.token, response.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(parseApiError(err));
    }
  };

  const handleRegister = async (data: { email: string; username: string; password: string }) => {
    try {
      const response = await registerUser(data);
      login(response.token, response.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(parseApiError(err));
    }
  };

  return (
    <div id="auth-container" className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 min-h-[calc(100vh-140px)]">
      <AuthPanel
        onLogin={handleLogin}
        onRegister={handleRegister}
        error={error}
        onClearError={() => setError(null)}
      />
    </div>
  );
};
