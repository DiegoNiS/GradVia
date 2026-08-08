import React from 'react';
import type { Course } from '../../types';
import { Badge } from '../core/Badge';

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
  return (
    <div
      id={`course-card-${course.id}`}
      onClick={() => onClick(course)}
      className="neu-button p-5 rounded-2xl cursor-pointer group transition-all"
    >
      <div id={`course-info-${course.id}`} className="flex justify-between items-start">
        <div className="pr-4">
          <h3 className="font-medium text-sm leading-tight text-zinc-100 group-hover:text-white transition-colors">
            {course.name}
          </h3>
          {/* <p className="text-xs text-zinc-400 mt-1 font-mono">Promedio: {course.average !== undefined ? course.average.toFixed(1) : "No registra"}</p> */}
        </div>
        <Badge id={`course-grade-${course.id}`} variant="flat">
          {average.toFixed(1)}
        </Badge>
      </div>
    </div>
  );
};
