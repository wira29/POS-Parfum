import { useEffect, useRef, useState } from "react";
import {
  Search,
  Plus,
  X,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { SearchInput } from "@/views/components/SearchInput";

interface ProductVariant {
  id: number;
  name: string;
  code: string;
  image: string;
  selected: boolean;
}

interface Product {
  id: number;
  name: string;
  code: string;
  stock: string;
  image: string;
  hasVariants: boolean;
  variants?: ProductVariant[];
}

const generateDummyProducts = (count: number): Product[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    code: `PR${(i + 1).toString().padStart(3, "0")}`,
    stock: `${Math.floor(Math.random() * 10)}`,
    image: "/assets/images/products/image.png",
    hasVariants: Math.random() < 0.5,
    variants: Array.from(
      { length: Math.floor(Math.random() * 4) + 1 },
      (_, v) => ({
        id: i * 10 + v + 1,
        name: `Variant ${i + 1}-${v + 1}`,
        code: `VPR${(i + 1).toString().padStart(3, "0")}-${v + 1}`,
        image: "/assets/images/products/image.png",
        stock: `${Math.floor(Math.random() * 10000)}`,
        selected: false,
      })
    ),
  }));
};

export function SearchProduct({
  onAdd,
}: {
  onAdd: (items: (Product | ProductVariant)[]) => void;
}) {
  const [mainSearchValue, setMainSearchValue] = useState("");
  const [modalSearchValue, setModalSearchValue] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [selectedVariants, setSelectedVariants] = useState<number[]>([]);
  const [stockFilter, setStockFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  const [products] = useState<Product[]>(generateDummyProducts(60));
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hanldeCLickOutModal = (event: MouseEvent) => {
      if (
        showAddModal &&
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setShowAddModal(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowAddModal(false);
        setShowVariantModal(false);
      }
    };

    document.addEventListener("mousedown", hanldeCLickOutModal);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", hanldeCLickOutModal);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showAddModal, showVariantModal]);

  const filteredProducts = products
    .filter(
      (p) =>
        p.name.toLowerCase().includes(modalSearchValue.toLowerCase()) ||
        p.code.toLowerCase().includes(modalSearchValue.toLowerCase())
    )
    .sort((a, b) => {
      if (stockFilter === "high") return parseInt(b.stock) - parseInt(a.stock);
      if (stockFilter === "low") return parseInt(a.stock) - parseInt(b.stock);
      return 0;
    });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handleProductClick = (product: Product) => {
    if (product.hasVariants && product.variants) {
      setSelectedProduct(product);
      setShowVariantModal(true);
    } else {
      toggleProductSelect(product.id);
    }
  };

  const toggleProductSelect = (productId: number) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleVariantSelect = (variantId: number) => {
    setSelectedVariants((prev) =>
      prev.includes(variantId)
        ? prev.filter((id) => id !== variantId)
        : [...prev, variantId]
    );
  };

  const Pagination = () => (
    <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-t-slate-400/[0.5]">
      <div className="text-sm text-gray-700">
        Showing {indexOfFirstProduct + 1} to{" "}
        {Math.min(indexOfLastProduct, filteredProducts.length)} of{" "}
        {filteredProducts.length} products
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border cursor-pointer border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="px-4 py-2 text-sm font-medium">
          {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border cursor-pointer border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-3">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <SearchInput
            value={mainSearchValue}
            onChange={(e) => setMainSearchValue(e.target.value)}
          />
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2.5 rounded-lg cursor-pointer hover:bg-blue-700 flex items-center gap-2 font-medium transition-colors shadow-sm"
          >
            <Plus className="h-5 w-5" />
            Tambah
          </button>
        </div>
      </div>

      {showAddModal && (
        <div
          ref={modalRef}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center transition-all duration-300 z-50 p-4"
        >
          <div className="bg-white rounded-2xl w-full max-w-7xl max-h-[95vh] flex flex-col shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-white rounded-t-2xl">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Tambah Product
                </h2>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>

            <div className="p-6 border-b border-gray-200 bg-white">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Cari Produk"
                    value={modalSearchValue}
                    onChange={(e) => {
                      setModalSearchValue(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full pl-11 pr-4 py-3 outline-none border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
                <div className="flex gap-3">
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <select
                      onChange={(e) => {
                        setStockFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="pl-11 pr-8 py-3 cursor-pointer outline-none border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-w-48 appearance-none"
                    >
                      <option value="">Semua Stock</option>
                      <option value="high">Stok Terbanyak</option>
                      <option value="low">Stok Terkecil</option>
                    </select>
                  </div>
                </div>
              </div>

              {selectedProducts.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                  <p className="text-blue-800 font-medium">
                    {selectedProducts.length + selectedVariants.length} produk
                    {selectedProducts.length > 1 ? "s" : ""} dipilih
                  </p>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {currentProducts.map((product) => (
                  <div
                    key={product.id}
                    className={`group bg-white rounded-xl p-3 relative cursor-pointer transition-all duration-200 ${
                      selectedProducts.includes(product.id)
                        ? "border-2 border-dashed border-blue-500 bg-blue-50"
                        : "border border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleProductClick(product)}
                  >
                    <div className="relative mb-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-40 object-cover rounded-lg bg-gray-100"
                      />
                      {product.hasVariants && (
                        <div className="absolute top-2 left-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                          Variants
                        </div>
                      )}
                      {selectedProducts.includes(product.id) && (
                        <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                          <svg
                            className="h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500 font-mono">
                        {product.code}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-gray-600">
                            {product.stock} unit
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {currentProducts.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Search className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Tidak Ada Produk
                  </h3>
                  <p className="text-gray-600">
                    Ulangi pencarian yang sesuai dengan nama produk
                  </p>
                </div>
              )}
            </div>

            <Pagination />

            <div className="p-6 border-t border-t-gray-200 bg-gray-50 rounded-b-2xl">
              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-3 cursor-pointer rounded-xl bg-white border border-gray-300 hover:bg-gray-50 font-medium transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    const selectedProductItems = selectedProducts
                      .map((productId) =>
                        products.find((p) => p.id === productId)
                      )
                      .filter((p): p is Product => p !== undefined);

                    const selectedVariantItems = products
                      .flatMap((p) => p.variants ?? [])
                      .filter((v) => selectedVariants.includes(v.id));

                    onAdd([...selectedProductItems, ...selectedVariantItems]);

                    setShowAddModal(false);
                  }}
                  disabled={
                    selectedProducts.length === 0 &&
                    selectedVariants.length === 0
                  }
                  className="px-6 py-3 cursor-pointer rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors shadow-sm"
                >
                  Tambah {selectedProducts.length + selectedVariants.length}{" "}
                  Produk
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showVariantModal && selectedProduct && (
        <div
          ref={modalRef}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Select Variants
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  {selectedProduct.name}
                </p>
              </div>
              <button
                onClick={() => setShowVariantModal(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="h-7 w-7 text-gray-600 cursor-pointer" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2.5">
              <div className="space-y-4">
                {selectedProduct.variants?.map((variant) => (
                  <div
                    key={variant.id}
                    className={`flex items-center gap-4 p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedVariants.includes(variant.id)
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => toggleVariantSelect(variant.id)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedVariants.includes(variant.id)}
                      onChange={() => toggleVariantSelect(variant.id)}
                      className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <img
                      src={variant.image}
                      alt={variant.name}
                      className="w-12 h-12 object-cover rounded-lg bg-gray-100"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {variant.name}
                      </p>
                      <p className="text-sm text-gray-500 font-mono">
                        {variant.code}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowVariantModal(false)}
                  className="px-6 py-2 rounded-xl cursor-pointer bg-white border border-gray-300 hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowVariantModal(false)}
                  disabled={selectedVariants.length === 0}
                  className="px-6 py-2 cursor-pointer rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                >
                  Select {selectedVariants.length} Variant
                  {selectedVariants.length !== 1 ? "s" : ""}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
