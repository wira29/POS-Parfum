import { ChangeEvent, MouseEvent } from "react";

interface FilterModalProps {
  open: boolean;
  onReset: () => void;
  onClose: () => void;
  dateFrom: string;
  setDateFrom: (value: string) => void;
  dateTo: string;
  setDateTo: (value: string) => void;
  minStock: string;
  setMinStock: (value: string) => void;
  maxStock: string;
  setMaxStock: (value: string) => void;
  onApply: () => void;
}

export const FilterModal = ({
  open,
  onReset,
  onClose,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  minStock,
  setMinStock,
  maxStock,
  setMaxStock,
  onApply,
}: FilterModalProps) => {
  if (!open) return null;

  const handleReset = () => {
    setDateFrom("");
    setDateTo("");
    setMinStock("");
    setMaxStock("");
    onReset();
  };

  const handleInputChange = (setter: (value: string) => void) => (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setter(e.target.value);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Filter Data</h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Minimum Quantity Restock
              </label>
              <input
                type="number"
                placeholder="Enter Amount"
                className="w-full outline-none px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                value={minStock}
                onChange={handleInputChange(setMinStock)}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Maximum Quantity Restock
              </label>
              <input
                type="number"
                placeholder="Enter Amount"
                className="w-full px-3 py-2 border outline-none border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                value={maxStock}
                onChange={handleInputChange(setMaxStock)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                From Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full px-3 py-2 border outline-none border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                  value={dateFrom}
                  onChange={handleInputChange(setDateFrom)}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                To Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full px-3 py-2 border outline-none border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                  value={dateTo}
                  onChange={handleInputChange(setDateTo)}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <button
            className="px-4 py-2 text-gray-600 border border-slate-300 rounded hover:text-gray-800 font-medium transition-colors text-sm cursor-pointer"
            onClick={handleReset}
          >
            Reset
          </button>
          <div className="flex gap-3">
            <button
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium transition-colors text-sm cursor-pointer"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors text-sm cursor-pointer"
              onClick={(e: MouseEvent<HTMLButtonElement>) => {
                onApply();
                onClose();
              }}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};