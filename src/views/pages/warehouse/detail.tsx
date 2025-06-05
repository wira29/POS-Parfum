import { useWarehouseStore } from "@/core/stores/WarehouseStore"
import { Breadcrumb } from "@/views/components/Breadcrumb"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { FiInfo, FiMapPin, FiChevronLeft, FiEdit3, FiTrash2, FiChevronDown } from "react-icons/fi"

interface TransactionData {
  id: string;
  estimatedDate: string;
  quantity: number;
  totalPrice: string;
  status: 'Berhasil' | 'Gagal';
}

export default function WarehouseDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { getWarehouse, warehouse } = useWarehouseStore()
    const [dropdownOpen, setDropdownOpen] = useState<string | null>(null)

    
    const transactionData: TransactionData[] = [
        {
            id: "#12345",
            estimatedDate: "13-Mei-2025",
            quantity: 5.000,
            totalPrice: "Rp 5.000.000",
            status: "Berhasil"
        },
        {
            id: "#12345",
            estimatedDate: "13-Mei-2025", 
            quantity: 5.000,
            totalPrice: "Rp 5.000.000",
            status: "Gagal"
        },
        {
            id: "#12345",
            estimatedDate: "13-Mei-2025",
            quantity: 5.000,
            totalPrice: "Rp 5.000.000", 
            status: "Gagal"
        }
    ]

    useEffect(() => {
        getWarehouse(id as string)
    }, [id])

    const handleBack = () => {
        navigate(-1)
    }

    const handleEdit = () => {
        navigate(`/warehouses/${id}/edit`)
    }

    const handleDelete = () => {
        console.log("Delete warehouse")
    }

    const toggleDropdown = (transactionId: string) => {
        setDropdownOpen(dropdownOpen === transactionId ? null : transactionId)
    }

    return (
        <div className="p-6 space-y-6">
            <Breadcrumb 
                title="Detail Retail" 
                desc="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
            />

            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <h2 className="text-lg font-bold text-gray-900">Detail Profile</h2>
                        <FiInfo className="w-4 h-4 text-gray-400" />
                    </div>

                    <div className="flex gap-6">
                        
                        <div className="flex-shrink-0">
                            <div className="relative">
                                <img 
                                    src="/images/backgrounds/bgm.jpg"
                                    alt="Retail Mandalika"
                                    className="w-48 h-32 object-cover rounded-lg"
                                />
                            </div>
                            
                        </div>



                        <div className="flex-1">
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
                                        Aktif
                                    </span>
                                    <h3 className="text-lg font-semibold text-gray-900 mt-3">
                                Retail Mandalika
                            </h3>
                            <p className="text-sm text-gray-500">
                                Fulan • (+62) 811-0220-0010
                            </p>
                                </div>
                               
                            </div>
                        </div>
                    </div>



                    <div className="border-b border-gray-200 my-6"></div>

                    
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <h3 className="text-base font-bold text-gray-900">Personal Informasi</h3>
                            <FiInfo className="w-4 h-4 text-gray-400" />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-1">Pemilik Retail</h4>
                                <p className="text-sm text-gray-600">Fulan</p>
                                <h4 className="text-sm font-medium text-gray-900 mb-1 mt-4">Nomor Telephone</h4>
                                <p className="text-sm text-gray-600">+62 811-0220-0010</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-1">Dibuat Tanggal</h4>
                                <p className="text-sm text-gray-600">23 Juni 2024</p>
                                <h4 className="text-sm font-medium text-gray-900 mb-1 mt-4">Total Transaksi</h4>
                                <p className="text-sm text-gray-600">300 Transaksi</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-1">Alamat</h4>
                                <div className="flex items-start gap-2">
                                    <FiMapPin className="mt-1 w-4 h-4 text-blue-500 flex-shrink-0" />
                                    <span className="text-sm text-gray-600 break-words whitespace-pre-line block">
                                        Jl Ahmad Yani No 23 RT 4 Rw 5
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="flex gap-3 mt-6">
                        <button 
                            onClick={handleBack}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                            <FiChevronLeft className="w-4 h-4" />
                            Kembali
                        </button>
                        <button 
                            onClick={handleEdit}
                            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                        >
                            <FiEdit3 className="w-4 h-4" />
                            Edit
                        </button>
                        <button 
                            onClick={handleDelete}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                            <FiTrash2 className="w-4 h-4" />
                            Hapus
                        </button>
                    </div>
                </div>
            </div>


            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <h2 className="text-lg font-bold text-gray-900">Riwayat Transaksi</h2>
                        <FiInfo className="w-4 h-4 text-gray-400" />
                    </div>


                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4">
                                        <input type="checkbox" className="rounded" />
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">ID ORDER</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Estimasi Tanggal</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Quantity</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Total Harga</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Status</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-900"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactionData.map((transaction, index) => (
                                    <tr key={`${transaction.id}-${index}`} className="border-b border-gray-100">
                                        <td className="py-4 px-4">
                                            <input 
                                                type="checkbox" 
                                                className="rounded"
                                                defaultChecked={index === 1}
                                            />
                                        </td>
                                        <td className="py-4 px-4 text-sm text-gray-900">{transaction.id}</td>
                                        <td className="py-4 px-4 text-sm text-gray-600">{transaction.estimatedDate}</td>
                                        <td className="py-4 px-4 text-sm text-gray-600">{transaction.quantity.toLocaleString()}</td>
                                        <td className="py-4 px-4 text-sm text-gray-600">{transaction.totalPrice}</td>
                                        <td className="py-4 px-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                transaction.status === 'Berhasil' 
                                                    ? 'bg-green-100 text-green-600' 
                                                    : 'bg-red-100 text-red-600'
                                            }`}>
                                                {transaction.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="relative">
                                                <button
                                                    onClick={() => toggleDropdown(`${transaction.id}-${index}`)}
                                                    className="flex items-center gap-1 px-3 py-1 text-blue-600 border border-blue-600 rounded text-sm hover:bg-blue-50"
                                                >
                                                    Detail
                                                    <FiChevronDown className="w-3 h-3" />
                                                </button>
                                                {dropdownOpen === `${transaction.id}-${index}` && (
                                                    <div className="absolute right-0 top-8 w-32 bg-white border rounded-lg shadow-lg z-10">
                                                        <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">
                                                            View Detail
                                                        </button>
                                                        <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">
                                                            Download
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>


                    <div className="flex justify-between items-center mt-6">
                        <div className="text-sm text-gray-500">
                            Menampilkan 10 dari 67 produk
                        </div>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-50 text-sm">
                                Previous
                            </button>
                            <button className="px-3 py-1 border rounded bg-blue-600 text-white text-sm">
                                1
                            </button>
                            <button className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-50 text-sm">
                                2
                            </button>
                            <button className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-50 text-sm">
                                3
                            </button>
                            <button className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-50 text-sm">
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}