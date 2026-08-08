import React from 'react';
import type { ParsedApiError } from '../../utils/apiError';

interface ErrorMessageProps {
  error: ParsedApiError | string | null;
  onClose?: () => void;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, onClose, className = '' }) => {
  if (!error) return null;

  const parsedError: ParsedApiError = typeof error === 'string' ? { message: error } : error;

  return (
    <div
      id="error-message-alert"
      className={`w-full bg-[#181818] border border-zinc-700/60 text-zinc-200 rounded-2xl p-4 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.6),_inset_-2px_-2px_5px_rgba(255,255,255,0.05)] transition-all duration-300 ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-full bg-[#1e1e1e] border border-zinc-700 flex items-center justify-center flex-shrink-0 shadow-[2px_2px_4px_rgba(0,0,0,0.5),_-2px_-2px_4px_rgba(255,255,255,0.04)] mt-0.5">
            <span className="text-zinc-300 font-bold text-xs">!</span>
          </div>

          <div className="flex flex-col gap-1">
            <h4 className="text-sm font-medium text-zinc-100 leading-tight">
              {parsedError.message}
            </h4>

            {parsedError.details && parsedError.details.length > 0 && (
              <div id="error-details-list" className="mt-2 space-y-1.5 border-t border-zinc-800 pt-2">
                <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider block">
                  Detalles del error:
                </span>
                <ul className="space-y-1">
                  {parsedError.details.map((detail, index) => (
                    <li key={index} className="text-xs text-zinc-300 flex items-start gap-1.5">
                      <span className="text-zinc-500 font-mono select-none">•</span>
                      <span>
                        {detail.field && (
                          <span className="font-mono bg-zinc-800 border border-zinc-700 text-zinc-200 px-1.5 py-0.5 rounded text-[10px] mr-1.5 uppercase font-medium">
                            {detail.field}
                          </span>
                        )}
                        {detail.message}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-100 text-xs font-mono px-2 py-1 rounded-lg hover:bg-zinc-800 transition-colors"
            title="Cerrar error"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};
