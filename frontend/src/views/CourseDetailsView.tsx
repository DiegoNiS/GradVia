import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCourseDetails, getCoursesBySemesterId, updateAssessment, createAssessment } from '../services/api';
import type { Course, Assessment } from '../types';
import { parseApiError, type ParsedApiError } from '../utils/apiError';
import { ErrorMessage } from '../components/core/ErrorMessage';
import { Button } from '../components/core/Button';
import { CourseDetailsPanel } from '../components/panels/CourseDetailsPanel';
import { CourseDetailsSkeleton } from '../components/core/Skeleton';

export const CourseDetailsView: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [course, setCourse] = useState<Course | null>(null);
  const [siblingCourses, setSiblingCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSubstitute, setShowSubstitute] = useState(false);
  const [localAssessments, setLocalAssessments] = useState<Assessment[]>([]);
  const [error, setError] = useState<ParsedApiError | null>(null);

  const fetchCourse = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getCourseDetails(id);
      setCourse(data);
      if (data) {
        setLocalAssessments(data.assessments || []);
        const hasSub = data.assessments?.some((a) => a.type === 'SUBSTITUTE');
        if (hasSub) setShowSubstitute(true);

        // Cargar los cursos hermanos del mismo semestre para navegación secuencial
        const siblings = await getCoursesBySemesterId(data.semesterId);
        setSiblingCourses(siblings);
      }
    } catch (err: any) {
      setError(parseApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const handleUpdateGrade = async (assessmentId: string, newGradeStr: string) => {
    const newGrade = parseInt(newGradeStr, 10);
    if (isNaN(newGrade) || newGrade < 0 || newGrade > 20) return;

    setLocalAssessments((prev) =>
      prev.map((a) => (a.id === assessmentId ? { ...a, grade: newGrade } : a))
    );

    try {
      await updateAssessment(assessmentId, { grade: newGrade });
    } catch (err: any) {
      setError(parseApiError(err));
    }
  };

  const handleUpdateWeight = async (assessmentId: string, newWeightStr: string) => {
    const newWeight = parseInt(newWeightStr, 10);
    if (isNaN(newWeight) || newWeight < 0 || newWeight > 100) return;

    setLocalAssessments((prev) =>
      prev.map((a) => (a.id === assessmentId ? { ...a, weightPercentage: newWeight } : a))
    );

    try {
      await updateAssessment(assessmentId, { weightPercentage: newWeight });
    } catch (err: any) {
      setError(parseApiError(err));
    }
  };

  const handleToggleSubstitute = async () => {
    const willShow = !showSubstitute;
    setShowSubstitute(willShow);
    setError(null);

    const exists = localAssessments.find((a) => a.type === 'SUBSTITUTE');
    if (willShow && !exists && course) {
      try {
        const newSub = await createAssessment({
          courseId: course.id,
          name: 'Examen Sustitutorio',
          type: 'SUBSTITUTE',
          weightPercentage: null,
          grade: 0,
        });
        setLocalAssessments((prev) => [...prev, newSub]);
      } catch (err: any) {
        setError(parseApiError(err));
      }
    }
  };

  // Obtener el ID del siguiente curso (ciclo circular al llegar al ultimo)
  const getNextCourseId = (): string | null => {
    if (!course || siblingCourses.length <= 1) return null;
    const currentIndex = siblingCourses.findIndex((c) => c.id === course.id);
    if (currentIndex === -1) return null;
    const nextIndex = (currentIndex + 1) % siblingCourses.length;
    return siblingCourses[nextIndex].id;
  };

  // Explicación dinámica del impacto del Examen Sustitutorio (Sólo reemplaza Parcial 1 o Parcial 2)
  const getSubstituteSubtitle = () => {
    const midterm1 = localAssessments.find((a) => a.type === 'MIDTERM' && a.number === 1);
    const midterm2 = localAssessments.find((a) => a.type === 'MIDTERM' && a.number === 2);
    const substitute = localAssessments.find((a) => a.type === 'SUBSTITUTE');

    const m1Grade = midterm1 ? midterm1.grade : 21;
    const m2Grade = midterm2 ? midterm2.grade : 21;

    if (!midterm1 && !midterm2) {
      return 'Sustituye la nota más baja entre el Parcial 1 y Parcial 2';
    }

    const lowestName = m1Grade <= m2Grade ? 'Parcial 1' : 'Parcial 2';
    const lowestGrade = m1Grade <= m2Grade ? (midterm1 ? midterm1.grade : 0) : (midterm2 ? midterm2.grade : 0);

    if (substitute && substitute.grade > 0) {
      if (substitute.grade > lowestGrade) {
        return `Reemplaza la nota del ${lowestName} (anteriormente ${lowestGrade})`;
      } else {
        return `No supera la nota del ${lowestName} (${lowestGrade}), no se aplica reemplazo`;
      }
    }

    return `Reemplazará la nota más baja entre Parcial 1 y Parcial 2 (actualmente ${lowestName}: ${lowestGrade})`;
  };

  // Cálculo dinámico del promedio del curso
  const getCourseAverage = () => {
    let assessmentsToUse = localAssessments.filter((a) => a.type !== 'SUBSTITUTE' && a.isIncluded !== false);

    // Regla de Examen Sustitutorio: Reemplaza ÚNICAMENTE al Parcial 1 o Parcial 2 si su nota es superior
    const subExam = localAssessments.find((a) => a.type === 'SUBSTITUTE');
    if (showSubstitute && subExam && subExam.grade > 0) {
      const midterm1 = assessmentsToUse.find((a) => a.type === 'MIDTERM' && a.number === 1);
      const midterm2 = assessmentsToUse.find((a) => a.type === 'MIDTERM' && a.number === 2);

      let targetMidterm: Assessment | undefined;
      if (midterm1 && midterm2) {
        targetMidterm = midterm1.grade <= midterm2.grade ? midterm1 : midterm2;
      } else if (midterm1) {
        targetMidterm = midterm1;
      } else if (midterm2) {
        targetMidterm = midterm2;
      }

      if (targetMidterm && subExam.grade > targetMidterm.grade) {
        assessmentsToUse = assessmentsToUse.map((a) =>
          a.id === targetMidterm!.id ? { ...a, grade: subExam.grade } : a
        );
      }
    }

    if (assessmentsToUse.length === 0) return 0;
    let totalWeight = 0;
    let totalScore = 0;

    assessmentsToUse.forEach((a) => {
      const w = a.weightPercentage || 100 / (assessmentsToUse.length || 1);
      totalWeight += w;
      totalScore += a.grade * (w / 100);
    });
    return totalWeight > 0 ? totalScore / (totalWeight / 100) : 0;
  };

  if (loading) {
    return (
      <div id="course-details-container" className="h-full flex flex-col gap-6 max-w-2xl mx-auto w-full mt-4">
        <div className="flex items-center justify-between gap-4">
          <Button id="btn-back-dashboard" variant="secondary" onClick={() => navigate('/dashboard')}>
            ← Volver al Dashboard
          </Button>
        </div>
        <CourseDetailsSkeleton />
      </div>
    );
  }

  if (!course && !loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4 flex-1 py-16">
        {error && <ErrorMessage error={error} className="max-w-md" />}
        <p className="text-xs text-zinc-400">Curso no encontrado.</p>
        <Button id="btn-back-error" variant="secondary" onClick={() => navigate('/dashboard')}>
          ← Volver al Dashboard
        </Button>
      </div>
    );
  }

  const nextCourseId = getNextCourseId();

  return (
    <div id="course-details-container" className="h-full flex flex-col gap-6 max-w-2xl mx-auto w-full mt-4">
      {/* Barra de Navegación Superior de la Vista de Curso */}
      <div className="flex items-center justify-between gap-4">
        <Button
          id="btn-back-dashboard"
          variant="secondary"
          onClick={() => navigate('/dashboard')}
        >
          ← Volver al Dashboard
        </Button>

        {nextCourseId && (
          <Button
            id="btn-next-course"
            variant="secondary"
            onClick={() => navigate(`/course/${nextCourseId}`)}
          >
            Siguiente Curso →
          </Button>
        )}
      </div>

      {error && <ErrorMessage error={error} onClose={() => setError(null)} />}

      {course && (
        <CourseDetailsPanel
          course={course}
          assessments={localAssessments}
          showSubstitute={showSubstitute}
          substituteSubtitle={getSubstituteSubtitle()}
          onToggleSubstitute={handleToggleSubstitute}
          onUpdateGrade={handleUpdateGrade}
          onUpdateWeight={handleUpdateWeight}
          courseAverage={getCourseAverage()}
        />
      )}
    </div>
  );
};
