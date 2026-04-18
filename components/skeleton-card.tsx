export function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="p-6">
        <div className="animate-pulse">
          {/* Title skeleton */}
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          
          {/* Institution skeleton */}
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          
          {/* Meta info skeleton */}
          <div className="flex gap-4 mb-4">
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>
          
          {/* Button skeleton */}
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  )
}
