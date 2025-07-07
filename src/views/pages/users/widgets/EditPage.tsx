import { useApiClient } from "@/core/helpers/ApiClient";
import { Toaster } from "@/core/helpers/BaseAlert";
import { Breadcrumb } from "@/views/components/Breadcrumb";
import InputOneImage from "@/views/components/Input-v2/InputOneImage";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

const allowedRoleMap: Record<string, string[]> = {
  outlet: ["cashier", "employee", "outlet"],
  warehouse: ["cashier", "employee", "warehouse"],
  owner: [],
};

export default function UserEdit() {
  const api = useApiClient();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [images, setImages] = useState<(File | string)[]>([]);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [availableRoles, setAvailableRoles] = useState<
    { value: string; label: string }[]
  >([]);
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    role: [""],
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const fetchAll = async () => {
      try {
        const response = await api.get(`/users/${id}`);
        const user = response.data?.data;
        setUserData({
          username: user.name || "",
          email: user.email || "",
          role: user.role || [""],
          password: "",
        });
        if (user.image) {
          setImages([`${import.meta.env.VITE_MIJURNAL_STORAGE}${user.image}`]);
        }

        const meRes = await api.get("/me");
        const currentUserRoles = meRes.data.data.roles.map((r: any) => r.name);
        setUserRoles(currentUserRoles);

        const roleRes = await api.get("/roles?per_page=100");
        const allRoles = roleRes.data.data;

        let allowedSet = new Set<string>();

        currentUserRoles.forEach((role) => {
          if (role === "owner") {
            allRoles.forEach((r: any) => allowedSet.add(r.name));
          } else {
            const allowed = allowedRoleMap[role] || [];
            allowed.forEach((r) => allowedSet.add(r));
          }
        });

        const filteredRoles = allRoles
          .filter((role: any) => allowedSet.has(role.name))
          .map((role: any) => ({
            value: role.name,
            label: role.name.charAt(0).toUpperCase() + role.name.slice(1),
          }));

        setAvailableRoles(filteredRoles);
      } catch (error) {
        Toaster("error", "Gagal mengambil data user");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [api, id]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImages([file]);
  };

  const handleRemoveImage = () => {
    setImages([]);
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
    const payload: any = {
      name: userData.username,
      email: userData.email,
      role: rolesFiltered,
    };
    if (userData.password.trim()) {
      payload.password = userData.password;
    }
    if (images.length > 0 && images[0] instanceof File) {
      const formData = new FormData();
      formData.append("name", userData.username);
      formData.append("email", userData.email);
      formData.append("role", JSON.stringify(rolesFiltered));
      formData.append("image", images[0]);
      if (userData.password.trim()) {
        formData.append("password", userData.password);
      }
      try {
        await api.put(`/users/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Toaster("success", "User berhasil diperbarui");
        navigate("/users");
      } catch (error) {
        Toaster("error", "Gagal memperbarui user");
      }
      return;
    }
    try {
      await api.put(`/users/${id}`, payload);
      Toaster("success", "User berhasil diperbarui");
      navigate("/users");
    } catch (error) {
      Toaster("error", "Gagal memperbarui user");
    }
  };

  const handleBack = () => {
    navigate("/users");
  };

  const labelClass = "block mb-1 text-sm font-semibold";

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb
        title="Edit Pengguna"
        desc="Ubah informasi pengguna sesuai kebutuhan."
      />
      <div className="bg-white rounded-xl p-6 shadow space-y-6">
        <div className="flex items-center gap-4">
          <div className="space-y-2 flex-col">
            <label className="block text-sm font-medium">
              Gambar <span className="text-red-500">*</span>
            </label>
            <InputOneImage
              images={images}
              onImageUpload={handleImageUpload}
              onRemoveImage={handleRemoveImage}
              label="Foto User"
              className="w-32 h-32"
            />
          </div>
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
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="flex-grow border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={role}
                    onChange={(e) => handleChangeRole(i, e.target.value)}
                  >
                    <option value="">-- Pilih Role --</option>
                    {availableRoles
                      .filter(
                        (r) => !selectedRolesExceptCurrent.includes(r.value)
                      )
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
              <span className="text-gray-400 text-xs">
                (kosong = tidak diubah)
              </span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={userData.password}
                onChange={handleInputChange}
                placeholder="Masukkan password baru"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
                title={
                  showPassword ? "Sembunyikan password" : "Tampilkan password"
                }
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
            className="px-6 py-2 bg-gray-400 text-white rounded cursor-pointer"
          >
            Kembali
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 text-white rounded cursor-pointer"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
