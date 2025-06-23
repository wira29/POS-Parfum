import { useEffect, useRef } from "react";

const FilterModal = ({
  open,
  onClose,
  tanggalMulaiFilter,
  setTanggalMulaiFilter,
  tanggalBerakhirFilter,
  setTanggalBerakhirFilter,
  userMinFilter,
  setUserMinFilter,
  userMaxFilter,
  setUserMaxFilter,
  onApplyFilter,
  onResetFilter,
}: any) => {
  const modalRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (modalRef.current && !(modalRef.current as any).contains(e.target)) {
        onClose();
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 pt-20 overflow-y-auto">
      <div
        ref={modalRef}
        className="bg-white w-full max-w-3xl rounded-xl shadow-lg p-6"
      >
        <div className="text-xl font-semibold text-gray-800 mb-6">
          Filter Data
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Tanggal Dibuat (Mulai)
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={tanggalMulaiFilter}
                onChange={(e) => setTanggalMulaiFilter(e.target.value)

                }
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Jumlah User Minimum
              </label>
              <input
                type="number"
                placeholder="Contoh: 1"
                value={userMinFilter}
                onChange={(e) => setUserMinFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Tanggal Dibuat (Sampai)
              </label>
              <input
                value={tanggalBerakhirFilter}
                onChange={(e) => setTanggalBerakhirFilter(e.target.value)}
                type="date"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Jumlah User Maksimum
              </label>
              <input
                type="number"
                placeholder="Contoh: 100"
                value={userMaxFilter}
                onChange={(e) => setUserMaxFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button
            className="px-6 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
            onClick={onResetFilter}
          >
            Reset
          </button>
          <button
            className="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => {
              onApplyFilter();
              onClose();
            }}
          >
            Terapkan
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
