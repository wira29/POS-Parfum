import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Breadcrumb } from "@/views/components/Breadcrumb";
import { useApiClient } from "@/core/helpers/ApiClient";
import { ImageHelper } from "@/core/helpers/ImageHelper";
import { ArrowLeft, ShoppingCart } from "lucide-react";

type BundlingMaterial = {
  product_name: string;
  product_detail_id: string;
  variant_name: string;
  quantity: number;
  unit_code: string;
  sum_stock: number;
};

type BundlingPackage = {
  id: string;
  name: string;
  kode_Bundling: string;
  harga: number;
  stock: number;
  status: string;
  category: string;
  description?: string;
  bundling_material_count: number;
  bundling_material: BundlingMaterial[];
};

export default function BundlingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const apiClient = useApiClient();
  const [packageData, setPackageData] = useState<BundlingPackage | null>(null);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await apiClient.get(`/product-bundling/${id}`);
        setPackageData(res.data.data);
      } catch {
        setPackageData(null);
      }
    };
    if (id) fetchDetail();
  }, [id]);

  const formatPrice = (price: number) => {
    return price.toLocaleString("id-ID");
  };

  if (!packageData) {
    return (
      <div className="p-6 space-y-6">
        <Breadcrumb title="Detail Bundling Produk" desc="Data Bundling Produk" />
        <div className="bg-white rounded-lg p-8 text-center text-gray-500 py-12">
          Loading...
        </div>
      </div>
    );
  }

  const allVariants = packageData.bundling_material || [];
  const selectedVariant = allVariants[selectedOptionIndex] || null;
  const mainImage = "/images/placeholder.jpg"; // fallback image

  return (
    <div className="p-6">
      <Breadcrumb title="Detail Bundling Produk" desc="Data Bundling Produk" />

      <div className="bg-white p-6 rounded-xl shadow-md mt-4">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="w-full md:w-[420px]">
            <img
              src={ImageHelper(mainImage)}
              alt={packageData.name}
              className="w-full h-[480px] object-cover rounded-xl shadow"
              onError={(e) => {
                e.currentTarget.src = "/images/placeholder.jpg";
              }}
            />
          </div>

          <div className="flex-1 flex flex-col gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-800 uppercase">
                {packageData.name}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Terdiri dari {allVariants.length} item produk berikut ini
              </p>
            </div>

            <div className="flex flex-col gap-2">
              {allVariants.map((variant, idx) => (
                <button
                  key={variant.product_detail_id}
                  onClick={() => setSelectedOptionIndex(idx)}
                  className="w-full flex items-start gap-3 border border-gray-200 bg-gray-50 p-3 rounded-2xl shadow-sm hover:bg-gray-100 transition"
                >
                  <img
                    src={"/images/placeholder.jpg"}
                    className="w-10 h-10 rounded-full object-cover"
                    alt="variant"
                    onError={(e) => {
                      e.currentTarget.src = "/images/placeholder.jpg";
                    }}
                  />
                  <div className="flex flex-col items-start">
                    <span className="text-sm text-gray-800 font-semibold">
                      {variant.product_name} <span className="text-gray-400">Varian</span> {variant.variant_name}
                    </span>
                    <span className="flex items-center text-gray-500 text-sm gap-2 mt-1">
                      <ShoppingCart size={16} /> Quantity {variant.quantity} {variant.unit_code}
                    </span>
                  </div>
                </button>
              ))}

              <button className="bg-blue-500 text-white text-sm px-4 py-2 rounded-md w-fit mt-2 hover:bg-blue-600">
                Item Lainnya ▼
              </button>
            </div>

            <div className="pt-4 border-t border-gray-300">
              <p className="text-gray-500 text-sm mb-1">{packageData.kode_Bundling}</p>
              <p className="text-2xl font-bold text-gray-800">
                Rp {formatPrice(packageData.harga)}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t pt-6">
          <h2 className="font-bold text-xl text-gray-800 mb-4">Deskripsi Produk Bundling</h2>
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
            {packageData.description || (
              <span className="italic text-gray-400">Belum ada deskripsi</span>
            )}
          </p>
        </div>

        <div className="w-full flex justify-end">
          <button
            className="mt-8 bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
            onClick={() => navigate(-1)}
          >
            <span className="flex items-center gap-2">
              <ArrowLeft size={16} /> Kembali
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
