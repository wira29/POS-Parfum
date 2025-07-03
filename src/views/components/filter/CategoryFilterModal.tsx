import { X } from "lucide-react";

interface CategoryFilterModalProps {
  show: boolean;
  onClose: () => void;
  startDate: string;
  endDate: string;
  statusFilter: string;
  setStartDate: (value: string) => void;
  setEndDate: (value: string) => void;
  setStatusFilter: (value: string) => void;
  onApply: () => void;
  onReset: () => void;
}

export const CategoryFilterModal = ({
  show,
  onClose,
  startDate,
  endDate,
  statusFilter,
  setStartDate,
  setEndDate,
  setStatusFilter,
  onApply,
  onReset,
}: CategoryFilterModalProps) => {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xl mx-4 overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Filter Data</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="px-6 py-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dibuat Dari Tanggal</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hingga Tanggal</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-between gap-2">
          <button
            onClick={onReset}
            className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100"
          >
            Reset
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100"
            >
              Batal
            </button>
            <button
              onClick={() => {
                onApply();
                onClose();
              }}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Terapkan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
