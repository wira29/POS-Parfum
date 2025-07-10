import { useApiClient } from "@/core/helpers/ApiClient";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

type Product = {
  id: number;
  product: string;
  product_code: string;
  product_image?: string;
  variant_name?: string;
  unit_code: string;
  stock: number;
};

type Props = {
  openModalvariant: boolean;
  closeModal: () => void;
  onSelectProduct: (product: Product) => void;
};

const ProductSelectionModal = ({ openModalvariant, closeModal, onSelectProduct }: Props) => {
  const ApiClient = useApiClient();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (openModalvariant) fetchProducts();
  }, [openModalvariant]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await ApiClient.get<{ data: Product[] }>("/product-details/no-paginate");
      console.log("produks", response.data)
      if (response.data) {
        setProducts(response.data.data);
        setFilteredProducts(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter((p) =>
        [p.product, p.product_code, p.variant_name].filter(Boolean).some((field) => field!.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm, products]);

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleConfirmSelection = () => {
    if (selectedProduct) {
      onSelectProduct(selectedProduct);
      closeModal();
      setSelectedProduct(null);
    }
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    closeModal();
  };  

  const formatPrice = (price: number) => new Intl.NumberFormat("id-ID").format(price);

  const getProductDisplayName = (p: Product) => !p.variant_name ? "Tidak ada varian name" : p.variant_name;

  const isVariant = (p: Product) => `${p.variant_name} - ${p.product}` !== null && `${p.variant_name} - ${p.product}` !== "Tidak ada variant name";

  if (!openModalvariant) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50" onClick={handleCloseModal}>
      <div className="bg-white w-11/12 md:w-3/4 lg:w-1/3 max-h-[85vh] rounded-lg shadow-lg flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Pilih Hasil Blending</h2>
          <span className="text-sm text-gray-500">Stok</span>
        </div>

        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent text-sm flex-1 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loading ? (
            <div className="flex justify-center items-center py-8 text-gray-500">Loading...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex justify-center items-center py-8 text-gray-500">Tidak ada produk ditemukan</div>
          ) : (
            <div className="space-y-3">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className={`flex items-center gap-4 p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedProduct?.id === product.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                  onClick={() => handleProductSelect(product)}
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isVariant(product) ? "bg-gray-100" : "bg-yellow-100"}`}>
                    {product.product_image ? (
                      <img src={product.product_image} alt={getProductDisplayName(product)} className="w-8 h-8 object-cover rounded" />
                    ) : isVariant(product) ? (
                      <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M13 2L3 14h6l-2 8 10-12h-6l2-8z" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 2v4H7v2h2v14h6V8h2V6h-2V2H9zm2 2h2v4h-2V4z" />
                      </svg>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className={`font-medium text-sm ${isVariant(product) ? "text-blue-600" : "text-gray-800"}`}>{getProductDisplayName(product)}</div>
                    <div className="text-xs text-gray-500">Kode : {product.product_code} | <span className="font-semibold text-black/70">Product : {product.product ?? "unknown"}</span></div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-800">{formatPrice(product.stock)} {product.unit_code}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
          <button onClick={handleCloseModal} className="flex-1 px-4 py-2 cursor-pointer text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Batal
          </button>
          <button
            onClick={handleConfirmSelection}
            disabled={!selectedProduct}
            className={`flex-1 px-4 py-2 text-sm font-medium cursor-pointer rounded-lg transition-colors ${selectedProduct ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
          >
            Buat
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductSelectionModal;