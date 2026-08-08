import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCourseDetails, updateAssessment, createAssessment } from '../services/api';
import type { Course, Assessment } from '../types';
import { parseApiError, type ParsedApiError } from '../utils/apiError';
import { ErrorMessage } from '../components/core/ErrorMessage';
import { Button } from '../components/core/Button';
import { CourseDetailsPanel } from '../components/panels/CourseDetailsPanel';

export const CourseDetailsView: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [course, setCourse] = useState<Course | null>(null);
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
    const newGrade = parseFloat(newGradeStr);
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

  if (loading) {
    return (
      <div className="h-full flex flex-1 items-center justify-center py-20">
        <div className="w-8 h-8 rounded-full border-t-2 border-zinc-200 animate-spin"></div>
      </div>
    );
  }

  if (!course && !loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4 flex-1 py-16">
        {error && <ErrorMessage error={error} className="max-w-md" />}
        <p className="text-xs text-zinc-400">Curso no encontrado.</p>
        <Button id="btn-back-error" variant="secondary" onClick={() => navigate(-1)}>
          ← Volver
        </Button>
      </div>
    );
  }

  const regularAssessments = localAssessments.filter((a) => a.type !== 'SUBSTITUTE');
  const getCourseAverage = () => {
    if (localAssessments.length === 0) return 0;
    let totalWeight = 0;
    let totalScore = 0;

    regularAssessments.forEach((a) => {
      const w = a.weightPercentage || 100 / (regularAssessments.length || 1);
      totalWeight += w;
      totalScore += a.grade * (w / 100);
    });
    return totalWeight > 0 ? totalScore / (totalWeight / 100) : 0;
  };

  return (
    <div id="course-details-container" className="h-full flex flex-col gap-6 max-w-2xl mx-auto w-full mt-4">
      <div className="flex items-center">
        <Button
          id="btn-back-dashboard"
          variant="secondary"
          onClick={() => navigate(-1)}
        >
          ← Volver al Dashboard
        </Button>
      </div>

      {error && <ErrorMessage error={error} onClose={() => setError(null)} />}

      {course && (
        <CourseDetailsPanel
          course={course}
          assessments={localAssessments}
          showSubstitute={showSubstitute}
          onToggleSubstitute={handleToggleSubstitute}
          onUpdateGrade={handleUpdateGrade}
          courseAverage={getCourseAverage()}
        />
      )}
    </div>
  );
};
