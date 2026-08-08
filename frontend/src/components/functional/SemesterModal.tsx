import React, { useState } from 'react';
import { Input } from '../core/Input';
import { Button } from '../core/Button';
import { Card } from '../core/Card';
import { ErrorMessage } from '../core/ErrorMessage';
import type { ParsedApiError } from '../../utils/apiError';

export interface SemesterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => Promise<void>;
  error: ParsedApiError | null;
  onClearError: () => void;
}

export const SemesterModal: React.FC<SemesterModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  error,
  onClearError,
}) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      await onSubmit(name);
      setName('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="modal-semester-overlay" className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
      <Card id="modal-semester-card" className="w-full max-w-sm">
        <h3 className="text-base font-medium mb-4 text-zinc-100">Nuevo Semestre</h3>
        
        {error && (
          <ErrorMessage error={error} onClose={onClearError} className="mb-4" />
        )}

        <form id="form-create-semester" onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input
            id="input-semester-name"
            autoFocus
            type="text"
            label="Nombre del Semestre"
            placeholder="Ej. Semestre 2026-I"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button id="btn-cancel-semester-modal" type="button" variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button id="btn-submit-semester-modal" type="submit" variant="primary" loading={loading}>
              Crear
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
