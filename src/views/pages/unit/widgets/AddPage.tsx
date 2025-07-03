import { useState } from "react";
import { useApiClient } from "@/core/helpers/ApiClient";

export default function AddUnitModal({ open, onClose, onSuccess }) {
  const ApiClient = useApiClient();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    if (!name.trim() || !code.trim()) {
      setError("Nama dan kode tidak boleh kosong.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await ApiClient.post("/unit", { name, code });
      setName("");
      setCode("");
      onSuccess();
      onClose();
    } catch {
      setError("Gagal menambahkan unit.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
      <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4">
        <h2 className="text-lg font-semibold">Tambah Unit</h2>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <div className="space-y-2">
          <div>
            <label className="text-sm font-medium">Nama Unit</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-md px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent border-slate-300"
              placeholder="Contoh: Kilogram"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Kode Unit</label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full border rounded-md px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent border-slate-300"
              placeholder="Contoh: kg"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded cursor-pointer">Batal</button>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
            disabled={loading}
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}
