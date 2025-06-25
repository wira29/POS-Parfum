import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Breadcrumb } from "@/views/components/Breadcrumb";

type BundlingPackage = {
  id: number;
  name: string;
  code: string;
  stock: number;
  quantity: number;
  price: number;
  status: string;
  created_at: string;
  image: string[];
};

export default function BundlingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [packageData, setPackageData] = useState<BundlingPackage | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const mockData: BundlingPackage[] = [
    {
      id: 1,
      name: "Paket Bundling 1",
      code: "PR12000",
      stock: 500,
      quantity: 3,
      price: 500000,
      status: "Tersedia",
      created_at: "2024-01-15",
      image: [
        "/assets/images/products/parfume.png",
        "/assets/images/products/s4.jpg",
        "/assets/images/products/parfume.png"
      ],
    },
    {
      id: 2,
      name: "PAKET BUNDLING 2",
      code: "#12234",
      stock: 220,
      quantity: 3,
      price: 5000000,
      status: "Tersedia",
      created_at: "2024-01-16",
      image: [
        "/assets/images/products/parfume.png",
        "/assets/images/products/s4.jpg",
        "/assets/images/products/parfume.png"
      ],
    },
    {
      id: 3,
      name: "PAKET BUNDLING 3",
      code: "#12234",
      stock: 300,
      quantity: 3,
      price: 5000000,
      status: "Tersedia",
      created_at: "2024-01-17",
      image: [
        "/assets/images/products/parfume.png",
        "/assets/images/products/s4.jpg",
        "/assets/images/products/parfume.png"
      ],
    },
    {
      id: 4,
      name: "PAKET BUNDLING 3",
      code: "#12234",
      stock: 300,
      quantity: 3,
      price: 5000000,
      status: "Tersedia",
      created_at: "2024-01-17",
      image: [
        "/assets/images/products/parfume.png",
        "/assets/images/products/s4.jpg",
        "/assets/images/products/parfume.png"
      ],
    },
    {
      id: 5,
      name: "PAKET BUNDLING 3",
      code: "#12234",
      stock: 300,
      quantity: 3,
      price: 5000000,
      status: "Tersedia",
      created_at: "2024-01-17",
      image: [
        "/assets/images/products/parfume.png",
        "/assets/images/products/s4.jpg",
        "/assets/images/products/parfume.png"
      ],
    },
  ];

  useEffect(() => {
    const foundPackage = mockData.find(pkg => pkg.id === parseInt(id || "1"));
    setPackageData(foundPackage || null);
    setSelectedImageIndex(0);
  }, [id]);

  const formatPrice = (price: number) => {
    return price.toLocaleString("id-ID");
  };

  if (!packageData) {
    return (
      <div className="p-6 space-y-6">
        <Breadcrumb
          title="Detail Bundling Produk"
          desc="Lorem ipsum dolor sit amet, consectetur adipiscing"
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
                src={packageData.image[selectedImageIndex]}
                alt={packageData.name}
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI0MCIgdmlld0JveD0iMCAwIDIwMCAyNDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjQwIiBmaWxsPSIjRjlGQUZCIi8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEyMCIgcj0iNDAiIGZpbGw9IiNEMUQ3REIiLz4KPC9zdmc+";
                }}
              />
            </div>
            <div className="flex gap-2">
              {packageData.image.map((img, index) => (
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
                    src={img}
                    alt={`${packageData.name} ${index + 1}`}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjlGQUZCIi8+CjxjaXJjbGUgY3g9IjMyIiBjeT0iMzIiIHI9IjEyIiBmaWxsPSIjRDFEN0RCIi8+Cjwvc3ZnPg==";
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
              Rp {formatPrice(packageData.price)}
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-sm font-medium text-gray-900 w-40">Quantity Item</span>
                  <div className="flex gap-2 flex-wrap">
                    {packageData.image.map((img, index) => (
                      <div key={index} className="flex items-center gap-2 bg-white rounded px-2 py-1 border border-gray-400">
                        <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                          <img
                            src={img}
                            alt={`Item ${index + 1}`}
                            className="w-6 h-6 object-contain"
                            onError={(e) => {
                              e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjlGQUZCIi8+CjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjQiIGZpbGw9IiNEMUQ3REIiLz4KPC9zdmc+";
                            }}
                          />
                        </div>
                        <span className="text-black text-base font-semibold">1</span>
                        <span className="text-black text-base">Parfum werty 10pm</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-900 w-40">Kode Bundling</span>
                <span className="text-sm text-gray-600">{packageData.code}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-900 w-40">Stok Produk</span>
                <span className="text-sm text-gray-600">{packageData.stock} Pcs</span>
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