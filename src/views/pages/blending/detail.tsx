import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useApiClient } from "@/core/helpers/ApiClient";

interface ProductDetail {
  id: string;
  product_id: string;
  variant_name: string | null;
  product?: {
    id: string;
    name: string;
    blend_name:string;
  };
}

interface BlendDetail {
  id: string;
  product_blend_id: string;
  product_detail_id: string;
  used_stock: number;
  unit_id: string;
  created_at: string;
  updated_at: string;
  product_detail: ProductDetail;
}

interface BlendData {
  id: string;
  description: string;
  result_stock: number;
  date: string;
  unit_id: string;
  product_detail:[];
  product_blend_details: {
    data: BlendDetail[];
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
        const result = response.data;
        setBlendData(result.data)
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

  const {
    description,
    result_stock,
    product_detail,
    date,
    product_blend_details
  } = blendData;

  const blendDetails = product_blend_details?.data || [];

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between bg-white px-4 py-3 rounded-md mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-sm text-black font-medium hover:underline cursor-pointer"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Kembali ke tabel
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 space-y-4">
          <h2 className="font-semibold text-lg text-gray-800 border-b border-gray-300 pb-2">
            Detail Blending
          </h2>

          <div>
            <p className="text-sm text-gray-500 mb-1">Nama Blending</p>
            <div className="bg-gray-50 border border-gray-300 rounded px-3 py-2 text-sm text-gray-800">
              {product_detail.product.blend_name || "N/A"}
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Quantity</p>
            <div className="flex">
              <div className="flex-1 bg-gray-50 border border-gray-300 border-r-0 rounded-l px-3 py-2 text-sm text-gray-800">
                {result_stock ?? "N/A"}
              </div>
              <div className="bg-gray-100 border border-gray-300 border-l-0 rounded-r px-3 py-2 text-sm text-gray-800">
                {blendDetails[0]?.unit_id ? "Unit" : "N/A"}
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Tanggal Pembuatan</p>
            <div className="flex items-center bg-gray-50 border border-gray-300 rounded px-3 py-2 text-sm text-gray-800 space-x-2">
              <Calendar className="text-gray-600" />
              <span>
                {date
                  ? new Date(date).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric"
                    })
                  : "N/A"}
              </span>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Total Bahan Baku</p>
            <div className="bg-gray-50 border border-gray-300 rounded px-3 py-2 text-sm text-gray-800">
              {blendDetails.length} Macam
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-lg p-4 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 p-2 border-b border-gray-300">
              Cara Blending
            </h2>
            <h3 className="font-medium text-gray-700 mb-1">Deskripsi Blending Produk</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              <span className="font-semibold">Langkah-Langkah Blending:</span>{" "}
              <p>
                {description || "Deskripsi belum tersedia."}
              </p>
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-700 mb-1">Komposisi Blending Produk</h3>
            <p className="text-sm text-gray-600 mb-2">Bahan Baku:</p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-[#f1f3ff] text-gray-700">
                  <tr>
                    <th className="px-4 py-2">Produk</th>
                    <th className="px-4 py-2">Varian Produk</th>
                    <th className="px-4 py-2">Qty Digunakan</th>
                    {/* <th className="px-4 py-2">Stok</th> */}
                  </tr>
                </thead>
                <tbody>
                  {blendDetails.length > 0 ? (
                    blendDetails.map((detail) => (
                      <tr key={detail.id} className="bg-white border-b">
                        <td className="px-4 py-2">
                          <div>
                            <div className="font-medium">
                              {detail.product_detail?.product?.name ?? "N/A"}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-2">
                          {detail.product_detail?.variant_name || "N/A"}
                        </td>
                        <td className="px-4 py-2">
                          {detail.used_stock ?? "N/A"}
                        </td>
                        {/* <td className="px-4 py-2">N/A</td> */}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-2 text-center text-gray-500">
                        Tidak ada detail blending tersedia.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
