import React, { useState, useEffect } from 'react';
import type { Assessment } from '../../types';
import { Input } from '../core/Input';

export interface AssessmentRowProps {
  assessment: Assessment;
  index?: number;
  title?: string;
  editMode?: 'GRADES' | 'WEIGHTS';
  substituteSubtitle?: string;
  onUpdateGrade: (assessmentId: string, newGradeStr: string) => void;
  onUpdateWeight?: (assessmentId: string, newWeightStr: string) => void;
  isSubstitute?: boolean;
}

export const AssessmentRow: React.FC<AssessmentRowProps> = ({
  assessment,
  index = 0,
  title,
  editMode = 'GRADES',
  substituteSubtitle,
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

  const originalGradeStr = assessment.grade && assessment.grade > 0 ? String(Math.floor(assessment.grade)) : '';
  const originalWeightStr = assessment.weightPercentage !== null && assessment.weightPercentage !== undefined
    ? String(Math.floor(assessment.weightPercentage))
    : '';

  const [gradeInput, setGradeInput] = useState<string>(originalGradeStr);
  const [weightInput, setWeightInput] = useState<string>(originalWeightStr);

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

  const isGradePending = gradeInput !== originalGradeStr;
  const isWeightPending = weightInput !== originalWeightStr;

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
    if (e.key === 'Enter') {
      (e.target as HTMLInputElement).blur();
    }
  };

  const handleWeightKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === '.' || e.key === ',' || e.key === 'e' || e.key === 'E' || e.key === '-') {
      e.preventDefault();
    }
    if (e.key === 'Enter') {
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <div
      id={isSubstitute ? 'evaluation-item-substitute' : `evaluation-item-${assessment.id}`}
      className={`p-4 rounded-2xl flex items-center justify-between group transition-all duration-200 ${
        isSubstitute ? 'border border-zinc-800 bg-zinc-900/40 mt-1' : 'neu-button'
      }`}
    >
      <div id={isSubstitute ? 'eval-info-substitute' : `eval-info-${assessment.id}`} className="flex flex-col gap-1 min-w-0 pr-3">
        <p className="text-sm font-medium text-zinc-100 truncate">{displayTitle}</p>
        
        {isSubstitute ? (
          <p className="text-xs text-zinc-400 font-mono">
            {substituteSubtitle || 'Reemplaza la nota más baja entre Parcial 1 y Parcial 2'}
          </p>
        ) : (
          <div className="flex items-center gap-2 text-xs">
            {/* Tag de Peso / Nota segun el modo activo */}
            {editMode === 'GRADES' ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono text-[11px]">
                <span>Peso:</span>
                <strong className="text-zinc-200 font-medium">
                  {assessment.weightPercentage !== null && assessment.weightPercentage !== undefined ? `${assessment.weightPercentage}%` : '0%'}
                </strong>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono text-[11px]">
                <span>Nota Actual:</span>
                <strong className="text-zinc-200 font-medium">
                  {assessment.grade || 0}
                </strong>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Control Activo segun Modo Seleccionado con Indicador de Cambio Pendiente por Guardar */}
      <div id={isSubstitute ? 'eval-input-substitute' : `eval-input-${assessment.id}`} className="flex items-center gap-2">
        {editMode === 'GRADES' ? (
          <div className="flex items-center gap-2">
            {/* Indicador Cuadrado Blanco de Edición Pendiente */}
            {isGradePending && (
              <span
                className="w-2.5 h-2.5 rounded-xs bg-zinc-100 border border-zinc-100 shadow-[0_0_8px_rgba(255,255,255,0.9)] animate-pulse shrink-0"
                title="Cambio pendiente por guardar. Presiona Enter o sal del campo para guardar."
              />
            )}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-zinc-400 font-mono hidden sm:inline">Nota</span>
              <div className="w-20">
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
                  className="text-center font-mono font-medium text-sm py-1.5"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {/* Indicador Cuadrado Blanco de Edición Pendiente */}
            {isWeightPending && (
              <span
                className="w-2.5 h-2.5 rounded-xs bg-zinc-100 border border-zinc-100 shadow-[0_0_8px_rgba(255,255,255,0.9)] animate-pulse shrink-0"
                title="Cambio pendiente por guardar. Presiona Enter o sal del campo para guardar."
              />
            )}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-zinc-400 font-mono hidden sm:inline">Peso %</span>
              <div className="w-20 relative flex items-center">
                <Input
                  id={`input-weight-${assessment.id}`}
                  type="number"
                  placeholder="0"
                  min="0"
                  max="100"
                  step="1"
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  onBlur={handleWeightBlur}
                  onKeyDown={handleWeightKeyDown}
                  className="text-center font-mono font-medium text-sm py-1.5 pr-5"
                />
                <span className="absolute right-2 text-xs font-mono text-zinc-400 pointer-events-none">%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
