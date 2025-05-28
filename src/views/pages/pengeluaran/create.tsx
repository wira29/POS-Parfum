import { useState } from "react"
import { Breadcrumb } from "@/views/components/Breadcrumb"
import InputNumber from "@/views/components/Input-v2/InputNumber";

export default function CreateExpense() {
  const [formData, setFormData] = useState({
    pengeluaran: "",
    jumlah: "",
    tanggal: "",
    status: "Disetujui",
    deskripsi: ""
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
  }

  const handleCancel = () => {
    console.log("Form cancelled")
  }

  const [minPurchase, setMinPurchase] = useState(0);

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb 
        title="Tambah Pengeluaran" 
        desc="Tambah pengeluaran pada retail Anda."
      />
      
      <div className="bg-white rounded-lg shadow-sm">
        <form onSubmit={handleSubmit} className="p-6">
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">


    <div className="space-y-6">
      <div>
        <label htmlFor="pengeluaran" className="block text-sm font-medium text-gray-700 mb-2">
          Pengeluaran
        </label>
        <input
          type="text"
          id="pengeluaran"
          name="pengeluaran"
          value={formData.pengeluaran}
          onChange={handleInputChange}
          placeholder="Gaji Karyawan"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label className="block mb-1 text-sm text-gray-700">Minimum pembelian</label>
        <InputNumber
          placeholder="500.000"
          prefix="Rp"
          value={minPurchase}
          onChange={e => setMinPurchase(Number(e.target.value))}
        />
      </div>
    </div>



    <div className="space-y-6">
      <div>
        <label htmlFor="tanggal" className="block text-sm font-medium text-gray-700 mb-2">
          Tanggal
        </label>
        <div className="relative">
          <input
            type="text"
            id="tanggal"
            name="tanggal"
            value={formData.tanggal}
            onChange={handleInputChange}
            placeholder="DD-MM-YYYY"
            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>
      

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
          Status
        </label>
        <div className="relative">
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
          >
            <option value="Disetujui">Disetujui</option>
            <option value="Menunggu">Menunggu</option>
            <option value="Ditolak">Ditolak</option>
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>


    <div className="lg:col-span-2">
      <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700 mb-2">
        Deskripsi
      </label>
      <textarea
        id="deskripsi"
        name="deskripsi"
        value={formData.deskripsi}
        onChange={handleInputChange}
        rows={4}
        placeholder="lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  </div>
  <div className="flex justify-end gap-3 mt-8 pt-6">
    <button
      type="button"
      onClick={handleCancel}
      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
    >
      Batalkan
    </button>
    <button
      type="submit"
      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
    >
      Buat
    </button>
  </div>
</form>
      </div>
    </div>
  )
}