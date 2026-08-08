import React, { useState, useEffect } from 'react';
import type { Assessment } from '../../types';
import { Input } from '../core/Input';

export interface AssessmentRowProps {
  assessment: Assessment;
  index?: number;
  title?: string;
  onUpdateGrade: (assessmentId: string, newGradeStr: string) => void;
  onUpdateWeight?: (assessmentId: string, newWeightStr: string) => void;
  isSubstitute?: boolean;
}

export const AssessmentRow: React.FC<AssessmentRowProps> = ({
  assessment,
  index = 0,
  title,
  onUpdateGrade,
  onUpdateWeight,
  isSubstitute = false,
}) => {
  const displayTitle = title || (
    isSubstitute
      ? 'Examen Sustitutorio'
      : assessment.type === 'MIDTERM'
      ? `Parcial ${assessment.number || (index + 1)}`
      : assessment.type === 'CONTINUOUS'
      ? `Continua ${assessment.number || (index + 1)}`
      : `Evaluación ${assessment.number || (index + 1)}`
  );

  const [gradeInput, setGradeInput] = useState<string>(
    assessment.grade && assessment.grade > 0 ? String(Math.floor(assessment.grade)) : ''
  );

  const [weightInput, setWeightInput] = useState<string>(
    assessment.weightPercentage !== null && assessment.weightPercentage !== undefined
      ? String(Math.floor(assessment.weightPercentage))
      : ''
  );

  useEffect(() => {
    setGradeInput(
      assessment.grade && assessment.grade > 0 ? String(Math.floor(assessment.grade)) : ''
    );
  }, [assessment.grade]);

  useEffect(() => {
    setWeightInput(
      assessment.weightPercentage !== null && assessment.weightPercentage !== undefined
        ? String(Math.floor(assessment.weightPercentage))
        : ''
    );
  }, [assessment.weightPercentage]);

  const handleGradeBlur = () => {
    if (gradeInput === '') {
      onUpdateGrade(assessment.id, '0');
      return;
    }
    const parsed = parseInt(gradeInput, 10);
    if (!isNaN(parsed) && parsed >= 0 && parsed <= 20) {
      onUpdateGrade(assessment.id, String(parsed));
    } else {
      setGradeInput(assessment.grade && assessment.grade > 0 ? String(Math.floor(assessment.grade)) : '');
    }
  };

  const handleWeightBlur = () => {
    if (!onUpdateWeight) return;
    if (weightInput === '') {
      onUpdateWeight(assessment.id, '0');
      return;
    }
    const parsed = parseInt(weightInput, 10);
    if (!isNaN(parsed) && parsed >= 0 && parsed <= 100) {
      onUpdateWeight(assessment.id, String(parsed));
    } else {
      setWeightInput(
        assessment.weightPercentage !== null && assessment.weightPercentage !== undefined
          ? String(Math.floor(assessment.weightPercentage))
          : ''
      );
    }
  };

  const handleGradeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === '.' || e.key === ',' || e.key === 'e' || e.key === 'E' || e.key === '-') {
      e.preventDefault();
    }
  };

  return (
    <div
      id={isSubstitute ? 'evaluation-item-substitute' : `evaluation-item-${assessment.id}`}
      className={`p-4 rounded-xl flex items-center justify-between group transition-colors ${
        isSubstitute ? 'border border-zinc-700/60 bg-zinc-900/60 mt-1' : 'neu-button'
      }`}
    >
      <div id={isSubstitute ? 'eval-info-substitute' : `eval-info-${assessment.id}`} className="flex flex-col gap-0.5">
        <p className="text-sm font-medium text-zinc-100">{displayTitle}</p>
        
        {isSubstitute ? (
          <p className="text-xs text-zinc-400 font-mono">Sustituye la nota más baja del curso</p>
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
            <span>Peso:</span>
            {onUpdateWeight ? (
              <div className="flex items-center">
                <input
                  id={`input-weight-${assessment.id}`}
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  placeholder="0"
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  onBlur={handleWeightBlur}
                  onKeyDown={handleGradeKeyDown}
                  className="w-10 bg-transparent border-b border-zinc-700 text-center text-xs font-mono text-zinc-200 focus:outline-none focus:border-zinc-300 py-0 px-0.5"
                />
                <span className="ml-0.5">%</span>
              </div>
            ) : (
              <span>{assessment.weightPercentage !== null ? `${assessment.weightPercentage}%` : 'No asignado'}</span>
            )}
          </div>
        )}
      </div>

      <div id={isSubstitute ? 'eval-input-substitute' : `eval-input-${assessment.id}`} className="w-20">
        <Input
          id={isSubstitute ? 'input-substitute-grade' : `input-grade-${assessment.id}`}
          type="number"
          placeholder="0"
          min="0"
          max="20"
          step="1"
          value={gradeInput}
          onChange={(e) => setGradeInput(e.target.value)}
          onBlur={handleGradeBlur}
          onKeyDown={handleGradeKeyDown}
          className="text-center font-mono font-medium text-sm py-1"
        />
      </div>
    </div>
  );
};
