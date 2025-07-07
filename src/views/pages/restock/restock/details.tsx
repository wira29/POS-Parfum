import { useEffect, useState } from "react";
import { Breadcrumb } from "@/views/components/Breadcrumb";
import {
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  ContainerIcon,
  Calendar,
  BoxIcon,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useApiClient } from "@/core/helpers/ApiClient";
import { SVGBlock, SVGBlock2 } from "@/views/components/svg/Svg";
import { LoadingCards } from "@/views/components/Loading";
import { ImageHelper } from "@/core/helpers/ImageHelper";

interface Variant {
  variant_id: string;
  variant_name: string;
  requested_stock: number;
  unit_id: string | null;
  unit_name: string | null;
  unit_code: string | null;
}

interface Product {
  product_name: string;
  variant_count: number;
  image: string;
  variants: Variant[];
}

interface RestockData {
  created_at: string;
  products: Product[];
}

interface ApiResponse {
  success: boolean;
  message: string;
  code: number;
  data: RestockData[];
}

export const RestockDetail = () => {
  const { date } = useParams();
  const apiClient = useApiClient();
  const [openTable, setOpenTable] = useState<string | null>(null);
  const [restockData, setRestockData] = useState<RestockData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestockData = async () => {
      setLoading(true);
      setError(null);

      try {
        const requestDate = date;
        const res = await apiClient.get<ApiResponse>(
          `/restock/by-period?date=${requestDate}`
        );

        if (res.data && res.data.success && res.data.data.length > 0) {
          setRestockData(res.data.data[0]);
        } else {
          setRestockData(null);
        }
      } catch (e) {
        console.error("Error fetching restock data:", e);
        setError("Gagal memuat data restock");
        setRestockData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRestockData();
  }, [date]);

  // const formatDate = (dateString: string): string => {
  //   try {
  //     const date = new Date(dateString);
  //     return date.toLocaleDateString("id-ID", {
  //       day: "2-digit",
  //       month: "long",
  //       year: "numeric",
  //     });
  //   } catch {
  //     return dateString;
  //   }
  // };

  // const getTotalProducts = (): number => {
  //   return restockData?.products?.length || 0;
  // };

  // const getTotalVariants = (): number => {
  //   return (
  //     restockData?.products?.reduce(
  //       (total, product) => total + product.variant_count,
  //       0
  //     ) || 0
  //   );
  // };

  const toggleTable = (productName: string): void => {
    setOpenTable(openTable === productName ? null : productName);
  };

  const renderProductCard = (product: Product, index: number) => (
    <div
      key={`${product.product_name}-${index}`}
      className="mt-6 border border-gray-300 rounded-md p-5 bg-[#FAFBFC]"
    >
      <div className="flex gap-5">
        <div className="w-40 h-40 flex items-center justify-center border border-gray-300 rounded-md bg-gray-50 text-gray-400 text-2xl font-bold">
          <img src={ImageHelper(product.image)} className="w-full h-full object-cover" alt={product.product_name} />
        </div>
        <div className="flex-1 space-y-4">
          <div className="flex justify-between">
            <h1 className="font-semibold text-xl">{product.product_name}</h1>
          </div>
          <div className="flex justify-between text-sm text-gray-700">
            <div>
              <p className="text-xs text-gray-400">Total Varian</p>
              <p className="font-semibold">{product.variant_count} Varian</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Jumlah Request</p>
              <p className="font-semibold">
                {product.variants.reduce(
                  (sum, variant) => sum + variant.requested_stock,
                  0
                )}{" "}
                Total
              </p>
            </div>
            <div
              className="cursor-pointer"
              onClick={() => toggleTable(product.product_name)}
            >
              <p className="text-xs text-gray-400">Detail</p>
              <p className="font-semibold">
                {openTable === product.product_name ? (
                  <ChevronUp />
                ) : (
                  <ChevronDown />
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {openTable === product.product_name && (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm">
            <thead className="bg-gray-100 border border-gray-300 text-gray-700">
              <tr>
                <th className="p-4 font-medium text-left">No</th>
                <th className="p-4 font-medium text-left">Nama Varian</th>
                <th className="p-4 font-medium text-left">
                  Jumlah Request Stock
                </th>
                <th className="p-4 font-medium text-left">Unit</th>
              </tr>
            </thead>
            <tbody>
              {product.variants.map((variant, i) => (
                <tr
                  key={`${variant.variant_id}-${i}`}
                  className="hover:bg-gray-50"
                >
                  <td className="p-6 align-top">{i + 1}</td>
                  <td className="p-6 align-top">{variant.variant_name}</td>
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
                          {variant.unit_name || "Unit"}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-6 align-top">{variant.unit_code || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6 space-y-6 min-h-screen">
      <Breadcrumb
        title="Detail Restock Produk"
        desc="Detail informasi restock produk berdasarkan periode"
      />

      {restockData && (
        <div className="bg-white rounded-xl shadow p-8">
          <div className="mb-5">
            {loading ? (
              <LoadingCards />
            ) : error ? (
              <div className="text-center text-red-400 py-10">
                <p>{error}</p>
              </div>
            ) : restockData ? (
              <div className="flex flex-col gap-5">
                <div className="flex gap-2 items-center">
                  <div className="bg-indigo-100 rounded-lg w-8 h-8 flex justify-center items-center">
                    <ContainerIcon className="text-lg text-blue-500" />
                  </div>
                  <h1 className="text-xl text-slate-800 font-semibold">
                    Restock Detail
                  </h1>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="w-full bg-[#EEF2FF] rounded px-4 pt-5 flex justify-between items-start relative">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-[#4F46E5] font-medium">
                        <Calendar className="w-5 h-5" />
                        <span className="text-sm text-slate-600">Tanggal</span>
                      </div>
                      <span className="text-[18px] font-medium text-[#2563EB] mt-1">
                        25 Mei 2025
                      </span>
                    </div>
                    <SVGBlock />
                  </div>
                  <div className="w-full bg-[#EEF2FF] rounded px-4 pt-5 flex justify-between items-start relative">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-[#4F46E5] font-medium">
                        <BoxIcon className="w-5 h-5" />
                        <span className="text-sm text-slate-600">
                          Produk Direstock
                        </span>
                      </div>
                      <span className="text-[18px] font-medium text-[#2563EB] mt-1">
                        5 Produk
                      </span>
                    </div>
                    <SVGBlock2 />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 py-10">
                <p>Data restock tidak ditemukan</p>
              </div>
            )}
          </div>
          <div className="font-semibold mb-4 text-lg">Produk Restock:</div>
          <div className="space-y-6">
            {restockData.products.map((product, index) =>
              renderProductCard(product, index)
            )}
          </div>
          <div className="flex justify-end mt-5">
            <Link
              to={`/restock`}
              className="bg-gray-500 text-center text-white hover:bg-gray-700 cursor-pointer px-4 py-1.5 rounded"
            >
              Kembali
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
