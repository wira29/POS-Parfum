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
import { ImageHelper } from "@/core/helpers/ImageHelper";
import { LoadingColumn } from "@/views/components/Loading";

export const ProductIndex = () => {
  const api = useApiClient();
  const [products, setProducts] = useState<any[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [expandedProducts, setExpandedProducts] = useState<string[]>([]);
  const expandRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [showFilter, setShowFilter] = useState(false);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [variantPage, setVariantPage] = useState<Record<string, number>>({});
  const pageSize = 5;
  const variantPageSize = 5;

  const [categoryFilter, setCategoryFilter] = useState("");
  const [stockMin, setStockMin] = useState("");
  const [stockMax, setStockMax] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [salesMin, setSalesMin] = useState("");
  const [salesMax, setSalesMax] = useState("");

  const [tempCategoryFilter, setTempCategoryFilter] = useState("");
  const [tempStockMin, setTempStockMin] = useState("");
  const [tempStockMax, setTempStockMax] = useState("");
  const [tempPriceMin, setTempPriceMin] = useState("");
  const [tempPriceMax, setTempPriceMax] = useState("");
  const [tempSalesMin, setTempSalesMin] = useState("");
  const [tempSalesMax, setTempSalesMax] = useState("");

  const [salesRange, setSalesRange] = useState<{ min: number; max: number }>({ min: 0, max: 0 });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchData(page);
  }, [page, search, categoryFilter, stockMin, stockMax, priceMin, priceMax, salesMin, salesMax]);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories/no-paginate");
      setCategoryOptions(res.data.data || []);
    } catch {
      setCategoryOptions([]);
    }
  };

  const fetchData = async (page: number = 1) => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page: page.toString(),
        per_page: pageSize.toString(),
        search,
        category: categoryFilter,
        min_stock: stockMin,
        max_stock: stockMax,
        min_price: priceMin,
        max_price: priceMax,
        min_sales: salesMin,
        max_sales: salesMax,
      });

      const res = await api.get(`/products?${query.toString()}`);
      const pagination = res.data.pagination;

      const newProducts = res.data.data;
      setProducts(newProducts);
      setPage(pagination.current_page);
      setLastPage(pagination.last_page);

      const allVariants = newProducts.flatMap((product: any) => getVariants(product));
      const salesValues = allVariants.map((v) => v.penjualan || 0);
      const minSales = salesValues.length ? Math.min(...salesValues) : 0;
      const maxSales = salesValues.length ? Math.max(...salesValues) : 0;
      setSalesRange({ min: minSales, max: maxSales });

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
    return (product.product_detail || []).map((detail: any) => ({
      id: detail.id,
      name: detail.variant_name || detail.material || "Varian",
      code: detail.product_code || detail.product_varian_id?.slice(0, 8),
      stock: detail.stock ?? 0,
      price: detail.price ?? 0,
      category: detail.category || product.category || { name: "Umum" },
      penjualan: detail.transaction_details_count || 0,
      image: detail.product_image,
    }));
  };

  const confirmDelete = (id: string) => () => {
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

  const deleteProduct = async (id: string) => {
    try {
      await api.delete(`/products/${id}`);
      Swal.fire("Terhapus!", "Product berhasil dihapus.", "success");
      fetchData(page);
    } catch (error) {
      Swal.fire("Gagal!", "Gagal menghapus Product.", "error");
    }
  };

  const openFilterModal = () => {
    setTempCategoryFilter(categoryFilter);
    setTempStockMin(stockMin);
    setTempStockMax(stockMax);
    setTempPriceMin(priceMin);
    setTempPriceMax(priceMax);
    setTempSalesMin(salesMin);
    setTempSalesMax(salesMax);
    setShowFilter(true);
  };

  const isFilterActive = () => {
    return !!(
      categoryFilter ||
      stockMin ||
      stockMax ||
      priceMin ||
      priceMax ||
      salesMin ||
      salesMax
    );
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <Breadcrumb title="Produk" desc="Daftar produk dalam sistem" />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchInput
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <div className="relative">
            <Filter onClick={openFilterModal} />
            {isFilterActive() && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
            )}
          </div>
        </div>
        <AddButton to="/products/create">Tambah Produk</AddButton>
      </div>

      <div className="bg-white rounded-xl overflow-x-auto">
        <table className="w-full text-sm min-w-[700px] sm:min-w-full">
          <thead className="bg-blue-50 text-left text-gray-700 font-semibold">
            <tr className="border border-gray-200">
              <th className="p-4 pl-20">Produk</th>
              <th className="p-4">Kategori</th>
              <th className="p-4">Penjualan</th>
              <th className="p-4 pl-15">Harga</th>
              <th className="p-4">Stok</th>
              <th className="p-4 pl-15">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center p-4">
                  <LoadingColumn column={3} />
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-4">Tidak ada data produk</td>
              </tr>
            ) : (
              products.map((product) => {
                const variants = getVariants(product);
                const singleVariant = product.product_detail?.length === 1 ? variants[0] : null;
                return (
                  <React.Fragment key={product.id}>
                    <tr className="hover:bg-gray-50">
                      <td className="p-4 align-top flex gap-4">
                        <img
                          src={ImageHelper(product.image)}
                          alt={product.name}
                          className="w-14 h-14 rounded-md object-cover"
                        />
                        <div>
                          <div className="font-semibold">{product.name}</div>
                          <div className="text-gray-500 text-xs">ID Produk: {product.code || "-"}</div>
                        </div>
                      </td>
                      <td className="p-4 align-top">{product.category ?? "-"}</td>
                      <td className="p-4 align-top">{singleVariant ? singleVariant.penjualan : (product.sales ?? "-")}</td>
                      <td className="p-4 align-top">
                        {singleVariant ? (
                          `Rp ${singleVariant.price.toLocaleString("id-ID")}`
                        ) : variants.length > 1 ? (
                          (() => {
                            const prices = variants.map((v) => v.price);
                            const minPrice = Math.min(...prices);
                            const maxPrice = Math.max(...prices);
                            return minPrice === maxPrice
                              ? `Rp ${minPrice.toLocaleString("id-ID")}`
                              : `Rp ${minPrice.toLocaleString("id-ID")} - ${maxPrice.toLocaleString("id-ID")}`;
                          })()
                        ) : (
                          product.price ? `Rp ${product.price.toLocaleString("id-ID")}` : "-"
                        )}
                      </td>
                      <td className="p-4 align-top">
                        {singleVariant
                          ? `${singleVariant.stock} G`
                          : `${product.details_sum_stock || variants.reduce((acc, d) => acc + d.stock, 0)} G`}
                      </td>
                      <td className="p-4 align-top">
                        <div className="flex gap-2">
                          <ViewIcon to={product.is_bundling ? `/bundlings/${product.id}/detail` : `/products/${product.id}`} />
                          <EditIcon to={`/products/${product.id}/edit`} />
                          <DeleteIcon onClick={confirmDelete(product.id)} />
                        </div>
                      </td>
                    </tr>
                    {variants.length > 1 && (
                      <>
                        <tr>
                          <td
                            colSpan={6}
                            className="text-center text-gray-500 py-2 cursor-pointer select-none"
                            onClick={() => toggleExpand(product.id)}
                          >
                            {expandedProducts.includes(product.id) ? (
                              <>
                                <FiChevronUp className="inline" /> Close <FiChevronUp className="inline" />
                              </>
                            ) : (
                              <>
                                <FiChevronDown className="inline" /> Expand <FiChevronDown className="inline" />
                              </>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={6} className="p-0">
                            <div
                              ref={(el) => (expandRefs.current[product.id] = el)}
                              className={`variant-slide ${expandedProducts.includes(product.id)
                                ? "variant-enter"
                                : "variant-leave"
                                }`}
                            >
                              {expandedProducts.includes(product.id) && (() => {
                                const vPage = variantPage[product.id] || 1;
                                const totalVariantPages = Math.ceil(variants.length / variantPageSize);
                                const startIdx = (vPage - 1) * variantPageSize;
                                const shownVariants = variants.slice(startIdx, startIdx + variantPageSize);
                                return (
                                  <div className="ml-4 sm:ml-[72px]">
                                    {shownVariants.map((variant) => (
                                      <div
                                        key={variant.id}
                                        className="grid grid-cols-2 sm:grid-cols-6 gap-4 items-center p-4 bg-gray-50 border-b border-gray-200 text-sm"
                                      >
                                        <div>
                                          <img
                                            src={ImageHelper(variant.image)}
                                            alt={variant.name}
                                            className="w-12 h-12 rounded object-cover"
                                            onError={e => { (e.target as HTMLImageElement).src = "/images/placeholder.jpg"; }}
                                          />
                                        </div>
                                        <div>
                                          <div className="font-medium">{variant.name}</div>
                                          <div className="text-xs text-gray-500">Kode Varian: {variant.code}</div>
                                        </div>
                                        <div>{variant.category ?? "-"}</div>
                                        <div>{variant.penjualan}</div>
                                        <div>Rp {variant.price.toLocaleString("id-ID")}</div>
                                        <div>{variant.stock} G</div>
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

      {lastPage > 1 && (
        <Pagination currentPage={page} totalPages={lastPage} onPageChange={setPage} />
      )}

      <FilterModal
        open={showFilter}
        onClose={() => setShowFilter(false)}
        onApply={() => {
          setCategoryFilter(tempCategoryFilter);
          setStockMin(tempStockMin);
          setStockMax(tempStockMax);
          setPriceMin(tempPriceMin);
          setPriceMax(tempPriceMax);
          setSalesMin(tempSalesMin);
          setSalesMax(tempSalesMax);
          setPage(1);
          setShowFilter(false);
        }}
        categoryFilter={tempCategoryFilter}
        setCategoryFilter={setTempCategoryFilter}
        categoryOptions={categoryOptions}
        stockMin={tempStockMin}
        setStockMin={setTempStockMin}
        stockMax={tempStockMax}
        setStockMax={setTempStockMax}
        priceMin={tempPriceMin}
        setPriceMin={setTempPriceMin}
        priceMax={tempPriceMax}
        setPriceMax={setTempPriceMax}
        salesMin={tempSalesMin}
        setSalesMin={setTempSalesMin}
        salesMax={tempSalesMax}
        setSalesMax={setTempSalesMax}
        salesRange={salesRange}
      />
    </div>
  );
};
