import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaLocationPin } from "react-icons/fa6";
import { ArrowLeft, Info, InfoIcon, RefreshCw } from "lucide-react";
import { useApiClient } from "@/core/helpers/ApiClient";
import { Breadcrumb } from "@/views/components/Breadcrumb";

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

  const fetchDetail = async (page = 1) => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/outlets/${id}?transaction_page=${page}`);
      const data = res.data?.data;

      setOutlet(data.outlet);
      setTransactions(data.transactions.data);
      setPagination({
        current_page: data.transactions.current_page,
        last_page: data.transactions.last_page,
        total: data.transactions.total,
        links: data.transactions.links,
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

  const pemilik = outlet?.users?.[0];

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb title="Detail Retail" desc={`Detail outlet ${outlet?.name || "-"}`} />

      <div className="p-6 space-y-4 shadow-md rounded-2xl bg-white">
        <div className="flex justify-between items-center">
          <h2 className="text-gray-800 font-semibold flex items-center">
            Detail Retail <Info className="ml-2 w-4 h-4" />
          </h2>
          <button
            onClick={() => fetchDetail(pagination.current_page)}
            className="text-sm text-blue-600 border border-blue-600 px-3 py-1.5 rounded-md flex items-center hover:bg-blue-600 hover:text-white"
          >
            <RefreshCw size={16} className="mr-2" /> Refresh Data
          </button>
        </div>

        {loading && <p className="text-sm text-gray-500">Memuat data...</p>}

        <div className="flex gap-4">
          <div className="w-50 h-40 overflow-hidden rounded-xl flex-shrink-0">
            <img
              src="/images/backgrounds/bgm.jpg"
              alt={outlet?.name}
              className="w-200 h-25"
            />
          </div>
          <div className="flex-1 space-y-1 text-sm text-gray-600">
            <div className="bg-blue-100 text-blue-500 text-xs font-medium px-3 py-1 border border-blue-500 rounded w-fit">
              Aktif
            </div>
            <div>
              <div className="text-xl font-bold text-black">{outlet?.name}</div>
              <p className="text-gray-500 text-sm mt-2 flex gap-5">
                <span>{pemilik?.name || "Tidak ada pemilik"}</span>
                <span>{outlet?.telp || "-"}</span>
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-gray-800 font-semibold flex items-center">
            Informasi Lain <Info className="ml-2 w-4 h-4" />
          </h2>

          <div className="flex mt-5 justify-between">
            <div className="space-y-4 w-1/2">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold text-sm">Pemilik Retail</h3>
                  <p className="text-xs text-gray-600 mt-1">{pemilik?.name || "-"}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Dibuat Tanggal</h3>
                  <p className="text-xs text-gray-600 mt-1">
                    {outlet?.created_at
                      ? new Date(outlet.created_at).toLocaleDateString("id-ID")
                      : "-"}
                  </p>
                </div>
              </div>

              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold text-sm">Nomor Telepon</h3>
                  <p className="text-xs text-gray-600 mt-1">{outlet?.telp || "-"}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Total Transaksi</h3>
                  <p className="text-xs text-gray-600 mt-1">
                    {outlet?.transaction_count || 0} transaksi
                  </p>
                </div>
              </div>
            </div>

            <div className="pl-6 w-1/2">
              <h3 className="font-semibold text-sm">Alamat</h3>
              <p className="text-xs text-gray-600 mt-1 flex">
                <FaLocationPin className="mr-2 mt-1" />
                {outlet?.address || "-"}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate("/retails")}
          className="mt-8 text-blue-600 border border-blue-600 px-3 py-1.5 rounded-md flex items-center hover:bg-blue-600 hover:text-white"
        >
          <ArrowLeft className="w-5 mr-2" /> Kembali
        </button>
      </div>

      <div className="bg-white rounded-xl p-6 shadow space-y-6">
        <h2 className="text-gray-800 font-semibold flex items-center gap-2">
          Daftar Transaksi <InfoIcon size={16} />
        </h2>

        <div className="overflow-x-auto mt-6 border border-gray-300 rounded-xl shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-300">
              <tr>
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">ID ORDER</th>
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Estimasi Tanggal</th>
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Quantity</th>
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Total Harga</th>
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="bg-[#FBFBFB]">
              {transactions.map((tx) => {
                const totalQty = tx.transaction_details.reduce(
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
                        className={`px-3 py-1 rounded text-sm font-medium border ${
                          tx.transaction_status === "Success"
                            ? "bg-green-50 text-green-600 border-green-200"
                            : "bg-gray-100 text-gray-500 border-gray-300"
                        }`}
                      >
                        {tx.transaction_status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {pagination.links.length > 0 && (
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
                  className={`px-3 py-1 text-sm rounded border ${
                    link.active
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
  );
}
