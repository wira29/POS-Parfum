import { Breadcrumb } from "@/views/components/Breadcrumb"
import { ArrowLeft, Info, InfoIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { FaLocationPin } from "react-icons/fa6"
import { useNavigate, useParams } from "react-router-dom"
import { useApiClient } from "@/core/helpers/ApiClient"

export default function WarehouseDetail() {
    const { id } = useParams()
    const nav = useNavigate()
    const apiClient = useApiClient()

    const [warehouse, setWarehouse] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5

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
    const stocks = warehouse.product_stocks || []

    const totalPages = Math.ceil(stocks.length / itemsPerPage)
    const paginatedStocks = stocks.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1)
    }

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1)
    }

    const handlePageClick = (page: number) => {
        setCurrentPage(page)
    }

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

                <div>
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
                                    <p className="text-xs text-gray-600 mt-1">{warehouse.telp || "-"}</p>
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

            <div className="bg-white rounded-xl p-6 shadow space-y-6">
                <h2 className="text-gray-800 font-semibold mb-4 flex gap-2">Daftar Produk di Warehouse <InfoIcon size={16} className="mt-1" /></h2>
                <div className="overflow-x-auto mt-10 shadow-md border rounded-xl border-gray-300">
                    <table className="w-full">
                        <thead className="bg-gray-300 border-b border-gray-300">
                            <tr>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Product Id</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Stock</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Harga</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Dibuat Pada</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Diupdate Pada</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedStocks.map((item: any) => (
                                <tr
                                    key={item.id}
                                    className="border-b border-gray-100 hover:bg-gray-50"
                                >
                                    <td className="py-4 px-4 text-gray-900">
                                        {item.product_detail?.product_id || "-"}
                                    </td>
                                    <td className="py-4 px-4 text-gray-700">
                                        {item.stock}
                                    </td>
                                    <td className="py-4 px-4 text-gray-700">
                                        Rp {item.product_detail?.price?.toLocaleString("id-ID")}
                                    </td>
                                    <td className="py-4 px-4 text-gray-700">
                                        {new Date(item.created_at).toLocaleDateString("id-ID")}
                                    </td>
                                    <td className="py-4 px-4 text-gray-700">
                                        {new Date(item.updated_at).toLocaleDateString("id-ID")}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {totalPages > 1 && (
                    <div className="flex justify-end mt-6 space-x-2">
                        <button
                            className="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-100"
                            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Prev
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-3 py-1 text-sm rounded border ${currentPage === page
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "border-gray-300 hover:bg-gray-100"
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            className="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-100"
                            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
