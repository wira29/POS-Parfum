import { useState, useEffect } from "react";

export const FilterModal = ({
  open,
  onClose,
  statusFilter,
  setStatusFilter,
  warehouseFilter,
  setwarehouseFilter,
  produkFilter,
  setProdukFilter,
  kategoriFilter,
  setKategoriFilter,
  kategoriOptions,
  produkOptions,
  warehouseOptions,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  minRequest,
  setMinRequest,
  maxRequest,
  setMaxRequest,
  onApply,
}) => {
  const [searchWarehouse, setSearchWarehouse] = useState("");

  useEffect(() => {
    setSearchWarehouse(warehouseFilter || "");
  }, [warehouseFilter]);

  const filteredWarehouses = warehouseOptions.filter((w) =>
    w.toLowerCase().includes(searchWarehouse.toLowerCase())
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-lg p-8 min-w-[500px] max-w-[600px] w-full max-h-[90vh] overflow-y-auto">
        <div className="font-bold text-2xl mb-6">Filter Data</div>
        <div className="border-t border-gray-300 mb-6" />

        <div className="space-y-5">
          <div>
            <label className="block mb-1 font-medium">Warehouse</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Ketik atau pilih..."
                className="w-full border border-gray-300 rounded px-3 py-2 pr-8"
                value={searchWarehouse}
                onChange={(e) => setSearchWarehouse(e.target.value)}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                  <path d="M7 10l5 5 5-5" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              {searchWarehouse && (
                <div className="absolute left-0 right-0 bg-white border border-gray-300 rounded shadow mt-1 z-10 max-h-40 overflow-y-auto">
                  {filteredWarehouses.length === 0 && (
                    <div className="px-3 py-2 text-gray-400 text-sm">Tidak ditemukan</div>
                  )}
                  {filteredWarehouses.map((w, idx) => (
                    <div
                      key={idx}
                      className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                      onClick={() => {
                        setwarehouseFilter(w);
                        setSearchWarehouse(w);
                      }}
                    >
                      {w}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Status</label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Pilih status</option>
              <option value="pending">Menunggu</option>
              <option value="Diproses">Diproses</option>
              <option value="Dikirim">Dikirim</option>
              <option value="approved">Disetujui</option>
              <option value="rejected">Ditolak</option>
            </select>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-1 font-medium">Dari Tanggal</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1 font-medium">Hingga Tanggal</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-1 font-medium">Minimum Request</label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={minRequest}
                onChange={(e) => setMinRequest(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1 font-medium">Maksimum Request</label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={maxRequest}
                onChange={(e) => setMaxRequest(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-300 mt-8 mb-6" />
        <div className="flex justify-between">
          <button
            className="px-5 py-2 rounded border border-gray-300 text-gray-500 font-semibold"
            onClick={() => {
              setSearchWarehouse("");
              setStatusFilter("");
              setDateFrom("");
              setDateTo("");
              setMinRequest("");
              setMaxRequest("");
              setwarehouseFilter("");
              setProdukFilter("");
              setKategoriFilter("");
            }}
          >
            Reset
          </button>
          <div className="flex gap-2">
            <button
              className="px-5 py-2 rounded border border-gray-300 text-gray-500 font-semibold"
              onClick={onClose}
            >
              Batal
            </button>
            <button
              className="px-5 py-2 rounded bg-blue-600 text-white font-semibold"
              onClick={() => {
                onApply();
                onClose();
              }}
            >
              Terapkan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
