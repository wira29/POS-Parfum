import { useEffect, useState } from "react";
import { Breadcrumb } from "@/views/components/Breadcrumb";
import AddButton from "@/views/components/AddButton";
import { SearchInput } from "@/views/components/SearchInput";
import { Filter } from "@/views/components/Filter";
import { useNavigate } from "react-router-dom";
import { useApiClient } from "@/core/helpers/ApiClient";
import { ImageHelper } from "@/core/helpers/ImageHelper";
import { FilterModal } from "@/views/components/filter/RestockFilterModal";

const statusMap = {
  Menunggu: {
    label: "Menunggu",
    className: "bg-gray-100 text-gray-600",
  },
  Diproses: {
    label: "Diproses",
    className: "bg-yellow-100 text-yellow-700",
  },
  Dikirim: {
    label: "Dikirim",
    className: "bg-blue-100 text-blue-600",
  },
  approved: {
    label: "Disetujui",
    className: "bg-green-100 text-green-700",
  },
  rejected: {
    label: "Ditolak",
    className: "bg-red-100 text-red-700",
  },
};

export const RestockIndex = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  const [statusFilter, setStatusFilter] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState("");
  const [warehouseFilter, setwarehouseFilter] = useState("");
  const [produkFilter, setProdukFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [minRequest, setMinRequest] = useState("");
  const [maxRequest, setMaxRequest] = useState("");

  const [pendingStatusFilter, setPendingStatusFilter] = useState("");
  const [pendingKategoriFilter, setPendingKategoriFilter] = useState("");
  const [pendingWarehouseFilter, setPendingWarehouseFilter] = useState("");
  const [pendingProdukFilter, setPendingProdukFilter] = useState("");
  const [pendingDateFrom, setPendingDateFrom] = useState("");
  const [pendingDateTo, setPendingDateTo] = useState("");
  const [pendingMinRequest, setPendingMinRequest] = useState("");
  const [pendingMaxRequest, setPendingMaxRequest] = useState("");

  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const apiClient = useApiClient();
  const isFilterActive = !!(dateTo || minRequest || maxRequest || dateFrom || statusFilter || kategoriFilter || warehouseFilter || produkFilter || statusFilter);

  const kategoriOptions = ["Parfum Siang", "Parfum Malam", "Parfum Sore"];
  const produkOptions = ["Parfum A", "Parfum B", "Parfum C"];
  const warehouseOptions = ["Warehouse A", "Warehouse B"];

  const fetchData = async (params: any = {}) => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      query.append("per_page", "5");
      if (params.page) query.append("page", params.page);
      if (searchQuery) query.append("search", searchQuery);
      if (statusFilter) query.append("status", statusFilter);
      if (warehouseFilter) query.append("warehouse", warehouseFilter);
      if (produkFilter) query.append("produk", produkFilter);
      if (kategoriFilter) query.append("kategori", kategoriFilter);
      if (dateFrom) query.append("date_from", dateFrom);
      if (dateTo) query.append("date_to", dateTo);
      if (minRequest) query.append("min_request", minRequest);
      if (maxRequest) query.append("max_request", maxRequest);

      const res = await apiClient.get(`/stock-request?${query.toString()}`);
      setData(Array.isArray(res.data.data) ? res.data.data : []);
      setPagination(res.data.pagination);
    } catch (err) {
      setData([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [searchQuery]);

  const handleApplyFilter = () => {
    setStatusFilter(pendingStatusFilter);
    setKategoriFilter(pendingKategoriFilter);
    setwarehouseFilter(pendingWarehouseFilter);
    setProdukFilter(pendingProdukFilter);
    setDateFrom(pendingDateFrom);
    setDateTo(pendingDateTo);
    setMinRequest(pendingMinRequest);
    setMaxRequest(pendingMaxRequest);
    fetchData();
  };

  const handlePageChange = (page: string) => {
    fetchData({ page });
  };

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb title="Restock Produk" desc="Menampilkan daftar restock dari gudang" />

      <div className="p-4 flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 mb-4 w-full sm:w-auto max-w-lg">
            <SearchInput value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <div className="relative">
              <Filter onClick={() => setShowFilter(true)} />
              {isFilterActive && (
                <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white" />
              )}
            </div>
          </div>
          <div className="w-full sm:w-auto">
            <AddButton onClick={() => navigate("/restock/create")}>
              Tambah Restock
            </AddButton>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-gray-400 py-10">Loading...</div>
      ) : data.length > 0 ? (
        <>
          {data.map((card: any) => (
            <div key={card.id} className="bg-white shadow-md p-6 rounded-xl flex flex-col md:flex-row gap-6 items-stretch mb-6">
              <div className="flex-1 flex flex-col gap-2 justify-between">
                <div className="border border-gray-200 rounded-xl p-4">
                  {card.requested_stock.slice(0, 2).map((prod: any, idx2: number) => (
                    <div key={idx2} className={`flex flex-col md:flex-row md:items-center md:justify-between py-2 ${idx2 !== 0 ? "border-t border-dashed border-gray-300 mt-2 pt-4" : ""}`}>
                      <div>
                        <div className="font-semibold">Product</div>
                        <div className="text-gray-500 text-sm">{prod.variant_name || `Varian ${idx2 + 1}`}</div>
                      </div>
                      <div className="flex flex-col md:items-end gap-1 mt-2 md:mt-0">
                        <div className="font-semibold text-sm">Varian Dipilih</div>
                        <div className="text-gray-800">123 Varian</div>
                      </div>
                      <div className="flex flex-col md:items-end gap-1 mt-2 md:mt-0">
                        <div className="font-semibold text-sm">Jumlah Request</div>
                        <div className="text-green-600">{prod.requested_stock} Gram</div>
                      </div>
                    </div>
                  ))}
                  <div className="text-center text-gray-400 text-sm mt-4">
                    {card.requested_stock.length > 2 && `+${card.requested_stock.length - 2} Produk Lainnya`}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center min-w-[220px]">
                <img
                  src={ImageHelper(card.warehouse.image)}
                  alt=""
                  className="w-44 h-28 object-cover rounded-lg mb-2"
                />
                <div className="font-semibold text-lg">{card.warehouse?.name}</div>
                <div className="text-green-600 text-sm mb-4">
                  Request pada : {new Date(card.requested_at).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}
                </div>
                <div className="w-full">
                  <button className="bg-blue-600 w-full hover:bg-blue-700 text-white px-5 py-2 rounded-md font-semibold cursor-pointer" onClick={() => navigate(`/restock/${card.id}/details`)}>
                    Detail
                  </button>
                </div>
              </div>
            </div>
          ))}
          {pagination && (
            <div className="flex justify-end mt-4">
              <div className="flex items-center gap-1">
                <button
                  className={`px-3 py-1 rounded border cursor-pointer ${!pagination.prev_page_url ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-blue-50"}`}
                  disabled={!pagination.prev_page_url}
                  onClick={() => {
                    if (pagination.prev_page_url) {
                      const url = new URL(pagination.prev_page_url);
                      const page = url.searchParams.get("page");
                      handlePageChange(page || "1");
                    }
                  }}
                >
                  &laquo;
                </button>
                {pagination.links
                  .filter((l: any) => /^\d+$/.test(l.label))
                  .map((link: any, idx: number) => (
                    <button
                      key={idx}
                      className={`px-3 py-1 rounded border cursor-pointer ${link.active ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-blue-50"}`}
                      disabled={link.active}
                      onClick={() => {
                        if (link.url) {
                          const url = new URL(link.url);
                          const page = url.searchParams.get("page");
                          handlePageChange(page || "1");
                        }
                      }}
                    >
                      {link.label}
                    </button>
                  ))}
                <button
                  className={`px-3 py-1 rounded border cursor-pointer ${!pagination.next_page_url ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-blue-50"}`}
                  disabled={!pagination.next_page_url}
                  onClick={() => {
                    if (pagination.next_page_url) {
                      const url = new URL(pagination.next_page_url);
                      const page = url.searchParams.get("page");
                      handlePageChange(page || "1");
                    }
                  }}
                >
                  &raquo;
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center text-gray-400 py-10">Tidak ada data</div>
      )}

      <FilterModal
        open={showFilter}
        onClose={() => setShowFilter(false)}
        statusFilter={pendingStatusFilter}
        setStatusFilter={setPendingStatusFilter}
        kategoriFilter={pendingKategoriFilter}
        setKategoriFilter={setPendingKategoriFilter}
        warehouseFilter={pendingWarehouseFilter}
        setwarehouseFilter={setPendingWarehouseFilter}
        produkFilter={pendingProdukFilter}
        setProdukFilter={setPendingProdukFilter}
        dateFrom={pendingDateFrom}
        setDateFrom={setPendingDateFrom}
        dateTo={pendingDateTo}
        setDateTo={setPendingDateTo}
        minRequest={pendingMinRequest}
        setMinRequest={setPendingMinRequest}
        maxRequest={pendingMaxRequest}
        setMaxRequest={setPendingMaxRequest}
        produkOptions={produkOptions}
        warehouseOptions={warehouseOptions}
        kategoriOptions={kategoriOptions}
        onApply={handleApplyFilter}
      />
    </div>
  );
};
