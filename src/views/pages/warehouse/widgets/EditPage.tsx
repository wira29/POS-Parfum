import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Breadcrumb } from "@/views/components/Breadcrumb"
import { useApiClient } from "@/core/helpers/ApiClient"
import { Toaster } from "@/core/helpers/BaseAlert"

export default function WarehouseEdit() {
  const navigate = useNavigate()
  const { id } = useParams()
  const apiClient = useApiClient()

  const [warehouseData, setWarehouseData] = useState({
    name: "",
    owner: "",
    phone: "",
    address: "",
    image: null,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWarehouseDetail = async () => {
      try {
        const response = await apiClient.get(`/warehouses/${id}`)
        const warehouse = response.data?.data?.warehouse

        setWarehouseData({
          name: warehouse.name || "",
          owner: warehouse.store?.name || "",
          phone: warehouse.telp || "",
          address: warehouse.address || "",
          image: null,
        })
      } catch (error) {
        console.error("Failed to fetch warehouse detail:", error)
        Toaster("error", "Gagal mengambil data warehouse")
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchWarehouseDetail()
  }, [id])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setWarehouseData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setWarehouseData((prev) => ({
      ...prev,
      image: file,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const form = new FormData()
    form.append("name", warehouseData.name)
    form.append("address", warehouseData.address)
    form.append("telp", warehouseData.phone)
    if (warehouseData.image) {
      form.append("image", warehouseData.image)
    }

    try {
      await apiClient.post(`/warehouses/${id}?_method=PUT`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      Toaster("success", "Warehouse berhasil diperbarui")
      navigate("/warehouses")
    } catch (error) {
      console.error("Error updating warehouse:", error)
      Toaster("error", "Gagal memperbarui warehouse")
    }
  }

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb title="Edit Warehouse" desc="Edit data Warehouse di bawah ini." />

      <div className="bg-white rounded-xl p-6 shadow">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Nama Warehouse<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={warehouseData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Masukkan nama Warehouse"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Penanggung Jawab <span className="text-red-500">*</span>  
                </label>
                <input
                  type="text"
                  name="owner"
                  value={warehouseData.owner}
                  onChange={handleInputChange}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
                  placeholder="Nama pemilik (dari store)"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  No Telp <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="phone"
                  value={warehouseData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="No telepon Warehouse"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Gambar<span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  name="image"
                  onChange={handleFileChange}
                  className="w-full border border-gray-200 rounded-lg bg-[#F5F8FA] text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#E9EFF5] file:text-gray-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Alamat<span className="text-red-500">*</span>
              </label>
              <textarea
                name="address"
                value={warehouseData.address}
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
                className="px-4 py-2 bg-gray-400 text-white rounded-md cursor-pointer"
                onClick={() => navigate("/warehouses")}
              >
                Kembali
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-yellow-500 text-white rounded-md cursor-pointer"
              >
                Simpan
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
