import React, { useState, useEffect } from "react";

interface Unit {
  id: string;
  name: string;
  code: string;
}

interface ModalQuantityProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (qty: string, unitId: string) => void;
  initialValue?: string;
  units: Unit[];
  selectedUnit: string;
  setSelectedUnit: (id: string) => void;
}

export default function ModalQuantity({
  open,
  onClose,
  onSubmit,
  initialValue = "",
  units,
  selectedUnit,
  setSelectedUnit,
}: ModalQuantityProps) {
  const [quantity, setQuantity] = useState(initialValue);

  useEffect(() => {
    setQuantity(initialValue);
  }, [initialValue]);

  if (!open) return null;

  const isEdit = initialValue !== "";

  return (
    <div className="fixed bg-black/50 inset-0 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl w-[90%] max-w-sm shadow-lg">
        <div className="bg-blue-600 text-white text-center py-3 rounded-t-2xl text-lg font-semibold">
          Atur Quantity
        </div>
        <div className="px-6 py-5 space-y-4">
          <label className="text-sm font-medium text-gray-700">
            Quantity<span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              min={0}
              placeholder="Masukan Quantity"
              className="w-full pl-4 pr-16 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="absolute inset-y-0 right-0 w-14 text-sm text-gray-700 bg-gray-200 border-l border-gray-200 rounded-r-lg px-2 outline-none"
            >
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.code}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 rounded-b-2xl">
          <button
            className="bg-gray-400 text-white px-5 py-2 rounded hover:bg-gray-500"
            onClick={onClose}
          >
            Batal
          </button>
          <button
            className={`${isEdit
              ? "bg-yellow-400 hover:bg-yellow-500"
              : "bg-blue-600 hover:bg-blue-700"
              } text-white px-5 py-2 rounded disabled:opacity-50`}
            disabled={quantity === ""}
            onClick={() => {
              onSubmit(quantity, selectedUnit);
              onClose();
            }}
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
