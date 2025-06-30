import React, { useEffect, useState } from "react";

interface RestockModalProps {
  open: boolean;
  onClose: () => void;
  initialData?: {
    warehouse?: string;
    produk?: string;
    qty?: string;
  } | null;
  onSubmit?: (data: { warehouse: string; produk: string; qty: string }) => void;
}

export const RestockModal = ({
  open,
  onClose,
  initialData,
  onSubmit,
}: RestockModalProps) => {
  const [warehouse, setWarehouse] = useState("");
  const [produk, setProduk] = useState("");
  const [qty, setQty] = useState("");

  useEffect(() => {
    setWarehouse(initialData?.warehouse || "");
    setProduk(initialData?.produk || "");
    setQty(initialData?.qty || "");
  }, [open, initialData]);

  if (!open) return null;

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({ warehouse, produk, qty });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}>
      <div className="bg-white rounded-md shadow-lg max-w-md w-full">
        <div className="bg-blue-600 text-white text-center py-3 rounded-t-md text-lg font-semibold">
          Restok Produk Anda
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse</label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={warehouse}
              onChange={e => setWarehouse(e.target.value)}
            >
              <option value="">Pilih Warehouse</option>
              <option value="Gudang A">Warehouse A</option>
              <option value="Gudang B">Warehouse B</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Produk</label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={produk}
              onChange={e => setProduk(e.target.value)}
            >
              <option value="">Ketik atau pilih...</option>
              <option value="Parfum A">Parfum A</option>
              <option value="Parfum B">Parfum B</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Permintaan</label>
            <div className="flex">
              <input
                type="number"
                placeholder="1000"
                className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={qty}
                onChange={e => setQty(e.target.value)}
              />
              <span className="px-3 py-2 border border-l-0 border-gray-300 bg-gray-100 rounded-r-md text-sm">
                Gram
              </span>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            type="button"
          >
            Batalkan
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={handleSubmit}
            type="button"
          >
            Restock
          </button>
        </div>
      </div>
    </div>
  );
};