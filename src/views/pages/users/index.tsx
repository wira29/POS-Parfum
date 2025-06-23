import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiMoreHorizontal, FiMoreVertical } from "react-icons/fi";
import { Breadcrumb } from "@/views/components/Breadcrumb";
import { SearchInput } from "@/views/components/SearchInput";
import { useApiClient } from "@/core/helpers/ApiClient";
import Swal from "sweetalert2";
import { X } from "lucide-react";
import { ReactNode } from "react";
import { Filter } from "@/views/components/Filter";

// Modal Filter
const UserFilterModal = ({
  open,
  onClose,
  selectedRole,
  setSelectedRole,
  availableRoles,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}: any) => {
  if (!open) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={handleBackdropClick}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Filter Pengguna</h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-6 h-6 cursor-pointer" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Role</option>
              {availableRoles.map((role: string, i: number) => (
                <option key={i} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Mulai</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Akhir</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 p-4 border-t border-gray-200">
          <button
            onClick={() => {
              setSelectedRole("");
              setStartDate("");
              setEndDate("");
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

// Main Page
type User = {
  [x: string]: ReactNode;
  id: number;
  name: string;
  email: string;
  role: string;
  image: string;
  created_at: string;
  roles?: { name: string }[];
};

export default function UserPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpenId, setDropdownOpenId] = useState<number | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    links: [],
  });

  // filter states
  const [showFilter, setShowFilter] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const apiClient = useApiClient();

  const fetchUsers = async (page = 1, customUrl?: string) => {
    setLoading(true);
    try {
      const response = customUrl
        ? await apiClient.get(customUrl)
        : await apiClient.get(`/users?page=${page}&per_page=8`);
      setUsers(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Gagal mengambil data pengguna:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1);
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchSearch = `${user.name} ${user.email}`.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = selectedRole ? user.roles?.some((r) => r.name === selectedRole) : true;
    const createdDate = new Date(user.created_at);
    const matchStartDate = startDate ? createdDate >= new Date(startDate) : true;
    const matchEndDate = endDate ? createdDate <= new Date(endDate) : true;
    return matchSearch && matchRole && matchStartDate && matchEndDate;
  });

  const handleDropdownToggle = (id: number) => {
    setDropdownOpenId(dropdownOpenId === id ? null : id);
  };

  const handleDetail = (user: User) => {
    navigate(`/users/${user.id}/detail`);
  };

  const handleEdit = (user: User) => {
    navigate(`/users/${user.id}/edit`);
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

  const deleteUser = async (id: number) => {
    try {
      await apiClient.delete(`/users/${id}`);
      Swal.fire("Terhapus!", "User berhasil dihapus.", "success");
      fetchUsers(1);
    } catch (error) {
      Swal.fire("Gagal!", "Gagal menghapus User.", "error");
    }
  };

  const confirmDelete = (id: number) => {
    Swal.fire({
      title: "Apakah anda yakin?",
      text: "Data User akan dihapus!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) deleteUser(id);
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const goToPage = (url: string | null) => {
    if (!url) return;
    fetchUsers(1, url);
  };

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb
        title="Daftar Pengguna"
        desc="Kelola daftar akun pengguna pada sistem."
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div className="flex items-center gap-2 mb-4 w-full sm:w-auto max-w-lg">
          <SearchInput value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          <Filter onClick={() => setShowFilter(true)} />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 px-4 py-2 rounded-lg font-medium"
            onClick={() => navigate("/users/create")}
          >
            <FiPlus /> Tambah Akun
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-gray-600">Memuat data pengguna...</div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-gray-500">Tidak ada pengguna ditemukan.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="bg-white rounded-lg shadow p-4 flex flex-col justify-between items-center relative"
              >
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                    <img
                      src={"/public/images/profile/user-1.jpg"}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div ref={dropdownOpenId === user.id ? dropdownRef : null}>
                    <button
                      className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100"
                      onClick={() => handleDropdownToggle(user.id)}
                    >
                      <FiMoreHorizontal size={22} />
                    </button>
                    {dropdownOpenId === user.id && (
                      <div className="absolute right-2 top-10 w-36 bg-white border rounded shadow-lg z-20">
                        <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm" onClick={() => { setDropdownOpenId(null); handleDetail(user); }}>
                          Detail
                        </button>
                        <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm" onClick={() => { setDropdownOpenId(null); handleEdit(user); }}>
                          Edit
                        </button>
                        <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600" onClick={() => { setDropdownOpenId(null); confirmDelete(user.id); }}>
                          Hapus
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-center mt-4">
                  <h3 className="font-medium">{user.name}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <span className="px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded-full">
                    {user.roles?.[0]?.name || "Tidak ada role"}
                  </span>
                </div>
                <div className="flex justify-between w-full mt-4 ml-5 mr-5">
                  <div className="flex flex-col">
                    <p className="text-sm font-semibold text-gray-800">Bergabung pada</p>
                    <p className="text-sm text-gray-500">{formatDate(user.created_at)}</p>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm font-semibold text-gray-800">Status</p>
                    <p className="px-3 py-1 text-xs bg-green-100 text-green-600 rounded-full">Aktif</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end mt-6 gap-2 flex-wrap">
            {pagination.links.map((link: any, index: number) => (
              <button
                key={`${link.label}-${index}`}
                disabled={!link.url}
                onClick={() => goToPage(link.url)}
                className={`px-3 py-1 border rounded text-sm ${link.active ? "bg-blue-600 text-white" : "hover:bg-gray-100 text-gray-700"
                  } ${!link.url ? "cursor-not-allowed opacity-50" : ""}`}
                dangerouslySetInnerHTML={{ __html: link.label }}
              />
            ))}
          </div>
        </>
      )}

      <UserFilterModal
        open={showFilter}
        onClose={() => setShowFilter(false)}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        availableRoles={Array.from(new Set(users.flatMap(u => u.roles?.map(r => r.name) || [])))}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
      />
    </div>
  );
}
