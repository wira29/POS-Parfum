import { useEffect, useRef, useState } from "react";
import {
  Search,
  Plus,
  X,
  Filter,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Users,
} from "lucide-react";
import { RotateCw } from "react-feather";
import MemberFormModal from "@/views/components/MemberFormModal";

interface ProductVariant {
  id: number;
  name: string;
  code: string;
  image: string;
  selected: boolean;
  stock: number;
}

interface Product {
  id: number;
  name: string;
  code: string;
  stock: string;
  image: string;
  category: string;
  hasVariants?: boolean;
  variants: ProductVariant[];
}

const categories = ["Electronics", "Clothing", "Food", "Books", "Sports"];

const generateDummyProducts = (count: number): Product[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    code: `PR${(i + 1).toString().padStart(3, "0")}`,
    stock: `${Math.floor(Math.random() * 10)}`,
    image: "/assets/images/products/parfume.png",
    category: categories[Math.floor(Math.random() * categories.length)],
    variants: Array.from(
      { length: Math.floor(Math.random() * 4) + 3 },
      (_, v) => ({
        id: i * 10 + v + 1,
        name: `Variant ${i + 1}-${v + 1}`,
        code: `VPR${(i + 1).toString().padStart(3, "0")}-${v + 1}`,
        image: "/assets/images/products/parfume.png",
        selected: false,
        stock: Math.floor(Math.random() * 5),
      })
    ),
  }));
};

export function SearchProduct({
  onAdd,
  onReset,
}: {
  onAdd: (items: (Product | ProductVariant)[]) => void;
  onReset: () => void;
}) {
  const [modalSearchValue, setModalSearchValue] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showVariants, setShowVariants] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [selectedVariants, setSelectedVariants] = useState<number[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;
  const [products] = useState<Product[]>(generateDummyProducts(60));
  const modalRef = useRef<HTMLDivElement>(null);
  const [isOpenModalAdd, setIsOpenModalAdd] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        if (showAddModal) setShowAddModal(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowAddModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showAddModal]);

  const filteredProducts = products.filter(
    (p) =>
      (p.code.toLowerCase().includes(modalSearchValue.toLowerCase()) ||
        p.name.toLowerCase().includes(modalSearchValue.toLowerCase())) &&
      (categoryFilter === "" || p.category === categoryFilter)
  );

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setShowVariants(true);
    setCurrentPage(1);
  };

  const handleBackToProducts = () => {
    setShowVariants(false);
    setSelectedProduct(null);
    setCurrentPage(1);
  };

  const toggleVariantSelect = (variantId: number) => {
    setSelectedVariants((prev) =>
      prev.includes(variantId)
        ? prev.filter((id) => id !== variantId)
        : [...prev, variantId]
    );
  };

  const filteredVariants = selectedProduct
    ? selectedProduct.variants.filter(
        (variant) =>
          variant.name.toLowerCase().includes(modalSearchValue.toLowerCase()) ||
          variant.code.toLowerCase().includes(modalSearchValue.toLowerCase())
      )
    : [];

  const currentFilteredVariants = filteredVariants.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const resetData = () => {
    setSelectedProducts([]);
    setSelectedVariants([]);
  };

  const Pagination = () => {
    const totalItems = showVariants
      ? filteredVariants.length
      : filteredProducts.length;
    const currentItems = showVariants
      ? currentFilteredVariants.length
      : currentProducts.length;
    const pages = showVariants
      ? Math.ceil(filteredVariants.length / productsPerPage)
      : totalPages;

    return (
      <div className="flex items-center justify-between px-6 py-4 border-t border-t-slate-400/[0.5]">
        <div className="text-sm text-gray-700">
          Menampilkan {indexOfFirstProduct + 1} sampai{" "}
          {Math.min(indexOfLastProduct, totalItems)} dari {totalItems}{" "}
          {showVariants ? "varian" : "produk"}
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
            Halaman {currentPage} dari {pages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pages))}
            disabled={currentPage === pages}
            className="p-2 rounded-lg border cursor-pointer border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-3">
      <div className="mb-3">
        <div className="flex justify-start items-center gap-5">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2.5 rounded-lg cursor-pointer hover:bg-blue-700 flex items-center gap-2 font-medium transition-colors shadow-sm"
          >
            <Plus className="h-5 w-5" />
            Tambah
          </button>
          <button
            type="button"
            onClick={() => setIsOpenModalAdd(true)}
            className="bg-blue-600 text-white px-4 py-2.5 rounded-lg cursor-pointer hover:bg-blue-700 flex items-center gap-2 font-medium transition-colors shadow-sm"
          >
            <Users className="h-5 w-5" />
            Tambah Member
          </button>
          <button
            onClick={() => onReset()}
            className="bg-green-600 text-white px-4 py-2.5 rounded-lg cursor-pointer hover:bg-green-700 flex items-center gap-2 font-medium transition-colors shadow-sm"
          >
            <RotateCw />
          </button>
        </div>
      </div>

      <MemberFormModal
        isOpen={isOpenModalAdd}
        onClose={() => setIsOpenModalAdd(false)}
        mode="tengah"
        onSubmit={(data) => {
          console.log(data);
        }}
      />

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center transition-all duration-300 z-50 p-4">
          <div
            ref={modalRef}
            className="bg-white rounded-2xl w-full max-w-7xl max-h-[95vh] flex flex-col shadow-2xl"
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-white rounded-t-2xl">
              <h2 className="text-2xl font-bold text-gray-900">
                {showVariants
                  ? `Variants - ${selectedProduct?.name}`
                  : "Tambah Product"}
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X
                  className="h-6 w-6 text-gray-600 cursor-pointer"
                  onClick={() => resetData()}
                />
              </button>
            </div>

            <div className="p-3 border-b border-gray-200 bg-white">
              <div className="flex flex-col sm:flex-row gap-4">
                {!showVariants && (
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder={
                        showVariants
                          ? "Cari Variant"
                          : "Cari Produk (Kode/Nama)"
                      }
                      value={modalSearchValue}
                      onChange={(e) => {
                        setModalSearchValue(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full pl-11 pr-4 py-3 outline-none border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>
                )}
                {!showVariants && (
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <select
                      value={categoryFilter}
                      onChange={(e) => {
                        setCategoryFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="pl-11 pr-8 py-3 cursor-pointer outline-none border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-w-48 appearance-none"
                    >
                      <option value="">Semua Kategori</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {showVariants && (
                <>
                  <button
                    onClick={handleBackToProducts}
                    className="px-6 py-3 cursor-pointer text-lg hover:text-slate-700 font-medium transition-colors flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Kembali
                  </button>
                </>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {showVariants ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {currentFilteredVariants.map((variant) => (
                    <div
                      key={variant.id}
                      className={`group bg-white rounded-xl p-3 relative cursor-pointer transition-all duration-200 ${
                        selectedVariants.includes(variant.id)
                          ? "border-2 border-dashed border-blue-500 bg-blue-50"
                          : "border border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => toggleVariantSelect(variant.id)}
                    >
                      <div className="relative mb-3">
                        <img
                          src={variant.image}
                          alt={variant.name}
                          className="w-full h-50 object-cover"
                        />
                        {selectedVariants.includes(variant.id) && (
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
                          {variant.name}
                        </h3>
                        <p className="text-sm text-gray-500 font-mono">
                          {variant.code}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
                          className="w-full h-50 object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                          {product.variants.length} Variants
                        </div>
                        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                          {product.category}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-500 font-mono">
                          {product.code}
                        </p>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                          {product.stock} unit
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {((showVariants && currentFilteredVariants.length === 0) ||
                (!showVariants && currentProducts.length === 0)) && (
                <div className="text-center py-12">
                  <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {showVariants ? "Tidak Ada Variant" : "Tidak Ada Produk"}
                  </h3>
                  <p className="text-gray-600">
                    Ulangi pencarian yang sesuai dengan{" "}
                    {showVariants ? "nama variant" : "nama produk"}
                  </p>
                </div>
              )}
            </div>

            {!showVariants && <Pagination />}

            <div className="p-6 border-t border-t-gray-200 rounded-b-2xl">
              <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
                <div>
                  {/* {selectedProducts.length + selectedVariants.length > 0 && (
                    <div className="flex gap-5">
                      <div className="mt-4 p-3 bg-blue-50 border w-full border-blue-200 rounded-xl">
                        <p className="text-blue-800 font-medium">
                          {selectedProducts.length + selectedVariants.length}{" "}
                          produk dipilih
                        </p>
                      </div>
                      <button
                        className="mt-4 p-3 bg-red-50 border w-20 border-red-200 rounded-xl cursor-pointer flex justify-center"
                        onClick={() => {
                          resetData();
                        }}
                      >
                        <RotateCw className="h-7 w-7 text-red-600" />
                      </button>
                    </div>
                  )} */}

                  {selectedProducts.length + selectedVariants.length > 0 && (
                    <div className="font-medium text-gray-400 text-md">
                      Produk dipilih (
                      {selectedProducts.length + selectedVariants.length})
                    </div>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      resetData();
                      setShowAddModal(false);
                    }}
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

                      const variantMap = new Map<number, Product>();

                      selectedVariants.forEach((variantId) => {
                        products.forEach((product) => {
                          const variant = product.variants?.find(
                            (v) => v.id === variantId
                          );
                          if (variant) {
                            if (!variantMap.has(product.id)) {
                              variantMap.set(product.id, {
                                ...product,
                                variants: [],
                                hasVariants: true,
                              });
                            }
                            variantMap
                              .get(product.id)!
                              .variants!.push({ ...variant, selected: true });
                          }
                        });
                      });

                      const selectedVariantProducts = Array.from(
                        variantMap.values()
                      );

                      const finalItems = [
                        ...selectedProductItems,
                        ...selectedVariantProducts,
                      ];

                      onAdd(finalItems);

                      setShowAddModal(false);
                      setShowVariants(false);
                      setSelectedProduct(null);
                      setSelectedProducts([]);
                      setSelectedVariants([]);
                      setModalSearchValue("");
                      setCategoryFilter("");
                      setCurrentPage(1);
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
        </div>
      )}
    </div>
  );
}
