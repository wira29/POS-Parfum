import { useEffect, useRef, useState, useCallback } from "react";
import {
  Search,
  Plus,
  X,
  Filter,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Users,
  Check,
} from "lucide-react";
import { RotateCw } from "react-feather";
import MemberFormModal from "@/views/components/MemberFormModal";
import { useApiClient } from "@/core/helpers/ApiClient";
import { ImageHelper } from "@/core/helpers/ImageHelper";

interface ProductVariant {
  id: string;
  name: string;
  product_code: string;
  product_image: string | null;
  stock: number;
  selected?: boolean;
  price: number;
  unit_code: string;
  unit_id: string;
  variant_name: string;
}

interface BundlingDetail {
  product_name: string;
  variant_name: string;
  product_code: string;
  quantity: number;
  product_detail_id: string;
  unit_code: string;
  unit_id: string;
}

interface Product {
  id: string;
  name: string;
  image: string | null;
  category: string | null;
  is_bundling: boolean;
  product_detail: ProductVariant[];
  bundling_detail?: BundlingDetail[];
  details_sum_stock: string;
  unit_code: string | null;
  unit_id: string | null;
}

interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  from: number;
  to: number;
}

const ProductService = {
  extractCategories(products: Product[]) {
    if (!Array.isArray(products)) return [];
    return Array.from(
      new Set(
        products
          .map((p) => p.category)
          .filter((c): c is string => typeof c === "string")
      )
    ).sort((a, b) => a.localeCompare(b));
  },

  filterVariants(product: Product | null, searchValue: string) {
    if (!product) return [];
    const searchLower = searchValue.toLowerCase();
    const variants = product.is_bundling
      ? product.bundling_detail ?? []
      : product.product_detail ?? [];
    return variants.filter((variant) =>
      (variant.variant_name?.toLowerCase() ?? "").includes(searchLower) ||
      (variant.product_code?.toLowerCase() ?? "").includes(searchLower)
    );
  },
};

const SearchProduct = ({
  onAdd,
  onReset,
  selectedIds = [],
}: {
  onAdd: (items: (Product | ProductVariant)[]) => void;
  onReset: () => void;
  selectedIds?: (string | number)[];
}) => {
  const [modalSearchValue, setModalSearchValue] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showVariants, setShowVariants] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedVariants, setSelectedVariants] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    per_page: 10,
    current_page: 1,
    last_page: 1,
    from: 0,
    to: 0,
  });
  const [categories, setCategories] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isOpenModalAdd, setIsOpenModalAdd] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const apiClient = useApiClient();

  const hasVariants = (product: Product) => {
    return !product.is_bundling && (product.product_detail?.length || 0) > 1;
  };

  const loadProducts = useCallback(async () => {
    if (hasLoaded && showAddModal) return;
    setLoading(true);
    try {
      const response = await apiClient.get("/products", {
        params: {
          page: currentPage,
          per_page: pagination.per_page,
          search: modalSearchValue,
          category: categoryFilter || undefined,
        },
      });

      const productList = Array.isArray(response.data.data) ? response.data.data : [];
      setProducts(productList);
      setPagination(response.data.pagination || {
        total: response.data.data?.length || 0,
        per_page: 10,
        current_page: 1,
        last_page: 1,
        from: 1,
        to: response.data.data?.length || 0,
      });
      setCategories(ProductService.extractCategories(productList));
      setHasLoaded(true);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  }, [apiClient, currentPage, modalSearchValue, categoryFilter, hasLoaded, showAddModal, pagination.per_page]);

  useEffect(() => {
    if (showAddModal && !hasLoaded) {
      loadProducts();
    }
  }, [showAddModal, hasLoaded, loadProducts]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setModalSearchValue(value);
    setCurrentPage(1);
    setHasLoaded(false);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      loadProducts();
    }, 500);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryFilter(e.target.value);
    setCurrentPage(1);
    setHasLoaded(false);
    loadProducts();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadProducts();
  };

  const handleProductClick = (product: Product) => {
    if (product.is_bundling || !hasVariants(product)) {
      if (!product.is_bundling && product.product_detail?.length === 1) {
        const singleVariant = product.product_detail[0];
        toggleVariantSelect(singleVariant.id);
      } else {
        toggleProductSelect(product.id);
      }
      return;
    }

    setSelectedProduct(product);
    setShowVariants(true);
    setCurrentPage(1);
  };

  const handleBackToProducts = () => {
    setShowVariants(false);
    setSelectedProduct(null);
    setCurrentPage(1);
  };

  const toggleVariantSelect = (variantId: string) => {
    setSelectedVariants((prev) =>
      prev.includes(variantId)
        ? prev.filter((id) => id !== variantId)
        : [...prev, variantId]
    );
  };

  const toggleProductSelect = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const resetData = () => {
    setSelectedProducts([]);
    setSelectedVariants([]);
    setModalSearchValue("");
    setCategoryFilter("");
    setCurrentPage(1);
  };

  const closeModal = () => {
    setShowAddModal(false);
    resetData();
    setShowVariants(false);
    setSelectedProduct(null);
    setHasLoaded(false);
  };

  const filteredVariants = ProductService.filterVariants(selectedProduct, modalSearchValue);

  const handleAddSelectedItems = () => {
    const selectedProductItems = products
      .filter((p) => selectedProducts.includes(p.id))
      .map((p) => ({
        ...p,
        product_detail: p.is_bundling ? p.bundling_detail ?? [] : [],
        unit_code: p.unit_code,
        unit_id: p.unit_id,
      }));

    const selectedVariantItems = products
      .filter((p) => !p.is_bundling && hasVariants(p))
      .flatMap((product) => {
        const selectedVariantsForProduct = (product.product_detail ?? [])
          .filter((v) => selectedVariants.includes(v.id))
          .map((v) => ({
            ...v,
            selected: true,
            unit_code: v.unit_code,
            unit_id: v.unit_id,
          }));

        if (selectedVariantsForProduct.length > 0) {
          return [{
            ...product,
            product_detail: selectedVariantsForProduct,
            unit_code: product.unit_code,
            unit_id: product.unit_id,
          }];
        }
        return [];
      });

    const finalItems = [...selectedProductItems, ...selectedVariantItems];
    onAdd(finalItems);
    closeModal();
  };

  const Pagination = () => (
    <div className="flex items-center justify-between px-6 py-4 border-t border-t-slate-400/[0.5]">
      <div className="text-sm text-gray-700">
        Showing {pagination.from} to {pagination.to} of {pagination.total} {showVariants ? "variants" : "products"}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1 || loading}
          className="p-2 rounded-lg border cursor-pointer border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="px-4 py-2 text-sm font-medium">
          Page {currentPage} of {pagination.last_page}
        </span>
        <button
          onClick={() => handlePageChange(Math.min(currentPage + 1, pagination.last_page))}
          disabled={currentPage === pagination.last_page || loading}
          className="p-2 rounded-lg border cursor-pointer border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  const ProductCard = ({ product }: { product: Product }) => {
    const isPreviouslySelected = selectedIds.includes(product.id);
    const shouldShowCheckbox = product.is_bundling || !hasVariants(product);

    return (
      <div
        className={`group bg-white rounded-xl p-3 relative cursor-pointer transition-all duration-200 ${selectedProducts.includes(product.id)
            ? "border-2 border-dashed border-blue-500 bg-blue-50"
            : "border border-gray-200 hover:border-gray-300"
          }`}
        onClick={(e) => {
          if (!(e.target as HTMLElement).closest('input[type="checkbox"]')) {
            handleProductClick(product);
          }
        }}
      >
        {isPreviouslySelected && !selectedProducts.includes(product.id) && (
          <div className="absolute top-2 right-2 w-3 h-3 bg-blue-500 rounded-full"></div>
        )}

        <div className="relative mb-3">
          <img
            src={ImageHelper(product.image)}
            alt={product.name}
            className="w-full h-50 object-cover rounded-lg"
            onError={(e) => {
              (e.target as HTMLImageElement).src = ImageHelper(null);
            }}
          />

          {shouldShowCheckbox && (
            <div className="absolute top-2 right-2 flex items-center justify-center">
              <div className={`w-5 h-5 rounded border flex items-center justify-center ${selectedProducts.includes(product.id)
                  ? "bg-blue-500 border-blue-500"
                  : "bg-white border-gray-300"
                }`}>
                {selectedProducts.includes(product.id) && <Check className="w-4 h-4 text-white" />}
              </div>
            </div>
          )}

          <div className="absolute w-full top-0 left-0 flex justify-between">
            {product.is_bundling ? (
              <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                Bundling
              </span>
            ) : (
              <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                {product.product_detail?.length || 0} Variants
              </span>
            )}
            {product.category && (
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                {product.category}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            {product.details_sum_stock} {product.unit_code || ""}
          </div>
        </div>
      </div>
    );
  };

  const VariantCard = ({ variant }: { variant: ProductVariant | BundlingDetail }) => {
    const variantId = (variant as ProductVariant).id || (variant as BundlingDetail).product_detail_id;
    const isSelected = selectedVariants.includes(variantId);
    const isPreviouslySelected = selectedIds.includes(variantId);

    return (
      <div
        className={`group bg-white rounded-xl p-3 relative cursor-pointer transition-all duration-200 ${isSelected
            ? "border-2 border-dashed border-blue-500 bg-blue-50"
            : "border border-gray-200 hover:border-gray-300"
          }`}
        onClick={(e) => {
          if (!(e.target as HTMLElement).closest('input[type="checkbox"]')) {
            toggleVariantSelect(variantId);
          }
        }}
      >
        {isPreviouslySelected && !isSelected && (
          <div className="absolute top-2 right-2 w-3 h-3 bg-blue-500 rounded-full"></div>
        )}

        <div className="relative mb-3">
          <img
            src={ImageHelper((variant as ProductVariant).product_image)}
            alt={variant.variant_name}
            className="w-full h-50 object-cover rounded-lg"
            onError={(e) => {
              (e.target as HTMLImageElement).src = ImageHelper(null);
            }}
          />
          <div className="absolute top-2 right-2 flex items-center justify-center">
            <div className={`w-5 h-5 rounded border flex items-center justify-center ${isSelected
                ? "bg-blue-500 border-blue-500"
                : "bg-white border-gray-300"
              }`}>
              {isSelected && <Check className="w-4 h-4 text-white" />}
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {variant.variant_name}
          </h3>
          <p className="text-sm text-gray-500 font-mono">
            {variant.product_code}
          </p>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            {(variant as ProductVariant).stock || (variant as BundlingDetail).quantity} {(variant as ProductVariant).unit_code || ""}
          </div>
          {(variant as ProductVariant).price && (
            <p className="text-sm font-medium text-green-600">
              Rp {(variant as ProductVariant).price.toLocaleString("id-ID")}
            </p>
          )}
        </div>
      </div>
    );
  };

  const SelectedItemsDisplay = () => {
    const selectedProductItems = products.filter((p) => selectedProducts.includes(p.id));

    const selectedVariantItems = products.flatMap((product) => {
      if (product.is_bundling) return [];
      return (product.product_detail ?? [])
        .filter((variant) => selectedVariants.includes(variant.id))
        .map((variant) => ({
          ...variant,
          product_name: product.name,
          product_image: product.image,
          unit_code: variant.unit_code,
          unit_id: variant.unit_id
        }));
    });

    return (
      <div className="mt-4">
        <h3 className="font-medium text-gray-700 mb-2">
          Selected Items ({selectedProducts.length + selectedVariantItems.length}):
        </h3>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {selectedProductItems.map((product) => (
            <div key={`product-${product.id}`} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
              <img
                src={ImageHelper(product.image)}
                alt={product.name}
                className="w-10 h-10 object-cover rounded"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = ImageHelper(null);
                }}
              />
              <div className="flex-1">
                <p className="font-medium">{product.name}</p>
                {product.is_bundling && (
                  <p className="text-sm text-gray-500">Bundling (Unit: {product.unit_code})</p>
                )}
              </div>
              <button
                onClick={() => toggleProductSelect(product.id)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ))}

          {selectedVariantItems.map((variant) => (
            <div key={`variant-${variant.id}`} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
              <img
                src={variant.product_image || "/assets/images/products/parfume.png"}
                alt={variant.variant_name}
                className="w-10 h-10 object-cover rounded"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/assets/images/products/parfume.png";
                }}
              />
              <div className="flex-1">
                <p className="font-medium">{variant.product_name}</p>
                <p className="text-sm text-gray-500">
                  {variant.variant_name} (Unit: {variant.unit_code})
                </p>
              </div>
              <button
                onClick={() => toggleVariantSelect(variant.id)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ))}
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
            Add Product
          </button>
          <button
            onClick={() => setIsOpenModalAdd(true)}
            className="bg-blue-600 text-white px-4 py-2.5 rounded-lg cursor-pointer hover:bg-blue-700 flex items-center gap-2 font-medium transition-colors shadow-sm"
          >
            <Users className="h-5 w-5" />
            Add Member
          </button>
          <button
            onClick={onReset}
            className="bg-green-600 text-white px-4 py-2.5 rounded-lg cursor-pointer hover:bg-green-700 flex items-center gap-2 font-medium transition-colors shadow-sm"
          >
            <RotateCw className="h-5 w-5" />
            Reset
          </button>
        </div>
      </div>

      <SelectedItemsDisplay />

      <MemberFormModal
        isOpen={isOpenModalAdd}
        onClose={() => setIsOpenModalAdd(false)}
        mode="tengah"
        onSubmit={(data) => console.log(data)}
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
                  : "Add Product"}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>

            <div className="p-3 border-b border-gray-200 bg-white">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder={
                      showVariants ? "Search Variant" : "Search Product (Code/Name)"
                    }
                    value={modalSearchValue}
                    onChange={handleSearchChange}
                    className="w-full pl-11 pr-4 py-3 outline-none border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
                {!showVariants && (
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <select
                      value={categoryFilter}
                      onChange={handleCategoryChange}
                      className="pl-11 pr-8 py-3 cursor-pointer outline-none border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-w-48 appearance-none"
                    >
                      <option value="">All Categories</option>
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
                <div className="mt-2 flex justify-between items-center">
                  <button
                    onClick={handleBackToProducts}
                    className="px-4 py-2 cursor-pointer text-sm hover:text-slate-700 font-medium transition-colors flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Products
                  </button>
                  <button
                    onClick={() => {
                      const allVariantIds = filteredVariants.map(v =>
                        (v as ProductVariant).id || (v as BundlingDetail).product_detail_id
                      );
                      setSelectedVariants(prev => {
                        if (allVariantIds.every(id => prev.includes(id))) {
                          return prev.filter(id => !allVariantIds.includes(id));
                        }
                        return [...new Set([...prev, ...allVariantIds])];
                      });
                    }}
                    className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium"
                  >
                    {selectedVariants.length === filteredVariants.length ?
                      "Unselect All" : "Select All"}
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : showVariants ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {filteredVariants.length > 0 ? (
                    filteredVariants.map((variant) => (
                      <VariantCard
                        key={(variant as ProductVariant).id || (variant as BundlingDetail).product_detail_id}
                        variant={variant}
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No Variants Found
                      </h3>
                      <p className="text-gray-600">
                        Try searching with different keywords
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {products.length > 0 ? (
                    products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No Products Found
                      </h3>
                      <p className="text-gray-600">
                        Try adjusting your search or filter criteria
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {!showVariants && <Pagination />}

            <div className="p-6 border-t border-t-gray-200 rounded-b-2xl">
              <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
                <div>
                  {(selectedProducts.length > 0 || selectedVariants.length > 0) && (
                    <div className="flex gap-5">
                      <div className="p-3 bg-blue-50 border w-full border-blue-200 rounded-xl">
                        <p className="text-blue-800 font-medium">
                          {selectedProducts.length + selectedVariants.length}{" "}
                          {selectedProducts.length + selectedVariants.length === 1 ? "item" : "items"} selected
                        </p>
                      </div>
                      <button
                        className="p-3 bg-red-50 border w-20 border-red-200 rounded-xl cursor-pointer flex justify-center"
                        onClick={resetData}
                      >
                        <RotateCw className="h-7 w-7 text-red-600" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={closeModal}
                    className="px-6 py-3 cursor-pointer rounded-xl bg-white border border-gray-300 hover:bg-gray-50 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddSelectedItems}
                    disabled={
                      selectedProducts.length === 0 &&
                      selectedVariants.length === 0
                    }
                    className="px-6 py-3 cursor-pointer rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors shadow-sm"
                  >
                    Add {selectedProducts.length + selectedVariants.length}{" "}
                    {selectedProducts.length + selectedVariants.length === 1 ? "Item" : "Items"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchProduct;