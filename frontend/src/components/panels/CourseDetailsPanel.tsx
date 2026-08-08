import React, { useState } from 'react';
import type { Course, Assessment } from '../../types';
import { Card } from '../core/Card';
import { Switch } from '../core/Switch';
import { AssessmentRow } from '../functional/AssessmentRow';

export interface CourseDetailsPanelProps {
  course: Course;
  assessments: Assessment[];
  showSubstitute: boolean;
  substituteSubtitle?: string;
  onToggleSubstitute: () => void;
  onUpdateGrade: (assessmentId: string, newGradeStr: string) => void;
  onUpdateWeight: (assessmentId: string, newWeightStr: string) => void;
  courseAverage: number;
}

export const CourseDetailsPanel: React.FC<CourseDetailsPanelProps> = ({
  course,
  assessments,
  showSubstitute,
  substituteSubtitle,
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
  const formattedAverage = courseAverage % 1 === 0 ? courseAverage.toString() : courseAverage.toFixed(1);

  return (
    <Card id="panel-course-details-main" className="w-full flex flex-col gap-6 md:p-8 relative">
      {/* Barra Flotante / Sticky del Promedio Referencial (Siempre Visible) */}
      <div
        id="details-summary-sticky"
        className="sticky top-2 z-30 w-full p-3.5 rounded-2xl bg-zinc-950/95 border border-zinc-800/90 backdrop-blur-md shadow-xl flex items-center justify-between gap-4 transition-all"
      >
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-zinc-100 shadow-[0_0_6px_rgba(255,255,255,0.8)]"></span>
          <span className="text-xs font-medium text-zinc-300">Promedio Referencial</span>
        </div>

        {/* Indicador Elegante de Promedio */}
        <div
          id="course-average-pill"
          className="flex items-baseline gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-700/80 shadow-xs"
        >
          <span className="text-[11px] text-zinc-400 font-normal">Prom.</span>
          <span className="text-sm font-medium text-zinc-100 tracking-tight font-mono">{formattedAverage}</span>
        </div>
      </div>

      {/* Header del Curso con Switch Compacto (Notas vs Pesos) */}
      <div id="details-header" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h2 className="text-lg font-medium leading-tight text-zinc-100">{course.name}</h2>
          <div className="flex items-center gap-2 mt-1 text-xs text-zinc-400 font-mono">
            <span>{regularAssessments.length} Evaluaciones</span>
            <span>•</span>
            <span className="text-zinc-300">
              Peso Total: {totalWeight}%
            </span>
          </div>
        </div>

        {/* Switch Compacto Selector de Modo (Label fuera, palabras cortas dentro) */}
        <div id="edit-mode-switch-container" className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs text-zinc-400 font-normal">Modo:</span>
          <div id="edit-mode-switch" className="flex items-center gap-1 p-1 bg-zinc-900/90 border border-zinc-800 rounded-xl">
            <button
              type="button"
              onClick={() => setEditMode('GRADES')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                editMode === 'GRADES'
                  ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Notas
            </button>
            <button
              type="button"
              onClick={() => setEditMode('WEIGHTS')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                editMode === 'WEIGHTS'
                  ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Pesos
            </button>
          </div>
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
              substituteSubtitle={substituteSubtitle}
              onUpdateGrade={onUpdateGrade}
              onUpdateWeight={onUpdateWeight}
              isSubstitute
            />
          )}
        </div>
      </div>
    </Card>
  );
};
