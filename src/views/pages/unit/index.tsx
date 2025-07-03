import { useEffect, useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Breadcrumb } from "@/views/components/Breadcrumb";
import { SearchInput } from "@/views/components/SearchInput";
import AddUnitModal from "./widgets/AddPage";
import EditUnitModal from "./widgets/EditPage";
import { useApiClient } from "@/core/helpers/ApiClient";
import Swal from "sweetalert2";
import { format } from "date-fns";
import { Filter } from "@/views/components/Filter";
import { LoadingColumn } from "@/views/components/Loading";

function UnitFilter({ open, onClose, onFilter, initialFilter }) {
  const [dateFrom, setDateFrom] = useState(initialFilter.dateFrom || "");
  const [dateTo, setDateTo] = useState(initialFilter.dateTo || "");
  const [minUser, setMinUser] = useState(initialFilter.minUser || "");
  const [maxUser, setMaxUser] = useState(initialFilter.maxUser || "");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-xl">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Filter Unit</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Dari</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Sampai</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Minimal Jumlah Item</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={minUser}
              onChange={(e) => setMinUser(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Maksimal Jumlah Item</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={maxUser}
              onChange={(e) => setMaxUser(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
            onClick={onClose}
          >
            Batal
          </button>
          <button
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => {
              onFilter({ dateFrom, dateTo, minUser, maxUser });
              onClose();
            }}
          >
            Terapkan
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UnitPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editUnit, setEditUnit] = useState(null);
  const [units, setUnits] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [loading, setLoading] = useState(false);

  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ dateFrom: "", dateTo: "", minUser: "", maxUser: "" });

  const ApiClient = useApiClient();
  const itemsPerPage = 6;

  const fetchUnits = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        per_page: itemsPerPage.toString(),
      });

      if (searchTerm) params.append("search", searchTerm);
      if (filters.dateFrom) params.append("start_date", filters.dateFrom);
      if (filters.dateTo) params.append("end_date", filters.dateTo);
      if (filters.minUser) params.append("min_user", filters.minUser);
      if (filters.maxUser) params.append("max_user", filters.maxUser);

      const { data } = await ApiClient.get(`/unit?${params.toString()}`);

      const mapped = data.data.map((unit) => ({
        id: unit.id,
        name: unit.name,
        code: unit.code,
        itemCount: unit.item_count || 0,
        createdDate: format(new Date(unit.created_at), "dd MMM yyyy"),
      }));

      setUnits(mapped);
      setTotalPages(data.pagination.last_page);
      setTotalData(data.pagination.total);
    } catch (error) {
      console.error("Gagal mengambil data unit", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchUnits();
  }, [currentPage, searchTerm, filters]);

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Yakin ingin menghapus unit ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (!confirm.isConfirmed) return;

    try {
      await ApiClient.delete(`/unit/${id}`);
      fetchUnits();
      Swal.fire("Berhasil!", "Unit berhasil dihapus.", "success");
    } catch (error) {
      Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus unit.", "error");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb title="Data Unit" desc="Halaman ini menampilkan daftar unit yang terdaftar." />

      <div className="bg-white shadow-md rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="flex-1 max-w-md">
                <SearchInput
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Filter onClick={() => setFilterOpen(true)} />
            </div>
            <button
              className="bg-blue-500 text-white px-4 py-2 cursor-pointer rounded-lg flex items-center gap-2 hover:bg-blue-600"
              onClick={() => setModalOpen(true)}
            >
              <Plus className="w-4 h-4" />
              Tambah Unit
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Unit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kode Unit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jumlah Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dibuat Tanggal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500"><LoadingColumn column={3} /></td>
                </tr>
              ) : units.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">Tidak ada data</td>
                </tr>
              ) : (
                units.map((unit, index) => (
                  <tr key={unit.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{(currentPage - 1) * itemsPerPage + index + 1}.</td>
                    <td className="px-6 py-4">{unit.name}</td>
                    <td className="px-6 py-4">{unit.code}</td>
                    <td className="px-6 py-4">{unit.itemCount} Item</td>
                    <td className="px-6 py-4">{unit.createdDate}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditUnit(unit);
                            setEditModalOpen(true);
                          }}
                          className="p-2 bg-orange-500 cursor-pointer text-white rounded-lg hover:bg-orange-600"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(unit.id)}
                          className="p-2 bg-red-500 text-white cursor-pointer rounded-lg hover:bg-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 bg-gray-50 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Menampilkan {(currentPage - 1) * itemsPerPage + 1} dari {totalData} data
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 text-sm border rounded-md ${currentPage === page
                  ? "bg-blue-500 text-white border-blue-500"
                  : "border-gray-300 hover:bg-gray-100"
                  }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <AddUnitModal open={modalOpen} onClose={() => setModalOpen(false)} onSuccess={fetchUnits} />
      <EditUnitModal open={editModalOpen} unit={editUnit} onClose={() => setEditModalOpen(false)} onSuccess={fetchUnits} />
      <UnitFilter
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        onFilter={(f) => {
          setFilters(f);
          setCurrentPage(1);
        }}
        initialFilter={filters}
      />
    </div>
  );
}
