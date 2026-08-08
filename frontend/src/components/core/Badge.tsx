import React from 'react';

export interface BadgeProps {
  id: string;
  children: React.ReactNode;
  variant?: 'flat' | 'outline';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  id,
  children,
  variant = 'flat',
  className = '',
}) => {
  const baseStyle = variant === 'flat'
    ? 'bg-zinc-900/60 border border-zinc-700/60 px-3 py-1.5 rounded-xl font-mono text-sm font-medium text-zinc-100'
    : 'border border-zinc-700 bg-zinc-800/40 px-2 py-0.5 rounded text-xs text-zinc-300 font-mono';

  return (
    <div id={id} className={`${baseStyle} ${className}`}>
      {children}
    </div>
  );
};
