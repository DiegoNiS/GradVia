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
        <p className="text-xs text-zinc-400 mt-1 font-normal">
          {course.assessments ? `${course.assessments.length} evaluaciones` : 'Sin evaluaciones'}
        </p>
      </div>

      {/* Indicador Elegante de Promedio (Sin aspecto de caja de input) */}
      <div
        id={`course-grade-${course.id}`}
        className="flex items-baseline gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-800 group-hover:border-zinc-600 transition-colors"
      >
        <span className="text-[11px] text-zinc-400 font-normal">Prom.</span>
        <span className="text-sm font-medium text-zinc-100 tracking-tight">{formattedGrade}</span>
      </div>
    </div>
  );
};
