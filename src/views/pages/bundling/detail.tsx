import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Breadcrumb } from "@/views/components/Breadcrumb";
import { useApiClient } from "@/core/helpers/ApiClient";
import { ImageHelper } from "@/core/helpers/ImageHelper";

type BundlingMaterial = {
  product_detail_id: string;
  variant_name: string;
  image: string | null;
};

type BundlingPackage = {
  id: string;
  name: string;
  kode_Bundling: string;
  harga: number;
  stock: number;
  status: string;
  category: string;
  bundling_material_count: number;
  bundling_material: BundlingMaterial[];
};

export default function BundlingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const apiClient = useApiClient();
  const [packageData, setPackageData] = useState<BundlingPackage | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await apiClient.get(`/product-bundling/${id}`);
        setPackageData(res.data.data);
        setSelectedImageIndex(0);
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
    <div className="p-6 space-y-6">
      <Breadcrumb
        title="Detail Bundling Produk"
        desc="Data Bundling Produk"
      />
      <div className="bg-white rounded-lg p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          <div className="flex-shrink-0 mb-8 md:mb-0">
            <div className="w-80 h-96 bg-gray-50 rounded-lg flex items-center justify-center mb-4">
              <img
                src={ImageHelper(packageData.bundling_material[selectedImageIndex]?.image)}
                alt={packageData.name}
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = "/images/placeholder.jpg";
                }}
              />
            </div>
            <div className="flex gap-2">
              {packageData.bundling_material.map((mat, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 flex items-center justify-center bg-gray-50 ${
                    selectedImageIndex === index 
                      ? "border-blue-500" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img
                    src={ImageHelper(mat.image)}
                    alt={`${packageData.name} ${index + 1}`}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = "/images/placeholder.jpg";
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 w-full">
            <h1 className="text-2xl font-semibold text-gray-900 mb-4">
              {packageData.name}
            </h1>
            <div className="text-4xl font-bold text-blue-600 mb-8">
              Rp {formatPrice(packageData.harga)}
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-sm font-medium text-gray-900 w-40">Quantity Item</span>
                  <div className="flex gap-2 flex-wrap">
                    {packageData.bundling_material.map((mat, index) => (
                      <div key={index} className="flex items-center gap-2 bg-white rounded px-2 py-1 border border-gray-400">
                        <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                          <img
                            src={ImageHelper(mat.image)}
                            alt={`Item ${index + 1}`}
                            className="w-6 h-6 object-contain"
                            onError={(e) => {
                              e.currentTarget.src = "/images/placeholder.jpg";
                            }}
                          />
                        </div>
                        <span className="text-black text-base font-semibold">1</span>
                        <span className="text-black text-base">{mat.variant_name || "-"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-900 w-40">Kode Bundling</span>
                <span className="text-sm text-gray-600">{packageData.kode_Bundling}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-900 w-40">Stok Produk</span>
                <span className="text-sm text-gray-600">{packageData.stock} Pcs</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-900 w-40">Status</span>
                <span className="text-sm text-gray-600">{packageData.status === "active" ? "Tersedia" : "Habis"}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-900 w-40">Kategori</span>
                <span className="text-sm text-gray-600">{packageData.category}</span>
              </div>
            </div>
            <div className="mt-12">
              <button 
                onClick={() => navigate(-1)}
                className="px-8 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium"
              >
                Kembali
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}