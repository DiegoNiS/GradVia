import React from 'react';

export interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse bg-zinc-900/90 border border-zinc-800/60 rounded-2xl ${className}`}
    />
  );
};

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="w-full flex flex-col xl:flex-row gap-6 items-stretch">
      {/* Skeleton Semestres */}
      <div className="w-full xl:w-1/3 p-6 rounded-3xl bg-black/40 border border-zinc-800/80 flex flex-col gap-4">
        <div className="flex justify-between items-center mb-2">
          <div className="space-y-2">
            <Skeleton className="h-5 w-28 rounded-lg" />
            <Skeleton className="h-3 w-40 rounded-lg" />
          </div>
          <Skeleton className="h-8 w-8 rounded-xl" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:flex xl:flex-col gap-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>

      {/* Skeleton Cursos */}
      <div className="w-full xl:w-2/3 p-6 rounded-3xl bg-black/40 border border-zinc-800/80 flex flex-col gap-4">
        <div className="flex justify-between items-center mb-2">
          <div className="space-y-2">
            <Skeleton className="h-5 w-36 rounded-lg" />
            <Skeleton className="h-3 w-48 rounded-lg" />
          </div>
          <Skeleton className="h-8 w-8 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    </div>
  );
};

export const CourseDetailsSkeleton: React.FC = () => {
  return (
    <div className="w-full p-6 md:p-8 rounded-3xl bg-black/40 border border-zinc-800/80 flex flex-col gap-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center pb-4 border-b border-zinc-800">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48 rounded-lg" />
          <Skeleton className="h-3 w-28 rounded-lg" />
        </div>
        <Skeleton className="h-8 w-36 rounded-xl" />
      </div>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    </div>
  );
};
