import { useState, useEffect } from "react";
import { useApiClient } from "@/core/helpers/ApiClient";
import { Toast, Toaster } from "@/core/helpers/BaseAlert";

export default function EditUnitModal({ open, onClose, unit, onSuccess }) {
  const ApiClient = useApiClient();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");

  useEffect(() => {
    if (unit) {
      setName(unit.name || "");
      setCode(unit.code || "");
    }
  }, [unit]);

  const handleUpdate = async () => {
    if (!name.trim() || !code.trim()) {
      setErrors("Nama dan kode tidak boleh kosong.");
      return;
    }

    setLoading(true);
    setErrors("");

    try {
      await ApiClient.put(`/unit/${unit.id}`, { name, code });
      Toast("success", `Berhasil merubah data ${name}`);
      onSuccess();
      onClose();
    } catch (error) {
      const allErrors = error.response?.data?.data || {};
      const messages = Object.values(allErrors).flat();
      messages.forEach((msg) => Toaster("error", msg));
      setErrors(allErrors);
    } finally {
      setLoading(false);
    }
  };

  if (!open || !unit) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4">
        <h2 className="text-lg font-semibold">Edit Unit</h2>

        <div className="space-y-2">
          <div>
            <label className="text-sm font-medium">Nama Unit</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full border rounded-md px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 ${
                errors.name
                  ? "focus:ring-red-500 border-red-300"
                  : "focus:ring-blue-500 border-slate-300"
              } focus:border-transparent`}
              placeholder="Contoh: Kilogram"
            />
            {errors.name && <p className="text-red-500 text-sm mt-3">{errors.name}</p>}
          </div>
          <div>
            <label className="text-sm font-medium">Kode Unit</label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className={`w-full border rounded-md px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 ${
                errors.code
                  ? "focus:ring-red-500 border-red-300"
                  : "focus:ring-blue-500 border-slate-300"
              } focus:border-transparent`}
              placeholder="Contoh: kg"
            />
            {errors.code && (
              <p className="text-red-500 text-sm mt-3">{errors.code}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded cursor-pointer hover:bg-gray-300"
          >
            Batal
          </button>
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </div>
    </div>
  );
}
