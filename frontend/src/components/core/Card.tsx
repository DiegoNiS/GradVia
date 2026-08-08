import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
  variant?: 'raised' | 'raised-sm' | 'inset';
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  id,
  variant = 'raised',
  children,
  className = '',
  ...props
}) => {
  let styleClass = 'neu-card rounded-3xl p-6';
  if (variant === 'raised-sm') {
    styleClass = 'neu-card-sm rounded-2xl p-4';
  } else if (variant === 'inset') {
    styleClass = 'neu-input rounded-2xl p-4';
  }

  return (
    <div id={id} className={`${styleClass} ${className}`} {...props}>
      {children}
    </div>
  );
};
