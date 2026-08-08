import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  id: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon' | 'ghost-icon';
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  id,
  variant = 'secondary',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  let baseStyle = 'transition-all font-medium flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';
  
  let variantStyle = '';
  if (variant === 'primary' || variant === 'secondary') {
    variantStyle = 'neu-button text-zinc-100 rounded-xl px-4 py-2.5 text-xs hover:text-white';
  } else if (variant === 'icon') {
    variantStyle = 'neu-button text-zinc-200 hover:text-white rounded-xl w-8 h-8 p-0 text-sm';
  } else if (variant === 'ghost-icon') {
    variantStyle = 'text-zinc-400 hover:text-zinc-100 rounded-xl w-8 h-8 p-0 text-sm hover:bg-zinc-800/50 neu-button';
  } else if (variant === 'ghost') {
    variantStyle = 'text-zinc-400 hover:text-zinc-100 px-3 py-1.5 rounded-lg text-xs hover:bg-zinc-800/40';
  }

  return (
    <button
      id={id}
      disabled={disabled || loading}
      className={`${baseStyle} ${variantStyle} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="w-3.5 h-3.5 rounded-full border-t-2 border-zinc-200 animate-spin block"></span>
      ) : (
        children
      )}
    </button>
  );
};
