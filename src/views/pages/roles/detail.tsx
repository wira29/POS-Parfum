import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Breadcrumb } from "@/views/components/Breadcrumb";
import AddButton from "@/views/components/AddButton";
import { SearchInput } from "@/views/components/SearchInput";
import { Filter } from "@/views/components/Filter";
import { Trash2 } from "lucide-react";
import FilterModal from "@/views/pages/roles/filter";
import { useApiClient } from "@/core/helpers/ApiClient";
import Swal from "sweetalert2";

function EditFieldModal({
  open,
  onClose,
  onSubmit,
  field,
  value,
  loading,
}) {
  const [input, setInput] = useState(value || "");

  useEffect(() => {
    setInput(value || "");
  }, [value, open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(input, onClose);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <form
        className="bg-white rounded-xl shadow-lg w-full max-w-[400px]"
        onSubmit={handleSubmit}
      >
        <div className="px-6 pt-6 pb-3">
          <h2 className="text-lg font-bold text-gray-900">
            Edit {field === "name" ? "Nama Role" : "Guard Name"}
          </h2>
        </div>
        <div className="border-b border-gray-200"></div>
        <div className="px-6 py-4">
          {field === "name" && (
            <div className="mb-4">
              <label className="block text-sm text-gray-700 mb-1">Nama Role</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Nama role"
                value={input}
                onChange={e => setInput(e.target.value)}
                required
              />
            </div>
          )}
          {field === "guardName" && (
            <div className="mb-4">
              <label className="block text-sm text-gray-700 mb-1">Guard Name</label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
                value={input}
                onChange={e => setInput(e.target.value)}
              >
                <option value="web">web</option>
                <option value="api">api</option>
              </select>
            </div>
          )}
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
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
}

export default function RoleDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const apiClient = useApiClient();

  const [role, setRole] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 8;

  const [showFilter, setShowFilter] = useState(false);
  const [nameValue, setNameValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [statusValue, setStatusValue] = useState("");
  const [joinFrom, setJoinFrom] = useState("");
  const [joinTo, setJoinTo] = useState("");

  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [statusLoading, setStatusLoading] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editField, setEditField] = useState<"name" | "guardName" | null>(null);
  const [editLoading, setEditLoading] = useState(false);

  const [removingUserId, setRemovingUserId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    apiClient.get(`/roles/${id}`)
      .then(res => {
        const data = res.data?.data;
        setRole({
          id: data.id,
          name: data.name,
          description: "",
          createdAt: data.created_at,
          guardName: data.guard_name,
          status: data.status?.toLowerCase() === "aktif" ? "active" : "inactive",
          userCount: data.users_count
        });
        setUsers(data.users || []);
        setTotalItems((data.users || []).length);
        setTotalPages(Math.ceil((data.users || []).length / perPage));
      })
      .catch(() => setError("Gagal mengambil data role"))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!users) return;
    let filteredUsers = users;

    if (searchQuery) {
      filteredUsers = filteredUsers.filter(user =>
        (user.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.email || "").toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (nameValue) {
      filteredUsers = filteredUsers.filter(user =>
        (user.name || "").toLowerCase().includes(nameValue.toLowerCase())
      );
    }
    if (emailValue) {
      filteredUsers = filteredUsers.filter(user =>
        (user.email || "").toLowerCase().includes(emailValue.toLowerCase())
      );
    }
    if (statusValue) {
      filteredUsers = filteredUsers.filter(user =>
        statusValue === "online"
          ? user.last_login
          : !user.last_login
      );
    }
    if (joinFrom) {
      filteredUsers = filteredUsers.filter(user =>
        user.created_at && new Date(user.created_at) >= new Date(joinFrom)
      );
    }
    if (joinTo) {
      filteredUsers = filteredUsers.filter(user =>
        user.created_at && new Date(user.created_at) <= new Date(joinTo)
      );
    }

    setTotalItems(filteredUsers.length);
    setTotalPages(Math.ceil(filteredUsers.length / perPage));
    setCurrentPage(1);
    setUsers(filteredUsers);
  }, [searchQuery, nameValue, emailValue, statusValue, joinFrom, joinTo]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const itemsPerPage = perPage;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = users.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleToggleStatus = async () => {
    if (!role) return;
    const isActive = role.status === "active";
    const confirm = await Swal.fire({
      title: isActive ? "Nonaktifkan Role?" : "Aktifkan Role?",
      text: isActive
        ? "Role akan dinonaktifkan dan tidak dapat digunakan."
        : "Role akan diaktifkan kembali.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: isActive ? "Nonaktifkan" : "Aktifkan",
      cancelButtonText: "Batal",
    });
    if (!confirm.isConfirmed) return;

    setStatusLoading(true);
    try {
      if (isActive) {
        await apiClient.delete(`/roles/${role.id}`);
        setRole((prev) => ({ ...prev, status: "inactive" }));
        Swal.fire("Berhasil", "Role dinonaktifkan.", "success");
      } else {
        await apiClient.post(`/roles/${role.id}/restore`);
        setRole((prev) => ({ ...prev, status: "active" }));
        Swal.fire("Berhasil", "Role diaktifkan.", "success");
      }
    } catch {
      Swal.fire("Gagal", "Terjadi kesalahan saat mengubah status.", "error");
    }
    setStatusLoading(false);
  };

  const handleEditField = async (value: string, closeModal: () => void) => {
    if (!role || !editField) return;
    setEditLoading(true);
    try {
      const payload =
        editField === "name"
          ? { name: value, guard_name: role.guardName }
          : { name: role.name, guard_name: value };
      const res = await apiClient.put(`/roles/${role.id}`, payload);
      setRole((prev) => ({
        ...prev,
        ...(editField === "name"
          ? { name: res.data.data.name }
          : { guardName: res.data.data.guard_name }),
      }));
      Swal.fire("Berhasil", "Data berhasil diubah.", "success");
      closeModal();
    } catch {
      Swal.fire("Gagal", "Gagal mengubah data.", "error");
    }
    setEditLoading(false);
  };

  const handleRemoveUserFromRole = async (userId: string) => {
    if (!role?.id) return;
    const confirm = await Swal.fire({
      title: "Hapus User dari Role?",
      text: "User akan dihapus dari role ini. Lanjutkan?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    });
    if (!confirm.isConfirmed) return;

    setRemovingUserId(userId);
    try {
      await apiClient.delete(`/roles/${role.id}/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setTotalItems((prev) => prev - 1);
      setTotalPages((prev) => Math.ceil((users.length - 1) / perPage));
      Swal.fire("Berhasil", "User berhasil dihapus dari role.", "success");
    } catch {
      Swal.fire("Gagal", "Gagal menghapus user dari role.", "error");
    }
    setRemovingUserId(null);
  };

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb
        title="Detail Role"
        desc="Kelola detail role yang ada di sistem Anda."
      />

      <EditFieldModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditField(null);
        }}
        onSubmit={handleEditField}
        field={editField}
        value={editField === "name" ? role?.name : role?.guardName}
        loading={editLoading}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-gray-600 text-sm font-medium">Nama Role</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">{role?.name}</p>
              <p className="text-xs text-gray-500 mt-2">{role?.description}</p>
            </div>
          </div>
          <button
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-600"
            onClick={() => {
              setEditField("name");
              setEditModalOpen(true);
            }}
          >
            Edit
          </button>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-gray-600 text-sm font-medium">Tanggal Dibuat</h3>
              <p className="text-lg font-bold text-gray-900 mt-1">{formatDate(role?.createdAt || '')}</p>
              <p className="text-xs text-gray-500 mt-2">Tanggal dibuat role tidak dapat diubah</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-gray-600 text-sm font-medium">Guard Name</h3>
              <p className="text-lg font-bold text-gray-900 mt-1">{role?.guardName}</p>
            </div>
          </div>
          <button
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-600"
            onClick={() => {
              setEditField("guardName");
              setEditModalOpen(true);
            }}
          >
            Edit
          </button>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-gray-600 text-sm font-medium">Status</h3>
              <p className="text-lg font-bold text-gray-900 mt-1 capitalize">{role?.status}</p>
              <p className="text-xs text-gray-500 mt-2">Terakhir dinonaktifkan tanggal 12 Juni 2019 | 22:03</p>
            </div>
          </div>
          <div className="flex items-center">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={role?.status === 'active'}
                onChange={handleToggleStatus}
                disabled={statusLoading}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
            <span className="ml-3 text-sm text-gray-700">
              {statusLoading
                ? "Memproses..."
                : role?.status === "active"
                  ? "Aktif"
                  : "Nonaktif"}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{totalItems} User Tergabung</h2>
            </div>
            <div className="flex gap-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                onClick={() => nav("/roles")}
              >
                <span>Kembali</span>
              </button>
              <AddButton to="/users/create">Tambah User</AddButton>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 w-full sm:w-auto max-w-lg">
            <SearchInput
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
            <Filter onClick={() => setShowFilter(true)} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Login Terakhir</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Masuk</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.last_login
                      ? new Date(user.last_login).toLocaleString("id-ID", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                      : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.created_at
                      ? new Date(user.created_at).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })
                      : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${user.last_login
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                      }`}>
                      {user.last_login ? 'Online' : 'Offline'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      className="text-red-600 hover:text-red-800"
                      disabled={removingUserId === user.id}
                      onClick={() => handleRemoveUserFromRole(user.id)}
                      title="Hapus user dari role"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Menampilkan {startIndex + 1} dari {users.length} User
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 text-sm border rounded-md ${currentPage === page
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      <FilterModal
        open={showFilter}
        onClose={() => setShowFilter(false)}
        onApply={() => setShowFilter(false)}
        onReset={() => {
          setNameValue("");
          setEmailValue("");
          setStatusValue("");
          setJoinFrom("");
          setJoinTo("");
        }}
        nameValue={nameValue}
        setNameValue={setNameValue}
        emailValue={emailValue}
        setEmailValue={setEmailValue}
        statusValue={statusValue}
        setStatusValue={setStatusValue}
        joinFrom={joinFrom}
        setJoinFrom={setJoinFrom}
        joinTo={joinTo}
        setJoinTo={setJoinTo}
      />
    </div>
  );
}