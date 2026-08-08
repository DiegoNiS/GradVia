import React from 'react';
import type { Semester } from '../../types';

export interface SemesterItemProps {
  semester: Semester;
  index: number;
  isSelected: boolean;
  onSelect: (semester: Semester) => void;
}

export const SemesterItem: React.FC<SemesterItemProps> = ({
  semester,
  index,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      id={`semester-item-${semester.id}`}
      onClick={() => onSelect(semester)}
      className={`w-full min-w-[160px] xl:min-w-0 p-4 rounded-2xl cursor-pointer transition-all duration-200 flex-shrink-0 ${
        isSelected
          ? 'bg-zinc-800/90 border border-zinc-500/50 text-white shadow-sm'
          : 'neu-button hover:border-zinc-700'
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-sm text-zinc-100">Semestre {semester.number || index + 1}</h3>
          <p className="text-xs text-zinc-400 mt-1 font-mono">Promedio: {semester.gpa || 0}</p>
        </div>
        {semester.isCurrent && (
          <span
            className="w-2 h-2 rounded-full bg-zinc-200 shadow-[0_0_6px_rgba(255,255,255,0.8)] mt-1"
            title="Semestre Actual"
          ></span>
        )}
      </div>
    </div>
  );
};
