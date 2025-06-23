import { useEffect, useRef, useState } from "react";
import React from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

import { Breadcrumb } from "@/views/components/Breadcrumb";
import { SearchInput } from "@/views/components/SearchInput";
import { Filter } from "@/views/components/Filter";
import DeleteIcon from "@/views/components/DeleteIcon";
import { EditIcon } from "@/views/components/EditIcon";
import AddButton from "@/views/components/AddButton";
import ViewIcon from "@/views/components/ViewIcon";
import { Pagination } from "@/views/components/Pagination";
import { useApiClient } from "@/core/helpers/ApiClient";
import { Toaster } from "@/core/helpers/BaseAlert";
import Swal from "sweetalert2";
import { FilterModal } from "@/views/components/filter/ProductFilter";

export const ProductIndex = () => {
  const api = useApiClient();
  const [products, setProducts] = useState<any[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [expandedProducts, setExpandedProducts] = useState<string[]>([]);
  const expandRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [showFilter, setShowFilter] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [stockMin, setStockMin] = useState("");
  const [stockMax, setStockMax] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [variantPage, setVariantPage] = useState<Record<string, number>>({});
  const pageSize = 5;
  const variantPageSize = 5;

  useEffect(() => {
    fetchData(page);
  }, [page, search, categoryFilter, stockMin, stockMax]);

  const fetchData = async (page: number = 1) => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page: page.toString(),
        per_page: pageSize.toString(),
        search,
        category: categoryFilter,
        stock_min: stockMin,
        stock_max: stockMax,
      });

      const res = await api.get(`/products?${query.toString()}`);
      const pagination = res.data.pagination;

      setProducts(pagination.data);
      setPage(pagination.current_page);
      setLastPage(pagination.last_page);

      const categories = Array.from(
        new Set(
          pagination.data
            .map((p: any) => p.category?.name)
            .filter(Boolean)
        )
      );
      setCategoryOptions(categories);
    } catch (error) {
      Toaster("error", "Gagal memuat data produk");
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (productId: string) => {
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

  const getVariants = (product: any) => {
    return (product.details || []).map((detail: any) => ({
      id: detail.id,
      name: detail.variant_name || detail.material || "Varian",
      code: detail.product_code || detail.product_varian_id?.slice(0, 8),
      stock: detail.product_stock_warehouse?.stock ?? detail.stock ?? 0,
      price: detail.price ?? 0,
      category: detail.category || product.category || { name: "Umum" },
      penjualan: detail.transaction_details_count || 0,
      image: detail.product_image
        ? detail.product_image.startsWith("http")
          ? detail.product_image
          : `${import.meta.env.VITE_API_URL}/${detail.product_image}`
        : "/no-image.png",
    }));
  };

  const confirmDelete = (id: number) => () => {
    Swal.fire({
      title: "Apakah anda yakin?",
      text: "Data Product akan dihapus!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) deleteProduct(id);
    });
  };

  const deleteProduct = async (id: number) => {
    try {
      await api.delete(`/products/${id}`);
      Swal.fire("Terhapus!", "Product berhasil dihapus.", "success");
      fetchData(page);
    } catch (error) {
      Swal.fire("Gagal!", "Gagal menghapus Product.", "error");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb title="Produk" desc="Daftar produk dalam sistem" />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <SearchInput
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <Filter onClick={() => setShowFilter(true)} />
        <AddButton to="/products/create">Tambah Produk</AddButton>
      </div>

      <div className="bg-white rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[800px]">
            <thead className="bg-blue-50 text-left text-gray-700 font-semibold">
              <tr className="border border-gray-200">
                <th className="p-4">Produk</th>
                <th className="p-4">Kategori</th>
                <th className="p-4">Penjualan</th>
                <th className="p-4">Harga</th>
                <th className="p-4">Stok</th>
                <th className="p-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center p-4">Loading...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={6} className="text-center p-4">Tidak ada data produk</td></tr>
              ) : (
                products.map((product) => {
                  const variants = getVariants(product);
                  const singleVariant = product.details?.length === 1 ? variants[0] : null;
                  return (
                    <React.Fragment key={product.id}>
                      <tr className="hover:bg-gray-50">
                        <td className="p-4 align-top flex gap-4">
                          <img
                            src={product.image ? `${import.meta.env.VITE_API_URL}/${product.image}` : "/no-image.png"}
                            alt={product.name}
                            className="w-14 h-14 rounded-md object-cover"
                          />
                          <div>
                            <div className="font-semibold">{product.name}</div>
                            <div className="text-gray-500 text-xs">ID Produk: {product.code || "-"}</div>
                          </div>
                        </td>
                        <td className="p-4 align-top">{product.category?.name ?? "-"}</td>
                        <td className="p-4 align-top">{singleVariant ? singleVariant.penjualan : (product.sales ?? "-")}</td>
                        <td className="p-4 align-top">Rp {singleVariant ? singleVariant.price.toLocaleString("id-ID") : (product.price?.toLocaleString("id-ID") ?? "-")}</td>
                        <td className="p-4 align-top">{singleVariant ? `${singleVariant.stock} G` : `${variants.reduce((acc, d) => acc + d.stock, 0)} G`}</td>
                        <td className="p-4 align-top">
                          <div className="flex gap-2">
                            <ViewIcon to={`/products/${product.id}`} />
                            <EditIcon to={`/products/${product.id}/edit`} />
                            <DeleteIcon onClick={confirmDelete(product.id)} />
                          </div>
                        </td>
                      </tr>

                      {variants.length > 1 && (
                        <>
                          <tr>
                            <td colSpan={6} className="text-center text-gray-500 py-2 cursor-pointer select-none" onClick={() => toggleExpand(product.id)}>
                              {expandedProducts.includes(product.id) ? <><FiChevronUp className="inline" /> Close <FiChevronUp className="inline" /></> : <><FiChevronDown className="inline" /> Expand <FiChevronDown className="inline" /></>}
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={6} className="p-0">
                              <div ref={(el) => (expandRefs.current[product.id] = el)} className={`variant-slide ${expandedProducts.includes(product.id) ? "variant-enter" : "variant-leave"}`}>
                                {expandedProducts.includes(product.id) && (() => {
                                  const vPage = variantPage[product.id] || 1;
                                  const totalVariantPages = Math.ceil(variants.length / variantPageSize);
                                  const startIdx = (vPage - 1) * variantPageSize;
                                  const shownVariants = variants.slice(startIdx, startIdx + variantPageSize);
                                  return (
                                    <div className="ml-[72px] md:ml-[70px]">
                                      {shownVariants.map((variant) => (
                                        <div key={variant.id} className="flex flex-wrap md:flex-nowrap items-center p-4 bg-gray-50 border-b border-gray-200">
                                          <div className="w-1/2 md:w-1/18"><img src={variant.image} alt={variant.name} className="w-12 h-12 rounded object-cover" /></div>
                                          <div className="w-full md:w-3/12">
                                            <div className="font-medium">{variant.name}</div>
                                            <div className="text-xs text-gray-500">Kode Varian: {variant.code}</div>
                                          </div>
                                          <div className="w-1/2 md:w-2/12">{variant.category.name}</div>
                                          <div className="w-1/2 md:w-2/16">{variant.penjualan}</div>
                                          <div className="w-1/2 md:w-2/13">Rp {variant.price.toLocaleString("id-ID")}</div>
                                          <div className="w-1/2 md:w-2/12">{variant.stock} G</div>
                                        </div>
                                      ))}
                                      {totalVariantPages > 1 && (
                                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 text-sm text-gray-700 py-2">
                                          <span>{variants.length} Varian</span>
                                          <Pagination
                                            currentPage={vPage}
                                            totalPages={totalVariantPages}
                                            onPageChange={(pg) => setVariantPage((vp) => ({ ...vp, [product.id]: pg }))}
                                          />
                                        </div>
                                      )}
                                    </div>
                                  );
                                })()}
                              </div>
                            </td>
                          </tr>
                        </>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {lastPage > 1 && (
        <Pagination currentPage={page} totalPages={lastPage} onPageChange={setPage} />
      )}

      <FilterModal
        open={showFilter}
        onClose={() => {
          setShowFilter(false);
          setPage(1);
        }}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        categoryOptions={categoryOptions}
        stockMin={stockMin}
        setStockMin={setStockMin}
        stockMax={stockMax}
        setStockMax={setStockMax}
      />
    </div>
  );
};
