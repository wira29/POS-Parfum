import { Breadcrumb } from "@/views/components/Breadcrumb"
import { ArrowLeft, Info, InfoIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { FaLocationPin } from "react-icons/fa6"
import { useNavigate, useParams } from "react-router-dom"
import { useApiClient } from "@/core/helpers/ApiClient"

export default function RetailDetail() {
  const { id } = useParams()
  const nav = useNavigate()
  const apiClient = useApiClient()

  const [outlet, setOutlet] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const transactions = outlet?.store?.transactions || []
  const totalPages = Math.ceil(transactions.length / itemsPerPage)
  const paginatedTransactions = transactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  useEffect(() => {
    const fetchOutletDetail = async () => {
      try {
        const response = await apiClient.get(`/outlets/${id}`)
        setOutlet(response.data.data)
      } catch (error) {
        console.error("Failed to fetch outlet detail:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOutletDetail()
  }, [id])

  if (loading) return <div className="p-6">Loading...</div>
  if (!outlet) return <div className="p-6">Outlet tidak ditemukan</div>

  const pemilik = outlet.users?.[0]

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb title="Detail Retail" desc={`Detail outlet ${outlet.name}`} />

      <div className="p-6 space-y-4 shadow-md rounded-2xl">
        <h2 className="text-gray-800 flex">
          <span className="font-semibold">Detail Retail</span>
          <Info className="ml-2 bg-gray-50 w-4" />
        </h2>

        <div className="flex gap-4">
          <div className="w-50 h-40 overflow-hidden rounded-xl bg-gray-100 flex-shrink-0">
            <img
              src={"/images/backgrounds/bgm.jpg"}
              alt={outlet.name}
              className="w-200 h-25"
            />
          </div>

          <div className="flex-1 space-y-1 text-sm text-gray-600">
            <div className="bg-blue-100 w-15 h-7 flex justify-center text-xs px-3 py-1 font-medium text-blue-500 border rounded-md border-blue-500">
              Aktif
            </div>
            <div>
              <div className="font-bold text-xl text-black">{outlet.name}</div>
              <p className="text-gray-500 text-xm font-semibold line-clamp-3 flex gap-5 mt-2">
                <span>{pemilik?.name || "Tidak ada pemilik"}</span>
                <span>{outlet.telp || "-"}</span>
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
            <div className="flex-col space-y-4 w-1/2">
              <div className="flex justify-between">
                <div>
                  <h1 className="font-semibold text-xm">Pemilik Retail</h1>
                  <p className="text-xs text-gray-600 mt-1">
                    {pemilik?.name || "-"}
                  </p>
                </div>
                <div>
                  <h1 className="font-semibold text-xm">Dibuat Tanggal</h1>
                  <p className="text-xs text-gray-600 mt-1">
                    {new Date(outlet.created_at).toLocaleDateString("id-ID")}
                  </p>
                </div>
              </div>

              <div className="flex justify-between">
                <div>
                  <h1 className="font-semibold text-xm">Nomor Telepon</h1>
                  <p className="text-xs text-gray-600 mt-1">{outlet.telp}</p>
                </div>
                <div>
                  <h1 className="font-semibold text-xm">Total Transaksi</h1>
                  <p className="text-xs text-gray-600 mt-1">{transactions.length} transaksi</p>
                </div>
              </div>
            </div>

            <div className="w-100 pl-6">
              <h1 className="font-semibold text-xm">Alamat</h1>
              <p className="text-xs text-gray-600 mt-1 flex">
                <FaLocationPin className="mr-2 mt-1" />
                {outlet.address}
              </p>
            </div>
          </div>
        </div>

        <button
          className="mt-8 text-blue-600 flex border border-blue-600 p-1.5 rounded-md hover:bg-blue-600 hover:text-white"
          onClick={() => nav("/retails")}
        >
          <ArrowLeft className="w-5 mr-1" /> Kembali
        </button>
      </div>

      <div className="bg-white rounded-xl p-6 shadow space-y-6">
        <h2 className="text-gray-800 font-semibold mb-4 flex gap-2">
          Daftar Transaksi <InfoIcon size={16} className="mt-1" />
        </h2>
        <div className="overflow-x-auto mt-10 shadow-md border rounded-xl border-gray-300">
          <table className="w-full">
            <thead className="bg-gray-300 border-b border-gray-300">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">ID ORDER</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Estimasi Tanggal</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Quantity</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Total Harga</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody className="bg-[#FBFBFB]">
              {paginatedTransactions.map((tx: any) => {
                const totalQty = tx.transaction_details.reduce(
                  (sum: number, detail: any) => sum + detail.quantity,
                  0
                )
                return (
                  <tr
                    key={tx.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4 text-gray-900">{tx.transaction_code}</td>
                    <td className="py-4 px-4 text-gray-700">
                      {new Date(tx.created_at).toLocaleDateString("id-ID")}
                    </td>
                    <td className="py-4 px-4 text-gray-700">{totalQty}</td>
                    <td className="py-4 px-4 text-gray-700">Rp.{tx.total_price}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded text-sm font-medium border ${tx.transaction_status === "Success"
                        ? "bg-green-50 text-green-500 border-green-200"
                        : "bg-gray-100 text-gray-500 border-gray-200"
                        }`}>
                        {tx.transaction_status}
                      </span>
                    </td>
                  </tr>
                )
              })}
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
