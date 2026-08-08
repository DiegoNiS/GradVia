import React, { useState } from 'react';
import { Card } from '../core/Card';
import { Input } from '../core/Input';
import { PasswordInput } from '../core/PasswordInput';
import { Button } from '../core/Button';
import { ErrorMessage } from '../core/ErrorMessage';
import type { ParsedApiError } from '../../utils/apiError';

export interface AuthPanelProps {
  onLogin: (data: { email: string; password: string }) => Promise<void>;
  onRegister: (data: { email: string; username: string; password: string }) => Promise<void>;
  error: ParsedApiError | null;
  onClearError: () => void;
}

export const AuthPanel: React.FC<AuthPanelProps> = ({
  onLogin,
  onRegister,
  error,
  onClearError,
}) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onClearError();
    setLoading(true);

    try {
      if (isLogin) {
        await onLogin({ email, password });
      } else {
        await onRegister({ email, username, password });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card id="auth-panel" className="w-full max-w-md p-8">
      <h2 className="text-xl font-medium tracking-tight mb-1 text-center text-zinc-100">
        {isLogin ? 'Bienvenido a GradVia' : 'Únete a GradVia'}
      </h2>
      <p className="text-xs text-zinc-400 mb-6 text-center">
        {isLogin ? 'Inicia sesión para continuar' : 'Crea tu cuenta para empezar a gestionar tus notas'}
      </p>

      {error && (
        <ErrorMessage error={error} onClose={onClearError} className="mb-6" />
      )}

      <form id="auth-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
        {!isLogin && (
          <Input
            id="input-username"
            label="Usuario"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required={!isLogin}
            placeholder="tu_usuario"
          />
        )}

        <Input
          id="input-email"
          label="Correo Electrónico"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="correo@ejemplo.com"
        />

        <PasswordInput
          id="input-password"
          label="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
        />

        <Button
          id="btn-auth-submit"
          type="submit"
          variant="primary"
          loading={loading}
          className="w-full mt-4 py-3"
        >
          {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
        </Button>
      </form>

      <div id="auth-switch-container" className="mt-6 text-center text-xs text-zinc-400">
        {isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
        <button
          id="btn-switch-auth-mode"
          type="button"
          onClick={() => {
            setIsLogin(!isLogin);
            onClearError();
          }}
          className="ml-2 text-zinc-200 font-medium hover:underline focus:outline-none cursor-pointer"
        >
          {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
        </button>
      </div>
    </Card>
  );
};
