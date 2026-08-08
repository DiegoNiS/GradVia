import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: string;
  error?: string;
  containerClassName?: string;
}

export const Input: React.FC<InputProps> = ({
  id,
  label,
  error,
  containerClassName = '',
  className = '',
  ...props
}) => {
  return (
    <div id={`field-container-${id}`} className={`flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label htmlFor={id} className="text-xs text-zinc-300 font-medium ml-0.5">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full bg-transparent border-b border-zinc-700/80 rounded-none py-2 px-1 text-sm text-zinc-100 placeholder-zinc-500 font-sans focus:outline-none focus:border-zinc-100 transition-colors ${className}`}
        {...props}
      />
      {error && (
        <span className="text-[11px] text-zinc-400 font-mono mt-0.5 ml-0.5">
          {error}
        </span>
      )}
    </div>
  );
};
