import React, { useState } from 'react';
import { Card } from '../core/Card';
import { Button } from '../core/Button';

export interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerImport: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onTriggerImport,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  if (!isOpen) return null;

  const handleImportClick = () => {
    onClose();
    onTriggerImport();
  };

  return (
    <div id="modal-settings-overlay" className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
      <Card id="modal-settings-card" className="w-full max-w-sm p-6">
        <div className="flex justify-between items-center mb-6 pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-zinc-300 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.75">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h3 className="text-base font-medium text-zinc-100">Configuración</h3>
          </div>
          <Button id="btn-close-settings-modal" variant="ghost-icon" onClick={onClose} title="Cerrar">
            ✕
          </Button>
        </div>

        <div id="settings-options-list" className="flex flex-col gap-4">
          {/* Opción 1: Importar Semestre desde CSV */}
          <div className="flex items-center justify-between p-3 border border-zinc-800 bg-zinc-900/40 rounded-2xl">
            <div>
              <p className="text-xs font-medium text-zinc-200">Importar Semestre</p>
              <p className="text-[11px] text-zinc-400">Cargar datos académicos desde archivo CSV</p>
            </div>
            <Button
              id="btn-settings-import-csv"
              variant="secondary"
              onClick={handleImportClick}
              className="text-xs px-3 py-1.5"
            >
              Cargar CSV
            </Button>
          </div>

          {/* Opción 2: Tema de la aplicación (Dark / Light) */}
          <div className="flex items-center justify-between p-3 border border-zinc-800 bg-zinc-900/40 rounded-2xl">
            <div>
              <p className="text-xs font-medium text-zinc-200">Tema de la Interfaz</p>
              <p className="text-[11px] text-zinc-400">
                {isDarkMode ? 'Modo Oscuro Monocromático' : 'Modo Claro'}
              </p>
            </div>
            <button
              id="btn-settings-theme-toggle"
              type="button"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="w-11 h-6 rounded-full transition-all relative flex items-center border border-zinc-700 bg-zinc-900 p-0.5 cursor-pointer"
            >
              <span
                className={`w-5 h-5 rounded-full bg-zinc-200 shadow-md transform transition-transform ${
                  isDarkMode ? 'translate-x-5 bg-zinc-100' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button id="btn-close-settings" variant="ghost" onClick={onClose}>
            Listo
          </Button>
        </div>
      </Card>
    </div>
  );
};
