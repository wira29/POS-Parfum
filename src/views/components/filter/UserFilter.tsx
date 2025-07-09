import { X } from "lucide-react";

interface UserFilterModalProps {
  open: boolean;
  onClose: () => void;
  selectedRole: string;
  setSelectedRole: (value: string) => void;
  availableRoles: string[];
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
  startDate: string;
  setStartDate: (value: string) => void;
  endDate: string;
  setEndDate: (value: string) => void;
  onApply: () => void;
  onSuccess: () => void;
}

export const UserFilterModal = ({
  open,
  onSuccess,
  onClose,
  selectedRole,
  setSelectedRole,
  availableRoles,
  selectedStatus,
  setSelectedStatus,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onApply,
}: UserFilterModalProps) => {
  if (!open) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleReset = () => {
    onSuccess();
    onClose();
    setSelectedRole("");
    setSelectedStatus("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl mx-4">
        <div className="flex items-center justify-between p-5 border-gray-400 border-b">
          <h2 className="text-lg font-semibold">Filter Data</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full border rounded-md px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-300"
              >
                <option value="">Ketik atau pilih...</option>
                {availableRoles.map((role, i) => (
                  <option key={i} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status Pengguna
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full border rounded-md px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-300"
              >
                <option value="">Pilih Status</option>
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Bergabung
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border rounded-md px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hingga Tanggal
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border rounded-md px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-300"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end items-center gap-2 p-5 border-gray-400 border-t">
          <button
            onClick={handleReset}
            className="px-4 py-2 border border-gray-200 cursor-pointer rounded-lg text-sm text-gray-700 hover:bg-gray-100"
          >
            Reset
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 cursor-pointer rounded-lg text-sm text-gray-700 hover:bg-gray-100"
          >
            Batal
          </button>
          <button
            onClick={() => {
              onApply();
              onClose();
            }}
            className="px-4 py-2 bg-blue-600 border cursor-pointer border-gray-200 text-white text-sm rounded-lg hover:bg-blue-700"
          >
            Terapkan
          </button>
        </div>
      </div>
    </div>
  );
};
