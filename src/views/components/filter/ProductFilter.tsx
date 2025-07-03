import React from "react";
import { X } from "lucide-react";

interface FilterModalProps {
  open: boolean;
  onClose: () => void;
  onApply: () => void;
  categoryFilter: string;
  setCategoryFilter: (val: string) => void;
  categoryOptions: { id: number; name: string }[];
  stockMin: string;
  setStockMin: (val: string) => void;
  stockMax: string;
  setStockMax: (val: string) => void;
  priceMin: string;
  setPriceMin: (val: string) => void;
  priceMax: string;
  setPriceMax: (val: string) => void;
  salesMin: string;
  setSalesMin: (val: string) => void;
  salesMax: string;
  setSalesMax: (val: string) => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  open,
  onClose,
  onApply,
  categoryFilter,
  setCategoryFilter,
  categoryOptions,
  stockMin,
  setStockMin,
  stockMax,
  setStockMax,
  priceMin,
  setPriceMin,
  priceMax,
  setPriceMax,
  salesMin,
  setSalesMin,
  salesMax,
  setSalesMax,
}) => {
  if (!open) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleReset = () => {
    setCategoryFilter("");
    setStockMin("");
    setStockMax("");
    setPriceMin("");
    setPriceMax("");
    setSalesMin("");
    setSalesMax("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Filter Produk</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 cursor-pointer" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategori Produk
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Kategori</option>
              {categoryOptions.map((cat) => (
                <option key={cat.id} value={cat.id.toString()}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stok Minimum</label>
              <input
                type="number"
                value={stockMin}
                onChange={(e) => setStockMin(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Contoh: 0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stok Maksimum</label>
              <input
                type="number"
                value={stockMax}
                onChange={(e) => setStockMax(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Contoh: 100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Harga Minimum</label>
              <input
                type="number"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Contoh: 1000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Harga Maksimum</label>
              <input
                type="number"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Contoh: 50000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Penjualan Minimum</label>
              <input
                type="number"
                value={salesMin}
                onChange={(e) => setSalesMin(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Contoh: 0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Penjualan Maksimum</label>
              <input
                type="number"
                value={salesMax}
                onChange={(e) => setSalesMax(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Contoh: 100"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 p-4 border-t border-gray-200">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Reset
          </button>
          <button
            onClick={onApply}
            className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            Terapkan
          </button>
        </div>
      </div>
    </div>
  );
};
