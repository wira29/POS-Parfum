import { useWarehouseStore } from "@/core/stores/WarehouseStore"
import { Breadcrumb } from "@/views/components/Breadcrumb"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"

export default function WarehouseCreate() {
    const navigate = useNavigate()

    const { id } = useParams()
    const { getWarehouse, warehouse } = useWarehouseStore()
    const [retailData, setRetailData] = useState({
        name: "",
        owner: "",
        phone: "",
        address: "",
        image: null
    })

    useEffect(() => {
        if (id) {
            getWarehouse(id)
        }
    }, [id])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setRetailData({
            ...retailData,
            [name]: value
        })
    }

    const handleFileChange = (e) => {
        setRetailData({
            ...retailData,
            image: e.target.files[0]
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("Form data:", retailData)
    }

    return (
        <div className="p-6 space-y-6">
            <Breadcrumb 
                title="Tambah Retail" 
                desc="Tambahkan retail baru."
            />
            <div className="bg-white rounded-xl p-6 shadow">
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            <div className="space-y-2">
                                <label htmlFor="name" className="block text-sm font-medium">
                                    Nama Retail<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={retailData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    placeholder="Masukan nama retail"
                                    required
                                />
                            </div>


                            <div className="space-y-2">
                                <label htmlFor="owner" className="block text-sm font-medium">
                                    Pemilik<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="owner"
                                    name="owner"
                                    value={retailData.owner}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    placeholder="pemilik retail"
                                    required
                                />
                            </div>


                            <div className="space-y-2">
                                <label htmlFor="phone" className="block text-sm font-medium">
                                    No Telp<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="phone"
                                    name="phone"
                                    value={retailData.phone}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    placeholder="No telepon retail"
                                    required
                                />
                            </div>


                            <div className="space-y-2">
                                <label htmlFor="image" className="block text-sm font-medium">
                                    Gambar<span className="text-red-500">*</span>
                                </label>
                                <div className="flex">
                                    <input
                                        type="file"
                                        id="image"
                                        name="image"
                                        onChange={handleFileChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                        required
                                    />
                                </div>
                            </div>
                        </div>


                        <div className="space-y-2">
                            <label htmlFor="address" className="block text-sm font-medium">
                                Alamat<span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="address"
                                name="address"
                                value={retailData.address}
                                onChange={handleInputChange}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder="Masukan alamat"
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
                    </div>
                </form>
            </div>
        </div>
    )
}