import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Breadcrumb } from "@/views/components/Breadcrumb";
import { useApiClient } from "@/core/helpers/ApiClient";
import { ImageHelper } from "@/core/helpers/ImageHelper";
import { ArrowLeft } from "lucide-react";

type BundlingMaterial = {
  product_detail_id: string;
  variant_name: string;
  image: string | null;
  price?: number;
  stock?: number;
  category?: string;
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

function groupVariants(materials: BundlingMaterial[]) {
  const groups: Record<string, BundlingMaterial[]> = {};
  materials.forEach((mat) => {
    const variantName = mat.variant_name || "";
    const [mainName, optionName] = variantName.split("-");
    const groupKey = mainName.trim();
    const matWithOption = { ...mat, optionName: optionName ? optionName.trim() : "" };
    if (!groups[groupKey]) groups[groupKey] = [];
    groups[groupKey].push(matWithOption);
  });
  return groups;
}

export default function BundlingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const apiClient = useApiClient();
  const [packageData, setPackageData] = useState<BundlingPackage | null>(null);
  const [selectedMainVariant, setSelectedMainVariant] = useState<string>("");
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

  const variantGroups = packageData ? groupVariants(packageData.bundling_material) : {};
  const mainVariantNames = Object.keys(variantGroups);

  useEffect(() => {
    if (packageData && mainVariantNames.length > 0) {
      setSelectedMainVariant(mainVariantNames[0]);
      setSelectedOptionIndex(0);
    }
  }, [packageData]);

  const currentVariants = variantGroups[selectedMainVariant] || [];
  const selectedVariant = currentVariants[selectedOptionIndex] || (packageData?.bundling_material?.[0] ?? null);
  const mainImage = selectedVariant?.image || "/images/placeholder.jpg";

  const formatPrice = (price: number) => {
    return price.toLocaleString("id-ID");
  };

  if (!packageData) {
    return (
      <div className="p-6 space-y-6">
        <Breadcrumb
          title="Detail Bundling Produk"
          desc="Data Bundling Produk"
        />
        <div className="bg-white rounded-lg p-8 text-center text-gray-500 py-12">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Breadcrumb
        title="Detail Bundling Produk"
        desc="Data Bundling Produk"
      />

      <div className="bg-white p-6 rounded-md shadow-xl mt-4">
        <div className="flex flex-col md:flex-row gap-20 w-full">
          <img
            src={ImageHelper(mainImage)}
            alt={packageData.name}
            className="w-full max-w-[520px] h-[450px] object-cover rounded-lg shadow-md mb-4 md:mb-0 md:mr-2"
            onError={(e) => {
              e.currentTarget.src = "/images/placeholder.jpg";
            }}
          />

          <div className="flex-1 max-w-150 space-y-4">
            <p className="text-xl text-black font-bold border-b-3 border-gray-300 w-full p-2 uppercase">
              {packageData.name.toUpperCase()}
            </p>

            <div className="flex flex-col gap-2">
              {mainVariantNames.map((mainName, idx) => {
                const mainVariant = variantGroups[mainName][0];
                return (
                  <button
                    key={mainName}
                    className={`border px-3 py-1 text-sm font-semibold flex items-center gap-2 w-50 cursor-pointer ${
                      selectedMainVariant === mainName
                        ? "bg-blue-100 border-blue-500 text-blue-700 rounded-sm"
                        : "bg-gray-100 border-gray-300 text-gray-700"
                    }`}
                    onClick={() => {
                      setSelectedMainVariant(mainName);
                      setSelectedOptionIndex(0);
                    }}
                  >
                    <img
                      src={ImageHelper(mainVariant?.image)}
                      className="w-6 h-6 rounded"
                      alt="variant"
                    />
                    <span>{mainName}</span>
                  </button>
                );
              })}
            </div>

            <div className="border-b-3 border-gray-300 pb-4">
              <p className="text-gray-500 mb-5">{packageData.kode_Bundling}</p>
              <p className="text-2xl font-bold text-gray-800">
                Rp {formatPrice(packageData.harga)}
              </p>
            </div>

            <div className="pb-4 border-b-2 border-gray-300">
              <h2 className="text-gray-500 mb-2">
                Tersedia {currentVariants.length} Opsi
              </h2>
              <div className="flex gap-4">
                {currentVariants.map((v, idx) => (
                  <button
                    key={v.product_detail_id}
                    className={`border-2 text-xs flex items-center p-3 rounded-sm w-30 justify-center gap-1 cursor-pointer ${
                      selectedOptionIndex === idx
                        ? "text-blue-700 border-blue-500"
                        : "text-gray-700 border-gray-400"
                    }`}
                    onClick={() => setSelectedOptionIndex(idx)}
                  >
                    <span className="font-semibold text-sm">
                      {v.optionName || v.variant_name || "Opsi"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="text-sm text-gray-700">
              <div className="flex justify-between">
                <span className="font-semibold">Stok Produk</span>
                <span>{selectedVariant?.stock ?? packageData.stock} Pcs</span>
              </div>
            </div>
          </div>
        </div>

        <h2 className="font-bold text-xl p-3 text-gray-800 border-b-3 border-gray-300 mt-3">
          Deskripsi
        </h2>
        <div className="mt-10 gap-6">
          <div className="md:col-span-2">
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {packageData.description || (
                <span className="text-gray-400 italic">
                  Belum ada deskripsi
                </span>
              )}
            </p>
          </div>
        </div>
        <button
          className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <span className="flex items-center gap-2">
            <ArrowLeft /> Kembali
          </span>
        </button>
      </div>
    </div>
  );
}