import React, { useState, useRef, useEffect } from 'react';
import type { Semester } from '../../types';

export interface SemesterItemProps {
  semester: Semester;
  index: number;
  isSelected: boolean;
  onSelect: (semester: Semester) => void;
  onSetCurrent: (semester: Semester) => void;
  onArchive: (semester: Semester) => void;
  onDelete: (semester: Semester) => void;
}

export const SemesterItem: React.FC<SemesterItemProps> = ({
  semester,
  index,
  isSelected,
  onSelect,
  onSetCurrent,
  onArchive,
  onDelete,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  return (
    <div
      id={`semester-item-${semester.id}`}
      onClick={() => onSelect(semester)}
      className={`relative w-full p-4 rounded-2xl cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'bg-zinc-800/90 border border-zinc-500/50 text-white shadow-sm'
          : 'neu-button hover:border-zinc-700'
      }`}
    >
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-medium text-sm text-zinc-100 truncate">
              Semestre {semester.number || index + 1}
            </h3>
            {semester.isCurrent && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-950 font-semibold tracking-tight">
                Actual
              </span>
            )}
            {semester.isArchived && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-400 border border-zinc-700">
                Archivado
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-400 mt-1 font-mono">Promedio: {semester.gpa || 0}</p>
        </div>

        {/* Botón de 3 puntos (Opciones del Semestre) */}
        <div className="relative" ref={menuRef} onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => setShowMenu((prev) => !prev)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700/50 transition-colors"
            title="Opciones"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
          </button>

          {/* Menú Desplegable Neumórfico */}
          {showMenu && (
            <div className="absolute right-0 top-8 z-50 w-44 p-1 rounded-xl bg-zinc-900 border border-zinc-700/80 shadow-2xl backdrop-blur-md flex flex-col gap-0.5 text-xs">
              {!semester.isCurrent && (
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    onSetCurrent(semester);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-zinc-200 hover:bg-zinc-800 transition-colors flex items-center gap-2"
                >
                  <svg className="w-3.5 h-3.5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Marcar como Actual
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  onArchive(semester);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-zinc-200 hover:bg-zinc-800 transition-colors flex items-center gap-2"
              >
                <svg className="w-3.5 h-3.5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.75">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v1a2 2 0 01-2 2M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                {semester.isArchived ? 'Desarchivar' : 'Archivar Semestre'}
              </button>

              <div className="h-px bg-zinc-800 my-0.5"></div>

              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  onDelete(semester);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors flex items-center gap-2 font-medium"
              >
                <svg className="w-3.5 h-3.5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.75">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Eliminar Semestre
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
