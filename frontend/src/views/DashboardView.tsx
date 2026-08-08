import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getSemestersByUserId,
  getSemesterById,
  createSemester,
  updateSemester,
  deleteSemester,
  createCourse,
  bulkSyncSemester,
} from '../services/api';
import type { Semester, Course, BulkSyncCourseInput } from '../types';
import { useAuth } from '../context/AuthContext';
import { parseApiError, type ParsedApiError } from '../utils/apiError';
import { ErrorMessage } from '../components/core/ErrorMessage';
import { Button } from '../components/core/Button';
import { SemestersPanel } from '../components/panels/SemestersPanel';
import { CoursesPanel } from '../components/panels/CoursesPanel';
import { SemesterModal } from '../components/functional/SemesterModal';
import { CourseModal } from '../components/functional/CourseModal';
import { ImportCsvModal } from '../components/functional/ImportCsvModal';
import { SettingsModal } from '../components/functional/SettingsModal';

export const DashboardView: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<Semester | null>(null);
  const [loading, setLoading] = useState(true);
  const [globalError, setGlobalError] = useState<ParsedApiError | null>(null);
  const [modalError, setModalError] = useState<ParsedApiError | null>(null);

  // Modals visibility
  const [showSemesterModal, setShowSemesterModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Import states
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [parsedCourses, setParsedCourses] = useState<BulkSyncCourseInput[]>([]);

  const fetchSemesterDetails = async (semesterId: string) => {
    try {
      const detailed = await getSemesterById(semesterId);
      setSelectedSemester(detailed);
    } catch (err: any) {
      setGlobalError(parseApiError(err));
    }
  };

  const fetchSemesters = async (overrideTargetId?: string) => {
    if (!user) return;
    setLoading(true);
    setGlobalError(null);
    try {
      // 1. Carga ligera de la lista de semestres del usuario
      const data = await getSemestersByUserId(user.id);
      setSemesters(data);

      if (data.length > 0) {
        let targetId = overrideTargetId;
        if (!targetId && selectedSemester) {
          targetId = data.find((s) => s.id === selectedSemester.id)?.id;
        }
        if (!targetId) {
          targetId = data.find((s) => s.isCurrent && !s.isArchived)?.id || data.find((s) => !s.isArchived)?.id || data[0].id;
        }

        await fetchSemesterDetails(targetId);
      } else {
        setSelectedSemester(null);
      }
    } catch (err: any) {
      setGlobalError(parseApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSemesters();
  }, [user]);

  const handleCreateSemester = async (semesterNumber: number) => {
    if (!user) return;
    setModalError(null);
    try {
      // Todo nuevo semestre se crea forzosamente como actual (isCurrent: true)
      const newSemester = await createSemester({
        userId: user.id,
        isCurrent: true,
        number: semesterNumber,
      });
      setShowSemesterModal(false);
      await fetchSemesters(newSemester.id);
    } catch (err: any) {
      setModalError(parseApiError(err));
    }
  };

  const handleSetCurrentSemester = async (semester: Semester) => {
    try {
      await updateSemester(semester.id, { isCurrent: true });
      await fetchSemesters(semester.id);
    } catch (err: any) {
      setGlobalError(parseApiError(err));
    }
  };

  const handleArchiveSemester = async (semester: Semester) => {
    try {
      await updateSemester(semester.id, { isArchived: !semester.isArchived });
      await fetchSemesters();
    } catch (err: any) {
      setGlobalError(parseApiError(err));
    }
  };

  const handleDeleteSemester = async (semester: Semester) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar el Semestre ${semester.number}? Esta acción eliminará todos sus cursos y notas.`)) {
      return;
    }
    try {
      await deleteSemester(semester.id);
      await fetchSemesters();
    } catch (err: any) {
      setGlobalError(parseApiError(err));
    }
  };

  const handleCreateCourse = async (name: string) => {
    if (!selectedSemester) return;
    setModalError(null);
    try {
      await createCourse({ semesterId: selectedSemester.id, name });
      setShowCourseModal(false);
      await fetchSemesterDetails(selectedSemester.id);
    } catch (err: any) {
      setModalError(parseApiError(err));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const lines = text.split('\n');
      const coursesMap = new Map<string, BulkSyncCourseInput>();

      let startIndex = 0;
      if (lines[0].toLowerCase().includes('curso')) {
        startIndex = 1;
      }

      for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const parts = line.split(',');
        if (parts.length >= 4) {
          const courseName = parts[0].trim();
          const evalType = (parts[2]?.trim() as any) || 'CONTINUOUS';
          const grade = parseFloat(parts[3]);
          const weight = parseFloat(parts[4]);

          if (!coursesMap.has(courseName)) {
            coursesMap.set(courseName, { name: courseName, assessments: [] });
          }

          coursesMap.get(courseName)?.assessments?.push({
            type: evalType,
            grade: isNaN(grade) ? 0 : grade,
            weightPercentage: isNaN(weight) ? 0 : weight,
          });
        }
      }

      setParsedCourses(Array.from(coursesMap.values()));
      setModalError(null);
      setShowImportModal(true);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    reader.readAsText(file);
  };

  const handleImportConfirm = async () => {
    if (!user || parsedCourses.length === 0) return;
    setModalError(null);
    try {
      const importedSemester = await bulkSyncSemester({
        userId: user.id,
        isCurrent: true,
        courses: parsedCourses,
      });
      setShowImportModal(false);
      await fetchSemesters(importedSemester.id);
    } catch (err: any) {
      setModalError(parseApiError(err));
    }
  };

  const getCourseAverage = (course: Course) => {
    if (course.average !== undefined) return course.average;
    if (!course.assessments || course.assessments.length === 0) return 0;

    let totalWeight = 0;
    let totalScore = 0;
    course.assessments.forEach((a) => {
      const w = a.weightPercentage || 0;
      totalWeight += w;
      totalScore += a.grade * (w / 100);
    });

    return totalWeight > 0 ? totalScore / (totalWeight / 100) : 0;
  };

  if (loading && semesters.length === 0 && !globalError) {
    return (
      <div className="h-full w-full flex items-center justify-center flex-1 py-20">
        <div className="w-8 h-8 rounded-full border-t-2 border-zinc-200 animate-spin"></div>
      </div>
    );
  }

  return (
    <div id="dashboard-container" className="h-full flex flex-col gap-4 max-w-[1200px] mx-auto w-full mt-2">
      <input
        type="file"
        accept=".csv"
        hidden
        ref={fileInputRef}
        onChange={handleFileUpload}
      />

      {/* Top Header User Bar */}
      <div id="user-info-bar" className="w-full flex items-center justify-between gap-4 py-1 text-sm">
        <span className="text-zinc-300 text-sm md:text-base font-medium tracking-tight">
          Hola, <strong className="text-zinc-100 font-semibold">{user?.username}</strong>
        </span>
        
        <div id="user-actions" className="flex items-center gap-2">
          <Button
            id="btn-settings"
            variant="ghost-icon"
            onClick={() => setShowSettingsModal(true)}
            title="Configuración"
          >
            <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.75">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </Button>

          <Button id="btn-logout" variant="ghost" onClick={logout}>
            Cerrar Sesión
          </Button>
        </div>
      </div>

      {/* Error Global */}
      {globalError && (
        <div id="global-error-container" className="w-full">
          <ErrorMessage error={globalError} onClose={() => setGlobalError(null)} />
        </div>
      )}

      {/* Paneles de Estructura Principales */}
      <div id="dashboard-main-panels" className="w-full flex flex-col xl:flex-row gap-6 items-stretch">
        <SemestersPanel
          semesters={semesters}
          selectedSemester={selectedSemester}
          onSelectSemester={(sem) => fetchSemesterDetails(sem.id)}
          onOpenCreateModal={() => {
            setModalError(null);
            setShowSemesterModal(true);
          }}
          onSetCurrentSemester={handleSetCurrentSemester}
          onArchiveSemester={handleArchiveSemester}
          onDeleteSemester={handleDeleteSemester}
        />

        <CoursesPanel
          selectedSemester={selectedSemester}
          onOpenCreateCourseModal={() => {
            setModalError(null);
            setShowCourseModal(true);
          }}
          onSelectCourse={(course) => navigate(`/course/${course.id}`)}
          getCourseAverage={getCourseAverage}
        />
      </div>

      {/* Modales Modulares */}
      <SemesterModal
        isOpen={showSemesterModal}
        existingNumbers={semesters.map((s) => s.number)}
        onClose={() => setShowSemesterModal(false)}
        onSubmit={handleCreateSemester}
        error={modalError}
        onClearError={() => setModalError(null)}
      />

      <CourseModal
        isOpen={showCourseModal}
        onClose={() => setShowCourseModal(false)}
        onSubmit={handleCreateCourse}
        error={modalError}
        onClearError={() => setModalError(null)}
      />

      <ImportCsvModal
        isOpen={showImportModal}
        courseCount={parsedCourses.length}
        onClose={() => setShowImportModal(false)}
        onSubmit={handleImportConfirm}
        error={modalError}
        onClearError={() => setModalError(null)}
      />

      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        onTriggerImport={() => fileInputRef.current?.click()}
      />
    </div>
  );
};
