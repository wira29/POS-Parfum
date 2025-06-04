import { useState, useRef, useEffect } from "react";
import React from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { X } from "lucide-react";
import { Breadcrumb } from "@/views/components/Breadcrumb";
import { SearchInput } from "@/views/components/SearchInput";
import { Filter } from "@/views/components/Filter";
import DeleteIcon from "@/views/components/DeleteIcon";
import { EditIcon } from "@/views/components/EditIcon";
import AddButton from "@/views/components/AddButton";
import ViewIcon from "@/views/components/ViewIcon";
import dummyProducts from "./dummy/ProductDummy";
import { Pagination } from "@/views/components/Pagination";
import Swal from "sweetalert2";
import { Toaster } from "@/core/helpers/BaseAlert";

const FilterModal = ({
  open,
  onClose,
  categoryFilter,
  setCategoryFilter,
  categoryOptions,
}: {
  open: boolean;
  onClose: () => void;
  categoryFilter: string;
  setCategoryFilter: (val: string) => void;
  categoryOptions: string[];
}) => {
  if (!open) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">
            Filter Kategori Produk
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 cursor-pointer" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategori Produk
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Kategori</option>
              {categoryOptions.map((cat, idx) => (
                <option key={idx} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2 p-4 border-t border-gray-200">
          <button
            onClick={() => {
              setCategoryFilter("");
              onClose();
            }}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Reset
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            Terapkan
          </button>
        </div>
      </div>
    </div>
  );
};

export const ProductIndex = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedProducts, setExpandedProducts] = useState<number[]>([]);
  const expandRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [showFilter, setShowFilter] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [variantPage, setVariantPage] = useState<Record<number, number>>({});
  const pageSize = 3;
  const variantPageSize = 3;

  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter]);

  const products = dummyProducts.map((p: any) => ({
    id: p.id,
    name: p.productName,
    code: p.productCode,
    createdAt: "2024-09-18",
    category: { name: p.category },
    sales: 0,
    price: p.price,
    total_stock: p.stock,
    image: p.image,
    composition: p.composition,
    variants:
      p.variations && p.variations[0]?.options
        ? p.variations[0].options.map((aroma: any, idx: number) => {
            if (typeof aroma === "object") {
              return {
                id: `${p.id}-${aroma.value}`,
                name: aroma.value,
                code:
                  aroma.code || `${aroma.value.toUpperCase().slice(0, 3)}-${p.productCode}`,
                stock: aroma.stock ?? p.stock,
                price: aroma.price ?? p.price,
                image: p.variations[0].image || p.image,
              };
            }
            return {
              id: `${p.id}-${aroma}`,
              name: aroma,
              code: `${aroma.toUpperCase().slice(0, 3)}-${p.productCode}`,
              stock: p.stock,
              price: p.price,
              image: p.variations[0].image || p.image,
            };
          })
        : [],
  }));

  const toggleExpand = (productId: number) => {
    setExpandedProducts((prev) => {
      const isExpanded = prev.includes(productId);
      if (!isExpanded) {
        setVariantPage((vp) => ({ ...vp, [productId]: 1 }));
        setTimeout(() => {
          expandRefs.current[productId]?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 200);
      }
      return isExpanded ? prev.filter((id) => id !== productId) : [...prev, productId];
    });
  };

  const categoryOptions = Array.from(new Set(products.map((product) => product.category?.name ?? "-")));

  const filteredData = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (categoryFilter ? product.category?.name === categoryFilter : true)
  );

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function dellete() {
    Swal.fire({
      title: "Apakah anda yakin?",
      text: "Data product akan dihapus!",
      icon: "question",
    }).then((result) => {
      if (!result.isConfirmed) return;
      Toaster("success", "Product berhasil dihapus");
    });
  }

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb title="Produk" desc="Lorem ipsum dolor sit amet, consectetur adipiscing." />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 mb-4 w-full sm:w-auto max-w-lg">
          <SearchInput
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="w-full sm:w-auto">
          <Filter onClick={() => setShowFilter(true)} />
        </div>
        <div className="w-full sm:w-auto">
          <AddButton to="/products/create">Tambah Produk</AddButton>
        </div>
      </div>

      <div className="bg-white rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[800px]">
            <thead className="bg-blue-50 text-left text-gray-700 font-semibold">
              <tr className="border-b">
                <th className="p-4"><input type="checkbox" /></th>
                <th className="p-4">Produk</th>
                <th className="p-4">Kategori</th>
                <th className="p-4">Penjualan</th>
                <th className="p-4">Harga</th>
                <th className="p-4">Stok</th>
                <th className="p-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((product) => (
                <React.Fragment key={product.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="p-4 align-top"><input type="checkbox" /></td>
                    <td className="p-4 align-top flex gap-4">
                      <img src={product.image} className="w-14 h-14 rounded-md object-cover" />
                      <div>
                        <div className="font-semibold">{product.name}</div>
                        <div className="text-gray-500 text-xs">ID Produk: {product.code}</div>
                      </div>
                    </td>
                    <td className="p-4 align-top">{product.category?.name ?? '-'}</td>
                    <td className="p-4 align-top">{product.sales}</td>
                    <td className="p-4 align-top">Rp {product.price.toLocaleString()}</td>
                    <td className="p-4 align-top">{product.total_stock} G</td>
                    <td className="p-4 align-top">
                      <div className="flex gap-2">
                        <ViewIcon to={`/products/${product.id}`} />
                        <EditIcon to={`/products/${product.id}/edit`} />
                        <DeleteIcon onClick={dellete} />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={7} className="text-center text-gray-500 py-2 cursor-pointer" onClick={() => toggleExpand(product.id)}>
                      {expandedProducts.includes(product.id) ? (
                        <><FiChevronUp className="inline" /> Close <FiChevronUp className="inline" /></>
                      ) : (
                        <><FiChevronDown className="inline" /> Expand <FiChevronDown className="inline" /></>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={7} className="p-0">
                      <div
                        ref={(el) => (expandRefs.current[product.id] = el)}
                        className={`variant-slide ${expandedProducts.includes(product.id) ? 'variant-enter' : 'variant-leave'}`}
                      >
                        {expandedProducts.includes(product.id) && (() => {
                          const variants = product.variants || [];
                          const page = variantPage[product.id] || 1;
                          const totalVariantPages = Math.ceil(variants.length / variantPageSize);
                          const startIdx = (page - 1) * variantPageSize;
                          const shownVariants = variants.slice(startIdx, startIdx + variantPageSize);

                          return (
                            <>
                              <div className="ml-[72px] md:ml-[70px]">
                                {shownVariants.map((variant: any) => (
                                  <div key={variant.id} className="flex flex-wrap md:flex-nowrap items-center p-4 bg-gray-50">
                                    <div className="w-1/2 md:w-1/18">
                                      <img src={variant.image} className="w-12 h-12 rounded object-cover" />
                                    </div>
                                    <div className="w-full md:w-3/12">
                                      <div className="font-medium">{variant.name}</div>
                                      <div className="text-xs text-gray-500">Kode Varian: {variant.code}</div>
                                    </div>
                                    <div className="w-1/2 md:w-2/12">-</div>
                                    <div className="w-1/2 md:w-2/16">-</div>
                                    <div className="w-1/2 md:w-2/13">Rp {variant.price.toLocaleString()}</div>
                                    <div className="w-1/2 md:w-2/12">{variant.stock} G</div>
                                  </div>
                                ))}
                                {totalVariantPages > 1 && (
                                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 text-sm text-muted-foreground py-2">
                                    <span className="text-gray-700">{variants.length} Varian</span>
                                    <Pagination
                                      currentPage={page}
                                      totalPages={totalVariantPages}
                                      onPageChange={(pg) => setVariantPage((vp) => ({ ...vp, [product.id]: pg }))}
                                    />
                                  </div>
                                )}
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 text-sm text-muted-foreground">
          <span className="text-gray-700">{filteredData.length} Data</span>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </div>

      <FilterModal
        open={showFilter}
        onClose={() => setShowFilter(false)}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        categoryOptions={categoryOptions}
      />
    </div>
  );
};
