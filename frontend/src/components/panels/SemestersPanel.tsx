import React from 'react';
import type { Semester } from '../../types';
import { Card } from '../core/Card';
import { Button } from '../core/Button';
import { SemesterItem } from '../functional/SemesterItem';

export interface SemestersPanelProps {
  semesters: Semester[];
  selectedSemester: Semester | null;
  onSelectSemester: (semester: Semester) => void;
  onOpenCreateModal: () => void;
}

export const SemestersPanel: React.FC<SemestersPanelProps> = ({
  semesters,
  selectedSemester,
  onSelectSemester,
  onOpenCreateModal,
}) => {
  return (
    <Card
      id="panel-semesters"
      className="w-full xl:w-1/3 flex flex-col gap-4"
    >
      <div id="semesters-header" className="mb-2 flex flex-row justify-between items-center w-full gap-2">
        <div>
          <h2 className="text-base font-medium tracking-wide text-zinc-100">Semestres</h2>
          <p className="text-xs text-zinc-400 mt-0.5">Tus periodos académicos</p>
        </div>
        <Button
          id="btn-add-semester"
          variant="icon"
          onClick={onOpenCreateModal}
          title="Nuevo Semestre"
        >
          +
        </Button>
      </div>

      <div id="semesters-list" className="w-full flex xl:flex-col gap-3 overflow-auto pb-2 xl:pb-0 hide-scrollbar">
        {semesters.length === 0 ? (
          <div className="w-full py-8 text-center text-xs text-zinc-400 border border-zinc-800/60 rounded-2xl p-4">
            Aún no tienes semestres. Crea uno o impórtalo desde la configuración.
          </div>
        ) : (
          semesters.map((sem) => (
            <SemesterItem
              key={sem.id}
              semester={sem}
              isSelected={selectedSemester?.id === sem.id}
              onSelect={onSelectSemester}
            />
          ))
        )}
      </div>
    </Card>
  );
};
