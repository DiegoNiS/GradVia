import React, { useState } from 'react';
import { Button } from '../core/Button';
import { Card } from '../core/Card';
import { ErrorMessage } from '../core/ErrorMessage';
import type { ParsedApiError } from '../../utils/apiError';

export interface ImportCsvModalProps {
  isOpen: boolean;
  courseCount: number;
  onClose: () => void;
  onSubmit: () => Promise<void>;
  error: ParsedApiError | null;
  onClearError: () => void;
}

export const ImportCsvModal: React.FC<ImportCsvModalProps> = ({
  isOpen,
  courseCount,
  onClose,
  onSubmit,
  error,
  onClearError,
}) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="modal-import-overlay" className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
      <Card id="modal-import-card" className="w-full max-w-sm">
        <h3 className="text-base font-medium mb-2 text-zinc-100">Importar Cursos</h3>
        <p className="text-xs text-zinc-400 mb-4">
          Se encontraron <strong className="text-zinc-200">{courseCount}</strong> cursos en el archivo CSV. 
          ¿Deseas importarlos a un nuevo semestre?
        </p>

        {error && (
          <ErrorMessage error={error} onClose={onClearError} className="mb-4" />
        )}

        <form id="form-import-csv" onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex justify-end gap-3 pt-2">
            <Button id="btn-cancel-import-modal" type="button" variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button id="btn-submit-import-modal" type="submit" variant="primary" loading={loading}>
              Importar
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
