import React from 'react';

export const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm animate-pulse dark:bg-slate-800 dark:border-slate-700">
      <div className="bg-gray-200 rounded-xl aspect-square w-full mb-4 dark:bg-slate-700"></div>
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-2 dark:bg-slate-700"></div>
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-3 dark:bg-slate-700"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4 dark:bg-slate-700"></div>
      <div className="flex justify-between items-center">
        <div className="h-6 bg-gray-200 rounded w-1/4 dark:bg-slate-700"></div>
        <div className="h-8 bg-gray-200 rounded-lg w-10 dark:bg-slate-700"></div>
      </div>
    </div>
  );
};

export const SkeletonDetail = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
      <div className="bg-gray-200 rounded-2xl aspect-square w-full dark:bg-slate-700"></div>
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded w-1/4 dark:bg-slate-700"></div>
        <div className="h-8 bg-gray-200 rounded w-3/4 dark:bg-slate-700"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3 dark:bg-slate-700"></div>
        <div className="h-6 bg-gray-200 rounded w-1/4 dark:bg-slate-700"></div>
        <div className="h-24 bg-gray-200 rounded w-full dark:bg-slate-700"></div>
        <div className="h-10 bg-gray-200 rounded w-1/3 dark:bg-slate-700"></div>
      </div>
    </div>
  );
};
