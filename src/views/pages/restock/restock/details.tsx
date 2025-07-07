import { useEffect, useState } from "react";
import { Breadcrumb } from "@/views/components/Breadcrumb";
import { ChevronDown, ChevronUp, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useApiClient } from "@/core/helpers/ApiClient";
import { ImageHelper } from "@/core/helpers/ImageHelper";
import { LoadingCards } from "@/views/components/Loading";

export const RestockDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const apiClient = useApiClient();
  const [openTable, setOpenTable] = useState<string | null>(null);
  const [detail, setDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get(`/stock-request/${id}`);
        if (res.data && res.data.data && res.data.data.length > 0) {
          setDetail(res.data.data[0]);
        }
      } catch (e) {
        setDetail(null);
      }
      setLoading(false);
    };
    fetchDetail();
  }, [id]);

  const groupedProducts = (() => {
    if (!detail?.requested_stock) return [];
    const map = new Map();
    detail.requested_stock.forEach((item: any) => {
      if (!map.has(item.product_name)) {
        map.set(item.product_name, {
          product_name: item.product_name,
          kategori: item.kategori,
          variants: [],
        });
      }
      map.get(item.product_name).variants.push(item);
    });
    return Array.from(map.values());
  })();

  return (
    <div className="p-6 space-y-6 bg-[#F8F9FB] min-h-screen">
      <Breadcrumb
        title="Detail Request Stock"
        desc="Detail informasi request stock yang telah dibuat"
      />
      <div className="bg-white rounded-xl shadow-md p-8 flex-col md:flex-row gap-8">
        <button
          className="flex items-center gap-2 text-blue-600 font-semibold mb-4 cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} /> Kembali
        </button>
        {loading ? (
          <LoadingCards />
        ) : detail ? (
          <div className="flex lg:flex-col gap-4 flex-row mt-5">
            <h1 className="font-semibold text-lg">Detail Restock</h1>
            <h2>
              Tanggal : <span className="text-slate-500">00-00-00</span>
            </h2>
            <h2>
              Product yang di pilih : <span className="text-slate-500">50</span>
            </h2>
          </div>
        ) : (
          <div className="text-center text-gray-400 py-10">
            Data tidak ditemukan
          </div>
        )}
        <div className="font-semibold mb-4 mt-16">Produk Dipilih :</div>
        <hr className="border border-slate-300"/>
        <div className="space-y-6">
          {groupedProducts.map((item: any, idx: number) => (
            <div
              key={item.product_name + idx}
              className="mt-6 border border-gray-300 rounded-md p-5 bg-[#FAFBFC]"
            >
              <div className="flex gap-5">
                <div className="w-40 h-40 flex items-center justify-center border border-gray-300 rounded-md bg-gray-50 text-gray-400 text-2xl font-bold">
                  {item.product_name?.[0] || "P"}
                </div>
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between">
                    <h1 className="font-semibold text-xl">
                      {item.product_name}
                    </h1>
                  </div>
                  <div className="flex justify-between text-sm text-gray-700">
                    <div>
                      <p className="text-xs text-gray-400">Kategori</p>
                      <p className="font-semibold">{item.kategori}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Varian Dipilih</p>
                      <p className="font-semibold">
                        {item.variants.length} Varian
                      </p>
                    </div>
                    <div
                      className="cursor-pointer"
                      onClick={() =>
                        setOpenTable(
                          openTable === item.product_name
                            ? null
                            : item.product_name
                        )
                      }
                    >
                      <p className="text-xs text-gray-400">Detail</p>
                      <p className="font-semibold">
                        {openTable === item.product_name ? (
                          <ChevronUp />
                        ) : (
                          <ChevronDown />
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {openTable === item.product_name && (
                <div className="mt-6 overflow-x-auto">
                  <table className="w-full min-w-[800px] text-sm">
                    <thead className="bg-gray-100 border border-gray-300 text-gray-700">
                      <tr>
                        <th className="p-4 font-medium text-left">No</th>
                        <th className="p-4 font-medium text-left">
                          Nama Varian
                        </th>
                        <th className="p-4 font-medium text-left">
                          Kode Varian
                        </th>
                        <th className="p-4 font-medium text-left">
                          Jumlah Request Stock
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {item.variants.map((variant: any, i: number) => (
                        <tr
                          key={variant.variant_code + i}
                          className="hover:bg-gray-50"
                        >
                          <td className="p-6 align-top">{i + 1}</td>
                          <td className="p-6 align-top">
                            {variant.variant_name}
                          </td>
                          <td className="p-6 align-top">
                            {variant.variant_code}
                          </td>
                          <td className="p-6 align-top">
                            <div className="w-60">
                              <div className="flex items-center">
                                <input
                                  type="number"
                                  className="w-full border border-gray-300 rounded-l-lg px-3 py-2 bg-gray-50"
                                  value={variant.requested_stock}
                                  readOnly
                                />
                                <span className="px-3 py-2 border border-gray-300 border-l-0 rounded-r-lg bg-gray-100 text-sm">
                                  Gram
                                </span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
