import { useState } from "react";
import { FiSearch } from "react-icons/fi";

export default function RoleCreate ({ open, onClose }: { open: boolean, onClose: () => void }) {
  const [name, setName] = useState("");
  const [guard, setGuard] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const guardOptions = [
    { value: "web", label: "Web" },
    { value: "api", label: "API" },
    { value: "admin", label: "Admin" },
  ];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="w-full max-w-[450px] rounded-2xl overflow-hidden shadow-lg bg-white">
        <div className="bg-blue-600 px-8 py-6">
          <h2 className="text-white text-xl font-bold text-center">Tambah Role Baru</h2>
        </div>
        <div className="px-8 py-8 min-h-[350px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nama <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Nama Role"
            value={name}
            onChange={e => setName(e.target.value)}
          />

          <label className="block text-sm font-medium text-gray-700 mb-1">
            Guard Name <span className="text-red-500">*</span>
          </label>
          <div className="relative mb-6">
            <button
              type="button"
              className="w-full border border-gray-300 rounded-md px-3 py-2 flex items-center text-left focus:outline-none focus:ring-2 focus:ring-blue-200"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <FiSearch className="mr-2 text-gray-400" />
              <span className={guard ? "text-gray-900" : "text-gray-400"}>
                {guard
                  ? guardOptions.find(opt => opt.value === guard)?.label
                  : "Ketik atau pilih..."}
              </span>
            </button>
            {showDropdown && (
              <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-md shadow z-10">
                {guardOptions.map(opt => (
                  <div
                    key={opt.value}
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                    onClick={() => {
                      setGuard(opt.value);
                      setShowDropdown(false);
                    }}
                  >
                    {opt.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="border-t border-gray-200 px-8 py-4 bg-white flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded border border-gray-300"
            onClick={onClose}
          >
            Batal
          </button>
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white font-semibold"
            // onClick={}
          >
            Tambah
          </button>
        </div>
      </div>
    </div>
  );
}