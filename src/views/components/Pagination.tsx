import React from "react";
import clsx from "clsx";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
  showInfo?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  showInfo = true,
}) => {
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisible - 1);
      
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
    }
    
    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();
  const startItem = totalItems && itemsPerPage ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = totalItems && itemsPerPage ? Math.min(currentPage * itemsPerPage, totalItems) : 0;

  return (
    <div className="flex items-center justify-between py-3">
      {showInfo && totalItems && itemsPerPage && (
        <div className="text-sm text-gray-500">
          Menampilkan {startItem} dari {endItem} produk
        </div>
      )}
      
      <div className="flex items-center space-x-1">
        <button
          className={clsx(
            "px-3 py-1 text-sm border rounded",
            currentPage === 1
              ? "text-gray-400 bg-gray-100 border-gray-300 cursor-not-allowed"
              : "text-gray-600 bg-white border-gray-300 hover:bg-gray-50"
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
              "px-3 py-1 text-sm border rounded min-w-[32px]",
              currentPage === page
                ? "bg-gray-200 text-gray-800 border-gray-300"
                : "text-gray-600 bg-white border-gray-300 hover:bg-gray-50"
            )}
          >
            {page}
          </button>
        ))}

        <button
          className={clsx(
            "px-3 py-1 text-sm border rounded",
            currentPage === totalPages
              ? "text-gray-400 bg-gray-100 border-gray-300 cursor-not-allowed"
              : "text-gray-600 bg-white border-gray-300 hover:bg-gray-50"
          )}
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};