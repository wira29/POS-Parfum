import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Breadcrumb } from "@/views/components/Breadcrumb";
import { SearchInput } from "@/views/components/SearchInput";
import AddButton from "@/views/components/AddButton";
import { Users } from "lucide-react";
import { useApiClient } from "@/core/helpers/ApiClient";
import Swal from "sweetalert2";

function RoleFormModal({ open, onClose, onSubmit, initialData, loading }) {
  const [name, setName] = useState("");
  const [guardName, setGuardName] = useState("web");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setGuardName(initialData.guard_name || "web");
    } else {
      setName("");
      setGuardName("web");
    }
  }, [initialData, open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(
      { name, guard_name: guardName },
      onClose
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <form
        className="bg-white rounded-xl shadow-lg w-full max-w-[400px]"
        onSubmit={handleSubmit}
      >
        <div className="px-6 pt-6 pb-3">
          <h2 className="text-lg font-bold text-gray-900">
            {initialData ? "Edit Role" : "Tambah Role"}
          </h2>
        </div>
        <div className="border-b border-gray-200"></div>
        <div className="px-6 py-4">
          <div className="mb-4">
            <label className="block text-sm text-gray-700 mb-1">Nama Role</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-non e focus:ring-2 focus:ring-blue-200"
              placeholder="Nama role"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-700 mb-1">Guard Name</label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
              value={guardName}
              onChange={e => setGuardName(e.target.value)}
            >
              <option value="web">web</option>
              <option value="api">api</option>
            </select>
          </div>
        </div>
        <div className="border-b border-gray-200"></div>
        <div className="flex items-center justify-between px-6 py-4">
          <button
            type="button"
            className="px-4 py-2 rounded border border-gray-300 bg-gray-100 text-gray-700 font-medium hover:bg-gray-200"
            onClick={onClose}
            disabled={loading}
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700"
            disabled={loading}
          >
            {initialData ? "Simpan Perubahan" : "Tambah"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Pagination({ currentPage, lastPage, onPageChange }) {
  return (
    <div className="flex items-center gap-2">
      <button
        className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      {Array.from({ length: lastPage }, (_, i) => (
        <button
          key={i + 1}
          className={`px-3 py-2 text-sm rounded ${currentPage === i + 1
            ? "bg-blue-500 text-white"
            : "text-gray-700 hover:text-gray-900"
            }`}
          onClick={() => onPageChange(i + 1)}
        >
          {i + 1}
        </button>
      ))}
      <button
        className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === lastPage}
      >
        Next
      </button>
    </div>
  );
}

export default function RolePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalInitialData, setModalInitialData] = useState(null);
  const [roles, setRoles] = useState([]);
  const apiClient = useApiClient();
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [restoringId, setRestoringId] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    per_page: 5,
    current_page: 1,
    last_page: 1,
    from: 1,
    to: 5,
  });

  useEffect(() => {
    fetchRoles(pagination.current_page);
  }, [pagination.current_page]);

  const fetchRoles = async (page = 1) => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/roles?page=${page}`);
      setRoles(res.data?.data || []);
      setPagination(res.data?.pagination || pagination);
    } catch (e) {
      setRoles([]);
    }
    setLoading(false);
  };

  const handleAddRole = async (values, closeModal) => {
    setModalLoading(true);
    try {
      const res = await apiClient.post("/roles", values);
      fetchRoles(pagination.current_page);
      Swal.fire("Berhasil", "Role berhasil ditambahkan.", "success");
      closeModal();
    } catch (e) {
      Swal.fire("Gagal", "Gagal menambah role.", "error");
    }
    setModalLoading(false);
  };

  const handleEditRole = async (id, values, closeModal) => {
    setModalLoading(true);
    try {
      const res = await apiClient.put(`/roles/${id}`, values);
      fetchRoles(pagination.current_page);
      Swal.fire("Berhasil", "Role berhasil diubah.", "success");
      closeModal();
    } catch (e) {
      Swal.fire("Gagal", "Gagal mengedit role.", "error");
    }
    setModalLoading(false);
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await apiClient.delete(`/roles/${id}`);
      fetchRoles(pagination.current_page);
      Swal.fire("Berhasil", "Berhasil Menonaktifkan role.", "success");
    } catch (e) {
      Swal.fire("Gagal", "Gagal menghapus role.", "error");
    }
    setDeletingId(null);
  };

  const handleRestore = async (id) => {
    setRestoringId(id);
    try {
      await apiClient.post(`/roles/${id}/restore`);
      fetchRoles(pagination.current_page);
      Swal.fire("Berhasil", "Berhasil mengembalikan role.", "success");
    } catch (e) {
      Swal.fire("Gagal", "Gagal mengembalikan role.", "error");
    }
    setRestoringId(null);
  };

  const confirmDelete = (id) => {
    Swal.fire({
      title: "Apakah anda yakin?",
      text: "Role akan dihapus!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(id);
      }
    });
  };

  const confirmRestore = (id) => {
    Swal.fire({
      title: "Apakah anda yakin?",
      text: "Role akan dikembalikan!",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, kembalikan!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        handleRestore(id);
      }
    });
  };

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status) => {
    if (status === "Aktif" || status === "Active") {
      return <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">Aktif</span>;
    }
    return <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">Nonaktif</span>;
  };

  const getActionButtons = (role) => {
    if (role.status === "Nonaktif" || role.deleted_at) {
      return (
        <button
          className="bg-green-500 text-white px-4 py-1 rounded text-xs font-medium hover:bg-green-200 transition-colors"
          onClick={() => confirmRestore(role.id)}
          disabled={restoringId === role.id}
        >
          {restoringId === role.id ? "Mengembalikan..." : "Restore"}
        </button>
      );
    }
    return (
      <div className="flex gap-2">
        <button
          onClick={() => {
            setModalInitialData(role);
            setModalOpen(true);
          }}
          className="bg-orange-500 text-white px-4 py-1 rounded text-xs font-medium hover:bg-orange-200 transition-colors"
        >
          Edit
        </button>
        <button
          className="bg-red-500 text-white px-4 py-1 rounded text-xs font-medium transition-colors"
          onClick={() => confirmDelete(role.id)}
          disabled={deletingId === role.id}
        >
          {deletingId === role.id ? "Menghapus..." : "Hapus"}
        </button>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb
        title="Daftar Role"
        desc="Kelola role yang ada di sistem Anda."
      />

      <RoleFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setModalInitialData(null);
        }}
        onSubmit={(values, closeModal) => {
          if (modalInitialData) {
            handleEditRole(modalInitialData.id, values, closeModal);
          } else {
            handleAddRole(values, closeModal);
          }
        }}
        initialData={modalInitialData}
        loading={modalLoading}
      />

      <div>
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="flex-1 max-w-md">
                <SearchInput
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <AddButton
              onClick={() => {
                setModalInitialData(null);
                setModalOpen(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Tambah Role
            </AddButton>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {loading ? (
            <div className="text-center text-gray-500">Memuat data...</div>
          ) : filteredRoles.length === 0 ? (
            <div className="text-center text-gray-500">Tidak ada data role.</div>
          ) : filteredRoles.map((role) => (
            <div key={role.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-gray-900">{role.name}</h3>
                  <div className="flex items-center gap-1 bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs">
                    <Users className="w-3 h-3" />
                    {role.users_count} User
                  </div>
                </div>
                <button
                  className="bg-blue-500 text-white px-4 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                  onClick={() => navigate(`/roles/${role.id}/Detail`)}
                >
                  Detail
                </button>
              </div>

              <div className="border-b border-gray-200 my-4"></div>
              <div className="flex flex-wrap items-center justify-between mb-4">
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                  <span>Guard name: <span className="text-gray-900">{role.guard_name}</span></span>
                  <span>Tanggal Dibuat: <span className="text-gray-900">{role.created_at ? new Date(role.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" }) : "-"}</span></span>
                  <span>Status: {getStatusBadge(role.status)}</span>
                </div>
                <div className="flex items-center gap-2">
                  {getActionButtons(role)}
                </div>
              </div>

              <div className={`flex items-center gap-2 text-sm p-3 rounded ${
                role.status === "Nonaktif" ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
              }`}>
                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                  role.status === "Nonaktif" ? 'bg-red-500' : 'bg-blue-500'
                }`}>
                  <span className="text-white text-xs font-bold">i</span>
                </div>
                Perubahan Terbaru: {role.updated_at ? new Date(role.updated_at).toLocaleString("id-ID", { weekday: "long", day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "-"}
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Menampilkan {pagination.from} - {pagination.to} dari {pagination.total} data
            </div>
            <Pagination
              currentPage={pagination.current_page}
              lastPage={pagination.last_page}
              onPageChange={(page) => setPagination((prev) => ({ ...prev, current_page: page }))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}