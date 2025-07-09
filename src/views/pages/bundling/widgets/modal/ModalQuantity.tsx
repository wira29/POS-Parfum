import { useEffect, useState } from "react";

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
  unit?: {
    id: string;
    code: string;
  };
}

export default function ModalQuantity({
  open,
  onClose,
  onSubmit,
  initialValue = "",
  units,
  selectedUnit,
  setSelectedUnit,
  unit,
}: ModalQuantityProps) {
  const [quantity, setQuantity] = useState(initialValue);
  const [inputError, setInputError] = useState("");

  useEffect(() => {
    setQuantity(initialValue);
    setInputError("");
  }, [initialValue, open]);

  const handleSubmit = () => {
    if (!quantity) {
      setInputError("Quantity harus diisi");
      return;
    }
    if (parseFloat(quantity) <= 0) {
      setInputError("Quantity harus lebih dari 0");
      return;
    }
    onSubmit(quantity, selectedUnit);
    onClose();
  };

  if (!open) return null;

  const isEdit = initialValue !== "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl w-[95%] max-w-md shadow-xl overflow-hidden">
        <div className="bg-blue-600 text-white px-6 py-4">
          <h3 className="text-lg font-semibold">
            {isEdit ? "Edit Quantity" : "Tambah Quantity"}
          </h3>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                step="1"
                placeholder="Masukkan quantity"
                className={`w-full px-4 py-2 border ${inputError ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                value={quantity}
                onChange={(e) => {
                  setQuantity(e.target.value);
                  setInputError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSubmit();
                  if (e.key === "-" || e.key === "e") e.preventDefault();
                }}
              />
              {unit ? (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500 bg-gray-100 rounded-r-lg px-4">
                  {unit.code}
                </div>
              ) : (
                <select
                  value={selectedUnit}
                  onChange={(e) => setSelectedUnit(e.target.value)}
                  className="absolute inset-y-0 right-0 text-sm text-gray-700 bg-gray-100 border-l border-gray-300 rounded-r-lg px-3 outline-none"
                >
                  <option value="" disabled>
                    Pilih Unit
                  </option>
                  {Array.isArray(units) && units.map((u: Unit) => (
                    <option key={u.id} value={u.id}>
                      {u.code}
                    </option>
                  ))}
                </select>
              )}
            </div>
            {inputError && (
              <p className="mt-1 text-sm text-red-600">{inputError}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            className={`px-4 py-2 text-white rounded-lg transition-colors ${
              isEdit
                ? "bg-yellow-500 hover:bg-yellow-600"
                : "bg-blue-600 hover:bg-blue-700"
            } ${!quantity ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={!quantity}
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}