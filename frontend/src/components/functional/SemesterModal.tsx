import React, { useState, useEffect } from 'react';
import { Button } from '../core/Button';
import { Card } from '../core/Card';
import { ErrorMessage } from '../core/ErrorMessage';
import type { ParsedApiError } from '../../utils/apiError';

export interface SemesterModalProps {
  isOpen: boolean;
  existingNumbers?: number[];
  onClose: () => void;
  onSubmit: (semesterNumber: number) => Promise<void>;
  error: ParsedApiError | null;
  onClearError: () => void;
}

export const SemesterModal: React.FC<SemesterModalProps> = ({
  isOpen,
  existingNumbers = [],
  onClose,
  onSubmit,
  error,
  onClearError,
}) => {
  const [activeGroup, setActiveGroup] = useState<number>(0); // 0: 1-10, 1: 11-20, 2: 21-30
  const [selectedNumber, setSelectedNumber] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Buscar el menor número disponible que no exista aún
      let firstAvailable = 1;
      while (existingNumbers.includes(firstAvailable)) {
        firstAvailable++;
      }
      setSelectedNumber(firstAvailable);

      // Determinar en qué grupo de 10 se ubica
      if (firstAvailable <= 10) setActiveGroup(0);
      else if (firstAvailable <= 20) setActiveGroup(1);
      else setActiveGroup(2);
    }
  }, [isOpen, existingNumbers]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(selectedNumber);
    } finally {
      setLoading(false);
    }
  };

  // Generar números de 10 en 10 según el grupo activo
  const startNum = activeGroup * 10 + 1;
  const currentGroupNumbers = Array.from({ length: 10 }, (_, i) => startNum + i);

  return (
    <div id="modal-semester-overlay" className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
      <Card id="modal-semester-card" className="w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-medium text-zinc-100">Nuevo Semestre</h3>
          <span className="text-xs text-zinc-400 font-mono">Seleccionado: Semestre {selectedNumber}</span>
        </div>
        <p className="text-xs text-zinc-400 mb-4">
          Selecciona el número de semestre que deseas agregar:
        </p>

        {error && (
          <ErrorMessage error={error} onClose={onClearError} className="mb-4" />
        )}

        <form id="form-create-semester" onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Pestañas de Agrupación de 10 en 10 */}
          <div className="flex items-center gap-1.5 p-1 bg-zinc-900/80 border border-zinc-800 rounded-xl">
            {[
              { label: '1 - 10', index: 0 },
              { label: '11 - 20', index: 1 },
              { label: '21 - 30', index: 2 },
            ].map((tab) => (
              <button
                key={tab.index}
                type="button"
                onClick={() => setActiveGroup(tab.index)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  activeGroup === tab.index
                    ? 'bg-zinc-800 text-zinc-100 font-medium border border-zinc-700 shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Cuadrícula de 10 Pills (5 cols x 2 filas) */}
          <div id="semester-selector-grid" className="grid grid-cols-5 gap-2.5 p-1">
            {currentGroupNumbers.map((num) => {
              const isTaken = existingNumbers.includes(num);
              const isSelected = selectedNumber === num;

              return (
                <button
                  key={num}
                  type="button"
                  disabled={isTaken}
                  onClick={() => setSelectedNumber(num)}
                  className={`h-14 rounded-xl flex flex-col items-center justify-center transition-all duration-200 font-mono border ${
                    isTaken
                      ? 'border-zinc-800/40 bg-zinc-900/30 text-zinc-600 cursor-not-allowed'
                      : isSelected
                      ? 'border-zinc-100 bg-zinc-100 text-zinc-950 font-bold shadow-md scale-105'
                      : 'border-zinc-800 bg-zinc-900/80 text-zinc-200 hover:border-zinc-500 hover:text-white neu-button'
                  }`}
                >
                  <span className="text-base font-semibold">{num}</span>
                  {isTaken && (
                    <span className="text-[9px] text-zinc-600 uppercase font-mono mt-0.5">Creado</span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-zinc-800/80">
            <Button id="btn-cancel-semester-modal" type="button" variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button id="btn-submit-semester-modal" type="submit" variant="primary" loading={loading}>
              Crear Semestre {selectedNumber}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
