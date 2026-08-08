import React from 'react';

export interface SwitchProps {
  id: string;
  checked: boolean;
  onChange: () => void;
  label?: string;
  className?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  id,
  checked,
  onChange,
  label,
  className = '',
}) => {
  return (
    <div id={`switch-container-${id}`} className={`flex items-center justify-between ${className}`}>
      {label && <span className="text-xs font-medium text-zinc-300">{label}</span>}
      <button
        id={id}
        type="button"
        onClick={onChange}
        className={`w-12 h-6 rounded-full transition-all relative flex items-center neu-input p-0.5 cursor-pointer ${
          checked ? 'border-zinc-500' : ''
        }`}
      >
        <span
          className={`w-5 h-5 rounded-full bg-zinc-200 shadow-md transform transition-transform ${
            checked ? 'translate-x-6 bg-zinc-100' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
};
