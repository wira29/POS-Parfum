import { useState, useEffect } from "react";
import { useApiClient } from "@/core/helpers/ApiClient";

export default function EditUnitModal({ open, onClose, unit, onSuccess }) {
  const ApiClient = useApiClient();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (unit) {
      setName(unit.name || "");
      setCode(unit.code || "");
    }
  }, [unit]);

  const handleUpdate = async () => {
    if (!name.trim() || !code.trim()) {
      setError("Nama dan kode tidak boleh kosong.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await ApiClient.put(`/unit/${unit.id}`, { name, code });
      onSuccess();
      onClose();
    } catch (err) {
      setError("Gagal mengubah unit.");
    } finally {
      setLoading(false);
    }
  };

  if (!open || !unit) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
      <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4">
        <h2 className="text-lg font-semibold">Edit Unit</h2>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <div className="space-y-2">
          <div>
            <label className="text-sm font-medium">Nama Unit</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border px-3 py-2 mt-1 rounded"
              placeholder="Contoh: Kilogram"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Kode Unit</label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full border px-3 py-2 mt-1 rounded"
              placeholder="Contoh: kg"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Batal</button>
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-blue-500 text-white rounded"
            disabled={loading}
          >
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </div>
    </div>
  );
}
