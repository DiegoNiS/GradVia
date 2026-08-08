import React, { useState } from 'react';
import { Input, type InputProps } from './Input';

export interface PasswordInputProps extends Omit<InputProps, 'type'> {}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  id,
  className = '',
  containerClassName = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div id={`password-input-wrapper-${id}`} className="relative w-full">
      <Input
        id={id}
        type={showPassword ? 'text' : 'password'}
        className={`pr-8 ${className}`}
        containerClassName={containerClassName}
        {...props}
      />
      {/* Botón neumórfico / minimalista del ojito */}
      <button
        id={`btn-toggle-password-visibility-${id}`}
        type="button"
        onClick={toggleShowPassword}
        tabIndex={-1}
        className="absolute right-1 bottom-2 text-zinc-400 hover:text-zinc-100 transition-colors focus:outline-none cursor-pointer"
        title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
      >
        {showPassword ? (
          /* Icono Ojo Abierto (Ocultar) */
          <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.75">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        ) : (
          /* Icono Ojo Cerrado / Tachado (Mostrar) */
          <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.75">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.326 16.17 7.26 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.738 0 8.672 3.33 10.066 7.5a10.423 10.423 0 01-2.617 4.19m-4.522-4.522a3 3 0 10-4.243-4.243m4.243 4.243L3 3m18 18l-4.243-4.243" />
          </svg>
        )}
      </button>
    </div>
  );
};
