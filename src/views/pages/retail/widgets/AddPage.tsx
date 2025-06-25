import { Breadcrumb } from "@/views/components/Breadcrumb";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useApiClient } from "@/core/helpers/ApiClient";
import { Toaster } from "@/core/helpers/BaseAlert";
import InputOneImage from "@/views/components/Input-v2/InputOneImage";

export default function RetailCreate() {
  const navigate = useNavigate();
  const apiClient = useApiClient();

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    telp: "",
    image: null as File | null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData({ ...formData, image: file });
    setErrors((prev) => ({ ...prev, image: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Nama retail wajib diisi";
    if (!formData.telp.trim()) newErrors.telp = "Nomor telepon wajib diisi";
    else if (!/^[0-9+\-()\s]+$/.test(formData.telp))
      newErrors.telp = "Format nomor tidak valid";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Toaster("error", "Harap perbaiki input terlebih dahulu");
      return;
    }

    const username = formData.name
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[^a-z0-9]/g, "");
    const email = `${username}@gmail.com`;

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("address", formData.address);
    payload.append("telp", formData.telp);
    if (formData.image) payload.append("image", formData.image);

    const users = [
      {
        name: username,
        email,
        password: "password",
      },
    ];

    users.forEach((user, index) => {
      payload.append(`users[${index}][name]`, user.name);
      payload.append(`users[${index}][email]`, user.email);
      payload.append(`users[${index}][password]`, user.password);
    });

    try {
      await apiClient.post("/outlets", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Toaster("success", "Retail berhasil dibuat");
      navigate("/retails");
    } catch (error: any) {
      const status = error?.response?.status;
      const data = error?.response?.data?.data;

      if (status === 400 && data) {
        const mappedErrors: Record<string, string> = {};
        const mapKeys: Record<string, string> = {
          telp: "telp",
          "users.0.email": "email",
          image: "image",
        };

        Object.entries(data).forEach(([key, val]) => {
          const localKey = mapKeys[key] || key;
          if (Array.isArray(val)) {
            mappedErrors[localKey] = val[0];
          }
        });

        setErrors(mappedErrors);
        Toaster("error", "Terdapat kesalahan input");
      } else {
        Toaster("error", "Gagal menambahkan retail");
        console.error(error);
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb title="Tambah Retail" desc="Tambahkan Retail baru." />
      <div className="bg-white rounded-xl p-6 shadow">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Gambar <span className="text-red-500">*</span>
            </label>
            <InputOneImage
              images={formData.image ? [formData.image] : []}
              onImageUpload={handleFileChange}
              onRemoveImage={() => {
                setFormData({ ...formData, image: null });
              }}
              className="w-full"
              error={errors.image}
            />

            {errors.image && (
              <p className="text-red-500 text-sm">{errors.image}</p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Nama Retail <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full border border-slate-300 rounded-md px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Masukkan nama retail"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                No Telp <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="telp"
                value={formData.telp}
                onChange={handleInputChange}
                className="w-full border border-slate-300 rounded-md px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="No telepon retail"
              />
              {errors.telp && (
                <p className="text-red-500 text-sm">{errors.telp}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Alamat <span className="text-red-500">*</span>
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows={4}
              className="border border-gray-300 w-full rounded-md px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Masukkan alamat"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-400 hover:bg-gray-600 text-white rounded-md cursor-pointer"
              onClick={() => navigate("/retails")}
            >
              Kembali
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md cursor-pointer"
            >
              Tambah
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
