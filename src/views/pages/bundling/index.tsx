import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiMoreVertical } from "react-icons/fi";
import { Breadcrumb } from "@/views/components/Breadcrumb";
import { SearchInput } from "@/views/components/SearchInput";
import { Filter } from "@/views/components/Filter";
import { useApiClient } from "@/core/helpers/ApiClient";
import { Eye, LogOut, Pencil, Trash, X } from "lucide-react";
import { ImageHelper } from "@/core/helpers/ImageHelper";
import Swal from "sweetalert2";

const BundlingFilterModal = ({
  open,
  onClose,
  selectedStatus,
  setSelectedStatus,
  availableStatuses,
}: any) => {
  if (!open) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={handleBackdropClick}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Filter Bundling</h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-6 h-6 cursor-pointer" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Status</option>
              {availableStatuses.map((status: string, i: number) => (
                <option key={i} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2 p-4 border-t border-gray-200">
          <button
            onClick={() => {
              setSelectedStatus("");
              onClose();
            }}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Reset
          </button>
          <button onClick={onClose} className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg">
            Terapkan
          </button>
        </div>
      </div>
    </div>
  );
};

type BundlingMaterial = {
  product_detail_id: string;
  image: string | null;
};

type BundlingPackage = {
  id: string;
  name: string;
  kode_Bundling: string;
  harga: number;
  stock: number;
  status: string;
  category: string;
  bundling_material_count: number;
  bundling_material: BundlingMaterial[];
};

export default function BundlingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpenId, setDropdownOpenId] = useState<string | null>(null);
  const [packages, setPackages] = useState<BundlingPackage[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });

  const [showFilter, setShowFilter] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const apiClient = useApiClient();

  useEffect(() => {
    fetchBundling();
  }, [pagination.current_page, selectedStatus, searchQuery]);

  const fetchBundling = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        per_page: "5",
        page: pagination.current_page.toString(),
        status: selectedStatus,
        search: searchQuery,
      });
      const res = await apiClient.get(`/product-bundling?${params.toString()}`);
      setPackages(res.data.data);
      setPagination((prev) => ({
        ...prev,
        current_page: res.data.pagination.current_page,
        last_page: res.data.pagination.last_page,
        total: res.data.pagination.total,
      }));
    } catch (error) {
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredPackages = packages.filter((pkg) => {
    const matchSearch = `${pkg.name} ${pkg.kode_Bundling}`.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = selectedStatus ? pkg.status === selectedStatus : true;
    return matchSearch && matchStatus;
  });

  const handleDropdownToggle = (id: string) => {
    setDropdownOpenId(dropdownOpenId === id ? null : id);
  };

  const handleDetail = (pkg: BundlingPackage) => {
    navigate(`/bundlings/${pkg.id}/detail`);
    setDropdownOpenId(null);
  };

  const handleEdit = (pkg: BundlingPackage) => {
    navigate(`/bundlings/${pkg.id}/edit`);
    setDropdownOpenId(null);
  };

  const handleDelete = async (pkg: BundlingPackage) => {
    Swal.fire({
      title: "Apakah anda yakin?",
      text: `Bundling "${pkg.name}" akan dihapus!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await apiClient.delete(`/product-bundling/${pkg.id}`);
          Swal.fire("Terhapus!", "Bundling berhasil dihapus.", "success");
          fetchBundling();
        } catch (error) {
          Swal.fire("Gagal!", "Gagal menghapus bundling.", "error");
        }
        setDropdownOpenId(null);
      }
    });
  };

  const handleCancel = (pkg: BundlingPackage) => {
    setDropdownOpenId(null);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpenId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatPrice = (price: number) => {
    return `Rp ${price.toLocaleString("id-ID")}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Tersedia":
      case "active":
        return "bg-green-100 text-green-800";
      case "Habis":
      case "non-active":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const goToPage = (page: number) => {
    setPagination((prev) => ({ ...prev, current_page: page }));
  };

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb
        title="Bundling"
        desc="Data Bundling Produk"
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div className="flex items-center gap-2 w-full sm:w-auto max-w-lg">
          <SearchInput value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          <Filter onClick={() => setShowFilter(true)} />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 px-4 py-2 rounded-lg font-medium"
            onClick={() => navigate("/bundlings/create")}
          >
            <FiPlus /> Tambah Bundling
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-gray-600">Memuat data bundling...</div>
      ) : filteredPackages.length === 0 ? (
        <div className="text-gray-500">Tidak ada paket bundling ditemukan.</div>
      ) : (
        <>
          <div className="space-y-3">
            {filteredPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-10">
                    <div className="w-20 flex -space-x-4">
                      {(pkg.bundling_material || []).slice(0, 3).map((mat, idx) => (
                        <img
                          key={idx}
                          src={ImageHelper(mat.image)}
                          alt={pkg.name + " " + (idx + 1)}
                          className="w-10 h-10 rounded-full border-2 border-white object-cover bg-gray-200"
                          style={{ zIndex: 10 - idx }}
                          onClick={() => handleDetail(pkg)}
                          onError={e => (e.currentTarget.src = "/images/placeholder.jpg")}
                        />
                      ))}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{pkg.name}</h3>
                      <p className="text-sm text-gray-500">Kode bundling</p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          #{pkg.kode_Bundling}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-25">
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">Stok</p>
                      <p className="text-sm text-gray-600">{pkg.stock} Pcs</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">Jumlah Item</p>
                      <p className="text-sm text-gray-600">{pkg.bundling_material_count} Item</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">Harga</p>
                      <p className="text-sm text-gray-600">{formatPrice(pkg.harga)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">Status</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(pkg.status)}`}>
                        {pkg.status === "active" ? "Tersedia" : pkg.status === "non-active" ? "Habis" : pkg.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative" ref={dropdownOpenId === pkg.id ? dropdownRef : null}>
                      <button
                        className="p-1 rounded-full hover:bg-gray-100"
                        onClick={() => handleDropdownToggle(pkg.id)}
                      >
                        <FiMoreVertical size={20} className="text-gray-600" />
                      </button>
                      {dropdownOpenId === pkg.id && (
                        <div className="absolute right-0 top-8 w-40 bg-white border border-gray-300 rounded-lg shadow-lg z-20 py-1">
                          <button
                            className="w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-gray-100 text-sm hover:font-semibold"
                            onClick={() => handleDetail(pkg)}
                          >
                            <Eye size={16} />Detail
                          </button>
                          <button
                            className="w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-gray-100 text-sm hover:font-semibold"
                            onClick={() => handleEdit(pkg)}
                          >
                            <Pencil size={16} />Edit
                          </button>
                          <button
                            className="w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-gray-100 text-sm text-red-600 hover:font-semibold"
                            onClick={() => handleDelete(pkg)}
                          >
                            <Trash size={16} />Hapus
                          </button>
                          <hr className="my-1 border-gray-300" />
                          <button
                            className="w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-gray-100 text-sm text-red-600 hover:font-semibold"
                            onClick={() => handleCancel(pkg)}
                          >
                            <LogOut size={16} />Batalkan
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-600">
              Menampilkan {packages.length} dari {pagination.total} Bundling
            </p>
            <div className="flex gap-2">
              <button
                className="px-3 py-1 border rounded text-sm hover:bg-gray-100 text-gray-700"
                onClick={() => goToPage(Math.max(1, pagination.current_page - 1))}
                disabled={pagination.current_page === 1}
              >
                Previous
              </button>
              {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`px-3 py-1 border rounded text-sm ${
                    pagination.current_page === page
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                className="px-3 py-1 border rounded text-sm hover:bg-gray-100 text-gray-700"
                onClick={() => goToPage(Math.min(pagination.last_page, pagination.current_page + 1))}
                disabled={pagination.current_page === pagination.last_page}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      <BundlingFilterModal
        open={showFilter}
        onClose={() => setShowFilter(false)}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        availableStatuses={["Tersedia", "Habis"]}
      />
    </div>
  );
}