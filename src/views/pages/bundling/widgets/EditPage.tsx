import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Breadcrumb } from "@/views/components/Breadcrumb";
import { useApiClient } from "@/core/helpers/ApiClient";
import { Toaster } from "@/core/helpers/BaseAlert";
import { Plus, X, Info } from "lucide-react";

export default function BundlingEdit() {
  const navigate = useNavigate();
  const apiClient = useApiClient();

  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [productName, setProductName] = useState("");
  const [productCode, setProductCode] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [errors, setErrors] = useState({});
  const [composition, setComposition] = useState<string[]>([""]);
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await apiClient.get("/categories");
        const mapped = res.data?.data?.map((cat) => ({
          value: cat.id,
          label: cat.name,
        })) || [];
        setCategories(mapped);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", productName);
    formData.append("unit_type", "weight");
    formData.append("category_id", category);
    formData.append("description", description);
    composition.forEach((item, idx) => {
      formData.append(`composition[${idx}]`, item);
    });
    formData.append("product_details[0][category_id]", category);
    formData.append("product_details[0][stock]", String(stock));
    formData.append("product_details[0][price]", String(price));
    formData.append("product_details[0][product_code]", productCode);
    formData.append("product_details[0][variant_name]", "Default");
    if (images.length > 0) {
      formData.append("product_details[0][product_image]", images[0]);
    }
    try {
      await apiClient.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/products");
      Toaster("success", "Product berhasil dibuat");
    } catch (error) {
      if (error?.response?.data?.data) {
        setErrors(error.response.data.data);
        Toaster("error", "Validasi gagal. Cek inputan Anda.");
      } else {
        Toaster("error", "Terjadi kesalahan saat menyimpan produk.");
      }
    }
  };

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb
        title="Buat Bundling Produk"
        desc="Lorem ipsum dolor sit amet, consectetur adipiscing"
      />
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-600">
              <Info size={18} /> Informasi Produk
            </h3>
                <label className={`${labelClass} flex items-center gap-1`}>
                  Nama Bundling<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nama Bundling"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>
              <div>
                <label className={`${labelClass} flex items-center gap-1`}>
                Produk Dibundling<span className="text-red-500">*</span>
                <button
                  type="button"
                  className="text-blue-600 text-sm ml-auto flex items-center gap-1"
                  onClick={() => setComposition(prev => [...prev, ""])}
                >
                  <Plus size={16} /> Tambah Bundling
                </button>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {composition.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Alkohol"
                      value={item}
                      onChange={(e) => {
                        const updated = [...composition];
                        updated[index] = e.target.value;
                        setComposition(updated);
                      }}
                    />
                    {composition.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setComposition(prev => prev.filter((_, i) => i !== index))}
                        className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`${labelClass} flex items-center gap-1`}>
                    Harga<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">Rp.</span>
                    <input
                      type="number"
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="500.000"
                      value={price}
                      onChange={(e) => setPrice(+e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className={`${labelClass} flex items-center gap-1`}>
                    Stok<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">Pcs</span>
                    <input
                      type="number"
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="200"
                      value={stock}
                      onChange={(e) => setStock(+e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => navigate("/products")}
                  className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-4">
          <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Preview</h3>
            <div className="text-sm text-gray-600 mb-4">Rincian Produk</div>
            <div className="bg-gray-100 rounded-lg p-4 mb-4 min-h-48 flex items-center justify-center">
              {images.length > 0 ? (
                <img 
                  src={URL.createObjectURL(images[0])} 
                  alt="Product preview" 
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <div className="text-center text-gray-400">
                  <div className="text-xs">0 Produk Tersedia</div>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <div className="text-xl font-bold text-blue-600">
                Rp {Number(price || 0).toLocaleString('id-ID')}
              </div>
              <div className="font-medium text-gray-800">
                {productName || "Nama Bundling"}
              </div>
              <div className="text-sm text-gray-600">
                Stok Produk: {stock || 0} Pcs
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}