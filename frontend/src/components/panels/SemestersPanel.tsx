import React, { useState } from 'react';
import type { Semester } from '../../types';
import { Card } from '../core/Card';
import { Button } from '../core/Button';
import { SemesterItem } from '../functional/SemesterItem';

export interface SemestersPanelProps {
  semesters: Semester[];
  selectedSemester: Semester | null;
  onSelectSemester: (semester: Semester) => void;
  onOpenCreateModal: () => void;
  onSetCurrentSemester: (semester: Semester) => void;
  onArchiveSemester: (semester: Semester) => void;
  onDeleteSemester: (semester: Semester) => void;
}

export const SemestersPanel: React.FC<SemestersPanelProps> = ({
  semesters,
  selectedSemester,
  onSelectSemester,
  onOpenCreateModal,
  onSetCurrentSemester,
  onArchiveSemester,
  onDeleteSemester,
}) => {
  const [showArchived, setShowArchived] = useState(false);

  // 1. Filtrar archivados por defecto
  const visibleSemesters = semesters.filter((s) => (showArchived ? true : !s.isArchived));

  // 2. Ordenar: Primero el semestre actual (isCurrent: true), seguido de los demás en orden inverso (más reciente/alto primero, más antiguo al final/debajo)
  const sortedSemesters = [...visibleSemesters].sort((a, b) => {
    if (a.isCurrent && !b.isCurrent) return -1;
    if (!a.isCurrent && b.isCurrent) return 1;
    return b.number - a.number;
  });

  const hasArchived = semesters.some((s) => s.isArchived);

  return (
    <Card
      id="panel-semesters"
      className="w-full xl:w-1/3 flex flex-col gap-4"
    >
      <div id="semesters-header" className="mb-1 flex flex-row justify-between items-center w-full gap-2">
        <div>
          <h2 className="text-base font-medium tracking-wide text-zinc-100">Semestres</h2>
          <p className="text-xs text-zinc-400 mt-0.5">Tus periodos académicos</p>
        </div>
        
        <div className="flex items-center gap-2">
          {hasArchived && (
            <button
              type="button"
              onClick={() => setShowArchived((prev) => !prev)}
              className="text-[11px] font-mono px-2 py-1 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-200 transition-colors"
              title={showArchived ? 'Ocultar archivados' : 'Mostrar archivados'}
            >
              {showArchived ? 'Ver Activos' : 'Ver Archivados'}
            </button>
          )}
          <Button
            id="btn-add-semester"
            variant="icon"
            onClick={onOpenCreateModal}
            title="Nuevo Semestre"
          >
            +
          </Button>
        </div>
      </div>

      {/* Disposición Responsiva: Cuadrícula en dispositivos pequeños, Lista vertical en Desktop */}
      <div id="semesters-list" className="w-full grid grid-cols-2 sm:grid-cols-3 xl:flex xl:flex-col gap-3">
        {sortedSemesters.length === 0 ? (
          <div className="col-span-full w-full py-8 text-center text-xs text-zinc-400 border border-zinc-800/60 rounded-2xl p-4">
            {showArchived
              ? 'No tienes semestres archivados.'
              : 'Aún no tienes semestres activos. Crea uno con el botón "+" o impórtalo desde la configuración.'}
          </div>
        ) : (
          sortedSemesters.map((sem, index) => (
            <SemesterItem
              key={sem.id}
              semester={sem}
              index={index}
              isSelected={selectedSemester?.id === sem.id}
              onSelect={onSelectSemester}
              onSetCurrent={onSetCurrentSemester}
              onArchive={onArchiveSemester}
              onDelete={onDeleteSemester}
            />
          ))
        )}
      </div>
    </Card>
  );
};
