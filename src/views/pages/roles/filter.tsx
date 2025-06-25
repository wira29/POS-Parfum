import { FiSearch } from "react-icons/fi";

export default function FilterModal({
  open,
  onClose,
  onApply,
  onReset,
  nameValue,
  setNameValue,
  emailValue,
  setEmailValue,
  statusValue,
  setStatusValue,
  joinFrom,
  setJoinFrom,
  joinTo,
  setJoinTo,
}: {
  open: boolean;
  onClose: () => void;
  onApply: () => void;
  onReset: () => void;
  nameValue: string;
  setNameValue: (val: string) => void;
  emailValue: string;
  setEmailValue: (val: string) => void;
  statusValue: string;
  setStatusValue: (val: string) => void;
  joinFrom: string;
  setJoinFrom: (val: string) => void;
  joinTo: string;
  setJoinTo: (val: string) => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-[600px]">
        <div className="px-6 pt-6 pb-3">
          <h2 className="text-lg font-bold text-gray-900">Filter Data</h2>
        </div>
        <div className="border-b border-gray-200"></div>

        <div className="px-6 py-4 min-h-[350px]">
          <div className="mb-4">
            <label className="block text-sm text-gray-700 mb-1">Nama pengguna</label>
            <div className="relative">
              <div className="w-full border border-gray-300 rounded-md px-3 py-2 flex items-center text-left focus-within:ring-2 focus-within:ring-blue-200">
                <FiSearch className="mr-2 text-gray-400" />
                <input
                  type="text"
                  className="flex-1 bg-transparent outline-none"
                  placeholder="ketik atau pilih..."
                  value={nameValue}
                  onChange={e => setNameValue(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-700 mb-1">Email</label>
            <div className="relative">
              <div className="w-full border border-gray-300 rounded-md px-3 py-2 flex items-center text-left focus-within:ring-2 focus-within:ring-blue-200">
                <FiSearch className="mr-2 text-gray-400" />
                <input
                  type="text"
                  className="flex-1 bg-transparent outline-none"
                  placeholder="ketik atau pilih..."
                  value={emailValue}
                  onChange={e => setEmailValue(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm text-gray-700 mb-1">Status Pengguna</label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
              value={statusValue}
              onChange={e => setStatusValue(e.target.value)}
            >
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm text-gray-700 mb-1">Tanggal bergabung</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={joinFrom}
                onChange={e => setJoinFrom(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-700 mb-1">Hingga tanggal</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={joinTo}
                onChange={e => setJoinTo(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200"></div>

        <div className="flex items-center justify-between px-6 py-4">
          <button
            className="px-4 py-2 rounded border border-gray-300 bg-gray-100 text-gray-700 font-medium hover:bg-gray-200"
            onClick={onReset}
          >
            Reset
          </button>
          <div className="flex gap-2">
            <button
              className="px-4 py-2 rounded border border-gray-300 bg-gray-100 text-gray-700 font-medium hover:bg-gray-200"
              onClick={onClose}
            >
              Batal
            </button>
            <button
              className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700"
              onClick={onApply}
            >
              Terapkan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}