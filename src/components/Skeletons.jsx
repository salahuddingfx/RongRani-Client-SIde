import React from 'react';

const ProductCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col h-full animate-pulse">
      {/* Image Skeleton */}
      <div className="relative aspect-square bg-slate-200 dark:bg-slate-700">
        <div className="absolute top-2 left-2 w-8 h-4 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
      </div>

      {/* Content Skeleton */}
      <div className="p-3 flex flex-col flex-grow">
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-1"></div>
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-2"></div>

        <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-2"></div>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex space-x-0.5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-2.5 h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
            ))}
          </div>
          <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

const HeroSkeleton = () => {
  return (
    <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] overflow-hidden">
      <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse" />
      <div className="relative z-10 max-w-6xl mx-auto h-full flex items-center px-8 md:px-16">
        <div className="max-w-xl space-y-6">
          <div className="h-4 bg-slate-300 dark:bg-slate-600 rounded-full w-32 animate-pulse" />
          <div className="h-12 bg-slate-300 dark:bg-slate-600 rounded-xl w-full animate-pulse" />
          <div className="h-12 bg-slate-300 dark:bg-slate-600 rounded-xl w-3/4 animate-pulse" />
          <div className="h-6 bg-slate-300 dark:bg-slate-600 rounded-lg w-full animate-pulse" />
          <div className="h-6 bg-slate-300 dark:bg-slate-600 rounded-lg w-5/6 animate-pulse" />
          <div className="h-12 bg-slate-300 dark:bg-slate-600 rounded-xl w-40 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

const PageSkeleton = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900/40 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header bar */}
        <div className="space-y-3 animate-pulse">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-xl w-48" />
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-lg w-96 max-w-full" />
        </div>

        {/* Content blocks */}
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 animate-pulse">
            <div className="flex gap-4">
              <div className="w-20 h-20 bg-slate-200 dark:bg-slate-700 rounded-xl shrink-0" />
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full" />
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ReviewCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 animate-pulse">
      <div className="flex gap-4">
        <div className="w-20 h-20 bg-slate-200 dark:bg-slate-700 rounded-xl shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full" />
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
        </div>
      </div>
    </div>
  );
};

const StatCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm text-center animate-pulse">
      <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-xl w-20 mx-auto mb-3" />
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24 mx-auto" />
    </div>
  );
};

const TableSkeleton = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden animate-pulse">
      {/* Header row */}
      <div className="flex gap-4 p-4 border-b border-slate-100 dark:border-slate-700">
        {[...Array(columns)].map((_, i) => (
          <div key={i} className="h-4 bg-slate-200 dark:bg-slate-700 rounded flex-1" />
        ))}
      </div>

      {/* Data rows */}
      {[...Array(rows)].map((_, rowIdx) => (
        <div
          key={rowIdx}
          className={`flex gap-4 p-4 ${rowIdx < rows - 1 ? 'border-b border-slate-100 dark:border-slate-700' : ''}`}
        >
          {[...Array(columns)].map((_, colIdx) => (
            <div key={colIdx} className="h-4 bg-slate-200 dark:bg-slate-700 rounded flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
};

export {
  ProductCardSkeleton,
  HeroSkeleton,
  PageSkeleton,
  ReviewCardSkeleton,
  StatCardSkeleton,
  TableSkeleton
};
