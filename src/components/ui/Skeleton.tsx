import React from 'react'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded-md ${className}`} />
  )
}

export function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="w-full space-y-4">
      <div className="flex gap-4 mb-4">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-8 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton key={j} className="h-12 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4">
      <div className="flex justify-between items-start">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="pt-4 flex justify-between items-center">
        <div className="flex -space-x-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-8 w-8 rounded-full border-2 border-white" />
          ))}
        </div>
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  )
}

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 mb-5">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-4 w-8" />
          </div>
          <Skeleton className="h-3 w-16" />
        </div>
      ))}
    </div>
  )
}

export function TaskDetailSkeleton() {
  return (
    <div className="flex flex-col flex-1 gap-4 overflow-hidden animate-pulse">
      <Skeleton className="h-4 w-32" />
      <div className="flex flex-1 gap-5 min-h-0">
        <div className="flex flex-col flex-1 min-w-0 bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
          <div className="flex justify-between">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-10 w-32" />
          </div>
          <Skeleton className="h-4 w-24" />
          <hr className="border-gray-100" />
          <div className="flex gap-6">
            <div className="flex-1 space-y-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="w-48 space-y-4">
              <div className="flex gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          </div>
          <div className="flex gap-4 border-b border-gray-100 pb-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
          </div>
        </div>
        <div className="w-96 bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-12 w-full rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
