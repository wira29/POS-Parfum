import React from "react";
import clsx from "clsx";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="inline-flex overflow-hidden rounded-lg border border-gray-300 text-sm">
      <button
        className={clsx(
          "px-4 py-2 text-gray-700 hover:bg-gray-100",
          currentPage === 1 && "cursor-not-allowed text-gray-400"
        )}
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>

      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={clsx(
            "px-4 py-2 hover:bg-gray-100",
            currentPage === page
              ? "bg-gray-200 text-gray-800 font-semibold"
              : "text-gray-700"
          )}
        >
          {page}
        </button>
      ))}

      <button
        className={clsx(
          "px-4 py-2 text-gray-700 hover:bg-gray-100",
          currentPage === totalPages && "cursor-not-allowed text-gray-400"
        )}
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};
