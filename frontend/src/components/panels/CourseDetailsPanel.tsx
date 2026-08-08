import React from 'react';
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
  courseAverage: number;
}

export const CourseDetailsPanel: React.FC<CourseDetailsPanelProps> = ({
  course,
  assessments,
  showSubstitute,
  onToggleSubstitute,
  onUpdateGrade,
  courseAverage,
}) => {
  const substituteExam = assessments.find((a) => a.type === 'SUBSTITUTE');
  const regularAssessments = assessments.filter((a) => a.type !== 'SUBSTITUTE');

  return (
    <Card id="panel-course-details-main" className="w-full flex flex-col gap-5 md:p-8">
      <div id="details-header" className="pb-4 border-b border-zinc-800">
        <h2 className="text-lg font-medium leading-tight text-zinc-100">{course.name}</h2>
        <div className="flex items-center gap-2 mt-1.5 text-xs text-zinc-400 font-mono">
          <span>{course.credits || 4} Créditos</span>
          <span className="w-1 h-1 rounded-full bg-zinc-600"></span>
          <span>{regularAssessments.length} Evaluaciones</span>
        </div>
      </div>

      <div id="evaluations-list" className="flex flex-col gap-3">
        {regularAssessments.length === 0 ? (
          <div className="py-4 text-center border border-zinc-800/60 rounded-xl">
            <p className="text-xs text-zinc-400 italic">No hay evaluaciones configuradas en el curso.</p>
          </div>
        ) : (
          regularAssessments.map((ev) => (
            <AssessmentRow
              key={ev.id}
              assessment={ev}
              onUpdateGrade={onUpdateGrade}
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
              onUpdateGrade={onUpdateGrade}
              isSubstitute
            />
          )}
        </div>
      </div>

      <div id="details-summary" className="pt-4 mt-2 border-t border-zinc-800 space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="text-zinc-400">Promedio actual del curso (referencial)</span>
          <span className="font-mono text-sm bg-zinc-900/60 border border-zinc-700/60 px-3 py-1.5 rounded-xl font-medium text-zinc-100">
            {courseAverage.toFixed(1)}
          </span>
        </div>
      </div>
    </Card>
  );
};
