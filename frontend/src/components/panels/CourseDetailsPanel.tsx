import React, { useState } from 'react';
import type { Course, Assessment } from '../../types';
import { Card } from '../core/Card';
import { Switch } from '../core/Switch';
import { AssessmentRow } from '../functional/AssessmentRow';

export interface CourseDetailsPanelProps {
  course: Course;
  assessments: Assessment[];
  showSubstitute: boolean;
  onToggleSubstitute: () => void;
  onUpdateGrade: (assessmentId: string, newGradeStr: string) => void;
  onUpdateWeight: (assessmentId: string, newWeightStr: string) => void;
  courseAverage: number;
}

export const CourseDetailsPanel: React.FC<CourseDetailsPanelProps> = ({
  course,
  assessments,
  showSubstitute,
  onToggleSubstitute,
  onUpdateGrade,
  onUpdateWeight,
  courseAverage,
}) => {
  const [editMode, setEditMode] = useState<'GRADES' | 'WEIGHTS'>('GRADES');

  const substituteExam = assessments.find((a) => a.type === 'SUBSTITUTE');
  const regularAssessments = assessments.filter((a) => a.type !== 'SUBSTITUTE');

  // Calcular suma total de pesos
  const totalWeight = regularAssessments.reduce((acc, a) => acc + (a.weightPercentage || 0), 0);

  return (
    <Card id="panel-course-details-main" className="w-full flex flex-col gap-6 md:p-8">
      {/* Header del Curso con Switch de Modo (Notas vs Pesos) */}
      <div id="details-header" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h2 className="text-lg font-medium leading-tight text-zinc-100">{course.name}</h2>
          <div className="flex items-center gap-2 mt-1 text-xs text-zinc-400 font-mono">
            <span>{regularAssessments.length} Evaluaciones</span>
            <span>•</span>
            <span className={totalWeight === 100 ? 'text-emerald-400' : 'text-amber-400'}>
              Peso Total: {totalWeight}%
            </span>
          </div>
        </div>

        {/* Switch Selector de Modo (Edicion de Notas vs Pesos) */}
        <div id="edit-mode-switch" className="flex items-center gap-1 p-1 bg-zinc-900/90 border border-zinc-800 rounded-xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setEditMode('GRADES')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              editMode === 'GRADES'
                ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Editar Notas
          </button>
          <button
            type="button"
            onClick={() => setEditMode('WEIGHTS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              editMode === 'WEIGHTS'
                ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Editar Pesos (%)
          </button>
        </div>
      </div>

      {/* Lista de Evaluaciones */}
      <div id="evaluations-list" className="flex flex-col gap-3">
        {regularAssessments.length === 0 ? (
          <div className="py-6 text-center border border-zinc-800/60 rounded-2xl">
            <p className="text-xs text-zinc-400 italic">No hay evaluaciones configuradas en el curso.</p>
          </div>
        ) : (
          regularAssessments.map((ev, index) => (
            <AssessmentRow
              key={ev.id}
              assessment={ev}
              index={index}
              editMode={editMode}
              onUpdateGrade={onUpdateGrade}
              onUpdateWeight={onUpdateWeight}
            />
          ))
        )}

        <Switch
          id="btn-toggle-substitute"
          label="¿Diste Examen Sustitutorio?"
          checked={showSubstitute}
          onChange={onToggleSubstitute}
          className="mt-2 border-t border-zinc-800 pt-4"
        />

        <div
          className={`transition-all duration-300 overflow-hidden ${
            showSubstitute ? 'max-h-28 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          {substituteExam && (
            <AssessmentRow
              assessment={substituteExam}
              editMode={editMode}
              onUpdateGrade={onUpdateGrade}
              onUpdateWeight={onUpdateWeight}
              isSubstitute
            />
          )}
        </div>
      </div>

      {/* Resumen del Promedio */}
      <div id="details-summary" className="pt-4 mt-2 border-t border-zinc-800 space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="text-zinc-400">Promedio actual del curso (referencial)</span>
          <span className="font-mono text-sm bg-zinc-900/90 border border-zinc-800 px-3 py-1.5 rounded-xl font-medium text-zinc-100">
            {courseAverage.toFixed(1)}
          </span>
        </div>
      </div>
    </Card>
  );
};
