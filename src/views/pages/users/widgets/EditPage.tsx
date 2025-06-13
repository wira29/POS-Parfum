import { useApiClient } from "@/core/helpers/ApiClient";
import { Toaster } from "@/core/helpers/BaseAlert";
import { Breadcrumb } from "@/views/components/Breadcrumb";
import { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

const availableRoles = [
  { value: "warehouse", label: "Warehouse" },
  { value: "outlet", label: "Outlet" },
  { value: "admin", label: "Admin" },
];

export default function UserEdit() {
  const api = useApiClient();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [userData, setUserData] = useState({
    username: "",
    email: "",
    role: [""],
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangeRole = (index: number, value: string) => {
    const updatedRoles = [...userData.role];
    updatedRoles[index] = value;
    setUserData((prev) => ({ ...prev, role: updatedRoles }));
  };

  const handleAddRole = () => {
    setUserData((prev) => ({ ...prev, role: [...prev.role, ""] }));
  };

  const handleRemoveRole = (index: number) => {
    const updatedRoles = userData.role.filter((_, i) => i !== index);
    setUserData((prev) => ({ ...prev, role: updatedRoles }));
  };

  const handleSubmit = async () => {
    const rolesFiltered = userData.role.filter((r) => r.trim() !== "");

    if (!userData.username.trim() || !userData.email.trim() || rolesFiltered.length === 0) {
      alert("Mohon isi semua field yang wajib.");
      return;
    }

    const payload: any = {
      name: userData.username,
      email: userData.email,
      role: rolesFiltered,
    };

    if (userData.password.trim()) {
      payload.password = userData.password;
    }

    try {
      await api.put(`/users/${id}`, payload);
      Toaster("success", "User berhasil diperbarui");
      navigate("/users");
    } catch (error) {
      Toaster("error", "Gagal memperbarui user");
      console.error(error);
    }
  };

  const handleBack = () => {
    navigate("/users");
  };

  const labelClass = "block mb-1 text-sm font-semibold";

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb
        title="Edit Pengguna"
        desc="Ubah informasi pengguna sesuai kebutuhan."
      />

      <div className="bg-white rounded-xl p-6 shadow space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-32 h-32 border rounded flex items-center justify-center bg-gray-50 overflow-hidden">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ccc"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            )}
            <input
              type="file"
              accept="image/png, image/jpeg"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>
          <button
            onClick={handleUploadClick}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Unggah Gambar
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="username"
              value={userData.username}
              onChange={handleInputChange}
              placeholder="Masukkan username"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className={labelClass}>
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleInputChange}
              placeholder="johndoe@example.com"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div className="md:col-span-1 space-y-3">
            <label className={labelClass}>
              Role <span className="text-red-500">*</span>
            </label>

            {userData.role.map((role, i) => {
              const selectedRolesExceptCurrent = userData.role.filter(
                (_, idx) => idx !== i
              );

              return (
                <div key={i} className="flex items-center gap-2">
                  <select
                    className="flex-grow border border-gray-300 rounded px-3 py-2"
                    value={role}
                    onChange={(e) => handleChangeRole(i, e.target.value)}
                  >
                    <option value="">-- Pilih Role --</option>
                    {availableRoles
                      .filter((r) => !selectedRolesExceptCurrent.includes(r.value))
                      .map((r) => (
                        <option key={r.value} value={r.value}>
                          {r.label}
                        </option>
                      ))}
                  </select>
                  {userData.role.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveRole(i)}
                      className="text-red-600 hover:text-red-800"
                      title="Hapus role"
                    >
                      &times;
                    </button>
                  )}
                </div>
              );
            })}

            <button
              type="button"
              onClick={handleAddRole}
              className="text-blue-600 text-sm flex items-center gap-1 mt-1"
            >
              + Tambah Role
            </button>
          </div>

          <div>
            <label className={labelClass}>
              Password{" "}
              <span className="text-gray-400 text-xs">(kosong = tidak diubah)</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={userData.password}
                onChange={handleInputChange}
                placeholder="Masukkan password baru"
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.97 10.97 0 0 1 12 19c-5 0-9-4-9-7a6.12 6.12 0 0 1 1.64-3.94" />
                    <path d="M1 1l22 22" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-8">
          <button
            type="button"
            onClick={handleBack}
            className="px-6 py-2 bg-gray-400 text-white rounded"
          >
            Kembali
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 text-white rounded"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
