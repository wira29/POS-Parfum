interface Column {
  column?: number;
}

function Skeleton({ className = "" }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

export function LoadingForm() {
  return (
    <div className="p-6 space-y-6">
      <Skeleton className="h-8 w-1/3 mb-4" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
            <Skeleton className="h-6 w-1/2 mb-4" />
            <Skeleton className="h-12 w-full mb-4" />
            <Skeleton className="h-12 w-full mb-4" />
            <Skeleton className="h-32 w-full mb-4" />
            <Skeleton className="h-10 w-1/3 mb-4" />
            <Skeleton className="h-10 w-1/3 mb-4" />
            <Skeleton className="h-10 w-1/3 mb-4" />
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
            <Skeleton className="h-6 w-1/2 mb-4" />
            <Skeleton className="h-32 w-full mb-4" />
            <Skeleton className="h-10 w-1/3 mb-4" />
          </div>
        </div>
        <div className="lg:col-span-4">
          <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-6">
            <Skeleton className="h-6 w-1/2 mb-4" />
            <Skeleton className="h-32 w-full mb-4" />
            <Skeleton className="h-10 w-1/3 mb-4" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function LoadingTable({ column = 5 }: Column) {
  return (
    <div className="w-full p-6 space-y-6">
      <div className="overflow-hidden p-5">
        <div className="flex items-center gap-4">
          <div className="w-64 h-10 bg-gray-200 rounded-md animate-pulse"></div>
          <div className="w-10 h-10 bg-gray-200 rounded-md animate-pulse"></div>
        </div>
        <LoadingHeaderColumn column={column} />
        <LoadingColumn column={column} />
      </div>
    </div>
  );
}

export function LoadingColumn({ column = 5 }: Column) {
  return (
    <div className={`flex items-center gap-4 p-4`}>
      {[...Array(column)].map((_, index) => (
        <div
          key={index}
          className="h-6 bg-gray-200 rounded w-5/6 animate-pulse"
        />
      ))}
      <div className="h-6 flex gap-5 justify-center">
        <div className="h-8 w-8 bg-black/20 rounded animate-pulse"></div>
        <div className="h-8 w-8 bg-black/20 rounded animate-pulse"></div>
        <div className="h-8 w-8 bg-black/20 rounded animate-pulse"></div>
      </div>
    </div>
  );
}

export function LoadingSpiner() {
  return (
    <div className="text-center text-gray-400 py-10">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
    </div>
  );
}

export function LoadingHeaderColumn({ column = 5 }: Column) {
  return (
    <>
      {[...Array(column)].map((_, index) => (
        <div
          key={index + 1}
          className="grid grid-cols-4 gap-4 p-4 bg-gray-50 mt-5"
        >
          <div className="h-6 bg-black/20 rounded w-1/3 animate-pulse"></div>
          <div className="h-6 bg-black/20 rounded w-1/2 animate-pulse"></div>
          <div className="h-6 bg-black/20 rounded w-1/3 animate-pulse"></div>
        </div>
      ))}
    </>
  );
}

export function LoadingCards({ column = 4 }: Column) {
  return (
    <>
      <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 mt-5">
        {[...Array(column)].map((_, index) => (
          <div
            key={index + 1}
            className="w-full h-20 bg-black/20 rounded-xl animate-pulse"
          ></div>
        ))}
      </div>
    </>
  );
}
