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
import { LoadingCards } from "@/views/components/Loading";

const BundlingFilterModal = ({
  open,
  onClose,
  filterValues,
  setFilterValues,
  onApply,
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
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Harga</label>
              <input
                type="number"
                value={filterValues.minPrice}
                onChange={(e) => setFilterValues((prev: any) => ({ ...prev, minPrice: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Min Harga"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Harga</label>
              <input
                type="number"
                value={filterValues.maxPrice}
                onChange={(e) => setFilterValues((prev: any) => ({ ...prev, maxPrice: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Max Harga"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Jumlah Material</label>
              <input
                type="number"
                value={filterValues.minMaterial}
                onChange={(e) => setFilterValues((prev: any) => ({ ...prev, minMaterial: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Min Material"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Jumlah Material</label>
              <input
                type="number"
                value={filterValues.maxMaterial}
                onChange={(e) => setFilterValues((prev: any) => ({ ...prev, maxMaterial: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Max Material"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 p-4 border-t border-gray-200">
          <button
            onClick={() => {
              setFilterValues({
                status: "",
                minStock: "",
                maxStock: "",
                minPrice: "",
                maxPrice: "",
                minMaterial: "",
                maxMaterial: "",
              });
              onApply();
              onClose();
            }}
            className="px-4 py-2 text-gray-700 border cursor-pointer border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Reset
          </button>
          <button
            onClick={() => {
              onApply();
              onClose();
            }}
            className="px-4 py-2 text-white cursor-pointer bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
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
  const [filterValues, setFilterValues] = useState({
    status: "",
    minStock: "",
    maxStock: "",
    minPrice: "",
    maxPrice: "",
    minMaterial: "",
    maxMaterial: "",
  });
  const [appliedFilter, setAppliedFilter] = useState({
    status: "",
    minStock: "",
    maxStock: "",
    minPrice: "",
    maxPrice: "",
    minMaterial: "",
    maxMaterial: "",
  });

  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const apiClient = useApiClient();

  useEffect(() => {
    fetchBundling();
  }, [
    pagination.current_page,
    appliedFilter.status,
    appliedFilter.minStock,
    appliedFilter.maxStock,
    appliedFilter.minPrice,
    appliedFilter.maxPrice,
    appliedFilter.minMaterial,
    appliedFilter.maxMaterial,
    searchQuery,
  ]);

  const fetchBundling = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        per_page: "8",
        page: pagination.current_page.toString(),
      });
      if (appliedFilter.minPrice) params.append("min_price", appliedFilter.minPrice);
      if (appliedFilter.maxPrice) params.append("max_price", appliedFilter.maxPrice);
      if (appliedFilter.minMaterial) params.append("min_material", appliedFilter.minMaterial);
      if (appliedFilter.maxMaterial) params.append("max_material", appliedFilter.maxMaterial);
      if (searchQuery) params.append("search", searchQuery);

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

  const filteredPackages = packages;

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

  const handleApplyFilter = () => {
    setPagination((prev) => ({ ...prev, current_page: 1 }));
    setAppliedFilter({ ...filterValues });
  };
console.log(packages);

  const isFilterActive = Object.values(appliedFilter).some((v) => v && v !== "");

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb
        title="Bundling"
        desc="Data Bundling Produk"
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div className="flex items-center gap-2 w-full sm:w-auto max-w-lg">
          <SearchInput
            value={searchQuery}
            onChange={(val) => {
              setSearchQuery(val);
            }}
          />
          <div className="relative">
            <Filter onClick={() => setShowFilter(true)} />
            {isFilterActive && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 px-4 py-2 rounded-lg font-medium cursor-pointer"
            onClick={() => navigate("/bundlings/create")}
          >
            <FiPlus /> Tambah Bundling
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingCards />
      ) : filteredPackages.length === 0 ? (
        <div className="text-gray-500">Tidak ada paket bundling ditemukan.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white rounded-xl shadow-md p-4 relative"
              >
                <div className="absolute top-3 right-3" ref={dropdownOpenId === pkg.id ? dropdownRef : null}>
                  <button
                    className="p-1 rounded-full cursor-pointer hover:bg-gray-100"
                    onClick={() => handleDropdownToggle(pkg.id)}
                  >
                    <FiMoreVertical size={18} className="text-gray-600" />
                  </button>
                  {dropdownOpenId === pkg.id && (
                    <div className="absolute right-0 top-8 w-40 bg-white border border-gray-300 rounded-lg shadow-lg z-20 py-1">
                      <button
                        className="w-full cursor-pointer text-left px-4 py-2 flex items-center gap-2 hover:bg-gray-100 text-sm"
                        onClick={() => handleDetail(pkg)}
                      >
                        <Eye size={16} /> Detail
                      </button>
                      <button
                        className="w-full cursor-pointer text-left px-4 py-2 flex items-center gap-2 hover:bg-gray-100 text-sm"
                        onClick={() => handleEdit(pkg)}
                      >
                        <Pencil size={16} /> Edit
                      </button>
                      <button
                        className="w-full cursor-pointer text-left px-4 py-2 flex items-center gap-2 text-red-600 hover:bg-gray-100 text-sm"
                        onClick={() => handleDelete(pkg)}
                      >
                        <Trash size={16} /> Hapus
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex justify-center mb-4 -space-x-3">
                  {(pkg.bundling_material || []).slice(0, 3).map((mat, idx) => (
                    <img
                      key={idx}
                      src={ImageHelper(mat.image)}
                      alt={pkg.name + " " + (idx + 1)}
                      className="w-16 h-16 rounded-full border-2 border-white object-cover bg-gray-200"
                      onClick={() => handleDetail(pkg)}
                    />
                  ))}
                </div>

                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-900 truncate">{pkg.name}</h3>
                  <p className="text-xs text-gray-500">#{pkg.kode_Bundling}</p>
                </div>

                <div className="mt-14 space-y-1 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Quantity Item:</span>
                    <span className="font-semibold text-gray-400">{pkg.bundling_material_count} Item</span>
                  </div>
                  <div className="flex justify-between mt-5">
                    <span className="font-medium text-gray-600">Harga:</span>
                    <span className="font-semibold text-gray-400">{formatPrice(pkg.harga)}</span>
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
                  className={`px-3 py-1 border rounded text-sm ${pagination.current_page === page
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
        filterValues={filterValues}
        setFilterValues={setFilterValues}
        onApply={handleApplyFilter}
      />
    </div>
  );
}