import { useApiClient } from "@/core/helpers/ApiClient";
import { Toaster } from "@/core/helpers/BaseAlert";
import { Breadcrumb } from "@/views/components/Breadcrumb";
import InputOneImage from "@/views/components/Input-v2/InputOneImage";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const roleOptionsMap: Record<string, { value: string; label: string }[]> = {
    admin: [
        { value: "warehouse", label: "Warehouse" },
        { value: "outlet", label: "Outlet" },
        { value: "admin", label: "Admin" },
        { value: "staff_outlet", label: "Karyawan Outlet" },
        { value: "staff_warehouse", label: "Karyawan Warehouse" },
    ],
    warehouse: [
        { value: "warehouse", label: "Warehouse" },
        { value: "staff_warehouse", label: "Karyawan Warehouse" },
    ],
    outlet: [
        { value: "outlet", label: "Outlet" },
        { value: "staff_outlet", label: "Karyawan Outlet" },
    ],
    owner: [
        { value: "warehouse", label: "Warehouse" },
        { value: "outlet", label: "Outlet" },
        { value: "admin", label: "Admin" },
        { value: "staff_outlet", label: "Karyawan Outlet" },
        { value: "staff_warehouse", label: "Karyawan Warehouse" },
    ],
    manager: [
        { value: "staff_outlet", label: "Karyawan Outlet" },
    ],
    auditor: [],
};

export default function UserCreateSelect() {
    const api = useApiClient();
    const navigate = useNavigate();

    const [userRoles, setUserRoles] = useState<string[]>([]);
    const [availableRoles, setAvailableRoles] = useState<{ value: string; label: string }[]>([]);
    const [images, setImages] = useState<(File | string)[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState(false);

    const [userData, setUserData] = useState({
        username: "",
        email: "",
        role: [""],
        password: "",
    });

    useEffect(() => {
        fetchUserRole();
    }, []);

    const fetchUserRole = async () => {
        try {
            const res = await api.get("/me");
            const roles = res.data.data.roles.map((r: any) => r.name);
            setUserRoles(roles);

            const mergedRoles: Record<string, boolean> = {};
            roles.forEach((r: string) => {
                (roleOptionsMap[r] || []).forEach((opt) => {
                    mergedRoles[opt.value] = true;
                });
            });

            const finalRoleList = Object.keys(mergedRoles).map((val) => {
                const found = Object.values(roleOptionsMap).flat().find((r) => r.value === val);
                return found || { value: val, label: val };
            });

            setAvailableRoles(finalRoleList);
        } catch (err) {
            console.error("Gagal mengambil role user:", err);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setImages([file]);
    };
    const handleRemoveImage = (index: number) => {
        setImages([]);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleChangeRole = (index: number, value: string) => {
        const updatedRoles = [...userData.role];
        updatedRoles[index] = value;
        setUserData({ ...userData, role: updatedRoles });
        setErrors((prev) => ({ ...prev, role: "" }));
    };

    const handleAddRole = () => {
        setUserData({ ...userData, role: [...userData.role, ""] });
    };

    const handleRemoveRole = (index: number) => {
        const updatedRoles = userData.role.filter((_, i) => i !== index);
        setUserData({ ...userData, role: updatedRoles });
    };

    const handleSubmit = async () => {
        const rolesFiltered = userData.role.filter((r) => r.trim() !== "");

        const newErrors: Record<string, string> = {
            username: !userData.username.trim() ? "Username wajib diisi" : "",
            email: !userData.email.trim() ? "Email wajib diisi" : "",
            password: !userData.password.trim() ? "Password wajib diisi" : "",
            role: rolesFiltered.length === 0 ? "Minimal satu role harus dipilih" : "",
        };

        setErrors(newErrors);

        const hasError = Object.values(newErrors).some((err) => err !== "");
        if (hasError) {
            Toaster("error", "Harap lengkapi semua field yang wajib diisi");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("name", userData.username);
            formData.append("email", userData.email);
            formData.append("role", JSON.stringify(rolesFiltered));
            formData.append("password", userData.password);
            if (images.length > 0 && images[0] instanceof File) {
                formData.append("image", images[0]);
            }
            await api.post("/users", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            navigate("/users");
            Toaster("success", "User berhasil dibuat");
        } catch (error: any) {
            if (error.response?.data?.data) {
                const apiErrors = error.response.data.data;
                const mappedErrors: Record<string, string> = {};
                Object.entries(apiErrors).forEach(([key, val]) => {
                    if (Array.isArray(val)) {
                        mappedErrors[key] = val[0];
                    }
                });
                setErrors(mappedErrors);
                Toaster("error", "Terdapat kesalahan pada input");
            } else {
                Toaster("error", "User gagal dibuat");
                console.error(error);
            }
        }
    };

    const handleBack = () => navigate("/users");

    const labelClass = "block mb-1 text-sm font-semibold";

    return (
        <div className="p-6 space-y-6">
            <Breadcrumb title="Tambah Pengguna" desc="Isi informasi dasar untuk menambahkan pengguna baru." />
            <div className="bg-white rounded-xl p-6 shadow space-y-6">
                <div className="flex items-center gap-4">
                    <InputOneImage
                        images={images}
                        onImageUpload={handleImageUpload}
                        onRemoveImage={handleRemoveImage}
                        label="Foto User"
                        className="w-32 h-32"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className={labelClass}>Username <span className="text-red-500">*</span></label>
                        <input type="text" name="username" value={userData.username} onChange={handleInputChange} placeholder="Masukkan username" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                        {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
                    </div>

                    <div>
                        <label className={labelClass}>Email <span className="text-red-500">*</span></label>
                        <input type="email" name="email" value={userData.email} onChange={handleInputChange} placeholder="johndoe@example.com" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div className="md:col-span-1 space-y-3">
                        <label className={labelClass}>Role <span className="text-red-500">*</span></label>
                        {userData.role.map((role, i) => {
                            const selectedRolesExceptCurrent = userData.role.filter((_, idx) => idx !== i);
                            return (
                                <div key={i} className="flex items-center gap-2">
                                    <select
                                        className="flex-grow border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                        <button type="button" onClick={() => handleRemoveRole(i)} className="text-red-600 hover:text-red-800" title="Hapus role">
                                            &times;
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                        {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
                        <button type="button" onClick={handleAddRole} className="text-blue-600 text-sm mt-1">+ Tambah Role</button>
                    </div>

                    <div>
                        <label className={labelClass}>Password <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={userData.password}
                                onChange={handleInputChange}
                                placeholder="Masukkan password"
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button type="button" className="absolute right-3 top-2.5 text-gray-500" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path d="M17.94 17.94A10.97 10.97 0 0 1 12 19c-5 0-9-4-9-7a6.12 6.12 0 0 1 1.64-3.94" />
                                        <path d="M1 1l22 22" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>
                </div>

                <div className="flex justify-end space-x-3 mt-8">
                    <button type="button" onClick={handleBack} className="px-6 py-2 bg-gray-400 text-white rounded">
                        Kembali
                    </button>
                    <button type="button" onClick={handleSubmit} className="px-6 py-2 bg-blue-600 text-white rounded">
                        Tambah
                    </button>
                </div>
            </div>
        </div>
    );
}