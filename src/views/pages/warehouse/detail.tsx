import { Breadcrumb } from "@/views/components/Breadcrumb"
import { ArrowLeft, Info } from "lucide-react"
import { useEffect, useState } from "react"
import { FaLocationPin } from "react-icons/fa6"
import { useNavigate, useParams } from "react-router-dom"
import { FiChevronDown } from "react-icons/fi"
import { useApiClient } from "@/core/helpers/ApiClient"

export default function WarehouseDetail() {
    const { id } = useParams()
    const nav = useNavigate()
    const apiClient = useApiClient()

    const [warehouse, setWarehouse] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchWarehouseDetail = async () => {
            try {
                const response = await apiClient.get(`/warehouses/${id}`)
                setWarehouse(response.data.data)
            } catch (error) {
                console.error("Failed to fetch warehouse detail:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchWarehouseDetail()
    }, [id])

    if (loading) return <div className="p-6">Loading...</div>
    if (!warehouse) return <div className="p-6">Warehouse tidak ditemukan</div>

    const pemilik = warehouse.users?.[0]

    return (
        <div className="p-6 space-y-6">
            <Breadcrumb
                title="Detail Warehouse"
                desc={`Detail warehouse ${warehouse.name}`}
            />

            <div className="p-6 space-y-4 shadow-md rounded-2xl">
                <h2 className="text-gray-800 flex">
                    <span className="font-semibold">Detail Warehouse</span>
                    <Info className="ml-2 bg-gray-50 w-4" />
                </h2>

                <div className="flex gap-4">
                    <div className="w-50 h-40 overflow-hidden rounded-xl bg-gray-100 flex-shrink-0">
                        <img
                            src={"/images/backgrounds/bgm.jpg"}
                            alt={warehouse.name}
                            className="w-200 h-25"
                        />
                    </div>

                    <div className="flex-1 space-y-1 text-sm text-gray-600">
                        <div className="bg-blue-100 w-15 h-7 flex justify-center text-xs px-3 py-1 font-medium text-blue-500 border rounded-md border-blue-500">
                            Aktif
                        </div>
                        <div>
                            <div className="font-bold text-xl text-black">{warehouse.name}</div>
                            <p className="text-gray-500 text-xm font-semibold line-clamp-3 flex gap-5 mt-2">
                                <span>{pemilik?.name || "Tidak ada pemilik"}</span>
                                <span>{warehouse.telp || "-"}</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="">
                    <h2 className="text-gray-800 flex">
                        <span className="font-semibold">Informasi Lain</span>
                        <Info className="ml-2 bg-gray-50 w-4" />
                    </h2>

                    <div className="flex mt-5 w-full justify-between">
                        <div className="flex w-180">
                            <div className="w-150 flex-col">
                                <div>
                                    <h1 className="font-semibold text-xm">Pemilik Warehouse</h1>
                                    <p className="text-xs text-gray-600 mt-1">
                                        {pemilik?.name || "-"}
                                    </p>
                                </div>
                                <div className="mt-5">
                                    <h1 className="font-semibold text-xm">Dibuat Tanggal</h1>
                                    <p className="text-xs text-gray-600 mt-1">
                                        {new Date(warehouse.created_at).toLocaleDateString("id-ID")}
                                    </p>
                                </div>
                            </div>

                            <div className="w-150 flex-col">
                                <div>
                                    <h1 className="font-semibold text-xm">Nomor Telepon</h1>
                                    <p className="text-xs text-gray-600 mt-1">{warehouse.telp}</p>
                                </div>
                                <div className="mt-5">
                                    <h1 className="font-semibold text-xm">Nama Toko</h1>
                                    <p className="text-xs text-gray-600 mt-1">{warehouse.store?.name || "-"}</p>
                                </div>
                            </div>
                        </div>

                        <div className="w-100 pl-6">
                            <h1 className="font-semibold text-xm">Alamat</h1>
                            <p className="text-xs text-gray-600 mt-1 flex">
                                <FaLocationPin className="mr-2 mt-1" />
                                {warehouse.address}
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    className="mt-8 text-blue-600 flex border border-blue-600 p-1.5 rounded-md hover:bg-blue-600 hover:text-white"
                    onClick={() => nav("/warehouses")}
                >
                    <ArrowLeft className="w-5 mr-1" /> Kembali
                </button>
            </div>

            <div className="overflow-x-auto mt-10 shadow-md rounded-xl">
                <table className="w-full">
                    <thead className="bg-[#FBFBFB]">
                        <tr>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Logo</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Alamat</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Dibuat Pada</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Diupdate Pada</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Tax</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-4 px-4 text-gray-900">
                                {warehouse.store.logo ? (
                                    <img
                                        src={warehouse.store.logo}
                                        alt="Store Logo"
                                        className="w-12 h-12 rounded object-cover"
                                    />
                                ) : (
                                    <span className="text-gray-500 text-sm">Tidak ada logo</span>
                                )}
                            </td>
                            <td className="py-4 px-4 text-gray-700">{warehouse.store.address}</td>
                            <td className="py-4 px-4 text-gray-700">
                                {new Date(warehouse.store.created_at).toLocaleDateString("id-ID")}
                            </td>
                            <td className="py-4 px-4 text-gray-700">
                                {new Date(warehouse.store.updated_at).toLocaleDateString("id-ID")}
                            </td>
                            <td className="py-4 px-4 text-gray-700">{warehouse.store.tax}%</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}
