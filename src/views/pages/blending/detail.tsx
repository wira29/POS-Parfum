import { useState, useEffect } from "react";
import { ArrowLeft, Calendar } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useApiClient } from "@/core/helpers/ApiClient";

interface BlendDetail {
  variant_name: string;
  quantity: number;
  product_name: string;
}

interface BlendData {
  id: string;
  product_detail_id: string;
  Quantity: number;
  description: string;
  tanggal_pembuatan: string;
  jumlah_bhn_baku: number;
  details: {
    data: BlendDetail[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export const BlendingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const API = useApiClient();
  const [blendData, setBlendData] = useState<BlendData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlendData = async () => {
      try {
        const response = await API.get(`/product-blend/${id}`);
        const result = response.data.data;
        setBlendData(result);
      } catch (err) {
        console.error("API Error:", err);
        setError("Gagal mengambil data");
      } finally {
        setLoading(false);
      }
    };

    fetchBlendData();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!blendData) return <div>Tidak ada data ditemukan.</div>;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 space-y-4">
          <h2 className="font-semibold text-lg text-gray-800 border-b border-gray-300 pb-2">
            Detail Blending
          </h2>

          <div>
            <p className="text-sm text-gray-500 mb-1">Quantity</p>
            <div className="flex">
              <div className="flex-1 bg-gray-50 border border-gray-300 border-r-0 rounded-l px-3 py-2 text-sm text-gray-800">
                {blendData.Quantity}
              </div>
              <div className="bg-gray-100 border border-gray-300 border-l-0 rounded-r px-3 py-2 text-sm text-gray-800">
                G
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Tanggal Pembuatan</p>
            <div className="flex items-center bg-gray-50 border border-gray-300 rounded px-3 py-2 text-sm text-gray-800 space-x-2">
              <Calendar className="text-gray-600 w-4 h-4" />
              <span>{formatDate(blendData.tanggal_pembuatan)}</span>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Total Bahan Baku</p>
            <div className="bg-gray-50 border border-gray-300 rounded px-3 py-2 text-sm text-gray-800">
              {blendData.jumlah_bhn_baku} Macam
            </div>
          </div>

            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-sm rounded-lg p-3 w-full justify-center bg-blue-700 text-white font-medium hover:bg-blue-500 cursor-pointer"
            >
            <ArrowLeft/>
              Kembali ke tabel
            </button>
        </div>

        <div className="lg:col-span-2 bg-white rounded-lg p-4 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 p-2 border-b border-gray-300">
              Cara Blending
            </h2>
            <h3 className="font-medium text-gray-700 mb-1">
              Deskripsi Blending Produk
            </h3>
            <div className="text-sm text-gray-600 leading-relaxed">
              <span className="font-semibold">Langkah-Langkah Blending:</span>
              <p className="mt-1">{blendData.description}</p>
            </div>
          </div>
          <div>
            <h3 className="font-medium text-gray-700 mb-1">
              Komposisi Blending Produk
            </h3>
            <p className="text-sm text-gray-600 mb-2">Bahan Baku:</p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-[#f1f3ff] text-gray-700">
                  <tr>
                    <th className="px-4 py-2">Produk</th>
                    <th className="px-4 py-2">Varian Produk</th>
                    <th className="px-4 py-2">Qty Digunakan</th>
                  </tr>
                </thead>
                <tbody>
                  {blendData.details.data.length > 0 ? (
                    blendData.details.data.map((detail, index) => (
                      <tr key={index} className="bg-white border-b">
                        <td className="px-4 py-2">
                          <div className="font-medium">
                            {detail.product_name}
                          </div>
                        </td>
                        <td className="px-4 py-2">{detail.variant_name}</td>
                        <td className="px-4 py-2">{detail.quantity}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-4 py-2 text-center text-gray-500"
                      >
                        Tidak ada detail blending tersedia.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {blendData.details.total > blendData.details.per_page && (
              <div className="mt-2 text-xs text-gray-500">
                Menampilkan {blendData.details.data.length} dari{" "}
                {blendData.details.total} item
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
