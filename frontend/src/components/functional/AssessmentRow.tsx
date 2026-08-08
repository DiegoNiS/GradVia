import React from 'react';
import type { Assessment } from '../../types';
import { Input } from '../core/Input';

export interface AssessmentRowProps {
  assessment: Assessment;
  onUpdateGrade: (assessmentId: string, newGradeStr: string) => void;
  isSubstitute?: boolean;
}

export const AssessmentRow: React.FC<AssessmentRowProps> = ({
  assessment,
  onUpdateGrade,
  isSubstitute = false,
}) => {
  return (
    <div
      id={isSubstitute ? 'evaluation-item-substitute' : `evaluation-item-${assessment.id}`}
      className={`p-4 rounded-xl flex items-center justify-between group transition-colors ${
        isSubstitute ? 'border border-zinc-700/60 bg-zinc-900/60 mt-1' : 'neu-button'
      }`}
    >
      <div id={isSubstitute ? 'eval-info-substitute' : `eval-info-${assessment.id}`}>
        <p className="text-sm font-medium text-zinc-100">{assessment.name}</p>
        <p className="text-xs text-zinc-400 mt-0.5 font-mono">
          {isSubstitute
            ? 'Sustituye la nota más baja del curso'
            : assessment.weightPercentage !== null
            ? `Peso: ${assessment.weightPercentage}%`
            : 'Peso: No asignado'}
        </p>
      </div>
      <div id={isSubstitute ? 'eval-input-substitute' : `eval-input-${assessment.id}`} className="w-20">
        <Input
          id={isSubstitute ? 'input-substitute-grade' : `input-grade-${assessment.id}`}
          type="number"
          placeholder="--"
          min="0"
          max="20"
          step="0.5"
          defaultValue={assessment.grade || ''}
          onBlur={(e) => onUpdateGrade(assessment.id, e.target.value)}
          className="text-center font-mono font-medium text-sm py-1"
        />
      </div>
    </div>
  );
};
