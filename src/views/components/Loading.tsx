interface Column {
  column?: number;
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
