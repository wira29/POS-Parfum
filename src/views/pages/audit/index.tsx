import { useEffect, useState } from "react";
import { Breadcrumb } from "@/views/components/Breadcrumb";
import { SearchInput } from "@/views/components/SearchInput";
import { Pagination } from "@/views/components/Pagination";
import ViewIcon from "@/views/components/ViewIcon";
import DeleteIcon from "@/views/components/DeleteIcon";
import { Filter } from "@/views/components/Filter";
import Swal from "sweetalert2";
import { Toaster } from "@/core/helpers/BaseAlert";
import { InfoIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { RetailRequestModal } from "@/views/components/UpdateStatusModal";
import { useApiClient } from "@/core/helpers/ApiClient";

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
  audit_details: AuditDetail[];
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

const statusMap: Record<AuditItem["status"], string> = {
  approved: "Disetujui",
  pending: "Menunggu",
  rejected: "Ditolak",
};

const filterStatusMap: Record<string, string> = {
  Disetujui: "approved",
  Menunggu: "pending",
  Ditolak: "rejected",
};

const FilterModal = ({
  open,
  onClose,
  statusFilter,
  setStatusFilter,
}: {
  open: boolean;
  onClose: () => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
}) => {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
    >
      <div className="bg-white rounded-lg shadow-lg p-6 min-w-[300px]">
        <div className="font-semibold text-lg mb-4">Filter Audit</div>
        <div className="mb-4">
          <label className="block mb-1 text-sm">Status Audit</label>
          <select
            className="border rounded px-2 py-1 w-full"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Semua Status</option>
            <option value="Disetujui">Disetujui</option>
            <option value="Menunggu">Menunggu</option>
            <option value="Ditolak">Ditolak</option>
          </select>
        </div>
        <div className="flex justify-end gap-2">
          <button
            className="px-3 py-1 rounded border border-gray-300"
            onClick={onClose}
          >
            Tutup
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
  const [statusFilter, setStatusFilter] = useState("");
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
      const response = await apiClient.get<ApiResponse>("/audit", {
        params: {
          page: currentPage,
          search: searchQuery || undefined,
          status: statusFilter ? filterStatusMap[statusFilter] : undefined,
        },
      });
      setAuditData(response.data.data);
      setPagination(response.data.pagination);
    } catch (err) {
      setError("Gagal mengambil data audit. Silakan coba lagi.");
      Toaster("error", "Gagal mengambil data audit");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [currentPage, searchQuery, statusFilter]);

  const handleDelete = async (id: string) => {
    Swal.fire({
      title: "Apakah anda yakin?",
      text: "Data Audit akan dihapus!",
      icon: "question",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await apiClient.delete(`audit/${id}`);
          Toaster("success", "Audit berhasil dihapus");
          getData();
        } catch (err) {
          Toaster("error", "Gagal menghapus audit");
        }
      }
    });
  };

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb
        title="Audit"
        desc="Lorem ipsum dolor sit amet, consectetur adipiscing."
      />
      <div className="bg-white shadow-md p-4 rounded-md flex flex-col gap-6">
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
        </div>
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
                      {item.audit_details.length} Variant
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
                        <DeleteIcon onClick={() => handleDelete(item.id)} />
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
        statusFilter={statusFilter}
        setStatusFilter={(val) => {
          setStatusFilter(val);
          setShowFilter(false);
          setCurrentPage(1);
        }}
      />
      <RetailRequestModal
        isOpen={isModalOpen}
        auditId={selectedAuditId}
        description={{
          descriptionApproved: `Anda Menerima Audit ID ${
            selectedAuditId || ""
          }.`,
          descriptionRejected: `Anda Menolak Audit ID ${
            selectedAuditId || ""
          }, sehingga audit tidak diproses.`,
        }}
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
