import React from 'react';
import type { Course } from '../../types';

export interface CourseCardProps {
  course: Course;
  average: number;
  onClick: (course: Course) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  average,
  onClick,
}) => {
  // Formatear nota limpia sin ceros innecesarios (ej. 15 o 14.5)
  const formattedGrade = average % 1 === 0 ? average.toString() : average.toFixed(1);

  // Filtrar solo evaluaciones con peso % asignado mayor a 0 (excluyendo sustitutorios e inactivos)
  const weightedAssessments = (course.assessments || []).filter(
    (a) =>
      a.weightPercentage !== null &&
      a.weightPercentage !== undefined &&
      a.weightPercentage > 0 &&
      a.type !== 'SUBSTITUTE' &&
      a.isIncluded !== false
  );

  // Suma de pesos asignados
  const totalWeight = weightedAssessments.reduce((acc, a) => acc + (a.weightPercentage || 0), 0);

  return (
    <div
      id={`course-card-${course.id}`}
      onClick={() => onClick(course)}
      className="neu-button p-5 rounded-2xl cursor-pointer group transition-all flex justify-between items-center gap-4"
    >
      <div id={`course-info-${course.id}`} className="flex-1 min-w-0">
        <h3 className="font-medium text-sm text-zinc-100 group-hover:text-white transition-colors truncate">
          {course.name}
        </h3>

        {/* Indicador de Progreso con Puntos de Nota y Porcentaje de Peso */}
        <div className="flex items-center gap-2 mt-2">
          {weightedAssessments.length > 0 ? (
            <div
              className="flex items-center gap-1.5"
              title={`${weightedAssessments.filter((a) => a.grade > 0).length} de ${weightedAssessments.length} notas registradas`}
            >
              {weightedAssessments.map((a, idx) => {
                const hasGrade = a.grade > 0;
                return (
                  <span
                    key={a.id || idx}
                    className={`w-2 h-2 rounded-full transition-all ${
                      hasGrade
                        ? 'bg-zinc-100 border border-zinc-100 shadow-[0_0_5px_rgba(255,255,255,0.7)]'
                        : 'bg-transparent border border-zinc-600'
                    }`}
                  />
                );
              })}
            </div>
          ) : (
            <span className="text-[11px] text-zinc-500 font-mono">Sin pesos asignados</span>
          )}

          {totalWeight > 0 && (
            <span className="text-[11px] text-zinc-400 font-mono ml-0.5">
              {totalWeight}% peso
            </span>
          )}
        </div>
      </div>

      {/* Indicador Elegante de Promedio */}
      <div
        id={`course-grade-${course.id}`}
        className="flex items-baseline gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-800 group-hover:border-zinc-600 transition-colors shrink-0"
      >
        <span className="text-[11px] text-zinc-400 font-normal">Prom.</span>
        <span className="text-sm font-medium text-zinc-100 tracking-tight font-mono">{formattedGrade}</span>
      </div>
    </div>
  );
};
