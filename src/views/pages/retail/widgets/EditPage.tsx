import { Breadcrumb } from "@/views/components/Breadcrumb"
import { useNavigate, useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { useApiClient } from "@/core/helpers/ApiClient"
import { Toaster } from "@/core/helpers/BaseAlert"

export default function RetailEdit() {
  const navigate = useNavigate()
  const { id } = useParams()
  const apiClient = useApiClient()

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    telp: "",
    image: null
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOutletDetail = async () => {
      try {
        const response = await apiClient.get(`/outlets/${id}`)
        const outlet = response.data.data

        setFormData({
          name: outlet.name || "",
          address: outlet.address || "",
          telp: outlet.telp || "",
          image: null
        })
      } catch (error) {
        console.error("Failed to fetch outlet detail:", error)
        Toaster("error", "Gagal mengambil data retail")
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchOutletDetail()
  }, [id, apiClient])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, image: e.target.files[0] }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const payload = new FormData()
    payload.append("name", formData.name)
    payload.append("address", formData.address)
    payload.append("telp", formData.telp)
    if (formData.image) {
      payload.append("image", formData.image)
    }

    try {
      await apiClient.put(`/outlets/${id}`, payload, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      Toaster("success", "Retail berhasil diperbarui")
      navigate("/retails")
    } catch (error) {
      if (error.response?.status === 429) {
        Toaster("error", "Terlalu banyak permintaan. Silakan coba lagi nanti.")
      } else {
        Toaster("error", "Gagal memperbarui retail")
      }
      console.error("Error submitting form:", error)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb title="Edit Retail" desc="Perbarui data retail." />
      <div className="bg-white rounded-xl p-6 shadow">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Nama Retail<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Masukkan nama retail"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                No Telp<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="telp"
                value={formData.telp}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="No telepon retail"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Gambar (opsional)</label>
              <input
                type="file"
                name="image"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Alamat<span className="text-red-500">*</span>
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Masukkan alamat"
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-400 text-white rounded-md"
              onClick={() => navigate("/retails")}
            >
              Kembali
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
