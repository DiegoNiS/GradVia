import React, { useState, useEffect } from 'react';
import { Input } from '../core/Input';
import { Button } from '../core/Button';
import { Card } from '../core/Card';
import { ErrorMessage } from '../core/ErrorMessage';
import type { ParsedApiError } from '../../utils/apiError';

export interface ImportCsvModalProps {
  isOpen: boolean;
  defaultSemesterName: string;
  courseCount: number;
  onClose: () => void;
  onSubmit: (semesterName: string) => Promise<void>;
  error: ParsedApiError | null;
  onClearError: () => void;
}

export const ImportCsvModal: React.FC<ImportCsvModalProps> = ({
  isOpen,
  defaultSemesterName,
  courseCount,
  onClose,
  onSubmit,
  error,
  onClearError,
}) => {
  const [semesterName, setSemesterName] = useState(defaultSemesterName);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSemesterName(defaultSemesterName);
  }, [defaultSemesterName]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!semesterName.trim()) return;
    setLoading(true);
    try {
      await onSubmit(semesterName);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="modal-import-overlay" className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
      <Card id="modal-import-card" className="w-full max-w-sm">
        <h3 className="text-base font-medium mb-2 text-zinc-100">Importar Semestre</h3>
        <p className="text-xs text-zinc-400 mb-4">
          Se encontraron <strong className="text-zinc-200">{courseCount}</strong> cursos en el archivo CSV. 
          Por favor, confirma el nombre del semestre a guardar.
        </p>

        {error && (
          <ErrorMessage error={error} onClose={onClearError} className="mb-4" />
        )}

        <form id="form-import-csv" onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input
            id="input-import-semester-name"
            autoFocus
            type="text"
            label="Nombre del Semestre a Importar"
            required
            value={semesterName}
            onChange={(e) => setSemesterName(e.target.value)}
          />
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
