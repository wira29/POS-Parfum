import { Breadcrumb } from "@/views/components/Breadcrumb"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { useApiClient } from "@/core/helpers/ApiClient"
import { Toaster } from "@/core/helpers/BaseAlert"

export default function WarehouseCreate() {
  const navigate = useNavigate()
  const apiClient = useApiClient()

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    telp: "",
    image: null,
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const username = formData.name
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[^a-z0-9]/g, "")
    const email = `${username}@gmail.com`

    const payload = new FormData()
    payload.append("name", formData.name)
    payload.append("address", formData.address)
    payload.append("telp", formData.telp)
    if (formData.image) {
      payload.append("image", formData.image)
    }

    const users = [
      {
        name: username,
        email: email,
        password: "password",
      },
    ]

    users.forEach((user, index) => {
      payload.append(`users[${index}][name]`, user.name)
      payload.append(`users[${index}][email]`, user.email)
      payload.append(`users[${index}][password]`, user.password)
    })

    try {
      await apiClient.post("/warehouses", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      Toaster("success", "Warehouse berhasil dibuat")
      navigate("/warehouses")
    } catch (error) {
      console.error("Error submitting form:", error)
      Toaster("error", "Gagal membuat warehouse")
    }
  }

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb title="Tambah Warehouse" desc="Tambahkan Warehouse baru." />
      <div className="bg-white rounded-xl p-6 shadow">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Nama Warehouse<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Masukkan nama warehouse"
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
                placeholder="No telepon warehouse"
                required
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                required
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
              onClick={() => navigate("/warehouses")}
            >
              Kembali
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Tambah
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
