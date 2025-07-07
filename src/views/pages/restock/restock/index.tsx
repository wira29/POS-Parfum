import { useEffect, useState, useCallback, useRef } from "react";
import { Breadcrumb } from "@/views/components/Breadcrumb";
import AddButton from "@/views/components/AddButton";
import { SearchInput } from "@/views/components/SearchInput";
import { Filter } from "@/views/components/Filter";
import { useNavigate } from "react-router-dom";
import { useApiClient } from "@/core/helpers/ApiClient";
import { FilterModal } from "@/views/components/filter/RestockFilterModal";

interface VariantItem {
  variant_id: string;
  variant_name: string;
  requested_stock: number;
  unit_id: string;
  unit_name: string;
  unit_code: string;
}

interface ProductItem {
  product_name: string;
  variant_count: number;
  variants: VariantItem[];
}

interface RestockHistoryItem {
  created_at: string;
  products: ProductItem[];
}

interface Pagination {
  current_page: number;
  last_page: number;
}

export const RestockIndex = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [minStock, setMinStock] = useState("");
  const [maxStock, setMaxStock] = useState("");
  const [pendingDateFrom, setPendingDateFrom] = useState("");
  const [pendingDateTo, setPendingDateTo] = useState("");
  const [pendingMinStock, setPendingMinStock] = useState("");
  const [pendingMaxStock, setPendingMaxStock] = useState("");
  const [data, setData] = useState<RestockHistoryItem[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const apiClient = useApiClient();

  const isFilterActive = !!(dateFrom || dateTo || minStock || maxStock);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (showFilter) {
      setPendingDateFrom(dateFrom);
      setPendingDateTo(dateTo);
      setPendingMinStock(minStock);
      setPendingMaxStock(maxStock);
    }
  }, [showFilter, dateFrom, dateTo, minStock, maxStock]);

  const fetchData = useCallback(
    async (params: { page?: string } = {}) => {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        query.append("per_page", "8");
        if (params.page) query.append("page", params.page);
        if (searchQuery) query.append("search", searchQuery.trim());
        if (dateFrom) query.append("from_date", dateFrom);
        if (dateTo) query.append("until_date", dateTo);
        if (minStock) query.append("min_stock", minStock);
        if (maxStock) query.append("max_stock", maxStock);

        const res = await apiClient.get<{ data: RestockHistoryItem[]; pagination: Pagination }>(
          `/warehouses/history/stock?${query.toString()}`
        );
        if (Array.isArray(res.data.data)) {
          setData(res.data.data);
        } else {
          console.warn("Unexpected data format, setting empty array");
          setData([]);
        }
        setPagination(res.data.pagination || null);
      } catch (err) {
        console.error("Error fetching restock history:", err);
        setData([]);
        setPagination(null);
      } finally {
        setLoading(false);
      }
    },
    [searchQuery, dateFrom, dateTo, minStock, maxStock]
  );

  useEffect(() => {
    fetchData();
  }, [searchQuery, dateFrom, dateTo, minStock, maxStock]);

  const handleApplyFilter = () => {
    setDateFrom(pendingDateFrom);
    setDateTo(pendingDateTo);
    setMinStock(pendingMinStock);
    setMaxStock(pendingMaxStock);
    setShowFilter(false);
  };

  const handleResetFilter = () => {
    setDateFrom("");
    setDateTo("");
    setMinStock("");
    setMaxStock("");
    setPendingDateFrom("");
    setPendingDateTo("");
    setPendingMinStock("");
    setPendingMaxStock("");
    setShowFilter(false);
  };

  const handlePageChange = (page: string) => {
    fetchData({ page });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const getTotalProducts = (products: ProductItem[]) => products.length;

  const getTotalRequestedStock = (products: ProductItem[]) =>
    products.reduce((total, product) => total + product.variants.reduce((sum, variant) => sum + variant.requested_stock, 0), 0);

  const renderItem = (restockItem: RestockHistoryItem, index: number) => (
    <div
      key={index}
      className="bg-white shadow border border-slate-200 p-6 rounded-xl flex flex-col lg:flex-row gap-6 items-stretch mb-6"
    >
      <div className="flex-1 flex flex-col gap-2 justify-between">
        <div className="border border-gray-200 rounded-xl p-4">
          {restockItem.products.slice(0, 2).map((product, productIdx) => (
            <div
              key={productIdx}
              className={`flex flex-col md:flex-row md:items-center md:justify-between py-2 ${
                productIdx !== 0 ? "border-t-2 border-dashed border-gray-300 mt-2 pt-4" : ""
              }`}
            >
              <div>
                <div className="font-semibold text-gray-800">Nama Produk</div>
                <div className="text-gray-600">{product.product_name}</div>
              </div>
              <div className="flex flex-col md:items-end gap-1 mt-2 md:mt-0">
                <div className="font-semibold text-gray-800">Varian Dipilih</div>
                <div className="text-gray-600">{product.variant_count} Varian</div>
              </div>
              <div className="flex flex-col md:items-end gap-1 mt-2 md:mt-0">
                <div className="font-semibold text-gray-800">Jumlah Request</div>
                <div className="text-green-600 font-medium">
                  {product.variants.reduce((total, variant) => total + variant.requested_stock, 0).toLocaleString()}{" "}
                  {product.variants[0]?.unit_code || "Unit"}
                </div>
              </div>
            </div>
          ))}
          {restockItem.products.length > 2 && (
            <div
              onClick={() => navigate(`/restock/${restockItem.created_at}/details`)}
              className="text-center text-gray-400 text-sm mt-4 border-t-2 border-dashed border-gray-300 pt-5 cursor-pointer hover:text-gray-600"
            >
              {restockItem.products.length - 2}+ product Lainnya
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col items-center justify-center min-w-[280px] rounded-xl p-6">
        <div className="mb-4">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-2">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <div className="absolute -right-1 -top-1 w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="font-semibold text-lg text-center mb-2">
          Re-Stock {getTotalProducts(restockItem.products)} Produk
        </div>
        <div className="text-green-600 text-sm mb-4 text-center">
          Re-stock pada: {formatDate(restockItem.created_at)}
        </div>
        <div className="w-full">
          <button
            className="bg-blue-600 w-full hover:bg-blue-700 text-white px-5 py-2 cursor-pointer rounded-lg font-semibold transition-colors duration-200"
            onClick={() => navigate(`/restock/${restockItem.created_at}/details`)}
          >
            Detail
          </button>
        </div>
      </div>
    </div>
  );

  const renderPagination = () =>
    pagination && (
      <div className="flex justify-end mt-4">
        <div className="flex items-center gap-1">
          <button
            className={`px-3 py-1 rounded border border-slate-300 cursor-pointer ${
              pagination.current_page === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-blue-50"
            }`}
            disabled={pagination.current_page === 1}
            onClick={() =>
              pagination.current_page > 1 &&
              handlePageChange((pagination.current_page - 1).toString())
            }
          >
            «
          </button>
          {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`px-3 py-1 rounded border border-slate-300 cursor-pointer ${
                page === pagination.current_page
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-blue-50"
              }`}
              disabled={page === pagination.current_page}
              onClick={() => handlePageChange(page.toString())}
            >
              {page}
            </button>
          ))}
          <button
            className={`px-3 py-1 rounded border border-slate-300 cursor-pointer ${
              pagination.current_page === pagination.last_page
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-blue-50"
            }`}
            disabled={pagination.current_page === pagination.last_page}
            onClick={() =>
              pagination.current_page < pagination.last_page &&
              handlePageChange((pagination.current_page + 1).toString())
            }
          >
            »
          </button>
        </div>
      </div>
    );

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb title="Riwayat Stock Warehouse" desc="Menampilkan riwayat stock dari warehouse" />
      <div className="p-4 flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 mb-4 w-full sm:w-auto max-w-lg">
            <SearchInput
              value={searchQuery}
              onChange={(e) => {
                const value = e.target.value;
                if (debounceTimeout.current) {
                  clearTimeout(debounceTimeout.current);
                }
                debounceTimeout.current = setTimeout(() => {
                  setSearchQuery(value);
                  fetchData();
                }, 300);
              }}
              placeholder="Cari riwayat restock..."
            />
            <div className="relative">
              <Filter onClick={() => setShowFilter(true)} />
              {isFilterActive && (
                <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white" />
              )}
            </div>
          </div>
          <div className="w-full sm:w-auto">
            <AddButton onClick={() => navigate("/restock/create")}>Tambah Restock</AddButton>
          </div>
        </div>
      </div>
      {loading ? (
        <div className="text-center text-gray-400 py-10">Loading...</div>
      ) : data.length > 0 ? (
        <>
          {data.map(renderItem)}
          {renderPagination()}
        </>
      ) : (
        <div className="text-center text-gray-400 py-10">Tidak ada data</div>
      )}
      <FilterModal
        open={showFilter}
        onClose={() => setShowFilter(false)}
        dateFrom={pendingDateFrom}
        setDateFrom={setPendingDateFrom}
        dateTo={pendingDateTo}
        setDateTo={setPendingDateTo}
        minStock={pendingMinStock}
        setMinStock={setPendingMinStock}
        maxStock={pendingMaxStock}
        setMaxStock={setPendingMaxStock}
        onApply={handleApplyFilter}
        onReset={handleResetFilter}
      />
    </div>
  );
};