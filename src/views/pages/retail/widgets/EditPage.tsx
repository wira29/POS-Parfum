import { Breadcrumb } from "@/views/components/Breadcrumb";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useApiClient } from "@/core/helpers/ApiClient";
import { Toaster } from "@/core/helpers/BaseAlert";
import InputOneImage from "@/views/components/Input-v2/InputOneImage";
import { LoadingCards } from "@/views/components/Loading";

export default function RetailEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const apiClient = useApiClient();

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    telp: "",
    image: null as File | string | null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOutletDetail = async () => {
      try {
        const response = await apiClient.get(`/outlets/${id}`);
        const outlet = response.data?.data?.outlet;

        if (outlet) {
          setFormData({
            name: outlet.name || "",
            address: outlet.address || "",
            telp: outlet.telp || "",
            image: outlet.image
              ? `${import.meta.env.VITE_API_BASE_URL}${outlet.image}`
              : null,
          });
        }
      } catch (error) {
        Toaster("error", "Gagal mengambil data retail");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOutletDetail();
  }, [id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, image: file }));
    setErrors((prev) => ({ ...prev, image: "" }));
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setErrors((prev) => ({ ...prev, image: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Nama retail wajib diisi";
    if (!formData.address.trim()) newErrors.address = "Alamat wajib diisi";
    if (!formData.telp.trim()) newErrors.telp = "Nomor telepon wajib diisi";
    else if (!/^[0-9+\-()\s]+$/.test(formData.telp))
      newErrors.telp = "Format nomor tidak valid";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Toaster("error", "Harap perbaiki input terlebih dahulu");
      return;
    }

    const payload = new FormData();
    payload.append("name", formData.name.trim());
    payload.append("address", formData.address.trim());
    payload.append("telp", formData.telp.trim());

    if (formData.image instanceof File) {
      payload.append("image", formData.image);
    }

    for (let [key, val] of payload.entries()) {
      console.log(`${key}:`, val);
    }

    try {
      await apiClient.put(`/outlets/${id}`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Toaster("success", "Retail berhasil diperbarui");
      navigate("/retails");
    } catch (error: any) {
      if (error.response?.status === 400 && error.response.data?.data) {
        const mappedErrors: Record<string, string> = {};
        Object.entries(error.response.data.data).forEach(([key, val]) => {
          if (Array.isArray(val)) mappedErrors[key] = val[0];
        });
        setErrors(mappedErrors);
        Toaster("error", "Terdapat kesalahan input");
      } else {
        Toaster("error", "Gagal memperbarui retail");
      }
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <LoadingCards />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb title="Edit Retail" desc="Perbarui data retail." />
      <div className="bg-white rounded-xl p-6 shadow">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Gambar <span className="text-red-500">*</span>
            </label>
            <InputOneImage
              images={formData.image ? [formData.image] : []}
              onImageUpload={handleImageUpload}
              onRemoveImage={handleRemoveImage}
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
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan alamat"
            />
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-400 hover:bg-gray-600 text-white rounded-md"
              onClick={() => navigate("/retails")}
            >
              Kembali
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
