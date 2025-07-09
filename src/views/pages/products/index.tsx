import { useApiClient } from "@/core/helpers/ApiClient";
import { Toaster } from "@/core/helpers/BaseAlert";
import { ImageHelper } from "@/core/helpers/ImageHelper";
import { IsRole } from "@/core/middlewares/is-role";
import AddButton from "@/views/components/AddButton";
import { Breadcrumb } from "@/views/components/Breadcrumb";
import DeleteIcon from "@/views/components/DeleteIcon";
import { EditIcon } from "@/views/components/EditIcon";
import { Filter } from "@/views/components/Filter";
import { FilterModal } from "@/views/components/filter/ProductFilter";
import { LoadingColumn } from "@/views/components/Loading";
import { Pagination } from "@/views/components/Pagination";
import { SearchInput } from "@/views/components/SearchInput";
import ViewIcon from "@/views/components/ViewIcon";
import { CloudDownload } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import Swal from "sweetalert2";

export const ProductIndex = () => {
  const api = useApiClient();
  const [products, setProducts] = useState<any[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedProducts, setExpandedProducts] = useState<string[]>([]);
  const expandRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [showFilter, setShowFilter] = useState(false);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [variantPage, setVariantPage] = useState<Record<string, number>>({});
  const pageSize = 5;
  const variantPageSize = 5;

  // Filter states
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

  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importUrl, setImportUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setPage(1);
    fetchData(1);
  }, [searchQuery, categoryFilter, stockMin, stockMax, priceMin, priceMax, salesMin, salesMax]);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories/no-paginate");
      setCategoryOptions(res.data.data || []);
    } catch {
      setCategoryOptions([]);
    }
  };

  const getUnitCode = (variants: any[]) => {
    return variants.find((v) => !!v.unit_code)?.unit_code || "G";
  };

  const fetchData = async (pageNumber: number = 1) => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page: pageNumber.toString(),
        per_page: pageSize.toString(),
        search: searchQuery,
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

  const getVariants = (product: any) => {
    if (product.is_bundling) {
      return (product.bundling_detail || []).map((detail: any, index: number) => ({
        id: detail.product_detail_id || `bundling-${index}`,
        name: detail.variant_name || detail.product_name || "Varian",
        code: detail.product_code || "-",
        stock: detail.sum_stock ?? 0,
        price: product.bundling_price ?? 0,
        category: detail.category || product.category || { name: "Umum" },
        penjualan: 0,
        image: product.image,
        unit_code: detail.unit_code ?? "G",
      }));
    }

    return (product.product_detail || []).map((detail: any) => ({
      id: detail.id,
      name: detail.variant_name || detail.material || "Varian",
      code: detail.product_code || detail.product_varian_id?.slice(0, 8),
      stock: detail.stock ?? 0,
      price: detail.price ?? 0,
      category: detail.category || product.category || { name: "Umum" },
      penjualan: detail.transaction_details_count || 0,
      image: detail.product_image || product.image,
      unit_code: detail.unit_code ?? "G",
    }));
  };

  const toggleExpand = (productId: string) => {
    setExpandedProducts((prev) => {
      const isExpanded = prev.includes(productId);
      if (!isExpanded) {
        setVariantPage((vp) => ({ ...vp, [productId]: 1 }));
        setTimeout(() => {
          expandRefs.current[productId]?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 200);
      }
      return isExpanded ? prev.filter((id) => id !== productId) : [...prev, productId];
    });
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
    return !!(categoryFilter || stockMin || stockMax || priceMin || priceMax || salesMin || salesMax);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImportFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setImportFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleImport = async () => {
    try {
      /*setLoading(true);
      const formData = new FormData();
      
      if (importFile) {
        formData.append("file", importFile);
        await api.post("/products/import", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else if (importUrl) {
        await api.post("/products/import", { url: importUrl });
      } else {
        Toaster("error", "Please select a file or enter a URL");
        return;
      }
      */
      Toaster("success", "Products imported successfully");
      setShowImportModal(false);
      fetchData(page);
    } catch (error) {
      Toaster("error", "Failed to import products");
    } finally {
      setLoading(false);
      setImportFile(null);
      setImportUrl("");
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <Breadcrumb title="Produk" desc="Daftar produk dalam sistem" />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchInput
            value={searchQuery}
            onChange={(val) => {
              setSearchQuery(val);
            }}
            placeholder="Cari produk..."
          />
          <div className="relative">
            <Filter onClick={openFilterModal} />
            {isFilterActive() && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
            )}
          </div>
        </div>
        <IsRole role={["warehouse", "outlet"]}>
          <div className="flex items-center gap-2">
            <AddButton to="/products/create">Tambah Produk</AddButton>
            <button
              className="bg-green-600 hover:bg-green-700 cursor-pointer text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
              onClick={() => setShowImportModal(true)}
            >
              <CloudDownload size={16} />Import
            </button>
          </div>
        </IsRole>
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
              <tr><td colSpan={6} className="text-center p-4"><LoadingColumn column={3} /></td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={6} className="text-center p-4">Tidak ada data produk</td></tr>
            ) : (
              products.map((product) => {
                const variants = getVariants(product);
                const singleVariant = !product.is_bundling && product.product_detail?.length === 1 ? variants[0] : null;
                const productCode = singleVariant
                  ? singleVariant.code || product.id
                  : "-";
                return (
                  <React.Fragment key={product.id}>
                    <tr className="hover:bg-gray-50">
                      <td className="p-4 align-top flex gap-4">
                        <img src={ImageHelper(product.image)} alt={product.name} className="w-14 h-14 rounded-md object-cover" />
                        <div>
                          <div className="font-semibold">{product.name}</div>
                          {singleVariant ? (
                            <div className="text-gray-500 text-xs">Kode Product: {productCode || "-"}</div>
                          ) : (
                            <div></div>
                          )}
                        </div>
                      </td>
                      <td className="p-4 align-top">{product.category ?? "-"}</td>
                      <td className="p-4 align-top">{singleVariant ? singleVariant.penjualan : (product.sales ?? 0)}</td>
                      <td className="p-4 align-top">
                        {product.is_bundling
                          ? `Rp ${product.bundling_price?.toLocaleString("id-ID")}`
                          : singleVariant
                            ? `Rp ${singleVariant.price.toLocaleString("id-ID")}`
                            : (() => {
                              const prices = variants.map((v) => v.price);
                              const min = Math.min(...prices);
                              const max = Math.max(...prices);
                              return min === max
                                ? `Rp ${min.toLocaleString("id-ID")}`
                                : `Rp ${min.toLocaleString("id-ID")} - ${max.toLocaleString("id-ID")}`;
                            })()
                        }
                      </td>
                      <td className="p-4 align-top">
                        {product.is_bundling
                          ? `${variants.reduce((sum, v) => sum + v.stock, 0)} ${getUnitCode(variants)}`
                          : singleVariant
                            ? `${singleVariant.stock} ${getUnitCode(variants)}`
                            : `${variants.reduce((sum, v) => sum + v.stock, 0)} ${getUnitCode(variants)}`
                        }
                      </td>
                      <td className="p-4 align-top">
                        <div className="flex gap-2 items-center">
                          <ViewIcon to={product.is_bundling ? `/bundlings/${product.id}/detail` : `/products/${product.id}`} />
                          <IsRole role={["warehouse", "outlet"]}>
                            {!product.is_bundling && (
                              <EditIcon to={`/products/${product.id}/edit`} />
                            )}
                            {!product.is_bundling && (
                              <DeleteIcon onClick={confirmDelete(product.id)} />
                            )}
                          </IsRole>
                        </div>
                      </td>
                    </tr>
                    {variants.length > 1 && (
                      <>
                        <tr>
                          <td colSpan={6} className="py-2 cursor-pointer select-none">
                            <div
                              className="flex justify-center items-center gap-1 text-gray-500"
                              onClick={() => toggleExpand(product.id)}
                            >
                              {expandedProducts.includes(product.id) ? (
                                <>
                                  <FiChevronUp />
                                  <span>Close</span>
                                  <FiChevronUp />
                                </>
                              ) : (
                                <>
                                  <FiChevronDown />
                                  <span>Expand</span>
                                  <FiChevronDown />
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={6} className="p-0">
                            <div
                              ref={(el) => (expandRefs.current[product.id] = el)}
                              className={`variant-slide ${expandedProducts.includes(product.id) ? "variant-enter" : "variant-leave"}`}
                            >
                              {expandedProducts.includes(product.id) && (() => {
                                const vPage = variantPage[product.id] || 1;
                                const totalVariantPages = Math.ceil(variants.length / variantPageSize);
                                const startIdx = (vPage - 1) * variantPageSize;
                                const shownVariants = variants.slice(startIdx, startIdx + variantPageSize);
                                return (
                                  <div className="ml-4 sm:ml-[72px]">
                                    {shownVariants.map((variant) => (
                                      <div key={variant.id} className="grid grid-cols-2 sm:grid-cols-6 gap-4 items-center p-4 bg-gray-50 border-b border-gray-200 text-sm">
                                        <div>
                                          <img
                                            src={ImageHelper(variant.image)}
                                            alt={variant.name}
                                            className="w-12 h-12 rounded object-cover"
                                            onError={(e) => { (e.target as HTMLImageElement).src = "/images/placeholder.jpg"; }}
                                          />
                                        </div>
                                        <div>
                                          <div className="font-medium">{variant.name}</div>
                                          <div className="text-xs text-gray-500">Kode Varian: {variant.code}</div>
                                        </div>
                                        <div>{variant.category ?? "-"}</div>
                                        <div>{variant.penjualan}</div>
                                        <div>Rp {variant.price.toLocaleString("id-ID")}</div>
                                        <div>{variant.stock} {variant.unit_code}</div>
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

      {showImportModal && (
        <div className="fixed inset-0 bg-black flex items-center justify-center p-4 z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-end items-center mb-4">
                <button
                  onClick={() => {
                    setShowImportModal(false);
                    setImportFile(null);
                    setImportUrl("");
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>

              <div className="space-y-6">
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".csv,.txt"
                    onChange={handleFileChange}
                  />
                  {importFile ? (
                    <div className="text-center">
                      <p className="font-medium">{importFile.name}</p>
                      <p className="text-sm text-gray-500">
                        {Math.round(importFile.size / 1024)}KB - Ready to import
                      </p>
                    </div>
                  ) : (
                    <>
                      <p className="font-medium">Drag & Drop or Choose file to upload</p>
                      <p className="text-sm text-gray-500">CSV or TXT</p>
                    </>
                  )}
                </div>

                <div className="flex justify-end items-center pt-4">
                  <div className="flex gap-3">
                    <button
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                      onClick={() => {
                        setShowImportModal(false);
                        setImportFile(null);
                        setImportUrl("");
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleImport}
                    //disabled={!importFile && !importUrl}
                    >
                      Import
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};