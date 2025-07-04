import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  LayoutGrid,
  RefreshCw,
  Tag,
  User,
  Users,
  Warehouse,
} from "lucide-react";
import { useApiClient } from "@/core/helpers/ApiClient";
import { Breadcrumb } from "@/views/components/Breadcrumb";
import { TbMoneybag } from "react-icons/tb";
import { ImageHelper } from "@/core/helpers/ImageHelper";

export default function RetailDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const apiClient = useApiClient();

  const [outlet, setOutlet] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    links: [],
  });

  const IMAGE_BASE_URL = "https://core-parfum.mijurnal.com/storage/";

  const fetchDetail = async (page = 1) => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/outlets/${id}?transaction_page=${page}`);
      const data = res.data?.data;

      setOutlet(data.outlet);
      setTransactions(data.transactions.data);
      setPagination({
        current_page: data.transactions.pagination.current_page,
        last_page: data.transactions.pagination.last_page,
        total: data.transactions.pagination.total,
        links: data.transactions.pagination.links || [],
      });
    } catch (error) {
      console.error("Gagal mengambil data outlet", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDetail();
    }
  }, [id]);

  const handlePageChange = (page: number) => {
    fetchDetail(page);
  };

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb title="Detail Retail" desc={`Detail outlet ${outlet?.name || "-"}`} />

      {loading && <p className="text-sm text-gray-500">Memuat data...</p>}

      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <div className="p-6 space-y-2 bg-blue-100 rounded-2xl min-w-70">
          <p className="flex items-center text-blue-600 text-xs gap-2.5">
            <User size={20} />
            Pemilik Retail
          </p>
          <h2 className="text-blue-600">{outlet?.owner || "-"}</h2>
        </div>
        <div className="p-6 space-y-2 bg-purple-100 rounded-2xl min-w-70">
          <p className="flex items-center text-purple-600 text-xs gap-2.5">
            <Users size={20} />
            Jumlah Pegawai
          </p>
          <h2 className="text-purple-600">{outlet?.worker_count ?? 0} Pegawai</h2>
        </div>
        <div className="p-6 space-y-2 bg-orange-100 rounded-2xl min-w-70">
          <p className="flex items-center text-orange-600 text-xs gap-2.5">
            <TbMoneybag size={20} />
            Total Transaksi
          </p>
          <h2 className="text-orange-600">{outlet?.transaction_count ?? 0} Transaksi</h2>
        </div>
        <div className="p-6 space-y-2 bg-green-100 rounded-2xl min-w-70">
          <p className="flex items-center text-green-600 text-xs gap-2.5">
            <LayoutGrid size={20} />
            Status Retail
          </p>
          <h2 className="text-green-600">
            {outlet?.status === "Active" ? "Aktif" : outlet?.status || "-"}
          </h2>
        </div>
      </div>

      <div className="p-6 space-y-4 flex flex-col lg:flex-row gap-6">
        <div className="p-6 space-y-4 shadow-md rounded-2xl bg-white">
          <div className="flex justify-between items-center border-b-2 border-gray-200 pb-4 mb-4">
            <h2 className="text-gray-800 font-semibold text-2xl flex items-center gap-2">
              <Warehouse size={26} className="text-blue-700 p-1 bg-blue-200" />
              Detail Retail
            </h2>
          </div>

          <div className="flex flex-col gap-4 w-80">
            <img
              src={ImageHelper(outlet?.image)}
              alt={outlet?.name}
              className="w-full h-30 rounded-lg object-cover mb-4"
            />
            <div className="flex-1 space-y-1 text-sm text-gray-700">
              <h2 className="font-semibold">Nama Retail</h2>
              <p className="bg-gray-100 border border-gray-300 rounded-xs font-semibold p-2">
                {outlet?.name || "-"}
              </p>
            </div>
            <div className="flex-1 space-y-1 text-sm text-gray-700">
              <h2 className="font-semibold">Pemilik Retail</h2>
              <p className="bg-gray-100 border border-gray-300 rounded-xs font-semibold p-2">
                {outlet?.owner || "-"}
              </p>
            </div>
            <div className="flex-1 space-y-1 text-sm text-gray-700">
              <h2 className="font-semibold">Nomor Retail</h2>
              <div className="flex items-center">
                <p className="bg-blue-100 border-r-0 border border-blue-300 text-blue-700 rounded-xs font-semibold p-2">
                  +62
                </p>
                <p className="bg-gray-100 border-l-0 border border-gray-300 rounded-xs font-semibold p-2 w-full">
                  {outlet?.telp || "-"}
                </p>
              </div>
            </div>
            <div className="flex-1 space-y-1 text-sm text-gray-700">
              <h2 className="font-semibold">Dibuat Tanggal</h2>
              <p className="bg-gray-100 border border-gray-300 rounded-xs font-semibold p-2 flex items-center gap-2">
                <Calendar size={16} />
                {outlet?.created_at
                  ? new Date(outlet.created_at).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })
                  : "-"}
              </p>
            </div>
            <div className="flex-1 space-y-1 text-sm text-gray-700">
              <h2 className="font-semibold">Alamat Retail</h2>
              <p className="bg-gray-100 border border-gray-300 rounded-xs font-semibold p-2 flex items-star gap-2 min-h-20">
                {outlet?.address || "-"}
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/retails")}
            className="mt-8 text-blue-600 border border-blue-600 px-3 py-1.5 rounded-md flex items-center hover:bg-blue-600 hover:text-white cursor-pointer"
          >
            <ArrowLeft className="w-5 mr-2" /> Kembali
          </button>
        </div>

        <div className="bg-white rounded-xl p-6 shadow space-y-6 w-full">
          <div className="flex justify-between items-center border-b-2 border-gray-200 pb-4 mb-4">
            <h2 className="text-gray-800 font-semibold text-2xl flex items-center gap-2">
              <Tag size={26} className="text-blue-700 p-1 bg-blue-200" />
              Daftar Transaksi
            </h2>
            <button
              onClick={() => fetchDetail(pagination.current_page)}
              className="text-sm text-green-600 bg-green-100 border-0 p-2 rounded-xl flex items-center hover:bg-green-200 hover:text-green-700 cursor-pointer"
            >
              <RefreshCw size={32} />
            </button>
          </div>

          <div className="overflow-x-auto mt-6 border border-gray-300 rounded-xl shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-gray-300">
                <tr>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">#</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">Tanggal Request</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">Jumlah Request</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">Total Harga</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="bg-[#FBFBFB]">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-400">
                      Tidak ada transaksi
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => {
                    const totalQty = tx.transaction_details?.reduce(
                      (sum: number, item: any) => sum + item.quantity,
                      0
                    );
                    return (
                      <tr key={tx.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 text-gray-900">{tx.transaction_code}</td>
                        <td className="px-4 py-4 text-gray-700">
                          {new Date(tx.created_at).toLocaleDateString("id-ID")}
                        </td>
                        <td className="px-4 py-4 text-gray-700">{totalQty}</td>
                        <td className="px-4 py-4 text-gray-700">Rp. {tx.total_price}</td>
                        <td className="px-4 py-4">
                          <span
                            className={`px-3 py-1 rounded text-sm font-medium border ${tx.transaction_status === "Success"
                                ? "bg-green-50 text-green-600 border-green-200"
                                : "bg-gray-100 text-gray-500 border-gray-300"
                              }`}
                          >
                            {tx.transaction_status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {pagination.links && pagination.links.length > 0 && (
            <div className="flex justify-end mt-4 space-x-2 flex-wrap">
              {pagination.links.map((link, index) => {
                const label = link.label.replace(/&laquo;|&raquo;/g, "").trim();
                if (label === "...") return null;

                return (
                  <button
                    key={index}
                    onClick={() => {
                      if (link.url) {
                        const url = new URL(link.url);
                        const pageParam = url.searchParams.get("transaction_page");
                        handlePageChange(Number(pageParam));
                      }
                    }}
                    disabled={!link.url}
                    className={`px-3 py-1 text-sm rounded border ${link.active
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-300 hover:bg-gray-100"
                      }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
