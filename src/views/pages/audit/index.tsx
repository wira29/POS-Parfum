import { useApiClient } from "@/core/helpers/ApiClient";
import { Toaster } from "@/core/helpers/BaseAlert";
import { IsRole } from "@/core/middlewares/is-role";
import { Breadcrumb } from "@/views/components/Breadcrumb";
import DeleteIcon from "@/views/components/DeleteIcon";
import { Filter } from "@/views/components/Filter";
import { Pagination } from "@/views/components/Pagination";
import { SearchInput } from "@/views/components/SearchInput";
import { RetailRequestModal } from "@/views/components/UpdateStatusModal";
import ViewIcon from "@/views/components/ViewIcon";
import { InfoIcon, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

interface AuditDetail {
  id: string;
  audit_id: string;
  product_detail_id: string;
  old_stock: number;
  audit_stock: number;
  unit_id: string;
  deleted_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

interface AuditItem {
  id: string;
  user_id: string;
  name: string;
  description: string;
  status: "approved" | "rejected" | "pending";
  reason: string | null;
  store_id: string;
  date: string;
  outlet_id: string;
  deleted_at: string | null;
  created_at: string | null;
  audit_detail: AuditDetail[];
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: AuditItem[];
  pagination: {
    current_page: number;
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    links: { url: string | null; label: string; active: boolean }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
  };
}

interface FilterState {
  namaAudit: string;
  status: string;
  minVarian: string;
  maxVarian: string;
  dariTanggal: string;
  hinggaTanggal: string;
}

const statusMap: Record<AuditItem["status"], string> = {
  approved: "Disetujui",
  pending: "Menunggu",
  rejected: "Ditolak",
};

const statusOptions = [
  { value: "approved", label: "Disetujui" },
  { value: "pending", label: "Menunggu" },
  { value: "rejected", label: "Ditolak" },
];

const FilterModal = ({
  open,
  onClose,
  filters,
  setFilters,
  onApplyFilter,
  onResetFilter,
  auditData,
}: {
  open: boolean;
  onClose: () => void;
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  onApplyFilter: () => void;
  onResetFilter: () => void;
  auditData: AuditItem[];
}) => {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);
  const [namaAuditDropdown, setNamaAuditDropdown] = useState(false);
  const [statusDropdown, setStatusDropdown] = useState(false);
  const [namaAuditSearch, setNamaAuditSearch] = useState("");

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.dropdown-container')) {
        setNamaAuditDropdown(false);
        setStatusDropdown(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const auditNames = [...new Set(auditData.map((item) => item.name))].filter(
    (name) => name.toLowerCase().includes(namaAuditSearch.toLowerCase())
  );

  if (!open) return null;

  const handleReset = () => {
    const resetFilters: FilterState = {
      namaAudit: "",
      status: "",
      minVarian: "",
      maxVarian: "",
      dariTanggal: "",
      hinggaTanggal: "",
    };
    setLocalFilters(resetFilters);
    setNamaAuditSearch("");
    onResetFilter();
    onClose();
  };

  const handleApply = () => {
    setFilters(localFilters);
    onApplyFilter();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="font-semibold text-lg mb-6 text-gray-800">
          Filter Data
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Nama Audit
          </label>
          <div className="relative dropdown-container">
            <div
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer bg-white flex items-center justify-between"
              onClick={(e) => {
                e.stopPropagation();
                setNamaAuditDropdown(!namaAuditDropdown);
              }}
            >
              <div className="flex items-center">
                <Search className="mr-2 text-gray-400" size={16} />
                <span
                  className={
                    localFilters.namaAudit ? "text-gray-900" : "text-gray-400"
                  }
                >
                  {localFilters.namaAudit || "Ketik atau pilih..."}
                </span>
              </div>
              <svg
                className={`w-4 h-4 transform transition-transform ${
                  namaAuditDropdown ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            {namaAuditDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                <div className="p-2">
                  <input
                    type="text"
                    placeholder="Cari nama audit..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={namaAuditSearch}
                    onChange={(e) => setNamaAuditSearch(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <div className="max-h-40 overflow-y-auto">
                  <div
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setLocalFilters({ ...localFilters, namaAudit: "" });
                      setNamaAuditDropdown(false);
                      setNamaAuditSearch("");
                    }}
                  >
                    <span className="text-gray-400">Semua Nama Audit</span>
                  </div>
                  {auditNames.map((name, index) => (
                    <div
                      key={index}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setLocalFilters({ ...localFilters, namaAudit: name });
                        setNamaAuditDropdown(false);
                        setNamaAuditSearch("");
                      }}
                    >
                      {name}
                    </div>
                  ))}
                  {auditNames.length === 0 && namaAuditSearch && (
                    <div className="px-3 py-2 text-gray-400">
                      Tidak ada hasil ditemukan
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Status
          </label>
          <div className="relative dropdown-container">
            <div
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer bg-white flex items-center justify-between"
              onClick={(e) => {
                e.stopPropagation();
                setStatusDropdown(!statusDropdown);
              }}
            >
              <span
                className={
                  localFilters.status ? "text-gray-900" : "text-gray-400"
                }
              >
                {localFilters.status
                  ? statusOptions.find(
                      (opt) => opt.value === localFilters.status
                    )?.label
                  : "Pilih status..."}
              </span>
              <svg
                className={`w-4 h-4 transform transition-transform ${
                  statusDropdown ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            {statusDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                <div
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setLocalFilters({ ...localFilters, status: "" });
                    setStatusDropdown(false);
                  }}
                >
                  <span className="text-gray-400">Semua Status</span>
                </div>
                {statusOptions.map((option) => (
                  <div
                    key={option.value}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setLocalFilters({
                        ...localFilters,
                        status: option.value,
                      });
                      setStatusDropdown(false);
                    }}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Minimum Jumlah Varian
            </label>
            <input
              type="number"
              placeholder="Ketikkan jumlah"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={localFilters.minVarian}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, minVarian: e.target.value })
              }
              min="0"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Maksimum Jumlah Varian
            </label>
            <input
              type="number"
              placeholder="Ketikkan jumlah"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={localFilters.maxVarian}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, maxVarian: e.target.value })
              }
              min="0"
            />
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Dari Tanggal
            </label>
            <div className="relative">
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={localFilters.dariTanggal}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    dariTanggal: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Hingga Tanggal
            </label>
            <div className="relative">
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={localFilters.hinggaTanggal}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    hinggaTanggal: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 cursor-pointer border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 outline-none transition-colors"
            onClick={handleReset}
          >
            Reset
          </button>
          <button
            className="px-4 py-2 cursor-pointer border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 outline-none transition-colors"
            onClick={onClose}
          >
            Batal
          </button>
          <button
            className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 outline-none transition-colors"
            onClick={handleApply}
          >
            Terapkan
          </button>
        </div>
      </div>
    </div>
  );
};

export const AuditIndex = () => {
  const apiClient = useApiClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    namaAudit: "",
    status: "",
    minVarian: "",
    maxVarian: "",
    dariTanggal: "",
    hinggaTanggal: "",
  });
  const [auditData, setAuditData] = useState<AuditItem[]>([]);
  const [selectedAuditId, setSelectedAuditId] = useState<string | undefined>(
    undefined
  );
  const [pagination, setPagination] = useState<ApiResponse["pagination"]>({
    current_page: 1,
    first_page_url: "",
    from: null,
    last_page: 1,
    last_page_url: "",
    links: [],
    next_page_url: null,
    path: "",
    per_page: 8,
    prev_page_url: null,
    to: null,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getData = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, any> = {
        page: currentPage,
      };

      if (searchQuery && searchQuery.trim() !== "") {
        params.search = searchQuery.trim();
      }

      if (filters.namaAudit && filters.namaAudit.trim() !== "") {
        params.name = filters.namaAudit.trim();
      }
      if (filters.status && filters.status.trim() !== "") {
        params.status = filters.status.trim();
      }
      if (filters.minVarian && filters.minVarian.trim() !== "") {
        const minVarianNum = parseInt(filters.minVarian.trim());
        if (!isNaN(minVarianNum)) {
          params.min_variants = minVarianNum;
        }
      }
      if (filters.maxVarian && filters.maxVarian.trim() !== "") {
        const maxVarianNum = parseInt(filters.maxVarian.trim());
        if (!isNaN(maxVarianNum)) {
          params.max_variants = maxVarianNum;
        }
      }
      if (filters.dariTanggal && filters.dariTanggal.trim() !== "") {
        params.date_from = filters.dariTanggal.trim();
      }
      if (filters.hinggaTanggal && filters.hinggaTanggal.trim() !== "") {
        params.date_to = filters.hinggaTanggal.trim();
      }

      const response = await apiClient.get<ApiResponse>("/audit", {
        params,
      });
      
      if (response.data && response.data.data) {
        setAuditData(response.data.data);
        setPagination(response.data.pagination);
      } else {
        setAuditData([]);
      }
    } catch (err) {
      console.error("Error fetching audit data:", err);
      setError("Gagal mengambil data audit. Silakan coba lagi.");
      setAuditData([]);
      Toaster("error", "Gagal mengambil data audit");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [currentPage]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentPage === 1) {
        getData();
      } else {
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    if (currentPage === 1) {
      getData();
    } else {
      setCurrentPage(1);
    }
  }, [filters]);

  const handleDelete = async (id: string) => {
    Swal.fire({
      title: "Apakah anda yakin?",
      text: "Data Audit akan dihapus!",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await apiClient.delete(`audit/${id}`);
          Toaster("success", "Audit berhasil dihapus");
          getData();
        } catch (err) {
          console.error("Error deleting audit:", err);
          Toaster("error", "Gagal menghapus audit");
        }
      }
    });
  };

  const handleApplyFilter = () => {
    setCurrentPage(1);
  };

  const handleResetFilter = () => {
    setFilters({
      namaAudit: "",
      status: "",
      minVarian: "",
      maxVarian: "",
      dariTanggal: "",
      hinggaTanggal: "",
    });
    setCurrentPage(1);
  };

  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb
        title="Audit"
        desc="Lorem ipsum dolor sit amet, consectetur adipiscing."
      />
      <div className="bg-white shadow-md p-4 rounded-md flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 mb-4 w-full sm:w-auto max-w-lg relative">
            <SearchInput
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
            />
            <div className="relative">
              <Filter onClick={() => setShowFilter(true)} />
              {hasActiveFilters && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              )}
            </div>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 p-3 bg-blue-50 rounded-md">
            <span className="text-sm text-gray-600 font-medium">
              Filter aktif:
            </span>
            {filters.namaAudit && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                Nama: {filters.namaAudit}
              </span>
            )}
            {filters.status && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                Status:{" "}
                {statusOptions.find((opt) => opt.value === filters.status)?.label}
              </span>
            )}
            {filters.minVarian && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                Min Varian: {filters.minVarian}
              </span>
            )}
            {filters.maxVarian && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                Max Varian: {filters.maxVarian}
              </span>
            )}
            {filters.dariTanggal && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                Dari: {filters.dariTanggal}
              </span>
            )}
            {filters.hinggaTanggal && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                Hingga: {filters.hinggaTanggal}
              </span>
            )}
          </div>
        )}

        {error && <div className="text-red-500 text-center">{error}</div>}
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full border border-gray-300 rounded-lg text-sm text-left">
            <thead className="bg-gray-100 border border-gray-300 text-gray-700">
              <tr>
                <th className="px-6 py-4 font-medium">Nama Audit</th>
                <th className="px-6 py-4 font-medium">Tanggal Audit</th>
                <th className="px-6 py-4 font-medium">Produk Variant</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Memuat data...
                  </td>
                </tr>
              ) : auditData.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Tidak ada data ditemukan.
                  </td>
                </tr>
              ) : (
                auditData.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">{item.name}</td>
                    <td className="px-6 py-4">{item.date}</td>
                    <td className="px-6 py-4">
                      {item.audit_detail?.length ?? "Tidak ada"} Variant
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-4 py-2 rounded-lg text-xs font-medium ${
                          item.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : item.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {statusMap[item.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <ViewIcon to={`/audit/${item.id}/detail`} />
                        <IsRole role={["warehouse", "outlet"]}>
                          {item.status === "pending" && (
                          <Link
                            to="#"
                            onClick={() => {
                              setSelectedAuditId(item.id);
                              setIsModalOpen(true);
                            }}
                            className="bg-yellow-500 p-1 rounded text-white flex items-center gap-1"
                          >
                            <InfoIcon size={20} />
                          </Link>
                        )}
                        {item.status === "pending" && (
                          <DeleteIcon onClick={() => handleDelete(item.id)} />
                        )}
                        </IsRole>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 text-sm text-muted-foreground">
          <span className="text-gray-700">{pagination.total} Data</span>
          <Pagination
            currentPage={pagination.current_page}
            totalPages={pagination.last_page}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
      <FilterModal
        open={showFilter}
        onClose={() => setShowFilter(false)}
        filters={filters}
        setFilters={setFilters}
        onApplyFilter={handleApplyFilter}
        onResetFilter={handleResetFilter}
        auditData={auditData}
      />
      <RetailRequestModal
        isOpen={isModalOpen}
        auditId={selectedAuditId}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAuditId(undefined);
        }}
        onSubmit={() => {
          setIsModalOpen(false);
          setSelectedAuditId(undefined);
          getData();
        }}
      />
    </div>
  );
};