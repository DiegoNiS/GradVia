import React from 'react';
import type { Semester, Course } from '../../types';
import { Card } from '../core/Card';
import { Button } from '../core/Button';
import { CourseCard } from '../functional/CourseCard';

export interface CoursesPanelProps {
  selectedSemester: Semester | null;
  onOpenCreateCourseModal: () => void;
  onSelectCourse: (course: Course) => void;
  getCourseAverage: (course: Course) => number;
}

export const CoursesPanel: React.FC<CoursesPanelProps> = ({
  selectedSemester,
  onOpenCreateCourseModal,
  onSelectCourse,
  getCourseAverage,
}) => {
  return (
    <Card
      id="panel-courses"
      className="flex-1 flex flex-col gap-6 md:p-8"
    >
      {selectedSemester ? (
        <>
          <div id="courses-header" className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-1">
            <div>
              <h1 className="text-lg font-medium tracking-tight text-zinc-100">Cursos del Semestre</h1>
              <p className="text-xs text-zinc-400 mt-0.5 font-mono">Promedio acumulado: {selectedSemester.gpa || 0}</p>
            </div>
            <Button
              id="btn-add-course"
              variant="secondary"
              onClick={onOpenCreateCourseModal}
            >
              + Nuevo Curso
            </Button>
          </div>

          <div id="courses-grid" className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(!selectedSemester.courses || selectedSemester.courses.length === 0) ? (
              <div className="col-span-full py-12 text-center text-xs text-zinc-400 border border-zinc-800/60 rounded-2xl">
                No hay cursos en este semestre. Crea uno para empezar.
              </div>
            ) : (
              selectedSemester.courses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  average={getCourseAverage(course)}
                  onClick={onSelectCourse}
                />
              ))
            )}
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center py-16">
          <p className="text-xs text-zinc-400">Crea o selecciona un semestre para ver sus cursos</p>
        </div>
      )}
    </Card>
  );
};
